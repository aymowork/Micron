import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { AdminProductsClient } from './AdminProductsClient'

export default async function AdminProduitsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) redirect('/admin/login')

  let products: any[] = []
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    products = data || []
  } catch { /* no db yet */ }

  return <AdminProductsClient initialProducts={products} />
}
