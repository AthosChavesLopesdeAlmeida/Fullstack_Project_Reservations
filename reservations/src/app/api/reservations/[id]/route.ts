import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 401 })
  }

  const existingReservation = await prisma.reservation.findUnique({ where: { id } })
  if (!existingReservation) {
    return NextResponse.json({ message: 'Reserva não encontrada' }, { status: 404 })
  }

  if (existingReservation.userId !== user.userId && user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELED' }
  })

  return NextResponse.json(updated, { status: 200 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 401 })
  }

  const existingReservation = await prisma.reservation.findUnique({ where: { id } })
  if (!existingReservation) {
    return NextResponse.json({ message: 'Reserva não encontrada' }, { status: 404 })
  }

  if (existingReservation.userId !== user.userId && user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
  }

  await prisma.reservation.delete({ where: { id } })
  return NextResponse.json({ message: 'Reserva excluída com sucesso' }, { status: 200 })
}