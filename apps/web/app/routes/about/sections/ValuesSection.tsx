import { Heart, Users, Award, Leaf, Star, Smile, Globe, Zap, type LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Heart, Users, Award, Leaf, Star, Smile, Globe, Zap,
}

type Value = {
  icon: string | null
  title: string
  description: string | null
}

type Props = {
  heading: string | null
  values: Value[] | null
}

export function ValuesSection({ heading, values }: Props) {
  if (!values?.length) return null

  return (
    <section className="py-12 sm:py-16 px-4" style={{ backgroundColor: 'var(--color-primary-light)' }}>
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
            style={{ color: 'var(--color-primary)' }}
          >
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map(({ icon, title, description }) => {
            const Icon = (icon && iconMap[icon]) || Heart
            return (
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
                {description && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
