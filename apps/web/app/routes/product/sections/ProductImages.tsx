import { useTranslation } from 'react-i18next'
import { stagger } from '../../../lib/motion'

type Props = {
  images: string[] | null
  title: string
}

export function ProductImages({ images, title }: Props) {
  const { t } = useTranslation()

  if (!images?.length) {
    return (
      <div
        className="w-full aspect-square rounded-(--radius-base) flex items-center justify-center animate-fade-up"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>{t('products.noImage')}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.map((url, i) => (
        <div key={i} className="overflow-hidden rounded-(--radius-base) animate-fade-up" style={stagger(i, 120)}>
          <img
            src={url}
            alt={title}
            className="w-full object-cover transition-transform duration-[1.2s] ease-soft hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}
