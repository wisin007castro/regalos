const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Crear admin si no existe
  const adminExists = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('cumple13', 10)
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    })
    console.log('✅ Admin creado exitosamente')
  }

  // Limpiar regalos existentes (opcional - comenta si no quieres borrar)
  // await prisma.regalo.deleteMany()
  // console.log('🗑️ Regalos anteriores eliminados')

  // Crear regalos de ejemplo
  const regalosEjemplo = [
    {
      nombre: 'Tía María',
      mensaje: 'Feliz cumpleaños mi niño hermoso, te mando un abrazo gigante desde Cochabamba',
      tipoRegalo: 'abrazo',
      moneda: 'BOB',
      verificado: true
    },
    {
      nombre: 'Abuelo Juan',
      mensaje: 'Para mi nieto en su cumpleaños, que cumplas muchos más',
      tipoRegalo: 'torta',
      moneda: 'USD',
      monto: 50,
      verificado: true
    },
    {
      nombre: 'Prima Valentina',
      mensaje: 'Felices 13 años primito! Te quiero mucho',
      tipoRegalo: 'abrazo',
      moneda: 'BOB',
      verificado: false
    },
    {
      nombre: 'Tío Carlos',
      mensaje: 'Un fuerte abrazo desde Santa Cruz',
      tipoRegalo: 'abrazo',
      moneda: 'BOB',
      verificado: true
    },
    {
      nombre: 'Madrina Rosa',
      mensaje: 'Para tu fiesta de 15 (ya casi!)',
      tipoRegalo: 'torta',
      moneda: 'BOB',
      monto: 100,
      verificado: true
    },
    {
      nombre: 'Amigo del colegio',
      mensaje: 'Felicidades!',
      tipoRegalo: 'abrazo',
      moneda: 'BOB',
      verificado: false
    }
  ]

  for (const regalo of regalosEjemplo) {
    await prisma.regalo.create({
      data: regalo
    })
  }

  console.log(`✅ ${regalosEjemplo.length} regalos de ejemplo creados`)
}

main()
  .catch(e => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })