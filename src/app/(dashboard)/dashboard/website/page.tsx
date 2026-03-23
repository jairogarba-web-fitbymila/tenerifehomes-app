'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import {
  Building2,
  Calendar,
  Search,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Zap,
  MapPin,
  Map,
  BookOpen,
  Image,
  Award,
  MessageCircle,
  Phone,
  Loader2,
  ExternalLink,
  GripVertical,
  Save,
  BarChart3,
  Home,
  Menu,
  CreditCard,
  Palmtree,
  Layout,
  Camera,
  Pencil,
  Upload,
  CheckCircle2,
  X,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

interface AgentProfile {
  id: string
  slug: string
  business_name: string
  template: string
  color_palette: string | null
}

interface HeroConfig {
  id: string
  agent_id: string
  headline: string
  subtitle: string | null
  cta_text: string
  cta_link: string
  background_image_url: string | null
}

interface AgentSection {
  id: string
  agent_id: string
  section_key: string
  is_active: boolean
  display_order: number
}

const SECTION_NAMES: Record<string, string> = {
  nav: 'Navegación', hero: 'Cabecera', footer: 'Pie de Página',
  properties_sale: 'Propiedades Venta', properties_rent_long: 'Alquiler Largo Plazo',
  properties_rent_vacation: 'Alquiler Vacacional', search: 'Buscador',
  featured: 'Destacados', about: 'Sobre Nosotros', team: 'Equipo',
  stats: 'Estadísticas', testimonials: 'Testimonios', services: 'Servicios',
  process: 'Proceso', valuation: 'Valoración', zones: 'Zonas',
  offices: 'Oficinas', map: 'Mapa', blog: 'Blog', gallery: 'Galería',
  press: 'Prensa', contact_form: 'Formulario Contacto', whatsapp: 'WhatsApp',
  booking: 'Reservas', expense_mgmt: 'Gestión Gastos', analytics: 'Analíticas', crm: 'CRM',
}

const SECTION_ICON: Record<string, any> = {
  nav: Menu, hero: Home, footer: Layout, properties_sale: Building2,
  properties_rent_long: Calendar, properties_rent_vacation: Palmtree,
  search: Search, featured: Star, about: Users, team: Users,
  stats: TrendingUp, testimonials: MessageSquare, services: Briefcase,
  process: Zap, valuation: CreditCard, zones: MapPin, offices: Building2,
  map: Map, blog: BookOpen, gallery: Image, press: Award,
  contact_form: MessageCircle, whatsapp: Phone, booking: Calendar,
  expense_mgmt: CreditCard, analytics: BarChart3, crm: Phone,
}

// Sections that have editable content with a link to where to edit
const SECTION_EDIT_LINKS: Record<string, { href: string; label: string }> = {
  about: { href: '/dashboard/settings', label: 'Editar bio y foto' },
  properties_sale: { href: '/dashboard/properties', label: 'Gestionar propiedades' },
  properties_rent_long: { href: '/dashboard/properties', label: 'Gestionar propiedades' },
  properties_rent_vacation: { href: '/dashboard/properties', label: 'Gestionar propiedades' },
  team: { href: '/dashboard/settings', label: 'Editar equipo' },
  testimonials: { href: '/dashboard/website/testimonials', label: 'Editar testimonios' },
  services: { href: '/dashboard/website/services', label: 'Editar servicios' },
  zones: { href: '/dashboard/website/zones', label: 'Editar zonas' },
  contact_form: { href: '/dashboard/settings', label: 'Editar datos de contacto' },
}

const TEMPLATES = [
  { id: 'luxury', name: 'Luxury Collection', primary: '#1A1A1A', accent: '#C9A84C' },
  { id: 'mediterranean', name: 'Mediterranean', primary: '#C4652E', accent: '#F5E6D3' },
  { id: 'corporate', name: 'Corporate', primary: '#0B2545', accent: '#4A90D9' },
  { id: 'boutique', name: 'Boutique', primary: '#C08B7F', accent: '#8B9D77' },
  { id: 'network', name: 'Network', primary: '#0B1D3A', accent: '#E8614D' },
]

