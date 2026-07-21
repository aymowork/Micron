'use client'

import { useRef, useState } from 'react'

export function ProductViewer({ images, name }: { images: string[]; name: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rx: 0, ry: 0 })
  const [hovered, setHovered] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform({ rx: -y * 12, ry: x * 12 })
  }

  const img = images[activeIdx] ?? null

  return (
    <div style={{ background: '#050505', position: 'relative' }}>
      {/* Main image with 3D tilt */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { setTransform({ rx: 0, ry: 0 }); setHovered(false) }}
        onMouseEnter={() => setHovered(true)}
        style={{
          perspective: '1200px',
          padding: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <div style={{
          transform: `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg)`,
          transition: hovered ? 'transform 0.1s ease' : 'transform 0.6s ease',
          transformStyle: 'preserve-3d',
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
        }}>
          {img ? (
            <img
              src={img}
              alt={name}
              style={{
                width: '100%',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div style={{
              aspectRatio: '3/4',
              background: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '80px',
                color: '#1a1a1a',
              }}>M</span>
            </div>
          )}

          {/* 3D shine layer */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(circle at ${50 + transform.ry * 2}% ${50 - transform.rx * 2}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            transition: hovered ? 'background 0.1s' : 'background 0.6s',
          }} />

          {/* 3D depth shadow */}
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: 'translateZ(-30px)',
            boxShadow: `${-transform.ry * 2}px ${transform.rx * 2}px 60px rgba(0,0,0,0.8)`,
            pointerEvents: 'none',
            transition: hovered ? 'box-shadow 0.1s' : 'box-shadow 0.6s',
          }} />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '0 40px 40px',
          justifyContent: 'center',
        }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: '60px',
                height: '60px',
                padding: 0,
                border: i === activeIdx ? '1px solid #fff' : '1px solid #222',
                background: 'none',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <img
                src={img}
                alt={`${name} ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* 3D hint text */}
      <div style={{
        position: 'absolute',
        bottom: images.length > 1 ? '100px' : '20px',
        right: '20px',
        padding: '4px 10px',
        background: 'rgba(0,0,0,0.6)',
      }}>
        <span style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '8px',
          letterSpacing: '0.2em',
          color: '#333',
        }}>
          3D HOVER
        </span>
      </div>
    </div>
  )
}
