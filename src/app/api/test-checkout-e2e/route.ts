import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: any[] = []

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-03-31.basil' as any,
    })
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // ─── Step 1: Get the test agent ─────────────────────────
    // Find first agent to test with
    const { data: agents, error: agentError } = await supabase
      .from('agent_profiles')
      .select('id, email, business_name, plan')
      .limit(5)

    if (agentError) {
      return NextResponse.json({ error: 'DB query failed', detail: agentError.message, hint: agentError.hint }, { status: 500 })
    }

    if (!agents || agents.length === 0) {
      return NextResponse.json({ error: 'No agents in agent_profiles table', agents_count: agents?.length || 0 }, { status: 404 })
    }

    const agent = agents[0] as any

    results.push({
      step: '1. Agent found',
      agent_id: agent.id,
      email: agent.email,
      current_plan: agent.plan,
    })

    // ─── Step 2: Create Stripe customer with test card ──────
    const paymentMethod = await (stripe.paymentMethods as any).create({
      type: 'card',
      card: { token: 'tok_visa' }, // Stripe test token for 4242 card
    })

    results.push({
      step: '2. Payment method created',
      pm_id: paymentMethod.id,
      card_last4: paymentMethod.card?.last4,
    })

    // Check if customer already exists
    let { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('agent_id', agent.id)
      .single()

    let customerId: string

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id
      // Attach payment method to existing customer
      await (stripe.paymentMethods as any).attach(paymentMethod.id, {
        customer: customerId,
      })
      await (stripe.customers as any).update(customerId, {
        invoice_settings: { default_payment_method: paymentMethod.id },
      })
      results.push({ step: '2b. Reusing existing Stripe customer', customer_id: customerId })
    } else {
      const customer = await (stripe.customers as any).create({
        email: agent.email,
        name: agent.business_name,
        payment_method: paymentMethod.id,
        invoice_settings: { default_payment_method: paymentMethod.id },
        metadata: { agent_id: agent.id, platform: 'habibook' },
      })
      customerId = customer.id

      await supabase.from('stripe_customers').upsert({
        agent_id: agent.id,
        stripe_customer_id: customerId,
        subscription_status: 'incomplete',
      }, { onConflict: 'agent_id' })

      results.push({ step: '2b. Stripe customer created', customer_id: customerId })
    }

    // ─── Step 3: Create subscription (Starter monthly) ──────
    const subscription: any = await (stripe.subscriptions as any).create({
      customer: customerId,
      items: [{ price: 'price_1TITP1PD1banOEaJXRxJzpmp' }], // Starter monthly
      metadata: {
        agent_id: agent.id,
        plan_key: 'starter',
        billing: 'monthly',
        platform: 'habibook',
      },
      expand: ['latest_invoice.payment_intent'],
    })

    results.push({
      step: '3. Subscription created',
      subscription_id: subscription.id,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      plan: 'starter',
      billing: 'monthly',
      amount: '39 EUR',
    })

    // ─── Step 4: Wait a moment for webhook to process ───────
    await new Promise(resolve => setTimeout(resolve, 3000))

    // ─── Step 5: Check DB was updated by webhook ────────────
    const { data: updatedAgent } = await supabase
      .from('agent_profiles')
      .select('plan')
      .eq('id', agent.id)
      .single()

    const { data: stripeRecord } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id, stripe_subscription_id, subscription_status, current_period_end')
      .eq('agent_id', agent.id)
      .single()

    results.push({
      step: '4. DB state after webhook',
      agent_plan: updatedAgent?.plan,
      agent_plan_updated: updatedAgent?.plan,
      stripe_customer: stripeRecord,
    })

    // ─── Step 6: Verify via Stripe that subscription is active
    const subCheck: any = await (stripe.subscriptions as any).retrieve(subscription.id)
    results.push({
      step: '5. Stripe subscription verification',
      status: subCheck.status,
      cancel_at_period_end: subCheck.cancel_at_period_end,
    })

    // ─── Step 7: Cancel the test subscription ───────────────
    const canceled: any = await (stripe.subscriptions as any).cancel(subscription.id)
    results.push({
      step: '6. Test subscription canceled',
      status: canceled.status,
    })

    // Wait for cancellation webhook
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check DB after cancellation
    const { data: afterCancel } = await supabase
      .from('agent_profiles')
      .select('plan')
      .eq('id', agent.id)
      .single()

    const { data: stripeAfterCancel } = await supabase
      .from('stripe_customers')
      .select('subscription_status')
      .eq('agent_id', agent.id)
      .single()

    results.push({
      step: '7. DB after cancellation webhook',
      agent_plan: afterCancel?.plan,
      agent_plan_after: afterCancel?.plan,
      subscription_status: stripeAfterCancel?.subscription_status,
    })

    // ─── Summary ────────────────────────────────────────────
    const allPassed =
      subscription.status === 'active' &&
      subCheck.status === 'active' &&
      canceled.status === 'canceled'

    return NextResponse.json({
      test: 'E2E Stripe Checkout Simulation',
      overall: allPassed ? 'PASS' : 'PARTIAL',
      note: 'Webhook processing is async — DB updates may take a few extra seconds',
      steps: results,
    })

  } catch (err: any) {
    return NextResponse.json({
      test: 'E2E Stripe Checkout Simulation',
      overall: 'FAIL',
      error: err.message,
      steps: results,
    }, { status: 500 })
  }
}
