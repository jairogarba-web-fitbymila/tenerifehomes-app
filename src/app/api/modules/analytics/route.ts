import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  const period = req.nextUrl.searchParams.get('period') || '30d'
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.ANALYTICS)) {
    return NextResponse.json({ error: 'Analytics module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const { data: leads } = await supabase
    .from('leads')
    .select('created_at, status, source, property_id')
    .eq('agent_id', agentId)
    .gte('created_at', since)
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, views, favorites, status')
    .eq('agent_id', agentId)
  const { data: usage } = await supabase
    .from('module_usage')
    .select('module_slug, action, created_at')
    .eq('agent_id', agentId)
    .gte('created_at', since)
  const totalLeads = leads?.length || 0
  const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0
  const analytics = {
    period: { days, since },
    leads: {
      total: totalLeads,
      byStatus: {
        new: leads?.filter(l => l.status === 'new').length || 0,
        contacted: leads?.filter(l => l.status === 'contacted').length || 0,
        qualified: leads?.filter(l => l.status === 'qualified').length || 0,
        converted: convertedLeads,
      },
      conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) + '%' : '0%',
      bySource: leads?.reduce((acc: any, l) => { acc[l.source || 'unknown'] = (acc[l.source || 'unknown'] || 0) + 1; return acc }, {}) || {},
    },
    properties: {
      total: properties?.length || 0,
      published: properties?.filter(p => p.status === 'published').length || 0,
      totalViews: properties?.reduce((sum, p) => sum + (p.views || 0), 0) || 0,
      totalFavorites: properties?.reduce((sum, p) => sum + (p.favorites || 0), 0) || 0,
      topViewed: [...(properties || [])].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    },
    moduleUsage: usage?.reduce((acc: any, u) => {
      const key = `${u.module_slug}:${u.action}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}) || {},
  }
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'analytics', action: 'view_dashboard' })
  return NextResponse.json(analytics)
}
