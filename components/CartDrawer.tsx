'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function CartDrawer() {
  const { items, count, total, open, setOpen, removeItem, updateQty, clear } = useCart()
  const [step, setStep] = useState<'cart' | 'info'>('cart')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', country: 'FR', note: '' })
  const [err, setErr] = useState('')
  const router = useRouter()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleCheckout = async () => {
    if (!form.name || !form.email || !form.address || !form.city || !form.zip) {
      setErr('REMPLIS TOUS LES CHAMPS')
      return
    }
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer: form }),
      })
      const json = await res.json()
      if (json.checkoutUrl) {
        clear()
        window.location.href = json.checkoutUrl
      } else {
        setErr(json.error || 'ERREUR PAIEMENT')
      }
    } catch {
      setErr('ERREUR RÉSEAU')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff',
    padding: '10px 12px', fontFamily: 'Space Mono, monospace',
    fontSize: '11px', letterSpacing: '0.05em', outline: 'none', width: '100%',
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => { setOpen(false); setStep('cart') }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10000 }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '440px',
        background: '#000', borderLeft: '1px solid #111',
        zIndex: 10001, display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid #111',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, background: '#000', zIndex: 1,
        }}>
          <div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#39ff14', marginBottom: '4px' }}>
              {step === 'cart' ? 'PANIER' : 'LIVRAISON'}
            </p>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff' }}>
              {count} ARTICLE{count > 1 ? 'S' : ''}
            </p>
          </div>
          <button onClick={() => { setOpen(false); setStep('cart') }} style={{
            background: 'none', border: 'none', color: '#555',
            fontFamily: 'Space Mono, monospace', fontSize: '18px', cursor: 'none',
          }}>×</button>
        </div>

        {step === 'cart' ? (
          <>
            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#333' }}>
                    PANIER VIDE
                  </p>
                </div>
              ) : items.map((item, i) => (
                <div key={`${item.id}-${item.size}`} style={{
                  display: 'grid', gridTemplateColumns: '72px 1fr',
                  gap: '16px', padding: '16px 24px',
                  borderBottom: '1px solid #0a0a0a',
                }}>
                  {/* Image */}
                  <div style={{ width: 72, height: 90, background: '#0a0a0a', overflow: 'hidden', flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', color: '#1a1a1a' }}>M</span>
                        </div>
                    }
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '4px' }}>
                        {item.name.toUpperCase()}
                      </p>
                      <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#444' }}>
                        TAILLE: {item.size}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Qty */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => updateQty(item.id, item.size, item.quantity - 1)} style={{
                          width: 24, height: 24, background: '#0a0a0a', border: '1px solid #1a1a1a',
                          color: '#fff', fontFamily: 'Space Mono, monospace', cursor: 'none', fontSize: '12px',
                        }}>−</button>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#fff', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQty(item.id, item.size, item.quantity + 1)} style={{
                          width: 24, height: 24, background: '#0a0a0a', border: '1px solid #1a1a1a',
                          color: '#fff', fontFamily: 'Space Mono, monospace', cursor: 'none', fontSize: '12px',
                        }}>+</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#fff' }}>
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                        <button onClick={() => removeItem(item.id, item.size)} style={{
                          background: 'none', border: 'none', color: '#333',
                          fontFamily: 'Space Mono, monospace', fontSize: '11px', cursor: 'none',
                        }}>×</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid #111', position: 'sticky', bottom: 0, background: '#000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.15em', color: '#555' }}>TOTAL</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', color: '#fff', fontWeight: 700 }}>
                    {total.toFixed(2)}€
                  </span>
                </div>
                <button onClick={() => setStep('info')} style={{
                  width: '100%', padding: '14px', background: '#fff', color: '#000',
                  border: 'none', fontFamily: 'Space Mono, monospace', fontSize: '12px',
                  fontWeight: 700, letterSpacing: '0.2em', cursor: 'none',
                }}>
                  COMMANDER →
                </button>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#333', textAlign: 'center', marginTop: '12px' }}>
                  PAIEMENT SÉCURISÉ VIA MOLLIE
                </p>
              </div>
            )}
          </>
        ) : (
          /* INFO STEP */
          <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setStep('cart')} style={{
              background: 'none', border: 'none', color: '#555', fontFamily: 'Space Mono, monospace',
              fontSize: '10px', letterSpacing: '0.15em', textAlign: 'left', marginBottom: '8px', cursor: 'none',
            }}>
              ← RETOUR
            </button>

            {[
              { key: 'name', label: 'NOM COMPLET', placeholder: 'Prénom Nom', type: 'text' },
              { key: 'email', label: 'EMAIL', placeholder: 'ton@email.com', type: 'email' },
              { key: 'address', label: 'ADRESSE', placeholder: '12 rue de la Paix', type: 'text' },
              { key: 'city', label: 'VILLE', placeholder: 'Paris', type: 'text' },
              { key: 'zip', label: 'CODE POSTAL', placeholder: '75001', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#444', display: 'block', marginBottom: '6px' }}>
                  {f.label} *
                </label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

            <div>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#444', display: 'block', marginBottom: '6px' }}>
                PAYS
              </label>
              <select value={form.country} onChange={e => set('country', e.target.value)} style={inputStyle}>
                <option value="FR">France</option>
                <option value="BE">Belgique</option>
                <option value="CH">Suisse</option>
                <option value="LU">Luxembourg</option>
                <option value="CA">Canada</option>
              </select>
            </div>

            <div>
              <label style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: '#444', display: 'block', marginBottom: '6px' }}>
                NOTE (optionnel)
              </label>
              <textarea
                value={form.note}
                onChange={e => set('note', e.target.value)}
                placeholder="Instructions particulières..."
                rows={2}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            {err && (
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: '#ff0000' }}>
                {err}
              </p>
            )}

            {/* Récap */}
            <div style={{ padding: '16px', background: '#0a0a0a', marginTop: '8px' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#444', marginBottom: '8px' }}>RÉCAPITULATIF</p>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#666' }}>
                    {item.name} × {item.quantity} ({item.size})
                  </span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: '#fff' }}>
                    {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700 }}>TOTAL</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700 }}>{total.toFixed(2)}€</span>
              </div>
            </div>

            <button onClick={handleCheckout} disabled={loading} style={{
              width: '100%', padding: '14px', background: loading ? '#111' : '#fff',
              color: '#000', border: 'none', fontFamily: 'Space Mono, monospace',
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', cursor: 'none',
              marginTop: '8px',
            }}>
              {loading ? 'REDIRECTION...' : `PAYER ${total.toFixed(2)}€`}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
