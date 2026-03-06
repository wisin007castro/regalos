import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  try {
    const formData = await req.formData()
    const nombre = formData.get('nombre') as string | null
    const descripcion = formData.get('descripcion') as string | null
    const pagoUrl = formData.get('pagoUrl') as string | null
    const qrFile = formData.get('qrFile') as File | null

    let qrUrl: string | undefined = undefined

    if (qrFile && qrFile.size > 0) {
      // Borrar QR anterior si existe
      const anterior = await prisma.opcionRegalo.findUnique({
        where: { id: parseInt(id) },
        select: { qrUrl: true },
      })
      if (anterior?.qrUrl) {
        const oldPath = path.join(process.cwd(), 'public', anterior.qrUrl)
        await unlink(oldPath).catch(() => null)
      }

      const buffer = Buffer.from(await qrFile.arrayBuffer())
      const ext = qrFile.name.split('.').pop()
      const filename = `qr-opcion-${id}-${Date.now()}.${ext}`
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
      await writeFile(filepath, buffer)
      qrUrl = `/uploads/${filename}`
    }

    const opcion = await prisma.opcionRegalo.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre?.trim() && { nombre: nombre.trim() }),
        ...(descripcion !== null && { descripcion: descripcion.trim() }),
        ...(qrUrl !== undefined && { qrUrl }),
        pagoUrl: pagoUrl?.trim() || null,
      },
    })

    return NextResponse.json(opcion)
  } catch (error) {
    console.error('Error al actualizar opcion:', error)
    return NextResponse.json({ error: 'Error al guardar los cambios' }, { status: 500 })
  }
}
