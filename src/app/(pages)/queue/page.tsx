"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Client = {
  id: number;
  name: string;
  phone: string;
  services: string;
  status: string;
  total: number;
  createdAt: string;
};

export default function QueuePage() {
  const [queue, setQueue] = useState<Client[]>([]);
  const [notified, setNotified] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = Number(searchParams.get("clientId"));

  const fetchQueue = async () => {
    const response = await fetch("/api/queue");
    const data = await response.json();
    setQueue(data);

    const client = data.find((c: Client) => c.id === clientId);
    if (client) {
      setClientName(client.name);
    }
  };

  const handleCancel = async () => {
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/cancel/${clientId}`, {
        method: "POST",
      });

      if (response.ok) {
        router.push("/"); // Redireciona pra home
      } else {
        const text = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(text);
        } catch {
          errorData = { error: "Resposta inválida da API" };
        }
        const message = errorData.error || `Erro ao cancelar (status: ${response.status})`;
        setErrorMessage(message);
        console.error("Erro ao cancelar:", { status: response.status, text, errorData });
      }
    } catch (error) {
      setErrorMessage("Erro na requisição de cancelamento.");
      console.error("Erro na requisição de cancelamento:", error);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [clientId]);

  useEffect(() => {
    if (queue.length > 0 && queue[0].id === clientId && !notified) {
      setNotified(true);
      setTimeout(() => router.push("/"), 5000); // Redireciona após 5 segundos
    }
  }, [queue, clientId, notified, router]);

  const getMessage = () => {
    if (!clientName) return "Carregando...";
    const position = queue.findIndex((c) => c.id === clientId);
    if (position === 0 && notified) {
      return `Chegou a sua vez, ${clientName}! Dirija-se até a barbearia.`;
    }
    return `Olá, ${clientName}, aguarde sua vez na fila.`;
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-zinc-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Fila Atual</h1>
      
      <p
        className={`mb-6 text-lg p-3 rounded-lg ${
          notified && queue[0]?.id === clientId
            ? "bg-green-600 text-white"
            : "bg-zinc-700 text-zinc-300"
        }`}
      >
        {getMessage()}
      </p>

      {queue.length === 0 ? (
        <p className="text-zinc-50">Nenhum cliente na fila no momento.</p>
      ) : (
        <div className="w-full max-w-2xl bg-zinc-900 rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-zinc-600">
              <tr>
                <th className="p-3 text-zinc-50 font-semibold">Posição</th>
                <th className="p-3 text-zinc-50 font-semibold">Nome</th>
                <th className="p-3 text-zinc-50 font-semibold">Serviços</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((client, index) => (
                <tr
                  key={client.id}
                  className={`border-t border-zinc-700 ${
                    client.id === clientId ? "bg-blue-800/50" : "hover:bg-zinc-800/90"
                  } transition-all duration-200`}
                >
                  <td className="p-3 text-zinc-50">{index + 1}</td>
                  <td className="p-3 text-zinc-50">{client.name}</td>
                  <td className="p-3 text-zinc-50">{client.services}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        onClick={handleCancel}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 cursor-pointer"
      >
        Cancelar
      </button>
      {errorMessage && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}
      <p className="mt-4 text-sm text-zinc-400">
        Atualizando automaticamente a cada 5 segundos...
      </p>
    </div>
  );
}