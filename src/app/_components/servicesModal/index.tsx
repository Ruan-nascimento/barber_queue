"use client";
import { useState, useEffect } from "react";

type Service = {
  id: string;
  service: string;
  value: number;
};

export const ServicesModal = ({ onClose }: { onClose: () => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceValue, setNewServiceValue] = useState("");

  const fetchServices = async () => {
    const response = await fetch("/api/services");
    const data = await response.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async () => {
    if (!newServiceName || !newServiceValue) return;

    const response = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service: newServiceName,
        value: parseFloat(newServiceValue),
      }),
    });

    if (response.ok) {
      setNewServiceName("");
      setNewServiceValue("");
      await fetchServices();
    }
  };

  const handleDeleteService = async (id: string) => {
    const response = await fetch(`/api/services/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await fetchServices();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-100 hover:text-red-500 transition-all duration-200 cursor-pointer text-2xl"
        >
          X
        </button>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">Gerenciar Serviços</h2>
        <div className="flex flex-col gap-4">
          {/* Formulário para adicionar serviço */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Nome do serviço"
              className="w-full p-3 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <input
              type="number"
              value={newServiceValue}
              onChange={(e) => setNewServiceValue(e.target.value)}
              placeholder="Valor (R$)"
              step="0.01"
              className="w-full p-3 bg-zinc-700 text-zinc-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <button
              onClick={handleSaveService}
              className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 cursor-pointer text-lg"
            >
              Salvar
            </button>
          </div>

          {/* Lista de Serviços */}
          <div className="mt-4 max-h-[50vh] overflow-auto custom-scrollbar">
            {services.length === 0 ? (
              <p className="text-zinc-300">Nenhum serviço cadastrado.</p>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-2 border-b border-zinc-600 hover:bg-zinc-800 transition-all duration-200"
                >
                  <span className="text-zinc-100">
                    {service.service} - R$ {service.value.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};