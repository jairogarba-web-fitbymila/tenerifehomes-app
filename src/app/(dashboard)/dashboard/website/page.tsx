'use client'

import { useEffect, useState } from 'react'
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
    const { error } = await supabase
      .from('hero_config')
      .update({ headline: heroHeadline, subtitle: heroSubtitle, cta_text: heroCtaText })
      .eq('id', hero.id)
    if (!error) setHero({ ...hero, headline: heroHeadline, subtitle: heroSubtitle, cta_text: heroCtaText })
    setSaving(false)
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
          <p className="text-sm text-gray-500">URL</p>
          <p className="text-sm font-medium text-brand-600 mt-2 truncate">/agent/{profile.slug}</p>
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
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar Cabecera'}
              </button>
            </div>
          </div>
        </div>

        {/* Right — Sections */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Secciones de tu web</h2>
              <p className="text-sm text-gray-500 mt-1">Activa o desactiva secciones. Los cambios se guardan automáticamente.</p>
            </div>
            <div className="divide-y divide-gray-50">
              {sections.map(section => {
                const Icon = SECTION_ICON[section.section_key] || Star
                return (
                  <div key={section.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {SECTION_NAMES[section.section_key] || section.section_key}
                      </p>
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
        </div>
      </div>
    </div>
  )
}
