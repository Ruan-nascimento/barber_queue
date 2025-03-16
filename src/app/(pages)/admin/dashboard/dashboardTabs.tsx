"use client";
import { History } from "@/app/_components/historyComponent";
import { Pending } from "@/app/_components/pendingComponent";
import { PendingCount } from "@/app/_components/pendingCount";
import { Queue } from "@/app/_components/queueComponent";
import { useState } from "react";

export type Client = {
  id: number;
  name: string;
  phone: string;
  services: string; // JSON string
  status: string;
  total: number;
  createdAt: string;
};

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<"queue" | "pending" | "history">("queue");

  return (
    <div className="w-full max-w-full mx-auto">
      {/* Navegação */}
      <nav className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setActiveTab("queue")}
          className={`px-4 py-2 rounded-lg cursor-pointer font-semibold mt-2 transition-all duration-200 ${
            activeTab === "queue"
              ? "bg-blue-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
          }`}
        >
          Fila Atual
        </button>

        <div className="relative">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg cursor-pointer mt-2 font-semibold transition-all duration-200 ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
            }`}
          >
            Pedidos Pendentes
          </button>
          <PendingCount />
        </div>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg cursor-pointer mt-2 font-semibold transition-all duration-200 ${
            activeTab === "history"
              ? "bg-blue-600 text-white"
              : "bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
          }`}
        >
          Histórico
        </button>
      </nav>

      {/* Conteúdo com scroll personalizado */}
      <div className="w-full max-h-[70vh] overflow-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
        {activeTab === "queue" && <Queue />}
        {activeTab === "pending" && <Pending />}
        {activeTab === "history" && <History />}
      </div>
    </div>
  );
}