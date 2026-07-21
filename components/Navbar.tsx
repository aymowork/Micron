'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useCart } from '@/lib/cart'

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, setOpen } = useCart()

  const links = [
    { href: '/shop', label: 'SHOP' },
    { href: '/archive', label: 'ARCHIVE' },
    { href: '/about', label: 'ABOUT' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 40px',
        mixBlendMode: 'difference',
      }}>
        <Link href="/" style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '20px',
          letterSpacing: '0.15em',
          color: '#fff',
          textDecoration: 'none',
        }}>
          MICRON
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}
          className="hidden-mobile">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: pathname === l.href ? '#39ff14' : '#fff',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}>
              {l.label}
            </Link>
          ))}

          {/* Cart icon */}
          <button
            onClick={() => setOpen(true)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
            }}
            aria-label="Ouvrir le panier"
          >
            {/* Bag icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: '#39ff14',
                color: '#000',
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: cart + hamburger */}
        <div style={{ display: 'none', alignItems: 'center', gap: '20px' }} className="show-mobile">
          <button
            onClick={() => setOpen(true)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'none',
              padding: 0,
            }}
            aria-label="Panier"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                background: '#39ff14',
                color: '#000',
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                fontWeight: 700,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none',
              color: '#fff', cursor: 'none',
              flexDirection: 'column', gap: '5px',
              display: 'flex',
            }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff' }} />
            <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '1px', background: '#fff' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '40px',
        }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '48px',
                letterSpacing: '0.1em',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
