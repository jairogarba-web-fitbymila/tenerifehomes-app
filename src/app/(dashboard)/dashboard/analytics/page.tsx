'use client'

import { useState, useEffect } from 'react'
import { LockedModule } from '@/components/LockedModule'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Zap,
} from 'lucide-react'

interface ModuleResponse {
  modules: Array<{ id: string; min_plan: string }>
  overrides: Array<{ module_id: string; is_enabled: boolean }>
  plan: string
}

function hasAccess(modules: Array<{ id: string; min_plan: string }>, overrides: Array<{ module_id: string; is_enabled: boolean }>, plan: string, moduleId: string) {
  const override = overrides.find(o => o.module_id === moduleId)
  if (override) return override.is_enabled
  const mod = modules.find(m => m.id === moduleId)
  if (!mod) return false
  const hierarchy = { starter: 1, pro: 2, premium: 3, agency: 4 }
  return hierarchy[plan as keyof typeof hierarchy] >= hierarchy[mod.min_plan as keyof typeof hierarchy]
}

export default function AnalyticsPage() {
  const [modules, setModules] = useState<Array<{ id: string; min_plan: string }>>([])
  const [overrides, setOverrides] = useState<Array<{ module_id: string; is_enabled: boolean }>>([])
  const [plan, setPlan] = useState<string>('')
  const [modulesLoading, setModulesLoading] = useState(true)

  // Load module access info
  useEffect(() => {
    async function loadModules() {
      try {
        const response = await fetch('/api/dashboard/modules')
        if (response.ok) {
          const data = (await response.json()) as ModuleResponse
          setModules(data.modules)
          setOverrides(data.overrides)
          setPlan(data.plan)
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error)
      } finally {
        setModulesLoading(false)
      }
    }
    loadModules()
  }, [])

  // Check access to analytics modules
  const hasBasicAnalytics = !modulesLoading && hasAccess(modules, overrides, plan, 'analytics_basic')
  const hasAdvancedAnalytics = !modulesLoading && hasAccess(modules, overrides, plan, 'analytics_advanced')

  if (!modulesLoading && !hasBasicAnalytics) {
    const moduleData = modules.find(m => m.id === 'analytics_basic')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
        </div>
        <LockedModule
          moduleName="Analíticas"
          requiredPlan={moduleData?.min_plan as any}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analíticas</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            Datos demo
          </span>
          <p className="text-sm text-gray-500">Los datos reales se mostrarán cuando publiques propiedades</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visitas este mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
            </div>
            <Eye className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads este mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">47</p>
            </div>
            <Users className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasa de conversión</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">3.8%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propiedad más vista</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">Casa Vista Mar</p>
              <p className="text-xs text-gray-500 mt-1">389 visitas</p>
            </div>
            <Zap className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitas */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitas a tu web</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-end justify-around px-4 py-8 relative">
            <div className="flex items-end gap-1 h-full flex-1">
              {[65, 45, 78, 52, 88, 72, 95].map((height, i) => (
                <div key={i} className="flex-1 bg-brand-500 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} title={`Semana ${i + 1}: ${height} visitas`} />
              ))}
            </div>
            <div className="absolute bottom-2 right-4 text-xs text-gray-500">últimas 7 semanas</div>
          </div>
          <div className="grid grid-cols-7 gap-2 mt-4 text-xs text-gray-500 text-center">
            <div>S1</div>
            <div>S2</div>
            <div>S3</div>
            <div>S4</div>
            <div>S5</div>
            <div>S6</div>
            <div>S7</div>
          </div>
        </div>

        {/* Leads por mes */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads recibidos por mes</h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-end justify-around px-4 py-8 relative">
            <div className="flex items-end gap-1 h-full flex-1">
              {[45, 52, 48, 67, 72, 58, 81, 76, 88, 92, 85, 98].map((height, i) => (
                <div key={i} className="flex-1 bg-emerald-500 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }} title={`Mes ${i + 1}: ${height} leads`} />
              ))}
            </div>
            <div className="absolute bottom-2 right-4 text-xs text-gray-500">últimos 12 meses</div>
          </div>
          <div className="grid grid-cols-12 gap-1 mt-4 text-xs text-gray-500 text-center">
            {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m) => (
              <div key={m}>{m}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Propiedades más vistas */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades más vistas</h3>
        <div className="space-y-3">
          {[
            { title: 'Casa Vista Mar', views: 389, conversion: 4.2 },
            { title: 'Apartamento Lujo Centro', views: 312, conversion: 3.8 },
            { title: 'Villa con Piscina', views: 298, conversion: 3.1 },
            { title: 'Estudio Moderno', views: 187, conversion: 2.9 },
            { title: 'Casa Rústica Tenerife', views: 156, conversion: 2.5 },
          ].map((prop, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{prop.title}</p>
                <p className="text-xs text-gray-500 mt-1">{prop.views} visitas</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {prop.conversion}% conversión
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Analytics Section */}
      {hasAdvancedAnalytics && (
        <div className="space-y-6 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Analíticas Avanzadas</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ROI por propiedad */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ROI por propiedad</h3>
              <div className="space-y-3">
                {[
                  { title: 'Casa Vista Mar', roi: 24.5 },
                  { title: 'Apartamento Lujo Centro', roi: 18.7 },
                  { title: 'Villa con Piscina', roi: 22.1 },
                  { title: 'Estudio Moderno', roi: 15.3 },
                ].map((prop, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{prop.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${prop.roi}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">{prop.roi}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparativa de zonas */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa de zonas</h3>
              <div className="space-y-3">
                {[
                  { zone: 'Centro Tenerife', leads: 145, avgPrice: 450000 },
                  { zone: 'Norte Costa', leads: 98, avgPrice: 380000 },
                  { zone: 'Sur Playas', leads: 112, avgPrice: 320000 },
                  { zone: 'Zona Rural', leads: 54, avgPrice: 250000 },
                ].map((zone, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-gray-900">{zone.zone}</span>
                      <span className="text-sm text-brand-600 font-semibold">{zone.leads} leads</span>
                    </div>
                    <p className="text-xs text-gray-500">Precio medio: {zone.avgPrice.toLocaleString()}€</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Informe descargable */}
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Informe mensual</h3>
                <p className="text-sm text-gray-500 mt-1">Análisis completo de marzo 2026 con recomendaciones</p>
              </div>
              <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium">
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
