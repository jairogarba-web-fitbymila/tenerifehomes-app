# HabiBook — SEO Dinámico + Preparación Dominios Propios

## OBJETIVO
Implementar metadata dinámica, OpenGraph, Twitter Cards, JSON-LD y canonical URLs en TODAS las rutas públicas. Preparar la infraestructura SEO para soportar dominios propios de agentes (69€/año, cualquier plan, cualquier extensión).

## CONTEXTO
- Proyecto: Next.js 14.2.20 App Router + Supabase SSR + Tailwind
- Supabase project ID: lsrnbgfiftcslqccowfz
- Actualmente NINGUNA página pública tiene metadata dinámica (excepto las legales)
- El root layout tiene metadata genérica: "HabiBook — Plataforma Inmobiliaria"
- robots.ts y sitemap.ts ya existen pero el sitemap no incluye propiedades
- La página /agent/[slug] es 'use client' — necesita refactor a server component
- La página /property/[id] ya es server component — solo falta añadir generateMetadata
- next.config.js tiene ignoreBuildErrors: false e ignoreDuringBuilds: false — el build DEBE pasar limpio

## DECISIONES DE PRODUCTO (ya cerradas, NO cambiar)
1. **Fetch:** Directo a Supabase desde server components (no via API interna)
2. **JSON-LD:** Incluir RealEstateAgent schema para agentes y RealEstateListing para propiedades
3. **OG Image:** Usar foto real del agente / imagen principal de la propiedad (NO generar imágenes dinámicas)
4. **Título agente:** "{business_name || full_name} — Inmobiliaria en {city} | HabiBook"
5. **Título propiedad:** "{tipo} {bedrooms} hab en venta/alquiler en {city} — {price}€ | HabiBook"
6. **Redirect:** /agente/[slug] sigue redirigiendo 301 a /agent/[slug] (sin cambios)
7. **Canonical URLs dinámicas:** Si el agente tiene campo `custom_domain` en su perfil → canonical = https://{custom_domain}. Si no → canonical = https://habibook.com/agent/{slug}
8. **Dominio propio = URL canónica principal.** habibook.com/agent/slug redirige al dominio propio del agente si existe
9. **Dominio propio:** 69€/año, disponible en cualquier plan como pago extra, cualquier extensión (.com, .es, .de, .fr, etc.)

## INSTRUCCIONES PASO A PASO

### PASO 1 — Diagnóstico inicial
Antes de tocar código, ejecuta:
```bash
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
npx next lint 2>&1 | grep -c "Error"
```
Confirma que arranca con 0 errores de TS y 0 errores de ESLint. Si hay errores, corrígelos PRIMERO.

### PASO 2 — Añadir campo custom_domain a agent_profiles en Supabase
Ejecuta esta migración SQL en Supabase:
```sql
ALTER TABLE public.agent_profiles
ADD COLUMN IF NOT EXISTS custom_domain TEXT DEFAULT NULL;

COMMENT ON COLUMN public.agent_profiles.custom_domain IS 'Dominio propio del agente (ej: victorialaurent.com). Si existe, es la URL canónica.';
```
Esto NO rompe nada — es un campo nullable nuevo.

Después regenera los tipos:
```bash
npx supabase gen types typescript --project-id lsrnbgfiftcslqccowfz > src/types/database.ts
```

### PASO 3 — Crear helper de SEO
Crear `src/lib/seo.ts` con funciones helper reutilizables:

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com';

/**
 * Devuelve la URL canónica del agente.
 * Si tiene dominio propio → https://{custom_domain}
 * Si no → https://habibook.com/agent/{slug}
 */
export function getAgentCanonicalUrl(slug: string, customDomain?: string | null): string {
  if (customDomain?.trim()) {
    return `https://${customDomain.trim()}`;
  }
  return `${BASE_URL}/agent/${slug}`;
}

/**
 * Devuelve la URL canónica de una propiedad.
 * Si el agente tiene dominio propio → https://{custom_domain}/property/{id}
 * Si no → https://habibook.com/property/{id}
 */
