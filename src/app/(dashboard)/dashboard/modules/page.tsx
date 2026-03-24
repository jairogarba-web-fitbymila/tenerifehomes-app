'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface ModuleDefinition { slug: string; name: string; description: string; price_monthly: number; category: string }
interface AgentModule { module_slug: string; is_active: boolean }

const MODULE_CONFIG: Record<string, { icon: string; href?: string; color: string }> = {
  portales: { icon: '🏢', href: '/dashboard/modules/portales', color: 'blue' },
  multiidioma: { icon: '🌍', href: '/dashboard/modules/multiidioma', color: 'green' },
  plantillas_premium: { icon: '🎨', color: 'purple' },
  propiedades_ilimitadas: { icon: '🏠', color: 'orange' },
  crm: { icon: '👥', color: 'teal' },
  seo: { icon: '🔍', color: 'indigo' },
  analytics: { icon: '📊', color: 'cyan' },
  chatbot: { icon: '🤖', color: 'gray' },
  valoracion: { icon: '💰', color: 'yellow' },
  fotografia_ia: { icon: '📸', color: 'pink' },
  firma_digital: { icon: '✍️', color: 'slate' },
  email_marketing: { icon: '📧', color: 'red' },
  dominio: { icon: '🌐', color: 'emerald' },
}

const TIER_1 = ['portales', 'multiidioma', 'plantillas_premium', 'propiedades_ilimitadas']
const TIER_FUTURE = ['chatbot', 'valoracion', 'fotografia_ia', 'firma_digital', 'email_marketing', 'dominio']

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

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setAgentId(user.id)
    const [modRes, agentModRes] = await Promise.all([
      supabase.from('module_definitions').select('*').eq('is_active', true).order('price_monthly'),
      supabase.from('agent_modules').select('module_slug, is_active').eq('agent_id', user.id)
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
      await supabase.from('agent_modules').update({ is_active: !existing.is_active }).eq('agent_id', agentId).eq('module_slug', slug)
    } else {
      await supabase.from('agent_modules').insert({ agent_id: agentId, module_slug: slug, is_active: true })
    }
    await loadData()
    setToggling(null)
  }

  function isActive(slug: string) { return agentModules.some(m => m.module_slug === slug && m.is_active) }

  function getTotal() {
    return 19 + agentModules.filter(m => m.is_active).reduce((s, am) => {
      const mod = modules.find(m => m.slug === am.module_slug)
      return s + (mod?.price_monthly || 0)
    }, 0)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>

  const activeCount = agentModules.filter(m => m.is_active).length
  const tier1Mods = modules.filter(m => TIER_1.includes(m.slug))
  const tier2Mods = modules.filter(m => !TIER_1.includes(m.slug) && !TIER_FUTURE.includes(m.slug))
  const futureMods = modules.filter(m => TIER_FUTURE.includes(m.slug))

  function renderModuleCard(mod: ModuleDefinition) {
    const active = isActive(mod.slug)
    const config = MODULE_CONFIG[mod.slug] || { icon: '📦', color: 'gray' }
    const isFuture = TIER_FUTURE.includes(mod.slug)

    return (
      <div key={mod.slug} className={`bg-white rounded-xl shadow-sm border-2 transition-all ${active ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'} ${isFuture ? 'opacity-50' : ''}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{mod.name}</h3>
                {TIER_1.includes(mod.slug) && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">RECOMENDADO</span>}
                {isFuture && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">PROXIMAMENTE</span>}
              </div>
            </div>
            <span className="text-sm font-bold text-gray-900">{mod.price_monthly}€</span>
          </div>
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{mod.description}</p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {active ? 'Activo' : 'Inactivo'}
            </span>
            <div className="flex items-center gap-2">
              {active && config.href && (
                <Link href={config.href} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Gestionar
                </Link>
              )}
              {!isFuture && (
                <button onClick={() => toggleModule(mod.slug)} disabled={toggling === mod.slug}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'} ${toggling === mod.slug ? 'opacity-50' : ''}`}>
                  {toggling === mod.slug ? '...' : active ? 'Desactivar' : 'Activar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Modulos</h1>
          <p className="mt-2 text-gray-600">Gestiona los modulos a la carte de tu cuenta HabiBook</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div><p className="text-sm text-gray-500">Plan Base</p><p className="text-2xl font-bold">19€<span className="text-sm font-normal text-gray-500">/mes</span></p></div>
            <div><p className="text-sm text-gray-500">Modulos Activos</p><p className="text-2xl font-bold text-blue-600">{activeCount}</p></div>
            <div><p className="text-sm text-gray-500">Total Mensual</p><p className="text-2xl font-bold text-green-600">{getTotal().toFixed(2)}€</p></div>
            <div><p className="text-sm text-gray-500">MLS</p><Link href="/dashboard/modules/mls" className="text-blue-600 hover:underline text-sm">Ver catalogo compartido &rarr;</Link></div>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full" /> Modulos Prioritarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {tier1Mods.map(renderModuleCard)}
        </div>

        {tier2Mods.length > 0 && (<>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full" /> Modulos de Crecimiento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tier2Mods.map(renderModuleCard)}
          </div>
        </>)}

        {futureMods.length > 0 && (<>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full" /> Proximamente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureMods.map(renderModuleCard)}
          </div>
        </>)}
      </div>
    </div>
  )
}