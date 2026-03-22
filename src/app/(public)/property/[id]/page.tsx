import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  Bed,
  Bath,
  Ruler,
  Calendar,
  Zap,
  Phone,
  Mail,
  ArrowLeft,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getProperty(id: string) {
  const { data } = await supabase
    .from('properties')
    .select(`
      *,
      agents!inner(id, name, email, phone, slug, agency_name, photo_url, city)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single()
  return data
}

function formatPrice(price: number, operationType: string) {
  const formatted = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  return operationType === 'rent' ? `${formatted}/mes` : formatted
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id)
  if (!property) notFound()

  const agent = property.agents

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href={`/agent/${agent.slug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al agente
          </Link>
          <span className="text-brand-600 font-display font-bold text-lg">TenerifeHomes</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="rounded-xl overflow-hidden bg-gray-100">
              {property.main_image_url ? (
                <img src={property.main_image_url} alt={property.title} className="w-full aspect-[16/10] object-cover" />
              ) : (
                <div className="w-full aspect-[16/10] flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Gallery thumbnails */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((url: string, i: number) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Title & price */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                <span className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                  {property.operation_type === 'sale' ? 'Venta' : property.operation_type === 'rent' ? 'Alquiler' : property.operation_type}
                </span>
              </div>
              <p className="text-3xl font-bold text-brand-600 mt-3">
                {formatPrice(property.price, property.operation_type)}
              </p>
              {property.city && (
                <p className="text-gray-500 flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" /> {property.city}{property.address ? `, ${property.address}` : ''}
                </p>
              )}
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {property.bedrooms != null && (
                <div className="card p-4 text-center">
                  <Bed className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-lg font-bold text-gray-900 mt-1">{property.bedrooms}</p>
                  <p className="text-xs text-gray-500">Habitaciones</p>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="card p-4 text-center">
                  <Bath className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-lg font-bold text-gray-900 mt-1">{property.bathrooms}</p>
                  <p className="text-xs text-gray-500">Baños</p>
                </div>
              )}
              {property.area_built != null && (
                <div className="card p-4 text-center">
                  <Ruler className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-lg font-bold text-gray-900 mt-1">{property.area_built}</p>
                  <p className="text-xs text-gray-500">m² construidos</p>
                </div>
              )}
              {property.year_built != null && (
                <div className="card p-4 text-center">
                  <Calendar className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-lg font-bold text-gray-900 mt-1">{property.year_built}</p>
                  <p className="text-xs text-gray-500">Año</p>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 text-lg mb-3">Descripción</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</div>
              </div>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="card p-6">
                <h2 className="font-semibold text-gray-900 text-lg mb-3">Características</h2>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f: string) => (
                    <span key={f} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Details table */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Detalles</h2>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Tipo</dt>
                  <dd className="text-gray-900 font-medium capitalize">{property.property_type.replace('_', ' ')}</dd>
                </div>
                {property.area_plot != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Parcela</dt>
                    <dd className="text-gray-900 font-medium">{property.area_plot} m²</dd>
                  </div>
                )}
                {property.floor && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Planta</dt>
                    <dd className="text-gray-900 font-medium">{property.floor}</dd>
                  </div>
                )}
                {property.energy_rating && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cert. energético</dt>
                    <dd className="text-gray-900 font-medium flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> {property.energy_rating}
                    </dd>
                  </div>
                )}
                {property.postal_code && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">C.P.</dt>
                    <dd className="text-gray-900 font-medium">{property.postal_code}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Referencia</dt>
                  <dd className="text-gray-900 font-medium font-mono text-xs">{property.id.slice(0, 8)}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Sidebar — Agent card + contact */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
                  {agent.photo_url ? (
                    <img src={agent.photo_url} alt={agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-brand-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{agent.name}</p>
                  {agent.agency_name && <p className="text-xs text-gray-500">{agent.agency_name}</p>}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600">
                    <Phone className="w-4 h-4" /> {agent.phone}
                  </a>
                )}
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600">
                  <Mail className="w-4 h-4" /> {agent.email}
                </a>
              </div>

              <form className="space-y-3">
                <input type="text" placeholder="Tu nombre" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                <input type="email" placeholder="Tu email" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                <input type="tel" placeholder="Tu teléfono" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                <textarea placeholder={`Me interesa "${property.title}"...`} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none" />
                <button type="submit" className="w-full bg-brand-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition-colors text-sm">
                  Enviar consulta
                </button>
              </form>

              <Link href={`/agent/${agent.slug}`} className="block text-center text-sm text-brand-600 hover:underline mt-4">
                Ver todas las propiedades de {agent.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/60 text-sm text-center py-6 mt-12">
        <p>Powered by <span className="text-white font-medium">TenerifeHomes</span></p>
      </footer>
    </div>
  )
}
