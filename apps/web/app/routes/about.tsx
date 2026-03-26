import { Heart, Users, Award, Leaf } from 'lucide-react'

export function meta() {
  return [
    { title: 'O nama – Flora Bianca' },
    { name: 'description', content: 'Saznajte više o Flora Bianca – vašoj omiljenoj cvećari u Beogradu od 2020. godine.' },
  ]
}

const values = [
  {
    icon: Heart,
    title: 'Strast prema cveću',
    description: 'Ulažemo srce u svaki aranžman, osiguravajući da svaki cvet priča priču.',
  },
  {
    icon: Users,
    title: 'Kupac na prvom mestu',
    description: 'Vaše zadovoljstvo je naš prioritet. Ovde smo da svaki trenutak učinimo posebnim.',
  },
  {
    icon: Award,
    title: 'Garantovani kvalitet',
    description: 'Samo najfiniji, najsvežiji cvetovi ulaze u naše bukete.',
  },
  {
    icon: Leaf,
    title: 'Ekološki pristup',
    description: 'Održive prakse i lokalna nabavka za zeleniju budućnost.',
  },
]

export default function About() {
  return (
    <main>
      {/* Header */}
      <section className="py-16 sm:py-20 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight"
            style={{ color: 'var(--color-primary)' }}
          >
            O nama
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Donosimo lepotu i radost u vaš život kroz umetnost cveća
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6"
              style={{ color: 'var(--color-primary)' }}
            >
              Naša priča
            </h2>
            <div className="space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              <p>
                Flora Bianca je osnovana 2020. godine kao mala porodična cvećara s velikim snom: doneti lepotu prirode u svaki dom i svečanost.
              </p>
              <p>
                Ono što je počelo kao skromna radnja procvetalo je u omiljenu lokalnu cvećaru koja opslužuje hiljade kupaca koji nam veruju da isporučimo njihove najdublje poruke putem cveća.
              </p>
              <p>
                Danas radimo direktno s lokalnim uzgajivačima i održivim farmama kako bismo nabavili najsvežije cvetove. Svaki aranžman je ručno izrađen od strane naših veštih cvećara koji svaku narudžbinu tretiraju kao jedinstveno umetničko delo.
              </p>
            </div>
          </div>
          <div className="rounded-(--radius-base) overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-96">
            <img
              src="https://images.unsplash.com/photo-1487530811015-780d3c28a06a?w=1080&q=80"
              alt="Flora Bianca cvećara"
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                const parent = el.parentElement
                if (parent) {
                  parent.style.background = 'var(--color-primary-light)'
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: 'var(--color-primary-light)' }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--color-primary)' }}
          >
            Naše vrednosti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <Icon size={28} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-(--radius-base) px-8 py-12 sm:px-16"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-background))' }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6"
              style={{ color: 'var(--color-primary)' }}
            >
              Naša misija
            </h2>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Stvaranje smislenih veza i proslava posebnih životnih trenutaka kroz izuzetnu cvetnu umetnost.
              Verujemo da svaki cvet ima svoju priču, a svaki aranžman je prilika za širenje radosti, ljubavi i lepote.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
