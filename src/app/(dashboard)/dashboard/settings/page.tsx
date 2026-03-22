'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Save, Loader2, Globe, Palette, User, Building } from 'lucide-react'

const templates = [
  { id: 'atlantic', name: 'Atlantic', desc: 'Elegante y costero' },
  { id: 'volcanic', name: 'Volcanic', desc: 'Oscuro y premium' },
  { id: 'colonial', name: 'Colonial', desc: 'Clásico y cálido' },
  { id: 'tropical', name: 'Tropical', desc: 'Fresco y natural' },
  { id: 'sunset', name: 'Sunset', desc: 'Cálido y luminoso' },
  { id: 'minimalist', name: 'Minimalist', desc: 'Limpio y moderno' },
  { id: 'luxury', name: 'Luxury', desc: 'Sofisticado y exclusivo' },
]

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
  { code: 'sv', name: 'Svenska' },
  { code: 'no', name: 'Norsk' },
]

export default function SettingsPage() {
  const [agent, setAgent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('agents').select('*').eq('id', user.id).single()
      if (data) setAgent(data)
      setLoading(false)
    }
    load()
  }, [])

  function update(field: string, value: any) {
    setAgent((prev: any) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('agents')
      .update({
        name: agent.name,
        phone: agent.phone,
        agency_name: agent.agency_name,
        bio: agent.bio,
        website: agent.website,
        template_id: agent.template_id,
        preferred_lang: agent.preferred_lang,
        license_number: agent.license_number,
        nif: agent.nif,
        address: agent.address,
        city: agent.city,
      })
      .eq('id', agent.id)

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      alert('Error al guardar: ' + error.message)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
  }

  if (!agent) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ajustes</h1>
          <p className="text-sm text-gray-500 mt-1">Configura tu perfil y preferencias</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      {/* Personal info */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <User className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Datos personales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" value={agent.name || ''} onChange={(e) => update('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" value={agent.phone || ''} onChange={(e) => update('phone', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIF / CIF</label>
            <input type="text" value={agent.nif || ''} onChange={(e) => update('nif', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nº Licencia</label>
            <input type="text" value={agent.license_number || ''} onChange={(e) => update('license_number', e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Descripción</label>
          <textarea value={agent.bio || ''} onChange={(e) => update('bio', e.target.value)} className="input-field min-h-[100px]" rows={4} placeholder="Cuéntale a tus clientes sobre ti..." />
        </div>
      </section>

      {/* Agency */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Building className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Agencia</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de agencia</label>
            <input type="text" value={agent.agency_name || ''} onChange={(e) => update('agency_name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Web</label>
            <input type="url" value={agent.website || ''} onChange={(e) => update('website', e.target.value)} className="input-field" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input type="text" value={agent.city || ''} onChange={(e) => update('city', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" value={agent.address || ''} onChange={(e) => update('address', e.target.value)} className="input-field" />
          </div>
        </div>
      </section>

      {/* Website template */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Palette className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Plantilla de web</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => update('template_id', t.id)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                agent.template_id === t.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-medium text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Globe className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Idioma</h2>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Idioma principal de tu web</label>
          <select value={agent.preferred_lang || 'es'} onChange={(e) => update('preferred_lang', e.target.value)} className="input-field max-w-xs">
            {languages.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
      </section>
    </div>
  )
}
