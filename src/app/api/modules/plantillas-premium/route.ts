import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE, getAvailableTemplates } from '@/lib/module-engine'

const ALL_TEMPLATES = [
  { id: 'elegante', name: 'Elegante', description: 'Diseño limpio y profesional', preview: '/templates/elegante.png', category: 'free', colors: { primary: '#2E75B6', secondary: '#1B4F72', accent: '#D4A853' } },
  { id: 'moderno', name: 'Moderno', description: 'Líneas contemporáneas y minimalistas', preview: '/templates/moderno.png', category: 'premium', colors: { primary: '#1A1A2E', secondary: '#16213E', accent: '#E94560' } },
  { id: 'clasico', name: 'Clásico', description: 'Estilo atemporal y sofisticado', preview: '/templates/clasico.png', category: 'premium', colors: { primary: '#8B4513', secondary: '#654321', accent: '#DAA520' } },
  { id: 'minimalista', name: 'Minimalista', description: 'Menos es más, enfoque en contenido', preview: '/templates/minimalista.png', category: 'premium', colors: { primary: '#333333', secondary: '#666666', accent: '#FF6B35' } },
  { id: 'lujo', name: 'Lujo', description: 'Premium, exclusivo, alto standing', preview: '/templates/lujo.png', category: 'premium', colors: { primary: '#0D0D0D', secondary: '#1A1A1A', accent: '#C9A84C' } },
  { id: 'mediterraneo', name: 'Mediterráneo', description: 'Cálido, con colores del Mediterráneo', preview: '/templates/mediterraneo.png', category: 'premium', colors: { primary: '#1E6091', secondary: '#184E77', accent: '#E9C46A' } },
  { id: 'data', name: 'Data-Driven', description: 'Enfocado en datos y estadísticas', preview: '/templates/data.png', category: 'premium', colors: { primary: '#0B3D91', secondary: '#1B1B3A', accent: '#00D4AA' } },
]

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  const available = getAvailableTemplates(modules)
  const isPremium = hasModule(modules, MODULE.PLANTILLAS_PREMIUM)
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agent_profiles')
    .select('template')
    .eq('id', agentId)
    .single()
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'plantillas_premium', action: 'list_templates' })
  return NextResponse.json({
    currentTemplate: agent?.template || 'elegante',
    isPremium,
    templates: ALL_TEMPLATES.map(t => ({
      ...t,
      isAvailable: available.includes(t.id),
      isLocked: !available.includes(t.id),
    }))
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, template_id } = await req.json()
  if (!agent_id || !template_id) return NextResponse.json({ error: 'agent_id and template_id required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  const available = getAvailableTemplates(modules)
  if (!available.includes(template_id)) {
    return NextResponse.json({ error: 'Template not available. Activate Plantillas Premium module.', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { error } = await supabase
    .from('agent_profiles')
    .update({ template: template_id })
    .eq('id', agent_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'plantillas_premium', action: `apply_${template_id}` })
  const template = ALL_TEMPLATES.find(t => t.id === template_id)
  return NextResponse.json({
    applied: template_id,
    name: template?.name,
    colors: template?.colors,
    message: `Plantilla "${template?.name}" aplicada correctamente.`
  })
}
