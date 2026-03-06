import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*'],
}
