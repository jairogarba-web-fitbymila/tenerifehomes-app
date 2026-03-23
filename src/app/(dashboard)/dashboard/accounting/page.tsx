'use client'

import { useState, useEffect } from 'react'
import { LockedModule } from '@/components/LockedModule'
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
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

export default function AccountingPage() {
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

  // Check access to accounting module
  const hasAccountingAccess = !modulesLoading && hasAccess(modules, overrides, plan, 'accounting')

  if (!modulesLoading && !hasAccountingAccess) {
    const moduleData = modules.find(m => m.id === 'accounting')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
        </div>
        <LockedModule
          moduleName="Contabilidad"
          requiredPlan={moduleData?.min_plan as any}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
            Datos demo
          </span>
          <p className="text-sm text-gray-500">Marzo 2026</p>
        </div>
      </div>

      {/* Tax Alert */}
      <div className="card p-4 border-l-4 border-amber-500 bg-amber-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">Alerta fiscal trimestral</p>
            <p className="text-sm text-amber-700 mt-1">Tu declaración de IGIC del Q1 vence el 20 de abril. No olvides revisar tus transacciones.</p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm font-medium text-gray-600">Ingresos mes</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">12,450€</p>
            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <ArrowUpRight className="w-4 h-4" />
              +12%
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-sm font-medium text-gray-600">Gastos mes</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">2,850€</p>
            <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
              <ArrowDownLeft className="w-4 h-4" />
              +5%
            </div>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-sm font-medium text-gray-600">Beneficio neto</p>
          <p className="text-3xl font-bold text-green-600 mt-2">9,600€</p>
          <p className="text-xs text-gray-500 mt-1">Margen: 77%</p>
        </div>

        <div className="card p-4">
          <p className="text-sm font-medium text-gray-600">IGIC a pagar</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">1,834€</p>
          <p className="text-xs text-gray-500 mt-1">Estimado para Q1</p>
        </div>
      </div>

      {/* IGIC Calculator */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculadora de IGIC</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingresos totales</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                defaultValue="12450"
                className="input-field flex-1"
              />
              <span className="text-gray-500">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Porcentaje IGIC</label>
            <div className="flex items-center gap-2">
              <select className="input-field flex-1 bg-white">
                <option>7% - Alojamiento turístico</option>
                <option>19% - Servicios generales</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">IGIC a pagar:</span>
              <span className="text-2xl font-bold text-amber-600">871.50€</span>
            </div>
          </div>

          <button className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium">
            Exportar para declaración
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transacciones</h3>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              <Plus className="w-4 h-4" />
              Añadir transacción
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { date: '23 Mar', concept: 'Alquiler Casa Vista Mar', category: 'Ingreso', amount: '1,200', type: 'Ingreso' },
                { date: '22 Mar', concept: 'Publicidad Google Ads', category: 'Marketing', amount: '150', type: 'Gasto' },
                { date: '20 Mar', concept: 'Alquiler Apartamento Lujo', category: 'Ingreso', amount: '1,450', type: 'Ingreso' },
                { date: '18 Mar', concept: 'Mantenimiento propiedad', category: 'Mantenimiento', amount: '320', type: 'Gasto' },
                { date: '15 Mar', concept: 'Alquiler Villa Piscina', category: 'Ingreso', amount: '1,800', type: 'Ingreso' },
                { date: '10 Mar', concept: 'Servicio limpieza', category: 'Servicios', amount: '240', type: 'Gasto' },
                { date: '8 Mar', concept: 'Alquiler Casa Vista Mar', category: 'Ingreso', amount: '1,200', type: 'Ingreso' },
                { date: '5 Mar', concept: 'Seguro de vivienda', category: 'Seguros', amount: '450', type: 'Gasto' },
              ].map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tx.concept}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{tx.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{tx.amount}€</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                      tx.type === 'Ingreso'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
