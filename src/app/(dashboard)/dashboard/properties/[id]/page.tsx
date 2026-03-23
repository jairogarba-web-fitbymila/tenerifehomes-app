'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  ImagePlus,
  X,
  MapPin,
  Bed,
  Bath,
  Ruler,
  GripVertical,
  Star,
  Check,
  ExternalLink,
  Upload,
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

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [agentSlug, setAgentSlug] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [propertyType, setPropertyType] = useState('apartment')
  const [operationType, setOperationType] = useState('sale')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [sizeM2, setSizeM2] = useState('')
  const [badge, setBadge] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [imageUrlInput, setImageUrlInput] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setProperty(data)
        setTitle(data.title || '')
        setDescription(data.description || '')
        setPropertyType(data.property_type || 'apartment')
        setOperationType(data.operation_type || 'sale')
        setPrice(data.price?.toString() || '')
        setLocation(data.location || '')
        setBedrooms(data.bedrooms?.toString() || '')
        setBathrooms(data.bathrooms?.toString() || '')
        setSizeM2(data.size_m2?.toString() || '')
        setBadge(data.badge || '')
        setIsActive(data.is_active ?? false)
        setIsFeatured(data.is_featured ?? false)
        setFeatures(data.features || [])
        setImages(data.images || [])
      }

      // Get agent slug for preview link
      if (user) {
        const { data: agent } = await supabase
          .from('agent_profiles')
          .select('slug')
          .eq('id', user.id)
          .single()
        if (agent) setAgentSlug(agent.slug)
      }

      setLoading(false)
    }
    load()
  }, [id])

  function toggleFeature(feature: string) {
    setFeatures(prev =>
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

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const newImages = [...images]
    const [moved] = newImages.splice(from, 1)
    newImages.splice(to, 0, moved)
    setImages(newImages)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()

    const slug = title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 100)

    const { error } = await supabase
      .from('properties')
      .update({
        title,
        slug: slug + '-' + id.slice(0, 6),
        description: description || null,
        property_type: propertyType,
        operation_type: operationType,
        price: parseFloat(price) || 0,
        location: location || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        size_m2: sizeM2 ? parseInt(sizeM2) : null,
        badge: badge || null,
        is_active: isActive,
        is_featured: isFeatured,
        features: features.length > 0 ? features : null,
        images: images.length > 0 ? images : null,
      })
      .eq('id', id)

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  async function toggleActive() {
    const newActive = !isActive
    setIsActive(newActive)
    const supabase = createClient()
    await supabase.from('properties').update({ is_active: newActive }).eq('id', id)
  }

  async function handleDelete() {
    if (!confirm('¿Seguro que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', id)
    router.push('/dashboard/properties')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Propiedad no encontrada</h2>
        <Link href="/dashboard/properties" className="text-brand-600 hover:underline mt-2 inline-block">
          Volver a propiedades
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{title || 'Sin título'}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {location && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {location}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {isActive ? 'Activa' : 'Borrador'}
              </span>
              {isFeatured && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-100 text-brand-700">
                  Destacada
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {agentSlug && (
            <Link
              href={`/agent/${agentSlug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 border border-gray-200 rounded-lg"
            >
              <ExternalLink className="w-4 h-4" /> Ver web
            </Link>
          )}
          <button
            onClick={toggleActive}
            className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors ${
              isActive
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            {isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isActive ? 'Ocultar' : 'Publicar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="card p-3 text-center">
          <div className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(parseFloat(price) || 0)}
          </div>
          <div className="text-xs text-gray-500">{operationType === 'sale' ? 'Venta' : operationType === 'rent_long' ? 'Alquiler/mes' : 'Vacacional/noche'}</div>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Bed className="w-4 h-4 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">{bedrooms || '—'}</span>
          </div>
          <div className="text-xs text-gray-500">Habitaciones</div>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Bath className="w-4 h-4 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">{bathrooms || '—'}</span>
          </div>
          <div className="text-xs text-gray-500">Baños</div>
        </div>
        <div className="card p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <Ruler className="w-4 h-4 text-gray-400" />
            <span className="text-lg font-bold text-gray-900">{sizeM2 || '—'}</span>
          </div>
          <div className="text-xs text-gray-500">m²</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ========== IMAGES ========== */}
        <section className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Fotografías ({images.length})</h2>
            <div className="flex items-center gap-2">
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
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden group bg-gray-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {/* Overlay with controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {i > 0 && (
                      <button
                        onClick={() => moveImage(i, i - 1)}
                        className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white text-xs font-bold"
                        title="Mover antes"
                      >
                        ←
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(i)}
                      className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                      title="Eliminar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    {i < images.length - 1 && (
                      <button
                        onClick={() => moveImage(i, i + 1)}
                        className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white text-xs font-bold"
                        title="Mover después"
                      >
                        →
                      </button>
                    )}
                  </div>
                  {/* Principal badge */}
                  {i === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 bg-brand-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                      Principal
                    </span>
                  )}
                </div>
              ))}
              {/* Add photo card */}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Ej: Villa con piscina en Costa Adeje"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[120px]"
              rows={5}
              placeholder="Describe la propiedad en detalle..."
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input-field">
                {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operación</label>
              <select value={operationType} onChange={(e) => setOperationType(e.target.value)} className="input-field">
                {operationTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <select value={badge} onChange={(e) => setBadge(e.target.value)} className="input-field">
                {badgeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="Costa Adeje, Los Cristianos..."
              />
            </div>
          </div>
        </section>

        {/* ========== DETAILS ========== */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Características</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (m²)</label>
              <input
                type="number"
                value={sizeM2}
                onChange={(e) => setSizeM2(e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" /> Propiedad destacada
              </span>
            </label>
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
                  features.includes(feature)
                    ? 'bg-brand-50 border-brand-300 text-brand-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {features.includes(feature) && <Check className="w-3 h-3 inline mr-1" />}
                {feature}
              </button>
            ))}
          </div>
        </section>

        {/* ========== DANGER ZONE ========== */}
        <section className="card p-6 border-red-200">
          <h2 className="font-semibold text-red-600">Zona peligrosa</h2>
          <p className="text-sm text-gray-500 mt-1">Eliminar la propiedad es irreversible.</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Eliminar propiedad
          </button>
        </section>
      </div>

      {/* Floating save bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 flex items-center justify-between z-50 md:left-64">
        <div className="text-sm text-gray-500">
          {saved && <span className="text-green-600 font-medium flex items-center gap-1"><Check className="w-4 h-4" /> Cambios guardados</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleActive}
            className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
              isActive
                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                : 'border-green-200 text-green-700 hover:bg-green-50'
            }`}
          >
            {isActive ? 'Ocultar' : 'Publicar'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
