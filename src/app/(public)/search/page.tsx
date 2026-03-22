'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Building2,
  Bed,
  Bath,
  Ruler,
  ChevronDown,
  SlidersHorizontal,
  X,
} from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  operation_type: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  area_built: number | null
  city: string | null
  region_slug: string | null
  main_image_url: string | null
}

interface Region {
  slug: string
  name: string
}

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    query: '',
    operation_type: '',
    property_type: '',
    region_slug: '',
    min_price: '',
    max_price: '',
    min_beds: '',
  })

  useEffect(() => {
    async function loadRegions() {
      const supabase = createClient()
      const { data } = await supabase.from('regions').select('slug, name').eq('is_active', true).order('name')
      if (data) setRegions(data)
    }
    loadRegions()
  }, [])

  useEffect(() => {
    searchProperties()
  }, [filters.operation_type, filters.property_type, filters.region_slug, filters.min_beds])

  async function searchProperties() {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('properties')
      .select('id, title, price, operation_type, property_type, bedrooms, bathrooms, area_built, city, region_slug, main_image_url')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(60)

    if (filters.operation_type) query = query.eq('operation_type', filters.operation_type)
    if (filters.property_type) query = query.eq('property_type', filters.property_type)
    if (filters.region_slug) query = query.eq('region_slug', filters.region_slug)
    if (filters.min_price) query = query.gte('price', parseFloat(filters.min_price))
    if (filters.max_price) query = query.lte('price', parseFloat(filters.max_price))
    if (filters.min_beds) query = query.gte('bedrooms', parseInt(filters.min_beds))

    const { data } = await query
    setProperties(data || [])
    setLoading(false)
  }

  function update(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-brand-600 font-display text-xl font-bold">TenerifeHomes</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Iniciar sesion</Link>
            <Link href="/register" className="btn-primary text-sm">Registrar agente</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => update('query', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchProperties()}
              placeholder="Buscar propiedades..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            />
          </div>
          <button onClick={searchProperties} className="btn-primary px-6">Buscar</button>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <select value={filters.operation_type} onChange={(e) => update('operation_type', e.target.value)} className="input-field text-sm">
                <option value="">Operación</option>
                <option value="sale">Venta</option>
                <option value="rent">Alquiler</option>
              </select>
              <select value={filters.property_type} onChange={(e) => update('property_type', e.target.value)} className="input-field text-sm">
                <option value="">Tipo</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Ático</option>
                <option value="studio">Estudio</option>
                <option value="land">Terreno</option>
                <option value="commercial">Local</option>
              </select>
              <select value={filters.region_slug} onChange={(e) => update('region_slug', e.target.value)} className="input-field text-sm">
                <option value="">Región</option>
                {regions.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
              </select>
              <input type="number" value={filters.min_price} onChange={(e) => update('min_price', e.target.value)} placeholder="Precio mín." className="input-field text-sm" />
              <input type="number" value={filters.max_price} onChange={(e) => update('max_price', e.target.value)} placeholder="Precio máx." className="input-field text-sm" />
              <select value={filters.min_beds} onChange={(e) => update('min_beds', e.target.value)} className="input-field text-sm">
                <option value="">Habitaciones</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">{properties.length} propiedades encontradas</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-80 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No se encontraron propiedades</h3>
            <p className="mt-1 text-sm text-gray-500">Prueba con otros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <Link
                key={prop.id}
                href={`/property/${prop.id}`}
                className="card overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {prop.main_image_url ? (
                    <img src={prop.main_image_url} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Building2 className="w-10 h-10 text-gray-300" /></div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{prop.title}</h3>
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      {prop.operation_type === 'sale' ? 'Venta' : 'Alquiler'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-brand-600 mt-2">{formatPrice(prop.price)}</p>
                  {prop.city && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {prop.city}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    {prop.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.bedrooms}</span>}
                    {prop.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.bathrooms}</span>}
                    {prop.area_built != null && <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {prop.area_built} m²</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
