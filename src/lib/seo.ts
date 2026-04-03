const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com'

/**
 * Devuelve la URL canonica del agente.
 * Si tiene dominio propio -> https://{custom_domain}
 * Si no -> https://habibook.com/agent/{slug}
 */
export function getAgentCanonicalUrl(slug: string, customDomain?: string | null): string {
  if (customDomain?.trim()) {
    return `https://${customDomain.trim()}`
  }
  return `${BASE_URL}/agent/${slug}`
}

/**
 * Devuelve la URL canonica de una propiedad.
 */
export function getPropertyCanonicalUrl(id: string, customDomain?: string | null): string {
  if (customDomain?.trim()) {
    return `https://${customDomain.trim()}/property/${id}`
  }
  return `${BASE_URL}/property/${id}`
}

/**
 * Genera titulo SEO para agente.
 */
export function getAgentTitle(agent: {
  business_name?: string | null
  full_name?: string | null
  city?: string | null
}): string {
  const name = agent.business_name || agent.full_name || 'Agente Inmobiliario'
  const city = agent.city ? ` en ${agent.city}` : ''
  return `${name} — Inmobiliaria${city}`
}

/**
 * Genera titulo SEO para propiedad.
 */
export function getPropertyTitle(property: {
  property_type?: string | null
  bedrooms?: number | null
  city?: string | null
  price?: number | null
  operation_type?: string | null
}): string {
  const type = property.property_type || 'Propiedad'
  const beds = property.bedrooms ? ` ${property.bedrooms} hab` : ''
  const city = property.city ? ` en ${property.city}` : ''
  const price = property.price ? ` — ${property.price.toLocaleString('es-ES')}€` : ''
  const operation = property.operation_type === 'sale' ? ' en venta' : ' en alquiler'
  return `${type}${beds}${operation}${city}${price}`.trim()
}

/**
 * Trunca texto para description meta (max 160 chars).
 */
export function truncateDescription(text: string | null | undefined, maxLength: number = 160): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3).trim() + '...'
}

/**
 * Genera JSON-LD RealEstateAgent para un agente.
 */
export function getAgentJsonLd(agent: {
  business_name?: string | null
  full_name?: string | null
  bio?: string | null
  city?: string | null
  phone?: string | null
  email?: string | null
  bio_photo_url?: string | null
  languages?: string[] | null
  custom_domain?: string | null
  slug: string
}): Record<string, unknown> {
  const canonicalUrl = getAgentCanonicalUrl(agent.slug, agent.custom_domain)
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agent.business_name || agent.full_name || 'Agente',
    description: truncateDescription(agent.bio),
    url: canonicalUrl,
    ...(agent.bio_photo_url && { image: agent.bio_photo_url }),
    ...(agent.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: agent.city,
        addressRegion: 'Tenerife',
        addressCountry: 'ES',
      },
    }),
    ...(agent.phone && { telephone: agent.phone }),
    ...(agent.email && { email: agent.email }),
    ...(agent.languages?.length && { knowsLanguage: agent.languages }),
  }
}

/**
 * Genera JSON-LD RealEstateListing para una propiedad.
 */
export function getPropertyJsonLd(property: {
  title?: string | null
  description?: string | null
  price?: number | null
  city?: string | null
  address?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  area_m2?: number | null
  main_image_url?: string | null
  images?: string[] | null
  id: string
  agent?: { custom_domain?: string | null } | null
}): Record<string, unknown> {
  const canonicalUrl = getPropertyCanonicalUrl(property.id, property.agent?.custom_domain)
  const allImages = [
    ...(property.main_image_url ? [property.main_image_url] : []),
    ...(property.images || []),
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title || 'Propiedad',
    description: truncateDescription(property.description),
    url: canonicalUrl,
    ...(allImages.length && { image: allImages }),
    ...(property.price && {
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'EUR',
      },
    }),
    ...(property.city && {
      address: {
        '@type': 'PostalAddress',
        ...(property.address && { streetAddress: property.address }),
        addressLocality: property.city,
        addressRegion: 'Tenerife',
        addressCountry: 'ES',
      },
    }),
    ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms && { numberOfBathroomsTotal: property.bathrooms }),
    ...(property.area_m2 && {
      floorSize: { '@type': 'QuantitativeValue', value: property.area_m2, unitCode: 'MTK' },
    }),
  }
}
