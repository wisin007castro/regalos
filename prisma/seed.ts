import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin'
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'admin123'

  const hashed = await bcrypt.hash(password, 12)

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
