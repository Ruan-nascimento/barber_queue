"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTabs from "./dashboardTabs";
import BalanceGrid from "./BalanceGrid";
import { Grid } from "@/app/_components/grid";
import { ServicesManager } from "@/app/_components/servicesManager";
import { ErrorModal } from "@/app/_components/error/modal";

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

export default function AdminDashboard() {
  const [queueCount, setQueueCount] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null); 
  const [time, setTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => parseFloat((prevTime + 0.01).toFixed(2)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push(`${API_URL}/admin/login`);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/verify-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(`Erro ao verificar token: ${response.status} - ${data.error || "Desconhecido"}`);
        }
        if (!data.valid) {
          localStorage.removeItem("adminToken");
          router.push(`${API_URL}/admin/login`);
        } else {
          setIsValid(true);

          const dashboardResponse = await fetch(`${API_URL}/api/admin/dashboard-data`);
          const dashboardData = await dashboardResponse.json();
          if (!dashboardResponse.ok) {
            throw new Error(`Erro ao buscar dados do dashboard: ${dashboardResponse.status} - ${dashboardData.error || "Desconhecido"}`);
          }
          setQueueCount(dashboardData.queueCount);
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err));
        localStorage.removeItem("adminToken");
        router.push(`${API_URL}/admin/login`);
      }
    };

    verifyToken();
  }, [router, time]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push(`${API_URL}/admin/login`);
  };

  const closeModal = () => {
    setError(null);
  };

  if (isValid === null) {
    return <div className="w-full min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-50">Carregando...</div>;
  }

  if (!isValid) {
    return null; 
  }

  return (
    <div className="bg-zinc-800 text-zinc-100 min-h-screen flex flex-col">
      <header className="bg-zinc-900 p-4 shadow-md">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-zinc-100 transition-all duration-200 cursor-pointer">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <BalanceGrid />
          <Grid>
            <h2 className="text-lg font-semibold text-zinc-200">Pessoas na Fila</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {queueCount !== null ? queueCount : "..."}
            </p>
          </Grid>
        </div>

        <div className="w-full max-h-[70vh] overflow-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
          <DashboardTabs />
        </div>
      </main>

      <ServicesManager />
      {error && <ErrorModal isOpen={!!error} onClose={closeModal} errorMessage={error} />}
    </div>
  );
}