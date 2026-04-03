import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import AgentPageClient from './AgentPageClient'
import { TemplateData } from '@/components/templates/types'
import {
  getAgentTitle,
  getAgentCanonicalUrl,
  truncateDescription,
  getAgentJsonLd,
} from '@/lib/seo'
import { FREE_LANGUAGES, SUPPORTED_LANGUAGES } from '@/lib/i18n'
import { TranslationsMap } from '@/lib/i18n/content'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getAgentData(slug: string) {
  const supabase = getSupabase()

  const { data: agent, error } = await supabase
    .from('agent_profiles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !agent) return null

  const [
    { data: heroConfig },
    { data: sections },
    { data: properties },
    { data: testimonials },
    { data: services },
    { data: zones },
    { data: team },
  ] = await Promise.all([
    supabase.from('hero_config').select('*').eq('agent_id', agent.id).single(),
    supabase.from('agent_sections').select('*').eq('agent_id', agent.id).eq('is_active', true).order('display_order', { ascending: true }),
    supabase.from('properties').select('*').eq('agent_id', agent.id).eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('testimonials').select('*').eq('agent_id', agent.id).order('created_at', { ascending: false }),
    supabase.from('services').select('*').eq('agent_id', agent.id).order('created_at', { ascending: false }),
    supabase.from('zones').select('*').eq('agent_id', agent.id).order('created_at', { ascending: false }),
    supabase.from('team_members').select('*').eq('agent_id', agent.id).order('created_at', { ascending: false }),
  ])

  return { agent, heroConfig, sections, properties, testimonials, services, zones, team }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const result = await getAgentData(params.slug)
  if (!result) return { title: 'Agente no encontrado' }

  const { agent } = result
  const title = getAgentTitle(agent)
  const description = truncateDescription(agent.bio) || `Agente inmobiliario en ${agent.city || 'Tenerife'}`
  const canonical = getAgentCanonicalUrl(agent.slug, agent.custom_domain)
  const image = agent.bio_photo_url || agent.photo_url

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: image ? [{ url: image, width: 1200, height: 630, alt: title }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

function getAvailableLanguages(hasMultiidiomaModule: boolean): string[] {
  if (hasMultiidiomaModule) {
    return SUPPORTED_LANGUAGES.map(l => l.code)
  }
  return [...FREE_LANGUAGES]
}

function detectLanguage(searchParams: Record<string, string | undefined>, availableLanguages: string[]): string {
  // 1. Query param
  if (searchParams.lang && availableLanguages.includes(searchParams.lang)) {
    return searchParams.lang
  }
  // 2. Accept-Language header
  const headersList = headers()
  const acceptLang = headersList.get('accept-language') || ''
  const browserLangs = acceptLang.split(',').map(l => l.split(';')[0].trim().slice(0, 2))
  for (const lang of browserLangs) {
    if (availableLanguages.includes(lang)) return lang
  }
  // 3. Fallback
  return 'es'
}

async function fetchTranslations(agentId: string, lang: string): Promise<TranslationsMap | null> {
  if (lang === 'es') return null
  const supabase = getSupabase()
  const { data } = await supabase
    .from('content_translations')
    .select('source_table, source_id, source_field, translated_text')
    .eq('agent_id', agentId)
    .eq('target_language', lang)
    .eq('status', 'completed')

  if (!data?.length) return null

  const organized: TranslationsMap = {}
  for (const row of data) {
    if (!organized[row.source_table]) organized[row.source_table] = {}
    if (!organized[row.source_table][row.source_id]) organized[row.source_table][row.source_id] = {}
    organized[row.source_table][row.source_id][row.source_field] = row.translated_text
  }
  return organized
}

export default async function AgentPublicPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: Record<string, string | undefined>
}) {
  const result = await getAgentData(params.slug)
  if (!result) notFound()

  const { agent, heroConfig, properties, testimonials, services, zones, team } = result

  // Check if agent has multiidioma module
  const supabase = getSupabase()
  const { data: moduleData } = await supabase
    .from('agent_modules')
    .select('module_id')
    .eq('agent_id', agent.id)
    .eq('is_active', true)

  const moduleIds = (moduleData || []).map((m: Record<string, unknown>) => m.module_id as string)
  const hasMultiidioma = moduleIds.some(id => id === 'multiidioma' || id === 'multi-idioma')

  const availableLanguages = getAvailableLanguages(hasMultiidioma)
  const lang = detectLanguage(searchParams, availableLanguages)
  const translations = await fetchTranslations(agent.id, lang)

  const templateData: TemplateData = {
    agent: {
      full_name: agent.full_name || '',
      business_name: agent.business_name || '',
      slug: agent.slug || params.slug,
      template: agent.template || 'luxury',
      bio: agent.bio || '',
      phone: agent.phone || '',
      email: agent.email || '',
      languages: agent.languages || [],
      experience_years: agent.experience_years,
      photo: agent.photo_url || '',
      bio_photo_url: agent.bio_photo_url || '',
      city: agent.city || '',
      stats: agent.stats || {},
      quote: agent.quote || '',
      whatsapp: agent.whatsapp || '',
      location: agent.location || agent.city || '',
    },
    properties: (properties || []).map((p: Record<string, unknown>) => ({
      id: p.id as string,
      title: (p.title as string) || '',
      price: (p.price as number) || 0,
      location: (p.location as string) || (p.city as string) || '',
      bedrooms: (p.bedrooms as number) || 0,
      bathrooms: (p.bathrooms as number) || 0,
      area_m2: (p.area_m2 as number) || (p.area_built as number) || 0,
      size_m2: (p.area_m2 as number) || (p.area_built as number) || 0,
      operation_type: ((p.operation_type as string) || 'sale') as 'sale' | 'rent_long' | 'rent_vacation',
      images: Array.isArray(p.images) ? (p.images as string[]) :
        (p.main_image_url ? [p.main_image_url as string] : []),
      is_active: true,
      badge: (p.badge as string) || undefined,
    })),
    hero: heroConfig ? {
      headline: heroConfig.headline || '',
      title: heroConfig.headline || '',
      subtitle: heroConfig.subtitle || '',
      cta_text: heroConfig.cta_text || '',
      background_image_url: heroConfig.background_image_url || '',
      image: heroConfig.background_image_url || '',
    } : undefined,
    testimonials: (testimonials || []).map((t: Record<string, unknown>) => ({
      id: t.id as string,
      author: (t.client_name as string) || (t.author as string) || '',
      text: (t.content as string) || (t.text as string) || '',
      quote: (t.quote as string) || (t.content as string) || (t.text as string) || '',
      client_name: (t.client_name as string) || '',
      client_location: (t.client_location as string) || '',
      rating: (t.rating as number) || 5,
    })),
    team: (team || []).map((m: Record<string, unknown>) => ({
      id: m.id as string,
      name: (m.name as string) || (m.full_name as string) || '',
      role: (m.role as string) || (m.position as string) || '',
      photo: (m.photo_url as string) || (m.photo as string) || '',
      photo_url: (m.photo_url as string) || '',
      languages: Array.isArray(m.languages) ? (m.languages as string[]) : [],
    })),
    services: (services || []).map((s: Record<string, unknown>) => ({
      id: s.id as string,
      title: (s.title as string) || (s.name as string) || '',
      description: (s.description as string) || '',
    })),
    zones: (zones || []).map((z: Record<string, unknown>) => ({
      id: z.id as string,
      name: (z.name as string) || '',
      description: (z.description as string) || '',
      image: (z.image_url as string) || (z.image as string) || '',
      image_url: (z.image_url as string) || '',
      property_count: (z.property_count as number) || 0,
    })),
  }

  const templateId = agent.template || 'luxury'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getAgentJsonLd(agent)) }}
      />
      <AgentPageClient
        data={templateData}
        templateId={templateId}
        agentId={agent.id}
        lang={lang}
        translations={translations}
        availableLanguages={availableLanguages}
      />
    </>
  )
}
