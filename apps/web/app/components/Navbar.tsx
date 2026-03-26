import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Menu, X, Sun, Moon } from 'lucide-react'

type Props = {
  shopName: string
  logo: string | null
  dark: boolean
  onToggleDark: () => void
}

const navLinks = [
  { name: 'Početna', path: '/' },
  { name: 'Proizvodi', path: '/products' },
  { name: 'Blog', path: '/blog' },
  { name: 'O nama', path: '/o-nama' },
]

export function Navbar({ shopName, logo, dark, onToggleDark }: Props) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <nav
      className="sticky top-0 z-50 shadow-sm"
      style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {logo ? (
              <img src={logo} alt={shopName} className="h-10 sm:h-16 w-auto" />
            ) : (
              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
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
                className="text-xl font-medium transition-colors"
                style={{ color: isActive(link.path) ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={onToggleDark}
              aria-label="Toggle dark mode"
              className="p-2 rounded-(--radius-base) transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              style={{ color: 'var(--color-text)' }}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-1"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className="block py-2 px-3 rounded-(--radius-base) text-base font-medium transition-colors"
              style={
                isActive(link.path)
                  ? { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }
                  : { color: 'var(--color-text)' }
              }
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
