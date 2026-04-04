'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { CreditCard, ArrowUpRight, Loader2, Check, AlertCircle, Crown, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { PLAN_LABELS, PLAN_PRICES, PLAN_FEATURES, PlanType, PLAN_HIERARCHY } from '@/lib/modules'

interface BillingData {
  plan: PlanType
  subscription_status: string | null
  current_period_end: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: 'Activa', color: 'bg-green-100 text-green-700' },
  past_due: { label: 'Pago pendiente', color: 'bg-amber-100 text-amber-700' },
  canceled: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
  incomplete: { label: 'Incompleta', color: 'bg-gray-100 text-gray-600' },
  trialing: { label: 'Prueba', color: 'bg-blue-100 text-blue-700' },
}

const ALL_PLANS: PlanType[] = ['starter', 'pro', 'premium', 'agency']

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [agentId, setAgentId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setAgentId(user.id)

      // Get plan from agent_profiles
      const { data: agent } = await supabase
        .from('agent_profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      // Get Stripe data
      const { data: stripeData } = await supabase
        .from('stripe_customers')
        .select('subscription_status, current_period_end, stripe_customer_id, stripe_subscription_id')
        .eq('agent_id', user.id)
        .single()

      setBilling({
        plan: (agent?.plan || 'starter') as PlanType,
        subscription_status: stripeData?.subscription_status || null,
        current_period_end: stripeData?.current_period_end || null,
        stripe_customer_id: stripeData?.stripe_customer_id || null,
        stripe_subscription_id: stripeData?.stripe_subscription_id || null,
      })

      setLoading(false)

      // Check for success param
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('success') === 'true') {
          setSuccess(true)
          setTimeout(() => setSuccess(false), 8000)
          // Clean URL
          window.history.replaceState({}, '', '/dashboard/billing')
        }
      }
    }
    load()
  }, [])

  async function openPortal() {
    if (!agentId) return
    setPortalLoading(true)

    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId }),
      })
      const data = await res.json()

      if (data.portal_url) {
        window.location.href = data.portal_url
      } else {
        alert(data.error || 'Error abriendo portal')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleUpgrade(plan: PlanType) {
    if (!agentId) return
    setCheckoutLoading(plan)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing: 'monthly',
          agent_id: agentId,
        }),
      })
      const data = await res.json()

      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else if (data.redirect) {
        window.location.href = data.redirect
      } else {
        alert(data.error || 'Error al crear sesión de pago')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (!billing) return null

  const hasActiveSubscription = billing.subscription_status === 'active'
  const currentPlanLevel = PLAN_HIERARCHY[billing.plan] || 1
  const statusInfo = STATUS_LABELS[billing.subscription_status || 'incomplete'] || STATUS_LABELS.incomplete

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación y plan</h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona tu suscripción y método de pago</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 text-green-800 px-5 py-4 rounded-xl border border-green-200">
          <Check className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">¡Pago completado!</p>
            <p className="text-sm text-green-700">Tu plan se ha actualizado correctamente. Tu web ya está publicada.</p>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0a1628] rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-[#c9a96e]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Plan {PLAN_LABELS[billing.plan]}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
                {billing.current_period_end && hasActiveSubscription && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Renueva el {new Date(billing.current_period_end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-[#0a1628]">
              {PLAN_PRICES[billing.plan].monthly}€<span className="text-sm font-normal text-gray-400">/mes</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          {PLAN_FEATURES[billing.plan].slice(0, 6).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="w-4 h-4 text-[#c9a96e] flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          {hasActiveSubscription ? (
            <button
              onClick={openPortal}
              disabled={portalLoading}
              className="btn-secondary flex items-center gap-2"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Gestionar suscripción
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link href="/pricing" className="btn-primary flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Elegir un plan
            </Link>
          )}
        </div>
      </div>

      {/* Upgrade options (show higher plans) */}
      {currentPlanLevel < 4 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {hasActiveSubscription ? 'Mejora tu plan' : 'Planes disponibles'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PLANS.filter(p => PLAN_HIERARCHY[p] > currentPlanLevel).map((plan) => {
              const isLoading = checkoutLoading === plan
              return (
                <div key={plan} className="card p-5 hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-[#0a1628] mb-1">{PLAN_LABELS[plan]}</h3>
                  <div className="text-2xl font-bold text-[#0a1628] mb-3">
                    {PLAN_PRICES[plan].monthly}€<span className="text-sm font-normal text-gray-400">/mes</span>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {PLAN_FEATURES[plan].slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-[#c9a96e] flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => hasActiveSubscription ? openPortal() : handleUpgrade(plan)}
                    disabled={isLoading || portalLoading}
                    className="w-full py-2.5 rounded-lg font-medium text-sm bg-[#0a1628] text-white hover:bg-[#1a2a42] transition flex items-center justify-center gap-2"
                  >
                    {isLoading || portalLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {hasActiveSubscription ? 'Cambiar plan' : 'Suscribirme'}
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Not published warning */}
      {!hasActiveSubscription && (
        <div className="flex items-start gap-3 bg-amber-50 text-amber-800 px-5 py-4 rounded-xl border border-amber-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Tu web no está publicada</p>
            <p className="text-sm text-amber-700 mt-1">
              Puedes configurar tu web libremente, pero necesitas un plan activo para que sea visible al público.
              Elige un plan para publicar tu web profesional.
            </p>
          </div>
        </div>
      )}

      {/* Payment past due warning */}
      {billing.subscription_status === 'past_due' && (
        <div className="flex items-start gap-3 bg-red-50 text-red-800 px-5 py-4 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Pago pendiente</p>
            <p className="text-sm text-red-700 mt-1">
              No hemos podido procesar tu último pago. Actualiza tu método de pago para mantener tu web activa.
            </p>
            <button onClick={openPortal} disabled={portalLoading} className="mt-2 text-sm font-semibold text-red-800 underline hover:no-underline">
              Actualizar método de pago
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
