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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Disable body parsing — Stripe needs raw body for signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function updateAgentPlan(agentId: string, plan: string, subscriptionStatus: string, subscriptionId: string, currentPeriodEnd: string | null) {
  // Update stripe_customers table
  await supabaseAdmin
    .from('stripe_customers')
    .upsert({
      agent_id: agentId,
      stripe_subscription_id: subscriptionId,
      subscription_status: subscriptionStatus,
      current_period_end: currentPeriodEnd,
    }, { onConflict: 'agent_id' })

  // Update agent's plan in profile (only if subscription is active)
  if (subscriptionStatus === 'active') {
    await supabaseAdmin
      .from('agent_profiles')
      .update({ plan })
      .eq('id', agentId)
  }

  // If subscription is canceled/unpaid, downgrade to starter
  if (['canceled', 'unpaid', 'past_due'].includes(subscriptionStatus)) {
    await supabaseAdmin
      .from('agent_profiles')
      .update({ plan: 'starter', is_published: false })
      .eq('id', agentId)
  }

  console.log(`[Stripe Webhook] Agent ${agentId}: plan=${plan}, status=${subscriptionStatus}`)
}

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    console.log(`[Stripe Webhook] Event: ${event.type}`)

    switch (event.type) {
      // ─── Checkout completed: first payment ────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const agentId = session.metadata?.agent_id
        const planKey = session.metadata?.plan_key

        if (!agentId || !planKey) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get subscription details
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          await updateAgentPlan(
            agentId,
            planKey,
            subscription.status,
            subscription.id,
            subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000).toISOString()
              : null
          )
        }

        // Mark agent as published (they paid!)
        await supabaseAdmin
          .from('agent_profiles')
          .update({ is_published: true })
          .eq('id', agentId)

        break
      }

      // ─── Subscription updated (plan change, renewal) ─────
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const agentId = subscription.metadata?.agent_id
        const planKey = subscription.metadata?.plan_key

        if (!agentId) {
          // Try to find agent by Stripe customer ID
          const { data: sc } = await supabaseAdmin
            .from('stripe_customers')
            .select('agent_id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single()

          if (sc) {
            await updateAgentPlan(
              sc.agent_id,
              planKey || 'starter',
              subscription.status,
              subscription.id,
              subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null
            )
          }
          break
        }

        await updateAgentPlan(
          agentId,
          planKey || 'starter',
          subscription.status,
          subscription.id,
          subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null
        )
        break
      }

      // ─── Subscription deleted (canceled) ──────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const agentId = subscription.metadata?.agent_id

        let targetAgentId = agentId

        if (!targetAgentId) {
          const { data: sc } = await supabaseAdmin
            .from('stripe_customers')
            .select('agent_id')
            .eq('stripe_customer_id', subscription.customer as string)
            .single()
          targetAgentId = sc?.agent_id
        }

        if (targetAgentId) {
          await updateAgentPlan(
            targetAgentId,
            'starter',
            'canceled',
            subscription.id,
            null
          )
        }
        break
      }

      // ─── Invoice payment failed ───────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: sc } = await supabaseAdmin
          .from('stripe_customers')
          .select('agent_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sc) {
          await supabaseAdmin
            .from('stripe_customers')
            .update({ subscription_status: 'past_due' })
            .eq('agent_id', sc.agent_id)

          console.log(`[Stripe Webhook] Payment failed for agent ${sc.agent_id}`)
        }
        break
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
