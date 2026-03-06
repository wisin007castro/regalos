'use client'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-sm bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-red-600/80 hover:text-white transition"
    >
      Cerrar Sesion
    </button>
  )
}
