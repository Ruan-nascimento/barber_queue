import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: { clientId: string } }) {
  try {

    const { clientId } = context.params;

    const url = request.url;
    const fallbackClientId = url.split("/").pop(); 

    const finalClientId = clientId || fallbackClientId;

    if (!finalClientId) {
      throw new Error("clientId não encontrado nos params ou URL");
    }

    const body = await request.json();
    const { status, total } = body;
    console.log("Body recebido:", { status, total });

    const updatedClient = await prisma.client.update({
      where: { id: finalClientId },
      data: {
        status,
        total,
      },
    });

    console.log("Cliente atualizado:", updatedClient);
    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("Erro na API - Detalhes:", error);
  }
}

export async function DELETE(request: Request, context: { params: { clientId: string } }) {
    try {
        const { clientId } = context.params;

        const url = request.url;
        const fallbackClientId = url.split("/").pop(); 
    
        const finalClientId = clientId || fallbackClientId;
    
        if (!finalClientId) {
          throw new Error("clientId não encontrado nos params ou URL");
        }
    
  
      await prisma.client.delete({
        where: { id: finalClientId },
      });
  
      return NextResponse.json({ message: "Cliente removido com sucesso" }, { status: 200 });
    } catch (error) {
      console.error("Erro na API (DELETE):", error);
      return NextResponse.json({ error: "Erro ao remover o cliente" }, { status: 500 });
    }
  }