import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('agent_sections')
    .select('*')
    .eq('agent_id', user.id)
    .order('display_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data || [])
}

export async function PUT(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Toggle a single section
  if (body.id && ('is_active' in body || 'display_order' in body || 'custom_title' in body)) {
    const updates: Record<string, any> = {}
    if ('is_active' in body) updates.is_active = body.is_active
    if ('display_order' in body) updates.display_order = body.display_order
    if ('custom_title' in body) updates.custom_title = body.custom_title
    if ('custom_config' in body) updates.custom_config = body.custom_config

    const { data, error } = await supabase
      .from('agent_sections')
      .update(updates)
      .eq('id', body.id)
      .eq('agent_id', user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  }

  // Bulk update (reorder)
  if (Array.isArray(body)) {
    const results = []
    for (const item of body) {
      const { data, error } = await supabase
        .from('agent_sections')
        .update({ display_order: item.display_order, is_active: item.is_active })
        .eq('id', item.id)
        .eq('agent_id', user.id)
        .select()
        .single()
      if (data) results.push(data)
    }
    return NextResponse.json(results)
  }

  return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
}
