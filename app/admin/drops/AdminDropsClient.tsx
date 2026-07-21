'use client'

import { useState } from 'react'
import { Drop } from '@/lib/types'

const EMPTY_DROP = {
  name: '', description: '', drop_date: '', is_active: true,
}

export function AdminDropsClient({ initialDrops }: { initialDrops: Drop[] }) {
  const [drops, setDrops] = useState<Drop[]>(initialDrops)
  const [form, setForm] = useState(EMPTY_DROP)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const notify = (text: string, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3000)
  }

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_DROP)
    setShowForm(true)
  }

  const openEdit = (d: Drop) => {
    setEditing(d.id)
    setForm({
      name: d.name,
      description: d.description || '',
      drop_date: d.drop_date ? d.drop_date.slice(0, 16) : '',
      is_active: d.is_active,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const url = editing ? `/api/admin/drops/${editing}` : '/api/admin/drops'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, description: form.description || null }),
      })
      const json = await res.json()
      if (res.ok) {
        if (editing) {
          setDrops(ds => ds.map(d => d.id === editing ? json : d))
          notify('DROP MIS À JOUR')
        } else {
          setDrops(ds => [...ds, json])
          notify('DROP CRÉÉ')
        }
        setShowForm(false)
        setEditing(null)
        setForm(EMPTY_DROP)
      } else {
        notify(json.error || 'ERREUR', false)
      }
    } catch {
      notify('ERREUR RÉSEAU', false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce drop ?')) return
    const res = await fetch(`/api/admin/drops/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setDrops(ds => ds.filter(d => d.id !== id))
      notify('DROP SUPPRIMÉ')
    }
  }

  const toggleActive = async (drop: Drop) => {
    const res = await fetch(`/api/admin/drops/${drop.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...drop, is_active: !drop.is_active }),
    })
    const json = await res.json()
    if (res.ok) setDrops(ds => ds.map(d => d.id === drop.id ? json : d))
  }

  const inputStyle: React.CSSProperties = {
    background: '#0a0a0a', border: '1px solid #1a1a1a', color: '#fff',
    padding: '10px 12px', fontFamily: 'Space Mono, monospace',
    fontSize: '11px', letterSpacing: '0.1em', outline: 'none', width: '100%',
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Space Mono, monospace', fontSize: '9px',
    letterSpacing: '0.2em', color: '#444', marginBottom: '6px', display: 'block',
  }

  return (
    <div style={{ padding: '48px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
        <div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#39ff14', marginBottom: '8px' }}>
            ADMIN — MICRON
          </p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-0.02em', color: '#fff' }}>
            DROPS
          </h1>
        </div>
        {!showForm && (
          <button onClick={openNew} style={{
            padding: '12px 24px', background: '#fff', color: '#000',
            border: 'none', fontFamily: 'Space Mono, monospace',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'none',
          }}>
            + NOUVEAU DROP
          </button>
        )}
      </div>

      {msg && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9000,
          padding: '12px 24px', background: msg.ok ? '#39ff14' : '#ff0000',
          fontFamily: 'Space Mono, monospace', fontSize: '11px', fontWeight: 700,
          letterSpacing: '0.15em', color: '#000',
        }}>
          {msg.text}
        </div>
      )}

      {!showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {drops.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center', background: '#0a0a0a' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', letterSpacing: '0.2em', color: '#333' }}>
                AUCUN DROP PLANIFIÉ
              </p>
            </div>
          ) : drops.map(d => {
            const isPast = new Date(d.drop_date) < new Date()
            return (
              <div key={d.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '20px', alignItems: 'center',
                padding: '20px 24px', background: '#0a0a0a',
              }}>
                <div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '6px' }}>
                    {d.name}
                  </p>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.1em', color: '#444' }}>
                    {new Date(d.drop_date).toLocaleString('fr-FR')}
                    {isPast && <span style={{ color: '#333', marginLeft: '12px' }}>PASSÉ</span>}
                  </p>
                </div>

                <button onClick={() => toggleActive(d)} style={{
                  padding: '6px 14px', background: 'transparent',
                  border: `1px solid ${d.is_active ? '#39ff14' : '#222'}`,
                  color: d.is_active ? '#39ff14' : '#333',
                  fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', cursor: 'none',
                }}>
                  {d.is_active ? 'ACTIF' : 'INACTIF'}
                </button>

                <button onClick={() => openEdit(d)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #222',
                  color: '#666', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', cursor: 'none',
                }}>
                  EDIT
                </button>
                <button onClick={() => handleDelete(d.id)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #1a1a1a',
                  color: '#333', fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', cursor: 'none',
                }}>
                  DEL
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div style={{ maxWidth: '560px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: '#fff' }}>
              {editing ? 'MODIFIER DROP' : 'NOUVEAU DROP'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: 'none', color: '#444',
              fontFamily: 'Space Mono, monospace', fontSize: '11px', cursor: 'none',
            }}>
              ANNULER ×
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>NOM DU DROP *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="ex: DROP 001 — CONTAMINATION" />
            </div>
            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Description du drop..." />
            </div>
            <div>
              <label style={labelStyle}>DATE & HEURE DU DROP *</label>
              <input required type="datetime-local" value={form.drop_date} onChange={e => set('drop_date', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input type="checkbox" id="active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} style={{ accentColor: '#39ff14', width: '14px', height: '14px' }} />
              <label htmlFor="active" style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#666' }}>
                AFFICHER LE TIMER SUR LA HOME
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button type="submit" disabled={loading} style={{
                padding: '14px 32px', background: '#fff', color: '#000',
                border: 'none', fontFamily: 'Space Mono, monospace',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', cursor: 'none', flex: 1,
              }}>
                {loading ? 'SAUVEGARDE...' : editing ? 'METTRE À JOUR' : 'CRÉER LE DROP'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
