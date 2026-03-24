import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.FIRMA_DIGITAL)) {
    return NextResponse.json({ error: 'Firma Digital module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'firma_digital', action: 'list_documents' })
  return NextResponse.json({
    documents: [],
    templates: [
      { id: 'arras', name: 'Contrato de Arras', description: 'Contrato de señal para reserva de propiedad', fields: ['buyer_name', 'seller_name', 'property_address', 'price', 'deposit_amount', 'deadline'] },
      { id: 'rental', name: 'Contrato de Alquiler', description: 'Contrato de arrendamiento de vivienda', fields: ['tenant_name', 'landlord_name', 'property_address', 'monthly_rent', 'deposit', 'start_date', 'duration'] },
      { id: 'mandate', name: 'Mandato de Venta', description: 'Autorización para gestionar la venta de propiedad', fields: ['owner_name', 'agent_name', 'property_address', 'commission_rate', 'exclusivity', 'duration'] },
      { id: 'visit', name: 'Hoja de Visita', description: 'Registro de visita a propiedad', fields: ['visitor_name', 'property_address', 'date', 'agent_name', 'comments'] },
      { id: 'offer', name: 'Oferta de Compra', description: 'Propuesta formal de compra', fields: ['buyer_name', 'property_address', 'offered_price', 'conditions', 'validity_days'] },
    ],
    capabilities: ['create_document', 'request_signature', 'track_status', 'download_signed', 'send_reminder']
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, template_id, fields, signers } = await req.json()
  if (!agent_id || !template_id) return NextResponse.json({ error: 'agent_id and template_id required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.FIRMA_DIGITAL)) {
    return NextResponse.json({ error: 'Firma Digital module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const docId = crypto.randomUUID()
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'firma_digital', action: `create_${template_id}` })
  return NextResponse.json({
    document: {
      id: docId,
      template: template_id,
      status: 'draft',
      created_at: new Date().toISOString(),
      fields: fields || {},
      signers: signers || [],
      signUrl: `/sign/${docId}`,
    },
    message: 'Documento creado. Conecta DocuSign o SignNow API para firma digital real.'
  })
}
