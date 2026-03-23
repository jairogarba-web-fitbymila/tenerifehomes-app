'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Navigation,
  Home,
  Footer,
  Building2,
  Calendar,
  Palmtree,
  Search,
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  Briefcase,
  Zap,
  MapPin,
  Map,
  Newspaper,
  ImageGallery,
  Megaphone,
  MessageCircle,
  Gift,
  DollarSign,
  BarChart3,
  Phone,
  ChevronDown,
  Loader,
  ExternalLink,
  GripVertical,
  Save,
} from 'lucide-react'
import Link from 'next/link'

interface AgentProfile {
  id: string
  user_id: string
  business_name: string
  template_type: 'luxury' | 'mediterranean' | 'corporate' | 'boutique' | 'network'
  color_palette: string
  hero_headline: string
  hero_subtitle: string
  hero_cta_text: string
  website_slug: string
  created_at: string
  updated_at: string
}

interface AgentSection {
  id: string
  agent_id: string
  section_key: string
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

const SECTION_MAPPING: Record<string, string> = {
  nav: 'Navegación',
  hero: 'Cabecera',
  footer: 'Pie de Página',
  properties_sale: 'Propiedades Venta',
  properties_rent_long: 'Alquiler Largo Plazo',
  properties_rent_vacation: 'Alquiler Vacacional',
  search: 'Buscador',
  featured: 'Destacados',
  about: 'Sobre Nosotros',
  team: 'Equipo',
  stats: 'Estadísticas',
  testimonials: 'Testimonios',
  services: 'Servicios',
  process: 'Proceso',
  valuation: 'Valoración',
  zones: 'Zonas',
  offices: 'Oficinas',
  map: 'Mapa',
  blog: 'Blog',
  gallery: 'Galería',
  press: 'Prensa',
  contact_form: 'Formulario Contacto',
  whatsapp: 'WhatsApp',
  booking: 'Reservas',
  expense_mgmt: 'Gestión Gastos',
  analytics: 'Analíticas',
  crm: 'CRM',
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  nav: <Navigation className="w-5 h-5" />,
  hero: <Home className="w-5 h-5" />,
  footer: <Footer className="w-5 h-5" />,
  properties_sale: <Building2 className="w-5 h-5" />,
  properties_rent_long: <Calendar className="w-5 h-5" />,
  properties_rent_vacation: <Palmtree className="w-5 h-5" />,
  search: <Search className="w-5 h-5" />,
  featured: <Star className="w-5 h-5" />,
  about: <Users className="w-5 h-5" />,
  team: <Users className="w-5 h-5" />,
  stats: <TrendingUp className="w-5 h-5" />,
  testimonials: <MessageSquare className="w-5 h-5" />,
  services: <Briefcase className="w-5 h-5" />,
  process: <Zap className="w-5 h-5" />,
  valuation: <DollarSign className="w-5 h-5" />,
  zones: <MapPin className="w-5 h-5" />,
  offices: <Building2 className="w-5 h-5" />,
  map: <Map className="w-5 h-5" />,
  blog: <Newspaper className="w-5 h-5" />,
  gallery: <ImageGallery className="w-5 h-5" />,
  press: <Megaphone className="w-5 h-5" />,
  contact_form: <MessageCircle className="w-5 h-5" />,
  whatsapp: <MessageCircle className="w-5 h-5" />,
  booking: <Gift className="w-5 h-5" />,
  expense_mgmt: <DollarSign className="w-5 h-5" />,
  analytics: <BarChart3 className="w-5 h-5" />,
  crm: <Phone className="w-5 h-5" />,
}

const TEMPLATES = [
  { id: 'luxury', name: 'Luxury', color: '#0B1D3A' },
  { id: 'mediterranean', name: 'Mediterranean', color: '#D4A574' },
  { id: 'corporate', name: 'Corporate', color: '#1E3A5F' },
  { id: 'boutique', name: 'Boutique', color: '#C9A84C' },
  { id: 'network', name: 'Network', color: '#2C5282' },
]

export default function WebsiteEditorPage() {
  const supabase = createClient()
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null)
  const [sections, setSections] = useState<AgentSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [heroHeadline, setHeroHeadline] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroCtaText, setHeroCtaText] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('luxury')
  const [selectedPalette, setSelectedPalette] = useState<string>('navy')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        console.error('No user logged in')
        return
      }

      // Load agent profile
      const { data: profile, error: profileError } = await supabase
        .from('agent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError) {
        console.error('Error loading profile:', profileError)
        return
      }

      setAgentProfile(profile)
      setHeroHeadline(profile.hero_headline || '')
      setHeroSubtitle(profile.hero_subtitle || '')
      setHeroCtaText(profile.hero_cta_text || '')
      setSelectedTemplate(profile.template_type || 'luxury')
      setSelectedPalette(profile.color_palette || 'navy')

      // Load agent sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('agent_sections')
        .select('*')
        .eq('agent_id', profile.id)
        .order('display_order', { ascending: true })

      if (sectionsError) {
        console.error('Error loading sections:', sectionsError)
        return
      }

      setSections(sectionsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSectionToggle = async (sectionId: string, newState: boolean) => {
    try {
      const { error } = await supabase
        .from('agent_sections')
        .update({ is_active: newState })
        .eq('id', sectionId)

      if (error) {
        console.error('Error updating section:', error)
        return
      }

      setSections(sections.map((s) => (s.id === sectionId ? { ...s, is_active: newState } : s)))
    } catch (error) {
      console.error('Error toggling section:', error)
    }
  }

  const handleSaveHeroText = async () => {
    if (!agentProfile) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('agent_profiles')
        .update({
          hero_headline: heroHeadline,
          hero_subtitle: heroSubtitle,
          hero_cta_text: heroCtaText,
        })
        .eq('id', agentProfile.id)

      if (error) {
        console.error('Error saving hero text:', error)
        return
      }

      setAgentProfile({
        ...agentProfile,
        hero_headline: heroHeadline,
        hero_subtitle: heroSubtitle,
        hero_cta_text: heroCtaText,
      })
    } catch (error) {
      console.error('Error saving hero text:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleTemplateChange = async (template: string) => {
    if (!agentProfile) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('agent_profiles')
        .update({ template_type: template })
        .eq('id', agentProfile.id)

      if (error) {
        console.error('Error updating template:', error)
        return
      }

      setSelectedTemplate(template)
      setAgentProfile({
        ...agentProfile,
        template_type: template as 'luxury' | 'mediterranean' | 'corporate' | 'boutique' | 'network',
      })
    } catch (error) {
      console.error('Error updating template:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-slate-600">Cargando editor de sitio web...</p>
        </div>
      </div>
    )
  }

  if (!agentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Perfil no encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">No se pudo cargar tu perfil de agente.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Editor de Sitio Web</h1>
          <p className="text-slate-600">Personaliza tu página web y administra todas las secciones</p>
        </div>

        {/* Preview Link */}
        <div className="mb-8">
          <Link
            href={`/preview/${agentProfile.website_slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Ver Vista Previa
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Template & Hero */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Plantilla</CardTitle>
                <CardDescription>Selecciona el diseño de tu página</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-amber-600 bg-amber-50'
                        : 'border-slate-200 bg-white hover:border-amber-400'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: template.color }}
                    />
                    <span
                      className={`font-medium ${
                        selectedTemplate === template.id
                          ? 'text-amber-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {template.name}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Hero Text Editor */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Cabecera</CardTitle>
                <CardDescription>Edita el texto principal de tu página</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titular
                  </label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                    placeholder="Tu titular aquí"
                  />
                  <p className="text-xs text-slate-500 mt-1">{heroHeadline.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subtítulo
                  </label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    maxLength={200}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none resize-none"
                    placeholder="Tu subtítulo aquí"
                  />
                  <p className="text-xs text-slate-500 mt-1">{heroSubtitle.length}/200</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Texto del Botón
                  </label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => setHeroCtaText(e.target.value)}
                    maxLength={50}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none"
                    placeholder="Ej: Contáctame"
                  />
                  <p className="text-xs text-slate-500 mt-1">{heroCtaText.length}/50</p>
                </div>

                <Button
                  onClick={handleSaveHeroText}
                  disabled={saving}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar Cabecera'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sections */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Secciones</CardTitle>
                <CardDescription>
                  Activa o desactiva secciones en tu página web
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                    >
                      <GripVertical className="w-5 h-5 text-slate-400 flex-shrink-0 cursor-grab" />

                      <div className="flex-shrink-0 text-slate-600">
                        {SECTION_ICONS[section.section_key] || <div className="w-5 h-5" />}
                      </div>

                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-slate-900">
                          {SECTION_MAPPING[section.section_key] || section.section_key}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Orden: {section.display_order}
                        </p>
                      </div>

                      <Switch
                        checked={section.is_active}
                        onCheckedChange={(checked) =>
                          handleSectionToggle(section.id, checked)
                        }
                        className="flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>

                {sections.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p>No hay secciones disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-slate-200 shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-sm text-blue-700 font-medium">Secciones Activas</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">
                      {sections.filter((s) => s.is_active).length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
                    <p className="text-sm text-amber-700 font-medium">Total Secciones</p>
                    <p className="text-2xl font-bold text-amber-900 mt-1">{sections.length}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Los cambios se guardan automáticamente al activar o desactivar secciones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
