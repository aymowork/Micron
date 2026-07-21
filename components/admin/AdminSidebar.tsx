'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'DASHBOARD', icon: '◈' },
  { href: '/admin/produits', label: 'PRODUITS', icon: '◉' },
  { href: '/admin/drops', label: 'DROPS', icon: '◎' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{
      width: '220px',
      minHeight: '100vh',
      borderRight: '1px solid #111',
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 0',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
    }}>
      <div style={{ padding: '0 24px 40px' }}>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '16px',
          letterSpacing: '0.1em',
          color: '#fff',
          marginBottom: '4px',
        }}>
          MICRON
        </p>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: '#333',
        }}>
          ADMIN PANEL
        </p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 16px' }}>
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: active ? '#111' : 'transparent',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: '12px', color: active ? '#39ff14' : '#444' }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: active ? '#fff' : '#444',
              }}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '0 16px' }}>
        <div style={{ borderTop: '1px solid #111', paddingTop: '16px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '12px', color: '#333' }}>↗</span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#333',
            }}>
              VOIR SITE
            </span>
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              background: 'none',
              border: 'none',
              width: '100%',
              cursor: 'none',
            }}
          >
            <span style={{ fontSize: '12px', color: '#333' }}>⊗</span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: '#333',
            }}>
              DÉCONNEXION
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
