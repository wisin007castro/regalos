import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const OPCIONES = [
  {
    nombre: 'Abrazo Virtual',
    emoji: '🤗',
    tipo: 'abrazo',
    descripcion: 'Un abrazo lleno de cariño',
    montoBOB: null,
    montoUSD: null,
    orden: 1,
  },
  {
    nombre: 'Porcion de Torta',
    emoji: '🍰',
    tipo: 'torta',
    descripcion: '1 porción individual',
    montoBOB: 7,
    montoUSD: 2,
    orden: 2,
  },
  {
    nombre: 'Porción de Pizza',
    emoji: '🍕',
    tipo: 'torta',
    descripcion: '1 porción individual',
    montoBOB: 15,
    montoUSD: 20,
    orden: 3,
  },
  {
    nombre: 'Ropa',
    emoji: '👕',
    tipo: 'ropa',
    descripcion: 'Para salir de paseo',
    montoBOB: 30,
    montoUSD: 42,
    orden: 4,
  },
  {
    nombre: 'Entrada al cine',
    emoji: '👕',
    tipo: 'diversion',
    descripcion: 'Para distraerme un rato',
    montoBOB: 30,
    montoUSD: 42,
    orden: 4,
  },
  {
    nombre: 'Libro',
    emoji: '📚',
    tipo: 'educacion',
    descripcion: 'Un libro para matar el aburrimiento',
    montoBOB: 130,
    montoUSD: 42,
    orden: 4,
  },
]

async function main() {
  // Seed opciones de regalo
  for (const opcion of OPCIONES) {
    await prisma.opcionRegalo.upsert({
      where: { id: opcion.orden },
      update: opcion,
      create: opcion,
    })
  }
  console.log(`${OPCIONES.length} opciones de regalo creadas`)

  // Seed admin
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'
  const hashed = await bcrypt.hash(password, 14)

  const admin = await prisma.admin.upsert({
    where: { username },
    update: { password: hashed },
    create: { username, password: hashed },
  })
  console.log(`Admin creado: ${admin.username} (id: ${admin.id})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
