export default function MentionsLegalesPage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 40px' }}>

        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#39ff14', marginBottom: '16px' }}>
          LÉGAL
        </p>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '48px', color: '#fff', letterSpacing: '-0.02em', marginBottom: '80px' }}>
          MENTIONS LÉGALES
        </h1>

        {[
          {
            title: 'ÉDITEUR DU SITE',
            content: [
              'Raison sociale : BIG CLUB',
              'Adresse : 38 rue de la baisse, 69100 Villeurbanne, France',
              'SIRET : 849 463 930 00032',
              'Email : lachainedua@gmail.com',
            ],
          },
          {
            title: 'DIRECTEUR DE LA PUBLICATION',
            content: ['BIG CLUB — lachainedua@gmail.com'],
          },
          {
            title: 'HÉBERGEMENT',
            content: [
              'Vercel Inc.',
              '340 Pine Street, Suite 701',
              'San Francisco, CA 94104, États-Unis',
              'vercel.com',
            ],
          },
          {
            title: 'PROPRIÉTÉ INTELLECTUELLE',
            content: [
              'L\'ensemble des contenus présents sur le site MICRON (textes, images, logos, graphismes) sont la propriété exclusive de BIG CLUB et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.',
              'Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.',
            ],
          },
          {
            title: 'DONNÉES PERSONNELLES',
            content: [
              'Les informations collectées lors d\'une commande (nom, adresse, email) sont utilisées uniquement pour le traitement et la livraison de votre commande.',
              'Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données.',
              'Pour exercer ce droit : lachainedua@gmail.com',
            ],
          },
          {
            title: 'PAIEMENT',
            content: [
              'Les paiements sont sécurisés et traités par Mollie B.V., prestataire de services de paiement agréé.',
              'BIG CLUB ne stocke aucune donnée bancaire.',
            ],
          },
          {
            title: 'CONTACT',
            content: ['lachainedua@gmail.com'],
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '56px' }}>
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.25em',
              color: '#39ff14',
              marginBottom: '20px',
            }}>
              {section.title}
            </p>
            {section.content.map((line, i) => (
              <p key={i} style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: 1.9,
                color: '#888',
                marginBottom: '6px',
              }}>
                {line}
              </p>
            ))}
            <div style={{ marginTop: '40px', borderBottom: '1px solid #0f0f0f' }} />
          </div>
        ))}

        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#333', marginTop: '40px' }}>
          © 2026 BIG CLUB / MICRON — TOUS DROITS RÉSERVÉS
        </p>
      </div>
    </div>
  )
}
