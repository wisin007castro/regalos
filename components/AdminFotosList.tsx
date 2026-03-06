'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Notificacion from './Notificacion'

interface Foto {
  id: number
  url: string
  titulo: string | null
}

export default function AdminFotosList() {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [titulo, setTitulo] = useState('')
  const [archivos, setArchivos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [subiendo, setSubiendo] = useState(false)
  const [notif, setNotif] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cerrarNotif = useCallback(() => setNotif(null), [])

  useEffect(() => { fetchFotos() }, [])

  const fetchFotos = async () => {
    const res = await fetch('/api/admin/fotos')
    if (res.ok) setFotos(await res.json())
  }

  const handleArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setArchivos(files)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  const handleSubir = async () => {
    if (archivos.length === 0) return
    setSubiendo(true)

    let subidas = 0
    for (const archivo of archivos) {
      const formData = new FormData()
      formData.append('archivo', archivo)
      if (titulo.trim()) formData.append('titulo', titulo.trim())

      const res = await fetch('/api/admin/fotos', { method: 'POST', body: formData })
      if (res.ok) {
        const nueva = await res.json()
        setFotos((prev) => [...prev, nueva])
        subidas++
      }
    }

    setSubiendo(false)
    setArchivos([])
    setPreviews([])
    setTitulo('')
    if (fileInputRef.current) fileInputRef.current.value = ''

    setNotif(
      subidas === archivos.length
        ? { tipo: 'exito', mensaje: `${subidas} foto${subidas > 1 ? 's' : ''} subida${subidas > 1 ? 's' : ''} correctamente` }
        : { tipo: 'error', mensaje: 'Algunas fotos no se pudieron subir' }
    )
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta foto?')) return
    const res = await fetch(`/api/admin/fotos/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setFotos((prev) => prev.filter((f) => f.id !== id))
      setNotif({ tipo: 'exito', mensaje: 'Foto eliminada' })
    } else {
      setNotif({ tipo: 'error', mensaje: 'Error al eliminar la foto' })
    }
  }

  return (
    <>
      {notif && <Notificacion tipo={notif.tipo} mensaje={notif.mensaje} onClose={cerrarNotif} />}

      {/* Uploader */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-5">
        <p className="text-sm font-medium text-slate-300 mb-3">Subir fotos</p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition mb-3"
        >
          {previews.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {previews.map((src, i) => (
                <img key={i} src={src} alt="" className="h-20 w-20 object-cover rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-3xl text-slate-600 mb-1">📷</p>
              <p className="text-sm text-slate-500">Clic para seleccionar fotos</p>
              <p className="text-xs text-slate-600 mt-1">JPG, PNG, WebP — puedes seleccionar varias</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleArchivos}
        />

        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Titulo opcional (aplica a todas las fotos seleccionadas)"
          className="w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        <button
          onClick={handleSubir}
          disabled={archivos.length === 0 || subiendo}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-40"
        >
          {subiendo ? 'Subiendo...' : `Subir ${archivos.length > 0 ? `(${archivos.length})` : ''}`}
        </button>
      </div>

      {/* Grid de fotos */}
      {fotos.length === 0 ? (
        <p className="text-center text-slate-500 py-8">No hay fotos aun</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative group rounded-lg overflow-hidden aspect-square">
              <img src={foto.url} alt={foto.titulo ?? ''} className="w-full h-full object-cover" />
              {foto.titulo && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1.5 py-1">
                  <p className="text-white text-xs truncate">{foto.titulo}</p>
                </div>
              )}
              <button
                onClick={() => handleEliminar(foto.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
