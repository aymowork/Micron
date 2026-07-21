import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuth(req: NextRequest) {
  const session = req.cookies.get('micron_admin_session')
  return session?.value === process.env.ADMIN_SESSION_SECRET
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabase
    .from('drops')
    .insert([{
      name: body.name,
      description: body.description || null,
      drop_date: body.drop_date,
      is_active: body.is_active ?? true,
    }])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
