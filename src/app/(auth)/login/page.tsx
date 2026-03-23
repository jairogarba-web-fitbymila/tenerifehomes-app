'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const registered = searchParams.get('registered') === 'true'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : error.message)
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-brand-600 font-display text-2xl font-bold">HabiBook</Link>
          <h1 className="mt-8 text-3xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="mt-2 text-gray-500">Accede a tu panel de agente</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {registered && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm border border-green-200">
                ✓ Cuenta creada con éxito. Tu web está lista.
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Entrando...' : 'Iniciar sesion'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-brand-600 font-medium hover:underline">
              Registrate como agente
            </Link>
          </p>

          <p className="mt-8 text-center text-xs text-gray-400">
            Al iniciar sesión aceptas los{' '}
            <Link href="/legal/terminos" className="text-brand-600 hover:underline">
              Términos y Condiciones
            </Link>
            {' '}y la{' '}
            <Link href="/legal/privacidad" className="text-brand-600 hover:underline">
              Política de Privacidad
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
              Tu plataforma inmobiliaria integral. Web profesional, CRM, portales y MLS en un solo lugar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Cargando...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
