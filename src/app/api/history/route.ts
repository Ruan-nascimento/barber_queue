import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const history = await prisma.client.findMany({
    where: { status: "completed" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(history);
}