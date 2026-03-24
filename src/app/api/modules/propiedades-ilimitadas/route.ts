import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE, getPropertyLimit } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  const supabase = createClient()
  const { count } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('agent_id', agentId)
  const limit = getPropertyLimit(modules)
  const isUnlimited = hasModule(modules, MODULE.PROPIEDADES_ILIMITADAS)
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'propiedades_ilimitadas', action: 'check_limit' })
  return NextResponse.json({
    currentCount: count || 0,
    limit: isUnlimited ? 'unlimited' : 20,
    remaining: isUnlimited ? 'unlimited' : Math.max(0, 20 - (count || 0)),
    isUnlimited,
    canAddMore: isUnlimited || (count || 0) < 20,
    message: isUnlimited
      ? 'Tienes propiedades ilimitadas activadas.'
      : `Tienes ${count || 0} de 20 propiedades. Activa el módulo para subir propiedades ilimitadas.`
  })
}
