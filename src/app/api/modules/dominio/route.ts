import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.DOMINIO)) {
    return NextResponse.json({ error: 'Dominio module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agent_profiles')
    .select('slug, business_name, custom_domain')
    .eq('id', agentId)
    .single()
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'dominio', action: 'check_domain' })
  return NextResponse.json({
    currentDomain: agent?.custom_domain || null,
    subdomain: agent?.slug ? `${agent.slug}.habibook.com` : null,
    habibook_url: `https://www.habibook.com/agent/${agent?.slug}`,
    dns: {
      status: agent?.custom_domain ? 'configured' : 'not_configured',
      records: agent?.custom_domain ? [
        { type: 'CNAME', name: agent.custom_domain, value: 'cname.vercel-dns.com', status: 'pending_verification' }
      ] : [],
      instructions: 'Añade un registro CNAME en tu proveedor de dominio apuntando a cname.vercel-dns.com'
    },
    ssl: { status: agent?.custom_domain ? 'provisioning' : 'not_needed', provider: 'lets_encrypt' }
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, custom_domain } = await req.json()
  if (!agent_id || !custom_domain) return NextResponse.json({ error: 'agent_id and custom_domain required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.DOMINIO)) {
    return NextResponse.json({ error: 'Dominio module not active', upgrade: true }, { status: 403 })
  }
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
  if (!domainRegex.test(custom_domain)) {
    return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 })
  }
  const supabase = createClient()
  const { error } = await supabase
    .from('agent_profiles')
    .update({ custom_domain })
    .eq('id', agent_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'dominio', action: 'set_domain' })
  return NextResponse.json({
    domain: custom_domain,
    status: 'pending_verification',
    dns_records: [{ type: 'CNAME', name: custom_domain, value: 'cname.vercel-dns.com' }],
    message: 'Dominio configurado. Añade el registro CNAME y la verificación será automática.'
  })
}
