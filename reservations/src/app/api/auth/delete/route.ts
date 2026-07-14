import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 401})
  }

  await prisma.user.delete({ where: { id: user.userId } })

  const res = NextResponse.json({message: 'Conta excluída com sucesso'}, {status: 200})
  res.cookies.set('token', '', { maxAge: 0 })
  return res
}