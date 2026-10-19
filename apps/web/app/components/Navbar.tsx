import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { stagger } from '../lib/motion'

type Props = {
  shopName: string
  logo: string | null
  dark: boolean
  onToggleDark: () => void
}

export function Navbar({ shopName, logo, dark, onToggleDark }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.products'), path: '/products' },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.about'), path: '/o-nama' },
  ]

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl transition-shadow duration-500"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-surface) 78%, transparent)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: scrolled ? '0 10px 30px -18px rgba(0, 0, 0, 0.25)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-500 ${
            scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
          }`}
        >

          {/* Logo */}
          <Link to="/" className="h-full flex items-center gap-2 shrink-0 p-1 transition-transform duration-300 hover:scale-[1.03]">
            {logo ? (
              <img src={logo} alt={shopName} className="h-full w-auto rounded-xl" />
            ) : (
              <span className="text-xl font-bold font-display" style={{ color: 'var(--color-primary)' }}>
                {shopName}
              </span>
            )}
          </Link>

          {/* Desktop nav — right-aligned */}
          <div className="hidden md:flex items-center gap-8 ml-auto mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-primary
                  after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full after:rounded-full after:bg-accent
                  after:origin-left after:transition-transform after:duration-500 after:ease-soft
                  ${isActive(link.path) ? 'text-primary after:scale-x-100' : 'text-text-muted after:scale-x-0 hover:after:scale-x-100'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              aria-label={t('nav.toggleDark')}
              className="p-2 rounded-full transition-colors hover:bg-primary-light"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <span key={dark ? 'sun' : 'moon'} className="block animate-[spin-in_0.5s_var(--ease-soft)]">
                {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </span>
            </button>

            <button
              className="md:hidden p-2 rounded-full transition-colors hover:bg-primary-light"
              onClick={() => setOpen(!open)}
              aria-label={t('nav.toggleMenu')}
              aria-expanded={open}
              style={{ color: 'var(--color-text)' }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — grid-rows trick animates height */}
      <div
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-500 ease-soft ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="border-t px-4 py-4 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
            {navLinks.map((link, i) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block py-2 px-3 rounded-(--radius-base) text-base font-medium transition-all duration-500 ${
                  open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
                style={{
                  ...stagger(i, 60),
                  transitionDelay: open ? 'var(--delay)' : '0ms',
                  ...(isActive(link.path)
                    ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }
                    : { color: 'var(--color-text)' }),
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
