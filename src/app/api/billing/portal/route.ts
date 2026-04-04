import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as any,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { agent_id } = await req.json()

    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id requerido' }, { status: 400 })
    }

    // Get Stripe customer ID for this agent
    const { data: stripeCustomer, error } = await supabaseAdmin
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('agent_id', agent_id)
      .single()

    if (error || !stripeCustomer?.stripe_customer_id) {
      return NextResponse.json({
        error: 'No tienes una suscripción activa. Elige un plan primero.',
        redirect: '/pricing'
      }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tenerifehomes-app.vercel.app'

    // Create Stripe Customer Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/billing`,
    })

    return NextResponse.json({ portal_url: portalSession.url })
  } catch (err: any) {
    console.error('Portal error:', err)
    return NextResponse.json({ error: err.message || 'Error abriendo portal de facturación' }, { status: 500 })
  }
}
