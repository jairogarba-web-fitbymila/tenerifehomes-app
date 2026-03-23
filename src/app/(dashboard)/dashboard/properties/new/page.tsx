'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  ImagePlus,
  Check,
} from 'lucide-react'

const propertyTypes = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Ático' },
  { value: 'townhouse', label: 'Adosado' },
  { value: 'commercial', label: 'Local comercial' },
  { value: 'land', label: 'Terreno' },
  { value: 'finca', label: 'Finca rústica' },
]

const operationTypes = [
  { value: 'sale', label: 'Venta' },
  { value: 'rent_long', label: 'Alquiler larga temporada' },
  { value: 'rent_vacation', label: 'Alquiler vacacional' },
]

const badgeOptions = [
  { value: '', label: 'Sin badge' },
  { value: 'exclusive', label: 'Exclusiva' },
  { value: 'new', label: 'Nueva' },
  { value: 'reduced', label: 'Rebajada' },
  { value: 'featured', label: 'Destacada' },
  { value: 'investment', label: 'Inversión' },
]

const featuresList = [
  'Piscina', 'Terraza', 'Jardín', 'Garaje', 'Trastero', 'Ascensor',
  'Aire acondicionado', 'Calefacción', 'Amueblado', 'Vistas al mar',
  'Balcón', 'Cocina equipada', 'Armarios empotrados', 'Lavadero',
  'Seguridad 24h', 'Gimnasio', 'Zona infantil', 'Barbacoa',
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 100)
}

export default function NewPropertyPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '',
    description: '',
    property_type: 'apartment',
    operation_type: 'sale',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    size_m2: '',
    badge: '',
  })

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleFeature(feature: string) {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    )
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)

    for (const file of files) {
      if (images.length >= 20) break

      const formData = new FormData()
      formData.append('file', file)
      formData.append('field_type', 'property')

      try {
        const res = await fetch('/api/dashboard/upload', { method: 'POST', body: formData })
        const result = await res.json()
        if (result.url) {
          setImages(prev => [...prev, result.url])
        }
      } catch (err) {
        console.error('Upload error:', err)
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function addImageUrl() {
    const url = imageUrlInput.trim()
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setImages(prev => [...prev, url])
      setImageUrlInput('')
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(isActive: boolean) {
    if (!form.title.trim()) {
      alert('El título es obligatorio')
      return
    }
    setLoading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const slug = slugify(form.title) + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

      const { data: property, error } = await supabase
        .from('properties')
        .insert({
          agent_id: user.id,
          title: form.title.trim(),
          slug,
          description: form.description || null,
          property_type: form.property_type,
          operation_type: form.operation_type,
          price: parseFloat(form.price) || 0,
          location: form.location || null,
          bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
          bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
          size_m2: form.size_m2 ? parseInt(form.size_m2) : null,
          badge: form.badge || null,
          features: selectedFeatures.length > 0 ? selectedFeatures : null,
          images: images.length > 0 ? images : null,
          is_active: isActive,
          is_featured: false,
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
    <div className="max-w-4xl mx-auto pb-12">
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

      <div className="space-y-6">
        {/* ========== IMAGES ========== */}
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Fotografías ({images.length})</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg hover:bg-brand-100 transition-colors"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Subir fotos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              {images.length < 20 && (
                <label
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-400 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <ImagePlus className="w-7 h-7 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Añadir</span>
                </label>
              )}
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-xl p-8 text-center cursor-pointer transition-colors"
            >
              <ImagePlus className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Sube las fotos de la propiedad</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG o WebP · Máximo 20 imágenes</p>
            </div>
          )}

          {/* Add by URL */}
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
              placeholder="Añadir imagen por URL (https://...)"
              className="input-field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={addImageUrl}
              disabled={!imageUrlInput.trim()}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
            >
              Añadir
            </button>
          </div>
        </section>

        {/* ========== BASIC INFO ========== */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Información básica</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="input-field"
              placeholder="Ej: Villa con piscina en Costa Adeje"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="input-field min-h-[120px]"
              rows={5}
              placeholder="Describe la propiedad en detalle..."
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={form.property_type} onChange={(e) => update('property_type', e.target.value)} className="input-field">
                {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operación</label>
              <select value={form.operation_type} onChange={(e) => update('operation_type', e.target.value)} className="input-field">
                {operationTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <select value={form.badge} onChange={(e) => update('badge', e.target.value)} className="input-field">
                {badgeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€) *</label>
              <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" min="0" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className="input-field" placeholder="Costa Adeje, Los Cristianos..." />
            </div>
          </div>
        </section>

        {/* ========== DETAILS ========== */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Características</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input type="number" value={form.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input type="number" value={form.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className="input-field" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
              <input type="number" value={form.size_m2} onChange={(e) => update('size_m2', e.target.value)} className="input-field" min="0" />
            </div>
          </div>
        </section>

        {/* ========== FEATURES ========== */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Extras y equipamiento</h2>
          <div className="flex flex-wrap gap-2">
            {featuresList.map(feature => (
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
                {selectedFeatures.includes(feature) && <Check className="w-3 h-3 inline mr-1" />}
                {feature}
              </button>
            ))}
          </div>
        </section>

        {/* ========== SUBMIT ========== */}
        <div className="flex items-center justify-between pb-8">
          <Link href="/dashboard/properties" className="btn-secondary">
            Cancelar
          </Link>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="btn-secondary flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Guardar borrador
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
