// HabiBook Modular System - Plan base + módulos à la carte
export const BASE_PLAN = {
  name: 'Plan Base HabiBook',
  price: 19,
  currency: 'EUR',
  features: [
    'Web profesional personalizable',
    'Hasta 20 propiedades',
    '1 plantilla incluida',
    'Panel de gestión',
    'Soporte por email',
    'SSL y hosting incluido',
    'Subdominio *.habibook.com',
  ],
}

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

// Check if agent has a specific module active
export function hasModule(agentModules: AgentModule[], moduleSlug: string): boolean {
  return agentModules.some(m => m.module_slug === moduleSlug && m.is_active)
}

// Calculate total monthly cost
export function calculateMonthlyCost(modules: ModuleDefinition[], activeModuleSlugs: string[]): number {
  const moduleCost = modules
    .filter(m => activeModuleSlugs.includes(m.slug))
    .reduce((sum, m) => sum + Number(m.price_monthly), 0)
  return BASE_PLAN.price + moduleCost
}
