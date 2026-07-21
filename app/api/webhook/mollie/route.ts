import { NextRequest, NextResponse } from 'next/server'
import { mollie } from '@/lib/mollie'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)
    const id = params.get('id')

    if (!id) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 })
    }

    const payment = await mollie.payments.get(id)

    if (payment.status === 'paid') {
      // Payment confirmed — log it (you can save to Supabase here if needed)
      console.log('[mollie webhook] Payment paid:', id, payment.metadata)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[mollie webhook]', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
