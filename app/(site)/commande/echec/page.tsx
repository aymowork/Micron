import Link from 'next/link'

export default function EchecPage() {
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
      {/* Red dot */}
      <div style={{
        width: '64px', height: '64px',
        borderRadius: '50%',
        background: '#ff0000',
        boxShadow: '0 0 40px #ff000060',
      }} />

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.4em',
          color: '#ff0000',
          marginBottom: '16px',
        }}>
          PAIEMENT ÉCHOUÉ
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
          TRANSACTION
          <br />
          REFUSÉE.
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          fontSize: '14px',
          lineHeight: 1.8,
          color: '#444',
          maxWidth: '400px',
          margin: '0 auto 48px',
        }}>
          Le paiement n'a pas abouti. Aucun montant n'a été débité. Tu peux réessayer ou nous contacter sur Telegram.
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
          RETOUR AU SHOP
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
    </div>
  )
}
