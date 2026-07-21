'use client'

import { useState } from 'react'
import { Product, ProductCategory, ProductStatus } from '@/lib/types'

const EMPTY_PRODUCT = {
  name: '', slug: '', description: '',
  price: 0, category: 'vetement' as ProductCategory,
  status: 'coming_soon' as ProductStatus,
  whop_url: '', is_featured: false,
  drop_date: '', images: [] as string[],
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  const set = (k: string, v: any) => {
    setForm(f => {
      const updated = { ...f, [k]: v }
      if (k === 'name' && !editing) updated.slug = slugify(v)
      return updated
    })
  }

  const notify = (text: string, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 3000)
  }

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_PRODUCT)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p.id)
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      category: p.category,
      status: p.status,
      whop_url: p.whop_url || '',
      is_featured: p.is_featured,
      drop_date: p.drop_date ? p.drop_date.slice(0, 16) : '',
      images: p.images || [],
    })
    setShowForm(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) {
        set('images', [...form.images, json.url])
        notify('IMAGE UPLOADÉE')
      } else {
        notify(json.error || 'ERREUR UPLOAD', false)
      }
    } catch {
      notify('ERREUR UPLOAD', false)
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (idx: number) => {
    set('images', form.images.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = {
        ...form,
        drop_date: form.drop_date || null,
        whop_url: form.whop_url || null,
        description: form.description || null,
      }
      const url = editing ? `/api/admin/products/${editing}` : '/api/admin/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (res.ok) {
        if (editing) {
          setProducts(ps => ps.map(p => p.id === editing ? json : p))
          notify('PRODUIT MIS À JOUR')
        } else {
          setProducts(ps => [json, ...ps])
          notify('PRODUIT CRÉÉ')
        }
        setShowForm(false)
        setEditing(null)
        setForm(EMPTY_PRODUCT)
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
    if (!confirm('Supprimer ce produit ?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setProducts(ps => ps.filter(p => p.id !== id))
      notify('PRODUIT SUPPRIMÉ')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: '#0a0a0a',
    border: '1px solid #1a1a1a',
    color: '#fff',
    padding: '10px 12px',
    fontFamily: 'Space Mono, monospace',
    fontSize: '11px',
    letterSpacing: '0.1em',
    outline: 'none',
    width: '100%',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Space Mono, monospace',
    fontSize: '9px',
    letterSpacing: '0.2em',
    color: '#444',
    marginBottom: '6px',
    display: 'block',
  }

  const STATUS_COLORS: Record<string, string> = {
    available: '#39ff14',
    sold_out: '#ff0000',
    coming_soon: '#555',
    archived: '#222',
  }

  return (
    <div style={{ padding: '48px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: '48px',
      }}>
        <div>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#39ff14', marginBottom: '8px' }}>
            ADMIN — MICRON
          </p>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-0.02em', color: '#fff' }}>
            PRODUITS
          </h1>
        </div>
        <button onClick={openNew} style={{
          padding: '12px 24px', background: '#fff', color: '#000',
          border: 'none', fontFamily: 'Space Mono, monospace',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', cursor: 'none',
        }}>
          + NOUVEAU
        </button>
      </div>

      {/* Notification */}
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

      {/* Products table */}
      {!showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {products.length === 0 ? (
            <div style={{
              padding: '80px', textAlign: 'center', background: '#0a0a0a',
            }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', letterSpacing: '0.2em', color: '#333' }}>
                AUCUN PRODUIT — CRÉEZ LE PREMIER
              </p>
            </div>
          ) : products.map(p => (
            <div key={p.id} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr auto auto auto',
              gap: '20px',
              alignItems: 'center',
              padding: '16px 20px',
              background: '#0a0a0a',
            }}>
              {/* Thumbnail */}
              <div style={{ width: '60px', height: '60px', background: '#111', overflow: 'hidden', flexShrink: 0 }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#1a1a1a' }}>M</span>
                  </div>
                )}
              </div>

              <div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '4px' }}>
                  {p.name}
                </p>
                <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', color: '#444' }}>
                  /{p.slug} · {p.category} · {p.price}€
                </p>
              </div>

              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '9px',
                letterSpacing: '0.2em', color: STATUS_COLORS[p.status] || '#555',
                padding: '4px 8px', background: '#111',
              }}>
                {p.status.toUpperCase().replace('_', ' ')}
              </span>

              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '9px',
                letterSpacing: '0.15em', color: p.is_featured ? '#39ff14' : '#333',
              }}>
                {p.is_featured ? '★ FEATURED' : '—'}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEdit(p)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #222',
                  color: '#666', fontFamily: 'Space Mono, monospace', fontSize: '9px',
                  letterSpacing: '0.1em', cursor: 'none',
                }}>
                  EDIT
                </button>
                <button onClick={() => handleDelete(p.id)} style={{
                  padding: '6px 14px', background: 'transparent', border: '1px solid #1a1a1a',
                  color: '#333', fontFamily: 'Space Mono, monospace', fontSize: '9px',
                  letterSpacing: '0.1em', cursor: 'none',
                }}>
                  DEL
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form */}
      {showForm && (
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: '#fff' }}>
              {editing ? 'MODIFIER' : 'NOUVEAU PRODUIT'}
            </h2>
            <button onClick={() => setShowForm(false)} style={{
              background: 'none', border: 'none', color: '#444',
              fontFamily: 'Space Mono, monospace', fontSize: '11px', cursor: 'none',
            }}>
              ANNULER ×
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>NOM DU PRODUIT *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="ex: HOODIE CONTAMINATION" />
              </div>
              <div>
                <label style={labelStyle}>SLUG (URL) *</label>
                <input required value={form.slug} onChange={e => set('slug', slugify(e.target.value))} style={inputStyle} placeholder="hoodie-contamination" />
              </div>
            </div>

            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Description du produit..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>PRIX (€) *</label>
                <input
                  required type="number" min="0" step="0.01"
                  value={form.price}
                  onChange={e => set('price', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>CATÉGORIE</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
                  <option value="vetement">VÊTEMENT</option>
                  <option value="accessoire">ACCESSOIRE</option>
                  <option value="art">ART</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>STATUT</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                  <option value="available">DISPONIBLE</option>
                  <option value="sold_out">SOLD OUT</option>
                  <option value="coming_soon">COMING SOON</option>
                  <option value="archived">ARCHIVÉ</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>WHOP URL (lien checkout)</label>
                <input
                  value={form.whop_url}
                  onChange={e => set('whop_url', e.target.value)}
                  style={inputStyle}
                  placeholder="https://whop.com/..."
                />
              </div>
              <div>
                <label style={labelStyle}>DATE DE DROP</label>
                <input
                  type="datetime-local"
                  value={form.drop_date}
                  onChange={e => set('drop_date', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={e => set('is_featured', e.target.checked)}
                style={{ accentColor: '#39ff14', width: '14px', height: '14px' }}
              />
              <label htmlFor="featured" style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#666' }}>
                PRODUIT FEATURED (affiché sur la home)
              </label>
            </div>

            {/* Images */}
            <div>
              <label style={labelStyle}>PHOTOS PRODUIT</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {form.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: 'rgba(0,0,0,0.8)', border: 'none', color: '#fff',
                        width: '20px', height: '20px', fontSize: '10px', cursor: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.7)', padding: '2px 4px',
                      }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '7px', color: '#39ff14' }}>MAIN</span>
                      </div>
                    )}
                  </div>
                ))}
                <label style={{
                  width: '80px', height: '80px',
                  background: '#0a0a0a', border: '1px dashed #222',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'none', flexShrink: 0,
                }}>
                  {uploadingImage ? (
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', color: '#444' }}>...</span>
                  ) : (
                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '20px', color: '#333' }}>+</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                </label>
              </div>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#333' }}>
                La première image est l'image principale. Fond blanc recommandé.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 32px', background: '#fff', color: '#000',
                  border: 'none', fontFamily: 'Space Mono, monospace',
                  fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', cursor: 'none',
                  flex: 1,
                }}
              >
                {loading ? 'SAUVEGARDE...' : editing ? 'METTRE À JOUR' : 'CRÉER LE PRODUIT'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '14px 24px', background: 'transparent', border: '1px solid #222',
                  color: '#666', fontFamily: 'Space Mono, monospace', fontSize: '11px',
                  letterSpacing: '0.15em', cursor: 'none',
                }}
              >
                ANNULER
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
