export type ProductStatus = 'available' | 'sold_out' | 'coming_soon' | 'archived'
export type ProductCategory = 'vetement' | 'accessoire' | 'art'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: ProductCategory
  status: ProductStatus
  whop_url: string | null
  images: string[]
  drop_date: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Drop {
  id: string
  name: string
  description: string | null
  drop_date: string
  is_active: boolean
  product_ids: string[]
  created_at: string
}
