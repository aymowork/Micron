import { cookies } from 'next/headers'

const SESSION_COOKIE = 'micron_admin_session'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value === process.env.ADMIN_SESSION_SECRET
}

export async function setAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
