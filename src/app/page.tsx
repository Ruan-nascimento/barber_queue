import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
      <div className="space-y-4 text-center w-[40%] max-w-[400px] h-[30%] flex items-center justify-center flex-col border border-zinc-50 rounded-md shadow-md">
        <h1 className="text-3xl font-bold text-zinc-50">WE Barbearia</h1>
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