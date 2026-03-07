import Link from 'next/link'
import RegaloForm from '@/components/RegalosForm'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-pink-600 mb-4">
          🎈 ¡Felices 14 Años Nijal! 🎈
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Ayúdanos a celebrar este día tan especial con tus buenos deseos y regalos virtuales
        </p>
      </div>

      {/* Decoración */}
      <div className="flex justify-center gap-4 mb-12 text-4xl">
        <span>🎂</span>
        <span>🎁</span>
        <span>🎈</span>
        <span>🎉</span>
        <span>🤗</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Formulario de Regalos */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-pink-500">
            Envía tu Regalo
          </h2>
          <RegaloForm />
        </div>

        {/* Información y últimos regalos */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-600">
              ✨ ¿Cómo funciona?
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-3">
                <span className="text-pink-500">1️⃣</span>
                Elige entre un abrazo virtual o una regalo
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-500">2️⃣</span>
                Escribe tu mensaje de cumpleaños
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-500">3️⃣</span>
                Si eliges un regalo, puedes enviar el regalo por QR
              </li>
              <li className="flex items-center gap-3">
                <span className="text-pink-500">4️⃣</span>
                Tu regalo aparecerá después de verificado
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-xl p-8 text-white text-center">
            <p className="text-2xl mb-2">¡Mira los regalos que ya enviaron!</p>
            <Link 
              href="/regalos" 
              className="inline-block bg-white text-pink-500 px-6 py-3 rounded-lg font-bold hover:bg-pink-100 transition mt-4"
            >
              Ver Todos los Regalos 🎁 y buenos deseos para Nijal 🤗
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
