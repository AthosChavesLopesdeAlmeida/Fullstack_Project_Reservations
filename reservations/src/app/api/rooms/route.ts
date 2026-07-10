import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
  const rooms = await prisma.room.findMany()
  return NextResponse.json(rooms)
}