import { Suspense } from "react";
import QueueComponent from "./queueComponent";

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-800 text-zinc-100 flex items-center justify-center">Carregando...</div>}>
      <QueueComponent />
    </Suspense>
  );
}