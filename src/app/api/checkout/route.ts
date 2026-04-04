import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { STRIPE_PRICE_IDS, PlanType } from '@/lib/modules'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as any,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_PLANS: PlanType[] = ['starter', 'pro', 'premium', 'agency']
const VALID_BILLINGS = ['monthly', 'yearly'] as const

export async function POST(req: Request) {
  try {
    const { plan, billing, agent_id, return_url } = await req.json()

    // Validate inputs
    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
    }
    if (!VALID_BILLINGS.includes(billing)) {
      return NextResponse.json({ error: 'Tipo de facturación inválido' }, { status: 400 })
    }
    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id requerido' }, { status: 400 })
    }

    // Get agent profile
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agent_profiles')
      .select('id, email, business_name')
      .eq('id', agent_id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agente no encontrado' }, { status: 404 })
    }

    // Check if agent already has a Stripe customer
    const { data: stripeCustomer } = await supabaseAdmin
      .from('stripe_customers')
      .select('stripe_customer_id, stripe_subscription_id, subscription_status')
      .eq('agent_id', agent_id)
      .single()

    let customerId = stripeCustomer?.stripe_customer_id

    // If agent has active subscription, redirect to portal instead
    if (stripeCustomer?.subscription_status === 'active' && stripeCustomer?.stripe_subscription_id) {
      return NextResponse.json({
        error: 'Ya tienes una suscripción activa. Usa el portal de facturación para cambiar de plan.',
        redirect: '/dashboard/billing'
      }, { status: 409 })
    }

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: agent.email,
        name: agent.business_name,
        metadata: {
          agent_id: agent.id,
          platform: 'habibook',
        },
      })
      customerId = customer.id

      // Save Stripe customer in DB
      await supabaseAdmin.from('stripe_customers').upsert({
        agent_id: agent.id,
        stripe_customer_id: customerId,
        subscription_status: 'incomplete',
      }, { onConflict: 'agent_id' })
    }

    // Get the right price ID
    const priceId = STRIPE_PRICE_IDS[plan as PlanType][billing as 'monthly' | 'yearly']

    const baseUrl = return_url || process.env.NEXT_PUBLIC_SITE_URL || 'https://tenerifehomes-app.vercel.app'

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/billing?success=true&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        agent_id: agent.id,
        plan_key: plan,
        billing,
        platform: 'habibook',
      },
      subscription_data: {
        metadata: {
          agent_id: agent.id,
          plan_key: plan,
          billing,
          platform: 'habibook',
        },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      checkout_url: session.url,
      session_id: session.id,
    })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: err.message || 'Error creando sesión de checkout' }, { status: 500 })
  }
}
