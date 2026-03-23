'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { LockedModule } from '@/components/LockedModule'
import { PLAN_HIERARCHY } from '@/lib/modules'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  MapPin,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  Upload,
} from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  status: string
  operation_type: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  size_m2: number | null
  location: string | null
  images: string[] | null
  created_at: string
  updated_at: string
}

interface ModuleResponse {
  modules: Array<{ id: string; min_plan: string }>
  overrides: Array<{ module_id: string; is_enabled: boolean }>
  plan: string
}

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'published', label: 'Publicadas' },
  { value: 'draft', label: 'Borradores' },
  { value: 'reserved', label: 'Reservadas' },
  { value: 'sold', label: 'Vendidas' },
  { value: 'rented', label: 'Alquiladas' },
]

const statusStyles: Record<string, { label: string; color: string }> = {
  published: { label: 'Publicada', color: 'bg-green-100 text-green-700' },
  draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-600' },
  reserved: { label: 'Reservada', color: 'bg-amber-100 text-amber-700' },
  sold: { label: 'Vendida', color: 'bg-blue-100 text-blue-700' },
  rented: { label: 'Alquilada', color: 'bg-blue-100 text-blue-700' },
  archived: { label: 'Archivada', color: 'bg-red-100 text-red-600' },
}

const tabOptions = [
  { id: 'sale', label: 'Venta', moduleId: 'properties_sale' },
  { id: 'rent_long', label: 'Alquiler largo', moduleId: 'properties_rent_long' },
  { id: 'rent_vacation', label: 'Alquiler vacacional', moduleId: 'properties_rent_vacation' },
]

function hasAccess(modules: Array<{ id: string; min_plan: string }>, overrides: Array<{ module_id: string; is_enabled: boolean }>, plan: string, moduleId: string) {
  const override = overrides.find(o => o.module_id === moduleId)
  if (override) return override.is_enabled
  const mod = modules.find(m => m.id === moduleId)
  if (!mod) return false
  const hierarchy = { starter: 1, pro: 2, premium: 3, agency: 4 }
  return hierarchy[plan as keyof typeof hierarchy] >= hierarchy[mod.min_plan as keyof typeof hierarchy]
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('sale')
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

  // Load properties when tab or filter changes
  useEffect(() => {
    loadProperties()
  }, [statusFilter, activeTab])

  async function loadProperties() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from('properties')
      .select('id, title, price, status, operation_type, property_type, bedrooms, bathrooms, size_m2, location, images, created_at, updated_at')
      .eq('agent_id', user.id)
      .order('updated_at', { ascending: false })

    // Filter by operation type based on active tab
    const operationTypeMap: Record<string, string> = {
      'sale': 'sale',
      'rent_long': 'rent_long',
      'rent_vacation': 'rent_vacation',
    }

    if (activeTab in operationTypeMap) {
      query = query.eq('operation_type', operationTypeMap[activeTab])
    }

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data } = await query
    setProperties(data || [])
    setLoading(false)
  }

  async function deleteProperty(id: string) {
    if (!confirm('¿Seguro que quieres eliminar esta propiedad?')) return
    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', id)
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setMenuOpen(null)
  }

  const filtered = properties.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase())
  )

  function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  }

  // Show locked module if no access to current tab's module
  const currentTabModule = tabOptions.find(t => t.id === activeTab)?.moduleId || 'properties_sale'
  if (!modulesLoading && !hasAccess(modules, overrides, plan, currentTabModule)) {
    const moduleData = modules.find(m => m.id === currentTabModule)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
        </div>
        <LockedModule
          moduleName={currentTabModule === 'properties_rent_vacation' ? 'Alquiler vacacional' : 'Propiedades'}
          requiredPlan={moduleData?.min_plan as any}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} propiedades en total</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Link href="/dashboard/properties/import" className="btn-secondary flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" />
            Importar
          </Link>
          <Link href="/dashboard/properties/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva propiedad
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabOptions.map((tab) => {
          const isLocked = !modulesLoading && !hasAccess(modules, overrides, plan, tab.moduleId)
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={isLocked}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.label}
              {isLocked && <span className="ml-1">🔒</span>}
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título o ciudad..."
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field pl-10 pr-8 appearance-none bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-20 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {search || statusFilter ? 'Sin resultados' : 'Aún no tienes propiedades'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || statusFilter ? 'Prueba con otros filtros' : 'Crea tu primera propiedad para empezar'}
          </p>
          {!search && !statusFilter && (
            <Link href="/dashboard/properties/new" className="btn-primary inline-flex items-center gap-2 mt-4">
              <Plus className="w-4 h-4" /> Crear propiedad
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tipo</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Detalles</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {prop.images && prop.images.length > 0 ? (
                            <img src={prop.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/dashboard/properties/${prop.id}`} className="text-sm font-medium text-gray-900 hover:text-brand-600 truncate block">
                            {prop.title}
                          </Link>
                          {prop.location && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {prop.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-semibold text-gray-900">{formatPrice(prop.price)}</div>
                      <div className="text-xs text-gray-500">{prop.operation_type === 'sale' ? 'Venta' : 'Alquiler'}</div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600 capitalize">{prop.property_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {prop.bedrooms != null && <span>{prop.bedrooms} hab</span>}
                        {prop.bathrooms != null && <span>{prop.bathrooms} baños</span>}
                        {prop.size_m2 != null && <span>{prop.size_m2} m²</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[prop.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {statusStyles[prop.status]?.label || prop.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 relative">
                      <button onClick={() => setMenuOpen(menuOpen === prop.id ? null : prop.id)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                      {menuOpen === prop.id && (
                        <div className="absolute right-5 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-40">
                          <Link href={`/dashboard/properties/${prop.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(null)}>
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </Link>
                          <Link href={`/property/${prop.id}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(null)}>
                            <Eye className="w-3.5 h-3.5" /> Ver en web
                          </Link>
                          <button onClick={() => deleteProperty(prop.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
