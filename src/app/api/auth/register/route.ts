import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Template-specific placeholder content for pre-populating agent websites
const TEMPLATE_HERO_CONTENT: Record<string, { headline: string; subtitle: string; cta_text: string }> = {
  luxury: {
    headline: 'Propiedades Exclusivas en Tenerife',
    subtitle: 'Descubra nuestra selección de villas y propiedades premium en las mejores ubicaciones de la isla.',
    cta_text: 'Ver Propiedades',
  },
  mediterranean: {
    headline: 'Tu Hogar en Tenerife Te Espera',
    subtitle: 'Más de 15 años ayudando a familias a encontrar la propiedad perfecta en la isla.',
    cta_text: 'Explorar Propiedades',
  },
  corporate: {
    headline: 'Soluciones Inmobiliarias Profesionales',
    subtitle: 'Un equipo de expertos a su disposición para encontrar la mejor inversión en Tenerife.',
    cta_text: 'Contactar',
  },
  boutique: {
    headline: 'Inmobiliaria con Alma',
    subtitle: 'Seleccionamos cada propiedad con el mismo cuidado con el que elegiríamos la nuestra.',
    cta_text: 'Descubrir',
  },
  network: {
    headline: 'La Mayor Red Inmobiliaria de Tenerife',
    subtitle: 'Múltiples oficinas, cientos de propiedades, un solo objetivo: encontrar tu hogar ideal.',
    cta_text: 'Buscar Propiedades',
  },
}

const TEMPLATE_BIO: Record<string, string> = {
  luxury: 'Especializado en propiedades de lujo y exclusivas en Tenerife. Ofrecemos un servicio personalizado y discreto para clientes que buscan lo mejor de la isla. Nuestra experiencia en el mercado premium nos permite encontrar oportunidades únicas.',
  mediterranean: 'Con años de experiencia en el mercado inmobiliario de Tenerife, nos dedicamos a ayudar a familias y particulares a encontrar su hogar ideal. Conocemos cada rincón de la isla y trabajamos con cercanía y confianza.',
  corporate: 'Somos una agencia inmobiliaria profesional con un equipo de expertos dedicados a ofrecer las mejores soluciones inmobiliarias en Tenerife. Nuestro enfoque profesional y orientado a resultados garantiza la mejor experiencia.',
  boutique: 'Una agencia boutique donde cada cliente es único. No buscamos volumen, buscamos la propiedad perfecta para cada persona. Trabajamos con un número limitado de propiedades para garantizar la máxima calidad.',
  network: 'Con presencia en múltiples ubicaciones de Tenerife, ofrecemos la cobertura más amplia del mercado inmobiliario de la isla. Nuestro equipo de agentes especializados cubre todas las zonas y tipos de propiedad.',
}

// Default services every agent gets
function getDefaultServices(businessName: string) {
  return [
    { title: 'Compraventa de Propiedades', description: 'Asesoramiento completo en la compra y venta de inmuebles en Tenerife. Desde la búsqueda hasta la firma ante notario.', icon: 'building' },
    { title: 'Valoración Gratuita', description: 'Obtenga una valoración profesional de su propiedad sin compromiso, basada en datos reales del mercado actual.', icon: 'briefcase' },
    { title: 'Asesoría Legal y Fiscal', description: 'Conexión con los mejores profesionales legales y fiscales para garantizar una transacción segura y transparente.', icon: 'users' },
    { title: 'Gestión de Alquileres', description: 'Servicio integral de gestión de alquileres vacacionales y de larga temporada, maximizando la rentabilidad de su inversión.', icon: 'map' },
  ]
}

// Default stats based on template type
const TEMPLATE_STATS: Record<string, Record<string, number>> = {
  luxury: { propiedades: 0, clientes_satisfechos: 0, anos_experiencia: 0 },
  mediterranean: { propiedades: 0, ventas_realizadas: 0, anos_experiencia: 0 },
  corporate: { propiedades: 0, equipo: 1, oficinas: 1 },
  boutique: { propiedades: 0, clientes_satisfechos: 0 },
  network: { propiedades: 0, agentes: 1, oficinas: 1, anos_experiencia: 0 },
}

// Sections that should be active by default (core visible sections)
const DEFAULT_ACTIVE_SECTIONS = [
  'nav', 'hero', 'footer', 'properties_sale', 'about',
  'services', 'contact_form', 'stats',
]

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { business_name, email, password, phone, business_type = 'individual', template = 'luxury', zone } = await request.json()

    if (!business_name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
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

    // 2. Create agent profile with pre-populated bio and stats
    const slug = business_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const templateKey = template as keyof typeof TEMPLATE_BIO
    const profileData: Record<string, any> = {
      id: userId,
      email,
      business_name,
      phone: phone || null,
      slug: `${slug}-${userId.slice(0, 6)}`,
      plan: 'starter',
      template,
      business_type,
      bio: TEMPLATE_BIO[templateKey] || TEMPLATE_BIO.luxury,
      stats: TEMPLATE_STATS[templateKey] || TEMPLATE_STATS.luxury,
      city: zone || 'Tenerife',
    }

    if (zone) {
      profileData.primary_zone = zone
    }

    const { error: profileError } = await supabaseAdmin
      .from('agent_profiles')
      .insert(profileData)

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ error: 'Error creando perfil de agente' }, { status: 500 })
    }

    // 3. Pre-populate hero_config with template-appropriate content
    // The trigger creates hero_config, but we need to UPDATE it with content
    const heroContent = TEMPLATE_HERO_CONTENT[templateKey] || TEMPLATE_HERO_CONTENT.luxury
    const { error: heroError } = await supabaseAdmin
      .from('hero_config')
      .update({
        headline: heroContent.headline,
        subtitle: heroContent.subtitle,
        cta_text: heroContent.cta_text,
        cta_link: '#propiedades',
        overlay_opacity: 0.6,
      })
      .eq('agent_id', userId)

    // If trigger didn't create hero_config, insert it
    if (heroError) {
      await supabaseAdmin
        .from('hero_config')
        .insert({
          agent_id: userId,
          headline: heroContent.headline,
          subtitle: heroContent.subtitle,
          cta_text: heroContent.cta_text,
          cta_link: '#propiedades',
          overlay_opacity: 0.6,
        })
    }

    // 4. Activate default sections
    for (const sectionKey of DEFAULT_ACTIVE_SECTIONS) {
      await supabaseAdmin
        .from('agent_sections')
        .update({ is_active: true })
        .eq('agent_id', userId)
        .eq('section_key', sectionKey)
    }

    // 5. Insert default services
    const defaultServices = getDefaultServices(business_name)
    const serviceInserts = defaultServices.map(s => ({
      agent_id: userId,
      ...s,
    }))
    await supabaseAdmin.from('services').insert(serviceInserts)

    // 6. Insert default zones based on template/business_type
    const defaultZones = [
      { agent_id: userId, name: zone || 'Costa Adeje', description: 'Una de las zonas más demandadas del sur de Tenerife, conocida por sus playas y resorts de lujo.', property_count: 0 },
      { agent_id: userId, name: 'Los Cristianos', description: 'Localidad turística con excelente clima, playas y servicios. Ideal para inversión y residencia.', property_count: 0 },
      { agent_id: userId, name: 'Playa de las Américas', description: 'Centro turístico por excelencia con gran actividad comercial y de ocio.', property_count: 0 },
    ]
    await supabaseAdmin.from('zones').insert(defaultZones)

    return NextResponse.json({ success: true, userId })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
