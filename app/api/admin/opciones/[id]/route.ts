import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { uploadBuffer, deleteImage } from '@/lib/cloudinary'

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
    const emoji = formData.get('emoji') as string | null
    const montoBOB = formData.get('montoBOB') as string | null
    const montoUSD = formData.get('montoUSD') as string | null
    const qrFile = formData.get('qrFile') as File | null

    let qrUrl: string | undefined = undefined
    let qrPublicId: string | undefined = undefined

    if (qrFile && qrFile.size > 0) {
      const anterior = await prisma.opcionRegalo.findUnique({
        where: { id: parseInt(id) },
        select: { qrPublicId: true },
      })
      if (anterior?.qrPublicId) await deleteImage(anterior.qrPublicId)

      const buffer = Buffer.from(await qrFile.arrayBuffer())
      const result = await uploadBuffer(buffer, 'cumpleanos/qr')
      qrUrl = result.url
      qrPublicId = result.publicId
    }

    const opcion = await prisma.opcionRegalo.update({
      where: { id: parseInt(id) },
      data: {
        ...(nombre?.trim() && { nombre: nombre.trim() }),
        ...(descripcion !== null && { descripcion: descripcion.trim() }),
        ...(emoji?.trim() && { emoji: emoji.trim() }),
        ...(montoBOB !== null && montoBOB !== '' && { montoBOB: parseFloat(montoBOB) }),
        ...(montoUSD !== null && montoUSD !== '' && { montoUSD: parseFloat(montoUSD) }),
        ...(qrUrl !== undefined && { qrUrl, qrPublicId }),
        pagoUrl: pagoUrl?.trim() || null,
      },
    })

    return NextResponse.json(opcion)
  } catch (error) {
    console.error('Error al actualizar opcion:', error)
    return NextResponse.json({ error: 'Error al guardar los cambios' }, { status: 500 })
  }
}
