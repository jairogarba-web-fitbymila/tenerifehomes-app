'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface MLSListing {
  id: string
  property_id: string
  listing_agent_id: string
  commission_percent: number
  commission_split: string
  listed_at: string
  listing_agent: { business_name: string; slug: string; phone: string }
  properties: {
    title: string; slug: string; property_type: string; operation_type: string
    price: number; bedrooms: number; bathrooms: number; size_m2: number
    location: string; images: string[]; badge: string
  }
}

export default function MLSCatalogPage() {
  const [listings, setListings] = useState<MLSListing[]>([])
  const [myProperties, setMyProperties] = useState<any[]>([])
  const [stats, setStats] = useState({ totalInMLS: 0, mySharedProperties: 0 })
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState<string | null>(null)
  const [tab, setTab] = useState<'browse' | 'my'>('browse')
  const [agentId, setAgentId] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setAgentId(user.id)

    const [catalogRes, propsRes] = await Promise.all([
      fetch(`/api/modules/mls/catalog?agent_id=${user.id}`),
      supabase.from('properties').select('id, title, slug, price, location, is_active').eq('agent_id', user.id).eq('is_active', true)
    ])

    if (catalogRes.ok) {
      const data = await catalogRes.json()
      setListings(data.listings || [])
      setStats(data.stats || {})
    }
    setMyProperties(propsRes.data || [])
    setLoading(false)
  }

  async function shareProperty(propertyId: string) {
    setSharing(propertyId)
    await fetch('/api/modules/mls/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, property_id: propertyId, commission_percent: 5, commission_split: '50/50' })
    })
    await loadData()
    setSharing(null)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MLS — Catalogo Compartido</h1>
            <p className="mt-1 text-gray-600">Comparte y accede a propiedades de otros agentes HabiBook</p>
          </div>
          <a href="/dashboard/modules" className="text-blue-600 hover:text-blue-800 text-sm">&larr; Volver</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Propiedades en MLS</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalInMLS}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Mis Compartidas</p>
            <p className="text-3xl font-bold text-blue-600">{stats.mySharedProperties}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Comision estandar</p>
            <p className="text-3xl font-bold text-green-600">5%</p>
            <p className="text-xs text-gray-400">Reparto 50/50</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-200 rounded-lg p-1 w-fit">
          <button onClick={() => setTab('browse')} className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'browse' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
            Explorar MLS ({stats.totalInMLS})
          </button>
          <button onClick={() => setTab('my')} className={`px-4 py-2 rounded-md text-sm font-medium ${tab === 'my' ? 'bg-white shadow text-gray-900' : 'text-gray-600'}`}>
            Mis Propiedades ({myProperties.length})
          </button>
        </div>

        {tab === 'browse' ? (
          <div className="space-y-4">
            {listings.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <p className="text-gray-500 text-lg">No hay propiedades en el MLS todavia</p>
                <p className="text-gray-400 mt-2">Se el primero en compartir una propiedad</p>
              </div>
            ) : listings.map(l => (
              <div key={l.id} className="bg-white rounded-xl shadow-sm border p-6 flex gap-4">
                {l.properties?.images?.[0] && (
                  <img src={l.properties.images[0]} alt="" className="w-32 h-24 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{l.properties?.title}</h3>
                  <p className="text-sm text-gray-500">{l.properties?.location} — {l.properties?.bedrooms} hab, {l.properties?.bathrooms} banos, {l.properties?.size_m2}m2</p>
                  <p className="text-lg font-bold text-green-700 mt-1">{(l.properties?.price || 0).toLocaleString('es-ES')}€</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">Agente: {l.listing_agent?.business_name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Comision {l.commission_percent}% ({l.commission_split})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {myProperties.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.location} — {(p.price || 0).toLocaleString('es-ES')}€</p>
                </div>
                <button
                  onClick={() => shareProperty(p.id)}
                  disabled={sharing === p.id}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {sharing === p.id ? 'Compartiendo...' : 'Compartir en MLS'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}