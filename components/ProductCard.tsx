'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/types'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  available: { label: 'DISPONIBLE', color: '#39ff14' },
  sold_out: { label: 'SOLD OUT', color: '#ff0000' },
  coming_soon: { label: 'COMING SOON', color: '#555' },
  archived: { label: 'ARCHIVE', color: '#333' },
}

export function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rx: 0, ry: 0 })
  const [hovered, setHovered] = useState(false)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform({ rx: -y * 14, ry: x * 14 })
  }

  const onMouseLeave = () => {
    setTransform({ rx: 0, ry: 0 })
    setHovered(false)
  }

  const status = STATUS_LABELS[product.status] ?? STATUS_LABELS.available
  const img = product.images?.[0] ?? null

  return (
    <Link href={`/produit/${product.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseEnter={() => setHovered(true)}
        style={{ perspective: '1000px', background: '#0a0a0a' }}
      >
        {/* image wrapper with 3D tilt */}
        <div style={{
          transform: `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg)`,
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.6s ease',
          transformStyle: 'preserve-3d',
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
        }}>
          {img ? (
            <img
              src={img}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: product.status === 'sold_out' ? 'grayscale(100%)' : 'none',
                transition: 'transform 0.6s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '32px',
                color: '#1a1a1a',
                letterSpacing: '0.1em',
              }}>M</span>
            </div>
          )}

          {/* status badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            padding: '4px 10px',
            background: 'rgba(0,0,0,0.8)',
          }}>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: status.color,
            }}>
              {status.label}
            </span>
          </div>

          {/* 3D shine effect */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${50 + transform.ry * 2}% ${50 - transform.rx * 2}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
            pointerEvents: 'none',
            transition: 'background 0.1s ease',
          }} />
        </div>

        {/* info */}
        <div style={{ padding: '16px 16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: '#444',
                marginBottom: '4px',
              }}>
                {product.category?.toUpperCase()}
              </p>
              <h3 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '0.05em',
                color: '#fff',
              }}>
                {product.name.toUpperCase()}
              </h3>
            </div>
            <span style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              {product.price > 0 ? `${product.price}€` : 'TBD'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
