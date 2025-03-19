"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ErrorModal } from "@/app/_components/error/modal";

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

type ApiErrorResponse = {
  error?: string;
};

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

export default function QueueClient({ params }: { params: Promise<{ id: string }> }) {
  const [queue, setQueue] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const fetchQueue = async () => {
    const response = await fetch(`${API_URL}/api/queue`);
    const data = await response.json();
    setQueue(data);
  };

  const fetchServices = async () => {
    const response = await fetch(`${API_URL}/api/services`);
    const data = await response.json();
    setServices(data);
  };

  const fetchClientStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/api/queue/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          localStorage.removeItem("currentClientId");
          router.push(`${API_URL}/client`);
        }
        return null;
      }
      const data = await response.json();
      return data.status;
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      return null;
    }
  };

  const leaveQueue = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/queue/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      if (response.ok) {
        if (id) {
          const existingId = localStorage.getItem("currentClientId");
          if (existingId) {
            localStorage.removeItem("currentClientId");
            router.push(`${API_URL}/client`);
          }
        }
      } else {
        setError(`Erro ao cancelar: ${response.status} - ${responseData.error || "Desconhecido"}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    if (id) {
      const existingId = localStorage.getItem("currentClientId");
      if (!existingId) {
        localStorage.setItem("currentClientId", id);
      }

      fetchQueue();
      fetchServices();
      const interval = setInterval(fetchQueue, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      router.push(`${API_URL}/client`);
    }
  }, [id, router]);

  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (!currentId) {
      router.push(`${API_URL}/client`);
    }
  }, [router]);

  useEffect(() => {
    if (!id) return;

    const checkStatus = async () => {
      const status = await fetchClientStatus();
      if (status === "completed") {
        localStorage.removeItem("currentClientId");
        router.push(`${API_URL}/client`);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 500);

    return () => {
      clearInterval(interval);
    };
  }, [id, router]);

  const calculateTotal = (clientServices: string) => {
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

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/queue/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      if (response.ok) {
        localStorage.removeItem("currentClientId");
        router.push(`${API_URL}/client`);
      } else {
        setError(`Erro ao cancelar: ${response.status} - ${responseData.error || "Desconhecido"}`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const currentClient = queue.find((client) => client.id === id);
  const clientPosition = queue.findIndex((client) => client.id === id) + 1;
  const peopleAhead = clientPosition > 0 ? clientPosition - 1 : 0;

  const closeModal = () => {
    setError(null);
  };

  return (
    <section className="w-full min-h-screen bg-zinc-900 p-6">
      {error && <ErrorModal isOpen={!!error} onClose={closeModal} errorMessage={error} />}

      {id && currentClient ? (
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-50">
            Bem-vindo, {currentClient.name}!
          </h2>
          <p className="text-zinc-300 mt-2">
            {peopleAhead === 0
              ? "Você é o próximo na fila!"
              : `Faltam ${peopleAhead} pessoa${peopleAhead > 1 ? "s" : ""} pra sua vez.`}
          </p>
          <button
            onClick={() => handleCancel(id)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 cursor-pointer"
          >
            Sair da Fila
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-zinc-50 text-center mb-6">
            {id ? "Você não está na fila no momento. Aguarde Alguém Aceitar seu Pedido" : "Acompanhe a fila abaixo."}
          </p>
          {id ? (
            <button
              className="mt-4 mb-4 w-16 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 cursor-pointer"
              onClick={() => leaveQueue(id)}
            >
              Sair
            </button>
          ) : (
            ""
          )}
        </div>
      )}

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}