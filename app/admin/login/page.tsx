'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('MOT DE PASSE INCORRECT')
      }
    } catch {
      setError('ERREUR DE CONNEXION')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#000',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <p style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '10px',
          letterSpacing: '0.3em',
          color: '#39ff14',
          marginBottom: '16px',
        }}>
          ADMIN — MICRON
        </p>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '40px',
          letterSpacing: '-0.02em',
          marginBottom: '48px',
          color: '#fff',
        }}>
          ACCÈS<br />RESTREINT
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="MOT DE PASSE"
            style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              color: '#fff',
              padding: '14px 16px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              letterSpacing: '0.2em',
              outline: 'none',
              width: '100%',
            }}
            autoFocus
          />

          {error && (
            <p style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: '#ff0000',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: loading ? '#111' : '#fff',
              color: '#000',
              border: 'none',
              padding: '14px',
              fontFamily: 'Space Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              cursor: loading ? 'default' : 'none',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'VÉRIFICATION...' : 'ENTRER'}
          </button>
        </form>
      </div>
    </div>
  )
}