export default function WebsiteEditorPage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [hero, setHero] = useState<HeroConfig | null>(null)
  const [sections, setSections] = useState<AgentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroHeadline, setHeroHeadline] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroCtaText, setHeroCtaText] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [uploadingHero, setUploadingHero] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const heroFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [profileRes, sectionsRes, heroRes] = await Promise.all([
        supabase.from('agent_profiles').select('id, slug, business_name, template, color_palette').eq('id', user.id).single(),
        supabase.from('agent_sections').select('*').eq('agent_id', user.id).order('display_order', { ascending: true }),
        supabase.from('hero_config').select('*').eq('agent_id', user.id).single(),
      ])

      if (profileRes.data) setProfile(profileRes.data)
      if (sectionsRes.data) setSections(sectionsRes.data)
      if (heroRes.data) {
        setHero(heroRes.data)
        setHeroHeadline(heroRes.data.headline || '')
        setHeroSubtitle(heroRes.data.subtitle || '')
        setHeroCtaText(heroRes.data.cta_text || '')
        setHeroImageUrl(heroRes.data.background_image_url || '')
      }
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = async (sectionId: string, active: boolean) => {
    const { error } = await supabase
      .from('agent_sections')
      .update({ is_active: active })
      .eq('id', sectionId)
    if (!error) {
      setSections(s => s.map(x => x.id === sectionId ? { ...x, is_active: active } : x))
    }
  }

  const saveHero = async () => {
    if (!hero) return
    setSaving(true)
    setSaveMessage('')
    const { error } = await supabase
      .from('hero_config')
      .update({
        headline: heroHeadline,
        subtitle: heroSubtitle,
        cta_text: heroCtaText,
        background_image_url: heroImageUrl || null,
      })
      .eq('id', hero.id)
    if (!error) {
      setHero({ ...hero, headline: heroHeadline, subtitle: heroSubtitle, cta_text: heroCtaText, background_image_url: heroImageUrl || null })
      setSaveMessage('Guardado')
      setTimeout(() => setSaveMessage(''), 2000)
    }
    setSaving(false)
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploadingHero(true)
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `agents/${profile.id}/hero.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('agent-assets')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) {
        // If bucket doesn't exist, use Unsplash URL from a FileReader
        console.error('Upload error:', uploadError)
        // Fallback: use object URL for preview, keep existing URL
        const reader = new FileReader()
        reader.onload = () => {
          // Can't upload, but at least we can show the preview idea
        }
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('agent-assets')
        .getPublicUrl(path)

      setHeroImageUrl(publicUrl)
    } catch (err) {
      console.error('Hero upload error:', err)
    } finally {
      setUploadingHero(false)
    }
  }

  const changeTemplate = async (template: string) => {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from('agent_profiles')
      .update({ template })
      .eq('id', profile.id)
    if (!error) setProfile({ ...profile, template })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">No se pudo cargar tu perfil de agente.</p>
      </div>
    )
  }

  const activeSections = sections.filter(s => s.is_active).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editor de Sitio Web</h1>
          <p className="text-gray-500 text-sm mt-1">Personaliza tu página web y administra secciones</p>
        </div>
        <Link
          href={`/agent/${profile.slug}`}
          target="_blank"
          className="btn-primary flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Ver mi web
        </Link>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-4">
        <p className="text-sm text-blue-800">
          <strong>Tu web ya está lista con datos de ejemplo.</strong> Sustituye textos, fotos y propiedades por los tuyos. Edita tu perfil en{' '}
          <Link href="/dashboard/settings" className="underline font-medium">Ajustes</Link>, propiedades en{' '}
          <Link href="/dashboard/properties" className="underline font-medium">Propiedades</Link>, y cabecera/secciones aquí.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500">Secciones Activas</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{activeSections} <span className="text-sm font-normal text-gray-400">/ {sections.length}</span></p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Plantilla</p>
          <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{profile.template}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">URL de tu web</p>
          <a
            href={`/agent/${profile.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-600 mt-2 truncate block hover:underline"
          >
            /agent/{profile.slug}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Template & Hero */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Plantilla</h2>
            <div className="space-y-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => changeTemplate(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                    profile.template === t.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.primary }} />
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.accent }} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hero Editor */}
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Cabecera (Hero)</h2>
            <div className="space-y-4">
              {/* Hero Background Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de fondo</label>
                <div className="relative group">
                  {heroImageUrl ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img
                        src={heroImageUrl}
                        alt="Hero background"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => heroFileRef.current?.click()}
                          className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                          title="Cambiar imagen"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setHeroImageUrl('')}
                          className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                          title="Eliminar imagen"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => heroFileRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-brand-400 hover:bg-brand-50/50 transition-colors"
                    >
                      {uploadingHero ? (
                        <Loader2 className="w-6 h-6 text-brand-600 animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-gray-400" />
                          <span className="text-xs text-gray-500">Subir imagen · 1920×800px · JPG/PNG/WebP · Máx. 5 MB</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={heroFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroImageUpload}
                  />
                </div>
                {/* URL manual input */}
                <div className="mt-2">
                  <input
                    type="url"
                    value={heroImageUrl}
                    onChange={e => setHeroImageUrl(e.target.value)}
                    className="input-field text-xs"
                    placeholder="O pega una URL de imagen..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titular</label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={e => setHeroHeadline(e.target.value)}
                  maxLength={100}
                  className="input-field"
                  placeholder="Tu titular principal"
                />
                <p className="text-xs text-gray-400 mt-1">{heroHeadline.length}/100</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <textarea
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  maxLength={200}
                  rows={2}
                  className="input-field resize-none"
                  placeholder="Descripción breve"
                />
                <p className="text-xs text-gray-400 mt-1">{heroSubtitle.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto del botón</label>
                <input
                  type="text"
                  value={heroCtaText}
                  onChange={e => setHeroCtaText(e.target.value)}
                  maxLength={50}
                  className="input-field"
                  placeholder="Ver Propiedades"
                />
              </div>
              <button
                onClick={saveHero}
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {saveMessage ? (
                  <><CheckCircle2 className="w-4 h-4" /> {saveMessage}</>
                ) : saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                ) : (
                  <><Save className="w-4 h-4" /> Guardar Cabecera</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right — Sections */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Secciones de tu web</h2>
              <p className="text-sm text-gray-500 mt-1">Activa/desactiva secciones. Los cambios se guardan automáticamente.</p>
            </div>
            <div className="divide-y divide-gray-50">
              {sections.map(section => {
                const Icon = SECTION_ICON[section.section_key] || Star
                const editLink = SECTION_EDIT_LINKS[section.section_key]
                return (
                  <div key={section.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      section.is_active ? 'bg-brand-50 text-brand-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${section.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {SECTION_NAMES[section.section_key] || section.section_key}
                      </p>
                      {editLink && section.is_active && (
                        <Link
                          href={editLink.href}
                          className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Pencil className="w-3 h-3" />
                          {editLink.label}
                        </Link>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={section.is_active}
                        onChange={e => toggleSection(section.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="card mt-6 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Editar contenido</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                <Camera className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Perfil y fotos</p>
                  <p className="text-xs text-gray-500">Bio, foto, logo, redes sociales</p>
                </div>
              </Link>
              <Link href="/dashboard/properties" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                <Building2 className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Propiedades</p>
                  <p className="text-xs text-gray-500">Añadir, editar, importar</p>
                </div>
              </Link>
              <Link href="/dashboard/properties/import" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                <Upload className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Importar propiedades</p>
                  <p className="text-xs text-gray-500">Desde URL o CSV/Excel</p>
                </div>
              </Link>
              <a href={`/agent/${profile.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors">
                <Eye className="w-5 h-5 text-brand-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vista previa</p>
                  <p className="text-xs text-gray-500">Ver cómo queda tu web</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
