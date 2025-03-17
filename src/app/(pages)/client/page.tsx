"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QueueClient } from "@/app/_components/queueClientComponent";


type Service = {
  id: string;
  service: string;
  value: number;
};

export default function ClientPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "register">("queue");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const router = useRouter();

  const fetchServices = async () => {
    const response = await fetch("/api/services");
    const data = await response.json();
    setAvailableServices(data);
  };


  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (currentId) {
      router.push(`/client/${currentId}`);
    }
  }, [router]);

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
        setMessage("Agendamento solicitado! Redirecionando...");
        setName("");
        setPhone("");
        setServices([]);
        router.push(`/client/${data.clientId}`); // Redireciona pra fila personalizada
      } else {
        setMessage(data.error || "Erro ao enviar o agendamento.");
      }
    } catch (error) {
      setMessage("Erro na requisição de agendamento.");
      console.error("Erro no handleSubmit:", error);
    }
  };

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <nav className="bg-zinc-800 p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-4 py-2 rounded ${
              activeTab === "queue" ? "bg-blue-600" : "bg-zinc-700 hover:bg-zinc-600"
            } transition-all duration-200`}
          >
            Fila
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`px-4 py-2 rounded ${
              activeTab === "register" ? "bg-blue-600" : "bg-zinc-700 hover:bg-zinc-600"
            } transition-all duration-200`}
          >
            Cadastrar na Fila
          </button>

          <button
          className="px-4 py-2 rounded bg-zinc-600 duration-200 ease-in-out border border-transparent hover:border-white hover:bg-zinc-700 cursor-pointer"
          onClick={handleBackToHome}
          >
            Voltar
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="sync">
          {activeTab === "queue" ? (
            <motion.div
              key="queue"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0.5 }}
              transition={{ duration: 0.1 }}
            >
              <QueueClient /> {/* Fila geral */}
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0.5 }}
              transition={{ duration: 0.1 }}
            >
              <div className="max-w-md w-full bg-zinc-900 rounded-lg shadow-md p-6">
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}