import type { CSSProperties } from 'react'

/** Delay for `animate-*` utilities and `data-reveal` elements (see app.css). */
export function delay(ms: number): CSSProperties {
  return { '--delay': `${ms}ms` } as CSSProperties
}

/** Staggered delay for the i-th item of a list, capped so long lists don't lag. */
export function stagger(i: number, step = 70, max = 8): CSSProperties {
  return delay(Math.min(i, max) * step)
}
