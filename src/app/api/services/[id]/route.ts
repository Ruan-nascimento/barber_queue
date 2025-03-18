import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: any }) {
  const id = params.id;

  await prisma.services.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}