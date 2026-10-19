import { useEffect } from 'react'

// Marks `[data-reveal]` elements with `data-revealed` once they scroll into view.
// The transition itself lives in app.css. A data attribute (not a class) is used
// so React re-renders never strip it.
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )

    const observeAll = () =>
      document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el))

    observeAll()
    // Pick up elements rendered by later navigations
    const mo = new MutationObserver(observeAll)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
