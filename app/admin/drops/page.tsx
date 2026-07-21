import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase-server'
import { AdminDropsClient } from './AdminDropsClient'

export default async function AdminDropsPage() {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) redirect('/admin/login')

  let drops: any[] = []
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('drops')
      .select('*')
      .order('drop_date', { ascending: true })
    drops = data || []
  } catch { /* no db yet */ }

  return <AdminDropsClient initialDrops={drops} />
}
