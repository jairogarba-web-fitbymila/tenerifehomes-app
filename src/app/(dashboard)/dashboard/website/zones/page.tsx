'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Save, Loader2, MapPin, Check,
} from 'lucide-react'

interface Zone {
  id: string
  agent_id: string
  name: string
  description: string | null
  image_url: string | null
}

export default function ZonesEditor() {
  const [items, setItems] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('zones')
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

  async function saveItem(item: Zone) {
    setSaving(item.id)
    const supabase = createClient()
    await supabase.from('zones').update({
      name: item.name,
      description: item.description,
      image_url: item.image_url,
    }).eq('id', item.id)
    setSaving(null)
    setSaved(item.id)
    setTimeout(() => setSaved(null), 2000)
  }

  async function addItem() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('zones').insert({
      agent_id: user.id,
      name: 'Nueva zona',
      description: 'Describe esta zona y qué la hace especial...',
    }).select().single()
    if (data) setItems(prev => [data, ...prev])
  }

  async function deleteItem(id: string) {
    if (!confirm('¿Eliminar esta zona?')) return
    const supabase = createClient()
    await supabase.from('zones').delete().eq('id', id)
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
            <h1 className="text-xl font-bold text-gray-900">Zonas</h1>
            <p className="text-sm text-gray-500">{items.length} zonas</p>
          </div>
        </div>
        <button onClick={addItem} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Añadir
        </button>
      </div>

      {/* Technical guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
        <p className="text-xs text-blue-800">
          <strong>Cómo funciona:</strong> Crea zonas para mostrar las áreas donde operas. Cada zona aparece como una tarjeta con imagen en tu web.
          Edita el nombre y descripción, añade una URL de imagen representativa (800×450px, 16:9), y pulsa "Guardar" en cada zona.
          Puedes reordenar las zonas desde el editor de secciones en <strong>Mi web</strong>.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-3">Aún no tienes zonas configuradas</p>
          <button onClick={addItem} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Crear primera zona
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-5 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la zona</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={e => updateItem(item.id, 'name', e.target.value)}
                  className="input-field"
                  maxLength={60}
                  placeholder="Costa Adeje, Los Cristianos..."
                />
                <p className="text-xs text-gray-400 mt-1">{item.name.length}/60 caracteres · Nombre corto que identifique la zona</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={item.description || ''}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  className="input-field min-h-[60px]"
                  rows={2}
                  maxLength={300}
                  placeholder="Qué hace especial esta zona..."
                />
                <p className="text-xs text-gray-400 mt-1">{(item.description || '').length}/300 caracteres · Destaca atractivos: playas, restaurantes, accesos...</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
                <input
                  type="url"
                  value={item.image_url || ''}
                  onChange={e => updateItem(item.id, 'image_url', e.target.value)}
                  className="input-field text-sm"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-400 mt-1">Recomendado: 800×450px, formato 16:9 · JPG/PNG/WebP · Paisaje representativo de la zona</p>
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
