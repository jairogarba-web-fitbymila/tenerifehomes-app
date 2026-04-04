'use client'

import { useState, useEffect } from 'react'
import { Users, TrendingUp, Activity, DollarSign, ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { PLAN_LABELS, PLAN_PRICES, PlanType } from '@/lib/modules'

interface Agent {
  id: string
  business_name: string
  email: string
  plan: PlanType
  template: string
  is_active: boolean
  created_at: string
  propertyCount?: number
  leadCount?: number
  sectionCount?: number
}

interface AgentStats {
  totalAgents: number
  activeAgents: number
  planCounts: Record<PlanType, number>
  estimatedMRR: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AgentStats>({
    totalAgents: 0,
    activeAgents: 0,
    planCounts: { starter: 0, pro: 0, premium: 0, agency: 0 },
    estimatedMRR: 0,
  })
  const [recentSignups, setRecentSignups] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/admin/agents')
        if (!response.ok) throw new Error('Failed to fetch agents')

        const data = await response.json()
        const agents = data.agents || data

        // Calculate stats
        const activeCount = agents.filter((a: Agent) => a.is_active).length
        const planCounts = {
          starter: agents.filter((a: Agent) => a.plan === 'starter').length,
          pro: agents.filter((a: Agent) => a.plan === 'pro').length,
          premium: agents.filter((a: Agent) => a.plan === 'premium').length,
          agency: agents.filter((a: Agent) => a.plan === 'agency').length,
        }

        const estimatedMRR =
          planCounts.starter * PLAN_PRICES.starter.monthly +
          planCounts.pro * PLAN_PRICES.pro.monthly +
          planCounts.premium * PLAN_PRICES.premium.monthly +
          planCounts.agency * PLAN_PRICES.agency.monthly

        setStats({
          totalAgents: agents.length,
          activeAgents: activeCount,
          planCounts,
          estimatedMRR,
        })

        // Get last 10 signups
        setRecentSignups(agents.slice(0, 10))
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const statCards = [
    {
      label: 'Total agentes',
      value: stats.totalAgents,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      trend: null,
    },
    {
      label: 'Agentes activos',
      value: stats.activeAgents,
      icon: Activity,
      color: 'bg-green-50 text-green-600',
      trend: `${Math.round((stats.activeAgents / Math.max(stats.totalAgents, 1)) * 100)}%`,
    },
    {
      label: 'Ingresos MRR estimados',
      value: `€${stats.estimatedMRR.toLocaleString('es-ES')}`,
      icon: DollarSign,
      color: 'bg-amber-50 text-amber-600',
      trend: null,
    },
    {
      label: 'Tasa de activación',
      value: stats.totalAgents > 0 ? `${Math.round((stats.activeAgents / stats.totalAgents) * 100)}%` : '—',
      icon: TrendingUp,
      color: 'bg-violet-50 text-violet-600',
      trend: null,
    },
  ]

  const planEntries = [
    { name: 'Starter', count: stats.planCounts.starter, color: 'bg-gray-100 text-gray-700' },
    { name: 'Pro', count: stats.planCounts.pro, color: 'bg-blue-100 text-blue-700' },
    { name: 'Premium', count: stats.planCounts.premium, color: 'bg-purple-100 text-purple-700' },
    { name: 'Agencia', count: stats.planCounts.agency, color: 'bg-amber-100 text-amber-700' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Gestiona agentes, módulos y acceso a la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                  {card.trend && <p className="text-xs text-gray-500 mt-1">{card.trend} del total</p>}
                </div>
                <div className={`rounded-lg p-3 ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Plans Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución por plan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {planEntries.map((plan) => (
            <div key={plan.name} className={`rounded-lg p-4 ${plan.color} text-center`}>
              <div className="text-2xl font-bold">{plan.count}</div>
              <div className="text-sm font-medium mt-1">{plan.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/agents"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Gestionar agentes</h3>
              <p className="text-sm text-gray-600 mt-1">Ver, editar planes y módulos de agentes</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
          </div>
        </Link>
        <Link
          href="/admin/modules"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-brand-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Ver módulos</h3>
              <p className="text-sm text-gray-600 mt-1">Configurar módulos y permisos de plataforma</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Signups */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Últimos registros</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Agente</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentSignups.length > 0 ? (
                recentSignups.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/agents/${agent.id}`}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        {agent.business_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{agent.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          agent.plan === 'starter'
                            ? 'bg-gray-100 text-gray-700'
                            : agent.plan === 'pro'
                              ? 'bg-blue-100 text-blue-700'
                              : agent.plan === 'premium'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {PLAN_LABELS[agent.plan]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          agent.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {agent.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(agent.created_at).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay agentes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
