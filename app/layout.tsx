import type { Metadata } from 'next'
import './globals.css'
import { CustomCursor } from '@/components/CustomCursor'
import { GrainOverlay } from '@/components/GrainOverlay'
import { CartProvider } from '@/lib/cart'
import { CartDrawer } from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'MICRON — Live Ur Life',
  description: 'Contamination mondiale. Streetwear exclusif. MICRON.',
  openGraph: {
    title: 'MICRON',
    description: 'Live Ur Life (fast if its possible)',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="grain">
        <GrainOverlay />
        <CustomCursor />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
