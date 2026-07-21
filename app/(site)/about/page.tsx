export default function AboutPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '120px' }}>
      {/* Hero statement */}
      <div style={{
        padding: '0 40px 120px',
        borderBottom: '1px solid #111',
      }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#39ff14',
          marginBottom: '40px',
        }}>
          MICRON — EST. 2024
        </p>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 100px)',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: '#fff',
          maxWidth: '900px',
        }}>
          ON N'EST PAS UNE<br />
          <span style={{ color: '#1a1a1a', WebkitTextStroke: '1px #333' }}>MARQUE DE PLUS.</span><br />
          ON EST UN VIRUS.
        </h1>
      </div>

      {/* Story */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '80px',
        padding: '120px 40px',
        borderBottom: '1px solid #111',
      }}>
        <div style={{ position: 'sticky', top: '140px', alignSelf: 'start' }}>
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: '#333',
            lineHeight: 2,
          }}>
            001 — ORIGINE<br />
            002 — PHILOSOPHIE<br />
            003 — ACCÈS
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {/* Origin */}
          <div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#39ff14',
              marginBottom: '24px',
            }}>
              001
            </p>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: '#fff',
            }}>
              L'ORIGINE
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.9,
              color: '#666',
              maxWidth: '560px',
            }}>
              MICRON est né dans un esprit simple : faire des pièces pour ceux qui comprennent.
              Pas de boutique, pas de réseaux, pas de pub. Les premiers drops se commandaient
              uniquement sur Telegram, en crypto. Que les vrais savaient.
            </p>
          </div>

          {/* Philosophy */}
          <div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#39ff14',
              marginBottom: '24px',
            }}>
              002
            </p>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: '#fff',
            }}>
              LA PHILOSOPHIE
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.9,
              color: '#666',
              maxWidth: '560px',
            }}>
              Streetwear, accessoires, art. Tout dans l'esprit dab & weed culture.
              Pas pour le skate. Pas pour les hypebeasts. Pour les passionnés qui vivent
              leur vie à leur façon. LIVE UR LIFE — fast if its possible.
            </p>
          </div>

          {/* Access */}
          <div>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.3em',
              color: '#39ff14',
              marginBottom: '24px',
            }}>
              003
            </p>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              color: '#fff',
            }}>
              L'ACCÈS
            </h2>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.9,
              color: '#666',
              maxWidth: '560px',
              marginBottom: '32px',
            }}>
              Quantités limitées. Drops exclusifs. Le site c'est la version officielle —
              mais le vrai accès se passe toujours par les bonnes personnes.
              Crypto toujours accepté sur demande.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              border: '1px solid #1a1a1a',
            }}>
              <span style={{
                display: 'block',
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#39ff14',
                boxShadow: '0 0 6px #39ff14',
                animation: 'pulse 2s infinite',
              }} />
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#39ff14',
              }}>
                CONTAMINATION EN COURS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Values grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid #111',
      }}>
        {[
          { label: 'EXCLUSIF', desc: 'Quantités volontairement limitées.' },
          { label: 'AUTHENTIQUE', desc: 'Pas de collab forcée. Que du vrai.' },
          { label: 'UNDERGROUND', desc: 'Le vrai buzz c\'est le bouche-à-oreille.' },
          { label: 'LIBRE', desc: 'LIVE UR LIFE. C\'est tout.' },
        ].map(v => (
          <div key={v.label} style={{
            padding: '60px 40px',
            borderRight: '1px solid #111',
          }}>
            <p style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '0.05em',
              marginBottom: '16px',
              color: '#fff',
            }}>
              {v.label}
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: '13px',
              lineHeight: 1.7,
              color: '#444',
            }}>
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
