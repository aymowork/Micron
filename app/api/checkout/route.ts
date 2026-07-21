import { NextRequest, NextResponse } from 'next/server'
import { mollie } from '@/lib/mollie'

interface CartItem {
  id: string
  name: string
  price: number
  image: string | null
  slug: string
  size: string
  quantity: number
}

interface CheckoutBody {
  items: CartItem[]
  customer: {
    name: string
    email: string
    address: string
    city: string
    zip: string
    country: string
    note?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()
    const { items, customer } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'PANIER VIDE' }, { status: 400 })
    }

    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.zip) {
      return NextResponse.json({ error: 'CHAMPS MANQUANTS' }, { status: 400 })
    }

    // Calculate total
    const totalCents = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalStr = totalCents.toFixed(2)

    // Build description
    const description = items
      .map(i => `${i.name} (${i.size}) x${i.quantity}`)
      .join(', ')

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: totalStr,
      },
      description: `MICRON — ${description}`.slice(0, 255),
      redirectUrl: `${siteUrl}/commande/succes?email=${encodeURIComponent(customer.email)}`,
      webhookUrl: `${siteUrl}/api/webhook/mollie`,
      metadata: {
        customer: JSON.stringify(customer),
        items: JSON.stringify(items),
      },
    })

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() })
  } catch (err: unknown) {
    console.error('[checkout]', err)
    const message = err instanceof Error ? err.message : 'ERREUR INCONNUE'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
