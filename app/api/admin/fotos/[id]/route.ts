import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { deleteImage } from '@/lib/cloudinary'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  try {
    const foto = await prisma.foto.findUnique({ where: { id: parseInt(id) } })
    if (!foto) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })

    if (foto.publicId) await deleteImage(foto.publicId)

    await prisma.foto.delete({ where: { id: parseInt(id) } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error al eliminar foto:', error)
    return NextResponse.json({ error: 'Error al eliminar la foto' }, { status: 500 })
  }
}
