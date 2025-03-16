import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.client.update({
    where: { id: params.id },
    data: { status: "queue" },
  });

  return NextResponse.json({ success: true });
}