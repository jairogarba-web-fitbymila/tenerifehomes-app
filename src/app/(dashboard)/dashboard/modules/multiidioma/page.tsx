'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

export default function MultiidiomaPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [selectedLang, setSelectedLang] = useState('en')
  const [translating, setTranslating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [agentId, setAgentId] = useState('')
  const [isLimited, setIsLimited] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setAgentId(user.id)

    const [langRes, propsRes] = await Promise.all([
      fetch(`/api/modules/multiidioma?agent_id=${user.id}`),
      supabase.from('properties').select('id, title, description, features, location').eq('agent_id', user.id).eq('is_active', true)
    ])

    if (langRes.ok) {
      const data = await langRes.json()
      setLanguages(data.languages || [])
      setIsLimited(data.isLimited || false)
    }
    setProperties(propsRes.data || [])
    setLoading(false)
  }

  async function translateProperty(propertyId: string) {
    setTranslating(propertyId)
    const res = await fetch('/api/modules/multiidioma/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, property_id: propertyId, target_lang: selectedLang })
    })
    const result = await res.json()
    alert(result.note || 'Traduccion procesada')
    setTranslating(null)
  }

  async function translateAll() {
    setTranslating('all')
    for (const p of properties) {
      await fetch('/api/modules/multiidioma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: agentId,
          property_id: p.id,
          text: p.description,
          target_langs: ['en', 'de', 'fr', 'it']
        })
      })
    }
    alert(`${properties.length} propiedades en cola de traduccion a 4 idiomas`)
    setTranslating(null)
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>

  if (isLimited) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center max-w-md">
          <span className="text-4xl">🌍</span>
          <h2 className="text-xl font-bold mt-4">Modulo Multiidioma</h2>
          <p className="text-gray-500 mt-2">Traduce automaticamente todas tus propiedades a 10 idiomas con IA</p>
          <a href="/dashboard/modules" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Activar modulo</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Multiidioma</h1>
            <p className="mt-1 text-gray-600">Traduce tus propiedades automaticamente a {languages.length} idiomas</p>
          </div>
          <a href="/dashboard/modules" className="text-blue-600 hover:text-blue-800 text-sm">&larr; Volver</a>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-semibold mb-4">Idiomas disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-2 rounded-lg text-sm border transition ${selectedLang === lang.code ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {lang.flag} {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-900">Propiedades ({properties.length})</h3>
          <button
            onClick={translateAll}
            disabled={translating !== null}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {translating === 'all' ? 'Traduciendo todas...' : 'Traducir todas (EN, DE, FR, IT)'}
          </button>
        </div>

        <div className="space-y-3">
          {properties.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{p.description}</p>
                <p className="text-xs text-gray-400 mt-1">{p.location}</p>
              </div>
              <button
                onClick={() => translateProperty(p.id)}
                disabled={translating === p.id}
                className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
              >
                {translating === p.id ? 'Traduciendo...' : `Traducir a ${selectedLang.toUpperCase()}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}