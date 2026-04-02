type Props = {
  images: string[] | null
  title: string
}

export function ProductImages({ images, title }: Props) {
  if (!images?.length) {
    return (
      <div
        className="w-full aspect-square rounded-(--radius-base) flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <span style={{ color: 'var(--color-text-muted)' }}>No image</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {images.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={title}
          className="w-full rounded-(--radius-base) object-cover"
        />
      ))}
    </div>
  )
}
