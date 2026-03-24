import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { module_slug, activate } = await req.json()
  if (!module_slug) return NextResponse.json({ error: 'module_slug required' }, { status: 400 })

  // Verify module exists
  const { data: moduleDef } = await supabase
    .from('module_definitions')
    .select('slug, name, price_monthly')
    .eq('slug', module_slug)
    .single()
  if (!moduleDef) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  // Check if agent already has this module
  const { data: existing } = await supabase
    .from('agent_modules')
    .select('id, is_active')
    .eq('agent_id', user.id)
    .eq('module_slug', module_slug)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('agent_modules')
      .update({ is_active: activate !== false })
      .eq('agent_id', user.id)
      .eq('module_slug', module_slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await supabase
      .from('agent_modules')
      .insert({
        agent_id: user.id,
        module_slug,
        is_active: activate !== false,
        activated_at: new Date().toISOString()
      })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log the action
  await supabase.from('module_usage').insert({
    agent_id: user.id,
    module_slug,
    action: activate !== false ? 'activate' : 'deactivate'
  })

  return NextResponse.json({
    module: module_slug,
    is_active: activate !== false,
    message: activate !== false
      ? `Módulo "${moduleDef.name}" activado correctamente.`
      : `Módulo "${moduleDef.name}" desactivado.`
  })
}

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: agentModules } = await supabase
    .from('agent_modules')
    .select(`
      module_slug,
      is_active,
      activated_at,
      expires_at,
      module_definitions!inner (
        name,
        description,
        price_monthly,
        category
      )
    `)
    .eq('agent_id', user.id)

  const { data: allModules } = await supabase
    .from('module_definitions')
    .select('*')
    .eq('is_active', true)
    .order('price_monthly')

  const activeModules = agentModules?.filter(m => m.is_active) || []
  const basePlan = 19
  const modulesTotal = activeModules.reduce((sum, m) => {
    const def = allModules?.find(d => d.slug === m.module_slug)
    return sum + (def?.price_monthly || 0)
  }, 0)

  return NextResponse.json({
    allModules: allModules || [],
    agentModules: agentModules || [],
    billing: {
      basePlan,
      modulesTotal,
      total: basePlan + modulesTotal,
      activeCount: activeModules.length
    }
  })
}
