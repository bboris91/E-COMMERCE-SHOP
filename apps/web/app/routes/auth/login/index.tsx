import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()
  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('login.title')}
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{t('login.comingSoon')}</p>
    </main>
  )
}
