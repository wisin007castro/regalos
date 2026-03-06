import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const regalos = await prisma.regalo.findMany({
    where: { verificado: true, eliminado: false },
    orderBy: { fechaCreacion: 'desc' },
    include: { opcion: true },
  })
  return NextResponse.json(regalos)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, mensaje, opcionId, moneda, monto } = body

  if (!nombre?.trim() || !mensaje?.trim() || !opcionId) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const sinCosto = !monto || parseFloat(monto) === 0

  const regalo = await prisma.regalo.create({
    data: {
      nombre: nombre.trim(),
      mensaje: mensaje.trim(),
      opcionId: parseInt(opcionId),
      moneda: moneda ?? 'BOB',
      monto: monto ? parseFloat(monto) : null,
      verificado: sinCosto,
      fechaVerificacion: sinCosto ? new Date() : null,
    },
    include: { opcion: true },
  })

  return NextResponse.json(regalo, { status: 201 })
}
