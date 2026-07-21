import { isAdminAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuth = await isAdminAuthenticated()

  // Allow login page without auth
  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex' }}>
      {isAuth && <AdminSidebar />}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