export function getPropertyCanonicalUrl(id: string, customDomain?: string | null): string {
  if (customDomain?.trim()) {
    return `https://${customDomain.trim()}/property/${id}`;
  }
  return `${BASE_URL}/property/${id}`;
}

/**
 * Genera título SEO para agente.
 * Formato: "Nombre — Inmobiliaria en Ciudad"
 * (el root layout template añade " | HabiBook" automáticamente)
 */
export function getAgentTitle(agent: {
  business_name?: string | null;
  full_name?: string | null;
  city?: string | null;
}): string {
  const name = agent.business_name || agent.full_name || 'Agente Inmobiliario';
  const city = agent.city ? ` en ${agent.city}` : '';
  return `${name} — Inmobiliaria${city}`;
}

/**
 * Genera título SEO para propiedad.
 * Formato: "Tipo N hab en venta/alquiler en Ciudad — Precio€"
 */
export function getPropertyTitle(property: {
  property_type?: string | null;
  bedrooms?: number | null;
  city?: string | null;
  price?: number | null;
  operation_type?: string | null;
}): string {
  const type = property.property_type || 'Propiedad';
  const beds = property.bedrooms ? ` ${property.bedrooms} hab` : '';
  const city = property.city ? ` en ${property.city}` : '';
  const price = property.price ? ` — ${property.price.toLocaleString('es-ES')}€` : '';
  const operation = property.operation_type === 'sale' ? ' en venta' : ' en alquiler';
  return `${type}${beds}${operation}${city}${price}`.trim();
}

/**
 * Trunca texto para description meta (max 160 chars).
 */
export function truncateDescription(text: string | null | undefined, maxLength: number = 160): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/**
 * Genera JSON-LD RealEstateAgent para un agente.
 */
export function getAgentJsonLd(agent: {
  business_name?: string | null;
  full_name?: string | null;
  bio?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  bio_photo_url?: string | null;
  languages?: string[] | null;
  custom_domain?: string | null;
  slug: string;
}): Record<string, unknown> {
  const canonicalUrl = getAgentCanonicalUrl(agent.slug, agent.custom_domain);
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
  };
}

/**
 * Genera JSON-LD RealEstateListing para una propiedad.
 */
export function getPropertyJsonLd(property: {
  title?: string | null;
  description?: string | null;
  price?: number | null;
  city?: string | null;
  address?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_m2?: number | null;
  main_image_url?: string | null;
  images?: string[] | null;
  id: string;
  agent?: { custom_domain?: string | null } | null;
}): Record<string, unknown> {
  const canonicalUrl = getPropertyCanonicalUrl(property.id, property.agent?.custom_domain);
  const allImages = [
    ...(property.main_image_url ? [property.main_image_url] : []),
    ...(property.images || []),
  ];
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
  };
}
```

### PASO 4 — Refactorizar /agent/[slug] a server component
Este es el cambio MÁS IMPORTANTE. La página actual es 'use client' y fetcha datos en el cliente — Google no ve nada.

**Nuevo flujo:**
1. Renombra el page.tsx actual a `AgentPageClient.tsx` y conviértelo en client component que recibe TemplateData como prop
2. Crea un nuevo `page.tsx` como async SERVER component

**Estructura final:**
```
src/app/(public)/agent/[slug]/
  page.tsx            → Server component: fetch Supabase + generateMetadata + JSON-LD + render AgentPageClient
  AgentPageClient.tsx → Client component: recibe TemplateData, renderiza TemplateRenderer
