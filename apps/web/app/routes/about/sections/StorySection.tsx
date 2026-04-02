type Props = {
  heading: string | null
  paragraphs: string[] | null
  image: string | null
}

export function StorySection({ heading, paragraphs, image }: Props) {
  return (
    <section className="py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          {heading && (
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6"
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
          <div className="rounded-(--radius-base) overflow-hidden aspect-4/3 lg:aspect-auto lg:h-96">
            <img
              src={image}
              alt={heading ?? 'Flora Bianca'}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
