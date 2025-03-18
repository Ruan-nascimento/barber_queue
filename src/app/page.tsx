"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorModal } from "./_components/error/modal";

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

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

  useEffect(() => {
    const currentId = localStorage.getItem("currentClientId");
    if (currentId) {
      router.push(`${API_URL}/client/${currentId}`);
    }

    const token = localStorage.getItem("adminToken");
    if (token) {
      fetch(`${API_URL}/api/admin/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            router.push(`${API_URL}/admin/dashboard`);
          } else {
            localStorage.removeItem("adminToken");
          }
        })
        .catch((error) => {
          setError(getErrorMessage(error));
          localStorage.removeItem("adminToken");
        });
    }
  }, [router]);

  const closeModal = () => {
    setError(null);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
      {error && <ErrorModal isOpen={!!error} onClose={closeModal} errorMessage={error} />}
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