```

**page.tsx (server component) debe:**
1. Importar createClient de `@supabase/supabase-js` (o el helper de server que ya exista en el proyecto)
2. Hacer queries directas a Supabase para obtener TODOS los datos del agente:
   - agent_profiles (filtrado por slug)
   - hero_config (filtrado por agent_id)
   - agent_sections (filtrado por agent_id, ordenado por display_order)
   - properties (filtrado por agent_id, is_active = true)
   - testimonials (filtrado por agent_id)
   - services (filtrado por agent_id)
   - zones (filtrado por agent_id)
   - team_members (filtrado por agent_id)
3. Si no encuentra agente → notFound()
4. Construir el objeto TemplateData con todos los datos
5. Exportar generateMetadata que use los helpers de seo.ts
6. Renderizar `<AgentPageClient data={templateData} />`
7. Incluir JSON-LD como `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getAgentJsonLd(agent)) }} />`

**IMPORTANTE:** Revisa cómo el page.tsx actual construye el TemplateData y replícalo EXACTAMENTE en el server component. No cambies la estructura de datos — solo mueve el fetch del cliente al servidor.

**AgentPageClient.tsx (client component) debe:**
- Tener 'use client' en la primera línea
- Recibir `{ data: TemplateData }` como props
- Renderizar el TemplateRenderer exactamente igual que el page.tsx actual
- Mantener cualquier lógica client-side que exista (interacciones, scroll, etc.)

### PASO 5 — Añadir generateMetadata a /property/[id]
Ya es server component. Añadir:

```typescript
import { Metadata } from 'next';
import { getPropertyTitle, getPropertyCanonicalUrl, truncateDescription, getPropertyJsonLd } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Reutilizar la misma función getProperty que ya usa el componente
  const property = await getProperty(params.id);
  if (!property) return { title: 'Propiedad no encontrada' };

  const title = getPropertyTitle(property);
  const description = truncateDescription(property.description) || `${property.property_type || 'Propiedad'} en ${property.city || 'Tenerife'}`;
  const canonical = getPropertyCanonicalUrl(params.id, property.agent?.custom_domain);
  const image = property.main_image_url || property.images?.[0];

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
  };
}
```

Y añadir JSON-LD en el JSX del componente:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(getPropertyJsonLd(property)) }}
/>
```

### PASO 6 — Metadata estática para páginas públicas

Añadir export de metadata a cada una de estas páginas. Los títulos NO deben incluir "| HabiBook" porque el root layout template lo añade automáticamente.

**/ (Home) — src/app/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Plataforma Inmobiliaria para Agentes en Canarias',
  description: 'Crea tu web inmobiliaria profesional en minutos. CRM, leads, valoración IA y MLS compartido. Para agentes autónomos y agencias en Tenerife y toda España.',
  alternates: { canonical: 'https://habibook.com' },
  openGraph: {
    title: 'HabiBook — Plataforma Inmobiliaria para Agentes',
    description: 'Crea tu web inmobiliaria profesional en minutos.',
    url: 'https://habibook.com',
    type: 'website',
  },
};
```

**/pricing — src/app/(public)/pricing/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Planes y Precios',
  description: 'Elige el plan que mejor se adapta a tu negocio inmobiliario. Desde 19€/mes. Starter, Pro, Premium y Agency. Dominio propio disponible por 69€/año.',
  alternates: { canonical: 'https://habibook.com/pricing' },
};
```

**/search — src/app/(public)/search/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Buscar Propiedades en Tenerife',
  description: 'Encuentra tu propiedad ideal en Tenerife. Venta, alquiler vacacional y larga temporada. Propiedades de agentes verificados.',
  alternates: { canonical: 'https://habibook.com/search' },
};
```

**/demos — src/app/(public)/demos/page.tsx:**
```typescript
export const metadata: Metadata = {
  title: 'Plantillas de Diseño para tu Web Inmobiliaria',
  description: 'Explora nuestras plantillas profesionales. Luxury, Mediterranean, Corporate, Boutique, Classic y Data. Personaliza la tuya en minutos.',
  alternates: { canonical: 'https://habibook.com/demos' },
};
```

**/demos/[template] — generateMetadata dinámico:**
```typescript
const TEMPLATE_META: Record<string, { title: string; description: string }> = {
  luxury: {
    title: 'Plantilla Luxury — Web Inmobiliaria Premium',
    description: 'Diseño elegante con fondo oscuro y dorado. Ideal para agentes de villas premium y propiedades exclusivas.',
  },
  mediterranean: {
    title: 'Plantilla Mediterranean — Web Inmobiliaria Cálida',
    description: 'Diseño mediterráneo con tonos cálidos. Perfecto para agentes generalistas y mercado medio-alto.',
  },
  corporate: {
    title: 'Plantilla Corporate — Web para Agencias Inmobiliarias',
    description: 'Diseño profesional azul corporativo. Ideal para agencias medianas con equipo.',
  },
  boutique: {
    title: 'Plantilla Boutique — Web Inmobiliaria Editorial',
    description: 'Diseño editorial con estética de revista. Para agencias boutique que priorizan calidad.',
  },
  classic: {
    title: 'Plantilla Classic — Web Inmobiliaria Elegante',
    description: 'Diseño clásico con tonos tierra. Para agentes veteranos con trayectoria reconocida.',
  },
  data: {
    title: 'Plantilla Data — Web Inmobiliaria con Analytics',
    description: 'Diseño tech-forward con dashboard y datos. Para agencias que usan datos como ventaja competitiva.',
  },
};

