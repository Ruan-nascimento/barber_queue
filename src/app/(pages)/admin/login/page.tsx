"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ModalErrorLoginAdmin } from "@/app/_components/modalErrorLoginAdmin";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setShowModal(false);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("adminToken", data.token);
        console.log("Token salvo no localStorage:", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Erro ao fazer login");
        setShowModal(true);
      }
    } catch (error) {
      setError("Erro na requisição de login");
      setShowModal(true);
      console.error("Erro no handleSubmit:", error);
    }
  };

  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (currentId) {
      console.log(`ID encontrado no localStorage: ${currentId}. Redirecionando para /client/${currentId}`);
      router.push(`/client/${currentId}`);
    }
  }, [router]);

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
      <div className="p-6 bg-zinc-700 rounded-lg shadow-lg transform transition-all duration-300">
        <h2 className="text-2xl font-bold text-zinc-50 mb-4 text-center">Login Admin</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-zinc-300 p-2 w-full text-zinc-50 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder:text-zinc-50 placeholder:opacity-50"
          placeholder="Digite a senha"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white cursor-pointer p-2 rounded hover:bg-blue-700 active:bg-blue-800 transform transition-all duration-200 hover:scale-105"
        >
          Entrar
        </button>

        <button
        onClick={handleBackToHome}
        className="w-full mt-4 bg-zinc-600 text-white border-transparent border cursor-pointer p-2 rounded hover:bg-zinc-700 hover:border-white active:bg-blue-800 transform transition-all duration-200 hover:scale-105"
        >
          Voltar
        </button>
      </div>

      {showModal && (
        <ModalErrorLoginAdmin
          router={router}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}