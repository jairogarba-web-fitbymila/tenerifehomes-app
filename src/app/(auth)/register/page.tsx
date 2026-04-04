'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { Loader2, Check } from 'lucide-react'

type TemplateType = 'luxury' | 'mediterranean' | 'corporate' | 'boutique' | 'classic' | 'data' | 'editorial-dark' | 'editorial-light' | 'editorial-agent' | 'editorial-team' | 'editorial-catalog' | 'editorial-fullservice' | 'monolith'

const TEMPLATES: { id: TemplateType; name: string; desc: string; color1: string; color2: string; family?: string }[] = [
  // ── Original 6 ──
  { id: 'luxury', name: 'Luxury', desc: 'Elegancia y exclusividad. Villas premium, alto standing.', color1: '#1A1A1A', color2: '#C9A84C' },
  { id: 'mediterranean', name: 'Mediterranean', desc: 'Cercanía y confianza. Agente familiar, mercado medio.', color1: '#C4652E', color2: '#F5E6D3' },
  { id: 'corporate', name: 'Corporate', desc: 'Agencia profesional con equipo. Imagen corporativa.', color1: '#0B2545', color2: '#4A90D9' },
  { id: 'boutique', name: 'Boutique', desc: 'Selección exclusiva. Fincas, casas con historia.', color1: '#C08B7F', color2: '#8B9D77' },
  { id: 'classic', name: 'Classic', desc: 'Veterano y premiado. Años de experiencia en el mercado.', color1: '#8B6F47', color2: '#FBF7F2' },
  { id: 'data', name: 'Data-Driven', desc: 'Tecnológico y analítico. Dashboards y datos en tiempo real.', color1: '#0F172A', color2: '#06B6D4' },
  // ── Editorial family ──
  { id: 'editorial-dark', name: 'Editorial Dark', desc: 'Inmersivo y dramático. Scroll-snap, navy + dorado.', color1: '#000d22', color2: '#e9c176', family: 'Editorial' },
  { id: 'editorial-light', name: 'Editorial Light', desc: 'Bento grid editorial. Fondo claro, tipografía de revista.', color1: '#f8f9fa', color2: '#000d22', family: 'Editorial' },
  { id: 'editorial-agent', name: 'Editorial Agent', desc: 'Centrado en ti. Hero con retrato, contacto directo.', color1: '#f8f9fa', color2: '#e9c176', family: 'Editorial' },
  { id: 'editorial-team', name: 'Editorial Team', desc: 'Multi-agente. Galería de equipo, propiedades curadas.', color1: '#f8f9fa', color2: '#e9c176', family: 'Editorial' },
  { id: 'editorial-catalog', name: 'Editorial Catalog', desc: 'Marketplace con filtros. Catálogo grande de propiedades.', color1: '#f8f9fa', color2: '#000d22', family: 'Editorial' },
  { id: 'editorial-fullservice', name: 'Editorial Full', desc: 'Multi-sección: vacacional + venta + alquiler largo.', color1: '#f8f9fa', color2: '#e9c176', family: 'Editorial' },
  // ── Monolith ──
  { id: 'monolith', name: 'Monolith', desc: 'Brutalista y premium. Negro + lima, sin redondeos.', color1: '#131313', color2: '#CAF300', family: 'Monolith' },
]

