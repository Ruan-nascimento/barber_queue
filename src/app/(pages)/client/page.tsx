"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  service: string;
  value: number;
};

export default function ClientPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const router = useRouter();

  // Buscar serviços cadastrados
  const fetchServices = async () => {
    const response = await fetch("/api/services");
    const data = await response.json();
    setAvailableServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceChange = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Enviando agendamento...");

    try {
      const response = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, services }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Agendamento solicitado! Redirecionando para a fila...");
        router.push(`/queue?clientId=${data.clientId}`);
      } else {
        setMessage(data.error || "Erro ao enviar o agendamento.");
      }
    } catch (error) {
      setMessage("Erro na requisição de agendamento.");
      console.error("Erro no handleSubmit:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 text-zinc-100 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-zinc-900 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Agendar Serviço</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Seu nome"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-200">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full p-2 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(XX) XXXXX-XXXX"
              required
            />
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-200 mb-2">Serviços</p>
            <div className="space-y-2">
              {availableServices.length === 0 ? (
                <p className="text-zinc-300">Nenhum serviço disponível no momento.</p>
              ) : (
                availableServices.map((service) => (
                  <label key={service.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={services.includes(service.service)}
                      onChange={() => handleServiceChange(service.service)}
                      className="h-4 w-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-zinc-100">
                      {service.service} - R$ {service.value.toFixed(2)}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-200 cursor-pointer"
          >
            Agendar
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-zinc-400">{message}</p>
        )}
      </div>
    </div>
  );
}