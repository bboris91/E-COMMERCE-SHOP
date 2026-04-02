import { PortableText } from '@portabletext/react'

const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: 'var(--color-primary)' }}>{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3" style={{ color: 'var(--color-text)' }}>{children}</h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2" style={{ color: 'var(--color-text)' }}>{children}</h4>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 pl-5 py-1 my-6 italic" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-text-muted)' }}>
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="leading-relaxed mb-5" style={{ color: 'var(--color-text)' }}>{children}</p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
        {children}
      </code>
    ),
    link: ({ value, children }: { value?: { href: string; blank?: boolean }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noreferrer' : undefined}
        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-primary)' }}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value?: { asset?: { url?: string }; alt?: string; caption?: string } }) =>
      value?.asset?.url ? (
        <figure className="my-8">
          <img
            src={value.asset.url}
            alt={value.alt ?? ''}
            className="w-full rounded-(--radius-base) object-cover"
          />
          {value.caption && (
            <figcaption className="text-sm text-center mt-2" style={{ color: 'var(--color-text-muted)' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },
}

type Props = {
  body: unknown[] | null
  tags: string[] | null
}

export function PostBody({ body, tags }: Props) {
  return (
    <>
      {body && (
        <article>
          <PortableText
            value={body as unknown as Parameters<typeof PortableText>[0]['value']}
            components={portableTextComponents}
          />
        </article>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
