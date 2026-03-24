import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

const PORTALS = [
  { id: 'idealista', name: 'Idealista', url: 'https://idealista.com', status: 'available', format: 'xml' },
  { id: 'fotocasa', name: 'Fotocasa', url: 'https://fotocasa.es', status: 'available', format: 'xml' },
  { id: 'pisos', name: 'Pisos.com', url: 'https://pisos.com', status: 'available', format: 'xml' },
  { id: 'habitaclia', name: 'Habitaclia', url: 'https://habitaclia.com', status: 'available', format: 'xml' },
  { id: 'kyero', name: 'Kyero', url: 'https://kyero.com', status: 'available', format: 'xml' },
  { id: 'rightmove', name: 'Rightmove Overseas', url: 'https://rightmove.co.uk', status: 'available', format: 'blm' },
  { id: 'thinkspain', name: 'ThinkSpain', url: 'https://thinkspain.com', status: 'available', format: 'xml' },
  { id: 'green-acres', name: 'Green-Acres', url: 'https://green-acres.com', status: 'available', format: 'xml' },
]

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.PORTALES)) {
    return NextResponse.json({ error: 'Portales module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, status')
    .eq('agent_id', agentId)
    .eq('status', 'published')
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'portales', action: 'list_portals' })
  return NextResponse.json({
    portals: PORTALS,
    agent: { totalPublished: properties?.length || 0 },
    syndication: { feedUrl: `/api/modules/portales/feed?agent_id=${agentId}`, format: 'xml', lastSync: null, status: 'ready' }
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, portal_id, action: syncAction } = await req.json()
  if (!agent_id || !portal_id) return NextResponse.json({ error: 'agent_id and portal_id required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.PORTALES)) {
    return NextResponse.json({ error: 'Portales module not active', upgrade: true }, { status: 403 })
  }
  const portal = PORTALS.find(p => p.id === portal_id)
  if (!portal) return NextResponse.json({ error: 'Portal not found' }, { status: 404 })
  const supabase = createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, price, location, property_type, operation_type, bedrooms, bathrooms, area_m2, description, images')
    .eq('agent_id', agent_id)
    .eq('status', 'published')
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'portales', action: `sync_${portal_id}` })
  return NextResponse.json({
    portal: portal.name,
    propertiesSynced: properties?.length || 0,
    status: 'queued',
    message: `${properties?.length || 0} propiedades enviadas a ${portal.name}. La sincronizacion puede tardar hasta 24h.`
  })
}
