'use client'

import { useState, useEffect } from 'react'
import { Search, ChevronDown, ExternalLink } from 'lucide-react'
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
  slug?: string
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlan, setFilterPlan] = useState<PlanType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await fetch('/api/admin/agents')
        if (!response.ok) throw new Error('Failed to fetch agents')

        const data = await response.json()
        const agentsList = data.agents || data

        setAgents(agentsList)
        setFilteredAgents(agentsList)
      } catch (error) {
        console.error('Error loading agents:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [])

  useEffect(() => {
    let filtered = agents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Plan filter
    if (filterPlan !== 'all') {
      filtered = filtered.filter((a) => a.plan === filterPlan)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((a) => (filterStatus === 'active' ? a.is_active : !a.is_active))
    }

    setFilteredAgents(filtered)
  }, [searchTerm, filterPlan, filterStatus, agents])

  async function updateAgent(agentId: string, updates: { plan?: PlanType; is_active?: boolean }) {
    setUpdatingId(agentId)
    try {
      const response = await fetch('/api/admin/agents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, ...updates }),
      })

      if (!response.ok) throw new Error('Failed to update agent')

      const data = await response.json()
      const updatedAgent = data.agent

      setAgents(agents.map((a) => (a.id === agentId ? { ...a, ...updatedAgent } : a)))
    } catch (error) {
      console.error('Error updating agent:', error)
      alert('Error al actualizar agente')
    } finally {
      setUpdatingId(null)
    }
  }

  const planOptions: PlanType[] = ['starter', 'pro', 'premium', 'agency']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agentes</h1>
        <p className="text-gray-600 mt-1">Gestiona los agentes de la plataforma, sus planes y módulos</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Plan Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as PlanType | 'all')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="all">Todos los planes</option>
              {planOptions.map((plan) => (
                <option key={plan} value={plan}>
                  {PLAN_LABELS[plan]}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Plantilla</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Fecha Registro</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{agent.business_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{agent.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={agent.plan}
                        onChange={(e) => updateAgent(agent.id, { plan: e.target.value as PlanType })}
                        disabled={updatingId === agent.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500 ${
                          agent.plan === 'starter'
                            ? 'bg-gray-100 text-gray-700'
                            : agent.plan === 'pro'
                              ? 'bg-blue-100 text-blue-700'
                              : agent.plan === 'premium'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-amber-100 text-amber-700'
                        } ${updatingId === agent.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {planOptions.map((plan) => (
                          <option key={plan} value={plan}>
                            {PLAN_LABELS[plan]} (€{PLAN_PRICES[plan]?.monthly})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{agent.template || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateAgent(agent.id, { is_active: !agent.is_active })}
                        disabled={updatingId === agent.id}
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          agent.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${updatingId === agent.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {agent.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(agent.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/agents/${agent.id}`}
                          className="text-gray-600 hover:text-brand-600 transition-colors"
                          title="Gestionar módulos"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </Link>
                        {agent.slug && (
                          <a
                            href={`/agente/${agent.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-brand-600 transition-colors"
                            title="Ver web pública"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron agentes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results info */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredAgents.length} de {agents.length} agentes
      </div>
    </div>
  )
}
