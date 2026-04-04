// HabiBook Modular System - 4 planes de suscripción + módulos

// ─── Plan Types ──────────────────────────────────────────────
export type PlanType = 'starter' | 'pro' | 'premium' | 'agency'

export const PLAN_LABELS: Record<PlanType, string> = {
  starter: 'Starter',
  pro: 'Pro',
  premium: 'Premium',
  agency: 'Agencia',
}

export const PLAN_PRICES: Record<PlanType, { monthly: number; yearly: number }> = {
  starter: { monthly: 39, yearly: 390 },
  pro: { monthly: 79, yearly: 790 },
  premium: { monthly: 149, yearly: 1490 },
  agency: { monthly: 349, yearly: 3490 },
}

export const PLAN_HIERARCHY: Record<PlanType, number> = {
  starter: 1,
  pro: 2,
  premium: 3,
  agency: 4,
}

// ─── Stripe Price IDs (Test Mode) ───────────────────────────
// Source of truth: Stripe Dashboard. Created 4 April 2026.
export const STRIPE_PRICE_IDS: Record<PlanType, { monthly: string; yearly: string }> = {
  starter: {
    monthly: 'price_1TITP1PD1banOEaJXRxJzpmp',
    yearly: 'price_1TITP1PD1banOEaJWXMoxuM3',
  },
  pro: {
    monthly: 'price_1TITP2PD1banOEaJz328bduG',
    yearly: 'price_1TITP2PD1banOEaJS2sU3SVs',
  },
  premium: {
    monthly: 'price_1TITP3PD1banOEaJQEodS7aX',
    yearly: 'price_1TITP3PD1banOEaJPQ6gkoCD',
  },
  agency: {
    monthly: 'price_1TITP4PD1banOEaJuOM4S7tX',
    yearly: 'price_1TITP4PD1banOEaJnHwDizkU',
  },
}

// ─── Plan Features (for pricing page) ───────────────────────
export const PLAN_FEATURES: Record<PlanType, string[]> = {
  starter: [
    'Web profesional personalizable',
    'Hasta 10 propiedades',
    '1 plantilla incluida',
    'CRM básico',
    'Panel de gestión',
    'Soporte por email',
    'SSL y hosting incluido',
    'Subdominio *.habibook.com',
  ],
  pro: [
    'Todo de Starter +',
    'Hasta 50 propiedades',
    'Todas las plantillas',
    '3 portales inmobiliarios',
    'Hasta 10 leads/mes',
    'SEO avanzado',
    'Analíticas completas',
    'Multi-idioma (hasta 5)',
  ],
  premium: [
    'Todo de Pro +',
    'Propiedades ilimitadas',
    'Portales ilimitados',
    'Channel manager',
    'MLS compartido',
    'Gestión de alquileres',
    'Valoración IA',
    'Dominio personalizado',
  ],
  agency: [
    'Todo de Premium +',
    'Hasta 10 agentes',
    'Panel centralizado',
    'Analytics avanzado',
    'API de integración',
    'Firma digital',
    'Chatbot IA',
    'Soporte prioritario',
  ],
}

// ─── Module Definitions ─────────────────────────────────────
export interface ModuleDefinition {
  id: string
  slug: string
  name: string
  description: string
  price_monthly: number
  stripe_price_id: string | null
  is_active: boolean
  category: string
  sort_order: number
  features: string[]
}

export interface AgentModule {
  id: string
  agent_id: string
  module_slug: string
  is_active: boolean
  activated_at: string
  expires_at: string | null
  stripe_subscription_item_id: string | null
}

export interface StripeCustomer {
  id: string
  agent_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: string
  current_period_end: string | null
}

// ─── Utility Functions ──────────────────────────────────────
export function planMeetsRequirement(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan]
}

export function getPriceId(plan: PlanType, billing: 'monthly' | 'yearly'): string {
  return STRIPE_PRICE_IDS[plan][billing]
}

export function getPlanPrice(plan: PlanType, billing: 'monthly' | 'yearly'): number {
  return PLAN_PRICES[plan][billing]
}

export function getYearlySavings(plan: PlanType): number {
  const monthlyTotal = PLAN_PRICES[plan].monthly * 12
  const yearlyPrice = PLAN_PRICES[plan].yearly
  return monthlyTotal - yearlyPrice
}

// Module category icons for UI
export const MODULE_ICONS: Record<string, string> = {
  dominio: 'Globe',
  seo: 'Search',
  fotografia_ia: 'Camera',
  portales: 'Share2',
  crm: 'Users',
  multiidioma: 'Languages',
  valoracion: 'TrendingUp',
  firma_digital: 'FileSignature',
  chatbot: 'MessageSquare',
  email_marketing: 'Mail',
  analytics: 'BarChart3',
  propiedades_ilimitadas: 'Building2',
  plantillas_premium: 'Palette',
}

export interface PlatformModule {
  id: string
  name: string
  description: string
  min_plan: PlanType
  is_addon: boolean
  price_monthly?: number
  category: string
  addon_price?: number
  display_order?: number
}

export interface ModuleOverride {
  module_id: string
  is_enabled: boolean
  expires_at?: string
  reason?: string
}

// Check if agent has a specific module active
export function hasModule(agentModules: AgentModule[], moduleSlug: string): boolean {
  return agentModules.some(m => m.module_slug === moduleSlug && m.is_active)
}
