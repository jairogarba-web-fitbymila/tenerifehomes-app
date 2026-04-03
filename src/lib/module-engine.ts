// Module Engine - Central module access control and feature rendering
import { createClient } from '@/lib/supabase-server'

export interface ActiveModule {
  module_slug: string
  is_active: boolean
  activated_at: string
  expires_at: string | null
}

export async function getAgentModules(agentId: string): Promise<ActiveModule[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('agent_modules')
    .select('module_slug, is_active, activated_at, expires_at')
    .eq('agent_id', agentId)
    .eq('is_active', true)
  return data || []
}

export function hasModule(modules: ActiveModule[], slug: string): boolean {
  return modules.some(m => m.module_slug === slug && m.is_active)
}

export const MODULE = {
  DOMINIO: 'dominio',
  SEO: 'seo',
  FOTOGRAFIA_IA: 'fotografia_ia',
  PORTALES: 'portales',
  CRM: 'crm',
  MULTIIDIOMA: 'multiidioma',
  VALORACION: 'valoracion',
  FIRMA_DIGITAL: 'firma_digital',
  CHATBOT: 'chatbot',
  EMAIL_MARKETING: 'email_marketing',
  ANALYTICS: 'analytics',
  PROPIEDADES_ILIMITADAS: 'propiedades_ilimitadas',
  PLANTILLAS_PREMIUM: 'plantillas_premium',
} as const

export function getPropertyLimit(modules: ActiveModule[]): number {
  return hasModule(modules, MODULE.PROPIEDADES_ILIMITADAS) ? Infinity : 15
}

export function getAvailableTemplates(modules: ActiveModule[]): string[] {
  const base = ['luxury']
  if (hasModule(modules, MODULE.PLANTILLAS_PREMIUM)) {
    return ['luxury', 'mediterranean', 'corporate', 'boutique', 'network', 'classic', 'data']
  }
  return base
}

export function getEnabledLanguages(modules: ActiveModule[]): string[] {
  if (hasModule(modules, MODULE.MULTIIDIOMA)) {
    return ['es', 'en', 'de', 'fr', 'it', 'pt', 'nl', 'ru', 'sv', 'no']
  }
  return ['es', 'en']
}

export async function canAddProperty(agentId: string): Promise<{ allowed: boolean; current: number; limit: number }> {
  const supabase = createClient()
  const modules = await getAgentModules(agentId)
  const limit = getPropertyLimit(modules)

  const { count } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .eq('is_active', true)

  const current = count || 0
  return { allowed: current < limit, current, limit: limit === Infinity ? -1 : limit }
}

export function getModuleSummary(modules: ActiveModule[]) {
  return {
    hasPortales: hasModule(modules, MODULE.PORTALES),
    hasMultiidioma: hasModule(modules, MODULE.MULTIIDIOMA),
    hasCRM: hasModule(modules, MODULE.CRM),
    hasSEO: hasModule(modules, MODULE.SEO),
    hasAnalytics: hasModule(modules, MODULE.ANALYTICS),
    hasPlantillasPremium: hasModule(modules, MODULE.PLANTILLAS_PREMIUM),
    hasPropiedadesIlimitadas: hasModule(modules, MODULE.PROPIEDADES_ILIMITADAS),
    hasChatbot: hasModule(modules, MODULE.CHATBOT),
    hasValoracion: hasModule(modules, MODULE.VALORACION),
    hasFotografiaIA: hasModule(modules, MODULE.FOTOGRAFIA_IA),
    hasFirmaDigital: hasModule(modules, MODULE.FIRMA_DIGITAL),
    hasEmailMarketing: hasModule(modules, MODULE.EMAIL_MARKETING),
    hasDominio: hasModule(modules, MODULE.DOMINIO),
    propertyLimit: getPropertyLimit(modules),
    availableTemplates: getAvailableTemplates(modules),
    enabledLanguages: getEnabledLanguages(modules),
    activeCount: modules.length,
  }
}