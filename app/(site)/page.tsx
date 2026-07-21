import { PlanetHero } from '@/components/PlanetHero'
import { DropTimer } from '@/components/DropTimer'
import { HomeFeaturedProducts } from '@/components/HomeFeaturedProducts'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import Link from 'next/link'

async function getNextDrop() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('drops')
      .select('*')
      .eq('is_active', true)
      .gt('drop_date', new Date().toISOString())
      .order('drop_date', { ascending: true })
      .limit(1)
      .single()
    return data
  } catch {
    return null
  }
}

async function getFeaturedProducts() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
      .limit(4)
    return data || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [nextDrop, featuredProducts] = await Promise.all([
    getNextDrop(),
    getFeaturedProducts(),
  ])

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* HERO — PLANÈTE CONTAMINÉE */}
      <PlanetHero />

      {/* DROP TIMER */}
      {nextDrop && (
        <section style={{
          borderTop: '1px solid #111',
          borderBottom: '1px solid #111',
          padding: '80px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #0a1a00 0%, #000 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <DropTimer
              dropDate={nextDrop.drop_date}
              dropName={nextDrop.name}
            />
          </div>
        </section>
      )}

      {/* MARQUEE — brand statement */}
      <div style={{
        borderBottom: '1px solid #111',
        overflow: 'hidden',
        padding: '20px 0',
        background: '#000',
      }}>
        <div className="marquee-track" style={{
          display: 'flex',
          gap: '60px',
          whiteSpace: 'nowrap',
          width: 'max-content',
        }}>
          {Array(12).fill(null).map((_, i) => (
            <span key={i} style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(12px, 1.5vw, 16px)',
              letterSpacing: '0.3em',
              color: i % 3 === 0 ? '#39ff14' : '#222',
            }}>
              MICRON ✦ CONTAMINATION MONDIALE ✦ LIVE UR LIFE ✦
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '120px 40px 80px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '60px',
          }}>
            <div>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: '#555',
                marginBottom: '12px',
              }}>
                SÉLECTION
              </p>
              <h2 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(32px, 5vw, 64px)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                PRODUITS<br />ACTUELS
              </h2>
            </div>
            <Link href="/shop" style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: '#555',
              textDecoration: 'none',
              borderBottom: '1px solid #333',
              paddingBottom: '4px',
            }}>
              TOUT VOIR →
            </Link>
          </div>
          <HomeFeaturedProducts products={featuredProducts} />
        </section>
      )}

      {/* ABOUT TEASER */}
      <section style={{
        padding: '120px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
        borderTop: '1px solid #111',
      }}>
        <div>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#39ff14',
            marginBottom: '20px',
          }}>
            001 — ORIGINE
          </p>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 52px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '32px',
          }}>
            PAS UNE MARQUE.<br />UN VIRUS.
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 300,
            fontSize: '14px',
            lineHeight: 1.8,
            color: '#666',
            maxWidth: '400px',
            marginBottom: '40px',
          }}>
            Les premiers drops se commandaient uniquement par Telegram, en crypto.
            Pas de boutique. Pas de pub. Juste le bouche-à-oreille.
            Le vrai delire des passionnés.
          </p>
          <Link href="/about" style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#fff',
            textDecoration: 'none',
            borderBottom: '1px solid #fff',
            paddingBottom: '4px',
          }}>
            EN SAVOIR PLUS →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
        }}>
          {['EXCLUSIVE', 'PLUG', 'TRAP', 'CULTURE'].map((word, i) => (
            <div key={word} style={{
              padding: '40px 24px',
              background: i % 2 === 0 ? '#0a0a0a' : '#050505',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '18px',
                letterSpacing: '0.1em',
                color: '#222',
              }}>
                {word}
              </span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
