'use client'

import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

export function HomeFeaturedProducts({ products }: { products: Product[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2px',
    }}>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
