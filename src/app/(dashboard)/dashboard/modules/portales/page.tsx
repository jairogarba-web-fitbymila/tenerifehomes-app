'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Portal {
  id: string
  name: string
  description: string
  format: string
  status: string
  distribution: { status: string; last_synced_at: string | null; properties_count: number }
}

export default function PortalesPage() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [feedUrl, setFeedUrl] = useState('')
  const [totalPublished, setTotalPublished] = useState(0)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<string | null>(null)
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

    const res = await fetch(`/api/modules/portales?agent_id=${user.id}`)
    if (res.ok) {
      const data = await res.json()
      setPortals(data.portals || [])
      setFeedUrl(data.feed?.kyeroUrl || '')
      setTotalPublished(data.agent?.totalPublished || 0)
    }
    setLoading(false)
  }

  async function syncPortal(portalId: string) {
    setSyncing(portalId)
    await fetch('/api/modules/portales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, portal_id: portalId })
    })
    await loadData()
    setSyncing(null)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Distribucion a Portales</h1>
            <p className="mt-1 text-gray-600">Publica tus propiedades en los principales portales inmobiliarios</p>
          </div>
          <a href="/dashboard/modules" className="text-blue-600 hover:text-blue-800 text-sm">&larr; Volver a modulos</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Propiedades Publicadas</p>
            <p className="text-3xl font-bold text-gray-900">{totalPublished}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Portales Activos</p>
            <p className="text-3xl font-bold text-blue-600">{portals.filter(p => p.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500">Feed XML</p>
            {feedUrl && <a href={feedUrl} target="_blank" className="text-sm text-blue-600 hover:underline break-all">{feedUrl}</a>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portals.map(portal => (
            <div key={portal.id} className={`bg-white rounded-xl shadow-sm border-2 p-6 ${portal.status === 'active' ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{portal.name}</h3>
                  <p className="text-sm text-gray-500">{portal.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  portal.distribution?.status === 'synced' ? 'bg-green-100 text-green-700' :
                  portal.status === 'coming_soon' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {portal.distribution?.status === 'synced' ? 'Sincronizado' : portal.status === 'coming_soon' ? 'Proximamente' : 'Disponible'}
                </span>
              </div>

              {portal.distribution?.last_synced_at && (
                <p className="text-xs text-gray-400 mb-3">
                  Ultima sync: {new Date(portal.distribution.last_synced_at).toLocaleString('es-ES')} — {portal.distribution.properties_count} propiedades
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Formato: {portal.format.toUpperCase()}</span>
                {portal.status === 'active' && (
                  <button
                    onClick={() => syncPortal(portal.id)}
                    disabled={syncing === portal.id}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {syncing === portal.id ? 'Sincronizando...' : portal.distribution?.status === 'synced' ? 'Re-sincronizar' : 'Sincronizar'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}