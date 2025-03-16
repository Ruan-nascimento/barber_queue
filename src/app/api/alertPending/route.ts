import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const queue = await prisma.client.count({ where: { status: "pending" } });
  return NextResponse.json(queue);
}