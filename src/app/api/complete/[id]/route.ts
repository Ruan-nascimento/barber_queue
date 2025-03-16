import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const value = Number(formData.get("value"));

  const client = await prisma.client.update({
    where: { id: params.id },
    data: {
      status: "completed",
      total: value,
    },
  });

  return NextResponse.json({ success: true, client });
}