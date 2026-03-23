'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import {
  Building2,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  ExternalLink,
  Camera,
  FileText,
  Home,
  Share2,
  Upload,
  Sparkles,
  X,
  Rocket,
} from 'lucide-react'

interface DashboardStats {
  totalProperties: number
  activeProperties: number
  totalLeads: number
  newLeadsThisWeek: number
  totalViews: number
}

interface RecentProperty {
  id: string
  title: string
  price: number
  is_active: boolean
  operation_type: string
  created_at: string
}

interface RecentLead {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  created_at: string
}

interface AgentProfile {
  slug: string
  business_name: string
  bio_photo_url: string | null
  bio: string | null
  phone: string | null
  primary_zone: string | null
}

interface OnboardingStep {
  id: string
  label: string
  description: string
  icon: typeof Camera
  href: string
  done: boolean
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'

  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeadsThisWeek: 0,
    totalViews: 0,
  })
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([])
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [profile, setProfile] = useState<AgentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [dismissedOnboarding, setDismissedOnboarding] = useState(false)

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load stats + profile in parallel
      const [propsRes, activeRes, leadsRes, weekLeadsRes, recentPropsRes, recentLeadsRes, profileRes] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agent_id', user.id).eq('is_active', true),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agent_id', user.id),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agent_id', user.id).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
        supabase.from('properties').select('id, title, price, is_active, operation_type, created_at').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('leads').select('id, name, email, phone, status, created_at').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('agent_profiles').select('slug, business_name, bio_photo_url, bio, phone, primary_zone').eq('id', user.id).single(),
      ])

      setStats({
        totalProperties: propsRes.count || 0,
        activeProperties: activeRes.count || 0,
        totalLeads: leadsRes.count || 0,
        newLeadsThisWeek: weekLeadsRes.count || 0,
        totalViews: 0,
      })

      setRecentProperties(recentPropsRes.data || [])
      setRecentLeads(recentLeadsRes.data || [])
      if (profileRes.data) setProfile(profileRes.data)

      // Show welcome if query param or if profile looks brand new (no photo, default bio)
      if (isWelcome) setShowWelcome(true)

      setLoading(false)
    }
    loadDashboard()
  }, [isWelcome])

  // Compute onboarding steps
  const hasRealPhoto = profile?.bio_photo_url && !profile.bio_photo_url.includes('unsplash')
  const hasCustomBio = profile?.bio && profile.bio.length > 20 && !profile.bio.includes('demo') && !profile.bio.includes('ejemplo')
  const hasPhone = !!profile?.phone
  const hasZone = !!profile?.primary_zone

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'photo',
      label: 'Sube tu foto de perfil',
      description: 'Los clientes confían más cuando ven quién les atiende',
      icon: Camera,
      href: '/dashboard/settings',
      done: !!hasRealPhoto,
    },
    {
      id: 'bio',
      label: 'Personaliza tu biografía',
      description: 'Cuéntales quién eres y por qué elegirte',
      icon: FileText,
      href: '/dashboard/settings',
      done: !!hasCustomBio,
    },
    {
      id: 'properties',
      label: 'Añade tus propiedades reales',
      description: 'Sustituye las de ejemplo por las tuyas',
      icon: Home,
      href: '/dashboard/properties',
      done: false, // We can't easily detect this, so always show as pending initially
    },
    {
      id: 'import',
      label: 'Importa desde CSV o enlace',
      description: 'Sube todas tus propiedades de golpe',
      icon: Upload,
      href: '/dashboard/properties/import',
      done: false,
    },
    {
      id: 'share',
      label: 'Comparte tu web',
      description: 'Envía el enlace a tus clientes y redes sociales',
      icon: Share2,
      href: profile?.slug ? `/agent/${profile.slug}` : '#',
      done: false,
    },
  ]

  const completedSteps = onboardingSteps.filter(s => s.done).length
  const totalSteps = onboardingSteps.length
  const showOnboarding = (showWelcome || completedSteps < 3) && !dismissedOnboarding

  const statCards = [
    { label: 'Propiedades activas', value: stats.activeProperties, total: stats.totalProperties, icon: Building2, color: 'text-brand-600 bg-brand-50' },
    { label: 'Leads totales', value: stats.totalLeads, sub: `${stats.newLeadsThisWeek} esta semana`, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Visitas al perfil', value: stats.totalViews, sub: 'últimos 30 días', icon: Eye, color: 'text-amber-600 bg-amber-50' },
    { label: 'Conversión', value: stats.totalLeads > 0 ? `${Math.round((stats.newLeadsThisWeek / Math.max(stats.totalLeads, 1)) * 100)}%` : '—', sub: 'leads / visitas', icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
  ]

  function formatPrice(price: number) {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    return `hace ${days}d`
  }

  const leadStatusLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
    contacted: { label: 'Contactado', color: 'bg-amber-100 text-amber-700' },
    qualified: { label: 'Cualificado', color: 'bg-green-100 text-green-700' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700' },
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-5 h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner — shown right after registration */}
      {showWelcome && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-6 sm:p-8">
          <button
            onClick={() => setShowWelcome(false)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                ¡Tu web ya está lista, {profile?.business_name}!
              </h2>
              <p className="text-white/80 mt-1">
                Hemos creado tu web con contenido de ejemplo. Solo tienes que sustituirlo por el tuyo.
              </p>
            </div>
            {profile?.slug && (
              <a
                href={`/agent/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-700 rounded-lg font-semibold hover:bg-white/90 transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                Ver mi web
              </a>
            )}
          </div>
        </div>
      )}

      {/* Onboarding Checklist */}
      {showOnboarding && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Personaliza tu web</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {completedSteps} de {totalSteps} pasos completados
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress bar */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{Math.round((completedSteps / totalSteps) * 100)}%</span>
              </div>
              <button
                onClick={() => setDismissedOnboarding(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Ocultar guía"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {onboardingSteps.map((step) => (
              <Link
                key={step.id}
                href={step.href}
                target={step.id === 'share' ? '_blank' : undefined}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.done
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600'
                }`}>
                  {step.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                </div>
                {!step.done && (
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-600 transition-colors flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Resumen de tu actividad</p>
        </div>
        <div className="flex items-center gap-2">
          {profile?.slug && (
            <a
              href={`/agent/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Ver mi web</span>
            </a>
          )}
          <Link href="/dashboard/properties/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva propiedad
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                  {card.total !== undefined && card.total !== card.value && (
                    <span className="text-sm font-normal text-gray-400 ml-1">/ {card.total}</span>
                  )}
                </p>
                {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Últimas propiedades</h2>
            <Link href="/dashboard/properties" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentProperties.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Aún no tienes propiedades</p>
              <Link href="/dashboard/properties/new" className="mt-3 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
                <Plus className="w-4 h-4" /> Crear primera propiedad
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProperties.map((prop) => (
                <Link key={prop.id} href={`/dashboard/properties/${prop.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatPrice(prop.price)} · {prop.operation_type === 'sale' ? 'Venta' : 'Alquiler'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prop.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {prop.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {timeAgo(prop.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Últimos leads</h2>
            <Link href="/dashboard/leads" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Aún no tienes leads</p>
              <p className="text-xs text-gray-400 mt-1">Los leads llegarán cuando publiques propiedades</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentLeads.map((lead) => (
                <Link key={lead.id} href={`/dashboard/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${leadStatusLabels[lead.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                      {leadStatusLabels[lead.status]?.label || lead.status}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(lead.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
