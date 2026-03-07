'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Notificacion from './Notificacion'

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

const TIPOS = ['abrazo', 'torta', 'ropa', 'diversion', 'educacion', 'otro']

export default function AdminOpcionesList() {
  const [opciones, setOpciones] = useState<OpcionRegalo[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [emoji, setEmoji] = useState('')
  const [montoBOB, setMontoBOB] = useState('')
  const [montoUSD, setMontoUSD] = useState('')
  const [pagoUrl, setPagoUrl] = useState('')
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [notif, setNotif] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cerrarNotif = useCallback(() => setNotif(null), [])

  // Estado para crear nueva opción
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [nuevaNombre, setNuevaNombre] = useState('')
  const [nuevaEmoji, setNuevaEmoji] = useState('')
  const [nuevaTipo, setNuevaTipo] = useState('torta')
  const [nuevaDescripcion, setNuevaDescripcion] = useState('')
  const [nuevaMontoBOB, setNuevaMontoBOB] = useState('')
  const [nuevaMontoUSD, setNuevaMontoUSD] = useState('')
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    fetch('/api/opciones')
      .then((r) => r.json())
      .then(setOpciones)
  }, [])

  const abrirEditor = (opcion: OpcionRegalo) => {
    setEditando(opcion.id)
    setNombre(opcion.nombre)
    setDescripcion(opcion.descripcion)
    setEmoji(opcion.emoji)
    setMontoBOB(opcion.montoBOB?.toString() ?? '')
    setMontoUSD(opcion.montoUSD?.toString() ?? '')
    setPagoUrl(opcion.pagoUrl ?? '')
    setQrPreview(opcion.qrUrl)
    setQrFile(null)
  }

  const cerrarEditor = () => {
    setEditando(null)
    setQrFile(null)
    setQrPreview(null)
  }

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setQrFile(file)
    setQrPreview(URL.createObjectURL(file))
  }

  const guardar = async (id: number) => {
    setGuardando(true)
    const formData = new FormData()
    formData.append('nombre', nombre.trim())
    formData.append('descripcion', descripcion.trim())
    formData.append('emoji', emoji.trim())
    formData.append('montoBOB', montoBOB)
    formData.append('montoUSD', montoUSD)
    formData.append('pagoUrl', pagoUrl.trim())
    if (qrFile) formData.append('qrFile', qrFile)

    const res = await fetch(`/api/admin/opciones/${id}`, { method: 'PATCH', body: formData })

    if (res.ok) {
      const actualizada = await res.json()
      setOpciones((prev) => prev.map((o) => (o.id === id ? { ...o, ...actualizada } : o)))
      cerrarEditor()
      setNotif({ tipo: 'exito', mensaje: 'Opción actualizada correctamente' })
    } else {
      const err = await res.json().catch(() => ({}))
      setNotif({ tipo: 'error', mensaje: err.error ?? 'Error al guardar los cambios' })
    }
    setGuardando(false)
  }

  const crearOpcion = async () => {
    if (!nuevaNombre.trim() || !nuevaEmoji.trim()) {
      setNotif({ tipo: 'error', mensaje: 'Nombre y emoji son requeridos' })
      return
    }
    setCreando(true)
    const res = await fetch('/api/admin/opciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nuevaNombre.trim(),
        emoji: nuevaEmoji.trim(),
        tipo: nuevaTipo,
        descripcion: nuevaDescripcion.trim(),
        montoBOB: nuevaMontoBOB || null,
        montoUSD: nuevaMontoUSD || null,
      }),
    })

    if (res.ok) {
      const nueva = await res.json()
      setOpciones((prev) => [...prev, nueva])
      setMostrarNueva(false)
      setNuevaNombre(''); setNuevaEmoji(''); setNuevaTipo('torta')
      setNuevaDescripcion(''); setNuevaMontoBOB(''); setNuevaMontoUSD('')
      setNotif({ tipo: 'exito', mensaje: 'Opción creada correctamente' })
    } else {
      const err = await res.json().catch(() => ({}))
      setNotif({ tipo: 'error', mensaje: err.error ?? 'Error al crear la opción' })
    }
    setCreando(false)
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

  return (
    <>
      {notif && <Notificacion tipo={notif.tipo} mensaje={notif.mensaje} onClose={cerrarNotif} />}
      <div className="space-y-3">
        {opciones
          .filter((o) => o.tipo !== 'abrazo')
          .map((opcion) => (
            <div key={opcion.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opcion.emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{opcion.nombre}</p>
                    <p className="text-xs text-slate-500">Bs {opcion.montoBOB} / $ {opcion.montoUSD}</p>
                  </div>
                </div>
                <button
                  onClick={() => editando === opcion.id ? cerrarEditor() : abrirEditor(opcion)}
                  className="text-xs px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
                >
                  {editando === opcion.id ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {editando !== opcion.id && (
                <div className="flex gap-6 items-start">
                  <div className="text-sm space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">Enlace:</span>
                      {opcion.pagoUrl
                        ? <a href={opcion.pagoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 truncate max-w-xs hover:underline text-xs">{opcion.pagoUrl}</a>
                        : <span className="italic text-slate-600 text-xs">No configurado</span>
                      }
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">QR:</span>
                      {opcion.qrUrl
                        ? <span className="text-emerald-400 text-xs">Imagen cargada</span>
                        : <span className="italic text-slate-600 text-xs">No configurado</span>
                      }
                    </div>
                  </div>
                  {opcion.qrUrl && (
                    <img src={opcion.qrUrl} alt="QR" className="w-14 h-14 object-contain rounded-lg border border-slate-600 bg-white p-0.5" />
                  )}
                </div>
              )}

              {editando === opcion.id && (
                <div className="space-y-4 pt-4 border-t border-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre</label>
                      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Emoji</label>
                      <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
                    <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio BOB (Bs)</label>
                      <input type="number" value={montoBOB} onChange={(e) => setMontoBOB(e.target.value)} placeholder="0" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio USD ($)</label>
                      <input type="number" value={montoUSD} onChange={(e) => setMontoUSD(e.target.value)} placeholder="0" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Imagen QR</label>
                    <div className="flex items-start gap-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition flex-shrink-0"
                      >
                        {qrPreview ? (
                          <img src={qrPreview} alt="Preview QR" className="w-full h-full object-contain rounded-xl p-1" />
                        ) : (
                          <>
                            <span className="text-2xl text-slate-600">📷</span>
                            <span className="text-xs text-slate-500 mt-1">Subir imagen</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 pt-1 space-y-1">
                        <p>Formatos: JPG, PNG, SVG, WebP</p>
                        <p>Tamaño recomendado: 300x300px</p>
                        {qrPreview && (
                          <button
                            type="button"
                            onClick={() => { setQrPreview(null); setQrFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Quitar imagen
                          </button>
                        )}
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleQrChange} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Enlace de pago</label>
                    <input type="url" value={pagoUrl} onChange={(e) => setPagoUrl(e.target.value)} placeholder="https://..." className={inputCls} />
                  </div>
                  <button
                    onClick={() => guardar(opcion.id)}
                    disabled={guardando}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {guardando ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              )}
            </div>
          ))}

        {/* Formulario nueva opción */}
        {mostrarNueva ? (
          <div className="bg-slate-900 border border-blue-500/40 rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold text-blue-400">Nueva opción de regalo</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre</label>
                <input type="text" value={nuevaNombre} onChange={(e) => setNuevaNombre(e.target.value)} placeholder="Ej: Torta grande" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Emoji</label>
                <input type="text" value={nuevaEmoji} onChange={(e) => setNuevaEmoji(e.target.value)} placeholder="🎂" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo</label>
                <select value={nuevaTipo} onChange={(e) => setNuevaTipo(e.target.value)} className={inputCls}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
                <input type="text" value={nuevaDescripcion} onChange={(e) => setNuevaDescripcion(e.target.value)} placeholder="Descripción corta" className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio BOB (Bs)</label>
                <input type="number" value={nuevaMontoBOB} onChange={(e) => setNuevaMontoBOB(e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Precio USD ($)</label>
                <input type="number" value={nuevaMontoUSD} onChange={(e) => setNuevaMontoUSD(e.target.value)} placeholder="0" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={crearOpcion}
                disabled={creando}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {creando ? 'Creando...' : 'Crear opción'}
              </button>
              <button
                onClick={() => setMostrarNueva(false)}
                className="px-5 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setMostrarNueva(true)}
            className="w-full py-3 border-2 border-dashed border-slate-600 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-400 transition text-sm font-medium"
          >
            + Agregar nueva opción de regalo
          </button>
        )}
      </div>
    </>
  )
}
