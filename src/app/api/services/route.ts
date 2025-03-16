import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const services = await prisma.services.findMany();
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const { service, value } = await request.json();

  const newService = await prisma.services.create({
    data: {
      service,
      value,
    },
  });

  return NextResponse.json(newService);
}