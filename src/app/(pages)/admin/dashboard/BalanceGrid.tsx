"use client";
import { useState, useEffect } from "react";
import { Grid } from "@/app/_components/grid";

export default function BalanceGrid() {
  const [period, setPeriod] = useState<string>("today");
  const [balance, setBalance] = useState<number>(0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string

  const fetchBalance = async () => {
    const response = await fetch(`${API_URL}/api/balance?period=${period}`);
    const data = await response.json();
    setBalance(data.balance);
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(() => {
        fetchBalance();
      }, 1000);
      return () => clearInterval(interval);
  }, [period]);

  return (
    <Grid>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-zinc-200">Balanço Geral</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-zinc-700 cursor-pointer text-zinc-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Hoje</option>
          <option value="7days">7 Dias</option>
          <option value="30days">30 Dias</option>
          <option value="6months">6 Meses</option>
          <option value="1year">1 Ano</option>
        </select>
      </div>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        R$ {balance.toFixed(2)}
      </p>
    </Grid>
  );
}