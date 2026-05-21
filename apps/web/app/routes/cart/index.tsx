import { useTranslation } from 'react-i18next'

export default function Cart() {
  const { t } = useTranslation()
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('cart.title')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{t('cart.comingSoon')}</p>
    </main>
  )
}
