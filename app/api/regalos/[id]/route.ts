import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const regalo = await prisma.regalo.update({
    where: { id: parseInt(id) },
    data: {
      verificado: body.verificado,
      fechaVerificacion: body.verificado ? new Date() : null,
    },
  })

  return NextResponse.json(regalo)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  await prisma.regalo.update({
    where: { id: parseInt(id) },
    data: { eliminado: true },
  })

  return NextResponse.json({ ok: true })
}
