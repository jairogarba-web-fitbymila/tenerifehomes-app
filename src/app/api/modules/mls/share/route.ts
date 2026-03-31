import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { agent_id, property_id, commission_percent, commission_split } = await req.json()

  if (!agent_id || !property_id) {
    return NextResponse.json({ error: 'agent_id and property_id required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('id, title, agent_id, is_active')
    .eq('id', property_id)
    .eq('agent_id', agent_id)
    .single()

  if (!property) return NextResponse.json({ error: 'Property not found or not yours' }, { status: 404 })
  if (!property.is_active) return NextResponse.json({ error: 'Property must be active to share to MLS' }, { status: 400 })

  const { data: existing } = await supabase
    .from('mls_listings')
    .select('id, status')
    .eq('property_id', property_id)
    .eq('listing_agent_id', agent_id)
    .single()

  if (existing) {
    const newStatus = existing.status === 'active' ? 'inactive' : 'active'
    await supabase.from('mls_listings')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    return NextResponse.json({
      action: newStatus === 'active' ? 'reactivated' : 'removed',
      listing_id: existing.id,
      message: newStatus === 'active'
        ? `"${property.title}" vuelve a estar en el MLS`
        : `"${property.title}" retirada del MLS`
    })
  }

  const { data: listing, error } = await supabase
    .from('mls_listings')
    .insert({
      property_id,
      listing_agent_id: agent_id,
      commission_percent: commission_percent || 5.0,
      commission_split: commission_split || '50/50',
      status: 'active',
      listed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to share property', details: error.message }, { status: 500 })
  }

  await supabase.from('module_usage').insert({
    agent_id, module_slug: 'mls', action: 'share_property'
  })

  return NextResponse.json({
    action: 'shared',
    listing,
    message: `"${property.title}" compartida en el MLS con comision ${commission_percent || 5}% (${commission_split || '50/50'})`
  })
}