'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    agency_name: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
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
          <Link href="/" className="text-brand-600 font-display text-2xl font-bold">TenerifeHomes</Link>
          <h1 className="mt-8 text-3xl font-bold text-gray-900">Crea tu cuenta de agente</h1>
          <p className="mt-2 text-gray-500">Empieza a publicar propiedades en minutos</p>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="input-field"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="input-field"
                placeholder="+34 600 000 000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de agencia <span className="text-gray-400">(opcional)</span></label>
              <input
                type="text"
                value={form.agency_name}
                onChange={(e) => update('agency_name', e.target.value)}
                className="input-field"
                placeholder="Tu agencia"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:block lg:flex-1 bg-brand-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800/90 to-brand-950/90" />
        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-center">
            <div className="text-6xl font-display font-bold text-white">TH</div>
            <p className="mt-4 text-white/60 text-lg max-w-md">
              Web profesional, CRM, portales y MLS. Todo lo que necesitas para tu negocio inmobiliario.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
