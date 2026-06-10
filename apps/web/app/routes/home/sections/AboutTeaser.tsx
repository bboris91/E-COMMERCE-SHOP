import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

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
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Image — rendered second on desktop so text leads */}
        {about.storyImage ? (
          <div className="overflow-hidden rounded-(--radius-base) lg:order-last">
            <img
              src={about.storyImage}
              alt={about.heading}
              className="w-full h-80 lg:h-[480px] object-cover"
            />
          </div>
        ) : (
          <div
            className="w-full h-80 lg:h-[480px] rounded-(--radius-base) lg:order-last"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          />
        )}

        {/* Text */}
        <div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
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
          <Link
            to="/o-nama"
            className="inline-block px-6 py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            {t('about.readMore')}
          </Link>
        </div>
      </div>
    </section>
  )
}
