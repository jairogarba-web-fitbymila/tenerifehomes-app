'use client'

import { useState, useEffect } from 'react'
import { Globe, Search, Camera, Share2, Users, Languages, TrendingUp, FileSignature, MessageSquare, Mail, BarChart3, Building2, Palette, Check } from 'lucide-react'
import Link from 'next/link'

const MODULE_ICONS: Record<string, any> = {
  dominio: Globe, seo: Search, fotografia_ia: Camera, portales: Share2,
  crm: Users, multiidioma: Languages, valoracion: TrendingUp,
  firma_digital: FileSignature, chatbot: MessageSquare, email_marketing: Mail,
  analytics: BarChart3, propiedades_ilimitadas: Building2, plantillas_premium: Palette,
}

interface ModuleDef {
  slug: string; name: string; description: string;
  price_monthly: number; features: string[]; sort_order: number;
}

const BASE_FEATURES = [
  'Web profesional personalizable',
  'Hasta 20 propiedades',
  '1 plantilla incluida',
  'Panel de gestión completo',
  'Soporte por email',
  'SSL y hosting incluido',
  'Subdominio *.habibook.com',
]

export default function PricingPage() {
  const [modules, setModules] = useState<ModuleDef[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(d => { setModules(d.modules || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggle = (slug: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  const total = 19 + modules.filter(m => selected.has(m.slug)).reduce((s, m) => s + Number(m.price_monthly), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0a1628] text-white px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">HabiBook</Link>
        <Link href="/register" className="bg-[#c9a96e] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#b8944d] transition">Empieza ahora</Link>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0a1628] mb-4">Plan Base + Módulos a tu medida</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">Empieza con lo esencial y añade solo lo que necesitas. Sin permanencia.</p>
      </section>

      {/* Base Plan Card */}
      <section className="max-w-xl mx-auto px-4 mb-16">
        <div className="bg-[#0a1628] text-white rounded-2xl p-8 text-center shadow-xl">
          <span className="inline-block bg-[#c9a96e]/20 text-[#c9a96e] text-sm font-semibold px-4 py-1 rounded-full mb-4">PLAN BASE</span>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-bold">19€</span>
            <span className="text-gray-400">/mes</span>
          </div>
          <p className="text-gray-400 mb-6">Todo lo que necesitas para empezar</p>
          <ul className="text-left space-y-3 mb-8">
            {BASE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-2"><Check className="w-5 h-5 text-[#c9a96e] flex-shrink-0" /><span>{f}</span></li>
            ))}
          </ul>
          <Link href="/register" className="block w-full bg-[#c9a96e] text-white py-3 rounded-xl font-semibold hover:bg-[#b8944d] transition text-center">Empezar ahora</Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <h2 className="text-3xl font-bold text-center text-[#0a1628] mb-2">Módulos disponibles</h2>
        <p className="text-gray-500 text-center mb-10">Selecciona módulos para calcular tu precio mensual</p>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando módulos...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(m => {
              const Icon = MODULE_ICONS[m.slug] || Globe
              const isSelected = selected.has(m.slug)
              return (
                <button key={m.slug} onClick={() => toggle(m.slug)}
                  className={`text-left p-6 rounded-xl border-2 transition-all ${isSelected ? 'border-[#c9a96e] bg-[#c9a96e]/5 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-[#c9a96e]' : 'text-gray-400'}`} />
                    <span className="font-bold text-lg">{m.price_monthly}€<span className="text-sm font-normal text-gray-400">/mes</span></span>
                  </div>
                  <h3 className="font-bold text-[#0a1628] mb-1">{m.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{m.description}</p>
                  {Array.isArray(m.features) && m.features.length > 0 && (
                    <ul className="space-y-1">
                      {m.features.map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-[#c9a96e]" />{f}</li>
                      ))}
                    </ul>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* Sticky Calculator Bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628] text-white py-4 px-6 shadow-2xl z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-gray-400">Plan Base 19€ + {selected.size} módulo{selected.size > 1 ? 's' : ''}</span>
              <div className="text-3xl font-bold">{total.toFixed(2)}€<span className="text-sm font-normal text-gray-400">/mes</span></div>
            </div>
            <Link href="/register" className="bg-[#c9a96e] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b8944d] transition">
              Empezar ahora
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 HabiBook. Todos los derechos reservados.
      </footer>
    </div>
  )
}