import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


const ADMIN_PASSWORD = process.env.ADMIN_KEY as string;

const JWT_SECRET = process.env.JWT_SECRET as string; 

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    // Gera o JWT com validade de 1 dia
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar o login:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}