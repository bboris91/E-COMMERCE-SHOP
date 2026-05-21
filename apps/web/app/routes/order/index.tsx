import { useTranslation } from 'react-i18next'

export default function Order() {
  const { t } = useTranslation()
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('order.title')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{t('order.comingSoon')}</p>
    </main>
  )
}
