'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Loader2,
  Eye,
  Trash2,
  Globe,
  ImagePlus,
  X,
  MapPin,
  Bed,
  Bath,
  Ruler,
} from 'lucide-react'

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [property, setProperty] = useState<any>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setProperty(data)
        setForm(data)
      }
      setLoading(false)
    }
    load()
  }, [id])

  function update(field: string, value: any) {
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('properties')
      .update({
        title: form.title,
        description: form.description,
        property_type: form.property_type,
        operation_type: form.operation_type,
        price: parseFloat(form.price) || 0,
        region_slug: form.region_slug || null,
        city: form.city || null,
        address: form.address || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        area_built: form.area_built ? parseFloat(form.area_built) : null,
        area_plot: form.area_plot ? parseFloat(form.area_plot) : null,
        status: form.status,
        features: form.features,
        energy_rating: form.energy_rating || null,
      })
      .eq('id', id)

    if (error) {
      alert('Error al guardar: ' + error.message)
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!confirm('¿Seguro que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) return
    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', id)
    router.push('/dashboard/properties')
  }

  async function toggleStatus() {
    const newStatus = form.status === 'published' ? 'draft' : 'published'
    update('status', newStatus)
    const supabase = createClient()
    await supabase.from('properties').update({ status: newStatus }).eq('id', id)
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/properties" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              {form.city && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {form.city}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                form.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {form.status === 'published' ? 'Publicada' : 'Borrador'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleStatus} className="btn-secondary text-sm flex items-center gap-1.5">
            {form.status === 'published' ? <Eye className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {form.status === 'published' ? 'Despublicar' : 'Publicar'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm flex items-center gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(form.price || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">{form.operation_type === 'sale' ? 'Venta' : 'Alquiler'}</div>
        </div>
        {form.bedrooms != null && (
          <div className="card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Bed className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{form.bedrooms}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Habitaciones</div>
          </div>
        )}
        {form.bathrooms != null && (
          <div className="card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Bath className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{form.bathrooms}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Baños</div>
          </div>
        )}
        {form.area_built != null && (
          <div className="card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Ruler className="w-5 h-5 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900">{form.area_built}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">m² construidos</div>
          </div>
        )}
      </div>

      {/* Editable fields */}
      <div className="space-y-6">
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Información básica</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" value={form.title || ''} onChange={(e) => update('title', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.description || ''} onChange={(e) => update('description', e.target.value)} className="input-field min-h-[120px]" rows={5} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
              <input type="number" value={form.price || ''} onChange={(e) => update('price', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
              <input type="text" value={form.city || ''} onChange={(e) => update('city', e.target.value)} className="input-field" />
            </div>
          </div>
        </section>

        {/* Images gallery */}
        {form.images && form.images.length > 0 && (
          <section className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Fotografías ({form.images.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {form.images.map((url: string, i: number) => (
                <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Danger zone */}
        <section className="card p-6 border-red-200">
          <h2 className="font-semibold text-red-600">Zona peligrosa</h2>
          <p className="text-sm text-gray-500 mt-1">Eliminar la propiedad es irreversible.</p>
          <button onClick={handleDelete} className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
            <Trash2 className="w-4 h-4" /> Eliminar propiedad
          </button>
        </section>
      </div>
    </div>
  )
}
