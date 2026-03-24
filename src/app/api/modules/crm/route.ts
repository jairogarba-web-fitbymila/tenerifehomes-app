import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.CRM)) {
    return NextResponse.json({ error: 'CRM module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
    .limit(50)
  const { data: stats } = await supabase
    .from('leads')
    .select('status')
    .eq('agent_id', agentId)
  const summary = {
    total: stats?.length || 0,
    new: stats?.filter(s => s.status === 'new').length || 0,
    contacted: stats?.filter(s => s.status === 'contacted').length || 0,
    qualified: stats?.filter(s => s.status === 'qualified').length || 0,
    converted: stats?.filter(s => s.status === 'converted').length || 0,
  }
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'crm', action: 'list_leads' })
  return NextResponse.json({ leads: leads || [], summary })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { agent_id, name, email, phone, message, property_id, source } = body
  if (!agent_id || !name) return NextResponse.json({ error: 'agent_id and name required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.CRM)) {
    return NextResponse.json({ error: 'CRM module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('leads')
    .insert({ agent_id, name, email, phone, message, property_id, source: source || 'web', status: 'new' })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'crm', action: 'create_lead' })
  return NextResponse.json({ lead: data })
}
