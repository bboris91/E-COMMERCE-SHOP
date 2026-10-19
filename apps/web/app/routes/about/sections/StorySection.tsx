import { delay } from '../../../lib/motion'

type Props = {
  heading: string | null
  paragraphs: string[] | null
  image: string | null
}

export function StorySection({ heading, paragraphs, image }: Props) {
  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div data-reveal="left">
          {heading && (
            <h2
              className="text-3xl sm:text-4xl font-semibold mb-6"
              style={{ color: 'var(--color-primary)' }}
            >
              {heading}
            </h2>
          )}
          <div className="space-y-4 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
        {image && (
          <div className="group rounded-(--radius-base) overflow-hidden aspect-4/3 lg:aspect-auto lg:h-96" data-reveal="right" style={delay(100)}>
            <img
              src={image}
              alt={heading ?? 'Flora Bianca'}
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-soft group-hover:scale-105"
            />
          </div>
        )}
      </div>
    </section>
  )
}
