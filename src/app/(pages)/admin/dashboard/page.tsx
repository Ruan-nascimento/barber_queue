import { PrismaClient } from "@prisma/client";
import DashboardTabs from "./dashboardTabs";
import BalanceGrid from "./BalanceGrid";
import { Grid } from "@/app/_components/grid";
import { ServicesManager } from "@/app/_components/servicesManager";


const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const queueCount = await prisma.client.count({ where: { status: "queue" } });

  return (
    <div className="bg-zinc-800 text-zinc-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 p-4 shadow-md">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Barber Dashboard</h1>
          <button className="text-zinc-400 hover:text-zinc-100 transition-all duration-200 cursor-pointer">
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
            <p className="text-3xl font-bold text-blue-600 mt-2">{queueCount}</p>
          </Grid>
        </div>

        {/* Abas */}
        <div className="w-full max-h-[70vh] overflow-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 scrollbar-thumb-rounded">
          <DashboardTabs />
        </div>
      </main>

      <ServicesManager/>
    </div>
  );
}