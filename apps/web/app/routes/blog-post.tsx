import type { Route } from './+types/blog-post'
import { Link } from 'react-router'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '../lib/sanity'
import { postBySlugQuery } from '../queries/posts'

type PostDetail = {
  _id: string
  title: string
  slug: string
  publishedAt: string | null
  excerpt: string | null
  featured: boolean | null
  tags: string[] | null
  body: unknown[] | null
  mainImage: string | null
  mainImageAlt: string | null
  author: { name: string; slug: string; image: string | null; bio: unknown[] | null } | null
  categories: { title: string; slug: string }[] | null
  seo: { title: string | null; description: string | null } | null
}

export async function loader({ params }: Route.LoaderArgs) {
  const post = await sanityFetch<PostDetail>(postBySlugQuery, { slug: params.slug })
  if (!post) throw new Response('Not found', { status: 404 })
  return { post }
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.post?.seo?.title ?? data?.post?.title ?? 'Blog'
  const description = data?.post?.seo?.description ?? data?.post?.excerpt ?? ''
  return [{ title: `${title} – Flora Bianca` }, { name: 'description', content: description }]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

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

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">

      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ← Nazad na blog
      </Link>

      {/* Categories */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex gap-2 mb-4">
          {post.categories.map((cat) => (
            <span key={cat.slug} className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {cat.title}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm pb-6 mb-8 border-b" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
        {post.author && (
          <div className="flex items-center gap-2">
            {post.author.image && (
              <img src={post.author.image} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
            )}
            <span>{post.author.name}</span>
          </div>
        )}
        {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
      </div>

      {/* Main image */}
      {post.mainImage && (
        <img
          src={post.mainImage}
          alt={post.mainImageAlt ?? post.title}
          className="w-full rounded-(--radius-base) object-cover mb-10 max-h-[480px]"
        />
      )}

      {/* Body */}
      {post.body && (
        <article>
          <PortableText
            value={post.body as unknown as Parameters<typeof PortableText>[0]['value']}
            components={portableTextComponents}
          />
        </article>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {post.tags.map((tag) => (
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
    </main>
  )
}
