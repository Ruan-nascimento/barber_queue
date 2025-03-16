import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.client.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}