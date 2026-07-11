import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET as string

export interface TokenPayload {
  userId: string
  role: 'USER' | 'ADMIN'
}

export async function hashPassword (password: string) {
  return await bcrypt.hash(password, 10) 
} 

export async function verifyPassword (password:string, hash: string) {
  return await bcrypt.compare(password, hash)
}

export function generateToken (userId: string, role:TokenPayload['role']) {
  return jwt.sign({userId, role}, JWT_SECRET, {expiresIn: '7d'})
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}