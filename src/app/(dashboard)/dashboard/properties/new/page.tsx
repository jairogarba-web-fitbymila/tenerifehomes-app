'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  ImagePlus,
} from 'lucide-react'

interface Region {
  slug: string
  name: string
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa / Chalet' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Ático' },
  { value: 'studio', label: 'Estudio' },
  { value: 'duplex', label: 'Dúplex' },
  { value: 'townhouse', label: 'Adosado' },
  { value: 'finca', label: 'Finca rústica' },
  { value: 'commercial', label: 'Local comercial' },
  { value: 'land', label: 'Terreno' },
  { value: 'garage', label: 'Garaje' },
  { value: 'storage', label: 'Trastero' },
  { value: 'office', label: 'Oficina' },
  { value: 'building', label: 'Edificio' },
]

const operationTypes = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent', label: 'Alquiler' },
  { value: 'rent_to_buy', label: 'Alquiler con opción a compra' },
  { value: 'transfer', label: 'Traspaso' },
]

const featuresList = [
  'Piscina', 'Terraza', 'Jardín', 'Garaje', 'Trastero', 'Ascensor',
  'Aire acondicionado', 'Calefacción', 'Amueblado', 'Vistas al mar',
  'Balcón', 'Cocina equipada', 'Armarios empotrados', 'Lavadero',
  'Seguridad 24h', 'Gimnasio', 'Zona infantil', 'Barbacoa',
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [regions, setRegions] = useState<Region[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    operation_type: 'sale',
    price: '',
    price_period: 'total',
    region_slug: '',
    city: '',
    address: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    bedrooms: '',
    bathrooms: '',
    area_built: '',
    area_plot: '',
    floor: '',
    year_built: '',
    energy_rating: '',
    status: 'draft',
  })

  useEffect(() => {
    async function loadRegions() {
      const supabase = createClient()
      const { data } = await supabase
        .from('regions')
        .select('slug, name')
        .eq('is_active', true)
        .order('name')
      if (data) setRegions(data)
    }
    loadRegions()
  }, [])

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 30) {
      alert('Máximo 30 imágenes por propiedad')
      return
    }
    setImages((prev) => [...prev, ...files])
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newPreviews])
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  function toggleFeature(feature: string) {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Upload images
      const imageUrls: string[] = []
      for (const img of images) {
        const ext = img.name.split('.').pop()
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(path, img, { cacheControl: '31536000' })
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(path)
          imageUrls.push(urlData.publicUrl)
        }
      }

      // Create property
      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          agent_id: user.id,
          title: form.title,
          description: form.description || null,
          property_type: form.property_type,
          operation_type: form.operation_type,
          price: parseFloat(form.price) || 0,
          price_period: form.operation_type === 'rent' ? 'month' : 'total',
          region_slug: form.region_slug || null,
          city: form.city || null,
          address: form.address || null,
          postal_code: form.postal_code || null,
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
          bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
          area_built: form.area_built ? parseFloat(form.area_built) : null,
          area_plot: form.area_plot ? parseFloat(form.area_plot) : null,
          floor: form.floor || null,
          year_built: form.year_built ? parseInt(form.year_built) : null,
          energy_rating: form.energy_rating || null,
          status: form.status,
          features: selectedFeatures.length > 0 ? selectedFeatures : null,
          main_image_url: imageUrls[0] || null,
          images: imageUrls.length > 0 ? imageUrls : null,
        })
        .select('id')
        .single()

      if (error) throw error

      router.push(`/dashboard/properties/${property.id}`)
    } catch (err: any) {
      alert(err.message || 'Error al crear la propiedad')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva propiedad</h1>
          <p className="text-sm text-gray-500 mt-0.5">Rellena los datos de la propiedad</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Información básica</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" placeholder="Ej: Apartamento con vistas al mar en Los Cristianos" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad *</label>
              <select value={form.property_type} onChange={(e) => update('property_type', e.target.value)} className="input-field">
                {propertyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operación *</label>
              <select value={form.operation_type} onChange={(e) => update('operation_type', e.target.value)} className="input-field">
                {operationTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€) *</label>
              <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" placeholder="250000" min="0" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="input-field">
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field min-h-[120px]" placeholder="Describe la propiedad en detalle..." rows={5} />
          </div>
        </section>

        {/* Location */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Ubicación</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
              <select value={form.region_slug} onChange={(e) => update('region_slug', e.target.value)} className="input-field">
                <option value="">Seleccionar región</option>
                {regions.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad / Municipio</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" placeholder="Los Cristianos" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" placeholder="Calle, número, piso..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
              <input type="text" value={form.postal_code} onChange={(e) => update('postal_code', e.target.value)} className="input-field" placeholder="38650" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
              <input type="number" value={form.latitude} onChange={(e) => update('latitude', e.target.value)} className="input-field" placeholder="28.0520" step="any" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
              <input type="number" value={form.longitude} onChange={(e) => update('longitude', e.target.value)} className="input-field" placeholder="-16.7150" step="any" />
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 text-lg">Características</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input type="number" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sup. construida (m²)</label>
              <input type="number" value={form.area_built} onChange={(e) => update('area_built', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sup. parcela (m²)</label>
              <input type="number" value={form.area_plot} onChange={(e) => update('area_plot', e.target.value)} className="input-field" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Planta</label>
              <input type="text" value={form.floor} onChange={(e) => update('floor', e.target.value)} className="input-field" placeholder="3ª" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año construcción</label>
              <input type="number" value={form.year_built} onChange={(e) => update('year_built', e.target.value)} className="input-field" placeholder="2005" min="1800" max="2030" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cert. energético</label>
              <select value={form.energy_rating} onChange={(e) => update('energy_rating', e.target.value)} className="input-field">
                <option value="">Sin especificar</option>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'En trámite', 'Exento'].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Extras y equipamiento</h2>
          <div className="flex flex-wrap gap-2">
            {featuresList.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedFeatures.includes(feature)
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 text-lg">Fotografías</h2>
          <p className="text-sm text-gray-500">Hasta 30 imágenes. La primera será la imagen principal.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded">Principal</span>
                )}
              </div>
            ))}

            {images.length < 30 && (
              <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <ImagePlus className="w-8 h-8 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Añadir fotos</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-between pb-8">
          <Link href="/dashboard/properties" className="btn-secondary">
            Cancelar
          </Link>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              onClick={() => update('status', 'draft')}
              className="btn-secondary flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Guardar borrador
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={() => update('status', 'published')}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Publicar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
