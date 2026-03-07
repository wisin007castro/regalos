'use client'
import { useState, useEffect } from 'react'

interface OpcionRegalo {
  id: number
  nombre: string
  emoji: string
  tipo: string
  descripcion: string
  montoBOB: number | null
  montoUSD: number | null
  qrUrl: string | null
  pagoUrl: string | null
}

export default function RegaloForm() {
  const [opciones, setOpciones] = useState<OpcionRegalo[]>([])
  const [cargando, setCargando] = useState(true)
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OpcionRegalo | null>(null)
  const [moneda, setMoneda] = useState<'BOB' | 'USD'>('BOB')
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/opciones')
      .then((r) => r.json())
      .then((data) => setOpciones(data))
      .finally(() => setCargando(false))
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!opcionSeleccionada) return

    setEnviando(true)
    setError('')

    const monto =
      opcionSeleccionada.tipo === 'torta'
        ? moneda === 'BOB'
          ? opcionSeleccionada.montoBOB
          : opcionSeleccionada.montoUSD
        : null

    try {
      const res = await fetch('/api/regalos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          mensaje,
          opcionId: opcionSeleccionada.id,
          moneda: opcionSeleccionada.tipo === 'torta' ? moneda : 'BOB',
          monto,
        }),
      })

      if (res.ok) {
        setEnviado(true)
      } else {
        setError('Ocurrio un error al enviar. Intenta de nuevo.')
      }
    } catch {
      setError('Ocurrio un error al enviar. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const resetForm = () => {
    setEnviado(false)
    setOpcionSeleccionada(null)
    setNombre('')
    setMensaje('')
    setMoneda('BOB')
  }

  if (enviado) {
    const sinCosto = !opcionSeleccionada || opcionSeleccionada.tipo === 'abrazo'
    return (
      <div className="text-center py-8">
        <p className="text-5xl mb-4">🎉</p>
        <p className="text-xl font-bold text-green-600 mb-2">¡Gracias por tu regalo!</p>
        {sinCosto ? (
          <>
            <p className="text-gray-500 mb-2">Tu abrazo virtual ya aparece en la lista.</p>
            <p className="text-gray-500 mb-6">¿Quieres ver los regalos que otros enviaron?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/regalos"
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
              >
                Ver todos los regalos
              </a>
              <button
                onClick={resetForm}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
              >
                Enviar otro regalo
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-6">Tu regalo sera verificado pronto y aparecera en la lista.</p>
            <button
              onClick={resetForm}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Enviar otro regalo
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-medium text-gray-700 dark:text-gray-300 mb-3">Elige tu regalo:</p>

        <div className="flex gap-2 mb-4">
          {(['BOB', 'USD'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                moneda === m
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {m === 'BOB' ? 'Bs (Bolivianos)' : '$ (Dolares)'}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="text-center py-8 text-gray-400">Cargando opciones...</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-pink-50 dark:bg-pink-950/40">
                <tr>
                  <th className="text-left px-4 py-3 text-pink-600 dark:text-pink-400 font-semibold">Regalo</th>
                  <th className="text-right px-4 py-3 text-pink-600 dark:text-pink-400 font-semibold">
                    Monto ({moneda === 'BOB' ? 'Bs' : '$'})
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {opciones.map((opcion, i) => {
                  const seleccionada = opcionSeleccionada?.id === opcion.id
                  const monto = moneda === 'BOB' ? opcion.montoBOB : opcion.montoUSD
                  return (
                    <tr
                      key={opcion.id}
                      onClick={() => setOpcionSeleccionada(opcion)}
                      className={`cursor-pointer transition ${
                        i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/60'
                      } ${seleccionada ? '!bg-pink-50 dark:!bg-pink-950/50 ring-2 ring-inset ring-pink-400' : 'hover:bg-pink-50/50 dark:hover:bg-pink-950/20'}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{opcion.emoji}</span>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{opcion.nombre}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{opcion.descripcion}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                        {monto != null
                          ? moneda === 'BOB'
                            ? `Bs ${monto}`
                            : `$ ${monto}`
                          : 'Gratis'}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mx-auto flex items-center justify-center ${
                            seleccionada ? 'border-pink-500 bg-pink-500' : 'border-gray-300'
                          }`}
                        >
                          {seleccionada && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {opcionSeleccionada && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-pink-50 dark:bg-pink-950/40 rounded-lg px-4 py-2 text-sm text-pink-700 dark:text-pink-300">
            Seleccionaste:{' '}
            <span className="font-semibold">
              {opcionSeleccionada.emoji} {opcionSeleccionada.nombre}
            </span>
            {opcionSeleccionada.tipo === 'torta' && (
              <span>
                {' '}
                —{' '}
                {moneda === 'BOB'
                  ? `Bs ${opcionSeleccionada.montoBOB}`
                  : `$ ${opcionSeleccionada.montoUSD}`}
              </span>
            )}
          </div>

          {opcionSeleccionada.tipo === 'torta' && (
            <>
              {moneda === 'BOB' && opcionSeleccionada.qrUrl && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Envio de regalo por QR:</p>
                  <p className="text-xs text-blue-600 dark:text-blue-500">Escanea el QR para pagar:</p>
                  <div className="flex justify-center">
                    <img
                      src={opcionSeleccionada.qrUrl}
                      alt="QR de pago"
                      className="w-40 h-40 object-contain rounded border border-blue-200 bg-white p-1"
                    />
                  </div>
                </div>
              )}
              {moneda === 'USD' && opcionSeleccionada.pagoUrl && (
                <div className="bg-purple-50 dark:bg-fuchsia-950/30 border border-purple-200 dark:border-fuchsia-900/50 rounded-lg p-4">
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-3">Enlace de pago:</p>
                  <a
                    href={opcionSeleccionada.pagoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-purple-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition"
                  >
                    Ir al enlace de pago
                  </a>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu nombre</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Tia Maria"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu mensaje</label>
            <textarea
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe tus deseos de cumpleanos..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition disabled:opacity-60 text-lg"
          >
            {enviando ? 'Enviando...' : '🎁 Enviar Regalo'}
          </button>
        </form>
      )}
    </div>
  )
}
