import { useTranslation } from 'react-i18next'
import { PortableText } from '@portabletext/react'

type Props = {
  title: string
  category: { title: string; slug: string } | null
  description: unknown[] | null
}

export function ProductInfo({ title, category, description }: Props) {
  const { t } = useTranslation()

  return (
    <div>
      {category && (
        <span className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
          {category.title}
        </span>
      )}
      <h1 className="text-3xl font-bold mt-2 mb-6" style={{ color: 'var(--color-text)' }}>
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
