import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Supported portals and their patterns
const PORTAL_PATTERNS: Record<string, {
  name: string
  propertySelector: RegExp
  titlePattern: RegExp
  pricePattern: RegExp
  detailsPattern: RegExp
  imagePattern: RegExp
  locationPattern: RegExp
}> = {
  'idealista.com': {
    name: 'Idealista',
    propertySelector: /class="item-info-container"[\s\S]*?<\/article>/g,
    titlePattern: /<a[^>]*class="item-link"[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/,
    pricePattern: /<span[^>]*class="item-price"[^>]*>([\d.,]+)/,
    detailsPattern: /(\d+)\s*hab[\s\S]*?(\d+)\s*m/i,
    imagePattern: /src="(https:\/\/img\d?\.idealista\.com\/[^"]+)"/g,
    locationPattern: /<span[^>]*class="item-detail"[^>]*>([\s\S]*?)<\/span>/,
  },
  'fotocasa.es': {
    name: 'Fotocasa',
    propertySelector: /class="re-CardPackAdvance"[\s\S]*?<\/article>/g,
    titlePattern: /<span[^>]*class="re-CardTitle"[^>]*>([\s\S]*?)<\/span>/,
    pricePattern: /<span[^>]*class="re-CardPrice"[^>]*>([\d.,]+)/,
    detailsPattern: /(\d+)\s*hab[\s\S]*?(\d+)\s*m/i,
    imagePattern: /src="(https:\/\/[^"]*fotocasa[^"]+\.(?:jpg|jpeg|png|webp))"/gi,
    locationPattern: /<span[^>]*class="re-CardLocation"[^>]*>([\s\S]*?)<\/span>/,
  },
}

function detectPortal(url: string): string | null {
  for (const domain of Object.keys(PORTAL_PATTERNS)) {
    if (url.includes(domain)) return domain
  }
  return null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 100)
}

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0
}

function guessPropertyType(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('villa') || t.includes('chalet')) return 'villa'
  if (t.includes('ático') || t.includes('atico') || t.includes('penthouse')) return 'penthouse'
  if (t.includes('adosado') || t.includes('townhouse') || t.includes('pareado')) return 'townhouse'
  if (t.includes('local') || t.includes('oficina') || t.includes('comercial')) return 'commercial'
  if (t.includes('terreno') || t.includes('parcela') || t.includes('solar')) return 'land'
  if (t.includes('finca') || t.includes('rústica')) return 'finca'
  return 'apartment'
}

function guessOperationType(title: string, price: number): string {
  const t = title.toLowerCase()
  if (t.includes('alquiler') || t.includes('alquilar') || t.includes('rent')) {
    if (t.includes('vacacion') || t.includes('temporal') || t.includes('holiday')) return 'rent_vacation'
    return 'rent_long'
  }
  // Low prices are likely rentals
  if (price > 0 && price < 3000) return 'rent_long'
  return 'sale'
}

