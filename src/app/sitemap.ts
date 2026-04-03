import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/demos`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/legal/terminos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/privacidad`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/legal/aviso-legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Template demo pages
  const templates = ['luxury', 'mediterranean', 'corporate', 'boutique', 'classic', 'data']
  const demoPages: MetadataRoute.Sitemap = templates.map(t => ({
    url: `${baseUrl}/demos/${t}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic agent pages
  let agentPages: MetadataRoute.Sitemap = []
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: agents } = await supabase
      .from('agent_profiles')
      .select('slug, updated_at')
      .not('slug', 'is', null)
      .or('is_demo.is.null,is_demo.eq.false')

    if (agents) {
      agentPages = agents.map(agent => ({
        url: `${baseUrl}/agent/${agent.slug}`,
        lastModified: agent.updated_at ? new Date(agent.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // If DB is unavailable, return static pages only
  }

  // Dynamic property pages
  let propertyPages: MetadataRoute.Sitemap = []
  try {
    const supabase2 = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: properties } = await supabase2
      .from('properties')
      .select('id, updated_at')
      .eq('is_active', true)

    if (properties) {
      propertyPages = properties.map(p => ({
        url: `${baseUrl}/property/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // If DB is unavailable, skip property pages
  }

  return [...staticPages, ...demoPages, ...agentPages, ...propertyPages]
}
