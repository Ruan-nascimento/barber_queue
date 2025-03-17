"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as React from "react"; // Importa React pra usar React.use()

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

export default function QueueClient({ params }: { params: Promise<{ id: string }> }) {
  const [queue, setQueue] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  // Desembrulha o params usando React.use()
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const fetchQueue = async () => {
    const response = await fetch("/api/queue");
    const data = await response.json();
    setQueue(data);
  };

  const fetchServices = async () => {
    const response = await fetch("/api/services");
    const data = await response.json();
    setServices(data);
  };

  const leaveQueue = async (id:string) => {
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      console.log("Resposta da API (cancelar):", response.status, responseData);
      if (response.ok) {
  
        if(id) {
          const existingId = localStorage.getItem('currentClientId')
          if(existingId) {
            localStorage.removeItem('currentClientId')
            router.push('/client')
          }
        }
      } else {
        console.error("Erro ao cancelar:", response.status, responseData);
      }
    } catch (error) {
      console.error("Erro na requisição de cancelamento:", error);
    }
  }

  useEffect(() => {
    if (id) {
      const existingId = localStorage.getItem("currentClientId");
      if (!existingId) {
        localStorage.setItem("currentClientId", id);
        console.log(`ID ${id} salvo no localStorage, pois não havia um anterior.`);
      } else {
        console.log(`ID ${existingId} já existe no localStorage. Nenhum novo ID salvo.`);
      }

      fetchQueue();
      fetchServices();
      const interval = setInterval(fetchQueue, 1000);
      return () => {
        clearInterval(interval);
      };
    } else {
      console.error("id não definido!");
      router.push("/client"); // Redireciona pra /client se o id não estiver definido
    }
  }, [id, router]);

  // Verifica se há um currentClientId no localStorage, se não, redireciona pra /client
  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (!currentId) {
      console.log("Nenhum ID no localStorage. Redirecionando para /client");
      router.push(`/client`);
    }
  }, [router]);

  const calculateTotal = (clientServices: string) => {
    const serviceList = clientServices.split(",").map((s) => s.trim());
    const total = serviceList.reduce((sum, serviceName) => {
      const service = services.find((s) => s.service.toLowerCase() === serviceName.toLowerCase());
      return sum + (service?.value ?? 20);
    }, 0);
    return total;
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await fetch(`/api/queue/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();
      console.log("Resposta da API (cancelar):", response.status, responseData);
      if (response.ok) {
        // Remove o id do localStorage ao cancelar
        localStorage.removeItem("currentClientId");
        console.log(`ID ${id} removido do localStorage.`);
        router.push("/client"); // Volta pra fila geral
      } else {
        console.error("Erro ao cancelar:", response.status, responseData);
      }
    } catch (error) {
      console.error("Erro na requisição de cancelamento:", error);
    }
  };

  const currentClient = queue.find((client) => client.id === id);
  const clientPosition = queue.findIndex((client) => client.id === id) + 1;
  const peopleAhead = clientPosition > 0 ? clientPosition - 1 : 0;

  return (
    <section className="w-full min-h-screen bg-zinc-900 p-6">
      {/* Textos Personalizados e Botão Cancelar */}
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

        <div
        className="flex flex-col items-center"
        >
          <p className="text-zinc-50 text-center mb-6">
            {id ? "Você não está na fila no momento. Aguarde o Barbeiro Aceitar seu Pedido" : "Acompanhe a fila abaixo."}
          </p>

          {
            id ? (
              <button
          className="mt-4 mb-4 w-16 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200 cursor-pointer"
          onClick={() => leaveQueue(id)}>
            Sair
          </button>
            ) :
            ''
          }
        </div>
        
      )}

      {/* Tabela da Fila */}
      {queue.length === 0 ? (
        <p className="text-zinc-50 text-center">Ninguém na fila no momento.</p>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto custom-scrollbar bg-zinc-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-zinc-600 sticky top-0">
              <tr><th className="p-3 text-zinc-50 font-semibold">Posição</th><th className="p-3 text-zinc-50 font-semibold">Nome</th><th className="p-3 text-zinc-50 font-semibold">Telefone</th><th className="p-3 text-zinc-50 font-semibold">Serviços</th><th className="p-3 text-zinc-50 font-semibold">Valor</th></tr>
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