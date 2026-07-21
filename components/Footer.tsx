export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #111',
      padding: '60px 40px 40px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '40px',
      marginTop: '120px',
    }}>
      <div>
        <p style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '20px',
          letterSpacing: '0.15em',
          marginBottom: '16px',
        }}>
          MICRON
        </p>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: '#555',
          letterSpacing: '0.1em',
          lineHeight: 2,
        }}>
          LIVE UR LIFE<br />
          (FAST IF ITS POSSIBLE)
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#555',
          marginBottom: '8px',
        }}>
          NAVIGATION
        </p>
        {['SHOP', 'ARCHIVE', 'ABOUT'].map(item => (
          <a key={item} href={`/${item.toLowerCase()}`} style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: '#888',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}>
            {item}
          </a>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: '#555',
          marginBottom: '8px',
        }}>
          CONTAMINATION
        </p>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: '#39ff14',
          letterSpacing: '0.1em',
        }}>
          VIRUS ACTIF
        </p>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: '#555',
          letterSpacing: '0.1em',
          lineHeight: 1.8,
        }}>
          DROP EXCLUSIF<br />
          CRYPTO ACCEPTED
        </p>
      </div>

      <div style={{
        gridColumn: '1 / -1',
        borderTop: '1px solid #111',
        paddingTop: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: '#333',
          letterSpacing: '0.1em',
        }}>
          © {new Date().getFullYear()} MICRON. ALL RIGHTS RESERVED.
        </p>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          color: '#333',
          letterSpacing: '0.1em',
        }}>
          CONTAMINATION MONDIALE
        </p>
      </div>
    </footer>
  )
}
