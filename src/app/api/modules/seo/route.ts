import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { getAgentModules, hasModule, MODULE } from '@/lib/module-engine'

// GET: Generate SEO data for an agent's page
export async function GET(req: NextRequest) {
  const agentId = req.nextUrl.searchParams.get('agent_id')
  if (!agentId) return NextResponse.json({ error: 'agent_id required' }, { status: 400 })

  const modules = await getAgentModules(agentId)
  if (!hasModule(modules, MODULE.SEO)) {
    return NextResponse.json({ error: 'SEO module not active', upgrade: true }, { status: 403 })
  }

  const supabase = createClient()
  const { data: agent } = await supabase.from('agent_profiles').select('*').eq('id', agentId).single()
  const { data: properties } = await supabase.from('properties').select('title, slug, description, location, price, operation_type').eq('agent_id', agentId).limit(100)

  if (!agent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

  // Generate meta tags
  const metaTags = {
    title: `${agent.business_name || agent.full_name} - Propiedades en ${agent.location || 'Tenerife'} | HabiBook`,
    description: agent.bio ? agent.bio.substring(0, 160) : `Encuentra las mejores propiedades con ${agent.full_name}. Compraventa y alquiler en ${agent.location || 'Tenerife'}.`,
    keywords: generateKeywords(agent, properties || []),
    og_image: agent.bio_photo_url || 'https://www.habibook.com/og-default.jpg',
    canonical: `https://www.habibook.com/agent/${agent.slug}`,
  }

  // Generate JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.business_name || agent.full_name,
    description: metaTags.description,
    url: metaTags.canonical,
    image: metaTags.og_image,
    address: {
      '@type': 'PostalAddress',
      addressLocality: agent.location || 'Tenerife',
      addressCountry: 'ES',
    },
    ...(agent.phone && { telephone: agent.phone }),
    ...(agent.email && { email: agent.email }),
    makesOffer: (properties || []).slice(0, 10).map(p => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'RealEstateListing',
        name: p.title,
        description: p.description?.substring(0, 200),
        price: p.price,
        priceCurrency: 'EUR',
      }
    }))
  }

  // Generate sitemap URLs
  const sitemapUrls = [
    { loc: metaTags.canonical, priority: 1.0 },
    ...(properties || []).map(p => ({
      loc: `${metaTags.canonical}/property/${p.slug}`,
      priority: 0.8
    }))
  ]

  // Log usage
  await supabase.from('module_usage').insert({
    agent_id: agentId, module_slug: 'seo', usage_type: 'seo_generation', quantity: 1
  })

  return NextResponse.json({ metaTags, schema, sitemapUrls })
}

function generateKeywords(agent: any, properties: any[]): string {
  const base = ['inmobiliaria', 'propiedades', agent.location || 'Tenerife', 'comprar', 'alquilar', 'HabiBook']
  const locations = [...new Set(properties.map(p => p.location).filter(Boolean))]
  const types = [...new Set(properties.map(p => p.operation_type).filter(Boolean))]
  return [...base, ...locations, ...types.map(t => t === 'sale' ? 'venta' : 'alquiler')].join(', ')
}