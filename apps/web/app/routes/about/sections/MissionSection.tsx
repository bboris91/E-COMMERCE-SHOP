type Props = {
  heading: string | null
  text: string | null
}

export function MissionSection({ heading, text }: Props) {
  if (!heading && !text) return null

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="rounded-(--radius-base) px-8 py-12 sm:px-16"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-background))' }}
        >
          {heading && (
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6"
              style={{ color: 'var(--color-primary)' }}
            >
              {heading}
            </h2>
          )}
          {text && (
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {text}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
