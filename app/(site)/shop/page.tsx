import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'

async function getProducts() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .neq('status', 'archived')
      .order('created_at', { ascending: false })
    return data as Product[] || []
  } catch {
    return []
  }
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '80px' }}>
      {products.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '160px 40px', gap: '20px',
        }}>
          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '48px', color: '#111', letterSpacing: '-0.02em' }}>
            BIENTÔT
          </p>
          <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#333' }}>
            LE PROCHAIN DROP ARRIVE
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '2px',
        }}>
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
