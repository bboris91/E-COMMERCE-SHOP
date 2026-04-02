import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { postBySlugQuery } from '../../queries/posts'
import { PostHeader } from './sections/PostHeader'
import { PostBody } from './sections/PostBody'

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

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.post?.seo?.title ?? loaderData?.post?.title ?? 'Blog'
  const description = loaderData?.post?.seo?.description ?? loaderData?.post?.excerpt ?? ''
  return [{ title: `${title} – Flora Bianca` }, { name: 'description', content: description }]
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <PostHeader
        title={post.title}
        publishedAt={post.publishedAt}
        mainImage={post.mainImage}
        mainImageAlt={post.mainImageAlt}
        author={post.author}
        categories={post.categories}
      />
      <PostBody body={post.body} tags={post.tags} />
    </main>
  )
}
