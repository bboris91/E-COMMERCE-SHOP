import { useTranslation } from 'react-i18next'
import { PortableText } from '@portabletext/react'
import { delay } from '../../../lib/motion'

type Props = {
  title: string
  category: { title: string; slug: string } | null
  description: unknown[] | null
}

export function ProductInfo({ title, category, description }: Props) {
  const { t } = useTranslation()

  return (
    <div className="md:sticky md:top-28 self-start animate-fade-up" style={delay(150)}>
      {category && (
        <span className="eyebrow">{category.title}</span>
      )}
      <h1 className="text-3xl md:text-5xl font-semibold mt-3 mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>
      {description && (
        <div className="mb-6 text-base leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <PortableText value={description as unknown as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        {t('products.priceInStore')}
      </p>
    </div>
  )
}