// POST: Scrape properties from URL (returns previews, doesn't save)
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { url } = await request.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL no válida' }, { status: 400 })
    }

    // Validate URL format and prevent SSRF
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'URL no válida' }, { status: 400 })
    }

    // Only allow HTTPS and known portal domains
    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Solo se permiten URLs HTTPS' }, { status: 400 })
    }

    const allowedDomains = ['idealista.com', 'fotocasa.es', 'kyero.com', 'pisos.com', 'yaencontre.com']
    const isAllowedDomain = allowedDomains.some(d => parsedUrl.hostname === d || parsedUrl.hostname.endsWith('.' + d))
    if (!isAllowedDomain) {
      return NextResponse.json({ error: 'Portal no soportado. Portales válidos: Idealista, Fotocasa, Kyero, Pisos.com, Yaencontre' }, { status: 400 })
    }

    const portal = detectPortal(url)

    // Try to fetch the page
    let html: string
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json({
          error: `El portal respondió con error ${response.status}. Algunos portales bloquean la extracción automática. Prueba exportando a CSV desde tu panel del portal.`,
        }, { status: 422 })
      }

      html = await response.text()
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return NextResponse.json({
          error: 'La conexión tardó demasiado. El portal puede estar bloqueando peticiones automáticas.',
        }, { status: 408 })
      }
      return NextResponse.json({
        error: 'No se pudo conectar con el portal. Verifica la URL e inténtalo de nuevo.',
      }, { status: 422 })
    }

    // Generic extraction: look for JSON-LD structured data first (most reliable)
    const properties: any[] = []

    // Try JSON-LD extraction (works on many modern portals)
    const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) || []
    for (const match of jsonLdMatches) {
      try {
        const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim()
        const data = JSON.parse(jsonStr)

        // Handle arrays and single items
        const items = Array.isArray(data) ? data : data['@graph'] || [data]
        for (const item of items) {
          if (item['@type'] === 'RealEstateListing' || item['@type'] === 'Product' ||
              item['@type'] === 'Apartment' || item['@type'] === 'House' ||
              item['@type'] === 'Residence' || item['@type'] === 'Offer') {
            const title = item.name || item.headline || ''
            const price = parsePrice(String(item.offers?.price || item.price || item.offers?.lowPrice || '0'))
            const description = item.description || ''
            const images: string[] = []

            if (item.image) {
              const imgs = Array.isArray(item.image) ? item.image : [item.image]
              imgs.forEach((img: any) => {
                if (typeof img === 'string') images.push(img)
                else if (img?.url) images.push(img.url)
                else if (img?.contentUrl) images.push(img.contentUrl)
              })
            }

            const location = item.address?.addressLocality ||
              item.address?.addressRegion ||
              item.contentLocation?.name || ''

            if (title) {
              properties.push({
                title: title.trim().slice(0, 200),
                price,
                type: guessPropertyType(title),
                operation: guessOperationType(title, price),
                bedrooms: parseInt(item.numberOfRooms || item.numberOfBedrooms || '0', 10) || 0,
                bathrooms: parseInt(item.numberOfBathroomsTotal || '0', 10) || 0,
                size_m2: parseInt(item.floorSize?.value || '0', 10) || 0,
                location: location.trim(),
                description: description.slice(0, 500),
                images: images.slice(0, 10),
                url: item.url || url,
              })
            }
          }
        }
      } catch {
        // JSON parse failed, continue
      }
    }

    // If JSON-LD didn't work, try Open Graph / meta tags extraction
    if (properties.length === 0) {
      // Try to extract from common HTML patterns
      // Look for property cards with common class names
      const cardPatterns = [
        /class="[^"]*(?:property|listing|item|card|resultado)[^"]*"[\s\S]*?(?=class="[^"]*(?:property|listing|item|card|resultado)[^"]*"|$)/gi,
      ]

      // Extract individual listing URLs for potential per-page scraping
      const listingUrls: string[] = []
      const linkRegex = /href="(\/(?:inmueble|propiedad|property|listing|vivienda)[^"]*\d[^"]*)"/gi
      let linkMatch
      while ((linkMatch = linkRegex.exec(html)) !== null) {
        const href = linkMatch[1]
        try {
          const fullUrl = new URL(href, url).href
          if (!listingUrls.includes(fullUrl)) listingUrls.push(fullUrl)
        } catch { /* invalid URL */ }
      }

      // Also look for og:title as fallback for single property pages
      const ogTitle = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)?.[1]
      const ogPrice = html.match(/(\d{1,3}(?:[.,]\d{3})*)\s*€/)?.[1]
      const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)?.[1]
      const ogDesc = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i)?.[1]

      if (ogTitle && ogPrice) {
        const price = parsePrice(ogPrice)
        properties.push({
          title: ogTitle.trim().slice(0, 200),
          price,
          type: guessPropertyType(ogTitle),
          operation: guessOperationType(ogTitle, price),
          bedrooms: parseInt(html.match(/(\d+)\s*(?:hab|dorm|bedroom)/i)?.[1] || '0', 10) || 0,
          bathrooms: parseInt(html.match(/(\d+)\s*(?:baño|bath)/i)?.[1] || '0', 10) || 0,
          size_m2: parseInt(html.match(/(\d+)\s*m[²2]/i)?.[1] || '0', 10) || 0,
          location: html.match(/<meta[^>]*property="og:locality"[^>]*content="([^"]+)"/i)?.[1] ||
            html.match(/<meta[^>]*name="geo.placename"[^>]*content="([^"]+)"/i)?.[1] || '',
          description: (ogDesc || '').slice(0, 500),
          images: ogImage ? [ogImage] : [],
          url,
        })
      }

      // Try to extract multiple properties from price+title patterns in the HTML
      if (properties.length === 0) {
        // Look for structured price data with nearby title text
        const priceBlocks = html.match(/(?:\d{1,3}(?:[.,]\d{3})+)\s*€/g) || []
        if (priceBlocks.length > 1) {
          // Likely a listing page, but we couldn't extract structured data
          return NextResponse.json({
            error: `Detectamos ${priceBlocks.length} posibles propiedades en la página, pero no pudimos extraer los datos estructurados. Este portal puede requerir JavaScript para cargar el contenido. Prueba exportando tus propiedades a CSV desde tu panel del portal e importándolas aquí.`,
            suggestion: 'csv',
          }, { status: 422 })
        }
      }
    }

    if (properties.length === 0) {
      return NextResponse.json({
        error: 'No se encontraron propiedades en esta URL. Asegúrate de que el enlace es de un perfil de agente o listado de propiedades. Si el portal usa JavaScript para cargar el contenido, prueba con la importación por CSV.',
        suggestion: 'csv',
      }, { status: 422 })
    }

    return NextResponse.json({
      properties,
      portal: portal ? PORTAL_PATTERNS[portal]?.name : 'Desconocido',
      count: properties.length,
    })

  } catch (err) {
    console.error('Scrape error:', err)
    return NextResponse.json({ error: 'Error interno al procesar la URL' }, { status: 500 })
  }
}

