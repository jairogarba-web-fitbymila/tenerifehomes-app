import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Bed,
  Bath,
  Ruler,
  Search,
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getAgent(slug: string) {
  const { data } = await supabase
    .from('agents')
    .select('id, name, email, phone, slug, bio, agency_name, website, city, logo_url, photo_url, template_id, preferred_lang')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  return data
}

async function getProperties(agentId: string) {
  const { data } = await supabase
    .from('properties')
    .select('id, title, price, operation_type, property_type, bedrooms, bathrooms, area_built, city, main_image_url, slug')
    .eq('agent_id', agentId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50)
  return data || []
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

export default async function AgentPublicPage({ params }: { params: { slug: string } }) {
  const agent = await getAgent(params.slug)
  if (!agent) notFound()

  const properties = await getProperties(agent.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {agent.logo_url ? (
              <img src={agent.logo_url} alt="" className="h-10 w-auto" />
            ) : (
              <span className="text-brand-600 font-display text-xl font-bold">
                {agent.agency_name || agent.name}
              </span>
            )}
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#propiedades" className="text-gray-600 hover:text-gray-900">Propiedades</a>
            <a href="#contacto" className="text-gray-600 hover:text-gray-900">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero / Agent info */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {agent.photo_url ? (
                <img src={agent.photo_url} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white/60">
                  {agent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold">{agent.name}</h1>
              {agent.agency_name && (
                <p className="text-white/70 text-lg mt-1">{agent.agency_name}</p>
              )}
              {agent.bio && (
                <p className="text-white/60 mt-3 max-w-2xl leading-relaxed">{agent.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/70">
                {agent.city && (
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {agent.city}</span>
                )}
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-1 hover:text-white"><Phone className="w-4 h-4" /> {agent.phone}</a>
                )}
                <a href={`mailto:${agent.email}`} className="flex items-center gap-1 hover:text-white"><Mail className="w-4 h-4" /> {agent.email}</a>
                {agent.website && (
                  <a href={agent.website} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-white"><Globe className="w-4 h-4" /> Web</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties */}
      <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Propiedades ({properties.length})</h2>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="mt-3 text-gray-500">Este agente aún no tiene propiedades publicadas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <Link
                key={prop.id}
                href={`/property/${prop.id}`}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  {prop.main_image_url ? (
                    <img src={prop.main_image_url} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{prop.title}</h3>
                    <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                      {prop.operation_type === 'sale' ? 'Venta' : 'Alquiler'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-brand-600 mt-2">{formatPrice(prop.price)}</p>
                  {prop.city && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {prop.city}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                    {prop.bedrooms != null && (
                      <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {prop.bedrooms}</span>
                    )}
                    {prop.bathrooms != null && (
                      <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {prop.bathrooms}</span>
                    )}
                    {prop.area_built != null && (
                      <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {prop.area_built} m²</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section id="contacto" className="bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Contactar con {agent.name}</h2>
          <form className="space-y-4" action={`/api/leads`} method="POST">
            <input type="hidden" name="agent_id" value={agent.id} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" name="name" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" name="phone" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea name="message" rows={4} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="Me interesa..." />
            </div>
            <button type="submit" className="w-full bg-brand-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors">
              Enviar mensaje
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/60 text-sm text-center py-6">
        <p>Powered by <span className="text-white font-medium">TenerifeHomes</span></p>
      </footer>
    </div>
  )
}
