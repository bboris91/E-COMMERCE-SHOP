type Props = {
  heading: string
  subheading: string | null
}

export function HeaderSection({ heading, subheading }: Props) {
  return (
    <section className="py-16 sm:py-20 text-center px-4">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight"
          style={{ color: 'var(--color-primary)' }}
        >
          {heading}
        </h1>
        {subheading && (
          <p className="text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}
