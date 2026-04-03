#!/usr/bin/env node

/**
 * Seed script for HabiBook demo agent profiles.
 * Creates 6 realistic demo agents with full data in Supabase.
 * Idempotent — safe to run multiple times.
 *
 * Usage: node scripts/seed-demos.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx > 0) {
    env[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1)
  }
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ═══════════════════════════════════════
// STEP 1: Add is_demo column if missing
// ═══════════════════════════════════════
async function ensureIsDemo() {
  // Try querying is_demo — if it fails, we need to create it
  const { error } = await supabase.from('agent_profiles').select('is_demo').limit(1)
  if (error && error.message.includes('does not exist')) {
    console.log('Adding is_demo column...')
    // Use the SQL via Supabase's PostgREST — we need to use a workaround
    // Create an RPC function first, or handle via the seed itself
    // Actually, we can use the pg_net extension or just handle it differently
    // Let's try using supabase's SQL API through fetch
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
    })
    // If this doesn't work, tell the user
    console.error('ERROR: is_demo column does not exist. Please run this SQL in the Supabase Dashboard:')
    console.error('ALTER TABLE public.agent_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;')
    console.error('')
    console.error('Then re-run this script.')
    process.exit(1)
  } else {
    console.log('is_demo column exists')
  }
}

// ═══════════════════════════════════════
// DEMO DATA — Fixed UUIDs for idempotency
// ═══════════════════════════════════════
const DEMO_IDS = {
  'victoria-laurent': 'dd000001-0000-0000-0000-000000000001',
  'antonio-reyes':    'dd000001-0000-0000-0000-000000000002',
  'tenerife-prime':   'dd000001-0000-0000-0000-000000000003',
  'maison-tenerife':  'dd000001-0000-0000-0000-000000000004',
  'roberto-fernandez':'dd000001-0000-0000-0000-000000000005',
  'island-properties':'dd000001-0000-0000-0000-000000000006',
}

const DEMOS = [
  // ═══ LUXURY — Victoria Laurent ═══
  {
    profile: {
      id: DEMO_IDS['victoria-laurent'],
      slug: 'victoria-laurent',
      full_name: 'Victoria Laurent',
      business_name: 'Victoria Laurent Luxury Properties',
      template: 'luxury',
      bio: 'Especialista en propiedades de lujo en la costa sur de Tenerife. Con 12 años de experiencia y una red exclusiva de clientes internacionales, ofrezco un servicio discreto y personalizado para compradores exigentes. Mi compromiso es encontrar la propiedad perfecta que refleje su estilo de vida.',
      quote: 'El lujo no es un precio, es una experiencia. Cada propiedad que presento cuenta una historia.',
      phone: '+34 622 456 789',
      email: 'victoria@luxuryproperties.com',
      whatsapp: '34622456789',
      languages: ['Español', 'Francés', 'Inglés', 'Italiano'],
      experience_years: 12,
      bio_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      city: 'Costa Adeje',
      location: 'Costa Adeje, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { propiedades_vendidas: 180, clientes_internacionales: 120, precio_medio: 2100000, anos_experiencia: 12 },
    },
    hero: {
      headline: 'Propiedades exclusivas en Tenerife',
      subtitle: '12 años conectando compradores exigentes con las mejores residencias de la isla',
      cta_text: 'Ver colección',
      background_image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
    },
    properties: [
      { title: 'Villa Contemporánea con Vistas al Mar', price: 2850000, location: 'Abama, Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 420, area_built: 420, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], is_active: true },
      { title: 'Penthouse de Lujo en Primera Línea', price: 1950000, location: 'La Caleta, Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 280, area_built: 280, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Finca Exclusiva con Piscina Infinita', price: 3200000, location: 'San Eugenio Alto', bedrooms: 6, bathrooms: 5, area_m2: 550, area_built: 550, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], is_active: true },
      { title: 'Apartamento Boutique en Resort Premium', price: 890000, location: 'Bahía del Duque', bedrooms: 3, bathrooms: 2, area_m2: 165, area_built: 165, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], is_active: true },
      { title: 'Villa Panorámica Océano', price: 4500000, location: 'Playa Paraíso', bedrooms: 7, bathrooms: 6, area_m2: 680, area_built: 680, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], is_active: true },
      { title: 'Suite de Lujo con Terraza Privada', price: 1200000, location: 'Torviscas Alto', bedrooms: 3, bathrooms: 3, area_m2: 195, area_built: 195, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Pierre & Marie Dupont', client_location: 'Lyon, Francia', quote: 'Victoria encontró nuestra villa soñada en Abama en apenas 2 semanas. Su conocimiento del mercado de lujo es excepcional.', rating: 5 },
      { client_name: 'James & Sarah Miller', client_location: 'Londres, UK', quote: 'Profesionalismo discreto y eficaz. Vendió nuestra propiedad por encima del precio pedido.', rating: 5 },
      { client_name: 'Laurent Beaumont', client_location: 'Mónaco', quote: 'Service exceptionnel. Victoria parle couramment français et comprend parfaitement les besoins des acheteurs internationaux.', rating: 5 },
    ],
    services: [
      { title: 'Búsqueda exclusiva de propiedades', description: 'Acceso a propiedades off-market y pre-lanzamientos para clientes selectos' },
      { title: 'Asesoramiento en inversión premium', description: 'Análisis de rentabilidad y estrategias de inversión inmobiliaria de alto nivel' },
      { title: 'Gestión integral de compraventa', description: 'Acompañamiento completo desde la negociación hasta la firma en notaría' },
      { title: 'Servicio post-venta VIP', description: 'Gestión de reformas, interiorismo y servicios de conserjería para su nueva propiedad' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'La zona más exclusiva del sur de Tenerife, con resorts de 5 estrellas y playas premium', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 45 },
      { name: 'Abama (Guía de Isora)', description: 'Resort de lujo con campo de golf, hotel Ritz-Carlton y residencias exclusivas', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 18 },
      { name: 'La Caleta', description: 'Pueblo pesquero reconvertido en enclave residencial de alto standing', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 22 },
      { name: 'Bahía del Duque', description: 'Una de las zonas más cotizadas de Tenerife, junto al hotel homónimo de 5 estrellas', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 15 },
    ],
    team: [],
    sections: ['nav', 'hero', 'properties_sale', 'about', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },

  // ═══ MEDITERRANEAN — Antonio Reyes ═══
  {
    profile: {
      id: DEMO_IDS['antonio-reyes'],
      slug: 'antonio-reyes',
      full_name: 'Antonio Reyes',
      business_name: 'Antonio Reyes Inmobiliaria',
      template: 'mediterranean',
      bio: '15 años ayudando a familias a encontrar su hogar perfecto en Tenerife. Más de 320 ventas realizadas. Mi compromiso es acompañarte en cada paso del proceso, desde la primera visita hasta la firma en notaría. Conozco cada rincón del sur de la isla.',
      quote: 'Tu hogar es la decisión más importante. Estoy aquí para que sea la mejor.',
      phone: '+34 666 123 456',
      email: 'antonio@reyesinmo.com',
      whatsapp: '34666123456',
      languages: ['Español', 'Inglés', 'Alemán'],
      experience_years: 15,
      bio_photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
      city: 'Los Cristianos',
      location: 'Los Cristianos, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { ventas_realizadas: 320, familias_felices: 320, anos_experiencia: 15, valoracion_media: 4.9 },
    },
    hero: {
      headline: 'Tu hogar en Tenerife te espera',
      subtitle: '15 años de experiencia. 320+ familias felices. Tu próximo hogar está aquí.',
      cta_text: 'Ver propiedades',
      background_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
    },
    properties: [
      { title: 'Apartamento Luminoso con Terraza', price: 285000, location: 'Los Cristianos', bedrooms: 2, bathrooms: 1, area_m2: 85, area_built: 85, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], is_active: true },
      { title: 'Chalet Familiar con Jardín', price: 425000, location: 'San Isidro', bedrooms: 4, bathrooms: 2, area_m2: 180, area_built: 180, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], is_active: true },
      { title: 'Piso Reformado Centro', price: 195000, location: 'Arona', bedrooms: 3, bathrooms: 1, area_m2: 95, area_built: 95, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], is_active: true },
      { title: 'Dúplex con Vistas al Teide', price: 340000, location: 'Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, area_built: 140, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Estudio Vacacional Primera Línea', price: 1200, location: 'Playa de las Américas', bedrooms: 1, bathrooms: 1, area_m2: 45, area_built: 45, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], is_active: true },
      { title: 'Apartamento Larga Temporada', price: 850, location: 'Los Cristianos Centro', bedrooms: 2, bathrooms: 1, area_m2: 70, area_built: 70, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Michael & Anna Weber', client_location: 'Múnich, Alemania', quote: 'Antonio nos guió en cada paso. Compramos nuestro primer piso en Tenerife gracias a su paciencia y honestidad.', rating: 5 },
      { client_name: 'Carmen Rodríguez', client_location: 'Madrid, España', quote: '15 años en el mercado se notan. Conoce cada calle de Los Cristianos. Vendió mi apartamento en solo 3 semanas.', rating: 5 },
      { client_name: 'David Thompson', client_location: 'Manchester, UK', quote: 'Very trustworthy agent. He found us the perfect apartment within our budget. Highly recommended!', rating: 4 },
    ],
    services: [
      { title: 'Compraventa residencial', description: 'Asesoramiento integral en compra y venta de viviendas en el sur de Tenerife' },
      { title: 'Alquileres vacacionales y larga temporada', description: 'Gestión completa de alquileres para propietarios e inquilinos' },
      { title: 'Asesoramiento hipotecario', description: 'Colaboración con los principales bancos para encontrar la mejor financiación' },
      { title: 'Gestión de reformas', description: 'Red de profesionales de confianza para renovar tu nueva vivienda' },
    ],
    zones: [
      { name: 'Los Cristianos', description: 'Centro turístico consolidado con excelentes servicios y playa', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 85 },
      { name: 'Arona', description: 'Municipio residencial con buenas comunicaciones y precios accesibles', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 62 },
      { name: 'Adeje', description: 'Zona en auge con mezcla de residencial y turístico de calidad', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 74 },
      { name: 'Playa de las Américas', description: 'Corazón turístico del sur, ideal para inversión vacacional', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 53 },
    ],
    team: [],
    sections: ['nav', 'hero', 'properties_sale', 'properties_rent_vacation', 'properties_rent_long', 'about', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },

  // ═══ CORPORATE — Tenerife Prime Real Estate ═══
  {
    profile: {
      id: DEMO_IDS['tenerife-prime'],
      slug: 'tenerife-prime',
      full_name: 'Carlos Méndez',
      business_name: 'Tenerife Prime Real Estate',
      template: 'corporate',
      bio: 'Tenerife Prime es una agencia consolidada con 8 agentes especializados y más de 20 años en el mercado. Más de 500 millones de euros en volumen de ventas gestionado. Nuestro equipo multilingüe atiende a clientes de toda Europa.',
      quote: 'La confianza se construye con resultados, no con promesas.',
      phone: '+34 922 789 456',
      email: 'info@tenerifeprime.com',
      whatsapp: '34922789456',
      languages: ['Español', 'Inglés', 'Alemán', 'Francés', 'Ruso'],
      experience_years: 20,
      bio_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      city: 'Costa Adeje',
      location: 'Costa Adeje, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { volumen_gestionado: 500, operaciones_cerradas: 1200, agentes_especializados: 8, anos_experiencia: 20 },
    },
    hero: {
      headline: 'Tu agencia inmobiliaria de confianza',
      subtitle: '20 años de experiencia. 8 agentes especializados. Más de 500M EUR gestionados.',
      cta_text: 'Explorar propiedades',
      background_image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
    },
    properties: [
      { title: 'Oficina Premium Zona Comercial', price: 385000, location: 'Santa Cruz de Tenerife', bedrooms: 0, bathrooms: 2, area_m2: 120, area_built: 120, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], is_active: true },
      { title: 'Apartamento Vista Mar 3 Dormitorios', price: 320000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 110, area_built: 110, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], is_active: true },
      { title: 'Villa de Lujo con Piscina', price: 1250000, location: 'Torviscas Alto', bedrooms: 5, bathrooms: 4, area_m2: 350, area_built: 350, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], is_active: true },
      { title: 'Estudio Centro Histórico', price: 155000, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 48, area_built: 48, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], is_active: true },
      { title: 'Chalet Pareado Nuevo', price: 445000, location: 'El Médano', bedrooms: 4, bathrooms: 3, area_m2: 200, area_built: 200, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], is_active: true },
      { title: 'Local Comercial Avenida Principal', price: 2200, location: 'Las Américas', bedrooms: 0, bathrooms: 1, area_m2: 95, area_built: 95, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'], is_active: true },
      { title: 'Ático de Diseño con Terraza', price: 520000, location: 'Los Cristianos', bedrooms: 3, bathrooms: 2, area_m2: 150, area_built: 150, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Nave Industrial Polígono', price: 3500, location: 'Granadilla', bedrooms: 0, bathrooms: 2, area_m2: 450, area_built: 450, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Heinrich & Ursula Braun', client_location: 'Frankfurt, Alemania', quote: 'Invertimos en 3 apartamentos con Tenerife Prime. Su equipo gestionó todo el proceso con profesionalismo impecable.', rating: 5 },
      { client_name: 'Inversiones Atlántico S.L.', client_location: 'Madrid, España', quote: 'Llevamos 8 años trabajando con ellos para nuestra cartera inmobiliaria en Canarias. Resultados consistentes.', rating: 5 },
      { client_name: 'Olga Petrova', client_location: 'Moscú, Rusia', quote: 'Elena Volkov del equipo habla ruso perfecto y nos ayudó a comprar nuestra casa de vacaciones sin ningún problema.', rating: 5 },
      { client_name: 'Robert & Jane Clarke', client_location: 'Dublin, Irlanda', quote: 'Professional team that handled everything from property search to legal paperwork. Excellent service.', rating: 4 },
    ],
    services: [
      { title: 'Inversión inmobiliaria', description: 'Asesoramiento especializado para inversores nacionales e internacionales' },
      { title: 'Gestión de carteras', description: 'Administración integral de portfolios inmobiliarios en Canarias' },
      { title: 'Asesoramiento fiscal no residentes', description: 'Optimización fiscal para compradores extranjeros con red de asesores fiscales' },
      { title: 'Relocation services', description: 'Servicio completo de reubicación para profesionales y familias que se mudan a Tenerife' },
      { title: 'Gestión de alquileres', description: 'Property management para propietarios que desean rentabilizar su inversión' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Zona premium del sur con la mayor demanda de compradores internacionales', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 120 },
      { name: 'Santa Cruz', description: 'Capital de la isla con oportunidades en oficinas y vivienda residencial', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 85 },
      { name: 'La Orotava', description: 'Encanto histórico del norte con fincas y casas canarias tradicionales', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 35 },
      { name: 'Puerto de la Cruz', description: 'Destino clásico del norte con gran potencial de revalorización', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 48 },
    ],
    team: [
      { name: 'Carlos Méndez', role: 'Director General', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', languages: ['Español', 'Inglés', 'Alemán'] },
      { name: 'Elena Volkov', role: 'Agente Senior', photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', languages: ['Español', 'Ruso', 'Inglés'] },
      { name: 'Thomas Becker', role: 'Agente Internacional', photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', languages: ['Alemán', 'Inglés', 'Español'] },
      { name: 'María García', role: 'Coordinadora', photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', languages: ['Español', 'Inglés', 'Francés'] },
    ],
    sections: ['nav', 'hero', 'properties_sale', 'team', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },

  // ═══ BOUTIQUE — Maison Tenerife ═══
  {
    profile: {
      id: DEMO_IDS['maison-tenerife'],
      slug: 'maison-tenerife',
      full_name: 'Sophie Martin & Alejandro Ruiz',
      business_name: 'Maison Tenerife',
      template: 'boutique',
      bio: 'Somos pequeños por elección. Seleccionamos un máximo de 25 propiedades para ofrecer una atención verdaderamente personalizada. Cada propiedad que aceptamos ha pasado nuestra curaduría personal. La calidad sobre la cantidad, siempre.',
      quote: 'No vendemos casas. Encontramos hogares con alma.',
      phone: '+34 611 234 567',
      email: 'contact@maisontenerife.com',
      whatsapp: '34611234567',
      languages: ['Francés', 'Español', 'Inglés'],
      experience_years: 8,
      bio_photo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      city: 'Guía de Isora',
      location: 'Costa Adeje, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { propiedades_seleccionadas: 25, clientes_atendidos: 95, satisfaccion: 100, anos_experiencia: 8 },
    },
    hero: {
      headline: 'Selección curada de propiedades únicas',
      subtitle: 'Máximo 25 propiedades. Atención absoluta. Calidad sobre cantidad.',
      cta_text: 'Ver portfolio',
      background_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    },
    properties: [
      { title: 'Villa Minimalista con Infinity Pool', price: 1850000, location: 'La Caleta', bedrooms: 4, bathrooms: 3, area_m2: 300, area_built: 300, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Ático Exclusivo Frente al Mar', price: 920000, location: 'El Duque', bedrooms: 3, bathrooms: 2, area_m2: 180, area_built: 180, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], is_active: true },
      { title: 'Casa de Autor con Bodega', price: 1450000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 380, area_built: 380, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], is_active: true },
      { title: 'Suite Boutique con Servicio', price: 2800, location: 'Bahía del Duque', bedrooms: 2, bathrooms: 2, area_m2: 120, area_built: 120, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], is_active: true },
      { title: 'Loft de Diseño Contemporáneo', price: 680000, location: 'San Eugenio', bedrooms: 2, bathrooms: 2, area_m2: 130, area_built: 130, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'], is_active: true },
      { title: 'Residencia de Artista con Estudio', price: 1100000, location: 'Playa San Juan', bedrooms: 3, bathrooms: 2, area_m2: 250, area_built: 250, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Isabelle & François Moreau', client_location: 'París, Francia', quote: 'Sophie et Alejandro ont une sensibilité unique pour comprendre ce que vous cherchez. Notre maison à Tenerife est un rêve devenu réalité.', rating: 5 },
      { client_name: 'Christina Svensson', client_location: 'Estocolmo, Suecia', quote: 'Their curated approach saved us months of searching. Every property they showed was exactly our style.', rating: 5 },
      { client_name: 'Marco & Giulia Bianchi', client_location: 'Milán, Italia', quote: 'Un servicio tan personalizado que sentimos que éramos sus únicos clientes. Encontraron nuestra villa perfecta.', rating: 5 },
    ],
    services: [
      { title: 'Selección curada de propiedades', description: 'Cada propiedad pasa nuestro filtro personal antes de ser presentada a nuestros clientes' },
      { title: 'Acompañamiento personalizado', description: 'Atención exclusiva de principio a fin, sin prisas ni presiones' },
      { title: 'Decoración y staging', description: 'Servicio de home staging y asesoramiento de interiorismo para su nueva propiedad' },
      { title: 'Gestión de alquiler vacacional', description: 'Administración premium de su propiedad como alquiler vacacional de alto standing' },
    ],
    zones: [
      { name: 'Guía de Isora', description: 'Tranquilidad y autenticidad canaria con vistas al océano', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 12 },
      { name: 'Alcalá', description: 'Pueblo costero con encanto y propiedades con carácter', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 8 },
      { name: 'San Juan', description: 'El secreto mejor guardado de la costa oeste de Tenerife', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 10 },
      { name: 'Playa San Juan', description: 'Ambiente auténtico y gastronomía local de primer nivel', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 6 },
    ],
    team: [
      { name: 'Sophie Martin', role: 'Co-fundadora', photo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', languages: ['Francés', 'Español', 'Inglés'] },
      { name: 'Alejandro Ruiz', role: 'Co-fundador', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', languages: ['Español', 'Francés', 'Inglés'] },
      { name: 'Claire Petit', role: 'Asistente', photo_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400', languages: ['Francés', 'Inglés'] },
    ],
    sections: ['nav', 'hero', 'properties_sale', 'properties_rent_vacation', 'about', 'team', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },

  // ═══ CLASSIC — Roberto Fernández ═══
  {
    profile: {
      id: DEMO_IDS['roberto-fernandez'],
      slug: 'roberto-fernandez',
      full_name: 'Roberto Fernández',
      business_name: 'Roberto Fernández — Inmobiliaria desde 1999',
      template: 'classic',
      bio: '27 años en el sector inmobiliario de Tenerife. Más de 600 operaciones de compraventa realizadas. Premio al Mejor Agente del Año 2019 y 2022 otorgado por la Asociación de Agentes Inmobiliarios de Canarias. Nadie conoce este mercado como yo.',
      quote: 'La experiencia no se compra, se gana año tras año. Cada operación es única.',
      phone: '+34 922 345 678',
      email: 'roberto@fernandezinmo.com',
      whatsapp: '34922345678',
      languages: ['Español', 'Inglés'],
      experience_years: 27,
      bio_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      city: 'La Laguna',
      location: 'La Laguna, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { operaciones_cerradas: 600, premios: 4, anos_experiencia: 27, clientes_repetidores: 180 },
    },
    hero: {
      headline: '27 años de experiencia inmobiliaria',
      subtitle: 'Más de 600 operaciones exitosas. Conocimiento profundo del mercado de Tenerife.',
      cta_text: 'Ver propiedades',
      background_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    },
    properties: [
      { title: 'Casa Canaria Restaurada con Patio', price: 380000, location: 'La Laguna Centro', bedrooms: 4, bathrooms: 2, area_m2: 220, area_built: 220, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], is_active: true },
      { title: 'Finca Rústica con Plataneras', price: 520000, location: 'Tacoronte', bedrooms: 5, bathrooms: 3, area_m2: 280, area_built: 280, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], is_active: true },
      { title: 'Piso Señorial en Edificio Histórico', price: 265000, location: 'Santa Cruz Centro', bedrooms: 3, bathrooms: 2, area_m2: 130, area_built: 130, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], is_active: true },
      { title: 'Adosado con Huerto y Bodega', price: 340000, location: 'El Sauzal', bedrooms: 3, bathrooms: 2, area_m2: 175, area_built: 175, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Casa Tradicional con Vistas al Valle', price: 290000, location: 'La Orotava', bedrooms: 4, bathrooms: 2, area_m2: 200, area_built: 200, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], is_active: true },
      { title: 'Almacén Convertido en Loft', price: 1100, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 85, area_built: 85, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'], is_active: true },
      { title: 'Chalet con Viñedo en Tegueste', price: 450000, location: 'Tegueste', bedrooms: 4, bathrooms: 3, area_m2: 240, area_built: 240, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Manuel y Pilar García', client_location: 'La Laguna, Tenerife', quote: 'Roberto vendió la casa de mis padres y 15 años después me ayudó a comprar la mía. Esa es la confianza que genera.', rating: 5 },
      { client_name: 'Fernando Delgado', client_location: 'Santa Cruz, Tenerife', quote: 'El mejor conocedor del mercado del norte de Tenerife. Su valoración fue exacta al céntimo.', rating: 5 },
      { client_name: 'María Hernández', client_location: 'La Orotava, Tenerife', quote: 'Gestionó la herencia de mi familia con una sensibilidad y profesionalidad que no esperábamos. Eternamente agradecidos.', rating: 5 },
      { client_name: 'John & Patricia Adams', client_location: 'Bristol, UK', quote: 'Roberto helped us find a traditional Canarian house in Tacoronte. His deep knowledge of the area is unmatched.', rating: 5 },
    ],
    services: [
      { title: 'Compraventa de inmuebles', description: 'Asesoramiento experto en compra y venta con más de 600 operaciones de experiencia' },
      { title: 'Valoraciones profesionales', description: 'Tasación precisa basada en décadas de conocimiento del mercado local' },
      { title: 'Herencias y sucesiones', description: 'Gestión integral de procesos inmobiliarios vinculados a herencias familiares' },
      { title: 'Gestión de fincas rústicas', description: 'Especialización en fincas agrícolas, viñedos y propiedades rurales del norte' },
    ],
    zones: [
      { name: 'La Laguna', description: 'Ciudad Patrimonio de la Humanidad con arquitectura colonial única', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 42 },
      { name: 'Santa Cruz', description: 'Capital cosmopolita con excelentes conexiones y servicios', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 65 },
      { name: 'La Orotava', description: 'Valle espectacular con casas señoriales y jardines históricos', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 28 },
      { name: 'Tacoronte', description: 'Zona vinícola con fincas y propiedades con terreno', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 22 },
    ],
    team: [],
    sections: ['nav', 'hero', 'properties_sale', 'about', 'stats', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },

  // ═══ DATA/NETWORK — Island Properties Group ═══
  {
    profile: {
      id: DEMO_IDS['island-properties'],
      slug: 'island-properties',
      full_name: 'Miguel Torres',
      business_name: 'Island Properties Group',
      template: 'data',
      bio: 'No adivinamos precios, los sabemos. Más de 10.000 transacciones analizadas con IA. Usamos tecnología avanzada y análisis de mercado en tiempo real para tomar decisiones basadas en datos, no en intuición. Nuestro equipo combina experiencia inmobiliaria con ciencia de datos.',
      quote: 'Los datos no mienten. Nosotros los interpretamos para ti.',
      phone: '+34 611 987 654',
      email: 'info@islandproperties.es',
      whatsapp: '34611987654',
      languages: ['Español', 'Inglés', 'Alemán'],
      experience_years: 5,
      bio_photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      city: 'Santa Cruz',
      location: 'Santa Cruz, Tenerife',
      is_active: true,
      is_demo: true,
      stats: { transacciones_analizadas: 10000, clientes_satisfechos: 350, tasa_exito: 94, agentes: 6 },
    },
    hero: {
      headline: 'Decisiones inmobiliarias basadas en datos',
      subtitle: '10.000+ transacciones analizadas. IA y analytics de mercado en tiempo real.',
      cta_text: 'Explorar propiedades',
      background_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600',
    },
    properties: [
      { title: 'Penthouse Smart Home Automatizado', price: 485000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, area_built: 140, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], is_active: true },
      { title: 'Apartamento Inversión Alta Rentabilidad', price: 210000, location: 'Playa de las Américas', bedrooms: 2, bathrooms: 1, area_m2: 68, area_built: 68, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], is_active: true },
      { title: 'Villa Eficiente Energética A+', price: 750000, location: 'Adeje', bedrooms: 4, bathrooms: 3, area_m2: 250, area_built: 250, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], is_active: true },
      { title: 'Loft Tecnológico Centro', price: 195000, location: 'Santa Cruz', bedrooms: 1, bathrooms: 1, area_m2: 55, area_built: 55, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'], is_active: true },
      { title: 'Estudio ROI 8.2% Anual', price: 95, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 38, area_built: 38, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], is_active: true },
      { title: 'Nave Industrial Reconvertida', price: 1600, location: 'Polígono Granadilla', bedrooms: 0, bathrooms: 2, area_m2: 320, area_built: 320, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'], is_active: true },
      { title: 'Dúplex Reformado con Terraza', price: 310000, location: 'Puerto de la Cruz', bedrooms: 3, bathrooms: 2, area_m2: 125, area_built: 125, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], is_active: true },
      { title: 'Casa Adosada Obra Nueva', price: 395000, location: 'El Médano', bedrooms: 3, bathrooms: 2, area_m2: 145, area_built: 145, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'], is_active: true },
      { title: 'Apartamento Vacacional Premium', price: 150, location: 'Costa Adeje', bedrooms: 2, bathrooms: 1, area_m2: 75, area_built: 75, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], is_active: true },
      { title: 'Local Comercial Centro La Laguna', price: 1800, location: 'La Laguna', bedrooms: 0, bathrooms: 1, area_m2: 80, area_built: 80, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], is_active: true },
    ],
    testimonials: [
      { client_name: 'Andreas Keller', client_location: 'Zúrich, Suiza', quote: 'Su enfoque basado en datos me convenció desde el primer momento. La valoración fue exacta y vendimos en tiempo récord.', rating: 5 },
      { client_name: 'Laura & Tom Bennett', client_location: 'Liverpool, UK', quote: 'The analytics dashboard they showed us made the decision so much easier. We could see exactly where the market was heading.', rating: 5 },
      { client_name: 'Grupo Inversor Canarias', client_location: 'Las Palmas, España', quote: 'Gestionan nuestra cartera de 12 propiedades con datos de rentabilidad en tiempo real. Imprescindibles.', rating: 5 },
      { client_name: 'Katarina Johansson', client_location: 'Gotemburgo, Suecia', quote: 'They predicted the price increase in Costa Adeje months before it happened. Incredible market intelligence.', rating: 5 },
      { client_name: 'Pablo y Elena Navarro', client_location: 'Barcelona, España', quote: 'Compramos nuestro primer apartamento de inversión con ellos. Los datos que proporcionan dan mucha seguridad.', rating: 4 },
    ],
    services: [
      { title: 'Compraventa residencial y comercial', description: 'Servicio integral de compraventa respaldado por análisis de datos de mercado' },
      { title: 'Alquileres vacacionales', description: 'Gestión de alquileres turísticos con optimización de precios por IA' },
      { title: 'Property management', description: 'Administración de propiedades con reporting financiero en tiempo real' },
      { title: 'Inversión extranjera', description: 'Asesoramiento especializado para inversores internacionales con análisis de ROI' },
      { title: 'Asesoramiento legal y fiscal', description: 'Red de profesionales especializados en fiscalidad inmobiliaria canaria' },
      { title: 'Mudanzas y relocation', description: 'Servicio completo de reubicación para nuevos residentes en Tenerife' },
    ],
    zones: [
      { name: 'Sur — Costa Adeje', description: 'Mayor demanda turística e internacional, precios premium', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', property_count: 95 },
      { name: 'Sur — Arona / Granadilla', description: 'Zona en expansión con buena relación calidad-precio', image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400', property_count: 78 },
      { name: 'Norte — Puerto de la Cruz', description: 'Mercado tradicional con potencial de revalorización', image_url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400', property_count: 45 },
      { name: 'Metro — Santa Cruz / La Laguna', description: 'Área metropolitana con demanda residencial estable', image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400', property_count: 110 },
    ],
    team: [
      { name: 'Miguel Torres', role: 'CEO & Data Scientist', photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', languages: ['Español', 'Inglés', 'Alemán'] },
      { name: 'Ana Vega', role: 'ML Engineer', photo_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400', languages: ['Español', 'Inglés'] },
      { name: 'Pablo Ruiz', role: 'Market Analyst', photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', languages: ['Español', 'Inglés'] },
      { name: 'Lisa Schneider', role: 'International Sales', photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', languages: ['Alemán', 'Inglés', 'Español'] },
      { name: 'Daniel Ortiz', role: 'Property Manager', photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', languages: ['Español', 'Inglés'] },
      { name: 'Marta López', role: 'Legal Advisor', photo_url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400', languages: ['Español', 'Inglés', 'Francés'] },
    ],
    sections: ['nav', 'hero', 'properties_sale', 'properties_rent_vacation', 'properties_rent_long', 'team', 'services', 'testimonials', 'zones', 'contact_form', 'footer'],
  },
]

// ═══════════════════════════════════════
// SEED FUNCTIONS
// ═══════════════════════════════════════

// Valid columns in agent_profiles table
const VALID_PROFILE_COLS = new Set([
  'id', 'slug', 'business_name', 'business_type', 'template', 'color_palette',
  'logo_url', 'phone', 'email', 'whatsapp', 'address', 'city', 'languages',
  'bio', 'bio_photo_url', 'quote', 'stats', 'social_links', 'seo_title',
  'seo_description', 'plan', 'is_active', 'is_demo', 'custom_domain',
])

function sanitizeProfile(profile) {
  const clean = {}
  for (const [key, val] of Object.entries(profile)) {
    if (VALID_PROFILE_COLS.has(key)) clean[key] = val
  }
  return clean
}

async function seedDemo(demo) {
  const agentId = demo.profile.id
  const slug = demo.profile.slug
  console.log(`\n--- Seeding: ${slug} (${demo.profile.business_name}) ---`)

  // 1. Check if agent already exists by slug
  const { data: existing } = await supabase
    .from('agent_profiles')
    .select('id')
    .eq('slug', slug)
    .single()

  let actualId = agentId
  if (existing) {
    // Agent exists — update it
    actualId = existing.id
    const profileData = sanitizeProfile(demo.profile)
    delete profileData.id // Don't update the id
    const { error: updateErr } = await supabase
      .from('agent_profiles')
      .update(profileData)
      .eq('id', actualId)
    if (updateErr) {
      console.error(`  Profile update error: ${updateErr.message}`)
      return false
    }
    console.log(`  Profile UPDATED (existing id: ${actualId.slice(0, 8)}...)`)
  } else {
    // Agent doesn't exist — create auth user first, then profile
    const demoEmail = `demo-${slug}@habibook.local`
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: 'DemoPassword123!',
      email_confirm: true,
    })
    if (authErr) {
      console.error(`  Auth user error: ${authErr.message}`)
      return false
    }
    actualId = authUser.user.id
    const profileData = sanitizeProfile({ ...demo.profile, id: actualId })
    const { error: insertErr } = await supabase
      .from('agent_profiles')
      .upsert(profileData, { onConflict: 'id' })
    if (insertErr) {
      console.error(`  Profile insert error: ${insertErr.message}`)
      return false
    }
    console.log(`  Profile CREATED (new id: ${actualId.slice(0, 8)}...)`)
  }

  // Override agentId for all subsequent inserts
  const effectiveId = actualId

  // 2. Upsert hero config
  const heroData = { agent_id: effectiveId, ...demo.hero }
  // Delete existing hero first (no unique constraint on agent_id for upsert)
  await supabase.from('hero_config').delete().eq('agent_id', effectiveId)
  const { error: heroErr } = await supabase.from('hero_config').insert(heroData)
  if (heroErr) console.error(`  Hero error: ${heroErr.message}`)
  else console.log(`  Hero OK`)

  // 3. Delete and re-insert properties
  await supabase.from('properties').delete().eq('agent_id', effectiveId)
  const propsData = demo.properties.map(p => {
    const { area_m2, area_built, ...rest } = p
    return { agent_id: effectiveId, size_m2: area_m2 || area_built || null, ...rest }
  })
  const { error: propsErr } = await supabase.from('properties').insert(propsData)
  if (propsErr) console.error(`  Properties error: ${propsErr.message}`)
  else console.log(`  Properties OK (${propsData.length})`)

  // 4. Delete and re-insert testimonials
  await supabase.from('testimonials').delete().eq('agent_id', effectiveId)
  const testData = demo.testimonials.map(t => ({ agent_id: effectiveId, ...t }))
  const { error: testErr } = await supabase.from('testimonials').insert(testData)
  if (testErr) console.error(`  Testimonials error: ${testErr.message}`)
  else console.log(`  Testimonials OK (${testData.length})`)

  // 5. Delete and re-insert services
  await supabase.from('services').delete().eq('agent_id', effectiveId)
  const svcData = demo.services.map(s => ({ agent_id: effectiveId, ...s }))
  const { error: svcErr } = await supabase.from('services').insert(svcData)
  if (svcErr) console.error(`  Services error: ${svcErr.message}`)
  else console.log(`  Services OK (${svcData.length})`)

  // 6. Delete and re-insert zones
  await supabase.from('zones').delete().eq('agent_id', effectiveId)
  const zoneData = demo.zones.map(z => ({ agent_id: effectiveId, ...z }))
  const { error: zoneErr } = await supabase.from('zones').insert(zoneData)
  if (zoneErr) console.error(`  Zones error: ${zoneErr.message}`)
  else console.log(`  Zones OK (${zoneData.length})`)

  // 7. Delete and re-insert team members (if any)
  await supabase.from('team_members').delete().eq('agent_id', effectiveId)
  if (demo.team.length > 0) {
    const teamData = demo.team.map(m => ({ agent_id: effectiveId, ...m }))
    const { error: teamErr } = await supabase.from('team_members').insert(teamData)
    if (teamErr) console.error(`  Team error: ${teamErr.message}`)
    else console.log(`  Team OK (${teamData.length})`)
  }

  // 8. Delete and re-insert sections
  await supabase.from('agent_sections').delete().eq('agent_id', effectiveId)
  const sectionsData = demo.sections.map((key, idx) => ({
    agent_id: effectiveId,
    section_key: key,
    is_active: true,
    display_order: idx + 1,
  }))
  const { error: secErr } = await supabase.from('agent_sections').insert(sectionsData)
  if (secErr) console.error(`  Sections error: ${secErr.message}`)
  else console.log(`  Sections OK (${sectionsData.length})`)

  return true
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════

async function main() {
  console.log('HabiBook Demo Seed Script')
  console.log('=========================')

  await ensureIsDemo()

  let success = 0
  for (const demo of DEMOS) {
    const ok = await seedDemo(demo)
    if (ok) success++
  }

  console.log(`\n=========================`)
  console.log(`Seeded ${success}/${DEMOS.length} demos successfully.`)

  // Verify
  const { data: agents } = await supabase
    .from('agent_profiles')
    .select('slug, business_name, is_demo')
    .eq('is_demo', true)

  if (agents) {
    console.log('\nDemo agents in DB:')
    for (const a of agents) {
      console.log(`  /agent/${a.slug} — ${a.business_name}`)
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
