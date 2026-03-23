'use client'

import Link from 'next/link'
import { Lock, AlertCircle } from 'lucide-react'
import { PlanType, PLAN_LABELS, PLAN_PRICES } from '@/lib/modules'

interface LockedModuleProps {
  moduleName: string
  requiredPlan?: PlanType | null
  isAddon?: boolean
  addonPrice?: number | null
  isAdminDisabled?: boolean
}

export function LockedModule({
  moduleName,
  requiredPlan,
  isAddon = false,
  addonPrice = null,
  isAdminDisabled = false,
}: LockedModuleProps) {
  if (isAdminDisabled) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{moduleName}</h3>
          <p className="text-gray-600 mb-6">
            Este módulo está desactivado. Por favor, contacta con soporte para más información.
          </p>
          <a
            href="mailto:soporte@tenerifehomes.com"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Contactar Soporte
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="text-center max-w-sm">
        <Lock className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{moduleName}</h3>
        <p className="text-gray-600 mb-6">
          {isAddon
            ? `Este módulo está disponible como complemento adicional.`
            : requiredPlan
              ? `Necesitas el plan ${PLAN_LABELS[requiredPlan]} o superior para acceder a este módulo.`
              : 'Este módulo no está disponible en tu plan actual.'}
        </p>

        <div className="space-y-3">
          {isAddon && addonPrice ? (
            <button className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Añadir por {addonPrice}€/mes
            </button>
          ) : requiredPlan ? (
            <Link
              href="/dashboard/billing"
              className="block w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Actualizar a {PLAN_LABELS[requiredPlan]}
            </Link>
          ) : null}

          <Link
            href="/dashboard"
            className="block w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>

        {requiredPlan && (
          <p className="text-sm text-gray-500 mt-6">
            Actualmente: <span className="font-medium">€{PLAN_PRICES[requiredPlan]}/mes</span>
          </p>
        )}
      </div>
    </div>
  )
}