// PUT: Save selected scraped properties to database
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { properties } = await request.json()
    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json({ error: 'No hay propiedades para importar' }, { status: 400 })
    }

    const errors: Array<{ row: number; error: string }> = []
    let success = 0

    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i]
      try {
        const title = (prop.title || '').trim()
        if (!title) {
          errors.push({ row: i + 1, error: 'Título vacío' })
          continue
        }

        const slug = slugify(title) + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

        const validTypes = ['villa', 'apartment', 'penthouse', 'townhouse', 'commercial', 'land', 'finca']
        const validOps = ['sale', 'rent_long', 'rent_vacation']

        const { error: insertError } = await supabase.from('properties').insert({
          agent_id: user.id,
          title,
          slug,
          description: (prop.description || '').slice(0, 2000),
          property_type: validTypes.includes(prop.type) ? prop.type : 'apartment',
          operation_type: validOps.includes(prop.operation) ? prop.operation : 'sale',
          price: Math.max(0, parseInt(prop.price, 10) || 0),
          bedrooms: Math.max(0, parseInt(prop.bedrooms, 10) || 0),
          bathrooms: Math.max(0, parseInt(prop.bathrooms, 10) || 0),
          size_m2: Math.max(0, parseInt(prop.size_m2, 10) || 0),
          location: (prop.location || '').slice(0, 200),
          images: Array.isArray(prop.images) ? prop.images.slice(0, 10) : [],
          is_active: false, // Import as draft
          source_url: prop.url || null,
        })

        if (insertError) {
          errors.push({ row: i + 1, error: insertError.message })
        } else {
          success++
        }
      } catch (err: any) {
        errors.push({ row: i + 1, error: err?.message || 'Error desconocido' })
      }
    }

    return NextResponse.json({
      total: properties.length,
      success,
      errors,
      message: success > 0
        ? `Se importaron ${success} propiedades correctamente${errors.length > 0 ? ` (${errors.length} errores)` : ''}`
        : 'No se pudo importar ninguna propiedad',
    })

  } catch (err) {
    console.error('Import scraped error:', err)
    return NextResponse.json({ error: 'Error interno al importar' }, { status: 500 })
  }
}
