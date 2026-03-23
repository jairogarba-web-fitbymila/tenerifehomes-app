'use client'

import { PlanType, PlatformModule, ModuleOverride, planMeetsRequirement } from '@/lib/modules'

export type ModuleStatus = 'active' | 'locked' | 'addon' | 'disabled'

export interface ModuleAccessResult {
  allowed: boolean
  reason: string
  requiredPlan: PlanType | null
  status: ModuleStatus
}

interface UseModuleAccessProps {
  userPlan: PlanType
  modules: PlatformModule[]
  overrides: ModuleOverride[]
}

export function useModuleAccess({ userPlan, modules, overrides }: UseModuleAccessProps) {
  const overrideMap = new Map(overrides.map(o => [o.module_id, o]))

  const hasAccess = (moduleId: string): ModuleAccessResult => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) {
      return {
        allowed: false,
        reason: 'Módulo no encontrado',
        requiredPlan: null,
        status: 'locked',
      }
    }

    const override = overrideMap.get(moduleId)

    // Check override first
    if (override) {
      if (override.expires_at && new Date(override.expires_at) < new Date()) {
        // Override expired, fall through to plan check
      } else if (!override.is_enabled) {
        return {
          allowed: false,
          reason: override.reason || 'Desactivado por admin',
          requiredPlan: module.min_plan,
          status: 'disabled',
        }
      } else if (override.is_enabled) {
        // Admin has enabled this module
        return {
          allowed: true,
          reason: 'Habilitado por admin',
          requiredPlan: null,
          status: 'active',
        }
      }
    }

    // Check plan hierarchy
    const planMeets = planMeetsRequirement(userPlan, module.min_plan)

    if (planMeets) {
      return {
        allowed: true,
        reason: 'Incluido en tu plan',
        requiredPlan: null,
        status: module.is_addon ? 'addon' : 'active',
      }
    }

    return {
      allowed: false,
      reason: `Se requiere el plan ${module.min_plan}`,
      requiredPlan: module.min_plan,
      status: module.is_addon ? 'addon' : 'locked',
    }
  }

  const getModuleStatus = (moduleId: string): ModuleStatus => {
    const result = hasAccess(moduleId)
    return result.status
  }

  return { hasAccess, getModuleStatus }
}
