import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const regalos = await prisma.regalo.findMany({
    where: { eliminado: false },
    orderBy: { fechaCreacion: 'desc' },
    include: { opcion: true },
  })

  return NextResponse.json(regalos)
}
