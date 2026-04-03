'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  Building2, Calendar, Search, Star, Users, TrendingUp, MessageSquare,
  Briefcase, Zap, MapPin, Map, BookOpen, Image, Award, MessageCircle,
  Phone, Loader2, ExternalLink, GripVertical, Save, BarChart3, Home,
  Menu, CreditCard, Layout, Camera, Upload, CheckCircle2, X, Eye,
  Monitor, Tablet, Smartphone, Maximize2, Palette,
} from 'lucide-react'
import Link from 'next/link'
import TemplateRenderer from '@/components/templates/TemplateRenderer'
import { TemplateData, TemplateAgent, TemplateProperty, TEMPLATE_LIST } from '@/components/templates/types'

// ─── Section metadata ──────────────────────────────────────
const SECTION_NAMES: Record<string, string> = {
  nav: 'Navegacion', hero: 'Cabecera (Hero)', footer: 'Pie de Pagina',
  properties_sale: 'Propiedades Venta', properties_rent_long: 'Alquiler Largo Plazo',
  properties_rent_vacation: 'Alquiler Vacacional', search: 'Buscador',
  featured: 'Destacados', about: 'Sobre Nosotros', team: 'Equipo',
  stats: 'Estadisticas', testimonials: 'Testimonios', services: 'Servicios',
  process: 'Proceso', valuation: 'Valoracion', zones: 'Zonas',
  offices: 'Oficinas', map: 'Mapa', blog: 'Blog', gallery: 'Galeria',
  press: 'Prensa', contact_form: 'Formulario Contacto', whatsapp: 'WhatsApp',
  booking: 'Reservas', expense_mgmt: 'Gestion Gastos', analytics: 'Analiticas', crm: 'CRM',
}

const SECTION_ICON: Record<string, any> = {
  nav: Menu, hero: Home, footer: Layout, properties_sale: Building2,
  properties_rent_long: Calendar, properties_rent_vacation: Calendar,
  search: Search, featured: Star, about: Users, team: Users,
  stats: TrendingUp, testimonials: MessageSquare, services: Briefcase,
  process: Zap, valuation: CreditCard, zones: MapPin, offices: Building2,
  map: Map, blog: BookOpen, gallery: Image, press: Award,
  contact_form: MessageCircle, whatsapp: Phone, booking: Calendar,
  expense_mgmt: CreditCard, analytics: BarChart3, crm: Phone,
}

const SECTION_EDIT_LINKS: Record<string, { href: string; label: string }> = {
  hero: { href: '#content', label: 'Editar' },
  about: { href: '#content', label: 'Editar' },
  testimonials: { href: '/dashboard/website/testimonials', label: 'Editar' },
  services: { href: '/dashboard/website/services', label: 'Editar' },
  zones: { href: '/dashboard/website/zones', label: 'Editar' },
  team: { href: '/dashboard/settings', label: 'Editar' },
  contact_form: { href: '/dashboard/settings', label: 'Editar' },
  properties_sale: { href: '/dashboard/properties', label: 'Gestionar' },
  properties_rent_long: { href: '/dashboard/properties', label: 'Gestionar' },
  properties_rent_vacation: { href: '/dashboard/properties', label: 'Gestionar' },
}

const TEMPLATE_SWATCHES: Record<string, string> = {
  luxury: 'linear-gradient(135deg, #1A1A1A, #C9A84C)',
  mediterranean: 'linear-gradient(135deg, #FBF7F2, #C4652E)',
  corporate: 'linear-gradient(135deg, #0B2545, #4A90D9)',
  boutique: 'linear-gradient(135deg, #FAF8F5, #C08B7F)',
  classic: 'linear-gradient(135deg, #FAF8F5, #8B6F47)',
  data: 'linear-gradient(135deg, #0F172A, #06B6D4)',
}

// ─── Types ─────────────────────────────────────────────────
interface AgentSection {
  id: string
  agent_id: string
  section_key: string
  is_active: boolean
  display_order: number
  custom_title?: string
}

interface HeroState {
  headline: string
  subtitle: string
  cta_text: string
  cta_link: string
  background_image_url: string
  overlay_opacity: number
}

