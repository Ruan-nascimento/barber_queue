'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (currentId) {
      console.log(`ID encontrado no localStorage: ${currentId}. Redirecionando para /client/${currentId}`);
      router.push(`/client/${currentId}`);
    }

    const token = localStorage.getItem("adminToken");
    if (token) {
      fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            console.log("Token de admin válido. Redirecionando para /admin/dashboard");
            router.push("/admin/dashboard");
          } else {
            console.log("Token de admin inválido ou expirado. Removendo token.");
            localStorage.removeItem("adminToken");
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar o token:", error);
          localStorage.removeItem("adminToken");
        });
    }
  }, [router]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
      <div className="space-y-4 text-center w-[40%] max-w-[400px] h-[30%] flex items-center justify-center flex-col border border-zinc-50 rounded-md shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-zinc-50">Entre</h1>
        <div className="space-x-4">
          <Link href="/admin/login" className="px-4 py-2 bg-blue-600 border border-transparent text-white rounded duration-200 ease-in-out hover:opacity-80 active:border-zinc-50">
            Admin
          </Link>
          <Link href="/client" className="px-4 py-2 bg-green-600 border border-transparent text-white rounded duration-200 ease-in-out hover:opacity-80 active:border-zinc-50">
            Cliente
          </Link>
        </div>
      </div>
    </div>
  );
}