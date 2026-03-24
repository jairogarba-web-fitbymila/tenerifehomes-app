'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface ModuleDefinition {
  id: string
  slug: string
  name: string
  description: string
  price_monthly: number
  category: string
  is_active: boolean
}

interface AgentModule {
  module_slug: string
  is_active: boolean
  activated_at: string
}

const MODULE_ICONS: Record<string, string> = {
  dominio: '🌐',
  seo: '🔍',
  fotografia_ia: '📸',
  portales: '🏢',
  crm: '👥',
  multiidioma: '🌍',
  valoracion: '💰',
  firma_digital: '✍️',
  chatbot: '🤖',
  email_marketing: '📧',
  analytics: '📊',
  propiedades_ilimitadas: '🏠',
  plantillas_premium: '🎨',
}

export default function DashboardModulesPage() {
  const [modules, setModules] = useState<ModuleDefinition[]>([])
  const [agentModules, setAgentModules] = useState<AgentModule[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)
  const [agentId, setAgentId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setAgentId(user.id)
    
    const [modRes, agentModRes] = await Promise.all([
      supabase.from('module_definitions').select('*').eq('is_active', true).order('price_monthly'),
      supabase.from('agent_modules').select('module_slug, is_active, activated_at').eq('agent_id', user.id)
    ])
    
    setModules(modRes.data || [])
    setAgentModules(agentModRes.data || [])
    setLoading(false)
  }

  async function toggleModule(slug: string) {
    if (!agentId || toggling) return
    setToggling(slug)
    
    const existing = agentModules.find(m => m.module_slug === slug)
    
    if (existing) {
      await supabase
        .from('agent_modules')
        .update({ is_active: !existing.is_active })
        .eq('agent_id', agentId)
        .eq('module_slug', slug)
    } else {
      await supabase
        .from('agent_modules')
        .insert({ agent_id: agentId, module_slug: slug, is_active: true })
    }
    
    await loadData()
    setToggling(null)
  }

  function isModuleActive(slug: string): boolean {
    return agentModules.some(m => m.module_slug === slug && m.is_active)
  }

  function getMonthlyTotal(): number {
    const basePlan = 19
    const modulesTotal = agentModules
      .filter(m => m.is_active)
      .reduce((sum, am) => {
        const mod = modules.find(m => m.slug === am.module_slug)
        return sum + (mod?.price_monthly || 0)
      }, 0)
    return basePlan + modulesTotal
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const activeCount = agentModules.filter(m => m.is_active).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Módulos</h1>
          <p className="mt-2 text-gray-600">Gestiona los módulos activos de tu cuenta HabiBook</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Plan Base</p>
              <p className="text-2xl font-bold text-gray-900">19€<span className="text-sm font-normal text-gray-500">/mes</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Módulos Activos</p>
              <p className="text-2xl font-bold text-blue-600">{activeCount} <span className="text-sm font-normal text-gray-500">de {modules.length}</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Mensual</p>
              <p className="text-2xl font-bold text-green-600">{getMonthlyTotal().toFixed(2)}€<span className="text-sm font-normal text-gray-500">/mes</span></p>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map(mod => {
            const active = isModuleActive(mod.slug)
            const isToggling = toggling === mod.slug
            return (
              <div
                key={mod.slug}
                className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 ${
                  active ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MODULE_ICONS[mod.slug] || '📦'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{mod.name}</h3>
                        <span className="text-xs text-gray-500 uppercase">{mod.category}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{mod.price_monthly}€</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{mod.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {active ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                      onClick={() => toggleModule(mod.slug)}
                      disabled={isToggling}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isToggling ? '...' : active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
                {active && (
                  <div className="border-t border-gray-100 px-6 py-3 bg-blue-50/50">
                    <a
                      href={`/api/modules/${mod.slug.replace(/_/g, '-')}?agent_id=${agentId}`}
                      target="_blank"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Ver API del módulo →
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
