import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const pending = await prisma.client.findMany({
    where: { status: "pending" },
  });
  return NextResponse.json(pending);
}