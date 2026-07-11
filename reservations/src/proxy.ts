// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function proxy(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const user = token ? verifyToken(token) : null

  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/rooms') &&
    ['POST', 'PUT', 'DELETE'].includes(req.method)

  // Rotas de página admin: sem login ou sem role ADMIN -> redireciona
  if (isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Rotas de API admin: sem login ou sem role ADMIN -> 401/403
  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Acesso negado' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/rooms/:path*'],
}