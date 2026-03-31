import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.CHATBOT)) {
    return NextResponse.json({ error: 'Chatbot module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: agent } = await supabase
    .from('agent_profiles')
    .select('business_name, bio, phone, email, languages')
    .eq('id', agentId)
    .single()
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, price, location, property_type, operation_type, bedrooms, bathrooms, area_m2')
    .eq('agent_id', agentId)
    .eq('status', 'published')
    .limit(50)
  const config = {
    greeting: `Hola! Soy el asistente virtual de ${agent?.business_name || 'este agente'}. ¿En qué puedo ayudarte?`,
    context: {
      agentName: agent?.business_name,
      phone: agent?.phone,
      email: agent?.email,
      languages: agent?.languages,
      totalProperties: properties?.length || 0,
      propertyTypes: Array.from(new Set(properties?.map(p => p.property_type) || [])),
      priceRange: properties?.length ? {
        min: Math.min(...properties.map(p => p.price)),
        max: Math.max(...properties.map(p => p.price))
      } : null,
      locations: Array.from(new Set(properties?.map(p => p.location) || []))
    },
    capabilities: ['property_search', 'schedule_visit', 'price_info', 'contact_agent', 'area_info'],
    properties: properties || []
  }
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'chatbot', action: 'get_config' })
  return NextResponse.json(config)
}

export async function POST(req: NextRequest) {
  const { agent_id, message, conversation_id } = await req.json()
  if (!agent_id || !message) return NextResponse.json({ error: 'agent_id and message required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.CHATBOT)) {
    return NextResponse.json({ error: 'Chatbot module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, price, location, property_type, bedrooms, bathrooms, area_m2')
    .eq('agent_id', agent_id)
    .eq('status', 'published')
  const lowerMsg = message.toLowerCase()
  let response = { text: '', suggestions: [] as string[], properties: [] as any[] }
  if (lowerMsg.includes('precio') || lowerMsg.includes('price') || lowerMsg.includes('cost')) {
    const matched = properties?.filter(p => p.price) || []
    response.text = matched.length
      ? `Tenemos ${matched.length} propiedades disponibles. Los precios van desde ${Math.min(...matched.map(p=>p.price)).toLocaleString()}€ hasta ${Math.max(...matched.map(p=>p.price)).toLocaleString()}€.`
      : 'No tenemos propiedades con precio disponible en este momento.'
    response.suggestions = ['Ver las más baratas', 'Ver las más caras', 'Contactar agente']
    response.properties = matched.slice(0, 3)
  } else if (lowerMsg.includes('visita') || lowerMsg.includes('visit') || lowerMsg.includes('ver')) {
    response.text = 'Me encantaría ayudarte a programar una visita. ¿Qué propiedad te interesa y qué día te viene bien?'
    response.suggestions = ['Mañana por la mañana', 'Esta semana', 'El fin de semana']
  } else if (lowerMsg.includes('contacto') || lowerMsg.includes('contact') || lowerMsg.includes('llamar')) {
    const { data: agent } = await supabase.from('agent_profiles').select('phone, email').eq('id', agent_id).single()
    response.text = `Puedes contactarnos por teléfono (${agent?.phone || 'no disponible'}) o email (${agent?.email || 'no disponible'}).`
    response.suggestions = ['Enviar mensaje', 'Programar llamada']
  } else {
    const matched = properties?.filter(p => {
      const searchable = `${p.title} ${p.location} ${p.property_type}`.toLowerCase()
      return lowerMsg.split(' ').some((w: string) => w.length > 3 && searchable.includes(w))
    }) || []
    if (matched.length > 0) {
      response.text = `He encontrado ${matched.length} propiedad(es) que podrían interesarte:`
      response.properties = matched.slice(0, 5)
      response.suggestions = ['Más detalles', 'Programar visita', 'Ver más opciones']
    } else {
      response.text = '¿En qué puedo ayudarte? Puedo buscar propiedades, darte información de precios, o ayudarte a contactar con el agente.'
      response.suggestions = ['Buscar propiedades', 'Ver precios', 'Contactar agente']
    }
  }
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'chatbot', action: 'chat_message' })
  return NextResponse.json(response)
}
