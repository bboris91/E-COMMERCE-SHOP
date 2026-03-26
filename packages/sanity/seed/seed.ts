import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function block(text: string) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  }
}

// ─── Data ───────────────────────────────────────────────────────────────────

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  shopName: 'Flora Bianca',
  tagline: 'Sveže cveće za svaku priliku',
  contactEmail: 'zdravo@florabianca.rs',
  contactPhone: '+381 11 123 4567',
  address: 'Cvetna ulica 12, Beograd 11000',
  socialLinks: {
    instagram: 'https://instagram.com/florabianca',
    facebook: 'https://facebook.com/florabianca',
  },
  openingHours: [
    { _key: 'pon-pet', days: 'Pon – Pet', hours: '09:00 – 19:00' },
    { _key: 'subota', days: 'Subota', hours: '10:00 – 18:00' },
    { _key: 'nedjelja', days: 'Nedlja', hours: '10:00 – 16:00' },
  ],
  footerText: `© ${new Date().getFullYear()} Flora Bianca. Sva prava zadržana.`,
}

const heroSection = {
  _id: 'heroSection',
  _type: 'heroSection',
  heading: 'Ulepšajte posebne trenutke',
  subheading: 'Otkrijte sveže, ručno izrađene cvetne aranžmane za svaku priliku',
  primaryCta: { label: 'Pogledajte ponudu', href: '/products' },
  secondaryCta: { label: 'O nama', href: '/o-nama' },
}

const categories = [
  { _id: 'cat-ruze', _type: 'category', title: 'Ruže', slug: { _type: 'slug', current: 'ruze' }, description: 'Klasične i večite ruže za sve prilike' },
  { _id: 'cat-buketi', _type: 'category', title: 'Buketi', slug: { _type: 'slug', current: 'buketi' }, description: 'Ručno izrađeni mešani buketi' },
  { _id: 'cat-orhideje', _type: 'category', title: 'Orhideje', slug: { _type: 'slug', current: 'orhideje' }, description: 'Elegantne i dugotrajne orhideje' },
  { _id: 'cat-sezonsko', _type: 'category', title: 'Sezonsko cveće', slug: { _type: 'slug', current: 'sezonsko' }, description: 'Najsvežije cveće prema godišnjem dobu' },
]

const products = [
  {
    _id: 'prod-roze-ruze',
    _type: 'product',
    title: 'Buket ružičastih ruža',
    slug: { _type: 'slug', current: 'buket-ruzicastih-ruza' },
    description: [block('Elegantan buket od 12 svežih ružičastih ruža, savršen za godišnjice, rođendane ili jednostavno da nekome ulepšate dan. Svaka ruža je pažljivo odabrana i ručno vezana.')],
    category: { _type: 'reference', _ref: 'cat-ruze' },
    seo: { title: 'Buket ružičastih ruža – Flora Bianca', description: 'Sveže ružičaste ruže, ručno vezane. Dostava istog dana.' },
  },
  {
    _id: 'prod-suncokret',
    _type: 'product',
    title: 'Aranžman sa suncokretima',
    slug: { _type: 'slug', current: 'aranzman-sa-suncokretima' },
    description: [block('Veseli i topli aranžman sa svežim suncokretima koji donose sunčano raspoloženje u svaki prostor. Idealno za dočekivanje novih početaka.')],
    category: { _type: 'reference', _ref: 'cat-sezonsko' },
    seo: { title: 'Aranžman sa suncokretima – Flora Bianca', description: 'Sveži suncokreti za svaki prostor i priliku.' },
  },
  {
    _id: 'prod-proljetni-lala',
    _type: 'product',
    title: 'Prolećni tulipani',
    slug: { _type: 'slug', current: 'prolecni-tulipani' },
    description: [block('Mešavina šarenih prolećnih tulipana koji najavljuju dolazak proleća. Dostupni u raznim bojama – izaberite omiljenu kombinaciju.')],
    category: { _type: 'reference', _ref: 'cat-sezonsko' },
    seo: { title: 'Prolećni tulipani – Flora Bianca', description: 'Šareni prolećni tulipani, dostava istog dana u Beogradu.' },
  },
  {
    _id: 'prod-elegantna-orhideja',
    _type: 'product',
    title: 'Elegantna orhideja',
    slug: { _type: 'slug', current: 'elegantna-orhideja' },
    description: [block('Bela Phalaenopsis orhideja u keramičkoj saksiji – sofisticiran poklon koji traje nedeljama. Savršena za kancelariju, dom ili kao poslovni poklon.')],
    category: { _type: 'reference', _ref: 'cat-orhideje' },
    seo: { title: 'Elegantna orhideja – Flora Bianca', description: 'Bela orhideja u saksiji, elegantan poklon koji traje.' },
  },
  {
    _id: 'prod-lavanda',
    _type: 'product',
    title: 'Lavanda i mešano cveće',
    slug: { _type: 'slug', current: 'lavanda-i-mesano-cvece' },
    description: [block('Aromatičan buket lavande u kombinaciji s mešanim sezonskim cvećem. Nosi mir, lepotu i predivan miris u svaki kutak vašeg doma.')],
    category: { _type: 'reference', _ref: 'cat-buketi' },
    seo: { title: 'Lavanda i mešano cveće – Flora Bianca', description: 'Aromatičan buket lavande i sezonskog cveća.' },
  },
  {
    _id: 'prod-peonija',
    _type: 'product',
    title: 'Raj od božura',
    slug: { _type: 'slug', current: 'raj-od-bozura' },
    description: [block('Raskošan buket punih božura u nijansama roze i bele. Božuri su simbol bogatstva, lepote i sreće – savršen poklon za venčanja i godišnjice.')],
    category: { _type: 'reference', _ref: 'cat-buketi' },
    seo: { title: 'Raj od božura – Flora Bianca', description: 'Raskošan buket božura za posebne prilike.' },
  },
  {
    _id: 'prod-sareni-buket',
    _type: 'product',
    title: 'Šareni mešani buket',
    slug: { _type: 'slug', current: 'sareni-mesani-buket' },
    description: [block('Veseli buket od sezonskog cveća u živim bojama – savršen za čestitanje, proslavu ili jednostavno ulepšavanje prostora.')],
    category: { _type: 'reference', _ref: 'cat-buketi' },
    seo: { title: 'Šareni mešani buket – Flora Bianca', description: 'Veseli buket u živim bojama za svaku proslavu.' },
  },
  {
    _id: 'prod-crvene-ruze',
    _type: 'product',
    title: 'Kolekcija crvenih ruža',
    slug: { _type: 'slug', current: 'kolekcija-crvenih-ruza' },
    description: [block('Klasičan buket od 24 duboko crvene ruže – večiti simbol ljubavi i strasti. Ručno vezane s ukrašenim papirom i trakom.')],
    category: { _type: 'reference', _ref: 'cat-ruze' },
    seo: { title: 'Kolekcija crvenih ruža – Flora Bianca', description: '24 crvene ruže – savršen poklon za Valentinovo i godišnjice.' },
  },
]

