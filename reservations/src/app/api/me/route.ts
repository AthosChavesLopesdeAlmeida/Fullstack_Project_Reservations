import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)
  
  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  if (!userData) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
  }

  return NextResponse.json((userData))
}