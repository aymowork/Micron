import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function isAuth(req: NextRequest) {
  const session = req.cookies.get('micron_admin_session')
  return session?.value === process.env.ADMIN_SESSION_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!isAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      price: body.price,
      category: body.category,
      status: body.status,
      whop_url: body.whop_url || null,
      images: body.images || [],
      drop_date: body.drop_date || null,
      is_featured: body.is_featured || false,
    }])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
