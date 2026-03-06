import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')

      if (isAdminRoute && !isLoginPage) {
        if (isLoggedIn) return true
        return false
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl))
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
