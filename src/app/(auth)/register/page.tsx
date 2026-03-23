'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type BusinessType = 'individual' | 'agency' | 'network'
type TemplateType = 'luxury' | 'mediterranean' | 'corporate' | 'boutique' | 'network'

interface Template {
  id: TemplateType
  name: string
  description: string
  color1: string
  color2: string
  previewUrl: string
}

const TEMPLATES: Template[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Elegancia y exclusividad',
    color1: '#1A1A1A',
    color2: '#C9A84C',
    previewUrl: '/templates/luxury-preview',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Calidez mediterránea',
    color1: '#C4652E',
    color2: '#F5E6D3',
    previewUrl: '/templates/mediterranean-preview',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Profesional y corporativo',
    color1: '#0B2545',
    color2: '#4A90D9',
    previewUrl: '/templates/corporate-preview',
  },
  {
    id: 'boutique',
    name: 'Boutique',
    description: 'Sofisticado y personal',
    color1: '#C08B7F',
    color2: '#8B9D77',
    previewUrl: '/templates/boutique-preview',
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Moderno y dinámico',
    color1: '#0B1D3A',
    color2: '#E8614D',
    previewUrl: '/templates/network-preview',
  },
]

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    business_name: '',
    email: '',
    password: '',
    phone: '',
    business_type: 'individual' as BusinessType,
    zone: '',
    template: 'luxury' as TemplateType,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!form.business_name.trim()) newErrors.business_name = 'Campo obligatorio'
      if (!form.email.trim()) newErrors.email = 'Campo obligatorio'
      if (!form.password.trim()) newErrors.password = 'Campo obligatorio'
      if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    } else if (step === 2) {
      if (!form.business_type) newErrors.business_type = 'Selecciona un tipo'
      if (!form.zone.trim()) newErrors.zone = 'Campo obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  function prevStep() {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrar')
        setLoading(false)
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-brand-600 font-display text-2xl font-bold">
            TenerifeHomes
          </Link>
          <h1 className="mt-8 text-3xl font-bold text-gray-900">Crea tu cuenta de agente</h1>
          <p className="mt-2 text-gray-500">Empieza a publicar propiedades en minutos</p>

          {/* Step Indicator */}
          <div className="mt-8 flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  step < currentStep
                    ? 'bg-brand-600'
                    : step === currentStep
                    ? 'bg-brand-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {/* STEP 1: Datos básicos */}
            {currentStep === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos básicos</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del negocio
                  </label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={(e) => update('business_name', e.target.value)}
                    className={`input-field ${errors.business_name ? 'border-red-500' : ''}`}
                    placeholder="Tu nombre o agencia"
                  />
                  {errors.business_name && (
                    <p className="text-red-600 text-xs mt-1">{errors.business_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono <span className="text-gray-400">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="input-field"
                    placeholder="+34 600 000 000"
                  />
                </div>
              </>
            )}

            {/* STEP 2: Tu negocio */}
            {currentStep === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tu negocio</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de negocio
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        value: 'individual',
                        label: 'Individual',
                        desc: 'Agente autónomo o profesional independiente',
                      },
                      {
                        value: 'agency',
                        label: 'Agency',
                        desc: 'Agencia inmobiliaria con equipo',
                      },
                      {
                        value: 'network',
                        label: 'Network',
                        desc: 'Red de oficinas o franquicia',
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                          form.business_type === option.value
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="business_type"
                          value={option.value}
                          checked={form.business_type === option.value}
                          onChange={(e) => update('business_type', e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.business_type && (
                    <p className="text-red-600 text-xs mt-2">{errors.business_type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona principal de trabajo
                  </label>
                  <input
                    type="text"
                    value={form.zone}
                    onChange={(e) => update('zone', e.target.value)}
                    className={`input-field ${errors.zone ? 'border-red-500' : ''}`}
                    placeholder="ej. Costa Adeje, Santa Cruz"
                  />
                  {errors.zone && <p className="text-red-600 text-xs mt-1">{errors.zone}</p>}
                </div>
              </>
            )}

            {/* STEP 3: Elige tu plantilla */}
            {currentStep === 3 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Elige tu plantilla</h2>
                <div className="grid grid-cols-1 gap-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => update('template', template.id)}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg transition text-left ${
                        form.template === template.id
                          ? 'border-brand-600 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded-full border border-gray-300"
                          style={{ backgroundColor: template.color1 }}
                        />
                        <div
                          className="w-8 h-8 rounded-full border border-gray-300"
                          style={{ backgroundColor: template.color2 }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      <a
                        href={template.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-brand-600 text-sm font-medium hover:underline"
                      >
                        Vista previa
                      </a>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* STEP 4: Confirmación */}
            {currentStep === 4 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmación</h2>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Nombre del negocio</p>
                    <p className="font-medium text-gray-900">{form.business_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{form.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tipo de negocio</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {form.business_type === 'agency' ? 'Agencia' : form.business_type === 'network' ? 'Red' : 'Individual'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Zona principal</p>
                    <p className="font-medium text-gray-900">{form.zone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plantilla</p>
                    <p className="font-medium text-gray-900">
                      {TEMPLATES.find((t) => t.id === form.template)?.name}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Anterior
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear mi web'}
                </button>
              )}
            </div>

            {currentStep === 4 && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Al crear tu cuenta aceptas los{' '}
                <Link href="/legal/terminos" className="text-brand-600 hover:underline">
                  Términos y Condiciones
                </Link>
                {' '}y la{' '}
                <Link href="/legal/privacidad" className="text-brand-600 hover:underline">
                  Política de Privacidad
                </Link>
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:block lg:flex-1 bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800/90 to-brand-950/90" />
        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-center">
            {currentStep === 1 && (
              <div>
                <div className="text-6xl font-display font-bold text-white mb-6">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Datos básicos</h3>
                <p className="text-white/60">Cuéntanos sobre ti y tu agencia</p>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <div className="text-6xl font-display font-bold text-white mb-6">🏢</div>
                <h3 className="text-2xl font-bold text-white mb-2">Tu negocio</h3>
                <p className="text-white/60">Define tu tipo de negocio y zona de trabajo</p>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <div className="text-6xl font-display font-bold text-white mb-6">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-2">Tu estilo</h3>
                <p className="text-white/60">Elige una plantilla que refleje tu marca</p>
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <div className="text-6xl font-display font-bold text-white mb-6">✨</div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Casi listo!</h3>
                <p className="text-white/60">Revisa tus datos y crea tu web profesional</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
