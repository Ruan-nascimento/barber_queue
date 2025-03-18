import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(request: Request, context: { params: any }) {
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

export async function DELETE(request: Request, context: { params: any }) {
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

  export async function GET(request: Request, { params }: { params: any }) {
    const { id } = params;
  
    try {
      const client = await prisma.client.findUnique({
        where: { id },
      });
  
      if (!client) {
        return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
      }
  
      return NextResponse.json(client, { status: 200 });
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }