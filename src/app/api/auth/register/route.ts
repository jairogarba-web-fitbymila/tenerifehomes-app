import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─────────────────────────────────────────────
// UNSPLASH IMAGES (free, high quality)
// ─────────────────────────────────────────────
const HERO_IMAGES: Record<string, string> = {
  luxury: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80',
  corporate: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80',
  boutique: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  network: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
  classic: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80',
  data: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
  'editorial-dark': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  'editorial-light': 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=1920&q=80',
  'editorial-agent': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80',
  'editorial-team': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
  'editorial-catalog': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  'editorial-fullservice': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
  monolith: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80',
}

const PROPERTY_IMAGES = {
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
  ],
}

const ZONE_IMAGES = [
  'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
]

const TEAM_PHOTOS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
]

// ─────────────────────────────────────────────
// DEMO CONTENT PER TEMPLATE
// ─────────────────────────────────────────────
const TEMPLATE_CONTENT: Record<string, {
  hero: { headline: string; subtitle: string; cta_text: string }
  bio: string
  quote: string
  stats: Record<string, number>
  properties: Array<{
    title: string; description: string; property_type: string; operation_type: string
    price: number; bedrooms: number; bathrooms: number; size_m2: number
    location: string; badge: string | null; images: string[]; features: string[]
  }>
  testimonials: Array<{ quote: string; client_name: string; client_location: string; rating: number }>
  services: Array<{ title: string; description: string; icon: string }>
  zones: Array<{ name: string; description: string; image_url: string; property_count: number }>
  team: Array<{ name: string; role: string; photo_url: string; bio: string; languages: string[] }>
  activeSections: string[]
}> = {
  luxury: {
    hero: {
      headline: 'Propiedades Exclusivas en Tenerife',
      subtitle: 'Descubra nuestra selección de villas y propiedades premium en las mejores ubicaciones de la isla.',
      cta_text: 'Ver Colección',
    },
    bio: 'Especializado en propiedades de lujo y exclusivas en Tenerife. Ofrecemos un servicio personalizado y discreto para clientes que buscan lo mejor de la isla. Nuestra experiencia en el mercado premium nos permite encontrar oportunidades únicas que no están disponibles en los portales convencionales.',
    quote: 'El lujo no es un precio, es una experiencia',
    stats: { propiedades_exclusivas: 24, clientes_satisfechos: 150, anos_experiencia: 12, idiomas: 4 },
    properties: [
      {
        title: 'Villa de lujo con vistas al océano en Costa Adeje',
        description: 'Espectacular villa de diseño contemporáneo con infinity pool, jardín tropical y vistas panorámicas al Atlántico. Acabados de primera calidad, domótica integral y garaje para 3 vehículos.',
        property_type: 'villa', operation_type: 'sale', price: 2450000,
        bedrooms: 5, bathrooms: 4, size_m2: 380, location: 'Costa Adeje',
        badge: 'exclusive', images: PROPERTY_IMAGES.villa,
        features: ['piscina infinity', 'vistas al mar', 'domótica', 'garaje 3 coches', 'jardín tropical'],
      },
      {
        title: 'Ático dúplex de lujo en Playa de la Arena',
        description: 'Exclusivo ático dúplex con terraza de 80m², jacuzzi privado y vistas al mar y La Gomera. Cocina de diseño italiano, suelos de mármol y acabados premium.',
        property_type: 'penthouse', operation_type: 'sale', price: 890000,
        bedrooms: 3, bathrooms: 2, size_m2: 185, location: 'Playa de la Arena',
        badge: 'featured', images: PROPERTY_IMAGES.penthouse,
        features: ['terraza 80m²', 'jacuzzi', 'vistas al mar', 'mármol', 'cocina italiana'],
      },
      {
        title: 'Apartamento premium en primera línea de mar',
        description: 'Reformado con materiales de alta gama. Acceso directo a la playa, plaza de garaje y trastero. Comunidad con piscina y jardines cuidados.',
        property_type: 'apartment', operation_type: 'sale', price: 425000,
        bedrooms: 2, bathrooms: 2, size_m2: 95, location: 'Los Cristianos',
        badge: 'new', images: PROPERTY_IMAGES.apartment,
        features: ['primera línea', 'reformado', 'garaje', 'piscina comunitaria'],
      },
    ],
    testimonials: [
      { quote: 'Un servicio impecable de principio a fin. Nos encontraron la villa perfecta en Costa Adeje cuando llevábamos meses buscando sin éxito. Totalmente recomendable.', client_name: 'Thomas & Sarah W.', client_location: 'Londres, Reino Unido', rating: 5 },
      { quote: 'Profesionalidad y discreción absolutas. Gestionaron toda la operación de compra de forma impecable, incluyendo la coordinación con nuestros asesores fiscales en Alemania.', client_name: 'Klaus M.', client_location: 'Múnich, Alemania', rating: 5 },
      { quote: 'Conocen el mercado de lujo en Tenerife como nadie. Su selección de propiedades exclusivas nos ahorró semanas de búsqueda. Un placer trabajar con verdaderos profesionales.', client_name: 'Pierre & Marie D.', client_location: 'París, Francia', rating: 5 },
    ],
    services: [
      { title: 'Búsqueda Exclusiva', description: 'Acceso a propiedades off-market y pre-lanzamientos que no encontrarás en portales convencionales. Selección curada para clientes exigentes.', icon: 'briefcase' },
      { title: 'Valoración Premium', description: 'Valoración profesional detallada de su propiedad basada en comparables reales de mercado y tendencias actuales del segmento luxury.', icon: 'building' },
      { title: 'Gestión Legal Integral', description: 'Coordinación completa con abogados, notarios y asesores fiscales especializados en compraventa internacional e inversiones.', icon: 'users' },
      { title: 'Concierge Inmobiliario', description: 'Servicio post-venta completo: reformas, interiorismo, gestión de alquileres premium y mantenimiento de propiedades.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'La zona más exclusiva del sur de Tenerife. Villas de lujo, resorts 5 estrellas y campos de golf. Hogar de las propiedades más cotizadas de la isla.', image_url: ZONE_IMAGES[0], property_count: 12 },
      { name: 'Abama', description: 'Resort residencial de lujo con campo de golf, restaurantes con estrella Michelin y acceso privado a playa. El referente del luxury living en Canarias.', image_url: ZONE_IMAGES[1], property_count: 8 },
      { name: 'Golf del Sur', description: 'Desarrollo residencial premium junto al campo de golf. Villas y apartamentos de alta gama con vistas al océano y al Teide.', image_url: ZONE_IMAGES[2], property_count: 4 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  mediterranean: {
    hero: {
      headline: 'Tu Hogar en Tenerife Te Espera',
      subtitle: 'Más de 15 años ayudando a familias a encontrar la propiedad perfecta. Cercanía, confianza y experiencia.',
      cta_text: 'Explorar Propiedades',
    },
    bio: 'Con más de 15 años de experiencia en el mercado inmobiliario de Tenerife, me dedico a ayudar a familias y particulares a encontrar su hogar ideal. Conozco cada rincón de la isla y trabajo con cercanía y confianza. Mi compromiso es acompañarte en cada paso del proceso, desde la primera visita hasta la firma ante notario.',
    quote: 'Cada familia merece encontrar el hogar de sus sueños',
    stats: { propiedades: 45, ventas_realizadas: 320, anos_experiencia: 15, clientes_felices: 280 },
    properties: [
      {
        title: 'Apartamento luminoso con terraza en Los Cristianos',
        description: 'Precioso apartamento totalmente reformado, a 5 minutos andando de la playa. Terraza con vistas al mar, cocina equipada y plaza de garaje incluida. Comunidad con piscina.',
        property_type: 'apartment', operation_type: 'sale', price: 245000,
        bedrooms: 2, bathrooms: 1, size_m2: 75, location: 'Los Cristianos',
        badge: 'featured', images: PROPERTY_IMAGES.apartment,
        features: ['terraza', 'vistas al mar', 'reformado', 'garaje', 'piscina comunitaria'],
      },
      {
        title: 'Chalet familiar con jardín en Arona',
        description: 'Amplio chalet independiente con jardín privado de 200m², barbacoa y garaje doble. Zona tranquila residencial, ideal para familias. Cerca de colegios y supermercados.',
        property_type: 'villa', operation_type: 'sale', price: 385000,
        bedrooms: 4, bathrooms: 3, size_m2: 180, location: 'Arona',
        badge: null, images: PROPERTY_IMAGES.villa,
        features: ['jardín 200m²', 'garaje doble', 'barbacoa', 'zona residencial'],
      },
      {
        title: 'Piso céntrico reformado en Santa Cruz',
        description: 'Piso completamente reformado en pleno centro de Santa Cruz. Tres habitaciones, dos baños, cocina americana y balcón. Excelente comunicación y todos los servicios.',
        property_type: 'apartment', operation_type: 'sale', price: 195000,
        bedrooms: 3, bathrooms: 2, size_m2: 90, location: 'Santa Cruz de Tenerife',
        badge: 'reduced', images: PROPERTY_IMAGES.apartment,
        features: ['céntrico', 'reformado', 'balcón', 'cocina americana'],
      },
    ],
    testimonials: [
      { quote: 'Nos ayudó a encontrar nuestro primer hogar en Tenerife. Siempre disponible, paciente y con un trato muy humano. Nos sentimos acompañados en todo momento.', client_name: 'María y Carlos G.', client_location: 'Los Cristianos', rating: 5 },
      { quote: 'Vendimos nuestro apartamento en tiempo récord y al precio que queríamos. Nos asesoró perfectamente en cada paso del proceso. Un profesional de confianza.', client_name: 'Roberto P.', client_location: 'Arona', rating: 5 },
      { quote: 'Llevábamos meses buscando por nuestra cuenta sin éxito. En dos semanas nos presentó tres opciones perfectas. Al final compramos una que ni sabíamos que existía.', client_name: 'Elena y Marco V.', client_location: 'Roma, Italia', rating: 5 },
    ],
    services: [
      { title: 'Compraventa de Propiedades', description: 'Te acompaño en todo el proceso de compra o venta de tu propiedad. Desde la valoración inicial hasta la firma ante notario, siempre a tu lado.', icon: 'building' },
      { title: 'Valoración Gratuita', description: '¿Quieres saber cuánto vale tu propiedad? Te ofrezco una valoración profesional sin compromiso basada en datos reales del mercado.', icon: 'briefcase' },
      { title: 'Asesoría para Extranjeros', description: 'Si vienes de fuera, te ayudo con todo: NIE, cuenta bancaria, abogado, traductor... Todo lo que necesitas para comprar en España sin complicaciones.', icon: 'users' },
      { title: 'Gestión de Alquileres', description: 'Si buscas alquilar tu propiedad (larga temporada o vacacional), me encargo de todo: inquilinos, contratos, mantenimiento y cobros.', icon: 'map' },
    ],
    zones: [
      { name: 'Los Cristianos', description: 'Localidad turística con ambiente familiar, playas tranquilas y todos los servicios. Una de las zonas más demandadas del sur.', image_url: ZONE_IMAGES[0], property_count: 18 },
      { name: 'Arona', description: 'Municipio con excelente calidad de vida. Zonas residenciales tranquilas, buen clima todo el año y precios competitivos.', image_url: ZONE_IMAGES[1], property_count: 15 },
      { name: 'Adeje', description: 'Desde Costa Adeje hasta los pueblos del interior. Gran variedad de propiedades: desde apartamentos turísticos hasta fincas rústicas.', image_url: ZONE_IMAGES[2], property_count: 12 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  corporate: {
    hero: {
      headline: 'Su Agencia Inmobiliaria de Confianza',
      subtitle: 'Un equipo de profesionales dedicados a encontrar la mejor inversión inmobiliaria en Tenerife.',
      cta_text: 'Ver Propiedades',
    },
    bio: 'Somos una agencia inmobiliaria profesional con un equipo de expertos dedicados a ofrecer las mejores soluciones inmobiliarias en Tenerife. Nuestro enfoque profesional y orientado a resultados, combinado con un profundo conocimiento del mercado local, garantiza la mejor experiencia para nuestros clientes nacionales e internacionales.',
    quote: 'Profesionalidad, transparencia y resultados',
    stats: { propiedades_activas: 65, equipo: 8, oficinas: 2, anos_experiencia: 20 },
    properties: [
      {
        title: 'Oficina comercial en zona prime de Santa Cruz',
        description: 'Local comercial de 120m² en pleno centro comercial. Escaparate a calle principal, aire acondicionado central, fibra óptica y plaza de garaje. Ideal para cualquier negocio.',
        property_type: 'commercial', operation_type: 'sale', price: 320000,
        bedrooms: 0, bathrooms: 1, size_m2: 120, location: 'Santa Cruz de Tenerife',
        badge: 'featured', images: PROPERTY_IMAGES.apartment,
        features: ['escaparate', 'aire acondicionado', 'fibra óptica', 'garaje'],
      },
      {
        title: 'Villa contemporánea en La Caleta',
        description: 'Proyecto llave en mano de villa moderna con piscina, orientación sur y vistas al mar. Materiales de primera calidad, eficiencia energética A y diseño arquitectónico premiado.',
        property_type: 'villa', operation_type: 'sale', price: 1250000,
        bedrooms: 4, bathrooms: 3, size_m2: 260, location: 'La Caleta, Adeje',
        badge: 'new', images: PROPERTY_IMAGES.villa,
        features: ['piscina', 'vistas al mar', 'eficiencia A', 'diseño premiado'],
      },
      {
        title: 'Apartamento de inversión con rentabilidad garantizada',
        description: 'Apartamento en complejo turístico con gestión de alquiler incluida. Rentabilidad neta del 6% anual. Ocupación media del 85%. Inversión segura con retorno demostrable.',
        property_type: 'apartment', operation_type: 'sale', price: 198000,
        bedrooms: 1, bathrooms: 1, size_m2: 55, location: 'Playa de las Américas',
        badge: 'investment', images: PROPERTY_IMAGES.apartment,
        features: ['rentabilidad 6%', 'gestión incluida', 'complejo turístico', 'piscina'],
      },
    ],
    testimonials: [
      { quote: 'Gestionaron la compra de nuestras oficinas de forma impecable. Un equipo profesional que entiende las necesidades empresariales y cumple plazos sin excusas.', client_name: 'Inmobiliaria Costa Sur S.L.', client_location: 'Costa Adeje', rating: 5 },
      { quote: 'Hemos confiado la gestión de nuestra cartera de 12 apartamentos turísticos. La ocupación ha subido un 30% y los ingresos se han incrementado notablemente.', client_name: 'Juan Antonio R.', client_location: 'Inversor, Madrid', rating: 5 },
      { quote: 'Compramos 3 propiedades como inversión siguiendo sus recomendaciones. Todas están dando la rentabilidad prevista. Son asesores de inversión inmobiliaria, no simples vendedores.', client_name: 'Schmidt & Partners GmbH', client_location: 'Frankfurt, Alemania', rating: 5 },
    ],
    services: [
      { title: 'Compraventa Profesional', description: 'Gestión integral de operaciones de compraventa con due diligence completa, valoración técnica y coordinación legal y fiscal.', icon: 'building' },
      { title: 'Asesoría de Inversión', description: 'Análisis de rentabilidad, estudios de mercado por zona y asesoramiento estratégico para inversores nacionales e internacionales.', icon: 'briefcase' },
      { title: 'Gestión Patrimonial', description: 'Administración completa de carteras inmobiliarias: alquileres, mantenimiento, fiscalidad y reporting mensual al propietario.', icon: 'users' },
      { title: 'Servicios para Empresas', description: 'Búsqueda de locales comerciales, oficinas y naves. Asesoría en expansión de negocio y relocalización empresarial.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Zona prime del sur. Alta demanda turística y residencial. Las mejores rentabilidades de alquiler vacacional de la isla.', image_url: ZONE_IMAGES[0], property_count: 28 },
      { name: 'Santa Cruz de Tenerife', description: 'Capital de provincia. Mercado diversificado: residencial, comercial y oficinas. Precios competitivos con potencial de revalorización.', image_url: ZONE_IMAGES[1], property_count: 22 },
      { name: 'Puerto de la Cruz', description: 'Norte de la isla. Mercado en crecimiento, especialmente atractivo para compradores alemanes y nórdicos. Excelente relación calidad-precio.', image_url: ZONE_IMAGES[2], property_count: 15 },
    ],
    team: [
      { name: 'Director/a Comercial', role: 'Dirección', photo_url: TEAM_PHOTOS[0], bio: 'Más de 15 años de experiencia en el sector inmobiliario. Especializado en operaciones corporativas e inversión.', languages: ['Español', 'Inglés', 'Alemán'] },
      { name: 'Agente Senior', role: 'Ventas', photo_url: TEAM_PHOTOS[1], bio: 'Especialista en propiedades residenciales y atención al cliente internacional. Enfoque personalizado y orientado a resultados.', languages: ['Español', 'Inglés', 'Francés'] },
      { name: 'Asesor de Inversión', role: 'Inversiones', photo_url: TEAM_PHOTOS[2], bio: 'Analista de mercado con experiencia en rentabilidad inmobiliaria y asesoramiento a fondos e inversores particulares.', languages: ['Español', 'Inglés'] },
    ],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'team', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  boutique: {
    hero: {
      headline: 'Inmobiliaria con Alma',
      subtitle: 'Seleccionamos cada propiedad con el mismo cuidado con el que elegiríamos la nuestra. Calidad sobre cantidad.',
      cta_text: 'Descubrir',
    },
    bio: 'Somos una agencia boutique donde cada cliente es único. No buscamos volumen, buscamos la propiedad perfecta para cada persona. Trabajamos con un número limitado de propiedades para garantizar la máxima calidad y atención personalizada. Creemos que comprar una casa no es una transacción, es un momento vital, y merece ser tratado como tal.',
    quote: 'Menos es más. Cada propiedad cuenta una historia',
    stats: { propiedades_seleccionadas: 18, clientes_satisfechos: 95, anos_experiencia: 8 },
    properties: [
      {
        title: 'Finca restaurada con encanto en el Valle de la Orotava',
        description: 'Preciosa finca canaria del siglo XIX completamente restaurada respetando su carácter original. Vigas de madera, patios interiores, huerto ecológico y vistas al Teide. Una joya única.',
        property_type: 'finca', operation_type: 'sale', price: 595000,
        bedrooms: 4, bathrooms: 3, size_m2: 220, location: 'La Orotava',
        badge: 'exclusive', images: PROPERTY_IMAGES.villa,
        features: ['restaurada', 'siglo XIX', 'huerto', 'vistas al Teide', 'vigas madera'],
      },
      {
        title: 'Apartamento con carácter en casco histórico',
        description: 'Apartamento con personalidad en un edificio histórico restaurado del centro de La Laguna. Techos altos, suelos originales de baldosa hidráulica, balcón a la plaza.',
        property_type: 'apartment', operation_type: 'sale', price: 215000,
        bedrooms: 2, bathrooms: 1, size_m2: 85, location: 'San Cristóbal de La Laguna',
        badge: null, images: PROPERTY_IMAGES.apartment,
        features: ['casco histórico', 'techos altos', 'baldosa hidráulica', 'balcón'],
      },
      {
        title: 'Casa de campo con viñedo en Tacoronte',
        description: 'Encantadora casa de campo rodeada de viñedos con producción propia de vino. Porche cubierto, barbacoa, huerto y frutales. Tranquilidad absoluta a 20 min de Santa Cruz.',
        property_type: 'finca', operation_type: 'sale', price: 345000,
        bedrooms: 3, bathrooms: 2, size_m2: 150, location: 'Tacoronte',
        badge: 'featured', images: PROPERTY_IMAGES.villa,
        features: ['viñedo', 'huerto', 'barbacoa', 'porche', 'tranquilidad'],
      },
    ],
    testimonials: [
      { quote: 'No son agentes inmobiliarios al uso. Se tomaron el tiempo de entender qué buscábamos realmente, no solo en metros cuadrados, sino en estilo de vida. Encontraron nuestra finca soñada.', client_name: 'Caroline & Jean-Luc B.', client_location: 'Burdeos, Francia', rating: 5 },
      { quote: 'La atención personalizada marca la diferencia. Nos presentaron solo 4 propiedades, pero las 4 encajaban perfectamente con lo que buscábamos. Sin perder el tiempo.', client_name: 'Marta S.', client_location: 'Barcelona', rating: 5 },
      { quote: 'Vendieron nuestra casa en La Laguna preservando su historia. Encontraron compradores que aprecian el patrimonio, no especuladores. Eso tiene un valor incalculable para nosotros.', client_name: 'Familia Hernández', client_location: 'La Laguna', rating: 5 },
    ],
    services: [
      { title: 'Búsqueda Personalizada', description: 'No trabajamos con listados genéricos. Cada búsqueda es un proyecto personal. Escuchamos, entendemos y encontramos.', icon: 'briefcase' },
      { title: 'Propiedades con Historia', description: 'Nos especializamos en fincas, casas históricas y propiedades con carácter. Cada una cuenta una historia que merece ser continuada.', icon: 'building' },
      { title: 'Acompañamiento Integral', description: 'Desde la primera visita hasta después de la mudanza. Arquitectos, reformas, decoración, jardinería... Todo coordinado por nosotros.', icon: 'users' },
      { title: 'Valoración de Propiedades Singulares', description: 'Valorar una finca o una casa histórica requiere experiencia y sensibilidad. No es solo precio por metro cuadrado.', icon: 'map' },
    ],
    zones: [
      { name: 'La Orotava', description: 'Valle fértil con fincas históricas, casonas señoriales y una de las panorámicas más bellas de Tenerife. Patrimonio y naturaleza.', image_url: ZONE_IMAGES[0], property_count: 6 },
      { name: 'La Laguna', description: 'Patrimonio de la Humanidad. Casco histórico vibrante, universidad, cultura. Propiedades con carácter en un entorno inigualable.', image_url: ZONE_IMAGES[1], property_count: 8 },
      { name: 'Tacoronte - Tegueste', description: 'Zona vinícola del norte. Casas de campo, fincas rústicas y bodegas. Para quienes buscan vivir rodeados de naturaleza.', image_url: ZONE_IMAGES[2], property_count: 4 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  network: {
    hero: {
      headline: 'La Mayor Red Inmobiliaria de Tenerife',
      subtitle: 'Múltiples oficinas, cientos de propiedades y un equipo experto. Si está en venta, lo tenemos.',
      cta_text: 'Buscar Propiedades',
    },
    bio: 'Con presencia en las principales zonas de Tenerife, ofrecemos la cobertura más amplia del mercado inmobiliario de la isla. Nuestro equipo de agentes especializados por zona garantiza un conocimiento profundo de cada barrio, cada calle y cada oportunidad. Más de 400 propiedades en cartera y creciendo cada día.',
    quote: 'En Tenerife, si se vende, pasa por nosotros',
    stats: { propiedades: 420, agentes: 15, oficinas: 3, anos_experiencia: 25 },
    properties: [
      {
        title: 'Apartamento turístico con licencia VV en Los Cristianos',
        description: 'Apartamento de 1 dormitorio con licencia de vivienda vacacional activa. Ocupación del 80%, ingreso neto mensual de 1.200€. Inversión ideal con retorno inmediato.',
        property_type: 'apartment', operation_type: 'sale', price: 175000,
        bedrooms: 1, bathrooms: 1, size_m2: 45, location: 'Los Cristianos',
        badge: 'investment', images: PROPERTY_IMAGES.apartment,
        features: ['licencia VV', 'rentabilidad 8%', 'amueblado', 'piscina'],
      },
      {
        title: 'Chalet adosado familiar en San Isidro',
        description: 'Adosado de 3 plantas con garaje, trastero, azotea privada y pequeño jardín. Zona residencial tranquila, cerca de colegios y centro comercial. Perfecto para familias.',
        property_type: 'townhouse', operation_type: 'sale', price: 275000,
        bedrooms: 3, bathrooms: 2, size_m2: 130, location: 'San Isidro, Granadilla',
        badge: null, images: PROPERTY_IMAGES.villa,
        features: ['garaje', 'trastero', 'azotea', 'jardín', 'zona residencial'],
      },
      {
        title: 'Villa con piscina en Palm-Mar',
        description: 'Villa independiente en urbanización cerrada con vigilancia 24h. Piscina privada, jardín tropical, 4 dormitorios y vistas al océano. Urbanización tranquila y segura.',
        property_type: 'villa', operation_type: 'sale', price: 650000,
        bedrooms: 4, bathrooms: 3, size_m2: 200, location: 'Palm-Mar, Arona',
        badge: 'featured', images: PROPERTY_IMAGES.villa,
        features: ['piscina privada', 'seguridad 24h', 'vistas al mar', 'jardín tropical'],
      },
    ],
    testimonials: [
      { quote: 'Tienen propiedades en todas las zonas. Nos mostraron opciones en el sur y en el norte hasta que encontramos exactamente lo que buscábamos. Ninguna otra agencia tiene esa cobertura.', client_name: 'David & Anna K.', client_location: 'Estocolmo, Suecia', rating: 5 },
      { quote: 'Compramos dos apartamentos como inversión en zonas diferentes de la isla. Su equipo nos asesoró sobre las mejores ubicaciones para rentabilidad turística. Resultados excelentes.', client_name: 'Grupo Inversor Baltic', client_location: 'Vilna, Lituania', rating: 5 },
      { quote: 'Vendimos nuestra casa en Granadilla en 3 semanas. La pusieron en su red de 3 oficinas y tuvieron compradores al instante. El poder de una red grande se nota.', client_name: 'Francisco y Ana M.', client_location: 'Granadilla de Abona', rating: 5 },
    ],
    services: [
      { title: 'Compraventa en Toda la Isla', description: 'Con oficinas en norte, sur y metropolitana, cubrimos toda Tenerife. No importa dónde busques, tenemos un agente especializado en esa zona.', icon: 'building' },
      { title: 'Inversión Inmobiliaria', description: 'Asesoramiento profesional para inversores: análisis de rentabilidad, gestión de carteras y acceso a oportunidades antes de salir al mercado.', icon: 'briefcase' },
      { title: 'Gestión Integral de Alquileres', description: 'Gestionamos más de 200 propiedades en alquiler. Vacacional y larga temporada. Inquilinos verificados, cobros garantizados y mantenimiento incluido.', icon: 'users' },
      { title: 'Red de Colaboración MLS', description: 'Formamos parte de la red MLS más grande de Canarias. Si otro agente tiene un comprador para tu propiedad, lo sabremos.', icon: 'map' },
    ],
    zones: [
      { name: 'Sur de Tenerife', description: 'Costa Adeje, Arona, Los Cristianos, Las Américas, San Isidro, Palm-Mar, El Médano. La zona con mayor demanda turística y residencial.', image_url: ZONE_IMAGES[0], property_count: 180 },
      { name: 'Norte de Tenerife', description: 'Puerto de la Cruz, La Orotava, Icod, Los Realejos. Paisajes espectaculares, mercado en crecimiento y precios más accesibles.', image_url: ZONE_IMAGES[1], property_count: 120 },
      { name: 'Área Metropolitana', description: 'Santa Cruz y La Laguna. El motor económico de la isla. Oficinas, locales comerciales y vivienda residencial urbana.', image_url: ZONE_IMAGES[2], property_count: 120 },
    ],
    team: [
      { name: 'Director/a General', role: 'Dirección', photo_url: TEAM_PHOTOS[0], bio: 'Fundador de la agencia con 25 años de experiencia en el mercado inmobiliario canario. Visión estratégica y liderazgo.', languages: ['Español', 'Inglés'] },
      { name: 'Responsable Zona Sur', role: 'Oficina Sur', photo_url: TEAM_PHOTOS[1], bio: 'Especialista en el mercado del sur de Tenerife. 10 años de experiencia, más de 200 operaciones cerradas.', languages: ['Español', 'Inglés', 'Alemán'] },
      { name: 'Responsable Zona Norte', role: 'Oficina Norte', photo_url: TEAM_PHOTOS[2], bio: 'Experto en el mercado del norte. Conoce cada pueblo, cada finca y cada oportunidad del Valle de la Orotava.', languages: ['Español', 'Inglés', 'Francés'] },
    ],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'team', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  classic: {
    hero: {
      headline: 'Experiencia y Confianza en el Mercado Inmobiliario',
      subtitle: 'Más de 20 años vendiendo propiedades en Tenerife. Un nombre sinónimo de seriedad y resultados.',
      cta_text: 'Ver Propiedades',
    },
    bio: 'Con más de dos décadas de experiencia en el mercado inmobiliario de Tenerife, ofrezco un servicio basado en la confianza, el conocimiento profundo del mercado y la dedicación personal a cada cliente. He acompañado a cientos de familias en la compra y venta de sus propiedades, construyendo relaciones duraderas basadas en resultados.',
    quote: 'La experiencia no se improvisa, se construye propiedad a propiedad',
    stats: { propiedades_vendidas: 500, anos_experiencia: 22, clientes_recomiendan: 98, premios: 5 },
    properties: [
      {
        title: 'Villa clásica con jardín en La Orotava',
        description: 'Elegante villa de estilo canario con amplios jardines, piscina y vistas al Valle de La Orotava y al Teide. Materiales nobles, techos de madera y acabados artesanales.',
        property_type: 'villa', operation_type: 'sale', price: 485000,
        bedrooms: 4, bathrooms: 3, size_m2: 250, location: 'La Orotava',
        badge: 'featured', images: PROPERTY_IMAGES.villa,
        features: ['jardín', 'piscina', 'vistas al Teide', 'estilo canario'],
      },
      {
        title: 'Piso reformado en zona residencial de Santa Cruz',
        description: 'Amplio piso de 3 habitaciones totalmente reformado. Zona residencial tranquila, garaje y trastero incluidos. Excelente comunicación.',
        property_type: 'apartment', operation_type: 'sale', price: 225000,
        bedrooms: 3, bathrooms: 2, size_m2: 110, location: 'Santa Cruz de Tenerife',
        badge: null, images: PROPERTY_IMAGES.apartment,
        features: ['reformado', 'garaje', 'trastero', 'zona residencial'],
      },
      {
        title: 'Ático con terraza panorámica en Los Cristianos',
        description: 'Ático luminoso con gran terraza y vistas al mar. Cocina equipada, aire acondicionado y plaza de garaje. Complejo con piscina.',
        property_type: 'penthouse', operation_type: 'sale', price: 345000,
        bedrooms: 2, bathrooms: 2, size_m2: 95, location: 'Los Cristianos',
        badge: 'new', images: PROPERTY_IMAGES.penthouse,
        features: ['terraza panorámica', 'vistas al mar', 'garaje', 'piscina comunitaria'],
      },
    ],
    testimonials: [
      { quote: 'Un profesional de la vieja escuela, en el mejor sentido. Serio, cumplidor y con un conocimiento del mercado que solo dan los años. Vendió nuestra casa en un mes.', client_name: 'Fernando y Lucía M.', client_location: 'Santa Cruz de Tenerife', rating: 5 },
      { quote: 'Nos lo recomendó un amigo hace 10 años y desde entonces no trabajamos con nadie más. Ha gestionado 3 operaciones nuestras sin un solo problema.', client_name: 'Javier P.', client_location: 'La Laguna', rating: 5 },
      { quote: 'En un mercado lleno de improvisados, encontrar a alguien con su trayectoria y reputación fue un alivio. Compra segura y sin sorpresas.', client_name: 'Heinrich & Petra S.', client_location: 'Hamburgo, Alemania', rating: 5 },
    ],
    services: [
      { title: 'Compraventa Inmobiliaria', description: 'Servicio completo de compraventa con más de 500 operaciones exitosas. Valoración precisa, negociación experta y cierre seguro.', icon: 'building' },
      { title: 'Valoración Profesional', description: 'Valoraciones basadas en 20 años de datos de mercado propios. Precisión demostrada y análisis comparativo detallado.', icon: 'briefcase' },
      { title: 'Asesoría Legal y Fiscal', description: 'Red de abogados, notarios y asesores fiscales de confianza. Coordinación integral de toda la documentación.', icon: 'users' },
      { title: 'Gestión de Patrimonio', description: 'Administración de propiedades, gestión de alquileres y mantenimiento preventivo para propietarios nacionales e internacionales.', icon: 'map' },
    ],
    zones: [
      { name: 'Santa Cruz de Tenerife', description: 'Capital de la isla con amplia oferta residencial y comercial. Precios competitivos y excelentes infraestructuras.', image_url: ZONE_IMAGES[0], property_count: 25 },
      { name: 'La Orotava', description: 'Valle histórico con propiedades de carácter. Casas señoriales, fincas y villas con encanto en un entorno natural privilegiado.', image_url: ZONE_IMAGES[1], property_count: 12 },
      { name: 'Los Cristianos', description: 'Zona turística consolidada del sur. Alta demanda de compra e inversión. Excelente para alquiler vacacional.', image_url: ZONE_IMAGES[2], property_count: 18 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  data: {
    hero: {
      headline: 'Inmobiliaria Inteligente Basada en Datos',
      subtitle: 'Decisiones informadas con análisis de mercado en tiempo real. Tecnología al servicio de tu inversión.',
      cta_text: 'Explorar Mercado',
    },
    bio: 'Somos la primera agencia inmobiliaria data-driven de Tenerife. Utilizamos análisis de datos, inteligencia artificial y tecnología avanzada para ofrecer valoraciones precisas, identificar tendencias de mercado y maximizar el retorno de inversión de nuestros clientes. Cada decisión está respaldada por datos reales, no por intuiciones.',
    quote: 'Los datos no mienten. Tu inversión tampoco debería basarse en suposiciones.',
    stats: { propiedades_analizadas: 5000, precision_valoracion: 97, clientes_inversores: 180, roi_medio: 8 },
    properties: [
      {
        title: 'Oportunidad de inversión: Apartamento en zona de alta demanda',
        description: 'Datos de mercado confirman crecimiento del 12% anual en esta zona. Apartamento con licencia VV y rentabilidad neta demostrada del 7.5%. Análisis completo disponible.',
        property_type: 'apartment', operation_type: 'sale', price: 195000,
        bedrooms: 1, bathrooms: 1, size_m2: 55, location: 'Costa Adeje',
        badge: 'investment', images: PROPERTY_IMAGES.apartment,
        features: ['licencia VV', 'ROI 7.5%', 'zona crecimiento', 'datos verificados'],
      },
      {
        title: 'Villa con potencial de revalorización en La Caleta',
        description: 'Análisis predictivo indica potencial de revalorización del 15% en 3 años. Villa en zona emergente con todos los indicadores positivos de mercado.',
        property_type: 'villa', operation_type: 'sale', price: 780000,
        bedrooms: 4, bathrooms: 3, size_m2: 220, location: 'La Caleta, Adeje',
        badge: 'trending', images: PROPERTY_IMAGES.villa,
        features: ['zona emergente', 'revalorización', 'análisis predictivo', 'piscina'],
      },
      {
        title: 'Ático smart home con domótica integral',
        description: 'Propiedad tecnológica con sistema domótico completo, paneles solares y certificación energética A. Monitorización remota y eficiencia máxima.',
        property_type: 'penthouse', operation_type: 'sale', price: 420000,
        bedrooms: 2, bathrooms: 2, size_m2: 100, location: 'Playa de las Américas',
        badge: 'new', images: PROPERTY_IMAGES.penthouse,
        features: ['domótica', 'paneles solares', 'eficiencia A', 'smart home'],
      },
    ],
    testimonials: [
      { quote: 'Por primera vez sentí que compraba con información real. Me mostraron datos de rentabilidad, tendencias de zona y comparativas que ningún otro agente tenía. Inversión perfecta.', client_name: 'Alex R.', client_location: 'Madrid', rating: 5 },
      { quote: 'Su análisis predictivo de mercado fue certero. Compramos donde nos recomendaron y en 2 años la propiedad se ha revalorizado un 18%. Datos, no humo.', client_name: 'Investment Group Nordic', client_location: 'Helsinki, Finlandia', rating: 5 },
      { quote: 'La transparencia de datos es total. Dashboard con toda la información de mi propiedad en tiempo real: ocupación, ingresos, gastos, rentabilidad neta. Gestión del siglo XXI.', client_name: 'Patricia & Marco G.', client_location: 'Milán, Italia', rating: 5 },
    ],
    services: [
      { title: 'Análisis de Mercado con IA', description: 'Valoraciones precisas al 97% basadas en machine learning y datos de miles de transacciones reales en Tenerife.', icon: 'briefcase' },
      { title: 'Dashboard de Inversión', description: 'Panel de control en tiempo real con métricas de tu propiedad: ocupación, rentabilidad, comparativa de zona y proyecciones.', icon: 'building' },
      { title: 'Alertas de Oportunidad', description: 'Sistema automatizado que detecta oportunidades de inversión basándose en tus criterios y envía alertas antes de que salgan al mercado.', icon: 'users' },
      { title: 'Reportes Predictivos', description: 'Informes trimestrales con predicción de tendencias de mercado, zonas de crecimiento y recomendaciones de inversión respaldadas por datos.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Zona con mayor crecimiento del sur (+12% anual). Alta demanda turística, ocupación media del 82% y rentabilidad líder en Canarias.', image_url: ZONE_IMAGES[0], property_count: 35 },
      { name: 'El Médano', description: 'Zona emergente con potencial de revalorización. Tendencia alcista confirmada. Perfil joven-deportivo con creciente demanda internacional.', image_url: ZONE_IMAGES[1], property_count: 18 },
      { name: 'Puerto de la Cruz', description: 'Mercado infravalorado según nuestros modelos. Potencial de crecimiento del 20% en 5 años. Oportunidad para inversores con visión a largo plazo.', image_url: ZONE_IMAGES[2], property_count: 22 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  'editorial-dark': {
    hero: { headline: 'Experiencia en Cada Detalle', subtitle: 'Propiedades exclusivas en el sur de Tenerife — conocimiento local, estándares internacionales.', cta_text: 'Ver Propiedades' },
    bio: 'Más de 15 años especializándome en propiedades exclusivas del sur de Tenerife. Mi enfoque combina conocimiento profundo del mercado local con estándares internacionales de servicio. Cada cliente recibe mi atención personal directa.',
    quote: 'Cada propiedad cuenta una historia. Mi trabajo es encontrar la que se ajusta a la tuya.',
    stats: { propiedades_exclusivas: 45, ventas_realizadas: 320, anos_experiencia: 15, idiomas: 4 },
    properties: [
      { title: 'Villa Alisios — Costa Adeje', description: 'Villa de diseño con piscina privada, 4 dormitorios y vistas panorámicas al mar. Acabados premium y jardín tropical.', property_type: 'villa', operation_type: 'sale', price: 1850000, bedrooms: 4, bathrooms: 3, size_m2: 380, location: 'Costa Adeje', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['piscina privada', 'vistas al mar', 'jardín tropical', 'garaje'] },
      { title: 'Penthouse Las Américas', description: 'Ático de lujo con terraza de 60m² y jacuzzi privado. Acabados de primera calidad.', property_type: 'penthouse', operation_type: 'sale', price: 920000, bedrooms: 3, bathrooms: 2, size_m2: 180, location: 'Playa de las Américas', badge: 'new', images: PROPERTY_IMAGES.penthouse, features: ['terraza 60m²', 'jacuzzi', 'vistas al mar'] },
      { title: 'Apartamento Fañabé', description: 'Apartamento reformado en zona residencial. Terraza con vistas, comunidad con piscina.', property_type: 'apartment', operation_type: 'rent_long', price: 1200, bedrooms: 2, bathrooms: 1, size_m2: 85, location: 'Fañabé, Adeje', badge: null, images: PROPERTY_IMAGES.apartment, features: ['reformado', 'terraza', 'piscina comunitaria'] },
    ],
    testimonials: [
      { quote: 'An impeccable service from start to finish. Found us our dream villa in Costa Adeje within two weeks. Highly recommended.', client_name: 'James & Catherine P.', client_location: 'Surrey, UK', rating: 5 },
      { quote: 'Erstklassiger Service. Die gesamte Abwicklung war professionell und transparent. Absolut empfehlenswert!', client_name: 'Familie Hoffmann', client_location: 'Hamburg, Alemania', rating: 5 },
      { quote: "Un service d'exception. Discrétion, professionnalisme et une connaissance parfaite du marché de Tenerife.", client_name: 'Jean-Pierre & Marie L.', client_location: 'Lyon, Francia', rating: 5 },
    ],
    services: [
      { title: 'Compraventa Premium', description: 'Asesoramiento integral en compra y venta de propiedades exclusivas en Tenerife Sur.', icon: 'briefcase' },
      { title: 'Valoración de Mercado', description: 'Análisis profesional con datos actualizados para establecer el precio óptimo.', icon: 'building' },
      { title: 'Asesoría Legal Internacional', description: 'Red de abogados especializados en compradores extranjeros, NIE e impuestos.', icon: 'users' },
      { title: 'Home Staging', description: 'Preparación profesional para maximizar el atractivo y valor de venta.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'La zona más exclusiva del sur de Tenerife. Villas de lujo y resorts 5 estrellas.', image_url: ZONE_IMAGES[0], property_count: 45 },
      { name: 'Los Cristianos', description: 'Centro turístico consolidado con excelente infraestructura y ambiente internacional.', image_url: ZONE_IMAGES[1], property_count: 32 },
      { name: 'Guía de Isora', description: 'Naturaleza y tranquilidad. Abama Resort y fincas exclusivas.', image_url: ZONE_IMAGES[2], property_count: 18 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  'editorial-light': {
    hero: { headline: 'Propiedades con Alma', subtitle: 'Cada espacio tiene un potencial. Con ojo de arquitecta y corazón de asesora, te ayudo a descubrirlo.', cta_text: 'Descubrir' },
    bio: 'Arquitecta de formación reconvertida en asesora inmobiliaria. Evalúo cada propiedad con ojo profesional: orientación, materiales, distribución, potencial de reforma. No vendo metros cuadrados, vendo calidad de vida.',
    quote: 'Una buena casa no se vende. Se presenta, y el comprador se enamora solo.',
    stats: { propiedades: 38, ventas_realizadas: 145, anos_experiencia: 9, idiomas: 3 },
    properties: [
      { title: 'Villa de Diseño con Jardín Zen', description: 'Arquitectura contemporánea con materiales nobles, espacios abiertos y jardín zen. Orientación sur.', property_type: 'villa', operation_type: 'sale', price: 1650000, bedrooms: 4, bathrooms: 3, size_m2: 320, location: 'La Caleta', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['jardín zen', 'orientación sur', 'materiales nobles'] },
      { title: 'Ático Dúplex con Solárium', description: 'Dúplex luminoso con solárium privado de 40m². Vistas panorámicas y acabados de diseño.', property_type: 'penthouse', operation_type: 'sale', price: 780000, bedrooms: 3, bathrooms: 2, size_m2: 165, location: 'El Duque', badge: null, images: PROPERTY_IMAGES.penthouse, features: ['solárium 40m²', 'vistas panorámicas', 'acabados diseño'] },
      { title: 'Apartamento Reformado de Autor', description: 'Reforma integral con proyecto de interiorismo. Cocina abierta, iluminación natural perfecta.', property_type: 'apartment', operation_type: 'sale', price: 420000, bedrooms: 2, bathrooms: 2, size_m2: 95, location: 'Costa Adeje', badge: 'new', images: PROPERTY_IMAGES.apartment, features: ['reforma de autor', 'cocina abierta', 'iluminación natural'] },
    ],
    testimonials: [
      { quote: 'Ariadna vio potencial en un apartamento que casi descartamos. Ahora es nuestro hogar soñado. Su ojo de arquitecta marca la diferencia.', client_name: 'Claudia & Stefan W.', client_location: 'Viena, Austria', rating: 5 },
      { quote: "Her architect's eye caught things we never would have noticed. She doesn't just sell properties — she transforms perspectives.", client_name: 'Rachel & Tom E.', client_location: 'Dublin, Irlanda', rating: 5 },
      { quote: "Un'agente che capisce l'architettura e il design. Ci ha consigliato modifiche che hanno trasformato lo spazio.", client_name: 'Paolo & Chiara R.', client_location: 'Roma, Italia', rating: 5 },
    ],
    services: [
      { title: 'Evaluación Arquitectónica', description: 'Análisis profesional de orientación, materiales, distribución y potencial de reforma.', icon: 'building' },
      { title: 'Asesoría de Compra', description: 'Acompañamiento experto para encontrar la propiedad que encaja contigo.', icon: 'briefcase' },
      { title: 'Proyecto de Reforma', description: 'Presupuesto y diseño conceptual para transformar cualquier espacio.', icon: 'users' },
      { title: 'Home Staging Premium', description: 'Puesta en escena profesional para vender rápido y al mejor precio.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Zona premium con edificaciones modernas y buena orientación solar.', image_url: ZONE_IMAGES[0], property_count: 38 },
      { name: 'El Duque', description: 'Primera línea con los acabados más cuidados del sur de Tenerife.', image_url: ZONE_IMAGES[1], property_count: 15 },
      { name: 'La Caleta', description: 'Pueblo costero con villas de autor y mucha personalidad.', image_url: ZONE_IMAGES[2], property_count: 12 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  'editorial-agent': {
    hero: { headline: 'Tu Guía Inmobiliario en Tenerife', subtitle: 'Expat specialist. 14 años ayudando a europeos a encontrar su hogar al sol.', cta_text: 'Contactar' },
    bio: 'Sé lo que es comprar aquí siendo extranjero porque yo lo hice. Guío a compradores nórdicos y europeos por todo el proceso: desde la primera visita hasta tener las llaves en la mano. Sin sorpresas, sin letra pequeña.',
    quote: 'Compré mi primera propiedad aquí hace 14 años. Sé exactamente qué necesitas saber porque yo pasé por lo mismo.',
    stats: { propiedades: 52, ventas_realizadas: 280, anos_experiencia: 14, idiomas: 4 },
    properties: [
      { title: 'Villa Moderna con Piscina Privada', description: 'Villa contemporánea de 4 dormitorios con piscina infinity y jardín privado. Zona residencial exclusiva.', property_type: 'villa', operation_type: 'sale', price: 1450000, bedrooms: 4, bathrooms: 3, size_m2: 310, location: 'Costa Adeje', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['piscina infinity', 'jardín privado', 'zona exclusiva'] },
      { title: 'Penthouse con Jacuzzi en Terraza', description: 'Ático de 3 dormitorios con jacuzzi privado y vistas panorámicas al océano Atlántico.', property_type: 'penthouse', operation_type: 'sale', price: 620000, bedrooms: 3, bathrooms: 2, size_m2: 150, location: 'Playa de las Américas', badge: 'new', images: PROPERTY_IMAGES.penthouse, features: ['jacuzzi privado', 'vistas panorámicas', 'terraza'] },
      { title: 'Apartamento Vacacional Amueblado', description: 'Estudio completamente amueblado y equipado. Listo para alquilar o disfrutar. Comunidad con piscina.', property_type: 'apartment', operation_type: 'rent_vacation', price: 95, bedrooms: 1, bathrooms: 1, size_m2: 55, location: 'Fañabé', badge: null, images: PROPERTY_IMAGES.apartment, features: ['amueblado', 'equipado', 'piscina comunitaria'] },
    ],
    testimonials: [
      { quote: 'Henrik förstod exakt vad vi letade efter. Hela processen var smidig och trygg. Rekommenderas varmt!', client_name: 'Erik & Anna J.', client_location: 'Gotemburgo, Suecia', rating: 5 },
      { quote: 'Henrik made buying in Spain feel safe and simple. He handled everything — NIE, bank, notary. Brilliant service.', client_name: 'Knut & Ingrid O.', client_location: 'Oslo, Noruega', rating: 5 },
      { quote: 'As Brits buying abroad, we were nervous. Henrik walked us through every step with patience and real expertise.', client_name: 'Michael & Sarah B.', client_location: 'Leeds, UK', rating: 5 },
    ],
    services: [
      { title: 'Búsqueda Personalizada', description: 'Encuentro propiedades que encajan con tu estilo de vida, no solo con tu presupuesto.', icon: 'briefcase' },
      { title: 'Trámites para Extranjeros', description: 'NIE, cuenta bancaria, gestoría fiscal, poder notarial — todo gestionado.', icon: 'users' },
      { title: 'Negociación Experta', description: 'Consigo el mejor precio posible. Conozco el mercado y sus márgenes reales.', icon: 'building' },
      { title: 'Postventa y Mudanza', description: 'Alta de suministros, seguros, reformas menores, conexión de internet.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'La zona favorita de los compradores nórdicos y europeos.', image_url: ZONE_IMAGES[0], property_count: 52 },
      { name: 'Los Cristianos', description: 'Ambiente internacional y servicios completos todo el año.', image_url: ZONE_IMAGES[1], property_count: 38 },
      { name: 'Golf del Sur', description: 'Comunidad británica, campos de golf y tranquilidad.', image_url: ZONE_IMAGES[2], property_count: 25 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  'editorial-team': {
    hero: { headline: 'Trabaja con los Mejores', subtitle: 'Compraventa, alquileres e inversión. Un equipo especializado para cada necesidad.', cta_text: 'Conoce al Equipo' },
    bio: 'Tres perfiles complementarios que cubren compraventa, alquileres vacacionales e inversión inmobiliaria en el sur de Tenerife. Un equipo, todas las respuestas.',
    quote: 'Tres cabezas piensan mejor que una. Y tres especialistas, aún mejor.',
    stats: { propiedades_activas: 68, ventas_realizadas: 520, anos_experiencia: 18, idiomas: 5 },
    properties: [
      { title: 'Villa Premium Costa Adeje', description: 'Villa de lujo de 5 dormitorios con piscina infinity y jardín de 500m². Ubicación premium.', property_type: 'villa', operation_type: 'sale', price: 2100000, bedrooms: 5, bathrooms: 4, size_m2: 400, location: 'Costa Adeje', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['piscina infinity', 'jardín 500m²', '5 dormitorios'] },
      { title: 'Apartamento Playa Primera Línea', description: 'Apartamento vacacional en primera línea de playa. 2 dormitorios con terraza y vistas al mar.', property_type: 'apartment', operation_type: 'rent_vacation', price: 130, bedrooms: 2, bathrooms: 1, size_m2: 75, location: 'Fañabé', badge: null, images: PROPERTY_IMAGES.apartment, features: ['primera línea', 'terraza', 'vistas al mar'] },
      { title: 'Chalet Inversión Turística', description: 'Chalet con licencia VV lista. 3 dormitorios, piscina comunitaria. Rendimiento 7.5% neto.', property_type: 'villa', operation_type: 'sale', price: 550000, bedrooms: 3, bathrooms: 2, size_m2: 180, location: 'Los Cristianos', badge: 'investment', images: PROPERTY_IMAGES.villa, features: ['licencia VV', 'rendimiento 7.5%', 'piscina'] },
    ],
    testimonials: [
      { quote: 'Marco hat uns perfekt beraten. Unsere Ferienwohnung bringt 7,5% Rendite. Besser als erwartet!', client_name: 'Die Familie Becker', client_location: 'Düsseldorf, Alemania', rating: 5 },
      { quote: "Elena gère notre location saisonnière depuis 2 ans. Taux d'occupation de 85%. Service impeccable.", client_name: 'Famille Dupont', client_location: 'Nantes, Francia', rating: 5 },
      { quote: 'The whole team is brilliant. Julián for buying, Elena for renting out. Truly a one-stop shop.', client_name: 'Robert & Jane M.', client_location: 'Cardiff, UK', rating: 5 },
    ],
    services: [
      { title: 'Compraventa Residencial', description: 'Especialista en vivienda habitual y segunda residencia en el sur de Tenerife.', icon: 'building' },
      { title: 'Alquiler Vacacional', description: 'Gestión integral: reservas, limpieza, mantenimiento y atención al huésped.', icon: 'briefcase' },
      { title: 'Inversión Internacional', description: 'ROI, fiscalidad, Golden Visa y optimización fiscal para inversores.', icon: 'users' },
      { title: 'Property Management', description: 'Mantenimiento, limpieza, check-in/out y reporting mensual completo.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Sede del equipo. Zona premium con máxima demanda turística.', image_url: ZONE_IMAGES[0], property_count: 68 },
      { name: 'Las Américas', description: 'Centro turístico. Ideal para inversión vacacional de alto rendimiento.', image_url: ZONE_IMAGES[1], property_count: 45 },
      { name: 'Los Cristianos', description: 'Mercado mixto: residencial e inversión con demanda constante.', image_url: ZONE_IMAGES[2], property_count: 52 },
    ],
    team: [
      { name: 'Julián Vega', role: 'Director Comercial', photo_url: TEAM_PHOTOS[0], bio: 'Especialista en compraventa residencial con 15 años de experiencia en el sur de Tenerife.', languages: ['Español', 'Inglés'] },
      { name: 'Elena Martín', role: 'Directora de Alquileres', photo_url: TEAM_PHOTOS[1], bio: 'Gestión integral de viviendas turísticas. Tasa de ocupación media del 85%.', languages: ['Español', 'Francés', 'Italiano'] },
      { name: 'Marco Torres', role: 'Asesor de Inversiones', photo_url: TEAM_PHOTOS[2], bio: 'Especialista en inversión inmobiliaria internacional. ROI, fiscalidad, Golden Visa.', languages: ['Español', 'Alemán', 'Inglés'] },
    ],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'team', 'contact_form'],
  },

  'editorial-catalog': {
    hero: { headline: 'Encuentra tu Propiedad Ideal', subtitle: '+200 propiedades en venta y alquiler en el sur de Tenerife. Filtra por tipo, zona y precio.', cta_text: 'Explorar Catálogo' },
    bio: 'El catálogo inmobiliario más completo del sur de Tenerife. Más de 200 propiedades activas entre venta, alquiler vacacional y alquiler de larga temporada. Filtra, compara y encuentra.',
    quote: 'El catálogo más amplio. La búsqueda más fácil. La decisión, tuya.',
    stats: { propiedades_activas: 200, ventas_realizadas: 400, anos_experiencia: 12, zonas: 8 },
    properties: [
      { title: 'Villa Moderna 4 Dormitorios', description: 'Villa de diseño contemporáneo con jardín privado y piscina. Zona residencial exclusiva de Costa Adeje.', property_type: 'villa', operation_type: 'sale', price: 1250000, bedrooms: 4, bathrooms: 3, size_m2: 300, location: 'Costa Adeje', badge: 'new', images: PROPERTY_IMAGES.villa, features: ['piscina', 'jardín privado', 'diseño contemporáneo'] },
      { title: 'Estudio Vacacional Playa', description: 'Estudio reformado en primera línea. Ideal para inversión. Comunidad con piscina y jardines.', property_type: 'apartment', operation_type: 'rent_vacation', price: 85, bedrooms: 1, bathrooms: 1, size_m2: 40, location: 'Los Cristianos', badge: null, images: PROPERTY_IMAGES.apartment, features: ['primera línea', 'reformado', 'piscina comunitaria'] },
      { title: 'Piso 3 Dorm. Larga Temporada', description: 'Amplio piso de 3 dormitorios en zona céntrica. Cerca de colegios, supermercados y transporte.', property_type: 'apartment', operation_type: 'rent_long', price: 1100, bedrooms: 3, bathrooms: 2, size_m2: 95, location: 'Los Cristianos', badge: null, images: PROPERTY_IMAGES.apartment, features: ['céntrico', 'cerca colegios', '3 dormitorios'] },
    ],
    testimonials: [
      { quote: 'Das umfangreichste Immobilienportal für Teneriffa Süd. Wir haben unser Apartment in 2 Tagen gefunden.', client_name: 'Sandra & Michael H.', client_location: 'Stuttgart, Alemania', rating: 5 },
      { quote: 'La web es súper fácil de usar. Filtré por zona y presupuesto y en 5 minutos ya tenía mis favoritos.', client_name: 'María José F.', client_location: 'Bilbao, España', rating: 5 },
      { quote: 'We browsed 50 properties online before visiting just 3 in person. Bought the first one. Perfect filtering system!', client_name: 'Peter & Linda S.', client_location: 'Malmö, Suecia', rating: 5 },
    ],
    services: [
      { title: 'Venta de Propiedades', description: 'Catálogo completo de viviendas en venta en Tenerife Sur.', icon: 'building' },
      { title: 'Alquiler Vacacional', description: 'Apartamentos y villas para estancias cortas con todo incluido.', icon: 'briefcase' },
      { title: 'Alquiler Larga Temporada', description: 'Pisos y casas para vivir todo el año en el sur de Tenerife.', icon: 'users' },
      { title: 'Visitas Virtuales', description: 'Tours 360° de todas las propiedades para verlas desde cualquier lugar del mundo.', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Premium. 85 propiedades activas en la zona más exclusiva del sur.', image_url: ZONE_IMAGES[0], property_count: 85 },
      { name: 'Los Cristianos', description: 'Turístico. 52 propiedades activas con alta demanda todo el año.', image_url: ZONE_IMAGES[1], property_count: 52 },
      { name: 'Las Américas', description: 'Inversión. 38 propiedades activas con máxima rentabilidad vacacional.', image_url: ZONE_IMAGES[2], property_count: 38 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  'editorial-fullservice': {
    hero: { headline: 'Vive, Invierte, Disfruta', subtitle: 'Tres divisiones. Una misión: encontrarte el espacio perfecto en Tenerife.', cta_text: 'Explorar Opciones' },
    bio: 'La agencia más completa del sur de Tenerife. Tres divisiones especializadas: venta residencial, alquiler vacacional y alquiler de larga temporada. Sea cual sea tu necesidad inmobiliaria, tenemos una solución.',
    quote: 'No importa cómo quieras vivir Tenerife. Tenemos la llave.',
    stats: { propiedades_activas: 92, ventas_realizadas: 480, anos_experiencia: 16, divisiones: 3 },
    properties: [
      { title: 'Villa Moderna con Piscina Infinity', description: 'Villa premium de 5 dormitorios con piscina infinity y jardín de 400m². La joya de Costa Adeje.', property_type: 'villa', operation_type: 'sale', price: 1950000, bedrooms: 5, bathrooms: 4, size_m2: 420, location: 'Costa Adeje', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['piscina infinity', 'jardín 400m²', '5 dormitorios'] },
      { title: 'Ático Panorámico con Solárium', description: 'Ático vacacional con solárium y vistas 360°. Perfecto para estancias de lujo.', property_type: 'penthouse', operation_type: 'rent_vacation', price: 200, bedrooms: 2, bathrooms: 1, size_m2: 90, location: 'Costa Adeje', badge: null, images: PROPERTY_IMAGES.penthouse, features: ['solárium', 'vistas 360°', 'amueblado'] },
      { title: 'Piso 3 Dorm. Adeje Centro', description: 'Piso amplio de 3 dormitorios en el centro de Adeje. Cerca de colegios y transporte. Larga temporada.', property_type: 'apartment', operation_type: 'rent_long', price: 950, bedrooms: 3, bathrooms: 2, size_m2: 110, location: 'Adeje Centro', badge: null, images: PROPERTY_IMAGES.apartment, features: ['centro Adeje', 'colegios cerca', '3 dormitorios'] },
    ],
    testimonials: [
      { quote: 'Wir haben über sie gekauft UND vermieten jetzt über sie. Alles aus einer Hand. Perfekt und unkompliziert!', client_name: 'Patricia & Thomas K.', client_location: 'Colonia, Alemania', rating: 5 },
      { quote: "Bought a flat for investment, they manage the holiday rental. 82% occupancy in year one. Couldn't ask for more.", client_name: 'David & Sophie T.', client_location: 'Brighton, UK', rating: 5 },
      { quote: 'Alquilé mi piso de larga temporada con ellos. Buenos inquilinos, cero problemas, todo gestionado. Tranquilidad total.', client_name: 'Ana Belén M.', client_location: 'Madrid, España', rating: 5 },
    ],
    services: [
      { title: 'Compraventa Residencial', description: 'Tu hogar permanente o segunda residencia en Tenerife Sur.', icon: 'building' },
      { title: 'Alquiler Vacacional', description: 'Gestión integral: reservas, limpieza, mantenimiento y guest experience.', icon: 'briefcase' },
      { title: 'Alquiler Larga Temporada', description: 'Búsqueda de inquilinos, contratos, cobros y gestión de incidencias.', icon: 'users' },
      { title: 'Licencia Turística', description: 'Trámites completos para obtener tu licencia VV (Vivienda Vacacional).', icon: 'map' },
    ],
    zones: [
      { name: 'Costa Adeje', description: 'Nuestra zona principal. Venta, vacacional y larga temporada.', image_url: ZONE_IMAGES[0], property_count: 92 },
      { name: 'Los Cristianos', description: 'Alta demanda de alquiler todo el año. Excelente rentabilidad.', image_url: ZONE_IMAGES[1], property_count: 65 },
      { name: 'Las Américas', description: 'Máxima rentabilidad vacacional en el sur de Tenerife.', image_url: ZONE_IMAGES[2], property_count: 48 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },

  monolith: {
    hero: { headline: 'ESCAPA DE LO ORDINARIO.', subtitle: 'Propiedades de arquitectura contemporánea en Tenerife Sur.', cta_text: 'VER COLECCIÓN' },
    bio: 'Propiedades de arquitectura contemporánea en Tenerife Sur. No son simples inmuebles — son declaraciones de diseño. Selección extrema: solo aceptamos propiedades que cumplan nuestros estándares arquitectónicos.',
    quote: 'El minimalismo no es ausencia — es la honestidad del material y la pureza de la forma.',
    stats: { propiedades_curadas: 15, ventas_realizadas: 75, anos_experiencia: 12, arquitectos_red: 8 },
    properties: [
      { title: 'VILLA ALISIOS', description: 'Villa de diseño brutalista con hormigón visto, acero corten y cristal floor-to-ceiling. Piscina desbordante.', property_type: 'villa', operation_type: 'sale', price: 1850000, bedrooms: 4, bathrooms: 3, size_m2: 380, location: 'Costa Adeje', badge: 'exclusive', images: PROPERTY_IMAGES.villa, features: ['hormigón visto', 'acero corten', 'cristal floor-to-ceiling'] },
      { title: 'ABAMA ROYAL', description: 'Residencia de firma en Abama. 5 dormitorios, diseño minimalista, materiales nobles. Obra de autor.', property_type: 'villa', operation_type: 'sale', price: 2950000, bedrooms: 5, bathrooms: 4, size_m2: 450, location: 'Guía de Isora', badge: null, images: PROPERTY_IMAGES.villa, features: ['diseño minimalista', 'materiales nobles', 'Abama Resort'] },
      { title: 'CASA BASALTO', description: 'Casa vacacional de autor en basalto y madera. Terraza con vistas al Atlántico. Experiencia arquitectónica.', property_type: 'villa', operation_type: 'rent_vacation', price: 280, bedrooms: 3, bathrooms: 2, size_m2: 200, location: 'La Caleta', badge: null, images: PROPERTY_IMAGES.villa, features: ['basalto y madera', 'vistas Atlántico', 'diseño de autor'] },
    ],
    testimonials: [
      { quote: 'MONOLITH versteht Architektur. Als Architekt sage ich: ihr Auge für Design ist außergewöhnlich. Höchste Standards.', client_name: 'Jens R., Architekt', client_location: 'Berlín, Alemania', rating: 5 },
      { quote: 'They showed us just three properties. Each one was a masterpiece. We bought the first one immediately.', client_name: 'Victoria & James A.', client_location: 'London, UK', rating: 5 },
      { quote: "Collaboriamo con MONOLITH per i nostri clienti che cercano architettura contemporanea. Standard altissimi.", client_name: 'Studio Forma', client_location: 'Milán, Italia', rating: 5 },
    ],
    services: [
      { title: 'Curaduría Arquitectónica', description: 'Solo propiedades que cumplen nuestros estándares de diseño contemporáneo.', icon: 'building' },
      { title: 'Comisión de Proyecto', description: 'Diseño a medida con nuestra red de arquitectos para tu parcela.', icon: 'briefcase' },
      { title: 'Art Direction', description: 'Interiorismo y dirección artística para propiedades premium.', icon: 'users' },
      { title: 'Inversión en Diseño', description: 'Propiedades de autor con alta revalorización. Arquitectura como activo.', icon: 'map' },
    ],
    zones: [
      { name: 'La Caleta', description: 'Villas de autor. Arquitectura orgánica junto al mar.', image_url: ZONE_IMAGES[0], property_count: 6 },
      { name: 'Abama', description: 'Resort exclusivo. Diseño de firma internacional.', image_url: ZONE_IMAGES[1], property_count: 4 },
      { name: 'Golf del Sur', description: 'Líneas limpias. Minimalismo con vistas al campo.', image_url: ZONE_IMAGES[2], property_count: 5 },
    ],
    team: [],
    activeSections: ['nav', 'hero', 'footer', 'properties_sale', 'about', 'stats', 'testimonials', 'services', 'zones', 'contact_form'],
  },
}

// ─────────────────────────────────────────────
// REGISTRATION HANDLER
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { business_name, email, password, phone, business_type = 'individual', template = 'luxury', zone } = await request.json()

    if (!business_name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { business_name, phone },
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id
    const templateKey = (template as string) in TEMPLATE_CONTENT ? template as string : 'luxury'
    const content = TEMPLATE_CONTENT[templateKey]

    // 2. Generate slug
    const slug = business_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 3. Create agent profile — FULL DATA from day one
    const profileData: Record<string, any> = {
      id: userId,
      email,
      business_name,
      phone: phone || null,
      slug: `${slug}-${userId.slice(0, 6)}`,
      plan: 'starter',
      template: templateKey,
      business_type,
      bio: content.bio,
      quote: content.quote,
      stats: content.stats,
      city: zone || 'Tenerife',
      languages: ['es', 'en'],
    }
    // primary_zone column doesn't exist in agent_profiles — zone is stored in city

    const { error: profileError } = await supabaseAdmin
      .from('agent_profiles')
      .insert(profileData)

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.error('Profile creation error:', profileError?.message)
      return NextResponse.json({ error: 'Error creando perfil de agente' }, { status: 500 })
    }

    // 4. Hero config — with background image
    const heroData = {
      agent_id: userId,
      headline: content.hero.headline,
      subtitle: content.hero.subtitle,
      cta_text: content.hero.cta_text,
      cta_link: '#propiedades',
      background_image_url: HERO_IMAGES[templateKey],
      overlay_opacity: 0.55,
    }
    // Insert hero config directly (no trigger dependency)
    await supabaseAdmin.from('hero_config').insert(heroData)

    // 5. Create all sections and activate per template (no trigger dependency)
    const ALL_SECTIONS = ['nav', 'hero', 'footer', 'properties_sale', 'properties_rent_long',
      'properties_rent_vacation', 'search', 'featured', 'about', 'team', 'stats', 'testimonials',
      'services', 'process', 'valuation', 'zones', 'offices', 'map', 'blog', 'gallery', 'press',
      'contact_form', 'whatsapp', 'booking', 'expense_mgmt', 'analytics', 'crm']
    const sectionInserts = ALL_SECTIONS.map((key, idx) => ({
      agent_id: userId,
      section_key: key,
      is_active: content.activeSections.includes(key),
      display_order: idx,
    }))
    const { error: sectionsError } = await supabaseAdmin.from('agent_sections').insert(sectionInserts)
    if (sectionsError) console.error('Sections insert error:', sectionsError?.message)

    // 6. Insert demo properties
    const propertyInserts = content.properties.map((p, i) => ({
      agent_id: userId,
      title: p.title,
      slug: p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + userId.slice(0, 4) + i,
      description: p.description,
      property_type: p.property_type,
      operation_type: p.operation_type,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      size_m2: p.size_m2,
      location: p.location,
      badge: p.badge,
      images: p.images,
      features: p.features,
      is_active: true,
      is_featured: i === 0,
    }))
    const { error: propError } = await supabaseAdmin.from('properties').insert(propertyInserts)
    if (propError) console.error('Properties insert error:', propError?.message)

    // 7. Insert testimonials
    const testimonialInserts = content.testimonials.map(t => ({
      agent_id: userId,
      quote: t.quote,
      client_name: t.client_name,
      client_location: t.client_location,
      rating: t.rating,
    }))
    await supabaseAdmin.from('testimonials').insert(testimonialInserts)

    // 8. Insert services
    const serviceInserts = content.services.map(s => ({
      agent_id: userId,
      title: s.title,
      description: s.description,
      icon: s.icon,
    }))
    await supabaseAdmin.from('services').insert(serviceInserts)

    // 9. Insert zones
    const zoneInserts = content.zones.map(z => ({
      agent_id: userId,
      name: z.name,
      description: z.description,
      image_url: z.image_url,
      property_count: z.property_count,
    }))
    await supabaseAdmin.from('zones').insert(zoneInserts)

    // 10. Insert team members (if template includes them)
    if (content.team.length > 0) {
      const teamInserts = content.team.map(t => ({
        agent_id: userId,
        name: t.name,
        role: t.role,
        photo_url: t.photo_url,
        bio: t.bio,
        languages: t.languages,
      }))
      await supabaseAdmin.from('team_members').insert(teamInserts)
    }

    return NextResponse.json({ success: true, userId })
  } catch (err) {
    console.error('Register error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
