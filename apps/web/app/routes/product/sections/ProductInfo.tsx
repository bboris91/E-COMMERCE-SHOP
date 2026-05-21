import { useTranslation } from 'react-i18next'

type Props = {
  title: string
  category: { title: string; slug: string } | null
}

export function ProductInfo({ title, category }: Props) {
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
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        {t('products.priceInStore')}
      </p>
    </div>
  )
}
