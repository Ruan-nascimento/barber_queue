import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const queue = await prisma.client.findMany({
    where: { status: "queue" },
  });
  return NextResponse.json(queue);
}