export async function generateMetadata({ params }: { params: { template: string } }): Promise<Metadata> {
  const meta = TEMPLATE_META[params.template];
  if (!meta) return { title: 'Plantilla no encontrada' };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://habibook.com/demos/${params.template}` },
  };
}
```

### PASO 7 — Ampliar sitemap.ts
Añadir propiedades activas y /search al sitemap existente:

```typescript
// Añadir a staticPages:
{ url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },

// Después de agentPages, añadir propertyPages:
let propertyPages: MetadataRoute.Sitemap = [];
try {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('is_active', true);

  if (properties) {
    propertyPages = properties.map(p => ({
      url: `${baseUrl}/property/${p.id}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));
  }
} catch (e) {
  console.error('Error fetching properties for sitemap:', e);
}

// Return final:
return [...staticPages, ...demoPages, ...agentPages, ...propertyPages];
```

### PASO 8 — Actualizar root layout metadata
Reemplazar la metadata del root layout `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com'),
  title: {
    default: 'HabiBook — Plataforma Inmobiliaria para Agentes',
    template: '%s | HabiBook',
  },
  description: 'Crea tu web inmobiliaria profesional en minutos. CRM, leads, valoración IA y MLS compartido.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'HabiBook',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

IMPORTANTE: Al usar `title.template: '%s | HabiBook'`, todas las páginas hijas que definan título van a tener " | HabiBook" añadido automáticamente. Revisa que NINGÚN título de página hija incluya "| HabiBook" manualmente para evitar duplicados como "Plantilla Luxury | HabiBook | HabiBook".

### PASO 9 — Verificación
```bash
npx tsc --noEmit
npx next lint
npm run build
```
Los tres comandos DEBEN pasar sin errores. Si algo falla, corrígelo antes de continuar.

### PASO 10 — Commit
```bash
git add -A
git commit -m "feat(seo): add dynamic metadata, JSON-LD, OpenGraph, canonical URLs and custom_domain support to all public routes"
```

## LO QUE NO DEBES HACER
- NO cambies la lógica visual del TemplateRenderer — solo muévelo a un client component aparte
- NO crees imágenes OG dinámicas — usa las fotos reales
- NO implementes hreflang todavía — eso viene con el multiidioma
- NO modifiques las sub-páginas del editor (testimonials, services, zones)
- NO cambies las APIs existentes (pueden seguir existiendo para uso del editor)
- NO uses `as any` ni `@ts-ignore` ni `// @ts-expect-error`
- NO dupliques "| HabiBook" en títulos (el template del layout lo añade)
- NO implementes la compra de dominios ni el wizard — solo la infraestructura SEO que los soporta

## CRITERIO DE ÉXITO
1. `npx tsc --noEmit` = 0 errores
2. `npx next lint` = 0 errores
3. `npm run build` = SUCCESS
4. /agent/[slug] tiene title, description, OG, Twitter, canonical y JSON-LD dinámicos
5. /property/[id] tiene title, description, OG, Twitter, canonical y JSON-LD dinámicos
6. /, /demos, /demos/[template], /pricing, /search tienen metadata propia
7. Root layout tiene metadataBase y title.template configurados
8. Sitemap incluye propiedades activas
9. Campo custom_domain existe en agent_profiles (nullable)
10. Canonical URLs usan custom_domain dinámicamente cuando existe
11. Cero duplicación de "| HabiBook" en títulos
12. JSON-LD válido (verificable en https://validator.schema.org/)
