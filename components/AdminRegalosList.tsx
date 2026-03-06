'use client'
import { useState, useEffect } from 'react'

interface Regalo {
  id: number
  nombre: string
  mensaje: string
  tipoRegalo: string
  moneda: string
  monto: number | null
  verificado: boolean
  fechaCreacion: string
  fechaVerificacion: string | null
}

export default function AdminRegalosList() {
  const [regalos, setRegalos] = useState<Regalo[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [filtro, setFiltro] = useState<string>('todos')

  useEffect(() => {
    fetchRegalos()
  }, [])

  const fetchRegalos = async () => {
    try {
      const response = await fetch('/api/regalos')
      const data = await response.json()
      setRegalos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setCargando(false)
    }
  }

  const verificarRegalo = async (id: number, verificado: boolean) => {
    try {
      const response = await fetch(`/api/regalos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificado: !verificado })
      })

      if (response.ok) {
        fetchRegalos()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const eliminarRegalo = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este regalo?')) return

    try {
      const response = await fetch(`/api/regalos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchRegalos()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const regalosFiltrados = regalos.filter(regalo => {
    if (filtro === 'verificados') return regalo.verificado
    if (filtro === 'pendientes') return !regalo.verificado
    return true
  })

  if (cargando) {
    return <div className="text-center py-8">Cargando regalos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded ${
            filtro === 'todos' ? 'bg-pink-500 text-white' : 'bg-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFiltro('pendientes')}
          className={`px-4 py-2 rounded ${
            filtro === 'pendientes' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setFiltro('verificados')}
          className={`px-4 py-2 rounded ${
            filtro === 'verificados' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          Verificados
        </button>
      </div>

      <div className="grid gap-4">
        {regalosFiltrados.map((regalo) => (
          <div key={regalo.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {regalo.tipoRegalo === 'abrazo' ? '🤗' : '🎂'}
                  </span>
                  <h3 className="font-bold">{regalo.nombre}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      regalo.verificado
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {regalo.verificado ? 'Verificado' : 'Pendiente'}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{regalo.mensaje}</p>
                {regalo.tipoRegalo === 'torta' && regalo.monto && (
                  <p className="text-sm font-medium text-green-600">
                    {regalo.moneda === 'BOB' ? 'Bs' : '$'} {regalo.monto}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(regalo.fechaCreacion).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => verificarRegalo(regalo.id, regalo.verificado)}
                  className={`px-3 py-1 rounded text-sm ${
                    regalo.verificado
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {regalo.verificado ? 'Desmarcar' : 'Verificar'}
                </button>
                <button
                  onClick={() => eliminarRegalo(regalo.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {regalosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 py-8">No hay regalos para mostrar</p>
      )}
    </div>
  )
}