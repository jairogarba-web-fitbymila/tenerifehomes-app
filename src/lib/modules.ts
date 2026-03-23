export type PlanType = 'starter' | 'pro' | 'premium' | 'agency'

export const PLAN_HIERARCHY: Record<PlanType, number> = {
  starter: 1,
  pro: 2,
  premium: 3,
  agency: 4,
}

export const PLAN_LABELS: Record<PlanType, string> = {
  starter: 'Starter',
  pro: 'Pro',
  premium: 'Premium',
  agency: 'Agencia',
}

export const PLAN_PRICES: Record<PlanType, number> = {
  starter: 39,
  pro: 79,
  premium: 149,
  agency: 349,
}

export interface PlatformModule {
  id: string
  name: string
  description: string
  category: string
  icon: string
  min_plan: PlanType
  is_addon: boolean
  addon_price: number | null
  display_order: number
}

export interface ModuleOverride {
  module_id: string
  is_enabled: boolean
  reason: string | null
  expires_at: string | null
}

// Check if a plan meets the minimum requirement
export function planMeetsRequirement(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan]
}
