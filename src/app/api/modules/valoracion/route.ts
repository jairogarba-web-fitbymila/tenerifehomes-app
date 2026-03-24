import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { agent_id, property_type, location, area_m2, bedrooms, bathrooms, has_pool, has_garage, floor, condition } = body
  if (!agent_id) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.VALORACION)) {
    return NextResponse.json({ error: 'Valoracion module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  const { data: comparables } = await supabase
    .from('properties')
    .select('price, area_m2, bedrooms, property_type, location')
    .eq('status', 'published')
    .eq('property_type', property_type || 'apartment')
    .not('price', 'is', null)
    .limit(50)
  let basePrice = 2500
  const locationMultipliers: Record<string, number> = {
    'costa adeje': 1.4, 'los cristianos': 1.2, 'playa de las americas': 1.15,
    'santa cruz': 0.9, 'la laguna': 0.85, 'puerto de la cruz': 1.0,
    'el medano': 1.1, 'golf del sur': 1.25, 'torviscas': 1.3, 'fanabe': 1.35,
    'la caleta': 1.45, 'san eugenio': 1.2, 'arona': 0.95, 'adeje': 1.1,
  }
  const locLower = (location || '').toLowerCase()
  const locMultiplier = Object.entries(locationMultipliers).find(([k]) => locLower.includes(k))?.[1] || 1.0
  const typeMultipliers: Record<string, number> = {
    villa: 1.3, penthouse: 1.25, apartment: 1.0, townhouse: 1.1, finca: 0.9, commercial: 0.8, land: 0.5
  }
  const typeMultiplier = typeMultipliers[property_type || 'apartment'] || 1.0
  let pricePerM2 = basePrice * locMultiplier * typeMultiplier
  if (has_pool) pricePerM2 *= 1.1
  if (has_garage) pricePerM2 *= 1.05
  if (condition === 'new') pricePerM2 *= 1.15
  else if (condition === 'renovated') pricePerM2 *= 1.08
  else if (condition === 'needs_renovation') pricePerM2 *= 0.8
  const area = area_m2 || 80
  const estimated = Math.round(pricePerM2 * area)
  const range = { low: Math.round(estimated * 0.9), high: Math.round(estimated * 1.1) }
  if (comparables && comparables.length > 5) {
    const compPricePerM2 = comparables.filter(c => c.area_m2 > 0).map(c => c.price / c.area_m2)
    if (compPricePerM2.length > 0) {
      const avgComp = compPricePerM2.reduce((a, b) => a + b, 0) / compPricePerM2.length
      const blended = (pricePerM2 * 0.6) + (avgComp * 0.4)
      const blendedEstimate = Math.round(blended * area)
      range.low = Math.round(blendedEstimate * 0.9)
      range.high = Math.round(blendedEstimate * 1.1)
    }
  }
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'valoracion', action: 'estimate' })
  return NextResponse.json({
    estimation: { pricePerM2: Math.round(pricePerM2), totalEstimated: estimated, range, confidence: comparables && comparables.length > 10 ? 'high' : comparables && comparables.length > 5 ? 'medium' : 'low', comparablesUsed: comparables?.length || 0 },
    factors: { location: { name: location, multiplier: locMultiplier }, propertyType: { name: property_type, multiplier: typeMultiplier }, area: area_m2, extras: { pool: has_pool, garage: has_garage, condition } },
    disclaimer: 'Esta valoracion es una estimacion basada en datos del mercado y no constituye una tasacion oficial.'
  })
}
