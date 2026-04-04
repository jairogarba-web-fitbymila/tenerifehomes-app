'use client'

import { useState, useEffect } from 'react'
import { LockedModule } from '@/components/LockedModule'
import { PlanType } from '@/lib/modules'
import {
  Calendar,
  Users,
  DollarSign,
  LogIn,
  Link2,
  TrendingUp,
} from 'lucide-react'

interface ModuleResponse {
  modules: Array<{ id: string; min_plan: string }>
  overrides: Array<{ module_id: string; is_enabled: boolean }>
  plan: string
}

function hasAccess(modules: Array<{ id: string; min_plan: string }>, overrides: Array<{ module_id: string; is_enabled: boolean }>, plan: string, moduleId: string) {
  if (!modules || !overrides) return true
  const override = overrides.find(o => o.module_id === moduleId)
  if (override) return override.is_enabled
  const mod = modules.find(m => m.id === moduleId)
  if (!mod) return true
  const hierarchy = { starter: 1, pro: 2, premium: 3, agency: 4 }
  return hierarchy[plan as keyof typeof hierarchy] >= hierarchy[mod.min_plan as keyof typeof hierarchy]
}

export default function RentalsPage() {
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
          const data = (await response.json()) as any
          setModules(data.modules || [])
          const agentMods = data.agentModules || []
          setOverrides(agentMods.map((am: any) => ({
            module_id: am.module_slug || am.module_id,
            is_enabled: am.is_active ?? true,
          })))
          setPlan(data.plan || 'starter')
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error)
      } finally {
        setModulesLoading(false)
      }
    }
    loadModules()
  }, [])

  // Check access to rental modules
  const hasRentalAccess = !modulesLoading && hasAccess(modules, overrides, plan, 'properties_rent_vacation')
  const hasChannelManager = !modulesLoading && hasAccess(modules, overrides, plan, 'channel_manager')

  if (!modulesLoading && !hasRentalAccess) {
    const moduleData = modules?.find(m => m.id === 'properties_rent_vacation')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alquileres vacacionales</h1>
        </div>
        <LockedModule
          moduleName="Alquileres vacacionales"
          requiredPlan={moduleData?.min_plan as PlanType}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alquileres vacacionales</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            Datos demo
          </span>
          <p className="text-sm text-gray-500">Gestiona tus reservaciones y calendario de ocupación</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ocupación este mes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">68%</p>
            </div>
            <Calendar className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos brutos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">8,450€</p>
            </div>
            <DollarSign className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximo check-in</p>
              <p className="text-sm font-semibold text-gray-900 mt-2">25 de Marzo</p>
              <p className="text-xs text-gray-500 mt-1">En 2 días</p>
            </div>
            <LogIn className="w-8 h-8 text-brand-100 text-opacity-50" />
          </div>
        </div>
      </div>

      {/* Channel Manager Status */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sincronización de canales</h3>
            <p className="text-sm text-gray-500 mt-1">Estado de conexión con plataformas de alquiler</p>
          </div>
          {!hasChannelManager && (
            <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
              Bloqueado
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Airbnb</p>
                <p className="text-xs text-gray-500">Conectado</p>
              </div>
            </div>
            {hasChannelManager ? (
              <button className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                Sincronizado
              </button>
            ) : (
              <span className="text-xs text-gray-400">No disponible</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">B</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Booking.com</p>
                <p className="text-xs text-gray-500">Conectado</p>
              </div>
            </div>
            {hasChannelManager ? (
              <button className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                Sincronizado
              </button>
            ) : (
              <span className="text-xs text-gray-400">No disponible</span>
            )}
          </div>
        </div>

        {!hasChannelManager && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-start gap-2">
            <Link2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Sincronización de canales bloqueada</p>
              <p className="text-xs mt-1">Actualiza a Premium para conectar automáticamente con Airbnb y Booking</p>
            </div>
          </div>
        )}
      </div>

      {/* Calendar View */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendario de ocupación</h3>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Vista de calendario</p>
          <p className="text-sm text-gray-500">Próximamente: Visualización interactiva del calendario de ocupación</p>
        </div>
      </div>

      {/* Reservations List */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservaciones</h3>
        <div className="space-y-3">
          {[
            {
              guest: 'María García',
              property: 'Casa Vista Mar',
              dates: '25 Mar - 31 Mar',
              status: 'confirmed',
              total: '1,200€',
            },
            {
              guest: 'John Smith',
              property: 'Apartamento Lujo',
              dates: '2 Abr - 9 Abr',
              status: 'confirmed',
              total: '980€',
            },
            {
              guest: 'Ana López',
              property: 'Villa con Piscina',
              dates: '5 Abr - 12 Abr',
              status: 'pending',
              total: '1,450€',
            },
            {
              guest: 'Klaus Mueller',
              property: 'Casa Vista Mar',
              dates: '15 Abr - 22 Abr',
              status: 'confirmed',
              total: '1,200€',
            },
          ].map((reservation, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{reservation.guest}</p>
                <p className="text-xs text-gray-500 mt-1">{reservation.property}</p>
                <p className="text-xs text-gray-500 mt-1">{reservation.dates}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{reservation.total}</p>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                    reservation.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
