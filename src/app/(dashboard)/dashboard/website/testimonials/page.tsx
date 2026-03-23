'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Save, Loader2, Star, MessageCircle, Check,
} from 'lucide-react'

interface Testimonial {
  id: string
  agent_id: string
  quote: string
  client_name: string
  client_location: string | null
  rating: number
}

export default function TestimonialsEditor() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })
      if (data) setItems(data)
      setLoading(false)
    }
    load()
  }, [])

  function updateItem(id: string, field: string, value: any) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  async function saveItem(item: Testimonial) {
    setSaving(item.id)
    const supabase = createClient()
    await supabase.from('testimonials').update({
      quote: item.quote,
      client_name: item.client_name,
      client_location: item.client_location,
      rating: item.rating,
    }).eq('id', item.id)
    setSaving(null)
    setSaved(item.id)
    setTimeout(() => setSaved(null), 2000)
  }

  async function addItem() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase.from('testimonials').insert({
      agent_id: user.id,
      quote: 'Escribe aquí el testimonio del cliente...',
      client_name: 'Nombre del cliente',
      client_location: 'Ciudad',
      rating: 5,
    }).select().single()
    if (data) setItems(prev => [data, ...prev])
  }

  async function deleteItem(id: string) {
    if (!confirm('¿Eliminar este testimonio?')) return
    const supabase = createClient()
    await supabase.from('testimonials').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/website" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Testimonios</h1>
            <p className="text-sm text-gray-500">{items.length} testimonios</p>
          </div>
        </div>
        <button onClick={addItem} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {/* Technical guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
        <p className="text-xs text-blue-800">
          <strong>Cómo funciona:</strong> Añade opiniones reales de tus clientes. Los testimonios generan confianza y se muestran como tarjetas en tu web.
          Escribe el testimonio (máx. 500 caracteres), nombre del cliente, ubicación y selecciona una valoración de 1 a 5 estrellas.
          Recomendación: 3-6 testimonios variados con detalles concretos de la experiencia.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageCircle className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-3">Aún no tienes testimonios</p>
          <button onClick={addItem} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Crear primer testimonio
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-5 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonio</label>
                <textarea
                  value={item.quote}
                  onChange={e => updateItem(item.id, 'quote', e.target.value)}
                  className="input-field min-h-[80px]"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{item.quote.length}/500 caracteres · Incluye detalles concretos: tipo de propiedad, zona, experiencia con el agente</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={item.client_name}
                    onChange={e => updateItem(item.id, 'client_name', e.target.value)}
                    className="input-field"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-400 mt-1">Nombre completo o iniciales del cliente</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={item.client_location || ''}
                    onChange={e => updateItem(item.id, 'client_location', e.target.value)}
                    className="input-field"
                    maxLength={40}
                  />
                  <p className="text-xs text-gray-400 mt-1">Ciudad o país del cliente</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valoración</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateItem(item.id, 'rating', star)}
                      className="p-0.5"
                    >
                      <Star className={`w-5 h-5 ${star <= item.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button onClick={() => deleteItem(item.id)} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
                <button
                  onClick={() => saveItem(item)}
                  disabled={saving === item.id}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  {saving === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                   saved === item.id ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                  {saved === item.id ? 'Guardado' : 'Guardar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
