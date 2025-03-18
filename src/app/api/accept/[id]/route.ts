import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: "ID do cliente é requerido" },
        { status: 400 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { status: "queue" },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error); 
    return NextResponse.json(
      { error: "Erro ao aceitar o cliente" },
      { status: 500 }
    );
  }
}

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
});