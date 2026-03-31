import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

const PORTALS = [
  { id: 'idealista', name: 'Idealista', logo: '/portals/idealista.svg', format: 'json', status: 'active', description: 'Portal lider en Espana' },
  { id: 'fotocasa', name: 'Fotocasa', logo: '/portals/fotocasa.svg', format: 'xml', status: 'active', description: 'Segundo portal en Espana (Adevinta)' },
  { id: 'kyero', name: 'Kyero', logo: '/portals/kyero.svg', format: 'xml', status: 'active', description: 'Portal internacional para compradores extranjeros' },
  { id: 'rightmove', name: 'Rightmove Overseas', logo: '/portals/rightmove.svg', format: 'blm', status: 'active', description: 'Portal britanico - mercado UK' },
  { id: 'thinkspain', name: 'ThinkSpain', logo: '/portals/thinkspain.svg', format: 'xml', status: 'active', description: 'Portal para compradores britanicos' },
  { id: 'pisos', name: 'Pisos.com', logo: '/portals/pisos.svg', format: 'xml', status: 'coming_soon', description: 'Tercer portal espanol' },
  { id: 'habitaclia', name: 'Habitaclia', logo: '/portals/habitaclia.svg', format: 'xml', status: 'coming_soon', description: 'Portal Adevinta' },
  { id: 'immoscout', name: 'ImmoScout24', logo: '/portals/immoscout.svg', format: 'json', status: 'coming_soon', description: 'Portal aleman - mercado DACH' },
]

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })

  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.PORTALES)) {
    return NextResponse.json({ error: 'Portales module not active', upgrade: true }, { status: 403 })
  }

  const supabase = createClient()
  const { data: properties, count } = await supabase
    .from('properties').select('id, title, status, is_active', { count: 'exact' })
    .eq('agent_id', agentId).eq('is_active', true)

  const { data: configs } = await supabase
    .from('property_portal_distribution')
    .select('portal_id, status, last_synced_at, properties_count')
    .eq('agent_id', agentId)

  const configMap = new Map((configs || []).map(c => [c.portal_id, c]))

  const portalsWithStatus = PORTALS.map(p => ({
    ...p,
    distribution: configMap.get(p.id) || { status: 'not_connected', last_synced_at: null, properties_count: 0 }
  }))

  return NextResponse.json({
    portals: portalsWithStatus,
    agent: { totalPublished: count || 0 },
    feed: {
      kyeroUrl: `/api/modules/portales/feed?agent_id=${agentId}`,
      format: 'kyero_v2.1',
      lastGenerated: new Date().toISOString()
    }
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, portal_id, action: syncAction } = await req.json()
  if (!agent_id || !portal_id) return NextResponse.json({ error: 'agent_id and portal_id required' }, { status: 400 })

  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.PORTALES)) {
    return NextResponse.json({ error: 'Portales module not active' }, { status: 403 })
  }

  const supabase = createClient()
  const { count } = await supabase
    .from('properties').select('id', { count: 'exact', head: true })
    .eq('agent_id', agent_id).eq('is_active', true)

  await supabase.from('property_portal_distribution').upsert({
    agent_id, portal_id, status: 'syncing', properties_count: count || 0, last_synced_at: new Date().toISOString()
  }, { onConflict: 'agent_id,portal_id' })

  await supabase.from('module_usage').insert({ agent_id, module_slug: 'portales', action: `sync_${portal_id}` })

  await supabase.from('property_portal_distribution').upsert({
    agent_id, portal_id, status: 'synced', properties_count: count || 0, last_synced_at: new Date().toISOString()
  }, { onConflict: 'agent_id,portal_id' })

  return NextResponse.json({
    portal: portal_id,
    propertiesSynced: count || 0,
    status: 'synced',
    feedUrl: `/api/modules/portales/feed?agent_id=${agent_id}`,
    message: `${count || 0} propiedades sincronizadas con ${portal_id}.`
  })
}