'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, AlertCircle, Check, Lock, Gift, X } from 'lucide-react'
import { PLAN_LABELS, PLAN_PRICES, PLAN_HIERARCHY, PlanType, PlatformModule } from '@/lib/modules'

interface Agent {
  id: string
  business_name: string
  email: string
  plan: PlanType
  template: string
  slug: string
  created_at: string
}

interface ModuleWithStatus extends PlatformModule {
  canBeEnabledByPlan: boolean
  isOverrideEnabled: boolean
  isOverrideDisabled: boolean
  isEnabled: boolean
}

interface GroupedModules {
  [category: string]: ModuleWithStatus[]
}

export default function AgentDetailsPage() {
  const params = useParams()
  const agentId = params.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [modules, setModules] = useState<ModuleWithStatus[]>([])
  const [groupedModules, setGroupedModules] = useState<GroupedModules>({})
  const [loading, setLoading] = useState(true)
  const [savingModules, setSavingModules] = useState<Record<string, boolean>>({})
  const [planChanging, setPlanChanging] = useState(false)
  const [newPlan, setNewPlan] = useState<PlanType | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Load agents to find the specific one
        const agentsRes = await fetch('/api/admin/agents')
        if (!agentsRes.ok) throw new Error('Failed to fetch agents')

        const agentsData = await agentsRes.json()
        const agentsList = agentsData.agents || agentsData
        const foundAgent = agentsList.find((a: Agent) => a.id === agentId)

        if (foundAgent) {
          setAgent(foundAgent)
          setNewPlan(foundAgent.plan)
        }

        // Load modules
        const modulesRes = await fetch(`/api/admin/modules?agent_id=${agentId}`)
        if (!modulesRes.ok) throw new Error('Failed to fetch modules')

        const modulesData = await modulesRes.json()
        const agentData = modulesData.agents?.find((a: any) => a.id === agentId) || modulesData

        // Get all platform modules
        const allModulesRes = await fetch('/api/dashboard/modules')
        if (!allModulesRes.ok) throw new Error('Failed to fetch all modules')

        const allModulesData = await allModulesRes.json()

        // Create a map of overrides
        const overridesMap = new Map()
        if (agentData.agent_module_overrides) {
          agentData.agent_module_overrides.forEach((override: any) => {
            overridesMap.set(override.module_id, override)
          })
        }

        // Process modules with status
        const modulesWithStatus = (allModulesData.modules || [] as PlatformModule[]).map((module: PlatformModule) => {
          const override = overridesMap.get(module.id)
          const agentPlan = foundAgent?.plan || agentData.plan
          const canBeEnabledByPlan = PLAN_HIERARCHY[agentPlan as PlanType] >= PLAN_HIERARCHY[module.min_plan]

          let isEnabled = canBeEnabledByPlan

          // Apply overrides if they exist
          if (override) {
            isEnabled = override.is_enabled
          }

          return {
            ...module,
            canBeEnabledByPlan,
            isOverrideEnabled: override?.is_enabled === true && !canBeEnabledByPlan,
            isOverrideDisabled: override?.is_enabled === false && canBeEnabledByPlan,
            isEnabled,
          } as ModuleWithStatus
        })

        setModules(modulesWithStatus)

        // Group by category
        const grouped: GroupedModules = {}
        modulesWithStatus.forEach((module: ModuleWithStatus) => {
          if (!grouped[module.category]) {
            grouped[module.category] = []
          }
          grouped[module.category].push(module)
        })

        setGroupedModules(grouped)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [agentId])

  async function toggleModule(moduleId: string, currentEnabled: boolean) {
    if (!agent) return

    setSavingModules((prev) => ({ ...prev, [moduleId]: true }))

    try {
      const response = await fetch('/api/admin/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agent.id,
          module_id: moduleId,
          is_enabled: !currentEnabled,
          reason: !currentEnabled ? 'admin_override' : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update module')

      // Update local state
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? {
                ...m,
                isEnabled: !currentEnabled,
                isOverrideEnabled: !currentEnabled && !m.canBeEnabledByPlan,
                isOverrideDisabled: currentEnabled && m.canBeEnabledByPlan,
              }
            : m
        )
      )
    } catch (error) {
      console.error('Error updating module:', error)
      alert('Error al actualizar módulo')
    } finally {
      setSavingModules((prev) => ({ ...prev, [moduleId]: false }))
    }
  }

  async function updatePlan() {
    if (!agent || !newPlan || newPlan === agent.plan) return

    setPlanChanging(true)

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agent.id,
          plan: newPlan,
        }),
      })

      if (!response.ok) throw new Error('Failed to update plan')

      const data = await response.json()
      setAgent({ ...agent, ...data.agent })

      // Reload modules to update their status
      window.location.reload()
    } catch (error) {
      console.error('Error updating plan:', error)
      alert('Error al actualizar plan')
    } finally {
      setPlanChanging(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <p className="text-red-700">Agente no encontrado</p>
        <Link href="/admin/agents" className="text-red-600 hover:text-red-700 text-sm mt-2 inline-block">
          Volver a agentes
        </Link>
      </div>
    )
  }

  const planOptions: PlanType[] = ['starter', 'pro', 'premium', 'agency']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/agents" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{agent.business_name}</h1>
          <p className="text-gray-600 mt-1">{agent.email}</p>
        </div>
      </div>

      {/* Agent Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Email</p>
            <p className="text-gray-900 font-medium mt-1">{agent.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Plan</p>
            <p className="text-gray-900 font-medium mt-1">{PLAN_LABELS[agent.plan]}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Plantilla</p>
            <p className="text-gray-900 font-medium mt-1 capitalize">{agent.template || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Slug</p>
            <p className="text-gray-900 font-medium mt-1">{agent.slug || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Registrado</p>
            <p className="text-gray-900 font-medium mt-1">
              {new Date(agent.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Web Pública</p>
            {agent.slug ? (
              <a
                href={`/agente/${agent.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 font-medium mt-1 inline-flex items-center gap-1"
              >
                Ver web
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <p className="text-gray-500 mt-1">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Plan Change */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cambiar plan</h2>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nuevo plan</label>
            <select
              value={newPlan || agent.plan}
              onChange={(e) => setNewPlan(e.target.value as PlanType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-500"
            >
              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  {PLAN_LABELS[plan]} (€{PLAN_PRICES[plan]?.monthly}/mes)
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={updatePlan}
            disabled={planChanging || newPlan === agent.plan}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {planChanging ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Module Access Control */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Control de módulos</h2>

        {Object.entries(groupedModules).map(([category, categoryModules]) => (
          <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {categoryModules.map((module) => (
                <div key={module.id} className="p-6 flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <h4 className="font-medium text-gray-900">{module.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          module.canBeEnabledByPlan
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Requiere: {PLAN_LABELS[module.min_plan]}
                      </span>
                      {module.isOverrideEnabled && (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          Regalo admin
                        </span>
                      )}
                      {module.isOverrideDisabled && (
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-red-100 text-red-700 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Desactivado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleModule(module.id, module.isEnabled)}
                    disabled={savingModules[module.id]}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      module.isEnabled ? 'bg-green-600' : 'bg-gray-300'
                    } ${savingModules[module.id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        module.isEnabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No hay módulos disponibles</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Leyenda</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Verde:</strong> Módulo activo (incluido en el plan)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Gift className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Azul:</strong> Regalo admin (activado fuera del plan)
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Gris:</strong> Bloqueado por plan (no disponible)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
