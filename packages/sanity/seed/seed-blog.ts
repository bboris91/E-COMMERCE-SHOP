import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

function block(text: string, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  }
}

// ─── Author ──────────────────────────────────────────────────────────────────

const authorDoc = {
  _id: 'author-main',
  _type: 'author',
  name: 'Flora Bianca tim',
  slug: { _type: 'slug', current: 'flora-bianca-tim' },
  bio: [block('Naš tim cvećara s ljubavlju deli savete i priče iz svakodnevnog rada s cvećem.')],
}

// ─── Posts ───────────────────────────────────────────────────────────────────

const posts = [
  {
    _id: 'post-kako-cuvati-cvece',
    _type: 'post',
    title: 'Kako duže čuvati sveže cveće',
    slug: { _type: 'slug', current: 'kako-duze-cuvati-sveze-cvece' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-03-20T10:00:00Z',
    featured: true,
    excerpt: 'Otkrijte stručne savete i trikove za produženje veka vaših predivnih buketa — da traju i nekoliko nedelja.',
    tags: ['saveti', 'nega cveća', 'buketi'],
    body: [
      block('Sveže cveće može trajati puno duže uz nekoliko jednostavnih navika koje je lako usvojiti.', 'h2'),
      block('Kada dobijete buket, odmah odrežite stabljike pod uglom od 45 stepeni. Ovim potezom povećavate površinu kroz koju cvet upija vodu i sprečavate da stabljika "sedne" ravno na dno vaze i zatvori kanal.'),
      block('Koristite čistu vazu — bakterije su glavni neprijatelji svežeg cveća. Operite vazu sapunom, isperite toplom vodom i dodajte svežu, hladnu vodu.', 'h3'),
      block('Pakeće hraniva koji dobijete uz buket nije samo ukras. Rastvorite ga u vodi prema uputstvima — sadrži šećer (hrana za cvet), kiselinu (smanjuje pH i usporava rast bakterija) i biocid (ubija bakterije).'),
      block('Menjajte vodu svaki drugi dan i svaki put kratko podrežite stabljike. Uklonite lišće koje bi se našlo ispod nivoa vode — ono truli i ubrzava kvarenje.', 'h3'),
      block('Držite buket dalje od direktnog sunca, grejača i zdela s voćem. Voće oslobađa etilen — gas koji ubrzava starenje cveća.'),
      block('Uz malo pažnje, ruže i ljiljan mogu trajati i do dve nedelje, a čvrste sorte poput krizantema i do tri.'),
    ],
    seo: {
      title: 'Kako duže čuvati sveže cveće – Flora Bianca',
      description: 'Saveti za produženje veka svežih buketa: rezanje stabljika, čista vaza, hraniva i pravi smeštaj.',
    },
  },
  {
    _id: 'post-cvece-za-vencanje',
    _type: 'post',
    title: 'Najbolje cveće za prolećna venčanja',
    slug: { _type: 'slug', current: 'najbolje-cvece-za-prolecna-vencanja' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-03-15T10:00:00Z',
    featured: false,
    excerpt: 'Planirate prolećno venčanje? Istražite najpopularnije i najlepše cvetne kombinacije koje će vaš veliki dan učiniti nezaboravnim.',
    tags: ['venčanje', 'proleće', 'saveti'],
    body: [
      block('Proleće je najpopularnije godišnje doba za venčanja — i s razlogom. Priroda se budi, a cveće je u punom sjaju.', 'h2'),
      block('Božur je kralj prolećnih venčanja. Raskošni, puni cvetovi u nijansama roze, breskve i bele stvaraju romantičnu atmosferu. Sezona im je od maja do juna.'),
      block('Ruže — klasik koji nikad ne izlazi iz mode', 'h3'),
      block('Bele i blago ružičaste ruže savršeno se uklapaju u svaki stajling. Dostupne su cele godine, a u proleće su posebno sveže i mirisne.'),
      block('Tulipani, narcisi i prolećni hijacinti donose svežinu i lagan miris koji je posebno lep na otvorenom venčanju. Dostupni su od marta do maja.'),
      block('Divlje cveće i zelenilo', 'h3'),
      block('Trend "garden style" aranžmana — neformalni buketi s divljim cvećem, eukaliptusom i raznim zelenim biljkama — sve je popularniji. Izgleda sveže, prirodno i moderno.'),
      block('Savet: rezervišite cveće najmanje 3 meseca unapred, posebno ako venčanje planirate u sezoni (maj–juni). Tada je potražnja najveća.'),
    ],
    seo: {
      title: 'Cveće za prolećna venčanja – Flora Bianca',
      description: 'Božur, ruže, tulipani i divlje cveće — sve što trebate znati za savršen venčani buket.',
    },
  },
  {
    _id: 'post-znacenje-cveca',
    _type: 'post',
    title: 'Značenje popularnog cveća',
    slug: { _type: 'slug', current: 'znacenje-popularnog-cveca' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-03-10T10:00:00Z',
    featured: false,
    excerpt: 'Naučite simboliku i skrivena značenja ruža, ljiljana, orhideja i još mnogo toga — da uvek odaberete savršeno cveće za svaku priliku.',
    tags: ['simbolika', 'ruže', 'saveti'],
    body: [
      block('Cveće govori jezikom koji prevazilazi reči. Kroz istoriju, svaka biljka nosi svoju poruku.', 'h2'),
      block('Ruža — ljubav i strast', 'h3'),
      block('Crvena ruža je univerzalni simbol romantične ljubavi. Ružičasta znači zahvalnost i divljenje, bela čistoću i novi početak, a žuta prijateljstvo i radost.'),
      block('Ljiljan — čistoća i obnova', 'h3'),
      block('Beli ljiljan simbolizuje čistoću i nevinost, zbog čega se često koristi na venčanjima i sahranama. Narandžasti tigrasti ljiljan nosi energiju i ponos.'),
      block('Orhideja — elegancija i snaga', 'h3'),
      block('Orhideja simbolizuje luksuz, lepotu i snagu. Idealan poklon za one koji cene rafinisano i dugotrajno — orhideja cveta i do nekoliko nedelja.'),
      block('Suncokret — sreća i optimizam', 'h3'),
      block('Suncokret uvek prati sunce. Simbol je pozitivnosti, odanosti i dugovečnosti. Savršen je za čestitanje novih početaka, rođendana i uspeha.'),
      block('Lavanda — mir i smirenost', 'h3'),
      block('Lavanda nosi poruku mira, čistoće i opuštanja. Popularna je kao sušeno cveće u kućnim aromaterapijama i kao ukras koji dugo traje.'),
    ],
    seo: {
      title: 'Značenje popularnog cveća – Flora Bianca',
      description: 'Simbolika ruža, ljiljana, orhideja, suncokreta i lavande — odaberite pravo cveće za svaku priliku.',
    },
  },
  {
    _id: 'post-diy-aranzman',
    _type: 'post',
    title: 'DIY aranžiranje cveća: vodič za početnike',
    slug: { _type: 'slug', current: 'diy-aranziranje-cveca-vodic-za-pocetnike' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-03-05T10:00:00Z',
    featured: false,
    excerpt: 'Želite sami da napravite predivne aranžmane? Pratite naš korak-po-korak vodič i postanite kućni cvetni dizajner.',
    tags: ['DIY', 'aranžiranje', 'saveti'],
    body: [
      block('Aranžiranje cveća nije privilegija stručnjaka — uz malo znanja i strpljenja, i vi možete napraviti predivan buket.', 'h2'),
      block('Šta vam je potrebno', 'h3'),
      block('Potrebne su vam: cvetne makaze ili oštar nož, čista vaza ili posuda, cvetnjački sunđer (oasis) za složenije aranžmane, i naravno — sveže cveće.'),
      block('Korak 1 — Odaberite glavno cveće', 'h3'),
      block('Počnite s 1-2 vrste "glavnog" cveća (npr. ruže, božur, ljiljan). Ovo je fokalna tačka vašeg aranžmana.'),
      block('Korak 2 — Dodajte prateće cveće', 'h3'),
      block('Prateće cveće (eustoma, alstroemeria, beli gipsofil) popunjava prostor između glavnih cvetova i daje dubinu aranžmanu.'),
      block('Korak 3 — Zelenilo i listovi', 'h3'),
      block('Eukaliptus, ruscus ili ivy list daju volumen i naglašavaju boje cveća. Uvek ih dodajte na kraju.'),
      block('Režite stabljike pod uglom i uklonite sve lišće ispod nivoa vode. Složite cveće spiralnom tehnikom — svaka stabljika kreće od iste tačke i blago se naginje u suprotnu stranu od prethodne.'),
    ],
    seo: {
      title: 'DIY aranžiranje cveća za početnike – Flora Bianca',
      description: 'Naučite aranžirati cveće kod kuće uz naš korak-po-korak vodič za početnike.',
    },
  },
  {
    _id: 'post-sezonsko-cvece',
    _type: 'post',
    title: 'Sezonsko cveće: šta cveta sada',
    slug: { _type: 'slug', current: 'sezonsko-cvece-sta-cveta-sada' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-02-28T10:00:00Z',
    featured: false,
    excerpt: 'Otkrijte koje cveće je na vrhuncu ove sezone i zašto je odabir sezonskog cveća bolji za kvalitet, cenu i okolinu.',
    tags: ['sezonsko', 'saveti', 'ekologija'],
    body: [
      block('Sezonsko cveće je uvek svežije, jeftinije i ekološki prihvatljivije od cveća koje se uzgaja u staklenicima ili uvozi iz dalekih zemalja.', 'h2'),
      block('Proleće (mart–maj)', 'h3'),
      block('Zvezde proleća su tulipani, narcisi, hijacinti, božur i ljiljan. Lagani mirisi i pastelne boje čine ovo godišnje doba omiljenim za venčanja i poklone.'),
      block('Leto (juni–avgust)', 'h3'),
      block('Leto donosi suncokrete, dalije, ziniju i lavandu. Živahne boje i bujno zelenilo idealni su za dekoraciju otvorenih prostora.'),
      block('Jesen (septembar–novembar)', 'h3'),
      block('Jesenja paleta uključuje krizanteme, anemone i šipak. Topli tonovi ćilibara, bordo i narandžaste savršeno se uklapaju u jesenski ambijent.'),
      block('Zima (decembar–februar)', 'h3'),
      block('Zimi dominiraju amarilis, božićna ruža (helleborus) i sušeno cveće. Kombinacije s granama, borovima i bobicama daju topao, zimski karakter.'),
      block('Kupovinom sezonskog cveća podržavate lokalne uzgajivače, smanjujete ugljični otisak i dobijate cveće koje je duže sveže.'),
    ],
    seo: {
      title: 'Sezonsko cveće – šta cveta kada – Flora Bianca',
      description: 'Vodič po sezonskom cveću: proleće, leto, jesen i zima — uvek znajte šta je najsvežije.',
    },
  },
  {
    _id: 'post-odrzivi-vrt',
    _type: 'post',
    title: 'Kako napraviti održivi cvetni vrt',
    slug: { _type: 'slug', current: 'kako-napraviti-odrzivi-cvetni-vrt' },
    author: { _type: 'reference', _ref: 'author-main' },
    publishedAt: '2026-02-20T10:00:00Z',
    featured: false,
    excerpt: 'Naučite da uzgajate sopstveni ekološki cvetni vrt s autohtonim biljkama koje privlače oprašivače i podržavaju lokalne ekosisteme.',
    tags: ['vrt', 'ekologija', 'saveti'],
    body: [
      block('Sopstveni cvetni vrt nije san — čak i na balkonu ili malom terenu možete napraviti pravo malo cvetno utočište.', 'h2'),
      block('Autohtone biljke su temelj', 'h3'),
      block('Sadite biljke koje prirodno rastu u vašem podneblju. One su prilagođene lokalnoj klimi, trebaju manje vode i privlače autohtone oprašivače — pčele, leptire i bumbara.'),
      block('Kompost umesto hemijskih đubriva', 'h3'),
      block('Napravite sopstveni kompost od kuhinjskog otpada i baštenskog otpada. Bogat je hranivim materijama i poboljšava strukturu zemljišta bez hemikalija.'),
      block('Skupljanje kišnice', 'h3'),
      block('Postavite jednostavnu burad za kišnicu. Cveće voli meku, prirodnu vodu bez hlora — i vaš račun za vodu će se smanjiti.'),
      block('Mešanje biljaka', 'h3'),
      block('Sadite cveće između povrća i začinskog bilja. Neveni teraju štetočine, lavanda privlači pčele, a razlika daje azot zemljištu.'),
      block('Mali korak kojim pokazujete ljubav prema prirodi — i dobijate sveže cveće iz bašte. Nema ničeg zadovoljnijeg od buketa iz sopstvenog vrta.'),
    ],
    seo: {
      title: 'Održivi cvetni vrt – Flora Bianca',
      description: 'Saveti za ekološki vrt s autohtonim cvećem, kompostom i skupljanjem kišnice.',
    },
  },
]

async function seedBlog() {
  console.log('📝 Seeding blog content (Serbian — ekavica)...\n')

  const transaction = client.transaction()

  transaction.createOrReplace(authorDoc)
  console.log('✓ Author')

  for (const post of posts) {
    transaction.createOrReplace(post)
  }
  console.log(`✓ ${posts.length} blog posts`)

  await transaction.commit()

  console.log('\n✅ Done! Publish the posts in Sanity Studio to make them live.')
}

seedBlog().catch((err) => {
  console.error('❌ Blog seed failed:', err.message)
  process.exit(1)
})
