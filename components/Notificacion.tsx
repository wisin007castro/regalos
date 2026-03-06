'use client'
import { useEffect } from 'react'

interface Props {
  tipo: 'exito' | 'error'
  mensaje: string
  onClose: () => void
}

export default function Notificacion({ tipo, mensaje, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${
        tipo === 'exito' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <span>{tipo === 'exito' ? '✓' : '✕'}</span>
      <span>{mensaje}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}
