type Props = {
  title: string
  category: { title: string; slug: string } | null
}

export function ProductInfo({ title, category }: Props) {
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
        Price available in store
      </p>
      {/* <button
        className="w-full py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
      >
        Add to cart
      </button> */}
    </div>
  )
}
