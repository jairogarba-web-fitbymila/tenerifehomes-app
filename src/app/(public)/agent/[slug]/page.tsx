'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Bed,
  Bath,
  Ruler,
  Star,
  Users,
  MapIcon,
  Briefcase,
  Globe,
} from 'lucide-react'

interface AgentProfile {
  id: string
  slug: string
  business_name: string
  business_type: string
  template: 'luxury' | 'mediterranean' | 'corporate' | 'boutique' | 'network'
  color_palette: Record<string, string>
  logo_url: string | null
  phone: string | null
  email: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  languages: string[] | null
  bio: string | null
  bio_photo_url: string | null
  quote: string | null
  stats: Record<string, number> | null
  social_links: Record<string, string> | null
  plan: string
  is_active: boolean
}

interface AgentSection {
  agent_id: string
  section_key: string
  is_active: boolean
  display_order: number
  custom_title: string | null
  custom_config: Record<string, any> | null
}

interface Property {
  id: string
  title: string
  slug: string
  description: string | null
  property_type: string
  operation_type: 'sale' | 'rent' | 'vacation'
  price: number | null
  price_per_night: number | null
  bedrooms: number | null
  bathrooms: number | null
  size_m2: number | null
  location: string | null
  images: string[] | null
  badge: string | null
  is_featured: boolean
  is_active: boolean
}

interface HeroConfig {
  agent_id: string
  headline: string | null
  subtitle: string | null
  cta_text: string | null
  cta_link: string | null
  background_image_url: string | null
  overlay_opacity: number
}

interface Testimonial {
  id: string
  agent_id: string
  quote: string
  client_name: string
  client_location: string | null
  rating: number | null
}

interface TeamMember {
  id: string
  agent_id: string
  name: string
  role: string
  photo_url: string | null
  bio: string | null
  languages: string[] | null
}

interface Service {
  id: string
  agent_id: string
  title: string
  description: string | null
  icon: string | null
}

interface Zone {
  id: string
  agent_id: string
  name: string
  description: string | null
  image_url: string | null
  property_count: number
}

const TEMPLATE_COLORS = {
  luxury: {
    primary: '#1A1A1A',
    accent: '#C9A84C',
    fontFamily: 'font-cormorant',
  },
  mediterranean: {
    primary: '#C4652E',
    accent: '#F5E6D3',
    fontFamily: 'font-dmsans',
  },
  corporate: {
    primary: '#0B2545',
    accent: '#4A90D9',
    fontFamily: 'font-montserrat',
  },
  boutique: {
    primary: '#C08B7F',
    accent: '#8B9D77',
    fontFamily: 'font-dmsans',
  },
  network: {
    primary: '#0B1D3A',
    accent: '#E8614D',
    fontFamily: 'font-sora',
  },
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

// Navigation Component
function Navigation({ agent, colors }: { agent: AgentProfile; colors: any }) {
  return (
    <header
      style={{ backgroundColor: colors.primary }}
      className="text-white border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {agent.logo_url ? (
            <img src={agent.logo_url} alt={agent.business_name} className="h-10 w-auto" />
          ) : (
            <span className="font-bold text-xl">{agent.business_name}</span>
          )}
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#propiedades" className="hover:opacity-80 transition">
            Propiedades
          </a>
          <a href="#equipo" className="hover:opacity-80 transition">
            Equipo
          </a>
          <a href="#contacto" className="hover:opacity-80 transition">
            Contacto
          </a>
        </nav>
      </div>
    </header>
  )
}

