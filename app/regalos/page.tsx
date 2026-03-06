import { prisma } from '@/lib/prisma'
import RegaloCard from '@/components/RegalosCard'
import Link from 'next/link'

export const revalidate = 60

export default async function RegalosPage() {
  const regalos = await prisma.regalo.findMany({
    where: { verificado: true, eliminado: false },
    orderBy: { fechaCreacion: 'desc' },
    include: { opcion: true },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-pink-600 mb-2">Regalos Recibidos</h1>
        <p className="text-gray-500">Todos los regalos verificados para este cumpleanos especial</p>
      </div>

      {regalos.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🎁</p>
          <p className="text-gray-400 text-lg">Aun no hay regalos verificados</p>
          <Link
            href="/"
            className="inline-block mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Ser el primero en regalar
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {regalos.map((regalo) => (
            <RegaloCard key={regalo.id} regalo={regalo} />
          ))}
        </div>
      )}
    </div>
  )
}
