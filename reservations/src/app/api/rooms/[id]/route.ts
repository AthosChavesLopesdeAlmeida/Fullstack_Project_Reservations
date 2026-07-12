import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const { id } = await params

  const room = await prisma.room.findUnique({ where: { id } })

  if (!room) {
    return NextResponse.json({ message: 'Sala não encontrada' }, { status: 404 })
  }

  return NextResponse.json(room)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const existingRoom = await prisma.room.findUnique({ where: { id } })
  if (!existingRoom) {
    return NextResponse.json({ message: 'Sala não encontrada' }, { status: 404 })
  }

  const room = await prisma.room.update({ where: { id }, data: body })
  return NextResponse.json(room)
}

export async function DELETE (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  const { id } = await params

  const existingRoom = await prisma.room.findUnique({ where: { id } })
  if (!existingRoom) {
    return NextResponse.json({ message: 'Sala não encontrada' }, { status: 404 })
  }

  await prisma.room.delete({ where: { id } })

  return NextResponse.json({ message: 'Sala removida com sucesso' }, {status: 200})
}

