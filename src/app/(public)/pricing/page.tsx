'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Star, Globe, Search, Camera, Share2, Users, Languages, TrendingUp, FileSignature, MessageSquare, Mail, BarChart3, Building2, Palette } from 'lucide-react'

const BASE_PLAN = {
  name: 'Plan Base HabiBook',
  price: 19,
  features: [
    'Web profesional personalizable',
    'Hasta 20 propiedades',
    '1 plantilla incluida',
    'Panel de gesti\u00f3n completo',
    'Soporte por email',
    'SSL y hosting incluido',
    'Subdominio *.habibook.com',
  ],
}

interface Module { slug: string; name: string; description: string; price_monthly: number; features: string[] }

const ICONS: Record<string, any> = { dominio: Globe, seo: Search, fotografia_ia: Camera, portales: Share2, crm: Users, multiidioma: Languages, valoracion: TrendingUp, firma_digital: FileSignature, chatbot: MessageSquare, email_marketing: Mail, analytics: BarChart3, propiedades_ilimitadas: Building2, plantillas_premium: Palette }

export default function PricingPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => { setModules(d.modules || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const toggle = (slug: string) => setSelected(prev => { const n = new Set(prev); n.has(slug) ? n.delete(slug) : n.add(slug); return n })
  const total = BASE_PLAN.price + modules.filter(m => selected.has(m.slug)).reduce((s, m) => s + m.price_monthly, 0)

  return (
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-[#061225] py-4'>
        <div className='max-w-6xl mx-auto px-6 flex justify-between items-center'>
          <Link href='/' className='text-white font-bold text-xl'>HabiBook</Link>
          <Link href='/register' className='bg-[#c8a45e] text-[#061225] px-6 py-2 rounded-lg font-semibold hover:bg-[#b8944e] transition'>Empieza gratis</Link>
        </div>
      </header>

      <section className='text-center py-16 px-6'>
        <h1 className='text-4xl md:text-5xl font-extrabold text-[#061225] mb-4'>Plan Base + M\u00f3dulos a tu medida</h1>
        <p className='text-lg text-gray-500 max-w-xl mx-auto'>Empieza con lo esencial y a\u00f1ade solo lo que necesitas. Sin permanencia.</p>
      </section>

      <section className='max-w-lg mx-auto px-6 pb-12'>
        <div className='bg-[#061225] rounded-2xl p-10 text-white text-center'>
          <span className='bg-[#c8a45e] text-[#061225] px-4 py-1 rounded-full font-bold text-sm'>PLAN BASE</span>
          <h2 className='text-5xl font-extrabold mt-4 mb-1'>{BASE_PLAN.price}\u20ac<span className='text-lg font-normal text-gray-400'>/mes</span></h2>
          <p className='text-gray-400 mb-6'>Todo lo que necesitas para empezar</p>
          <div className='text-left max-w-xs mx-auto space-y-2'>
            {BASE_PLAN.features.map((f, i) => (<div key={i} className='flex items-center gap-2'><Check size={16} className='text-[#c8a45e]' /><span className='text-sm'>{f}</span></div>))}
          </div>
          <Link href='/register' className='inline-block mt-6 bg-[#c8a45e] text-[#061225] px-8 py-3 rounded-lg font-bold hover:bg-[#b8944e] transition'>Empezar ahora</Link>
        </div>
      </section>

      <section className='max-w-6xl mx-auto px-6 pb-12'>
        <h2 className='text-3xl font-extrabold text-center text-[#061225] mb-2'>M\u00f3dulos disponibles</h2>
        <p className='text-center text-gray-500 mb-8'>Selecciona m\u00f3dulos para calcular tu precio mensual</p>
        {loading ? <p className='text-center'>Cargando...</p> : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {modules.map(mod => {
              const Icon = ICONS[mod.slug] || Star
              const on = selected.has(mod.slug)
              return (
                <div key={mod.slug} onClick={() => toggle(mod.slug)} className={`bg-white rounded-xl p-6 cursor-pointer border-2 transition-all ${on ? 'border-[#c8a45e] shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className='flex justify-between items-start mb-3'>
                    <div className={`p-2 rounded-lg ${on ? 'bg-[#c8a45e]' : 'bg-gray-100'}`}><Icon size={20} className={on ? 'text-white' : 'text-gray-500'} /></div>
                    <div className='text-xl font-extrabold text-[#061225]'>{mod.price_monthly}\u20ac<span className='text-xs font-normal text-gray-400'>/mes</span></div>
                  </div>
                  <h3 className='font-bold text-[#061225] mb-1'>{mod.name}</h3>
                  <p className='text-xs text-gray-500 mb-3 leading-relaxed'>{mod.description}</p>
                  <div className='space-y-1'>
                    {(mod.features || []).slice(0, 3).map((f: string, i: number) => (<div key={i} className='flex items-center gap-1'><Check size={12} className={on ? 'text-[#c8a45e]' : 'text-gray-400'} /><span className='text-xs text-gray-500'>{f}</span></div>))}
                  </div>
                </div>)
            })}
          </div>)}
      </section>

      {selected.size > 0 && (
        <div className='fixed bottom-0 left-0 right-0 bg-[#061225] border-t-2 border-[#c8a45e] py-4 px-6 flex justify-center items-center gap-6 z-50'>
          <div className='text-white'>
            <span className='text-gray-400'>Plan Base + {selected.size} m\u00f3dulo{selected.size > 1 ? 's' : ''} = </span>
            <span className='text-3xl font-extrabold'>{total.toFixed(2)}\u20ac</span>
            <span className='text-gray-400'>/mes</span>
          </div>
          <Link href='/register' className='bg-[#c8a45e] text-[#061225] px-8 py-3 rounded-lg font-bold'>Empezar ahora</Link>
        </div>)}

      <footer className='text-center py-12 text-gray-400 text-sm'>\u00a9 2026 HabiBook. Todos los derechos reservados.</footer>
    </div>)
}