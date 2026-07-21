import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductViewer } from '@/components/ProductViewer'
import { AddToCartButton } from '@/components/AddToCartButton'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function getProduct(slug: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    return data
  } catch {
    return null
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const isAvailable = product.status === 'available'
  const isSoldOut = product.status === 'sold_out'
  const isComingSoon = product.status === 'coming_soon'

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        minHeight: 'calc(100vh - 100px)',
      }}>
        {/* Left — product viewer */}
        <ProductViewer images={product.images || []} name={product.name} />

        {/* Right — product info */}
        <div style={{
          padding: '60px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderLeft: '1px solid #111',
          position: 'sticky',
          top: '100px',
          alignSelf: 'start',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
        }}>
          {/* Breadcrumb */}
          <div style={{
            display: 'flex', gap: '12px', alignItems: 'center',
            marginBottom: '40px',
          }}>
            <Link href="/shop" style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#444',
              textDecoration: 'none',
            }}>
              SHOP
            </Link>
            <span style={{ color: '#222', fontSize: '10px' }}>→</span>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#fff',
            }}>
              {product.category?.toUpperCase()}
            </span>
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(28px, 3vw, 48px)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: '24px',
            color: '#fff',
          }}>
            {product.name.toUpperCase()}
          </h1>

          {/* Price */}
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '28px',
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: '32px',
          }}>
            {product.price > 0 ? `${product.price}€` : 'PRIX TBD'}
          </p>

          {/* Status indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '8px 16px',
            background: '#0a0a0a',
            alignSelf: 'flex-start',
          }}>
            <span style={{
              display: 'block',
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: isAvailable ? '#39ff14' : isSoldOut ? '#ff0000' : '#555',
              boxShadow: isAvailable ? '0 0 6px #39ff14' : 'none',
            }} />
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: isAvailable ? '#39ff14' : isSoldOut ? '#ff0000' : '#555',
            }}>
              {isAvailable ? 'DISPONIBLE' : isSoldOut ? 'SOLD OUT' : 'COMING SOON'}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: '14px',
              lineHeight: 1.8,
              color: '#666',
              marginBottom: '40px',
              maxWidth: '400px',
            }}>
              {product.description}
            </p>
          )}

          {/* Drop date */}
          {product.drop_date && isComingSoon && (
            <div style={{
              marginBottom: '32px',
              padding: '16px',
              border: '1px solid #1a1a1a',
            }}>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#555',
                marginBottom: '8px',
              }}>
                DROP DATE
              </p>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '14px',
                color: '#fff',
                letterSpacing: '0.05em',
              }}>
                {new Date(product.drop_date).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }).toUpperCase()}
              </p>
            </div>
          )}

          {/* CTA */}
          {isAvailable ? (
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.images?.[0] ?? null}
              slug={product.slug}
              isAvailable={true}
            />
          ) : isSoldOut ? (
            <div style={{
              padding: '18px 40px',
              background: '#0a0a0a',
              color: '#ff0000',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textAlign: 'center',
            }}>
              SOLD OUT
            </div>
          ) : (
            <div style={{
              padding: '18px 40px',
              background: '#0a0a0a',
              color: '#555',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textAlign: 'center',
            }}>
              COMING SOON
            </div>
          )}

          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.15em',
            color: '#333',
            textAlign: 'center',
            marginTop: '20px',
          }}>
            PAIEMENT SÉCURISÉ VIA MOLLIE · CRYPTO SUR DEMANDE
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"] {
            position: static !important;
            max-height: none !important;
            padding: 40px 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
