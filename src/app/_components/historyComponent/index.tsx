import { Client } from "@/app/(pages)/admin/dashboard/dashboardTabs";
import { useEffect, useState } from "react";

export const History = () => {
  const [history, setHistory] = useState<Client[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL as string

  const fetchHistory = async () => {
    const response = await fetch(`${API_URL}/api/history`);
    const data = await response.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full">
      {history.length === 0 ? (
        <p className="text-zinc-50 text-center">Nenhum corte concluído no momento.</p>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto custom-scrollbar bg-zinc-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-zinc-600 sticky top-0">
              <tr>
                <th className="p-3 text-zinc-50 font-semibold">Nome</th>
                <th className="p-3 text-zinc-50 font-semibold">Data</th>
                <th className="p-3 text-zinc-50 font-semibold">Serviços</th>
                <th className="p-3 text-zinc-50 font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody>
              {history.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/90 transition-all duration-200"
                >
                  <td className="p-3 text-zinc-50">{client.name}</td>
                  <td className="p-3 text-zinc-50">
                    {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-3 text-zinc-50">{client.services}</td>
                  <td className="p-3 text-emerald-600">R$ {client.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};