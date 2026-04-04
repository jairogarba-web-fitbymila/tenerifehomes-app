import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// TEMPORARY TEST ROUTE — DELETE AFTER TESTING
// Tests checkout session creation for all HabiBook prices

const HABIBOOK_PRICES: Record<string, { plan: string; billing: string; price_id: string; expected_amount: number }> = {
  'starter-monthly':  { plan: 'Starter',  billing: 'monthly', price_id: 'price_1TITP1PD1banOEaJXRxJzpmp', expected_amount: 3900 },
  'starter-yearly':   { plan: 'Starter',  billing: 'yearly',  price_id: 'price_1TITP1PD1banOEaJWXMoxuM3', expected_amount: 39000 },
  'pro-monthly':      { plan: 'Pro',      billing: 'monthly', price_id: 'price_1TITP2PD1banOEaJz328bduG', expected_amount: 7900 },
  'pro-yearly':       { plan: 'Pro',      billing: 'yearly',  price_id: 'price_1TITP2PD1banOEaJS2sU3SVs', expected_amount: 79000 },
  'premium-monthly':  { plan: 'Premium',  billing: 'monthly', price_id: 'price_1TITP3PD1banOEaJQEodS7aX', expected_amount: 14900 },
  'premium-yearly':   { plan: 'Premium',  billing: 'yearly',  price_id: 'price_1TITP3PD1banOEaJPQ6gkoCD', expected_amount: 149000 },
  'agencia-monthly':  { plan: 'Agencia',  billing: 'monthly', price_id: 'price_1TITP4PD1banOEaJuOM4S7tX', expected_amount: 34900 },
  'agencia-yearly':   { plan: 'Agencia',  billing: 'yearly',  price_id: 'price_1TITP4PD1banOEaJnHwDizkU', expected_amount: 349000 },
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  return new Stripe(key, { apiVersion: '2025-03-31.basil' as any })
}

export async function POST(req: Request) {
  try {
    const { action, secret } = await req.json()
    if (secret !== 'habibook-test-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = getStripe()

    if (action === 'test-all-prices') {
      // Verify each price exists and has correct amount
      const results: Record<string, any> = {}

      for (const [key, info] of Object.entries(HABIBOOK_PRICES)) {
        try {
          const price = await stripe.prices.retrieve(info.price_id, { expand: ['product'] })
          const product = price.product as Stripe.Product

          results[key] = {
            status: 'OK',
            plan: info.plan,
            billing: info.billing,
            price_id: info.price_id,
            amount: price.unit_amount,
            expected_amount: info.expected_amount,
            amount_match: price.unit_amount === info.expected_amount,
            currency: price.currency,
            currency_ok: price.currency === 'eur',
            recurring_interval: price.recurring?.interval,
            interval_ok: info.billing === 'monthly'
              ? price.recurring?.interval === 'month'
              : price.recurring?.interval === 'year',
            product_name: product.name,
            product_active: product.active,
            metadata_platform: product.metadata?.platform,
            metadata_ok: product.metadata?.platform === 'habibook',
          }
        } catch (err: any) {
          results[key] = { status: 'ERROR', error: err.message }
        }
      }

      // Summary
      const allOk = Object.values(results).every(
        (r) => r.status === 'OK' && r.amount_match && r.currency_ok && r.interval_ok && r.metadata_ok
      )

      return NextResponse.json({ all_passed: allOk, results })
    }

    if (action === 'test-all-checkouts') {
      // Create a checkout session for each price and return URLs
      const checkouts: Record<string, any> = {}
      const baseUrl = 'https://tenerifehomes-app.vercel.app'

      for (const [key, info] of Object.entries(HABIBOOK_PRICES)) {
        try {
          const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: info.price_id, quantity: 1 }],
            success_url: `${baseUrl}/pricing?success=true&plan=${info.plan.toLowerCase()}&billing=${info.billing}`,
            cancel_url: `${baseUrl}/pricing?canceled=true`,
            metadata: {
              plan_key: info.plan.toLowerCase(),
              billing: info.billing,
              platform: 'habibook',
              test: 'true',
            },
          })

          checkouts[key] = {
            status: 'OK',
            plan: info.plan,
            billing: info.billing,
            amount_display: `${info.expected_amount / 100}€/${info.billing === 'monthly' ? 'mes' : 'año'}`,
            session_id: session.id,
            checkout_url: session.url,
          }
        } catch (err: any) {
          checkouts[key] = { status: 'ERROR', error: err.message }
        }
      }

      const allOk = Object.values(checkouts).every((r) => r.status === 'OK')
      return NextResponse.json({ all_passed: allOk, checkouts })
    }

    return NextResponse.json({ error: 'Unknown action. Use: test-all-prices, test-all-checkouts' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
