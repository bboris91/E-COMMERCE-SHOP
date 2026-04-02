import { Link } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

type HeroData = {
  heading: string
  subheading: string | null
  backgroundImages: string[] | null
  primaryCta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string } | null
}

export function HeroSection({ hero }: { hero: HeroData }) {
  const images = hero.backgroundImages?.filter(Boolean) ?? []
  const hasImages = images.length > 0

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
      {/* Background slideshow */}
      {hasImages ? (
        <>
          <div className="absolute inset-0 z-0">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={images.length > 1}
              allowTouchMove={false}
              className="w-full h-full"
            >
              {images.map((url, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="w-full h-full min-h-[70vh]"
                    style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="absolute inset-0 bg-black/35 z-10" />
        </>
      ) : (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: 'var(--color-primary-light)' }} />
      )}

      {/* Content */}
      <div className="relative z-20 max-w-2xl mx-auto">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: hasImages ? '#fff' : 'var(--color-primary)' }}
        >
          {hero.heading}
        </h1>
        {hero.subheading && (
          <p
            className="text-lg md:text-xl mb-8 opacity-90"
            style={{ color: hasImages ? '#fff' : 'var(--color-text-muted)' }}
          >
            {hero.subheading}
          </p>
        )}
        <div className="flex gap-4 justify-center flex-wrap">
          {hero.primaryCta && (
            <Link
              to={hero.primaryCta.href}
              className="px-6 py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              {hero.primaryCta.label}
            </Link>
          )}
          {hero.secondaryCta && (
            <Link
              to={hero.secondaryCta.href}
              className="px-6 py-3 rounded-(--radius-base) font-semibold border transition-opacity hover:opacity-80"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
