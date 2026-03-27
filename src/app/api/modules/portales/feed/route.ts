import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })

  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.PORTALES)) {
    return NextResponse.json({ error: 'Portales module not active' }, { status: 403 })
  }

  const supabase = createClient()
  const { data: agent } = await supabase.from('agent_profiles').select('id, business_name, slug, email, phone').eq('id', agentId).single()
  const { data: properties } = await supabase.from('properties').select('*').eq('agent_id', agentId).eq('is_active', true)

  const xml = generateKyeroXML(agent, properties || [])
  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  })
}

function esc(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function mapType(t: string): string {
  const m: Record<string, string> = { apartment: 'apartment', house: 'town_house', villa: 'villa', penthouse: 'penthouse', studio: 'studio', commercial: 'commercial', land: 'land' }
  return m[t] || 'property'
}

function generateKyeroXML(agent: any, properties: any[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com'
  const props = properties.map(p => {
    const imgs = (p.images || []).map((url: string, i: number) => `      <image id="${i+1}"><url>${esc(url)}</url></image>`).join('\n')
    return `  <property>
    <id>${p.id}</id>
    <ref>${esc(p.slug || p.id)}</ref>
    <date>${new Date(p.created_at).toISOString().split('T')[0]}</date>
    <type>${mapType(p.property_type)}</type>
    <town>${esc(p.location || 'Tenerife')}</town>
    <province>Santa Cruz de Tenerife</province>
    <country>Spain</country>
    <price_freq>${p.operation_type === 'sale' ? 'sale' : 'month'}</price_freq>
    <price>${p.price || 0}</price>
    <currency>EUR</currency>
    <surface_area><built>${p.size_m2 || 0}</built><plot>${p.plot_m2 || 0}</plot></surface_area>
    <beds>${p.bedrooms || 0}</beds>
    <baths>${p.bathrooms || 0}</baths>
    <url>${baseUrl}/agent/${agent?.slug}/property/${p.slug}</url>
    <desc><es>${esc(p.description || '')}</es></desc>
    <title><es>${esc(p.title || '')}</es></title>
    <images>
${imgs}
    </images>
    ${p.latitude ? `<location><latitude>${p.latitude}</latitude><longitude>${p.longitude}</longitude></location>` : ''}
  </property>`
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<kyero>
  <feed_version>3</feed_version>
  <agent>
    <name>${esc(agent?.business_name || 'HabiBook Agent')}</name>
    <email>${esc(agent?.email || '')}</email>
    <tel>${esc(agent?.phone || '')}</tel>
  </agent>
${props}
</kyero>`
}