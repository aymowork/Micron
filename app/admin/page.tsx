import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) redirect('/admin/login')

  let stats = { products: 0, available: 0, soldOut: 0, drops: 0 }
  try {
    const supabase = createServiceClient()
    const [{ count: total }, { count: avail }, { count: sold }, { count: drops }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'available'),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'sold_out'),
      supabase.from('drops').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])
    stats = { products: total ?? 0, available: avail ?? 0, soldOut: sold ?? 0, drops: drops ?? 0 }
  } catch { /* no db yet */ }

  const statCards = [
    { label: 'PRODUITS TOTAL', value: stats.products, color: '#fff' },
    { label: 'DISPONIBLES', value: stats.available, color: '#39ff14' },
    { label: 'SOLD OUT', value: stats.soldOut, color: '#ff0000' },
    { label: 'DROPS ACTIFS', value: stats.drops, color: '#555' },
  ]

  return (
    <div style={{ padding: '48px 48px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '56px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#39ff14',
          marginBottom: '12px',
        }}>
          ADMIN — MICRON
        </p>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '40px',
          letterSpacing: '-0.02em',
          color: '#fff',
        }}>
          DASHBOARD
        </h1>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        marginBottom: '56px',
      }}>
        {statCards.map(s => (
          <div key={s.label} style={{
            padding: '32px 28px',
            background: '#0a0a0a',
          }}>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: '#444',
              marginBottom: '16px',
            }}>
              {s.label}
            </p>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              fontSize: '40px',
              color: s.color,
              letterSpacing: '-0.02em',
            }}>
              {String(s.value).padStart(2, '0')}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#333',
          marginBottom: '24px',
        }}>
          ACTIONS RAPIDES
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/admin/produits?new=1" style={{
            padding: '12px 24px',
            background: '#fff',
            color: '#000',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textDecoration: 'none',
          }}>
            + NOUVEAU PRODUIT
          </Link>
          <Link href="/admin/drops?new=1" style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #222',
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textDecoration: 'none',
          }}>
            + NOUVEAU DROP
          </Link>
        </div>
      </div>

      {/* Info box */}
      <div style={{
        padding: '24px',
        border: '1px solid #1a1a1a',
        maxWidth: '560px',
      }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#39ff14',
          marginBottom: '12px',
        }}>
          WHOP — INTÉGRATION
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          lineHeight: 1.7,
          color: '#555',
        }}>
          Pour activer le checkout Whop sur un produit, ajoute l'URL de la page
          produit Whop dans le champ "Whop URL" lors de la création ou modification du produit.
        </p>
      </div>
    </div>
  )
}
