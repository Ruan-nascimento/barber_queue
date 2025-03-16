import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { name, phone, services } = await req.json();

  if (!name || !phone || !services || services.length === 0) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      phone,
      services: JSON.stringify(services),
      status: "pending",
      total: 0,
    },
  });

  return NextResponse.json({ 
    message: "Agendamento solicitado com sucesso",
    clientId: client.id 
  });
}