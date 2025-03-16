import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "today"; 

  let startDate: Date;
  const endDate = new Date();

  switch (period) {
    case "today":
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0); 
      break;
    case "7days":
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30days":
      startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "6months":
      startDate = new Date(endDate);
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "1year":
      startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(endDate);
      startDate.setHours(0, 0, 0, 0); 
  }

  const balance = await prisma.client.aggregate({
    where: {
      status: "completed",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      total: true,
    },
  });

  return NextResponse.json({ balance: balance._sum.total || 0 });
}