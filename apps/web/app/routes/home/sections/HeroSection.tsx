import { Link } from 'react-router'
import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import { ArrowRight } from 'lucide-react'
import { delay } from '../../../lib/motion'

type HeroData = {
  heading: string
  subheading: string | null
  backgroundImages: string[] | null
  primaryCta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string } | null
}

const SLIDE_INTERVAL = 4000

const sectionStyle = () => ({
  background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-background) 100%)',
  minHeight: 'calc(100vh - 80px)',
})

function CTAButtons({ hero }: { hero: HeroData }) {
  return (
    <div className="flex gap-4 justify-center flex-wrap animate-fade-up" style={delay(300)}>
      {hero.primaryCta && (
        <Link to={hero.primaryCta.href} className="btn btn-primary">
          {hero.primaryCta.label}
          <ArrowRight className="btn-arrow w-4 h-4" />
        </Link>
      )}
      {hero.secondaryCta && (
        <Link to={hero.secondaryCta.href} className="btn btn-outline">
          {hero.secondaryCta.label}
        </Link>
      )}
    </div>
  )
}

function HeroText({ hero }: { hero: HeroData }) {
  return (
    <>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold mb-5 max-w-4xl mx-auto leading-[1.05] animate-fade-up" style={{ color: 'var(--color-primary)' }}>
        {hero.heading}
      </h1>
      {hero.subheading && (
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-up" style={{ ...delay(150), color: 'var(--color-text-muted)' }}>
          {hero.subheading}
        </p>
      )}
      <CTAButtons hero={hero} />
    </>
  )
}

// Soft floating color shapes behind the hero content
function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-40 animate-float"
        style={{ backgroundColor: 'var(--color-accent)' }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25 animate-float"
        style={{ backgroundColor: 'var(--color-primary)', animationDelay: '-6s' }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-30 animate-float"
        style={{ backgroundColor: 'var(--color-accent)', animationDelay: '-11s' }}
      />
    </div>
  )
}

export function HeroSection({ hero }: { hero: HeroData }) {
  const images = hero.backgroundImages?.filter(Boolean) ?? []
  const [active, setActive] = useState(0)
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
      <section className="relative isolate overflow-hidden w-full flex items-center justify-center text-center px-4 py-24 flex-col" style={sectionStyle()}>
        <Blobs />
        <HeroText hero={hero} />
      </section>
    )
  }

  return (
    <section className="relative isolate w-full overflow-hidden flex flex-col justify-center" style={sectionStyle()}>
      <Blobs />

      {/* Text */}
      <div className="text-center px-4 pt-10 pb-8 relative z-20">
        <HeroText hero={hero} />
      </div>

      {/* Mobile — Swiper fade */}
      <div className="block md:hidden px-3 pb-10 animate-fade-up" style={delay(450)}>
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
              <div className="rounded-(--radius-base) overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop — GSAP 3D carousel */}
      <div className="hidden md:block pb-10 animate-fade-up" style={delay(450)}>
        <div className="relative flex items-center justify-center" style={{ height: '420px', perspective: '1200px' }}>
          {images.map((url, i) => (
            <div
              key={i}
              ref={(el) => { slidesRef.current[i] = el }}
              onClick={() => goTo(i)}
              className="absolute rounded-(--radius-base) overflow-hidden shadow-2xl cursor-pointer"
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
