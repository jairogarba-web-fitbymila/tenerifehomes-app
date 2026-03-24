import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { canAddProperty } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: false })

  const limits = await canAddProperty(user.id)

  return NextResponse.json({
    properties: properties || [],
    limits: {
      current: limits.current,
      max: limits.limit,
      canAdd: limits.allowed,
      unlimited: limits.limit === -1
    }
  })
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const limits = await canAddProperty(user.id)
  if (!limits.allowed) {
    return NextResponse.json({
      error: 'Limite de propiedades alcanzado',
      current: limits.current,
      limit: limits.limit,
      upgrade: true,
      message: `Has alcanzado el limite de ${limits.limit} propiedades. Activa el modulo "Propiedades Ilimitadas" para seguir anadiendo.`
    }, { status: 403 })
  }

  const body = await req.json()
  const slug = (body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      agent_id: user.id,
      title: body.title,
      slug: slug + '-' + Date.now().toString(36),
      description: body.description,
      property_type: body.property_type || 'apartment',
      operation_type: body.operation_type || 'sale',
      price: body.price,
      price_per_night: body.price_per_night,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      size_m2: body.size_m2,
      plot_m2: body.plot_m2,
      location: body.location,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      features: body.features || [],
      images: body.images || [],
      badge: body.badge,
      is_active: true,
      is_featured: false
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ property, limits: { current: limits.current + 1, max: limits.limit } })
}