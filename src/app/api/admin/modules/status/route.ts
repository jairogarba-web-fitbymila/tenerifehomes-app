import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if admin
  const { data: agent } = await supabase
    .from('agent_profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: definitions } = await supabase
    .from('module_definitions')
    .select('*')
    .order('price_monthly')

  const { data: activeModules } = await supabase
    .from('agent_modules')
    .select('module_slug, agent_id, is_active')
    .eq('is_active', true)

  const { data: usage } = await supabase
    .from('module_usage')
    .select('module_slug, action, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  const moduleStats = definitions?.map(def => ({
    ...def,
    activeAgents: activeModules?.filter(am => am.module_slug === def.slug).length || 0,
    recentUsage: usage?.filter(u => u.module_slug === def.slug).length || 0,
  })) || []

  return NextResponse.json({
    modules: moduleStats,
    totals: {
      definitions: definitions?.length || 0,
      totalActivations: activeModules?.length || 0,
      recentActions: usage?.length || 0,
    }
  })
}
