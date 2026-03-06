import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const opciones = await prisma.opcionRegalo.findMany({
    where: { activo: true },
    orderBy: { orden: 'asc' },
  })
  return NextResponse.json(opciones)
}
