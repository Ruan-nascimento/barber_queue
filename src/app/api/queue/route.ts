import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const queue = await prisma.client.findMany({
      where: { status: "queue" },
    });
    return NextResponse.json(queue, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar fila:", error);
    return NextResponse.json({ error: "Erro ao buscar fila" }, { status: 500 });
  }
}