const aboutPage = {
  _id: 'page-about',
  _type: 'page',
  title: 'O nama',
  slug: { _type: 'slug', current: 'o-nama' },
  body: [
    { ...block('Naša priča'), _type: 'block', style: 'h2' },
    block('Flora Bianca je osnovana 2020. godine kao mala porodična cvećara s velikim snom: doneti lepotu prirode u svaki dom i svečanost.'),
    block('Ono što je počelo kao skromna radnja procvetalo je u omiljenu lokalnu cvećaru koja opslužuje hiljade kupaca koji nam veruju da isporučimo njihove najdublje poruke putem cveća.'),
    block('Danas radimo direktno s lokalnim uzgajivačima i održivim farmama kako bismo nabavili najsvežije cvetove. Svaki aranžman je ručno izrađen od strane naših vештих cvećara koji svaku narudžbinu tretiraju kao jedinstveno umetničko delo.'),
    { ...block('Naše vrednosti'), _type: 'block', style: 'h2' },
    block('Strast prema cveću – Ulažemo srce u svaki aranžman, osiguravajući da svaki cvet priča priču.'),
    block('Kupac na prvom mestu – Vaše zadovoljstvo je naš prioritet. Ovde smo da svaki trenutak učinimo posebnim.'),
    block('Garantovani kvalitet – Samo najfiniji, najsvežiji cvetovi ulaze u naše bukete.'),
    block('Ekološki pristup – Održive prakse i lokalna nabavka za zeleniju budućnost.'),
    { ...block('Naša misija'), _type: 'block', style: 'h2' },
    block('Stvaranje smislenih veza i proslava posebnih životnih trenutaka kroz izuzetnu cvetnu umetnost. Verujemo da svaki cvet ima svoju priču, a svaki aranžman je prilika za širenje radosti, ljubavi i lepote.'),
  ],
  seo: {
    title: 'O nama – Flora Bianca',
    description: 'Saznajte više o Flora Bianca – vašoj omiljenoj cvećari u Beogradu od 2020. godine.',
  },
}

// ─── Seed ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('🌸 Seeding Sanity content (Serbian — ekavica)...\n')

  const transaction = client.transaction()

  transaction.createOrReplace(siteSettings)
  console.log('✓ Site settings')

  transaction.createOrReplace(heroSection)
  console.log('✓ Hero section')

  for (const cat of categories) {
    transaction.createOrReplace(cat)
  }
  console.log(`✓ ${categories.length} categories`)

  for (const product of products) {
    transaction.createOrReplace(product)
  }
  console.log(`✓ ${products.length} products`)

  transaction.createOrReplace(aboutPage)
  console.log('✓ About page')

  await transaction.commit()

  console.log('\n✅ Done! Open Sanity Studio to review and publish the documents.')
  console.log('   Note: documents are created as drafts — publish them in Studio to make them live.')
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
