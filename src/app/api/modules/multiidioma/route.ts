import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

const TRANSLATIONS: Record<string, Record<string, string>> = {
  'property_for_sale': { es: 'Propiedad en venta', en: 'Property for sale', de: 'Immobilie zum Verkauf', fr: 'Propriété à vendre', it: 'Proprietà in vendita', pt: 'Imóvel à venda', nl: 'Vastgoed te koop', ru: 'Недвижимость на продажу', zh: '待售房产', ar: 'عقار للبيع' },
  'bedrooms': { es: 'Dormitorios', en: 'Bedrooms', de: 'Schlafzimmer', fr: 'Chambres', it: 'Camere', pt: 'Quartos', nl: 'Slaapkamers', ru: 'Спальни', zh: '卧室', ar: 'غرف النوم' },
  'bathrooms': { es: 'Baños', en: 'Bathrooms', de: 'Badezimmer', fr: 'Salles de bain', it: 'Bagni', pt: 'Banheiros', nl: 'Badkamers', ru: 'Ванные', zh: '浴室', ar: 'حمامات' },
  'contact_agent': { es: 'Contactar agente', en: 'Contact agent', de: 'Makler kontaktieren', fr: 'Contacter agent', it: 'Contatta agente', pt: 'Contactar agente', nl: 'Makelaar contacteren', ru: 'Связаться с агентом', zh: '联系经纪人', ar: 'اتصل بالوكيل' },
  'schedule_visit': { es: 'Programar visita', en: 'Schedule visit', de: 'Besichtigung vereinbaren', fr: 'Planifier visite', it: 'Programma visita', pt: 'Agendar visita', nl: 'Bezichtiging plannen', ru: 'Запланировать визит', zh: '预约看房', ar: 'جدولة زيارة' },
  'price': { es: 'Precio', en: 'Price', de: 'Preis', fr: 'Prix', it: 'Prezzo', pt: 'Preço', nl: 'Prijs', ru: 'Цена', zh: '价格', ar: 'السعر' },
  'area': { es: 'Superficie', en: 'Area', de: 'Fläche', fr: 'Surface', it: 'Superficie', pt: 'Área', nl: 'Oppervlakte', ru: 'Площадь', zh: '面积', ar: 'المساحة' },
}

export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  const lang = req.nextUrl.searchParams.get('lang') || 'es'
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })
  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.MULTIIDIOMA)) {
    return NextResponse.json({ languages: [SUPPORTED_LANGUAGES[0]], translations: Object.fromEntries(Object.entries(TRANSLATIONS).map(([k, v]) => [k, v.es])), isLimited: true })
  }
  const supabase = createClient()
  const translations = Object.fromEntries(Object.entries(TRANSLATIONS).map(([k, v]) => [k, v[lang] || v.es]))
  await supabase.from('module_usage').insert({ agent_id: agentId, module_slug: 'multiidioma', action: `translate_${lang}` })
  return NextResponse.json({ languages: SUPPORTED_LANGUAGES, currentLanguage: lang, translations, isLimited: false })
}

export async function POST(req: NextRequest) {
  const { agent_id, text, from_lang, to_lang } = await req.json()
  if (!agent_id || !text || !to_lang) return NextResponse.json({ error: 'agent_id, text, and to_lang required' }, { status: 400 })
  const modules = await getAgentModules(agent_id)
  if (!hasModule(modules, MODULE.MULTIIDIOMA)) {
    return NextResponse.json({ error: 'Multiidioma module not active', upgrade: true }, { status: 403 })
  }
  const supabase = createClient()
  await supabase.from('module_usage').insert({ agent_id, module_slug: 'multiidioma', action: `custom_translate_${to_lang}` })
  return NextResponse.json({
    original: text,
    translated: text,
    from: from_lang || 'es',
    to: to_lang,
    note: 'Translation via AI engine - connect OpenAI/Anthropic API key for production translations'
  })
}
