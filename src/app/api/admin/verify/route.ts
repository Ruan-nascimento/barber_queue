import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; 

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token não fornecido" }, { status: 400 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ valid: true }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ valid: false, error: "Token inválido ou expirado" }, { status: 401 });
    }
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    return NextResponse.json({ valid: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}