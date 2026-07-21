import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('products')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (featured === 'true') query = query.eq('is_featured', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
