"use client";
import { useState, useEffect } from "react";

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

export const Queue = () => {
  const [queue, setQueue] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Buscar clientes na fila
  const fetchQueue = async () => {
    const response = await fetch("/api/queue");
    const data = await response.json();
    setQueue(data);
  };

  // Buscar serviços cadastrados
  const fetchServices = async () => {
    const response = await fetch("/api/services");
    const data = await response.json();
    setServices(data);
  };

  useEffect(() => {
    fetchQueue();
    fetchServices();
    const interval = setInterval(fetchQueue, 1000); // Atualiza a cada 1s
    return () => clearInterval(interval);
  }, []);


  const [value, setValue] = useState(0)

  // Calcular o total com base nos serviços
  const calculateTotal = (clientServices: string) => {
    const serviceList = clientServices.split(",").map((s) => s.trim());
  
    const total = serviceList.reduce((sum, serviceName) => {
      const service = services.find((s) => s.service.toLowerCase() === serviceName.toLowerCase());
      return sum + (service?.value ?? 20);
    }, 0);
  
    return total;
  };
  

  return (
    <section className="w-full">
      {queue.length === 0 ? (
        <p className="text-zinc-50 text-center">Ninguém na fila no momento.</p>
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto custom-scrollbar bg-zinc-800 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead className="bg-zinc-600 sticky top-0">
              <tr>
                <th className="p-3 text-zinc-50 font-semibold">Nome</th>
                <th className="p-3 text-zinc-50 font-semibold">Telefone</th>
                <th className="p-3 text-zinc-50 font-semibold">Serviços</th>
                <th className="p-3 text-zinc-50 font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((client) => (
                <tr
                  key={client.id}
                  className="border-t border-zinc-700 hover:bg-zinc-800/90 transition-all duration-200"
                >
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
};