import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, generateToken } from "@/lib/auth";

export async function POST (req: NextRequest) {
  const { email, password } = await req.json()
  
  if (!email || !password) {
    return NextResponse.json({message: 'O email e a senha são obrigatórios'}, {status: 400})
  }

  const user = await prisma.user.findUnique({where: {email}})
  if (!user) {
    return NextResponse.json({message: 'O usuário não existe'}, {status: 401})
  }

  const passwordIsValid = await verifyPassword(password, user.password)
  if (!passwordIsValid) {
    return NextResponse.json({message: 'A senha é inválida'}, {status: 401})
  }

  const token = generateToken(user.id, user.role)
  const response = NextResponse.json({ message: 'Login realizado com sucesso' }, {status: 200})

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/' 
  })
  return response
}