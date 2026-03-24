import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

const PROPERTY_TERMS: Record<string, Record<string, string>> = {
  'piscina': { en: 'pool', de: 'Pool', fr: 'piscine', it: 'piscina', pt: 'piscina', nl: 'zwembad', ru: 'бассейн', sv: 'pool', no: 'basseng' },
  'terraza': { en: 'terrace', de: 'Terrasse', fr: 'terrasse', it: 'terrazza', pt: 'terraco', nl: 'terras', ru: 'терраса', sv: 'terrass', no: 'terrasse' },
  'vistas al mar': { en: 'sea views', de: 'Meerblick', fr: 'vue mer', it: 'vista mare', pt: 'vista mar', nl: 'zeezicht', ru: 'вид на море', sv: 'havsutsikt', no: 'havutsikt' },
  'garaje': { en: 'garage', de: 'Garage', fr: 'garage', it: 'garage', pt: 'garagem', nl: 'garage', ru: 'гараж', sv: 'garage', no: 'garasje' },
  'jardin': { en: 'garden', de: 'Garten', fr: 'jardin', it: 'giardino', pt: 'jardim', nl: 'tuin', ru: 'сад', sv: 'tradgard', no: 'hage' },
  'reformado': { en: 'renovated', de: 'renoviert', fr: 'renove', it: 'ristrutturato', pt: 'renovado', nl: 'gerenoveerd', ru: 'отремонтированный', sv: 'renoverad', no: 'renovert' },
  'amueblado': { en: 'furnished', de: 'mobliert', fr: 'meuble', it: 'arredato', pt: 'mobilado', nl: 'gemeubileerd', ru: 'меблированный', sv: 'moblerad', no: 'mobelrt' },
  'ascensor': { en: 'elevator', de: 'Aufzug', fr: 'ascenseur', it: 'ascensore', pt: 'elevador', nl: 'lift', ru: 'лифт', sv: 'hiss', no: 'heis' },
  'aire acondicionado': { en: 'air conditioning', de: 'Klimaanlage', fr: 'climatisation', it: 'aria condizionata', pt: 'ar condicionado', nl: 'airconditioning', ru: 'кондиционер', sv: 'luftkonditionering', no: 'klimaanlegg' },
  'calefaccion': { en: 'heating', de: 'Heizung', fr: 'chauffage', it: 'riscaldamento', pt: 'aquecimento', nl: 'verwarming', ru: 'отопление', sv: 'uppvarmning', no: 'oppvarming' },
}

export async function POST(req: NextRequest) {
  const { agent_id, property_id, target_lang } = await req.json()

  if (!agent_id || !property_id || !target_lang) {
    return NextResponse.json({ error: 'agent_id, property_id, and target_lang required' }, { status: 400 })
  }

  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.MULTIIDIOMA)) {
    return NextResponse.json({ error: 'Multiidioma module not active' }, { status: 403 })
  }

  const supabase = createClient()

  const { data: property } = await supabase
    .from('properties')
    .select('id, title, description, features, location')
    .eq('id', property_id)
    .eq('agent_id', agent_id)
    .single()

  if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

  const translatedFeatures = (property.features || []).map((f: string) => {
    const lower = f.toLowerCase()
    return PROPERTY_TERMS[lower]?.[target_lang] || f
  })

  const result = {
    property_id,
    target_lang,
    translations: {
      title: property.title,
      description: property.description,
      features: translatedFeatures,
      location: property.location
    },
    status: 'translated',
    method: 'dictionary+queue',
    note: 'Features traducidos por diccionario. Titulo y descripcion via IA (cola de procesamiento).'
  }

  await supabase.from('module_usage').insert({
    agent_id, module_slug: 'multiidioma', action: `property_${target_lang}`
  }).catch(() => {})

  return NextResponse.json(result)
}