type TabId = 'design' | 'content' | 'sections'
type DeviceMode = 'desktop' | 'tablet' | 'mobile'

// ─── Component ─────────────────────────────────────────────
export default function WebsiteEditorPage() {
  const supabase = createClient()

  // Core data
  const [agentProfile, setAgentProfile] = useState<any>(null)
  const [agentData, setAgentData] = useState<TemplateAgent | null>(null)
  const [hero, setHero] = useState<HeroState>({ headline: '', subtitle: '', cta_text: '', cta_link: '', background_image_url: '', overlay_opacity: 0.5 })
  const [sections, setSections] = useState<AgentSection[]>([])
  const [properties, setProperties] = useState<TemplateProperty[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [zones, setZones] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])

  // UI state
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('design')
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving' | 'idle'>('idle')
  const [fullscreen, setFullscreen] = useState(false)

  // Upload
  const [uploadingHero, setUploadingHero] = useState(false)
  const heroFileRef = useRef<HTMLInputElement>(null)

  // Initial data snapshot for dirty tracking
  const initialDataRef = useRef<{ hero: HeroState; template: string; sections: AgentSection[] } | null>(null)

  // ─── Load data ─────────────────────────────────────────
  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get agent profile for slug and template
      const { data: profile } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) return
      setAgentProfile(profile)

      // Fetch all data from the public agent API
      const res = await fetch(`/api/agent/${profile.slug}`)
      if (!res.ok) return
      const apiData = await res.json()

      // Populate state
      const agentObj: TemplateAgent = {
        full_name: apiData.agent.full_name || apiData.agent.business_name || '',
        business_name: apiData.agent.business_name || '',
        slug: apiData.agent.slug,
        template: apiData.agent.template || 'luxury',
        bio: apiData.agent.bio || '',
        phone: apiData.agent.phone || '',
        email: apiData.agent.email || '',
        photo: apiData.agent.photo_url || '',
        bio_photo_url: apiData.agent.bio_photo_url || '',
        city: apiData.agent.city || '',
        stats: apiData.agent.stats || {},
        quote: apiData.agent.quote || '',
        whatsapp: apiData.agent.whatsapp || '',
        languages: apiData.agent.languages || [],
        experience_years: apiData.agent.experience_years,
      }
      setAgentData(agentObj)

      const heroState: HeroState = {
        headline: apiData.hero?.headline || '',
        subtitle: apiData.hero?.subtitle || '',
        cta_text: apiData.hero?.cta_text || '',
        cta_link: apiData.hero?.cta_link || '',
        background_image_url: apiData.hero?.background_image_url || '',
        overlay_opacity: apiData.hero?.overlay_opacity ?? 0.5,
      }
      setHero(heroState)

      // Sections: use all from DB (active + inactive)
      const { data: allSections } = await supabase
        .from('agent_sections')
        .select('*')
        .eq('agent_id', user.id)
        .order('display_order', { ascending: true })
      setSections(allSections || [])

      setProperties(apiData.properties || [])
      setTestimonials(apiData.testimonials || [])
      setServices(apiData.services || [])
      setZones(apiData.zones || [])
      setTeam(apiData.team || [])

      // Save initial snapshot
      initialDataRef.current = {
        hero: { ...heroState },
        template: profile.template,
        sections: (allSections || []).map(s => ({ ...s })),
      }
      setSaveStatus('saved')
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ─── Dirty tracking ───────────────────────────────────
  useEffect(() => {
    if (!initialDataRef.current || loading) return
    const init = initialDataRef.current
    const heroChanged = JSON.stringify(hero) !== JSON.stringify(init.hero)
    const templateChanged = agentProfile?.template !== init.template
    const sectionsChanged = JSON.stringify(sections.map(s => ({ id: s.id, is_active: s.is_active }))) !==
      JSON.stringify(init.sections.map(s => ({ id: s.id, is_active: s.is_active })))
    const dirty = heroChanged || templateChanged || sectionsChanged
    setIsDirty(dirty)
    if (dirty && saveStatus === 'saved') setSaveStatus('unsaved')
  }, [hero, agentProfile?.template, sections, loading])

  // ─── Warn on exit with unsaved changes ────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // ─── Build preview data ───────────────────────────────
  const buildPreviewData = useCallback((): TemplateData | null => {
    if (!agentData) return null
    return {
      agent: { ...agentData, template: agentProfile?.template || 'luxury' },
      properties,
      hero: {
        headline: hero.headline,
        subtitle: hero.subtitle,
        cta_text: hero.cta_text,
        background_image_url: hero.background_image_url,
        image: hero.background_image_url,
      },
      testimonials,
      services,
      zones,
      team,
    }
  }, [agentData, agentProfile?.template, hero, properties, testimonials, services, zones, team])

  // ─── Save all ─────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('saving')
    try {
      const results = await Promise.all([
        fetch('/api/dashboard/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hero),
        }),
        fetch('/api/dashboard/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template: agentProfile?.template }),
        }),
        fetch('/api/dashboard/sections', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sections.map(s => ({ id: s.id, is_active: s.is_active, display_order: s.display_order }))),
        }),
      ])

      const allOk = results.every(r => r.ok)
      if (allOk) {
        initialDataRef.current = {
          hero: { ...hero },
          template: agentProfile?.template,
          sections: sections.map(s => ({ ...s })),
        }
        setIsDirty(false)
        setSaveStatus('saved')
        setTimeout(() => {
          if (!isDirty) setSaveStatus('saved')
        }, 2000)
      }
    } catch (err) {
      console.error('Save error:', err)
      setSaveStatus('unsaved')
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Template change ──────────────────────────────────
  const changeTemplate = (templateId: string) => {
    if (!agentProfile) return
    setAgentProfile({ ...agentProfile, template: templateId })
  }

  // ─── Section toggle ───────────────────────────────────
  const toggleSection = (sectionId: string) => {
    setSections(prev => prev.map(s =>
      s.id === sectionId ? { ...s, is_active: !s.is_active } : s
    ))
  }

  // ─── Hero image upload ────────────────────────────────
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !agentProfile) return
    setUploadingHero(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `agents/${agentProfile.id}/hero.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('agent-assets')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) {
        console.error('Upload error:', uploadError)
        return
      }
      const { data: { publicUrl } } = supabase.storage
        .from('agent-assets')
        .getPublicUrl(path)
      setHero(prev => ({ ...prev, background_image_url: publicUrl }))
    } catch (err) {
      console.error('Hero upload error:', err)
    } finally {
      setUploadingHero(false)
    }
  }

  // ─── Loading state ────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!agentProfile || !agentData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No se pudo cargar tu perfil de agente.</p>
      </div>
    )
  }

  const previewData = buildPreviewData()
  const currentTemplate = agentProfile.template || 'luxury'

  const deviceMaxWidth = deviceMode === 'tablet' ? '768px' : deviceMode === 'mobile' ? '390px' : '100%'

  // ─── Render ───────────────────────────────────────────
  return (
    <>
      {/* Top bar */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-0">
        <div className="flex items-center justify-between h-14 px-5 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-slate-900">Habi<span className="text-blue-500">Book</span></span>
            <span className="text-xs text-slate-400">/ Dashboard / Editor de Sitio Web</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Save indicator */}
            <div className="flex items-center gap-1.5 text-xs">
              {saveStatus === 'saved' && (
                <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /><span className="text-green-600">Guardado</span></>
              )}
              {saveStatus === 'unsaved' && (
                <><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /><span className="text-yellow-600">Sin guardar</span></>
              )}
              {saveStatus === 'saving' && (
                <><Loader2 className="w-3 h-3 animate-spin text-slate-400" /><span className="text-slate-400">Guardando...</span></>
              )}
            </div>
            <a
              href={`/agent/${agentProfile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            >
              Ver web publica
            </a>
            <button
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className={`px-5 py-2 rounded-lg text-xs font-semibold border-none text-white transition ${
                isDirty ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' : 'bg-blue-300 cursor-not-allowed'
              }`}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      {/* Main split layout */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 flex" style={{ height: 'calc(100vh - 56px - 56px)' }}>

        {/* ─── LEFT PANEL: Editor ──────────────────────── */}
        <div className="w-[420px] min-w-[420px] bg-white border-r border-slate-200 overflow-y-auto hidden lg:block">

          {/* Tabs */}
          <div className="flex border-b border-slate-200 sticky top-0 bg-white z-10">
            {([
              { id: 'design' as TabId, label: 'Diseno' },
              { id: 'content' as TabId, label: 'Contenido' },
              { id: 'sections' as TabId, label: 'Secciones' },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3.5 text-center text-[13px] font-medium transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-500 border-blue-500'
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── TAB: Design ───────────────────────────── */}
          {activeTab === 'design' && (
            <div>
              {/* Template selector */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3.5">Plantilla</p>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATE_LIST.map(t => (
                    <button
                      key={t.id}
                      onClick={() => changeTemplate(t.id)}
                      className={`rounded-lg p-2 text-center transition border-2 ${
                        currentTemplate === t.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div
                        className="h-8 rounded mb-1"
                        style={{ background: TEMPLATE_SWATCHES[t.id] || `linear-gradient(135deg, ${t.bg}, ${t.color})` }}
                      />
                      <p className="text-[10px] font-semibold text-slate-600">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Palette indicator */}
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3.5">Paleta de colores</p>
                <div className="flex gap-2 flex-wrap">
                  {TEMPLATE_LIST.map(t => (
                    <div
                      key={t.id}
                      onClick={() => changeTemplate(t.id)}
                      className={`w-9 h-9 rounded-full cursor-pointer transition-all ${
                        currentTemplate === t.id ? 'ring-[3px] ring-blue-500 ring-offset-1' : 'ring-[3px] ring-transparent'
                      }`}
                      style={{ backgroundColor: t.color }}
                      title={t.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: Content ──────────────────────────── */}
          {activeTab === 'content' && (
            <div>
              {/* Hero section */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3.5">Cabecera (Hero)</p>

                {/* Hero image */}
                <div className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Imagen de fondo</span>
                    <span className="text-xs text-slate-400">1920x800px</span>
                  </div>
                  {hero.background_image_url ? (
                    <div className="relative group w-full h-[120px] rounded-lg overflow-hidden">
                      <img src={hero.background_image_url} alt="Hero" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => heroFileRef.current?.click()}
                          className="px-3 py-1.5 bg-white rounded-md text-xs font-semibold"
                        >
                          Cambiar imagen
                        </button>
                        <button
                          onClick={() => setHero(prev => ({ ...prev, background_image_url: '' }))}
                          className="p-1.5 bg-white rounded-md text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => heroFileRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-blue-400 hover:bg-blue-50/30 transition"
                    >
                      {uploadingHero ? (
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                          <p className="text-xs text-slate-400">Arrastra o haz clic</p>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                </div>

                {/* Headline */}
                <div className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Titular</span>
                    <span className="text-xs text-slate-400">{hero.headline.length}/100</span>
                  </div>
                  <input
                    type="text"
                    value={hero.headline}
                    onChange={e => setHero(prev => ({ ...prev, headline: e.target.value }))}
                    maxLength={100}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition"
                    placeholder="Tu titular principal"
                  />
                </div>

                {/* Subtitle */}
                <div className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Subtitulo</span>
                    <span className="text-xs text-slate-400">{hero.subtitle.length}/200</span>
                  </div>
                  <textarea
                    value={hero.subtitle}
                    onChange={e => setHero(prev => ({ ...prev, subtitle: e.target.value }))}
                    maxLength={200}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 resize-vertical font-[inherit] focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition"
                    placeholder="Descripcion breve"
                  />
                </div>

                {/* CTA text */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Texto del boton</span>
                    <span className="text-xs text-slate-400">{hero.cta_text.length}/50</span>
                  </div>
                  <input
                    type="text"
                    value={hero.cta_text}
                    onChange={e => setHero(prev => ({ ...prev, cta_text: e.target.value }))}
                    maxLength={50}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 transition"
                    placeholder="Ver Propiedades"
                  />
                </div>
              </div>

              {/* About section */}
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3.5">Sobre mi</p>

                {/* Profile photo */}
                <div className="mb-3.5">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">Foto de perfil</span>
                  {agentData.bio_photo_url ? (
                    <div className="w-full h-[120px] rounded-lg overflow-hidden">
                      <img src={agentData.bio_photo_url} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 text-center">
                      <Camera className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                      <p className="text-xs text-slate-400">Edita en Ajustes &rarr; Perfil</p>
                    </div>
                  )}
                </div>

                {/* Name/Business */}
                <div className="mb-3.5">
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">Nombre / Empresa</span>
                  <input
                    type="text"
                    value={agentData.business_name || agentData.full_name}
                    readOnly
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Edita en <Link href="/dashboard/settings" className="text-blue-500 hover:underline">Ajustes</Link></p>
                </div>

                {/* Bio */}
                <div>
                  <span className="text-xs font-semibold text-slate-600 block mb-1.5">Biografia</span>
                  <textarea
                    value={agentData.bio || ''}
                    readOnly
                    rows={4}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-50 resize-none cursor-not-allowed font-[inherit]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Edita en <Link href="/dashboard/settings" className="text-blue-500 hover:underline">Ajustes</Link></p>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: Sections ─────────────────────────── */}
          {activeTab === 'sections' && (
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Secciones visibles</p>
              <p className="text-xs text-slate-400 mb-4">Activa/desactiva cada seccion</p>

              <div>
                {sections.map(section => {
                  const Icon = SECTION_ICON[section.section_key] || Star
                  const editLink = SECTION_EDIT_LINKS[section.section_key]
                  return (
                    <div
                      key={section.id}
                      className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-300 text-base select-none cursor-grab">&#x2807;</span>
                        <span className="text-[13px] font-medium text-slate-700">
                          {SECTION_NAMES[section.section_key] || section.section_key}
                        </span>
                        {editLink && section.is_active && (
                          editLink.href.startsWith('#') ? (
                            <button
                              onClick={() => setActiveTab('content')}
                              className="text-[11px] text-blue-500 hover:underline"
                            >
                              {editLink.label} &rarr;
                            </button>
                          ) : (
                            <Link href={editLink.href} className="text-[11px] text-blue-500 hover:underline">
                              {editLink.label} &rarr;
                            </Link>
                          )
                        )}
                      </div>
                      {/* Toggle switch */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${
                          section.is_active ? 'bg-blue-500' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            section.is_active ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ─── RIGHT PANEL: Live Preview ─────────────── */}
        <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col">

          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Vista previa en vivo</span>
              <div className="flex gap-1">
                {([
                  { mode: 'desktop' as DeviceMode, icon: Monitor, label: 'Desktop' },
                  { mode: 'tablet' as DeviceMode, icon: Tablet, label: 'Tablet' },
                  { mode: 'mobile' as DeviceMode, icon: Smartphone, label: 'Movil' },
                ]).map(d => (
                  <button
                    key={d.mode}
                    onClick={() => setDeviceMode(d.mode)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
                      deviceMode === d.mode
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setFullscreen(true)}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            >
              <Maximize2 className="w-3.5 h-3.5 inline mr-1" />
              Pantalla completa
            </button>
          </div>

          {/* Preview frame */}
          <div className="flex-1 flex justify-center p-6 overflow-auto">
            <div
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
              style={{ width: '100%', maxWidth: deviceMaxWidth }}
            >
              {previewData && (
                <TemplateRenderer
                  templateId={currentTemplate}
                  data={previewData}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Fullscreen modal ────────────────────────── */}
      {fullscreen && previewData && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
          <div className="w-full h-full bg-white overflow-auto relative">
            <button
              onClick={() => setFullscreen(false)}
              className="fixed top-4 right-4 z-[201] p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
            <TemplateRenderer
              templateId={currentTemplate}
              data={previewData}
            />
          </div>
        </div>
      )}

      {/* Mobile fallback: show only on small screens */}
      <div className="lg:hidden text-center py-10 text-sm text-slate-500 -mx-4 sm:-mx-6">
        <Monitor className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p>El editor con vista previa esta optimizado para pantallas grandes.</p>
        <p className="mt-1">Usa un ordenador para la mejor experiencia.</p>
      </div>
    </>
  )
}
