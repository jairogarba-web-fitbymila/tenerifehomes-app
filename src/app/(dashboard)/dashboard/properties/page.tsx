'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
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
  area_built: number | null
  city: string | null
  region_slug: string | null
  main_image_url: string | null
  created_at: string
  updated_at: string
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [statusFilter])

  async function loadProperties() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let query = supabase
      .from('properties')
      .select('id, title, price, status, operation_type, property_type, bedrooms, bathrooms, area_built, city, region_slug, main_image_url, created_at, updated_at')
      .eq('agent_id', user.id)
      .order('updated_at', { ascending: false })

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
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase())
  )

  function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
          <p className="text-gray-500 text-sm mt-1">{properties.length} propiedades en total</p>
        </div>
        <Link href="/dashboard/properties/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          Nueva propiedad
        </Link>
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
                          {prop.main_image_url ? (
                            <img src={prop.main_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/dashboard/properties/${prop.id}`} className="text-sm font-medium text-gray-900 hover:text-brand-600 truncate block">
                            {prop.title}
                          </Link>
                          {prop.city && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {prop.city}
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
                        {prop.area_built != null && <span>{prop.area_built} m²</span>}
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
                            <Eye className="w-3.5 h-3.5" /> Ver pública
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
