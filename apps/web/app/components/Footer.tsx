import { Link } from 'react-router'
import { Mail, Phone, MapPin } from 'lucide-react'

type Props = {
  shopName: string
  logo: string | null
  tagline: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  socialLinks: { instagram?: string; facebook?: string; tiktok?: string } | null
  openingHours: { days: string; hours: string }[] | null
  footerText: string | null
}

const quickLinks = [
  { name: 'Početna', path: '/' },
  { name: 'Proizvodi', path: '/products' },
  { name: 'Blog', path: '/blog' },
  { name: 'O nama', path: '/pages/o-nama' },
]

export function Footer({
  shopName,
  logo,
  tagline,
  contactEmail,
  contactPhone,
  address,
  socialLinks,
  openingHours,
  footerText,
}: Props) {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            {logo ? (
              <div className="mb-4 bg-white p-2 rounded-(--radius-base) inline-block">
                <img src={logo} alt={shopName} className="h-8 w-auto" />
              </div>
            ) : (
              <p className="text-xl font-bold mb-4">{shopName}</p>
            )}
            {tagline && <p className="text-sm opacity-80">{tagline}</p>}

            {/* Social links */}
            {socialLinks && (
              <div className="flex gap-3 mt-4">
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="opacity-80 hover:opacity-100 transition-opacity">
                    {/* Instagram icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="opacity-80 hover:opacity-100 transition-opacity">
                    {/* Facebook icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:opacity-100 transition-opacity">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm opacity-80">
              {contactPhone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{contactPhone}</span>
                </li>
              )}
              {contactEmail && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{contactEmail}</span>
                </li>
              )}
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{address}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Opening hours */}
          {openingHours && openingHours.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-sm opacity-80">
                {openingHours.map((row, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{row.days}</span>
                    <span>{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-70">
          <p>{footerText ?? `© ${new Date().getFullYear()} ${shopName}. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  )
}
