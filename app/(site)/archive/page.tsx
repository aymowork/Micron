import { createServerSupabaseClient } from '@/lib/supabase-server'
import { Product } from '@/lib/types'

async function getArchivedProducts() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .or('status.eq.archived,status.eq.sold_out')
      .order('created_at', { ascending: false })
    return data as Product[] || []
  } catch {
    return []
  }
}

export default async function ArchivePage() {
  const products = await getArchivedProducts()

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '120px' }}>
      {/* Header */}
      <div style={{ padding: '0 40px 80px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#333',
          marginBottom: '16px',
        }}>
          HISTORIQUE — DROPS PASSÉS
        </p>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(48px, 8vw, 120px)',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: '#fff',
        }}>
          ARCHIVE
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '13px',
          color: '#444',
          marginTop: '24px',
          maxWidth: '480px',
          lineHeight: 1.7,
        }}>
          Chaque pièce ici fait partie de l'histoire MICRON.
          Sold out. Dispersé. Mais jamais oublié.
        </p>
      </div>

      {/* Horizontal scroll archive */}
      {products.length === 0 ? (
        <div style={{
          padding: '80px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{
            width: '1px',
            height: '80px',
            background: '#222',
          }} />
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#333',
          }}>
            L'HISTOIRE S'ÉCRIT BIENTÔT
          </p>
        </div>
      ) : (
        <div style={{
          overflowX: 'auto',
          paddingBottom: '40px',
          borderTop: '1px solid #111',
        }}>
          <div style={{
            display: 'flex',
            gap: '2px',
            width: 'max-content',
            padding: '2px',
          }}>
            {products.map((product, i) => (
              <div key={product.id} style={{
                width: '320px',
                flexShrink: 0,
                position: 'relative',
              }}>
                {/* Image */}
                <div style={{
                  aspectRatio: '3/4',
                  background: '#0a0a0a',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        filter: 'grayscale(100%) brightness(0.6)',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800,
                        fontSize: '80px',
                        color: '#111',
                      }}>M</span>
                    </div>
                  )}

                  {/* drop number overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '20px', left: '20px',
                  }}>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      color: '#333',
                    }}>
                      DROP {String(products.length - i).padStart(3, '0')}
                    </span>
                  </div>

                  {/* SOLD OUT stamp */}
                  {product.status === 'sold_out' && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <div style={{
                        border: '2px solid rgba(255,0,0,0.4)',
                        padding: '8px 20px',
                        transform: 'rotate(-12deg)',
                      }}>
                        <span style={{
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 800,
                          fontSize: '20px',
                          letterSpacing: '0.1em',
                          color: 'rgba(255,0,0,0.4)',
                        }}>
                          SOLD OUT
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{
                  padding: '20px',
                  borderBottom: '1px solid #111',
                }}>
                  <p style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    letterSpacing: '0.05em',
                    color: '#555',
                    marginBottom: '8px',
                  }}>
                    {product.name.toUpperCase()}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      color: '#333',
                      letterSpacing: '0.1em',
                    }}>
                      {product.category?.toUpperCase()}
                    </span>
                    <span style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '10px',
                      color: '#333',
                    }}>
                      {product.drop_date
                        ? new Date(product.drop_date).getFullYear()
                        : new Date(product.created_at).getFullYear()
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contamination statement */}
      <div style={{
        padding: '120px 40px',
        borderTop: '1px solid #111',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(24px, 4vw, 56px)',
          letterSpacing: '-0.02em',
          color: '#1a1a1a',
          lineHeight: 1,
        }}>
          UNE FOIS SORTI.<br />
          POUR TOUJOURS CONTAMINÉ.
        </p>
      </div>
    </div>
  )
}
