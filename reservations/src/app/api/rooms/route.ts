import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {  
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const rooms = await prisma.room.findMany({where: {isActive: true}})
  return NextResponse.json(rooms)
}

export async function POST (req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const { name, capacity, location, description } = await req.json()

  const room = await prisma.room.create({
    data: { name, capacity, location, description } 
  })

  return NextResponse.json(room, { status: 201 })
}


