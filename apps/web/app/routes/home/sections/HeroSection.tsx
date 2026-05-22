import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.css'

type HeroData = {
  heading: string
  subheading: string | null
  backgroundImages: string[] | null
  primaryCta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string } | null
}

const SLIDE_INTERVAL = 4000

const sectionStyle = (dark: boolean) => ({
  background: dark
    ? 'linear-gradient(135deg, #1a1018 0%, #2a1520 50%, #3a1a28 100%)'
    : 'linear-gradient(135deg, #fff5f7 0%, #fde8ef 50%, #f9d0df 100%)',
  minHeight: 'calc(100vh - 80px)',
})

function CTAButtons({ hero }: { hero: HeroData }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {hero.primaryCta && (
        <Link to={hero.primaryCta.href} className="px-6 py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
          {hero.primaryCta.label}
        </Link>
      )}
      {hero.secondaryCta && (
        <Link to={hero.secondaryCta.href} className="px-6 py-3 rounded-(--radius-base) font-semibold border transition-opacity hover:opacity-80" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'rgba(255,255,255,0.6)' }}>
          {hero.secondaryCta.label}
        </Link>
      )}
    </div>
  )
}

export function HeroSection({ hero }: { hero: HeroData }) {
  const images = hero.backgroundImages?.filter(Boolean) ?? []
  const [dark, setDark] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const check = () => setDark(document.documentElement.dataset.dark === 'true')
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-dark'] })
    return () => observer.disconnect()
  }, [])
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const count = images.length

  function getPosition(index: number) {
    const diff = (index - active + count) % count
    if (diff === 0) return 'center'
    if (diff === 1 || (diff === count - 1 && count === 2)) return 'right'
    if (diff === count - 1) return 'left'
    return 'hidden'
  }

  async function applyTransforms() {
    const { gsap } = await import('gsap')
    slidesRef.current.forEach((el, i) => {
      if (!el) return
      const pos = getPosition(i)
      if (pos === 'center') {
        gsap.to(el, { x: '0%', y: '0%', rotateY: 0, rotateZ: 0, scale: 1, opacity: 1, zIndex: 10, duration: 1.2, ease: 'power4.inOut' })
      } else if (pos === 'left') {
        gsap.to(el, { x: '-75%', y: '0%', rotateY: -40, rotateZ: 0, scale: 0.8, opacity: 0.6, zIndex: 5, duration: 1.2, ease: 'power4.inOut' })
      } else if (pos === 'right') {
        gsap.to(el, { x: '75%', y: '0%', rotateY: 40, rotateZ: 0, scale: 0.8, opacity: 0.6, zIndex: 5, duration: 1.2, ease: 'power4.inOut' })
      } else {
        gsap.to(el, { x: pos === 'hidden' ? '150%' : '-150%', y: '0%', rotateY: 0, rotateZ: 0, scale: 0.6, opacity: 0, zIndex: 1, duration: 1.2, ease: 'power4.inOut' })
      }
    })
  }

  useEffect(() => { applyTransforms() }, [active, count])

  useEffect(() => {
    if (count <= 1) return
    intervalRef.current = setInterval(() => setActive((prev) => (prev + 1) % count), SLIDE_INTERVAL)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [count])

  function goTo(index: number) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActive(index)
    intervalRef.current = setInterval(() => setActive((prev) => (prev + 1) % count), SLIDE_INTERVAL)
  }

  if (!images.length) {
    return (
      <section className="w-full flex items-center justify-center text-center px-4 py-24 flex-col" style={sectionStyle(dark)}>
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{hero.heading}</h1>
        {hero.subheading && <p className="text-lg md:text-xl mb-8" style={{ color: 'var(--color-text-muted)' }}>{hero.subheading}</p>}
        <CTAButtons hero={hero} />
      </section>
    )
  }

  return (
    <section className="w-full overflow-hidden flex flex-col justify-center" style={sectionStyle(dark)}>

      {/* Text */}
      <div className="text-center px-4 pt-10 pb-8 relative z-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>{hero.heading}</h1>
        {hero.subheading && <p className="text-lg md:text-xl mb-6" style={{ color: 'var(--color-text-muted)' }}>{hero.subheading}</p>}
        <CTAButtons hero={hero} />
      </div>

      {/* Mobile — Swiper fade */}
      <div className="block md:hidden px-3 pb-10">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: SLIDE_INTERVAL, disableOnInteraction: false }}
          loop={count > 1}
          pagination={{ clickable: true }}
          style={{ paddingBottom: '32px' }}
        >
          {images.map((url, i) => (
            <SwiperSlide key={i}>
              <div className="rounded-lg overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop — GSAP 3D carousel */}
      <div className="hidden md:block pb-10">
        <div className="relative flex items-center justify-center" style={{ height: '420px', perspective: '1200px' }}>
          {images.map((url, i) => (
            <div
              key={i}
              ref={(el) => { slidesRef.current[i] = el }}
              onClick={() => goTo(i)}
              className="absolute rounded-lg overflow-hidden shadow-2xl cursor-pointer"
              style={{ width: '55%', maxWidth: '720px', aspectRatio: '16/9', transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
