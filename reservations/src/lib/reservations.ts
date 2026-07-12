import { prisma } from "./prisma";

export async function checkConflict (
  roomId: string, 
  startTime: Date, 
  endTime: Date, 
  excludeId?: string
) {
  const conflict = await prisma.reservation.findFirst({where: {
    roomId,
    status: 'CONFIRMED',
    startTime: {lt: endTime},
    endTime: {gt: startTime},
    ...(excludeId ? {id: {not: excludeId}} : {})
  }})
  return conflict !== null
}