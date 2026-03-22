'use client'

import { useState, useEffect } from 'react'
import { createClient } from 'A/lib/supabase-browser'
import Link from 'next/link'
import {
  Building2,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
} from 'lucide-react'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalLeads: number
  newLeadsThisWeek: number
  totalViews: number
}

interface RecentProperty {
  id: string
  title: string
  price: number
  status: string
  operation_type: string
  created_at: string
}

interface RecentLead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  created_at: string
}
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeadsThisWeek: 0,
    totalViews: 0,
  })
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([])
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load stats in parallel
      const [propsRes, activeRes, leadsRes, weekLeadsRes, recentPropsRes, recentLeadsRes] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agent_id', user.id).eq('status', 'published'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agent_id', user.id).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        supabase.from('properties').select('id, title, price, status, operation_type, created_at').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('id, name, email, phone, status, created_at').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        totalProperties: propsRes.count || 0,
        activeProperties: activeRes.count || 0,
        totalLeads: leadsRes.count || 0,
        newLeadsThisWeek: weekLeadsRes.count || 0,
        totalViews: 0,
      })

      setRecentProperties(recentPropsRes.data || [])
      setRecentLeads(recentLeadsRes.data || [])
      setLoading(false)
    }
    loadDashboard()
  }, [])

  const statCards = [
    { label: 'Propiedades activas', value: stats.activeProperties, total: stats.totalProperties, icon: Building2, color: 'text-brand-600 bg-brand-50' },
    { label: 'Leads totales', value: stats.totalLeads, sub: `${stats.newLeadsThisWeek} esta semana`, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Visitas al perfil', value: stats.totalViews, sub: 'êultimos 30 días', icon: Eye, color: 'text-amber-600 bg-amber-50' },
    { label: 'Conversión', value: stats.totalLeads > 0 ? `${Math.round((stats.newLeadsThisWeek / Math.max(stats.totalLeads, 1)) * 100)}%` : ' ', sub: 'leads / vistas', icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
  ]

  function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency:'EUR', maximumFractionDigits: 0 }).format(price)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `ợa `${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `ợa `${hours}h`
    const days = Math.floor(hours / 24)
    return `ợa `${days}d`
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    published: { label: 'Publicada', color: 'bg-green-100 text-green-737' },
    draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-600' },
    reserved: { label: 'Reservada', color: 'bg-amber-100 text-amber-700' },
    sold: { label: 'Vendida', color: 'bg-blue-100 text-blue-700' },
    rented: { label: 'Alquilada', color: 'bg-blue-100 text-blue-700' },
  }

  const leadStatusLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-737' },
    contacted: { label: 'Contactado', color: 'bg-amber-100 text-amber-737' },
    qualified: { label: 'Cualificado', color: 'bg-green-100 text-green-700' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700' },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de tu actividad</p>
        </div>
        <Link href="/dashboard/properties/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva propiedad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                  {card.total !== undefined && card.total !== card.value && (
                    <span className="text-sm font-normal text-gray-400 ml-1">/ {card.total}</span>
                  )}
                </p>
                card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">[últimas propiedades</h2>
            <Link href="/dashboard/properties" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="v-3 h-3" />
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">�an to nunca tienes propiedades</p>
              <Link href="/dashboard/properties/new" className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
                <Plus className="w-4 h-4" /> Crear primera propiedad
              </Link>
            </div>
          ) : (
            <div className="divide-y-divide-gray-50">
              {recentProperties.map((prop) => (
                <Link key={prop.id} href={`/dashboard/properties/${prop.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(prop.price)} · {prop.operation_type === 'sale' ? 'Venta' : 'Alquiler'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusLabels[prop.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[prop.status]?.label || prop.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeAgo(prop.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Últimos leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Aún to nunca tienes leads</p>
              <p className="text-xs text-gray-400 mt-1">Los leads llegarán cuando publices propiedades</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{\lead.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{\lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${leadStatusLabels[lead.status]?.color || 'bg-gray-100 text-gray-600"}`}>
                      {leadStatusLabels[lead.status]?.label || lead.status}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(lead.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