const VALID_IDS = new Set(TEMPLATES.map(t => t.id))

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const preselected = searchParams.get('template') || ''
  const defaultTemplate: TemplateType = VALID_IDS.has(preselected as TemplateType) ? preselected as TemplateType : 'luxury'

  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    business_name: '',
    email: '',
    password: '',
    phone: '',
    template: defaultTemplate,
  })

  // If template changes via URL, update form
  useEffect(() => {
    if (VALID_IDS.has(preselected as TemplateType)) {
      setForm(prev => ({ ...prev, template: preselected as TemplateType }))
    }
  }, [preselected])

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  function goToStep2() {
    if (!form.business_name.trim()) { setError('Escribe el nombre de tu negocio'); return }
    if (!form.email.trim()) { setError('Escribe tu email'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    setStep(2)
    setError('')
  }

  async function handleRegister() {
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          business_type: 'individual',
          zone: 'Tenerife',
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al registrar')
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })

      if (loginError) {
        router.push('/login?registered=true')
        return
      }

      router.push('/dashboard?welcome=true')
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  const selectedTemplate = TEMPLATES.find(t => t.id === form.template)

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-lg">
          <Link href="/" className="text-brand-600 font-display text-2xl font-bold">
            HabiBook
          </Link>

          {step === 1 ? (
            <>
              <h1 className="mt-6 text-3xl font-bold text-gray-900">Crea tu web inmobiliaria</h1>
              <p className="mt-2 text-gray-500">En 2 minutos tendrás tu web profesional lista con propiedades de ejemplo. Solo tendrás que cambiar las fotos y los textos por los tuyos.</p>

              <div className="mt-6 flex gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-brand-600" />
                <div className="flex-1 h-1.5 rounded-full bg-gray-200" />
              </div>

              <div className="mt-6 space-y-4">
                {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de tu negocio</label>
                  <input type="text" value={form.business_name} onChange={e => update('business_name', e.target.value)} className="input-field" placeholder="Ej: Victoria Laurent Real Estate" autoFocus />
                  <p className="text-xs text-gray-400 mt-1">Aparecerá como título de tu web</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field" placeholder="tu@email.com" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input type="password" value={form.password} onChange={e => update('password', e.target.value)} className="input-field" placeholder="Mínimo 8 caracteres" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono <span className="text-gray-400">(opcional)</span></label>
                    <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-field" placeholder="+34 600 000 000" />
                  </div>
                </div>

                <button onClick={goToStep2} className="w-full px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition text-base">
                  Siguiente: elegir diseño
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-6 text-3xl font-bold text-gray-900">Elige el estilo de tu web</h1>
              <p className="mt-2 text-gray-500">13 plantillas profesionales. Podrás personalizar todo después.</p>

              <div className="mt-6 flex gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-brand-600" />
                <div className="flex-1 h-1.5 rounded-full bg-brand-600" />
              </div>

              <div className="mt-6 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update('template', t.id)}
                    className={`w-full flex items-center gap-3 p-3 border-2 rounded-xl transition text-left ${
                      form.template === t.id
                        ? 'border-brand-600 bg-brand-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Color preview */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200" style={{ background: `linear-gradient(135deg, ${t.color1} 50%, ${t.color2} 50%)` }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        {t.family && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{t.family}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.desc}</p>
                    </div>
                    {form.template === t.id && (
                      <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button onClick={() => { setStep(1); setError('') }} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition">
                  Atrás
                </button>
                <button onClick={handleRegister} disabled={loading} className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition text-base disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Creando tu web...</>) : 'Crear mi web'}
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-2">
                Al crear tu cuenta aceptas los{' '}
                <Link href="/legal/terminos" className="text-brand-600 hover:underline">Términos</Link>
                {' '}y la{' '}
                <Link href="/legal/privacidad" className="text-brand-600 hover:underline">Privacidad</Link>
              </p>
            </>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual preview */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gray-50 p-12">
        <div className="w-full max-w-md">
          {step === 1 ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tu web profesional en 2 minutos</h3>
                <p className="text-gray-500 mt-2">Rellena tus datos y elige un diseño. Nosotros creamos tu web completa con contenido de ejemplo listo para personalizar.</p>
              </div>
              <div className="text-left space-y-3">
                {['Web profesional con propiedades de ejemplo', 'Testimonios, servicios y zonas predefinidos', 'Solo sustituye los datos por los tuyos', 'Sube propiedades desde CSV o enlace de portal'].map(txt => (
                  <div key={txt} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3.5 h-3.5" /></div>
                    <span className="text-gray-600">{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm font-medium text-gray-500 mb-2">Vista previa del estilo</p>
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <div className="h-8 flex items-center gap-1.5 px-3" style={{ backgroundColor: selectedTemplate?.color1 || '#1A1A1A' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                </div>
                {/* Preview image from /previews/ */}
                <div className="relative h-52">
                  <img src={`/previews/${form.template}.png`} alt="" className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="text-white">
                      <p className="text-lg font-bold">{form.business_name || 'Tu Nombre'}</p>
                      <p className="text-xs opacity-80 mt-0.5">Propiedades en Tenerife</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <div className="flex gap-1 mb-2">
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selectedTemplate?.color1 }} />
                    <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: selectedTemplate?.color2 }} />
                  </div>
                  <p className="text-xs font-semibold text-gray-900">{selectedTemplate?.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{selectedTemplate?.desc}</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400">
                <Link href={`/demos/${form.template}`} className="text-brand-600 hover:underline" target="_blank">Ver demo completa</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
