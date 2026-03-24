import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.EMAIL_MARKETING)) {
    return NextResponse.json({ error: 'Email Marketing module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('email, name, status, created_at')
    .eq('agent_id', agentId)
    .not('email', 'is', null)
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'email_marketing', action: 'list_campaigns' })
  return NextResponse.json({
    subscribers: leads?.length || 0,
    campaigns: [],
    templates: [
      { id: 'new_property', name: 'Nueva Propiedad', subject: 'Nueva propiedad que te puede interesar', description: 'Notificación de nueva propiedad añadida' },
      { id: 'price_drop', name: 'Bajada de Precio', subject: 'Bajada de precio en propiedad', description: 'Alerta de reducción de precio' },
      { id: 'newsletter', name: 'Newsletter Mensual', subject: 'Novedades del mercado inmobiliario', description: 'Resumen mensual del mercado' },
      { id: 'welcome', name: 'Bienvenida', subject: 'Bienvenido a nuestro servicio', description: 'Email de bienvenida para nuevos leads' },
      { id: 'follow_up', name: 'Seguimiento', subject: 'Seguimiento de tu consulta', description: 'Email de seguimiento automatico' },
    ],
    stats: { totalSent: 0, opened: 0, clicked: 0, openRate: '0%', clickRate: '0%' }
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, template_id, subject, recipients, content } = await req.json()
  if (!agent_id || !template_id) return NextResponse.json({ error: 'agent_id and template_id required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.EMAIL_MARKETING)) {
    return NextResponse.json({ error: 'Email Marketing module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'email_marketing', action: `send_${template_id}` })
  return NextResponse.json({
    campaign: {
      id: crypto.randomUUID(),
      template: template_id,
      subject: subject || 'Campaign',
      recipientCount: recipients?.length || 0,
      status: 'queued',
      scheduledAt: new Date().toISOString(),
    },
    message: 'Campaña creada. Conecta SendGrid/Resend API para envío real de emails.'
  })
}
