'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-pink-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          🎂 Cumpleaños 13
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-pink-200 transition">Inicio</Link>
          <Link href="/regalos" className="hover:text-pink-200 transition">Ver Regalos</Link>
        </div>
      </div>
    </nav>
  )
}