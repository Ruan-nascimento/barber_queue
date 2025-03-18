import { Client } from "@/app/(pages)/admin/dashboard/dashboardTabs";
import { useEffect, useState } from "react";
import Error from "next/error";
import { ErrorModal } from "../error/modal";

export const Pending = () => {
  const [pending, setPending] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string

  const fetchPending = async () => {
    const response = await fetch(`${API_URL}/api/pending`);
    const data = await response.json();
    setPending(data);
  };

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id: any) => {
    try {
      const response = await fetch(`${API_URL}/api/accept/${id}`, {
        method: "POST",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (response.ok) {
        await fetchPending();
      } else {
        setError(`Erro ao aceitar cliente: ${response.status} - ${data.error || "Desconhecido"}`);
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
    }
  };

  const handleReject = async (id: any) => {
    try {
      const response = await fetch(`${API_URL}/api/rejected/${id}`, {
        method: "DELETE",
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      if (response.ok) {
        await fetchPending();
      } else {
        setError(`Erro ao rejeitar cliente: ${response.status} - ${data.error || "Desconhecido"}`);
      }
    } catch (error: any) {
      setError(`Erro inesperado: ${error.message}`);
    }
  };

  const closeModal = () => {
    setError(null);
  };

  return (
    <section className="w-full">
      {error && <ErrorModal isOpen={!!error} onClose={closeModal} errorMessage={error} />}
      {pending.length === 0 ? (
        <p className="text-zinc-50 text-center">Nenhum pedido pendente no momento.</p>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto custom-scrollbar bg-zinc-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-zinc-600 sticky top-0">
              <tr>
                <th className="p-3 text-zinc-50 font-semibold">Nome</th>
                <th className="p-3 text-zinc-50 font-semibold">Serviços</th>
                <th className="p-3 text-zinc-50 font-semibold">Horário</th>
                <th className="p-3 text-zinc-50 font-semibold">Data</th>
                <th className="p-3 text-zinc-50 font-semibold">Ação</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/90 transition-all duration-200"
                >
                  <td className="p-3 text-zinc-50">{client.name}</td>
                  <td className="p-3 text-zinc-50">{client.services}</td>
                  <td className="p-3 text-zinc-50">
                    {new Date(client.createdAt).toLocaleTimeString("pt-BR")}
                  </td>
                  <td className="p-3 text-zinc-50">
                    {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAccept(client.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 cursor-pointer"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleReject(client.id)}
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