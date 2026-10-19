import { delay } from '../../../lib/motion'

type Props = {
  heading: string
  subheading: string | null
}

export function HeaderSection({ heading, subheading }: Props) {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28 text-center px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 w-xl h-80 rounded-full blur-3xl opacity-25 animate-float"
        style={{ backgroundColor: 'var(--color-accent)' }}
      />
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl sm:text-6xl font-semibold mb-6 animate-fade-up"
          style={{ color: 'var(--color-primary)' }}
        >
          {heading}
        </h1>
        {subheading && (
          <p className="text-lg sm:text-xl leading-relaxed animate-fade-up" style={{ ...delay(150), color: 'var(--color-text-muted)' }}>
            {subheading}
          </p>
        )}
      </div>
    </section>
  )
}
