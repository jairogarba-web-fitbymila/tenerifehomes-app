'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { PLAN_LABELS, PLAN_PRICES, PLAN_FEATURES, STRIPE_PRICE_IDS, PlanType, getYearlySavings } from '@/lib/modules'

const PLANS: PlanType[] = ['starter', 'pro', 'premium', 'agency']

const PLAN_DESCRIPTIONS: Record<PlanType, string> = {
  starter: 'Para empezar con tu presencia online profesional',
  pro: 'Para agentes que quieren crecer y captar más clientes',
  premium: 'Para profesionales que necesitan todo sin límites',
  agency: 'Para agencias con múltiples agentes y operaciones',
}

const POPULAR_PLAN: PlanType = 'pro'

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [agentId, setAgentId] = useState<string | null>(null)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setAgentId(user.id)
      }
    })

    // Check for canceled query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('canceled') === 'true') {
        setCanceled(true)
        setTimeout(() => setCanceled(false), 5000)
      }
    }
  }, [])

  async function handleCheckout(plan: PlanType) {
    if (!user) {
      // Not logged in — redirect to register
      window.location.href = `/register?plan=${plan}&billing=${billing}`
      return
    }

    setLoadingPlan(plan)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billing,
          agent_id: agentId,
        }),
      })

      const data = await res.json()

      if (data.redirect) {
        window.location.href = data.redirect
        return
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert(data.error || 'Error al crear sesión de pago')
      }
    } catch (err) {
      alert('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0a1628] text-white px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">HabiBook</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard" className="bg-[#c9a96e] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#b8944d] transition">
              Mi Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white transition">Iniciar sesión</Link>
              <Link href="/register" className="bg-[#c9a96e] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#b8944d] transition">
                Empieza gratis
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Canceled banner */}
      {canceled && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-center py-3 text-sm">
          Pago cancelado. Puedes elegir un plan cuando quieras.
        </div>
      )}

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">
          Elige el plan perfecto para tu negocio
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
          Regístrate gratis, configura tu web, y publica cuando estés listo. Sin permanencia.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
          <button
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              billing === 'monthly'
                ? 'bg-[#0a1628] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              billing === 'yearly'
                ? 'bg-[#0a1628] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anual
            <span className="ml-1.5 inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
              2 meses gratis
            </span>
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isPopular = plan === POPULAR_PLAN
            const price = PLAN_PRICES[plan][billing]
            const monthlyEquiv = billing === 'yearly' ? Math.round(price / 12) : price
            const savings = billing === 'yearly' ? getYearlySavings(plan) : 0
            const isLoading = loadingPlan === plan

            return (
              <div
                key={plan}
                className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col transition-all ${
                  isPopular
                    ? 'border-[#c9a96e] shadow-xl scale-[1.02]'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-[#c9a96e] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-lg font-bold text-[#0a1628] mb-1">{PLAN_LABELS[plan]}</h3>
                <p className="text-sm text-gray-500 mb-6">{PLAN_DESCRIPTIONS[plan]}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[#0a1628]">{monthlyEquiv}€</span>
                    <span className="text-gray-400">/mes</span>
                  </div>
                  {billing === 'yearly' && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">Facturado {price}€/año</span>
                      <span className="ml-2 text-sm text-green-600 font-semibold">Ahorras {savings}€</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mb-8 ${
                    isPopular
                      ? 'bg-[#c9a96e] text-white hover:bg-[#b8944d] shadow-md'
                      : 'bg-[#0a1628] text-white hover:bg-[#1a2a42]'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {user ? 'Suscribirme' : 'Empezar ahora'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {PLAN_FEATURES[plan].map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="w-5 h-5 text-[#c9a96e] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ section */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-[#0a1628] mb-10">Preguntas frecuentes</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-1">¿Puedo probar antes de pagar?</h3>
            <p className="text-gray-600 text-sm">Sí. Regístrate gratis, configura tu web con tu plantilla favorita, y publica solo cuando estés satisfecho.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-1">¿Hay permanencia?</h3>
            <p className="text-gray-600 text-sm">No. Puedes cancelar en cualquier momento desde tu panel. Tu web seguirá activa hasta el final del periodo pagado.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-1">¿Puedo cambiar de plan?</h3>
            <p className="text-gray-600 text-sm">Sí. Sube o baja de plan cuando quieras desde tu dashboard. El cambio se aplica de forma inmediata con prorrateo automático.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-1">¿El plan anual tiene descuento?</h3>
            <p className="text-gray-600 text-sm">Sí, el plan anual equivale a 10 meses: te regalamos 2 meses al año.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0a1628] mb-1">¿Qué métodos de pago aceptáis?</h3>
            <p className="text-gray-600 text-sm">Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express). Los pagos se procesan de forma segura con Stripe.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-100">
        © 2026 HabiBook. Todos los derechos reservados.
      </footer>
    </div>
  )
}
