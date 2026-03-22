'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  Users,
  Search,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  MessageSquare,
} from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  source: string | null
  message: string | null
  property_id: string | null
  created_at: string
  properties?: { title: string } | null
}

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'qualified', label: 'Cualificados' },
  { value: 'viewing_scheduled', label: 'Visita programada' },
  { value: 'offer_made', label: 'Oferta realizada' },
  { value: 'won', label: 'Ganados' },
  { value: 'lost', label: 'Perdidos' },
]

const statusStyles: Record<string, { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contactado', color: 'bg-amber-100 text-amber-700' },
  qualified: { label: 'Cualificado', color: 'bg-green-100 text-green-700' },
  viewing_scheduled: { label: 'Visita prog.', color: 'bg-purple-100 text-purple-700' },
  offer_made: { label: 'Oferta', color: 'bg-indigo-100 text-indigo-700' },
  won: { label: 'Ganado', color: 'bg-emerald-100 text-emerald-700' },
  lost: { label: 'Perdido', color: 'bg-red-100 text-red-600' },
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedLead, setExpandedLead] = useState<string | null>(null)

  useEffect(() => {
    loadLeads()
  }, [statusFilter])

  async function loadLeads() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from('leads')
      .select('id, name, email, phone, status, source, message, property_id, created_at, properties(title)')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    if (statusFilter) query = query.eq('status', statusFilter)

    const { data } = await query
    setLeads((data as unknown as Lead[]) || [])
    setLoading(false)
  }

  async function updateLeadStatus(leadId: string, newStatus: string) {
    const supabase = createClient()
    await supabase.from('leads').update({ status: newStatus }).eq('id', leadId)
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status: newStatus } : l))
  }

  const filtered = leads.filter((l) =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
  )

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    return `hace ${days}d`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">{leads.length} contactos en total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." className="input-field pl-10" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field pr-8 appearance-none bg-white">
            {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card h-20 animate-pulse bg-gray-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {search || statusFilter ? 'Sin resultados' : 'Aún no tienes leads'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Los leads llegarán cuando publiques propiedades y recibas consultas
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="card overflow-hidden">
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-700 font-semibold text-sm">
                      {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {lead.properties?.title && (
                    <span className="text-xs text-gray-400 hidden md:block truncate max-w-[200px]">{lead.properties.title}</span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusStyles[lead.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {statusStyles[lead.status]?.label || lead.status}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3" /> {timeAgo(lead.created_at)}
                  </span>
                </div>
              </div>

              {/* Expanded details */}
              {expandedLead === lead.id && (
                <div className="px-5 pb-4 pt-0 border-t border-gray-50">
                  {lead.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Mensaje
                      </p>
                      <p className="text-sm text-gray-700">{lead.message}</p>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500 mr-2">Cambiar estado:</span>
                    {Object.entries(statusStyles).map(([key, style]) => (
                      <button
                        key={key}
                        onClick={() => updateLeadStatus(lead.id, key)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                          lead.status === key ? style.color : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
