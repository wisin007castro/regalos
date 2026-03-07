import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SessionProviderWrapper from '@/components/SessionProviderWrapper'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🎉 Cumpleaños 14',
  description: 'Celebra con nosotros este día especial',
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProviderWrapper>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 dark:from-fuchsia-950 dark:to-gray-950">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
