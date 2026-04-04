import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const SETUP_SECRET = 'habibook-stripe-setup-2026'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY not set')
  return new Stripe(key, { apiVersion: '2025-03-31.basil' as any })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, secret } = body

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stripe = getStripe()

    if (action === 'list') {
      const products = await stripe.products.list({ limit: 100 })
      const result = []
      for (const p of products.data) {
        const prices = await stripe.prices.list({ product: p.id, limit: 20 })
        result.push({
          id: p.id,
          name: p.name,
          active: p.active,
          metadata: p.metadata,
          prices: prices.data.map(pr => ({
            id: pr.id,
            amount: (pr.unit_amount || 0) / 100,
            currency: pr.currency,
            interval: pr.recurring?.interval || 'one-time',
            active: pr.active,
          })),
        })
      }
      return NextResponse.json({ products: result, total: result.length })
    }

    if (action === 'create-habibook') {
      const plans = [
        {
          name: 'HabiBook Starter',
          description: 'Plan Starter — Web profesional para agente inmobiliario. 10 propiedades, 1 plantilla, CRM básico.',
          metadata: { plan_key: 'starter', platform: 'habibook', tier: '1' },
          price_monthly: 3900,
          features: [
            '10 propiedades activas',
            '1 plantilla de diseño',
            'Web profesional con tu marca',
            'CRM básico de contactos',
            'Soporte por email',
          ],
        },
        {
          name: 'HabiBook Pro',
          description: 'Plan Pro — Todo Starter + 50 propiedades, todas las plantillas, distribución a 3 portales, 10 leads/mes.',
          metadata: { plan_key: 'pro', platform: 'habibook', tier: '2' },
          price_monthly: 7900,
          features: [
            '50 propiedades activas',
            'Todas las plantillas',
            'Distribución a 3 portales',
            '10 leads premium/mes',
            'Alquileres básicos',
            '2 campañas email/mes',
            'Soporte prioritario',
          ],
        },
        {
          name: 'HabiBook Premium',
          description: 'Plan Premium — Ilimitado: propiedades, portales, channel manager, MLS, gestión alquileres completa.',
          metadata: { plan_key: 'premium', platform: 'habibook', tier: '3' },
          price_monthly: 14900,
          features: [
            'Propiedades ilimitadas',
            'Todos los portales',
            'Channel manager integrado',
            'Acceso MLS compartido',
            'Gestión alquileres completa',
            '10 campañas email/mes',
            'Contabilidad y fiscalidad',
            'Soporte telefónico',
          ],
        },
        {
          name: 'HabiBook Agencia',
          description: 'Plan Agencia — Todo Premium + 10 agentes incluidos, panel centralizado, analytics avanzados.',
          metadata: { plan_key: 'agency', platform: 'habibook', tier: '4' },
          price_monthly: 34900,
          features: [
            'Todo de Premium',
            '10 agentes incluidos',
            'Panel centralizado',
            'Analytics avanzados',
            'Campañas email ilimitadas',
            'API personalizada',
            'Account manager dedicado',
          ],
        },
      ]

      const results = []

      for (const plan of plans) {
        const product = await stripe.products.create({
          name: plan.name,
          description: plan.description,
          metadata: plan.metadata,
          marketing_features: plan.features.map(f => ({ name: f })),
        })

        const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price_monthly,
          currency: 'eur',
          recurring: { interval: 'month' },
          metadata: { plan_key: plan.metadata.plan_key, billing: 'monthly', platform: 'habibook' },
        })

        const yearlyAmount = plan.price_monthly * 10
        const yearlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: yearlyAmount,
          currency: 'eur',
          recurring: { interval: 'year' },
          metadata: { plan_key: plan.metadata.plan_key, billing: 'yearly', platform: 'habibook' },
        })

        await stripe.products.update(product.id, {
          default_price: monthlyPrice.id,
        })

        results.push({
          plan_key: plan.metadata.plan_key,
          product_id: product.id,
          monthly_price_id: monthlyPrice.id,
          monthly_amount: plan.price_monthly / 100,
          yearly_price_id: yearlyPrice.id,
          yearly_amount: yearlyAmount / 100,
        })
      }

      return NextResponse.json({
        success: true,
        message: 'HabiBook products created successfully',
        products: results,
      })
    }

    if (action === 'test-checkout') {
      const { price_id, success_url, cancel_url } = body
      if (!price_id) return NextResponse.json({ error: 'price_id required' }, { status: 400 })

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: price_id, quantity: 1 }],
        success_url: success_url || 'https://tenerifehomes-app.vercel.app/dashboard?checkout=success',
        cancel_url: cancel_url || 'https://tenerifehomes-app.vercel.app/pricing?checkout=cancelled',
        metadata: { platform: 'habibook' },
      })

      return NextResponse.json({ checkout_url: session.url, session_id: session.id })
    }

    return NextResponse.json({ error: 'Unknown action. Use: list, create-habibook, test-checkout' }, { status: 400 })
  } catch (err: any) {
    console.error('Stripe setup error:', err)
    return NextResponse.json({ error: err.message, type: err.type }, { status: 500 })
  }
}
