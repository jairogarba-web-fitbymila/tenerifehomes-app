import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-03-31.basil' as any,
    })

    // First, list existing webhooks to avoid duplicates
    const existing = await (stripe.webhookEndpoints as any).list({ limit: 100 })
    const alreadyExists = existing.data.find(
      (wh: any) => wh.url === 'https://tenerifehomes-app.vercel.app/api/webhooks/stripe'
    )

    if (alreadyExists) {
      return NextResponse.json({
        status: 'already_exists',
        webhook_id: alreadyExists.id,
        webhook_secret: alreadyExists.secret || 'Secret only shown on creation — check Stripe dashboard',
        url: alreadyExists.url,
        events: alreadyExists.enabled_events,
        message: 'Webhook already exists. If you need the secret, delete and recreate.',
      })
    }

    // Create webhook endpoint
    const webhook = await (stripe.webhookEndpoints as any).create({
      url: 'https://tenerifehomes-app.vercel.app/api/webhooks/stripe',
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_failed',
      ],
      description: 'HabiBook production webhook',
    })

    return NextResponse.json({
      status: 'created',
      webhook_id: webhook.id,
      webhook_secret: webhook.secret,
      url: webhook.url,
      events: webhook.enabled_events,
      message: 'IMPORTANT: Save the webhook_secret as STRIPE_WEBHOOK_SECRET env var in Vercel!',
    })
  } catch (err: any) {
    console.error('Setup webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