// Hero Section Component
function HeroSection({
  agent,
  hero,
  colors,
}: {
  agent: AgentProfile
  hero: HeroConfig | null
  colors: any
}) {
  const bgStyle = hero?.background_image_url
    ? {
        backgroundImage: `url(${hero.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: colors.primary }

  return (
    <section
      style={bgStyle}
      className="relative text-white py-20"
    >
      <div
        style={{
          backgroundColor: colors.primary,
          opacity: hero?.overlay_opacity || 0.7,
        }}
        className="absolute inset-0"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start gap-8">
          {agent.bio_photo_url && (
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4" style={{ borderColor: colors.accent }}>
              <img
                src={agent.bio_photo_url}
                alt={agent.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3">
              {hero?.headline || agent.business_name}
            </h1>
            {hero?.subtitle && (
              <p className="text-xl text-white/80 mb-4">{hero.subtitle}</p>
            )}
            {agent.quote && (
              <blockquote className="text-lg italic text-white/70 border-l-4 pl-4 mb-6" style={{ borderColor: colors.accent }}>
                "{agent.quote}"
              </blockquote>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              {agent.city && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {agent.city}
                </span>
              )}
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-white">
                  <Phone className="w-4 h-4" /> {agent.phone}
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-white">
                  <Mail className="w-4 h-4" /> Email
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener" className="flex items-center gap-2 hover:text-white">
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Properties Section Component
function PropertiesSection({
  properties,
  colors,
  operationType,
  title,
}: {
  properties: Property[]
  colors: any
  operationType?: string
  title?: string
}) {
  const filtered = operationType
    ? properties.filter((p) => p.operation_type === operationType && p.is_active)
    : properties.filter((p) => p.is_active)

  if (filtered.length === 0) return null

  const displayTitle =
    title ||
    (operationType === 'rent_vacation'
      ? 'Alquileres Vacacionales'
      : operationType === 'rent_long'
        ? 'Alquileres'
        : 'Propiedades en Venta')

  return (
    <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8" style={{ color: colors.primary }}>
        {displayTitle} ({filtered.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prop) => (
          <Link
            key={prop.id}
            href={`/property/${prop.slug}`}
            className="group bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
              {prop.images && prop.images.length > 0 ? (
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Building2 className="w-10 h-10 text-gray-400" />
                </div>
              )}
              {prop.badge && (
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium"
                  style={{ backgroundColor: colors.accent }}
                >
                  {prop.badge}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {prop.title}
              </h3>
              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-xl font-bold" style={{ color: colors.primary }}>
                  {prop.operation_type === 'vacation' && prop.price_per_night
                    ? `€${prop.price_per_night}/noche`
                    : prop.price
                      ? formatPrice(prop.price)
                      : 'Consultar'}
                </p>
              </div>
              {prop.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" /> {prop.location}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {prop.bedrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {prop.bedrooms}
                  </span>
                )}
                {prop.bathrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {prop.bathrooms}
                  </span>
                )}
                {prop.size_m2 != null && (
                  <span className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" /> {prop.size_m2}m²
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// About Section Component
function AboutSection({ agent, colors }: { agent: AgentProfile; colors: any }) {
  if (!agent.bio) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>
          Sobre {agent.business_name}
        </h2>
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg leading-relaxed">{agent.bio}</p>
        </div>
        {agent.quote && (
          <blockquote className="mt-8 text-lg italic text-gray-500 border-l-4 pl-4" style={{ borderColor: colors.accent }}>
            &ldquo;{agent.quote}&rdquo;
          </blockquote>
        )}
        {agent.languages && agent.languages.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            Idiomas: {agent.languages.map(l => {
              const names: Record<string, string> = { es: 'Español', en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano', pt: 'Português', nl: 'Nederlands', ru: 'Русский', sv: 'Svenska', lt: 'Lietuvių' }
              return names[l] || l
            }).join(', ')}
          </div>
        )}
      </div>
    </section>
  )
}

// Stats Section Component (standalone, shown when stats section is active)
function StatsSection({ agent, colors }: { agent: AgentProfile; colors: any }) {
  if (!agent.stats || Object.keys(agent.stats).length === 0) return null

  const formatLabel = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <section className="py-16" style={{ backgroundColor: colors.primary }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {Object.entries(agent.stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-4xl font-bold text-white">
                {typeof value === 'number' && value > 0 ? (value >= 100 ? `${value}+` : value) : '—'}
              </div>
              <div className="text-sm text-white/70 mt-2">
                {formatLabel(key)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Team Section Component
function TeamSection({
  team,
  colors,
}: {
  team: TeamMember[]
  colors: any
}) {
  if (team.length === 0) return null

  return (
    <section id="equipo" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8" style={{ color: colors.primary }}>
        Nuestro Equipo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {member.photo_url && (
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{member.name}</h3>
              <p className="text-sm text-gray-600" style={{ color: colors.accent }}>
                {member.role}
              </p>
              {member.bio && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {member.bio}
                </p>
              )}
              {member.languages && member.languages.length > 0 && (
                <p className="text-xs text-gray-400 mt-2">
                  {member.languages.join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// Testimonials Section Component
function TestimonialsSection({
  testimonials,
  colors,
}: {
  testimonials: Testimonial[]
  colors: any
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>
          Testimonios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg border-l-4"
              style={{ borderColor: colors.accent }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(Math.round(testimonial.rating || 5))].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-current"
                    style={{ color: colors.accent }}
                  />
                ))}
              </div>
              <blockquote className="text-gray-700 mb-4 italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">
                  {testimonial.client_name}
                </p>
                {testimonial.client_location && (
                  <p className="text-sm text-gray-500">{testimonial.client_location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Services Section Component
function ServicesSection({
  services,
  colors,
}: {
  services: Service[]
  colors: any
}) {
  if (services.length === 0) return null

  const iconMap: Record<string, React.ReactNode> = {
    briefcase: <Briefcase className="w-8 h-8" />,
    users: <Users className="w-8 h-8" />,
    map: <MapIcon className="w-8 h-8" />,
    building: <Building2 className="w-8 h-8" />,
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>
        Servicios
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="p-6 bg-white border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4" style={{ color: colors.accent }}>
              {iconMap[service.icon || 'briefcase'] || <Briefcase className="w-8 h-8" />}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
            {service.description && (
              <p className="text-sm text-gray-600">{service.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

// Zones Section Component
function ZonesSection({
  zones,
  colors,
}: {
  zones: Zone[]
  colors: any
}) {
  if (zones.length === 0) return null

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.primary }}>
          Zonas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone) => (
            <div key={zone.id} className="overflow-hidden rounded-lg border border-gray-200">
              {zone.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={zone.image_url}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {zone.name}
                </h3>
                {zone.description && (
                  <p className="text-gray-600 mb-3">{zone.description}</p>
                )}
                <p className="text-sm font-medium" style={{ color: colors.accent }}>
                  {zone.property_count} propiedades
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Form Section Component
function ContactFormSection({
  agent,
  colors,
}: {
  agent: AgentProfile
  colors: any
}) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          agent_id: agent.id,
        }),
      })
      if (response.ok) {
        setFormState({ name: '', email: '', phone: '', message: '' })
        alert('Mensaje enviado correctamente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contacto" className="bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: colors.primary }}>
          Contacta con {agent.business_name}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Estamos aquí para ayudarte. Envíanos un mensaje.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ '--tw-ring-color': colors.accent } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                style={{ '--tw-ring-color': colors.accent } as any}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formState.phone}
              onChange={(e) =>
                setFormState({ ...formState, phone: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
              style={{ '--tw-ring-color': colors.accent } as any}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje
            </label>
            <textarea
              rows={4}
              value={formState.message}
              onChange={(e) =>
                setFormState({ ...formState, message: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
              style={{ '--tw-ring-color': colors.accent } as any}
              placeholder="Me interesa..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </section>
  )
}

// Footer Component
function Footer({ colors }: { colors: any }) {
  return (
    <footer className="text-white text-sm text-center py-6" style={{ backgroundColor: colors.primary }}>
      <p>
        Powered by <span className="font-medium">TenerifeHomes</span>
      </p>
    </footer>
  )
}

// Main Page Component
export default function AgentPublicPage({
  params,
}: {
  params: { slug: string }
}) {
  const [agent, setAgent] = useState<AgentProfile | null>(null)
  const [sections, setSections] = useState<AgentSection[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [hero, setHero] = useState<HeroConfig | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/agent/${params.slug}`)
        if (!response.ok) {
          setNotFound(true)
          return
        }
        const data = await response.json()
        setAgent(data.agent)
        setSections(data.sections)
        setProperties(data.properties)
        setHero(data.hero)
        setTestimonials(data.testimonials)
        setTeam(data.team)
        setServices(data.services)
        setZones(data.zones)
      } catch (error) {
        console.error('Error fetching agent data:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (notFound || !agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agente no encontrado</h1>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar este agente.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const colors = TEMPLATE_COLORS[agent.template] || TEMPLATE_COLORS.corporate
  const activeSections = sections
    .filter((s) => s.is_active)
    .sort((a, b) => a.display_order - b.display_order)

  const sectionMap: Record<string, React.ReactNode> = {
    nav: <Navigation agent={agent} colors={colors} />,
    hero: <HeroSection agent={agent} hero={hero} colors={colors} />,
    properties_sale: <PropertiesSection properties={properties} colors={colors} operationType="sale" title="Propiedades en Venta" />,
    properties_rent_long: <PropertiesSection properties={properties} colors={colors} operationType="rent_long" title="Alquileres de Larga Temporada" />,
    properties_rent_vacation: <PropertiesSection properties={properties} colors={colors} operationType="rent_vacation" title="Alquileres Vacacionales" />,
    about: <AboutSection agent={agent} colors={colors} />,
    team: <TeamSection team={team} colors={colors} />,
    stats: <StatsSection agent={agent} colors={colors} />,
    testimonials: <TestimonialsSection testimonials={testimonials} colors={colors} />,
    services: <ServicesSection services={services} colors={colors} />,
    zones: <ZonesSection zones={zones} colors={colors} />,
    contact_form: <ContactFormSection agent={agent} colors={colors} />,
  }

  return (
    <div className="min-h-screen bg-white">
      {activeSections.map((section) => (
        <div key={section.section_key}>
          {sectionMap[section.section_key] || null}
        </div>
      ))}
      <Footer colors={colors} />
    </div>
  )
}
