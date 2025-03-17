"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardTabs from "./dashboardTabs";
import BalanceGrid from "./BalanceGrid";
import { Grid } from "@/app/_components/grid";
import { ServicesManager } from "@/app/_components/servicesManager";

export default function AdminDashboard() {
  const [queueCount, setQueueCount] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null); 
  const [time, setTime] = useState(0)
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => parseFloat((prevTime + 0.01).toFixed(2)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.log("Nenhum token encontrado. Redirecionando para /admin/login");
      router.push("/admin/login");
      return;
    }
    fetch("/api/admin/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid) {
          console.log("Token inválido ou expirado. Redirecionando para /admin/login");
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
        } else {
          setIsValid(true);
          // Busca os dados do dashboard
          fetch("/api/admin/dashboard-data")
            .then((res) => res.json())
            .then((data) => {
              setQueueCount(data.queueCount);
            })
            .catch((error) => console.error("Erro ao buscar dados do dashboard:", error));
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar o token:", error);
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      });
  }, [router, time]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (isValid === null) {
    return <div className="w-full min-h-screen bg-zinc-900 flex items-center justify-center text-zinc-50">Verificando...</div>;
  }

  if (!isValid) {
    return null; // O redirecionamento já cuida disso
  }

  return (
    <div className="bg-zinc-800 text-zinc-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 p-4 shadow-md">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Barber Dashboard</h1>
          <button onClick={handleLogout} className="text-zinc-400 hover:text-zinc-100 transition-all duration-200 cursor-pointer">
            Sair
          </button>
        </div>
      </header>

      {/* Main */}
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

        {/* Abas */}
        <div className="w-full max-h-[70vh] overflow-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
          <DashboardTabs />
        </div>
      </main>

      <ServicesManager />
    </div>
  );
}