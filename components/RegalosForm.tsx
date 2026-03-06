'use client'
import { useState, FormEvent, ChangeEvent } from 'react'

interface FormData {
  nombre: string
  mensaje: string
  tipoRegalo: 'abrazo' | 'torta'
  moneda: 'BOB' | 'USD'
  monto: string
}

export default function RegaloForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    mensaje: '',
    tipoRegalo: 'abrazo',
    moneda: 'BOB',
    monto: ''
  })
  const [enviando, setEnviando] = useState<boolean>(false)
  const [enviado, setEnviado] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)

    try {
      const response = await fetch('/api/regalos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setEnviado(true)
        setFormData({
          nombre: '',
          mensaje: '',
          tipoRegalo: 'abrazo',
          moneda: 'BOB',
          monto: ''
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg text-center">
        <p className="text-xl mb-2">¡Gracias por tu regalo! 🎉</p>
        <p className="mb-4">Tu mensaje será verificado pronto.</p>
        <button
          onClick={() => setEnviado(false)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Enviar otro regalo
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
          Tu Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          placeholder="Ej: Tía María"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-gray-700 font-medium mb-2">
          Mensaje de Cumpleaños
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          value={formData.mensaje}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          rows={3}
          placeholder="Escribe un mensaje para el cumpleañero..."
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">¿Qué deseas regalar?</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="tipoRegalo"
              value="abrazo"
              checked={formData.tipoRegalo === 'abrazo'}
              onChange={handleChange}
              className="mr-2"
            />
            Un Abrazo Virtual 🤗
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="tipoRegalo"
              value="torta"
              checked={formData.tipoRegalo === 'torta'}
              onChange={handleChange}
              className="mr-2"
            />
            Una Torta Virtual 🎂
          </label>
        </div>
      </div>

      {formData.tipoRegalo === 'torta' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="moneda" className="block text-gray-700 font-medium mb-2">
              Moneda
            </label>
            <select
              id="moneda"
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="BOB">Bolivianos (Bs)</option>
              <option value="USD">Dólares ($)</option>
            </select>
          </div>

          <div>
            <label htmlFor="monto" className="block text-gray-700 font-medium mb-2">
              Monto ({formData.moneda === 'BOB' ? 'Bs' : '$'})
            </label>
            <input
              type="number"
              id="monto"
              name="monto"
              required
              min="1"
              step="0.01"
              value={formData.monto}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder={formData.moneda === 'BOB' ? 'Ej: 50' : 'Ej: 20'}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium mb-2">Información de Pago:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📱</span>
                <span>QR: (Aquí iría el código QR)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">🔗</span>
                <span>Link de pago: (URL del método de pago)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition disabled:bg-pink-300 text-lg font-medium"
      >
        {enviando ? 'Enviando...' : '🎁 Enviar Regalo'}
      </button>
    </form>
  )
}