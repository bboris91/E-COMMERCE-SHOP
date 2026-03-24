import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Flower shop tenant
  const flowerTenant = await prisma.tenant.upsert({
    where: { slug: 'flowers' },
    update: {},
    create: {
      slug: 'flowers',
      name: 'Flower Shop',
      domain: 'localhost',
      theme: 'flower-shop',
      sanityProjectId: process.env.SANITY_PROJECT_ID ?? 'placeholder',
      sanityDataset: process.env.SANITY_DATASET ?? 'production',
    },
  })
  console.log(`✓ Tenant: ${flowerTenant.name} (slug: ${flowerTenant.slug})`)

  // Admin user for the flower shop
  const hashedPassword = await bcrypt.hash('admin1234', 12)
  const admin = await prisma.user.upsert({
    where: { email_tenantId: { email: 'admin@flowershop.com', tenantId: flowerTenant.id } },
    update: {},
    create: {
      email: 'admin@flowershop.com',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: flowerTenant.id,
    },
  })
  console.log(`✓ Admin user: ${admin.email} (password: admin1234)`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
