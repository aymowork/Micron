'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface Props {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  isAvailable: boolean
  whopUrl?: string | null
}

export function AddToCartButton({ id, name, price, image, slug, isAvailable, whopUrl }: Props) {
  const { addItem } = useCart()
  const [size, setSize] = useState('')
  const [added, setAdded] = useState(false)
  const [err, setErr] = useState(false)

  if (!isAvailable) return null

  const handleAdd = () => {
    if (!size) { setErr(true); setTimeout(() => setErr(false), 1500); return }
    addItem({ id, name, price, image, slug, size })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Size selector */}
      <div>
        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: '9px',
          letterSpacing: '0.2em', color: err ? '#ff0000' : '#444',
          marginBottom: '10px', transition: 'color 0.2s',
        }}>
          {err ? 'CHOISIS UNE TAILLE' : 'TAILLE'}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => { setSize(s); setErr(false) }}
              style={{
                padding: '8px 14px',
                background: size === s ? '#fff' : '#0a0a0a',
                color: size === s ? '#000' : '#555',
                border: `1px solid ${size === s ? '#fff' : '#1a1a1a'}`,
                fontFamily: 'Space Mono, monospace', fontSize: '10px',
                letterSpacing: '0.1em', cursor: 'none',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Add to cart */}
      <button
        onClick={handleAdd}
        style={{
          padding: '16px', width: '100%',
          background: added ? '#39ff14' : '#fff',
          color: '#000', border: 'none',
          fontFamily: 'Space Mono, monospace', fontSize: '12px',
          fontWeight: 700, letterSpacing: '0.2em', cursor: 'none',
          transition: 'background 0.2s',
        }}
      >
        {added ? '✓ AJOUTÉ' : 'AJOUTER AU PANIER'}
      </button>
    </div>
  )
}
