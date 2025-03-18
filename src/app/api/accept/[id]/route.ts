import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: { id: any } }
) {
  try {
    const { id } = context.params; // Extraindo o ID corretamente

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é requerido" },
        { status: 400 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id },
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
