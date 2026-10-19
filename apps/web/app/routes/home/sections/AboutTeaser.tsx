import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { delay } from '../../../lib/motion'

type Props = {
  about: {
    heading: string
    subheading: string | null
    storyHeading: string | null
    storyParagraphs: string[] | null
    storyImage: string | null
  }
}

export function AboutTeaser({ about }: Props) {
  const { t } = useTranslation()

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Image — rendered second on desktop so text leads */}
        <div className="relative lg:order-last" data-reveal="right">
          {/* Offset accent frame */}
          <div
            aria-hidden
            className="absolute inset-0 translate-x-4 translate-y-4 rounded-(--radius-base)"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 20%, transparent)' }}
          />
          {about.storyImage ? (
            <div className="relative overflow-hidden rounded-(--radius-base) group">
              <img
                src={about.storyImage}
                alt={about.heading}
                loading="lazy"
                className="w-full h-80 lg:h-120 object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
              />
            </div>
          ) : (
            <div
              className="relative w-full h-80 lg:h-120 rounded-(--radius-base)"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            />
          )}
        </div>

        {/* Text */}
        <div data-reveal="left" style={delay(100)}>
          <h2 className="text-3xl md:text-5xl font-semibold mb-5" style={{ color: 'var(--color-text)' }}>
            {about.storyHeading ?? about.heading}
          </h2>
          {about.subheading && (
            <p className="text-lg mb-4" style={{ color: 'var(--color-primary)' }}>
              {about.subheading}
            </p>
          )}
          {about.storyParagraphs && about.storyParagraphs.length > 0 && (
            <p className="leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
              {about.storyParagraphs[0]}
            </p>
          )}
          <Link to="/o-nama" className="btn btn-primary">
            {t('about.readMore')}
            <ArrowRight className="btn-arrow w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
