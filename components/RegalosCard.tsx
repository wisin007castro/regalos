'use client'

interface OpcionRegalo {
  nombre: string
  emoji: string
  tipo: string
}

interface Regalo {
  id: number
  nombre: string
  mensaje: string
  moneda: string
  monto: number | null
  fechaCreacion: Date
  opcion: OpcionRegalo | null
}

interface RegaloCardProps {
  regalo: Regalo
}

export default function RegaloCard({ regalo }: RegaloCardProps) {
  const emoji = regalo.opcion?.emoji ?? '🎁'
  const nombreOpcion = regalo.opcion?.nombre ?? 'Regalo'

  const montoTexto =
    regalo.monto != null
      ? `${regalo.moneda === 'BOB' ? 'Bs' : '$'} ${regalo.monto}`
      : null

  const fechaFormateada = new Date(regalo.fechaCreacion).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-purple-900/20 p-6 hover:shadow-xl transition border-l-4 border-pink-400 dark:border-pink-600 dark:border dark:border-l-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{emoji}</span>
          <div>
            <h3 className="font-bold text-lg text-pink-600 dark:text-pink-400">{regalo.nombre}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500">{nombreOpcion}</p>
          </div>
        </div>
        {montoTexto && (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
            {montoTexto}
          </span>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic mb-2">&quot;{regalo.mensaje}&quot;</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">{fechaFormateada}</p>
    </div>
  )
}
