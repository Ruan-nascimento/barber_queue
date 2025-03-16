"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ModalErrorLoginAdmin } from "@/app/_components/modalErrorLoginAdmin";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const ADMIN_PASSWORD = "barber123";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      router.push("/admin/dashboard");
    } else {
      setShowModal(true);
    }
  };

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

// Animação personalizada no Tailwind (adicione ao global.css ou tailwind.config.ts)