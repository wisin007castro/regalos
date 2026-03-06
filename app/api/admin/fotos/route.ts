import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { uploadBuffer } from '@/lib/cloudinary'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const fotos = await prisma.foto.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(fotos)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    const formData = await req.formData()
    const titulo = formData.get('titulo') as string | null
    const archivo = formData.get('archivo') as File | null

    if (!archivo || archivo.size === 0) {
      return NextResponse.json({ error: 'No se recibio archivo' }, { status: 400 })
    }

    const buffer = Buffer.from(await archivo.arrayBuffer())
    const { url, publicId } = await uploadBuffer(buffer, 'cumpleanos/fotos')

    const foto = await prisma.foto.create({
      data: {
        url,
        publicId,
        titulo: titulo?.trim() || null,
      },
    })

    return NextResponse.json(foto, { status: 201 })
  } catch (error) {
    console.error('Error al subir foto:', error)
    return NextResponse.json({ error: 'Error al subir la foto' }, { status: 500 })
  }
}
