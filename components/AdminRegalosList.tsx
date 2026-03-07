'use client'
import { useState, useEffect, useCallback } from 'react'
import Notificacion from './Notificacion'

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
  verificado: boolean
  eliminado: boolean
  fechaCreacion: string
  fechaVerificacion: string | null
  opcion: OpcionRegalo | null
}

export default function AdminRegalosList() {
  const [regalos, setRegalos] = useState<Regalo[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [filtro, setFiltro] = useState<string>('todos')
  const [notif, setNotif] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null)
  const cerrarNotif = useCallback(() => setNotif(null), [])

  useEffect(() => { fetchRegalos() }, [])

  const fetchRegalos = async () => {
    try {
      const response = await fetch('/api/admin/regalos')
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
        body: JSON.stringify({ verificado: !verificado }),
      })
      if (response.ok) {
        fetchRegalos()
        setNotif({ tipo: 'exito', mensaje: `Regalo ${!verificado ? 'verificado' : 'desmarcado'} correctamente` })
      } else {
        setNotif({ tipo: 'error', mensaje: 'Error al actualizar el regalo' })
      }
    } catch {
      setNotif({ tipo: 'error', mensaje: 'Error al actualizar el regalo' })
    }
  }

  const eliminarRegalo = async (id: number) => {
    if (!confirm('¿Eliminar este regalo? Quedara oculto pero no se borrara de la base de datos.')) return
    try {
      const response = await fetch(`/api/regalos/${id}`, { method: 'DELETE' })
      if (response.ok) {
        fetchRegalos()
        setNotif({ tipo: 'exito', mensaje: 'Regalo eliminado' })
      } else {
        setNotif({ tipo: 'error', mensaje: 'Error al eliminar el regalo' })
      }
    } catch {
      setNotif({ tipo: 'error', mensaje: 'Error al eliminar el regalo' })
    }
  }

  const regalosFiltrados = regalos.filter(regalo => {
    if (filtro === 'verificados') return regalo.verificado && !regalo.eliminado
    if (filtro === 'pendientes') return !regalo.verificado && !regalo.eliminado
    return !regalo.eliminado
  })

  const FILTROS = [
    { key: 'todos', label: 'Todos', active: 'bg-blue-600 text-white', inactive: 'bg-slate-700 text-slate-300 hover:bg-slate-600' },
    { key: 'pendientes', label: 'Pendientes', active: 'bg-amber-500 text-white', inactive: 'bg-slate-700 text-slate-300 hover:bg-slate-600' },
    { key: 'verificados', label: 'Verificados', active: 'bg-emerald-600 text-white', inactive: 'bg-slate-700 text-slate-300 hover:bg-slate-600' },
  ]

  if (cargando) {
    return <div className="text-center py-8 text-slate-400">Cargando regalos...</div>
  }

  return (
    <>
      {notif && <Notificacion tipo={notif.tipo} mensaje={notif.mensaje} onClose={cerrarNotif} />}
      <div className="space-y-5">
        <div className="flex gap-2">
          {FILTROS.map(f => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filtro === f.key ? f.active : f.inactive}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {regalosFiltrados.map((regalo) => (
          <div key={regalo.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xl">{regalo.opcion?.emoji ?? '🎁'}</span>
                    <span className="font-semibold text-white">{regalo.nombre}</span>
                    <span className="text-xs text-slate-500">{regalo.opcion?.nombre}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      regalo.verificado
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {regalo.verificado ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-1 break-words">{regalo.mensaje}</p>
                  {regalo.monto != null && (
                    <p className="text-sm font-semibold text-emerald-400">
                      {regalo.moneda === 'BOB' ? 'Bs' : '$'} {regalo.monto}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-1">
                    {new Date(regalo.fechaCreacion).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap">
                  <button
                    onClick={() => verificarRegalo(regalo.id, regalo.verificado)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      regalo.verificado
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 border border-emerald-500/30'
                    }`}
                  >
                    {regalo.verificado ? 'Desmarcar' : 'Verificar'}
                  </button>
                  <button
                    onClick={() => eliminarRegalo(regalo.id)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium hover:bg-red-500/40 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {regalosFiltrados.length === 0 && (
          <p className="text-center text-slate-500 py-10">No hay regalos para mostrar</p>
        )}
      </div>
    </>
  )
}
