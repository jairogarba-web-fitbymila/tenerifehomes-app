'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Save, Loader2, Globe, User, Building, Camera, AlertCircle, Check } from 'lucide-react'

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
  { code: 'lt', name: 'Lietuvių' },
]

interface AgentProfileData {
  id: string
  email: string
  business_name: string
  phone: string | null
  bio: string | null
  bio_photo_url: string | null
  logo_url: string | null
  city: string | null
  address: string | null
  whatsapp: string | null
  languages: string[] | null
  quote: string | null
  social_links: Record<string, string> | null
  primary_zone: string | null
  plan: string
  slug: string
  template: string
  business_type: string
}

export default function SettingsPage() {
  const [agent, setAgent] = useState<AgentProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('agent_profiles')
        .select('id, email, business_name, phone, bio, bio_photo_url, logo_url, city, address, whatsapp, languages, quote, social_links, primary_zone, plan, slug, template, business_type')
        .eq('id', user.id)
        .single()
      if (data) setAgent(data)
      setLoading(false)
    }
    load()
  }, [])

  function update(field: string, value: any) {
    setAgent((prev: any) => ({ ...prev, [field]: value }))
    setSaved(false)
    setError('')
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'bio_photo_url' | 'logo_url') {
    const file = e.target.files?.[0]
    if (!file || !agent) return

    const isLogo = field === 'logo_url'
    if (isLogo) setUploadingLogo(true)
    else setUploadingPhoto(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${agent.id}/${field}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('agent-assets')
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        setError(`Error subiendo imagen: ${uploadError.message}`)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('agent-assets')
        .getPublicUrl(fileName)

      // Update profile
      const { error: updateError } = await supabase
        .from('agent_profiles')
        .update({ [field]: publicUrl })
        .eq('id', agent.id)

      if (updateError) {
        setError(`Error actualizando perfil: ${updateError.message}`)
        return
      }

      setAgent(prev => prev ? { ...prev, [field]: publicUrl } : prev)
    } catch {
      setError('Error inesperado al subir la imagen')
    } finally {
      if (isLogo) setUploadingLogo(false)
      else setUploadingPhoto(false)
    }
  }

  async function handleSave() {
    if (!agent) return
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error: saveError } = await supabase
      .from('agent_profiles')
      .update({
        business_name: agent.business_name,
        phone: agent.phone,
        bio: agent.bio,
        city: agent.city,
        address: agent.address,
        whatsapp: agent.whatsapp,
        languages: agent.languages,
        quote: agent.quote,
        social_links: agent.social_links,
        primary_zone: agent.primary_zone,
      })
      .eq('id', agent.id)

    setSaving(false)
    if (!saveError) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Error al guardar: ' + saveError.message)
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
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Photo & Logo */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Camera className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Imágenes</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-gray-200">
                {agent.bio_photo_url ? (
                  <img src={agent.bio_photo_url} alt="Foto" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="btn-secondary text-sm cursor-pointer inline-block">
                  {uploadingPhoto ? 'Subiendo...' : 'Cambiar foto'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handlePhotoUpload(e, 'bio_photo_url')} disabled={uploadingPhoto} />
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Mín. 400×400px · Cuadrada (1:1) · Máx. 5 MB · Fondo neutro, iluminación natural</p>
              </div>
            </div>
          </div>
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de empresa</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-gray-200">
                {agent.logo_url ? (
                  <img src={agent.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="btn-secondary text-sm cursor-pointer inline-block">
                  {uploadingLogo ? 'Subiendo...' : 'Cambiar logo'}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={(e) => handlePhotoUpload(e, 'logo_url')} disabled={uploadingLogo} />
                </label>
                <p className="text-xs text-gray-400 mt-1">PNG o SVG con fondo transparente · Mín. 200×60px · Máx. 5 MB · Horizontal preferente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal info */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <User className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Datos del negocio</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Empresa</label>
            <input type="text" value={agent.business_name || ''} onChange={(e) => update('business_name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={agent.email || ''} disabled className="input-field bg-gray-50 text-gray-500" />
            <p className="text-xs text-gray-400 mt-1">No editable</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" value={agent.phone || ''} onChange={(e) => update('phone', e.target.value)} className="input-field" placeholder="+34 600 000 000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input type="tel" value={agent.whatsapp || ''} onChange={(e) => update('whatsapp', e.target.value)} className="input-field" placeholder="+34600000000 (sin espacios)" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input type="text" value={agent.city || ''} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="Costa Adeje" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" value={agent.address || ''} onChange={(e) => update('address', e.target.value)} className="input-field" placeholder="Av. de España, 1" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Zona principal</label>
          <input type="text" value={agent.primary_zone || ''} onChange={(e) => update('primary_zone', e.target.value)} className="input-field" placeholder="Costa Adeje, Arona, Los Cristianos..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Descripción</label>
          <textarea value={agent.bio || ''} onChange={(e) => update('bio', e.target.value)} className="input-field min-h-[120px]" rows={5} maxLength={600} placeholder="Cuéntale a tus clientes sobre ti o tu negocio..." />
          <p className="text-xs text-gray-400 mt-1">{(agent.bio || '').length}/600 caracteres · Recomendado: 150-300 · Incluye tu experiencia, especialidad y qué te diferencia</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cita / Lema</label>
          <input type="text" value={agent.quote || ''} onChange={(e) => update('quote', e.target.value)} className="input-field" maxLength={120} placeholder="Tu lema profesional o frase que te define" />
          <p className="text-xs text-gray-400 mt-1">{(agent.quote || '').length}/120 caracteres · Aparece debajo de tu nombre en la sección "Sobre mí"</p>
        </div>
      </section>

      {/* Social links */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Globe className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Redes sociales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
            <input type="url" value={agent.social_links?.instagram || ''} onChange={(e) => update('social_links', { ...agent.social_links, instagram: e.target.value })} className="input-field" placeholder="https://instagram.com/tu-perfil" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
            <input type="url" value={agent.social_links?.facebook || ''} onChange={(e) => update('social_links', { ...agent.social_links, facebook: e.target.value })} className="input-field" placeholder="https://facebook.com/tu-pagina" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input type="url" value={agent.social_links?.linkedin || ''} onChange={(e) => update('social_links', { ...agent.social_links, linkedin: e.target.value })} className="input-field" placeholder="https://linkedin.com/in/tu-perfil" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
            <input type="url" value={agent.social_links?.youtube || ''} onChange={(e) => update('social_links', { ...agent.social_links, youtube: e.target.value })} className="input-field" placeholder="https://youtube.com/@tu-canal" />
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 text-gray-900">
          <Globe className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Idiomas</h2>
        </div>
        <p className="text-sm text-gray-500">Selecciona los idiomas en los que puedes atender a tus clientes</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {languages.map((lang) => {
            const isSelected = (agent.languages || []).includes(lang.code)
            return (
              <button
                key={lang.code}
                onClick={() => {
                  const current = agent.languages || []
                  const updated = isSelected
                    ? current.filter(l => l !== lang.code)
                    : [...current, lang.code]
                  update('languages', updated)
                }}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {lang.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Plan Info */}
      <section className="card p-6 space-y-3">
        <h2 className="font-semibold text-lg text-gray-900">Tu Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Plan actual: <span className="font-semibold text-gray-900 capitalize">{agent.plan}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Slug: /agente/{agent.slug}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            agent.plan === 'agency' ? 'bg-amber-100 text-amber-700' :
            agent.plan === 'premium' ? 'bg-purple-100 text-purple-700' :
            agent.plan === 'pro' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {agent.plan}
          </span>
        </div>
      </section>

      {/* Save button bottom */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
