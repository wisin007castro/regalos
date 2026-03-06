import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FotosPage() {
  const fotos = await prisma.foto.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">Galeria de Fotos</h1>
        <p className="text-gray-500">Momentos especiales de este cumpleanos</p>
      </div>

      {fotos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📷</p>
          <p className="text-gray-400 text-lg">Aun no hay fotos publicadas</p>
          <Link href="/" className="inline-block mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition">
            Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {fotos.map((foto) => (
            <div key={foto.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group">
              <div className="relative">
                <img
                  src={foto.url}
                  alt={foto.titulo ?? 'Foto de cumpleanos'}
                  className="w-full object-cover group-hover:scale-105 transition duration-300"
                />
                {foto.titulo && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                    <p className="text-white text-sm font-medium">{foto.titulo}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
