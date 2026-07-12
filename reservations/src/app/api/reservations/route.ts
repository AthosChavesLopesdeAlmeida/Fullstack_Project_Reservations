import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { checkConflict } from "@/lib/reservations";

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 401 })
  }

  const { roomId, startTime, endTime } = await req.json()

  const start = new Date(startTime)
  const end = new Date(endTime)

  if (start >= end) {
    return NextResponse.json({ message: 'Horário inicial deve ser anterior ao horário final' }, { status: 400 })
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } })
  if (!room || !room.isActive) {
    return NextResponse.json({ message: 'Sala não encontrada ou inativa' }, { status: 404 })
  }

  const conflictExists = await checkConflict(roomId, start, end)
  if (conflictExists) {
    return NextResponse.json({ message: 'Horário indisponível para esta sala' }, { status: 409 })
  }

  const reservation = await prisma.reservation.create({
    data: {
      roomId,
      startTime: start,
      endTime: end,
      userId: user.userId
    }
  })

  return NextResponse.json(reservation, { status: 201 })
}

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({ message: 'Acesso negado' }, { status: 401 })
  }

  const reservations = await prisma.reservation.findMany({
    where: user.role === 'ADMIN' ? {} : { userId: user.userId },
    include: { room: { select: { id: true, name: true } } },
    orderBy: { startTime: 'desc' }
  })

  return NextResponse.json(reservations, { status: 200 })
}