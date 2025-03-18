"use client";
import { useState, useEffect } from "react";
import { ErrorModal } from "../error/modal";

type Client = {
  id: string;
  name: string;
  phone: string;
  services: string;
  status: string;
  total: number;
};

type Service = {
  id: string;
  service: string;
  value: number;
};

interface ApiErrorResponse {
  error?: string;
}
interface ErrorWithMessage {
  message: string;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ErrorWithMessage).message === "string"
  );
};

const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return "Erro desconhecido";
};

export const Queue = () => {
  const [queue, setQueue] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const fetchQueue = async () => {
    try {
      const response = await fetch(`${API_URL}/api/queue`);
      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        throw new Error(`Erro ao buscar fila: ${response.status} - ${data.error || "Desconhecido"}`);
      }
      const data: Client[] = await response.json();
      setQueue(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`);
      if (!response.ok) {
        const data: ApiErrorResponse = await response.json();
        throw new Error(`Erro ao buscar serviços: ${response.status} - ${data.error || "Desconhecido"}`);
      }
      const data: Service[] = await response.json();
      setServices(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchQueue();
    fetchServices();
    const interval = setInterval(fetchQueue, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotal = (clientServices: string): number => {
    const serviceList = clientServices.split(",").map((s) => s.trim().replace(/[\[\]'""]/g, ""));

    const total = serviceList.reduce((sum, serviceName) => {
      const service = services.find((s) => {
        const serviceMatch = s.service.toLowerCase() === serviceName.toLowerCase();
        return serviceMatch;
      });
      return sum + (service?.value ?? 0);
    }, 0);
    return total;
  };

  const handleComplete = async (clientId: string, clientServices: string) => {
    const total = calculateTotal(clientServices);
    try {
      const response = await fetch(`${API_URL}/api/queue/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          total,
        }),
      });

      const responseData: ApiErrorResponse = await response.json();
      if (response.ok) {
        fetchQueue();
      } else {
        throw new Error(`Erro ao marcar como concluído: ${response.status} - ${responseData.error || "Desconhecido"}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = async (clientId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/queue/${clientId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData: ApiErrorResponse = await response.json();
      if (response.ok) {
        fetchQueue();
      } else {
        throw new Error(`Erro ao cancelar: ${response.status} - ${responseData.error || "Desconhecido"}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const closeModal = () => {
    setError(null);
  };

  return (
    <section className="w-full">
      {error && <ErrorModal isOpen={!!error} onClose={closeModal} errorMessage={error} />}
      {queue.length === 0 ? (
        <p className="text-zinc-50 text-center">Ninguém na fila no momento.</p>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto custom-scrollbar bg-zinc-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-zinc-600 sticky top-0">
              <tr>
                <th className="p-3 text-zinc-50 font-semibold">Posição</th>
                <th className="p-3 text-zinc-50 font-semibold">Nome</th>
                <th className="p-3 text-zinc-50 font-semibold">Telefone</th>
                <th className="p-3 text-zinc-50 font-semibold">Serviços</th>
                <th className="p-3 text-zinc-50 font-semibold">Valor</th>
                <th className="p-3 text-zinc-50 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((client, index) => (
                <tr
                  key={client.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/90 transition-all duration-200"
                >
                  <td className="p-3 text-zinc-50">{index + 1}º</td>
                  <td className="p-3 text-zinc-50">{client.name}</td>
                  <td className="p-3 text-zinc-50">{client.phone}</td>
                  <td className="p-3 text-zinc-50">{client.services}</td>
                  <td className="p-3 text-emerald-600">
                    R$ {calculateTotal(client.services).toFixed(2)}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleComplete(client.id, client.services)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 cursor-pointer"
                    >
                      Concluído
                    </button>
                    <button
                      onClick={() => handleCancel(client.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 cursor-pointer"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};