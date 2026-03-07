import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { nombre, emoji, tipo, descripcion, montoBOB, montoUSD } = body

    if (!nombre?.trim() || !emoji?.trim() || !tipo?.trim()) {
      return NextResponse.json({ error: 'Nombre, emoji y tipo son requeridos' }, { status: 400 })
    }

    const ultimo = await prisma.opcionRegalo.findFirst({ orderBy: { orden: 'desc' } })
    const orden = (ultimo?.orden ?? 0) + 1

    const opcion = await prisma.opcionRegalo.create({
      data: {
        nombre: nombre.trim(),
        emoji: emoji.trim(),
        tipo: tipo.trim(),
        descripcion: descripcion?.trim() ?? '',
        montoBOB: montoBOB ? parseFloat(montoBOB) : null,
        montoUSD: montoUSD ? parseFloat(montoUSD) : null,
        orden,
        activo: true,
      },
    })

    return NextResponse.json(opcion, { status: 201 })
  } catch (error) {
    console.error('Error al crear opcion:', error)
    return NextResponse.json({ error: 'Error al crear la opción' }, { status: 500 })
  }
}
