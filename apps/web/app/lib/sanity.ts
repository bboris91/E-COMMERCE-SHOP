import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL ?? 'http://localhost:3333'

// Detect if we're running inside the Sanity Presentation iframe
const isPresentation =
  typeof window !== 'undefined' && window.parent !== window

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  stega: {
    enabled: isPresentation,
    studioUrl,
  },
})

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {})
}
