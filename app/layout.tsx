import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🎉 Cumpleaños 13',
  description: 'Celebra con nosotros este día especial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}