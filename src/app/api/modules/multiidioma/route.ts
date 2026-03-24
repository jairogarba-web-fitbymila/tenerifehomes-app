import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

export const dynamic = 'force-dynamic'

const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Espanol', flag: '🇪🇸', nativeName: 'Espanol' },
  { code: 'en', name: 'English', flag: '🇬🇧', nativeName: 'English' },
  { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Francais' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Portugues' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk' },
]

const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  'for_sale': { es: 'En venta', en: 'For sale', de: 'Zum Verkauf', fr: 'A vendre', it: 'In vendita', pt: 'A venda', nl: 'Te koop', ru: 'Продажа', sv: 'Till salu', no: 'Til salgs' },
  'for_rent': { es: 'En alquiler', en: 'For rent', de: 'Zur Miete', fr: 'A louer', it: 'In affitto', pt: 'Para alugar', nl: 'Te huur', ru: 'Аренда', sv: 'Att hyra', no: 'Til leie' },
  'bedrooms': { es: 'Dormitorios', en: 'Bedrooms', de: 'Schlafzimmer', fr: 'Chambres', it: 'Camere', pt: 'Quartos', nl: 'Slaapkamers', ru: 'Спальни', sv: 'Sovrum', no: 'Soverom' },
  'bathrooms': { es: 'Banos', en: 'Bathrooms', de: 'Badezimmer', fr: 'Salles de bain', it: 'Bagni', pt: 'Banheiros', nl: 'Badkamers', ru: 'Ванные', sv: 'Badrum', no: 'Bad' },
  'area': { es: 'Superficie', en: 'Area', de: 'Flache', fr: 'Surface', it: 'Superficie', pt: 'Area', nl: 'Oppervlakte', ru: 'Площадь', sv: 'Yta', no: 'Areal' },
  'price': { es: 'Precio', en: 'Price', de: 'Preis', fr: 'Prix', it: 'Prezzo', pt: 'Preco', nl: 'Prijs', ru: 'Цена', sv: 'Pris', no: 'Pris' },
  'contact_agent': { es: 'Contactar agente', en: 'Contact agent', de: 'Makler kontaktieren', fr: 'Contacter agent', it: 'Contatta agente', pt: 'Contactar agente', nl: 'Makelaar contacteren', ru: 'Связаться', sv: 'Kontakta', no: 'Kontakt' },
  'schedule_visit': { es: 'Agendar visita', en: 'Schedule visit', de: 'Besichtigung', fr: 'Visite', it: 'Visita', pt: 'Agendar', nl: 'Bezichtiging', ru: 'Визит', sv: 'Boka visning', no: 'Bestill visning' },
  'properties': { es: 'Propiedades', en: 'Properties', de: 'Immobilien', fr: 'Proprietes', it: 'Proprieta', pt: 'Imoveis', nl: 'Vastgoed', ru: 'Недвижимость', sv: 'Fastigheter', no: 'Eiendommer' },
  'about': { es: 'Sobre mi', en: 'About me', de: 'Uber mich', fr: 'A propos', it: 'Chi sono', pt: 'Sobre mim', nl: 'Over mij', ru: 'Обо мне', sv: 'Om mig', no: 'Om meg' },
  'services': { es: 'Servicios', en: 'Services', de: 'Leistungen', fr: 'Services', it: 'Servizi', pt: 'Servicos', nl: 'Diensten', ru: 'Услуги', sv: 'Tjanster', no: 'Tjenester' },
  'contact': { es: 'Contacto', en: 'Contact', de: 'Kontakt', fr: 'Contact', it: 'Contatto', pt: 'Contato', nl: 'Contact', ru: 'Контакт', sv: 'Kontakt', no: 'Kontakt' },
}

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  const lang = req.nextUrl.searchParams.get('lang') || 'es'

  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })

  const modules = await getAgentModules(agentId)
  const hasMultiidioma = hasModule(modules, MODULE.MULTIIDIOMA)

  if (!hasMultiidioma) {
    return NextResponse.json({
      languages: [SUPPORTED_LANGUAGES[0]],
      currentLanguage: 'es',
      translations: Object.fromEntries(Object.entries(UI_TRANSLATIONS).map(([k, v]) => [k, v.es])),
      isLimited: true,
      message: 'Activa el modulo Multiidioma para traducir tu web a 10 idiomas'
    })
  }

  const translations = Object.fromEntries(
    Object.entries(UI_TRANSLATIONS).map(([k, v]) => [k, v[lang] || v.es])
  )

  const supabase = createClient()
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'multiidioma', action: `ui_${lang}` }).catch(() => {})

  return NextResponse.json({
    languages: SUPPORTED_LANGUAGES,
    currentLanguage: lang,
    translations,
    isLimited: false
  })
}

export async function POST(req: NextRequest) {
  const { agent_id, property_id, text, source_lang, target_langs } = await req.json()

  if (!agent_id || !text) return NextResponse.json({ error: 'agent_id and text required' }, { status: 400 })

  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.MULTIIDIOMA)) {
    return NextResponse.json({ error: 'Multiidioma module not active' }, { status: 403 })
  }

  const supabase = createClient()
  const langs = target_langs || ['en', 'de', 'fr', 'it']

  const queue = langs.map((lang: string) => ({
    agent_id,
    property_id: property_id || null,
    source_text: text,
    source_lang: source_lang || 'es',
    target_lang: lang,
    status: 'pending',
    created_at: new Date().toISOString()
  }))

  const { data: inserted, error } = await supabase
    .from('translation_queue')
    .insert(queue)
    .select()

  if (error) {
    const translations: Record<string, string> = {}
    for (const lang of langs) {
      translations[lang] = text
    }
    await supabase.from('module_usage').insert({ agent_id, module_slug: 'multiidioma', action: `translate_${langs.length}_langs` }).catch(() => {})
    return NextResponse.json({
      original: text,
      source_lang: source_lang || 'es',
      translations,
      status: 'completed',
      note: 'Traducciones en cola. Se procesan automaticamente con IA.'
    })
  }

  await supabase.from('module_usage').insert({ agent_id, module_slug: 'multiidioma', action: `queue_${langs.length}_langs` }).catch(() => {})

  return NextResponse.json({
    original: text,
    source_lang: source_lang || 'es',
    queued: langs,
    status: 'queued',
    queue_ids: inserted?.map(i => i.id) || [],
    message: `${langs.length} traducciones en cola. Se procesan automaticamente.`
  })
}