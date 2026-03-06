'use client'

interface Regalo {
  id: number
  nombre: string
  mensaje: string
  tipoRegalo: string
  moneda: string
  monto: number | null
  fechaCreacion: Date
}

interface RegaloCardProps {
  regalo: Regalo
}

export default function RegaloCard({ regalo }: RegaloCardProps) {
  const getIcon = (): string => {
    if (regalo.tipoRegalo === 'abrazo') return '🤗'
    return '🎂'
  }

  const getMontoTexto = (): string | null => {
    if (regalo.tipoRegalo === 'torta' && regalo.monto) {
      const simbolo = regalo.moneda === 'BOB' ? 'Bs' : '$'
      return `${simbolo} ${regalo.monto}`
    }
    return null
  }

  const fechaFormateada = new Date(regalo.fechaCreacion).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-l-4 border-pink-400">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{getIcon()}</span>
          <h3 className="font-bold text-lg text-pink-600">{regalo.nombre}</h3>
        </div>
        {getMontoTexto() && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {getMontoTexto()}
          </span>
        )}
      </div>
      <p className="text-gray-600 italic mb-2">&quot;{regalo.mensaje}&quot;</p>
      <p className="text-sm text-gray-400">
        {fechaFormateada}
      </p>
    </div>
  )
}