import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username as string },
        })

        if (!admin) return null

        const passwordOk = await bcrypt.compare(
          credentials.password as string,
          admin.password
        )

        if (!passwordOk) return null

        return { id: String(admin.id), name: admin.username }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
})
