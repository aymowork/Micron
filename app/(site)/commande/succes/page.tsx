import Link from 'next/link'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <div style={{
      background: '#000',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '32px',
      padding: '40px',
    }}>
      {/* Animated green dot */}
      <div style={{
        width: '64px', height: '64px',
        borderRadius: '50%',
        background: '#39ff14',
        boxShadow: '0 0 40px #39ff14, 0 0 80px #39ff1440',
        animation: 'pulse 2s ease-in-out infinite',
      }} />

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.4em',
          color: '#39ff14',
          marginBottom: '16px',
        }}>
          PAIEMENT CONFIRMÉ
        </p>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(32px, 6vw, 72px)',
          letterSpacing: '-0.02em',
          color: '#fff',
          lineHeight: 1,
          marginBottom: '24px',
        }}>
          COMMANDE
          <br />
          REÇUE.
        </h1>
        {email && (
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: '#555',
            marginBottom: '8px',
          }}>
            Confirmation envoyée à
          </p>
        )}
        {email && (
          <p style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '13px',
            letterSpacing: '0.05em',
            color: '#fff',
            marginBottom: '32px',
          }}>
            {decodeURIComponent(email)}
          </p>
        )}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '14px',
          lineHeight: 1.8,
          color: '#444',
          maxWidth: '400px',
          margin: '0 auto 48px',
        }}>
          Ton drop est en préparation. La contamination se propage. Tu recevras les infos de livraison sous peu.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/shop" style={{
          padding: '14px 32px',
          background: '#fff',
          color: '#000',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textDecoration: 'none',
        }}>
          CONTINUER LE SHOP
        </Link>
        <Link href="/" style={{
          padding: '14px 32px',
          background: 'transparent',
          color: '#444',
          fontFamily: 'Space Mono, monospace',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textDecoration: 'none',
          border: '1px solid #1a1a1a',
        }}>
          ACCUEIL
        </Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
