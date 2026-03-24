import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

// MLS-0: Basic shared catalog between agents

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  const type = req.nextUrl.searchParams.get('type')
  const location = req.nextUrl.searchParams.get('location')
  const minPrice = req.nextUrl.searchParams.get('min_price')
  const maxPrice = req.nextUrl.searchParams.get('max_price')
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')

  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })

  const supabase = createClient()

  const { data: agentProfile } = await supabase
    .from('agent_profiles')
    .select('id, business_name, plan')
    .eq('id', agentId)
    .single()

  if (!agentProfile) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  let query = supabase
    .from('mls_listings')
    .select(`
      id, property_id, listing_agent_id, commission_percent, commission_split,
      status, listed_at,
      properties!inner(id, title, slug, description, property_type, operation_type,
        price, bedrooms, bathrooms, size_m2, location, images, badge)
    `)
    .eq('status', 'active')
    .neq('listing_agent_id', agentId)
    .order('listed_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (type) query = query.eq('properties.operation_type', type)
  if (location) query = query.ilike('properties.location', `%${location}%`)
  if (minPrice) query = query.gte('properties.price', parseInt(minPrice))
  if (maxPrice) query = query.lte('properties.price', parseInt(maxPrice))

  const { data: listings, count, error } = await query

  const agentIds = [...new Set((listings || []).map(l => l.listing_agent_id))]
  const { data: agents } = await supabase
    .from('agent_profiles')
    .select('id, business_name, slug, phone')
    .in('id', agentIds.length > 0 ? agentIds : ['none'])

  const agentMap = new Map((agents || []).map(a => [a.id, a]))

  const enrichedListings = (listings || []).map(l => ({
    ...l,
    listing_agent: agentMap.get(l.listing_agent_id) || { business_name: 'Agente HabiBook' }
  }))

  const { count: totalMls } = await supabase
    .from('mls_listings')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: myShared } = await supabase
    .from('mls_listings')
    .select('id', { count: 'exact', head: true })
    .eq('listing_agent_id', agentId)
    .eq('status', 'active')

  await supabase.from('module_usage').insert({
    agent_id: agentId, module_slug: 'mls', action: 'browse_catalog'
  }).catch(() => {})

  return NextResponse.json({
    listings: enrichedListings,
    pagination: { page, limit, total: count || 0 },
    stats: {
      totalInMLS: totalMls || 0,
      mySharedProperties: myShared || 0,
      totalAgentsInMLS: agentIds.length
    },
    filters: { type, location, minPrice, maxPrice }
  })
}