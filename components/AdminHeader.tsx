'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function AdminHeader() {
  const { data: session } = useSession()

  const iniciales = (session?.user?.name ?? 'A')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <span className="text-white font-semibold text-sm">Admin Panel</span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            ← Sitio público
          </Link>
        </nav>

        {/* Usuario + Logout */}
        {session && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {iniciales}
              </div>
              <span className="text-sm text-slate-300 hidden sm:block">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30 transition"
            >
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
