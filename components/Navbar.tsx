'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="bg-pink-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          Cumpleaños 14
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-pink-200 transition">Inicio</Link>
          <Link href="/regalos" className="hover:text-pink-200 transition">Ver Regalos</Link>
          <Link href="/fotos" className="hover:text-pink-200 transition">Fotos</Link>
          {session ? (
            <Link
              href="/admin"
              className="flex items-center gap-2 bg-white text-pink-600 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-pink-100 transition"
            >
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {(session.user?.name ?? 'A')[0].toUpperCase()}
              </span>
              Panel Admin
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
