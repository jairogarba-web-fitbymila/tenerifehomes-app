import { TemplateData, TemplateAgent, TemplateProperty, TemplateHero, TemplateTestimonial, TemplateTeamMember, TemplateService, TemplateZone } from '@/components/templates/types';

// ══════════════════════════════════════════════════════════════
// UNSPLASH IMAGE LIBRARY — Categorized for reuse across demos
// ══════════════════════════════════════════════════════════════

const IMG = {
  // ── Luxury villas & architecture ──
  villa1: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  villa2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  villa3: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  villa4: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  villa5: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  villa6: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  villa7: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
  villa8: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=800',
  villa9: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',

  // ── Apartments & interiors ──
  apt1: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  apt2: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  apt3: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  apt4: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  apt5: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800',
  apt6: 'https://images.unsplash.com/photo-1560448075-bb0e3a478b6e?w=800',

  // ── Commercial & office ──
  office1: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  office2: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800',

  // ── Hero / landscape shots ──
  hero1: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
  hero2: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
  hero3: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
  hero4: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
  hero5: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600',
  hero6: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1600',
  hero7: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=1600',

  // ── People / agent portraits ──
  man1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  man2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  man3: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  man4: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  man5: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  woman1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  woman2: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  woman3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  woman4: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',

  // ── Zones / beaches / landscapes ──
  beach1: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
  beach2: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600',
  beach3: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600',
  coast1: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
};


// ══════════════════════════════════════════════════════════════
// 1. LUXURY — Victoria Laurent Luxury Properties
// ══════════════════════════════════════════════════════════════
const luxuryAgent: TemplateAgent = {
  full_name: 'Victoria Laurent',
  business_name: 'Victoria Laurent Luxury Properties',
  slug: 'victoria-laurent',
  template: 'luxury',
  bio: 'Especialista en propiedades de lujo en la costa sur de Tenerife. Con 12 años de experiencia y una red exclusiva de clientes internacionales, ofrezco un servicio discreto y personalizado para compradores exigentes que buscan lo mejor de la isla.',
  phone: '+34 622 456 789',
  whatsapp: '+34 622 456 789',
  email: 'victoria@luxuryproperties.com',
  languages: ['Español', 'Francés', 'Inglés', 'Italiano'],
  experience_years: 12,
  photo: IMG.woman1,
  bio_photo_url: IMG.woman1,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 180, years: 12, clients: 240 },
  quote: 'El lujo no se mide en metros cuadrados, sino en la exclusividad de cada detalle.',
};

const luxuryProperties: TemplateProperty[] = [
  { title: 'Villa Contemporánea con Vistas al Mar', price: 2850000, location: 'Abama, Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 420, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.apt5] },
  { title: 'Penthouse de Lujo en Primera Línea', price: 1950000, location: 'La Caleta, Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 280, operation_type: 'sale', images: [IMG.villa3, IMG.apt1, IMG.apt6] },
  { title: 'Finca Exclusiva con Piscina Infinita', price: 3200000, location: 'San Eugenio Alto', bedrooms: 6, bathrooms: 5, area_m2: 550, operation_type: 'sale', badge: 'new', images: [IMG.villa2, IMG.villa9, IMG.villa7] },
  { title: 'Apartamento Boutique en Resort Premium', price: 890000, location: 'Bahía del Duque', bedrooms: 3, bathrooms: 2, area_m2: 165, operation_type: 'sale', images: [IMG.villa4, IMG.apt2] },
  { title: 'Villa Panorámica Océano', price: 4500000, location: 'Playa Paraíso', bedrooms: 7, bathrooms: 6, area_m2: 680, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa5, IMG.villa6, IMG.villa1] },
  { title: 'Suite de Lujo con Terraza Privada', price: 1200000, location: 'Torviscas Alto', bedrooms: 3, bathrooms: 3, area_m2: 195, operation_type: 'sale', images: [IMG.villa6, IMG.apt4] },
];

const luxuryHero: TemplateHero = {
  title: 'Propiedades exclusivas en Tenerife',
  headline: 'Propiedades exclusivas en Tenerife',
  subtitle: '12 años conectando compradores exigentes con las mejores residencias de la isla',
  image: IMG.hero1,
  background_image_url: IMG.hero1,
  cta_text: 'Ver Colección',
};

const luxuryTestimonials: TemplateTestimonial[] = [
  { author: 'Lord & Lady Pemberton', text: 'Victoria found us a magnificent clifftop villa that exceeded every expectation. Her understanding of the luxury market is truly exceptional.', rating: 5, client_name: 'Lord & Lady Pemberton', client_location: 'London, UK' },
  { author: 'Familie von Hartenberg', text: 'Diskret, professionell und mit einem perfekten Gespür für Qualität. Unsere Villa ist ein Traum.', rating: 5, client_name: 'Familie von Hartenberg', client_location: 'Munich, Alemania' },
  { author: 'Jean-Marc & Isabelle Moreau', text: "Un service d'une élégance rare. Victoria a su comprendre exactement ce que nous cherchions.", rating: 5, client_name: 'Jean-Marc & Isabelle Moreau', client_location: 'Paris, Francia' },
];

const luxuryServices: TemplateService[] = [
  { title: 'Búsqueda Exclusiva', description: 'Acceso a propiedades off-market y preventa no disponibles al público general' },
  { title: 'Valoración Premium', description: 'Tasación profesional con comparables de mercado de alto standing' },
  { title: 'Concierge Legal', description: 'Abogados especializados en transacciones internacionales de alto valor' },
  { title: 'Gestión Patrimonial', description: 'Asesoramiento fiscal y estructuración de inversión inmobiliaria' },
];

const luxuryZones: TemplateZone[] = [
  { name: 'Abama Resort', description: 'El resort más exclusivo de Tenerife. Golf, Ritz-Carlton, privacidad absoluta.', image: IMG.beach1, image_url: IMG.beach1, property_count: 12 },
  { name: 'Costa Adeje Premium', description: 'Primera línea. Bahía del Duque, El Duque, La Caleta.', image: IMG.beach2, image_url: IMG.beach2, property_count: 28 },
  { name: 'Guía de Isora', description: 'Fincas con hectáreas, vistas al Atlántico y total tranquilidad.', image: IMG.beach3, image_url: IMG.beach3, property_count: 8 },
];


// ══════════════════════════════════════════════════════════════
// 2. MEDITERRANEAN — Antonio Reyes Inmobiliaria
// ══════════════════════════════════════════════════════════════
const mediterraneanAgent: TemplateAgent = {
  full_name: 'Antonio Reyes',
  business_name: 'Antonio Reyes Inmobiliaria',
  slug: 'antonio-reyes',
  template: 'mediterranean',
  bio: '15 años ayudando a familias a encontrar su hogar perfecto en Tenerife. Más de 320 ventas realizadas. Mi compromiso es acompañarte en cada paso del proceso, desde la primera visita hasta la firma en notaría.',
  phone: '+34 666 123 456',
  whatsapp: '+34 666 123 456',
  email: 'antonio@reyesinmo.com',
  languages: ['Español', 'Inglés', 'Alemán'],
  experience_years: 15,
  photo: IMG.man1,
  bio_photo_url: IMG.man1,
  location: 'Los Cristianos, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 320, years: 15, clients: 500 },
  quote: 'Vender casas no es mi trabajo. Ayudar a familias a encontrar su hogar, sí.',
};

const mediterraneanProperties: TemplateProperty[] = [
  { title: 'Apartamento Luminoso con Terraza', price: 285000, location: 'Los Cristianos', bedrooms: 2, bathrooms: 1, area_m2: 85, operation_type: 'sale', images: [IMG.apt1, IMG.apt5, IMG.apt6] },
  { title: 'Chalet Familiar con Jardín', price: 425000, location: 'San Isidro', bedrooms: 4, bathrooms: 2, area_m2: 180, operation_type: 'sale', badge: 'new', images: [IMG.villa2, IMG.villa9] },
  { title: 'Piso Reformado Centro', price: 195000, location: 'Arona', bedrooms: 3, bathrooms: 1, area_m2: 95, operation_type: 'sale', images: [IMG.apt2, IMG.apt4] },
  { title: 'Dúplex con Vistas al Teide', price: 340000, location: 'Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, operation_type: 'sale', images: [IMG.villa3, IMG.apt1] },
  { title: 'Estudio Vacacional Primera Línea', price: 85, location: 'Playa de las Américas', bedrooms: 1, bathrooms: 1, area_m2: 45, operation_type: 'rent_vacation', images: [IMG.apt3, IMG.apt5] },
  { title: 'Apartamento Larga Temporada', price: 850, location: 'Los Cristianos Centro', bedrooms: 2, bathrooms: 1, area_m2: 70, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt2] },
];

const mediterraneanHero: TemplateHero = {
  title: 'Tu hogar en Tenerife te espera',
  headline: 'Tu hogar en Tenerife te espera',
  subtitle: '15 años de experiencia. 320+ familias felices. Tu próximo hogar está aquí.',
  image: IMG.hero2,
  background_image_url: IMG.hero2,
  cta_text: 'Ver Propiedades',
};

const mediterraneanTestimonials: TemplateTestimonial[] = [
  { author: 'John & Mary Williams', text: 'Antonio nos ayudó a encontrar nuestro apartamento soñado en solo 3 semanas. ¡Increíble servicio!', rating: 5, client_name: 'John & Mary Williams', client_location: 'Birmingham, UK' },
  { author: 'Familie Schmidt', text: 'Wir sind sehr zufrieden. Der gesamte Kaufprozess war transparent und professionell. Sehr empfehlenswert!', rating: 5, client_name: 'Familie Schmidt', client_location: 'Berlín, Alemania' },
  { author: 'Carmen y Luis Pérez', text: 'Vendimos nuestro piso en 2 meses al precio que queríamos. Antonio es un gran profesional y mejor persona.', rating: 5, client_name: 'Carmen y Luis Pérez', client_location: 'Madrid, España' },
];

const mediterraneanServices: TemplateService[] = [
  { title: 'Compraventa', description: 'Asesoramiento integral en compra y venta de propiedades' },
  { title: 'Valoración Gratuita', description: 'Tasación profesional de tu propiedad sin compromiso' },
  { title: 'Gestión Integral', description: 'Acompañamiento desde la búsqueda hasta la firma en notaría' },
  { title: 'Asesoría Legal', description: 'Red de abogados especializados en derecho inmobiliario' },
];

const mediterraneanZones: TemplateZone[] = [
  { name: 'Los Cristianos', description: 'Centro turístico consolidado, ideal para familias', image: IMG.beach2, image_url: IMG.beach2, property_count: 45 },
  { name: 'Arona & San Isidro', description: 'Residencial tranquilo con buenos precios', image: IMG.beach1, image_url: IMG.beach1, property_count: 32 },
  { name: 'Costa Adeje', description: 'Zona premium del sur de Tenerife', image: IMG.beach3, image_url: IMG.beach3, property_count: 28 },
];


// ══════════════════════════════════════════════════════════════
// 3. CORPORATE — Tenerife Prime Real Estate
// ══════════════════════════════════════════════════════════════
const corporateAgent: TemplateAgent = {
  full_name: 'Carlos Méndez',
  business_name: 'Tenerife Prime Real Estate',
  slug: 'tenerife-prime',
  template: 'corporate',
  bio: 'Tenerife Prime es una agencia consolidada con 8 agentes especializados y más de 20 años en el mercado. Más de 500 millones de euros en volumen de ventas gestionado.',
  phone: '+34 922 789 456',
  whatsapp: '+34 666 789 456',
  email: 'info@tenerifeprime.com',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés', 'Ruso'],
  experience_years: 20,
  photo: IMG.man2,
  bio_photo_url: IMG.man2,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 1200, years: 20, clients: 3000 },
  quote: 'No somos agentes, somos tu equipo inmobiliario completo.',
};

const corporateProperties: TemplateProperty[] = [
  { title: 'Oficina Premium Zona Comercial', price: 385000, location: 'Santa Cruz de Tenerife', bedrooms: 0, bathrooms: 2, area_m2: 120, operation_type: 'sale', images: [IMG.office1, IMG.office2] },
  { title: 'Apartamento Vista Mar 3 Dorm.', price: 320000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 110, operation_type: 'sale', images: [IMG.villa6, IMG.apt1, IMG.apt5] },
  { title: 'Villa de Lujo con Piscina', price: 1250000, location: 'Torviscas Alto', bedrooms: 5, bathrooms: 4, area_m2: 350, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.villa9] },
  { title: 'Estudio Centro Histórico', price: 155000, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 48, operation_type: 'sale', images: [IMG.apt3, IMG.apt4] },
  { title: 'Chalet Pareado Nuevo', price: 445000, location: 'El Médano', bedrooms: 4, bathrooms: 3, area_m2: 200, operation_type: 'sale', badge: 'new', images: [IMG.villa5, IMG.villa2] },
  { title: 'Local Comercial Avenida Principal', price: 2200, location: 'Las Américas', bedrooms: 0, bathrooms: 1, area_m2: 95, operation_type: 'rent_long', images: [IMG.office2, IMG.office1] },
];

const corporateHero: TemplateHero = {
  title: 'Tu agencia inmobiliaria de confianza',
  headline: 'Tu agencia inmobiliaria de confianza',
  subtitle: '20 años de experiencia. 8 agentes especializados. Más de 500M EUR gestionados.',
  image: IMG.hero4,
  background_image_url: IMG.hero4,
  cta_text: 'Conoce al Equipo',
};

const corporateTeam: TemplateTeamMember[] = [
  { name: 'Carlos Méndez', role: 'Director General', photo: IMG.man2, photo_url: IMG.man2, languages: ['Español', 'Inglés'] },
  { name: 'Elena Ruiz', role: 'Directora Comercial', photo: IMG.woman1, photo_url: IMG.woman1, languages: ['Español', 'Francés'] },
  { name: 'Thomas Müller', role: 'Mercado Alemán', photo: IMG.man3, photo_url: IMG.man3, languages: ['Alemán', 'Inglés', 'Español'] },
  { name: 'Sarah Williams', role: 'Mercado Británico', photo: IMG.woman3, photo_url: IMG.woman3, languages: ['Inglés', 'Español'] },
  { name: 'Marco Rossi', role: 'Propiedades de Lujo', photo: IMG.man4, photo_url: IMG.man4, languages: ['Italiano', 'Español', 'Inglés'] },
  { name: 'Ana García', role: 'Alquileres & Gestión', photo: IMG.woman4, photo_url: IMG.woman4, languages: ['Español', 'Inglés', 'Alemán'] },
];

const corporateTestimonials: TemplateTestimonial[] = [
  { author: 'Inversiones Atlántico S.L.', text: 'Tenerife Prime gestionó la compra de nuestro portfolio de 8 apartamentos. Profesionalidad total en cada operación.', rating: 5, client_name: 'Inversiones Atlántico S.L.', client_location: 'Madrid, España' },
  { author: 'The Henderson Family', text: 'From our first inquiry to getting the keys, the team was outstanding. Thomas made the entire process seamless for us.', rating: 5, client_name: 'The Henderson Family', client_location: 'Manchester, UK' },
  { author: 'Olga & Sergei Petrov', text: 'Мы нашли идеальную виллу. Команда помогла со всеми документами. Рекомендуем!', rating: 5, client_name: 'Olga & Sergei Petrov', client_location: 'Moscú, Rusia' },
];

const corporateServices: TemplateService[] = [
  { title: 'Compraventa Residencial', description: 'Equipo especializado en vivienda para familias e inversores' },
  { title: 'Inmuebles Comerciales', description: 'Oficinas, locales y naves industriales en toda la isla' },
  { title: 'Inversión Extranjera', description: 'Asesoramiento completo para compradores internacionales: NIE, fiscalidad, Golden Visa' },
  { title: 'Gestión de Alquileres', description: 'Administración integral de propiedades: inquilinos, mantenimiento, cobros' },
  { title: 'Valoración de Mercado', description: 'Informes profesionales con datos de transacciones reales' },
  { title: 'Asesoría Legal y Fiscal', description: 'Abogados y fiscalistas in-house especializados en inmobiliario' },
];

const corporateZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'Zona premium del sur. Alta demanda internacional.', image: IMG.beach1, image_url: IMG.beach1, property_count: 85 },
  { name: 'Santa Cruz', description: 'Capital de la isla. Comercial y residencial.', image: IMG.beach2, image_url: IMG.beach2, property_count: 62 },
  { name: 'El Médano', description: 'Lifestyle deportivo. Crecimiento constante.', image: IMG.beach3, image_url: IMG.beach3, property_count: 34 },
  { name: 'La Laguna', description: 'Patrimonio UNESCO. Universidad y cultura.', image: IMG.coast1, image_url: IMG.coast1, property_count: 41 },
];


// ══════════════════════════════════════════════════════════════
// 4. BOUTIQUE — Maison Tenerife (Sophie & Pierre)
// ══════════════════════════════════════════════════════════════
const boutiqueAgent: TemplateAgent = {
  full_name: 'Sophie & Pierre Delacroix',
  business_name: 'Maison Tenerife',
  slug: 'maison-tenerife',
  template: 'boutique',
  bio: 'Somos pequeños por elección. Seleccionamos un máximo de 25 propiedades para ofrecer una atención verdaderamente personalizada. Cada propiedad que aceptamos ha pasado nuestra curaduría personal.',
  phone: '+34 611 234 567',
  whatsapp: '+34 611 234 567',
  email: 'contact@maisontenerife.com',
  languages: ['Francés', 'Español', 'Inglés'],
  experience_years: 8,
  photo: IMG.woman2,
  bio_photo_url: IMG.woman2,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 95, years: 8, clients: 120 },
  quote: 'Menos propiedades, más atención. Calidad sobre cantidad, siempre.',
};

const boutiqueProperties: TemplateProperty[] = [
  { title: 'Villa Minimalista con Infinity Pool', price: 1850000, location: 'La Caleta', bedrooms: 4, bathrooms: 3, area_m2: 300, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa3, IMG.villa8, IMG.apt5] },
  { title: 'Ático Exclusivo Frente al Mar', price: 920000, location: 'El Duque', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', images: [IMG.villa6, IMG.apt1] },
  { title: 'Casa de Autor con Bodega', price: 1450000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 380, operation_type: 'sale', images: [IMG.villa2, IMG.villa9, IMG.apt6] },
  { title: 'Suite Boutique con Servicio', price: 95, location: 'Bahía del Duque', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: [IMG.villa4, IMG.apt2] },
  { title: 'Loft de Diseño Contemporáneo', price: 680000, location: 'San Eugenio', bedrooms: 2, bathrooms: 2, area_m2: 130, operation_type: 'sale', images: [IMG.apt4, IMG.apt3] },
  { title: 'Residencia de Artista con Estudio', price: 1100000, location: 'Playa San Juan', bedrooms: 3, bathrooms: 2, area_m2: 250, operation_type: 'sale', images: [IMG.villa5, IMG.villa7] },
];

const boutiqueHero: TemplateHero = {
  title: 'Selección curada de propiedades únicas',
  headline: 'Selección curada de propiedades únicas',
  subtitle: 'Máximo 25 propiedades. Atención absoluta. Calidad sobre cantidad.',
  image: IMG.hero3,
  background_image_url: IMG.hero3,
  cta_text: 'Ver Selección',
};

const boutiqueTestimonials: TemplateTestimonial[] = [
  { author: 'Famille Beaumont', text: "Sophie et Pierre ont trouvé notre maison de rêve en 10 jours. Leur goût est impeccable.", rating: 5, client_name: 'Famille Beaumont', client_location: 'Burdeos, Francia' },
  { author: 'The Archer-Stewarts', text: 'A truly bespoke experience. They understood our aesthetic perfectly and only showed us properties worth seeing.', rating: 5, client_name: 'The Archer-Stewarts', client_location: 'Edinburgh, UK' },
  { author: 'Isabella Moretti', text: 'Non cercano di venderti qualsiasi cosa. Ti ascoltano, capiscono e ti trovano esattamente ciò che desideri.', rating: 5, client_name: 'Isabella Moretti', client_location: 'Milán, Italia' },
];

const boutiqueServices: TemplateService[] = [
  { title: 'Curaduría Personal', description: 'Seleccionamos solo propiedades que pasan nuestro filtro de calidad y diseño' },
  { title: 'Home Staging', description: 'Preparamos tu propiedad para cautivar desde la primera foto' },
  { title: 'Fotografía & Vídeo', description: 'Sesiones profesionales con dron y tour virtual 360°' },
  { title: 'Asesoría de Estilo', description: 'Orientación para personalizar tu nuevo hogar a tu gusto' },
];

const boutiqueZones: TemplateZone[] = [
  { name: 'La Caleta', description: 'Pueblo pesquero reconvertido en refugio exclusivo', image: IMG.beach1, image_url: IMG.beach1, property_count: 8 },
  { name: 'El Duque', description: 'Primera línea con la playa más elegante del sur', image: IMG.beach2, image_url: IMG.beach2, property_count: 12 },
  { name: 'Playa San Juan', description: 'Encanto auténtico lejos del turismo masivo', image: IMG.beach3, image_url: IMG.beach3, property_count: 5 },
];


// ══════════════════════════════════════════════════════════════
// 5. CLASSIC — Roberto Fernández, 27 años de experiencia
// ══════════════════════════════════════════════════════════════
const classicAgent: TemplateAgent = {
  full_name: 'Roberto Fernández',
  business_name: 'Roberto Fernández — Inmobiliaria desde 1999',
  slug: 'roberto-fernandez',
  template: 'classic',
  bio: '27 años en el sector inmobiliario de Tenerife. Más de 600 operaciones de compraventa realizadas. Premio al Mejor Agente del Año 2019 y 2022. Nadie conoce este mercado como yo.',
  phone: '+34 922 345 678',
  whatsapp: '+34 650 345 678',
  email: 'roberto@fernandezinmo.com',
  languages: ['Español', 'Inglés'],
  experience_years: 27,
  photo: IMG.man5,
  bio_photo_url: IMG.man5,
  location: 'La Laguna, Tenerife',
  city: 'Tenerife Norte',
  stats: { sales: 600, years: 27, clients: 800 },
  quote: 'La experiencia no se improvisa. 27 años cerrando las mejores operaciones de la isla.',
};

const classicProperties: TemplateProperty[] = [
  { title: 'Casa Canaria Restaurada con Patio', price: 380000, location: 'La Laguna Centro', bedrooms: 4, bathrooms: 2, area_m2: 220, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa2, IMG.villa9, IMG.apt6] },
  { title: 'Finca Rústica con Plataneras', price: 520000, location: 'Tacoronte', bedrooms: 5, bathrooms: 3, area_m2: 280, operation_type: 'sale', images: [IMG.villa5, IMG.villa7] },
  { title: 'Piso Señorial en Edificio Histórico', price: 265000, location: 'Santa Cruz Centro', bedrooms: 3, bathrooms: 2, area_m2: 130, operation_type: 'sale', images: [IMG.villa6, IMG.apt1] },
  { title: 'Adosado con Huerto y Bodega', price: 340000, location: 'El Sauzal', bedrooms: 3, bathrooms: 2, area_m2: 175, operation_type: 'sale', images: [IMG.villa3, IMG.apt2] },
  { title: 'Casa Tradicional con Vistas al Valle', price: 290000, location: 'La Orotava', bedrooms: 4, bathrooms: 2, area_m2: 200, operation_type: 'sale', images: [IMG.villa4, IMG.villa8] },
  { title: 'Almacén Convertido en Loft', price: 1100, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 85, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt3] },
];

const classicHero: TemplateHero = {
  title: '27 años de experiencia inmobiliaria',
  headline: '27 años de experiencia inmobiliaria',
  subtitle: 'Más de 600 operaciones exitosas. Conocimiento profundo del mercado de Tenerife.',
  image: IMG.hero3,
  background_image_url: IMG.hero3,
  cta_text: 'Consulta Sin Compromiso',
};

const classicTestimonials: TemplateTestimonial[] = [
  { author: 'Manuel & Teresa Rodríguez', text: 'Roberto nos vendió nuestra finca en Tacoronte por encima del precio que esperábamos. 27 años de experiencia se notan.', rating: 5, client_name: 'Manuel & Teresa Rodríguez', client_location: 'La Laguna, Tenerife' },
  { author: 'Margaret & David Clarke', text: 'We bought a traditional Canarian house through Roberto. His knowledge of the north of the island is unmatched.', rating: 5, client_name: 'Margaret & David Clarke', client_location: 'Bristol, UK' },
  { author: 'Francisco Herrera', text: 'Le confié la venta de mi local comercial en La Laguna. En 6 semanas tenía comprador. Impecable.', rating: 5, client_name: 'Francisco Herrera', client_location: 'Santa Cruz, Tenerife' },
];

const classicServices: TemplateService[] = [
  { title: 'Compraventa Residencial', description: 'Pisos, chalets, fincas y casas canarias en todo Tenerife Norte' },
  { title: 'Valoración de Mercado', description: '27 años de datos para establecer el precio justo' },
  { title: 'Gestión en Notaría', description: 'Acompañamiento completo hasta la firma de escrituras' },
  { title: 'Inversión en Norte', description: 'Asesoramiento para compradores que buscan rentabilidad en el norte' },
];

const classicZones: TemplateZone[] = [
  { name: 'La Laguna', description: 'Ciudad Patrimonio UNESCO. Centro histórico y universitario.', image: IMG.coast1, image_url: IMG.coast1, property_count: 38 },
  { name: 'La Orotava', description: 'Valle espectacular con casas señoriales canarias.', image: IMG.beach3, image_url: IMG.beach3, property_count: 22 },
  { name: 'Puerto de la Cruz', description: 'Encanto del norte. Turismo consolidado, gastronomía.', image: IMG.beach2, image_url: IMG.beach2, property_count: 30 },
];


// ══════════════════════════════════════════════════════════════
// 6. DATA-DRIVEN — DataHomes Tenerife
// ══════════════════════════════════════════════════════════════
const dataAgent: TemplateAgent = {
  full_name: 'Miguel Torres',
  business_name: 'DataHomes Tenerife',
  slug: 'datahomes',
  template: 'data',
  bio: 'No adivinamos precios, los calculamos. Más de 10.000 transacciones analizadas con IA. Usamos tecnología avanzada y análisis de mercado en tiempo real para tomar decisiones basadas en datos, no en intuición.',
  phone: '+34 611 987 654',
  whatsapp: '+34 611 987 654',
  email: 'info@datahomes.es',
  languages: ['Español', 'Inglés', 'Alemán'],
  experience_years: 5,
  photo: IMG.man4,
  bio_photo_url: IMG.man4,
  location: 'Santa Cruz, Tenerife',
  city: 'Tenerife',
  stats: { sales: 180, years: 5, clients: 350 },
  quote: 'Los datos no mienten. Cada decisión que tomamos está respaldada por análisis real.',
};

const dataProperties: TemplateProperty[] = [
  { title: 'Penthouse Smart Home Automatizado', price: 485000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, operation_type: 'sale', badge: 'new', images: [IMG.villa6, IMG.apt5, IMG.apt1] },
  { title: 'Apartamento Inversión Alta Rentabilidad', price: 210000, location: 'Playa de las Américas', bedrooms: 2, bathrooms: 1, area_m2: 68, operation_type: 'sale', images: [IMG.apt1, IMG.apt4] },
  { title: 'Villa Eficiente Energética A+', price: 750000, location: 'Adeje', bedrooms: 4, bathrooms: 3, area_m2: 250, operation_type: 'sale', images: [IMG.villa1, IMG.villa8, IMG.villa9] },
  { title: 'Loft Tecnológico Centro', price: 195000, location: 'Santa Cruz', bedrooms: 1, bathrooms: 1, area_m2: 55, operation_type: 'sale', images: [IMG.apt4, IMG.apt3] },
  { title: 'Estudio ROI 8.2% Anual', price: 75, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 38, operation_type: 'rent_vacation', images: [IMG.apt3, IMG.apt2] },
  { title: 'Nave Industrial Reconvertida', price: 1600, location: 'Polígono Granadilla', bedrooms: 0, bathrooms: 2, area_m2: 320, operation_type: 'rent_long', images: [IMG.office2, IMG.office1] },
];

const dataHero: TemplateHero = {
  title: 'Decisiones inmobiliarias basadas en datos',
  headline: 'Decisiones inmobiliarias basadas en datos',
  subtitle: '10.000+ transacciones analizadas. IA y analytics de mercado en tiempo real.',
  image: IMG.hero5,
  background_image_url: IMG.hero5,
  cta_text: 'Ver Analytics',
};

const dataTeam: TemplateTeamMember[] = [
  { name: 'Miguel Torres', role: 'CEO & Data Scientist', photo: IMG.man4, photo_url: IMG.man4, languages: ['Español', 'Inglés'] },
  { name: 'Ana Vega', role: 'ML Engineer & Valoraciones', photo: IMG.woman2, photo_url: IMG.woman2, languages: ['Español', 'Inglés'] },
  { name: 'Pablo Ruiz', role: 'Market Analyst', photo: IMG.man2, photo_url: IMG.man2, languages: ['Español', 'Alemán'] },
];

const dataTestimonials: TemplateTestimonial[] = [
  { author: 'Nordic Investment Group', text: 'DataHomes analyzed 200 properties for us and identified the 5 with highest rental yield. All performing above projections.', rating: 5, client_name: 'Nordic Investment Group', client_location: 'Stockholm, Suecia' },
  { author: 'Laura & David Espinoza', text: 'Nos mostraron con datos por qué nuestro piso valía un 15% más de lo que pensábamos. Vendimos en 3 semanas.', rating: 5, client_name: 'Laura & David Espinoza', client_location: 'Las Palmas, España' },
  { author: 'TechVentures GMBH', text: 'Ihre Marktanalyse war die präziseste, die wir je gesehen haben. Datenbasierte Entscheidungen statt Bauchgefühl.', rating: 5, client_name: 'TechVentures GMBH', client_location: 'Frankfurt, Alemania' },
];

const dataServices: TemplateService[] = [
  { title: 'Valoración con IA', description: 'Algoritmo propio con +10.000 transacciones para precio exacto' },
  { title: 'Análisis de Inversión', description: 'ROI proyectado, rentabilidad neta, comparables de zona' },
  { title: 'Market Intelligence', description: 'Dashboard en tiempo real con tendencias del mercado canario' },
  { title: 'Due Diligence Técnica', description: 'Inspección completa: estructura, certificaciones, cargas' },
  { title: 'Automatización de Alquiler', description: 'Pricing dinámico, check-in automatizado, reporting mensual' },
  { title: 'Consultoría Fiscal', description: 'Optimización de impuestos para inversores nacionales e internacionales' },
];

const dataZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'ROI medio 6.8%. Máxima demanda turística.', image: IMG.beach1, image_url: IMG.beach1, property_count: 120 },
  { name: 'Los Cristianos', description: 'ROI medio 7.2%. Alta ocupación todo el año.', image: IMG.beach2, image_url: IMG.beach2, property_count: 85 },
  { name: 'Santa Cruz', description: 'Crecimiento +12% anual. Mercado residencial.', image: IMG.coast1, image_url: IMG.coast1, property_count: 95 },
  { name: 'El Médano', description: 'ROI medio 8.1%. Mercado emergente en auge.', image: IMG.beach3, image_url: IMG.beach3, property_count: 40 },
];


// ══════════════════════════════════════════════════════════════
// 7. EDITORIAL DARK — Julián Vega Real Estate
// ══════════════════════════════════════════════════════════════
const editorialDarkAgent: TemplateAgent = {
  full_name: 'Julián Vega',
  business_name: 'Julián Vega — Real Estate',
  slug: 'julian-vega-dark',
  template: 'editorial-dark',
  bio: 'Más de 15 años especializándome en propiedades exclusivas del sur de Tenerife. Mi enfoque combina conocimiento profundo del mercado local con estándares internacionales de servicio. Cada cliente recibe mi atención personal directa.',
  phone: '+34 922 123 456',
  whatsapp: '+34 650 123 456',
  email: 'julian@julianvega.com',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés'],
  experience_years: 15,
  photo: IMG.man1,
  bio_photo_url: IMG.man1,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 320, years: 15, clients: 450 },
  quote: 'Cada propiedad cuenta una historia. Mi trabajo es encontrar la que se ajusta a la tuya.',
};

const editorialDarkProperties: TemplateProperty[] = [
  { title: 'Villa Alisios', price: 1850000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 380, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.apt5] },
  { title: 'Abama Royal', price: 2950000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 450, operation_type: 'sale', images: [IMG.villa2, IMG.villa9, IMG.villa7] },
  { title: 'Penthouse Las Américas', price: 920000, location: 'Playa de las Américas', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', badge: 'new', images: [IMG.villa6, IMG.apt1] },
  { title: 'Suite El Duque', price: 150, location: 'El Duque, Costa Adeje', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: [IMG.villa4, IMG.apt2] },
  { title: 'Chalet San Eugenio', price: 680000, location: 'San Eugenio Alto', bedrooms: 3, bathrooms: 2, area_m2: 220, operation_type: 'sale', badge: 'reduced', images: [IMG.villa5, IMG.villa3] },
  { title: 'Apartamento Fañabé', price: 1200, location: 'Fañabé, Adeje', bedrooms: 2, bathrooms: 1, area_m2: 85, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt3] },
];

const editorialDarkHero: TemplateHero = {
  headline: 'Experiencia en Cada Detalle',
  title: 'Experiencia en Cada Detalle',
  subtitle: 'Propiedades exclusivas en el sur de Tenerife — conocimiento local, estándares internacionales.',
  image: IMG.hero2,
  background_image_url: IMG.hero2,
  cta_text: 'Ver Propiedades',
};

const editorialDarkTestimonials: TemplateTestimonial[] = [
  { author: 'James & Catherine Palmer', text: 'An impeccable service from start to finish. Julián found us our dream villa in Costa Adeje within two weeks.', rating: 5, quote: 'An impeccable service from start to finish. Julián found us our dream villa in Costa Adeje within two weeks.', client_name: 'James & Catherine Palmer', client_location: 'Surrey, UK' },
  { author: 'Familie Hoffmann', text: 'Erstklassiger Service. Die gesamte Abwicklung war professionell und transparent. Absolut empfehlenswert!', rating: 5, quote: 'Erstklassiger Service. Die gesamte Abwicklung war professionell und transparent. Absolut empfehlenswert!', client_name: 'Familie Hoffmann', client_location: 'Hamburg, Alemania' },
  { author: 'Jean-Pierre & Marie Leclerc', text: "Un service d'exception. Discrétion, professionnalisme et une connaissance parfaite du marché.", rating: 5, quote: "Un service d'exception. Discrétion, professionnalisme et une connaissance parfaite du marché de Tenerife.", client_name: 'Jean-Pierre & Marie Leclerc', client_location: 'Lyon, Francia' },
];

const editorialDarkServices: TemplateService[] = [
  { title: 'Compraventa Premium', description: 'Asesoramiento integral en compra y venta de propiedades exclusivas en Tenerife Sur' },
  { title: 'Valoración de Mercado', description: 'Análisis profesional con datos actualizados para establecer el precio óptimo' },
  { title: 'Asesoría Legal Internacional', description: 'Red de abogados especializados en compradores extranjeros, NIE e impuestos' },
  { title: 'Gestión de Alquiler Vacacional', description: 'Servicio completo: reservas, limpieza, mantenimiento y atención al huésped' },
  { title: 'Home Staging', description: 'Preparación profesional para maximizar el atractivo y valor de venta' },
  { title: 'Trámites y Documentación', description: 'Gestión completa: escrituras, registro, certificado energético' },
];

const editorialDarkZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'La zona más exclusiva del sur de Tenerife', image: IMG.beach1, image_url: IMG.beach1, property_count: 45 },
  { name: 'Los Cristianos', description: 'Centro turístico consolidado con excelente infraestructura', image: IMG.beach2, image_url: IMG.beach2, property_count: 32 },
  { name: 'Guía de Isora', description: 'Naturaleza y tranquilidad. Abama Resort y fincas exclusivas.', image: IMG.beach3, image_url: IMG.beach3, property_count: 18 },
  { name: 'El Médano', description: 'Ambiente deportivo y natural. La playa más larga de Tenerife.', image: IMG.coast1, image_url: IMG.coast1, property_count: 22 },
];


// ══════════════════════════════════════════════════════════════
// 8. EDITORIAL LIGHT — Ariadna Costa Inmobiliaria
// ══════════════════════════════════════════════════════════════
const editorialLightAgent: TemplateAgent = {
  full_name: 'Ariadna Costa',
  business_name: 'Ariadna Costa — Inmobiliaria Boutique',
  slug: 'ariadna-costa',
  template: 'editorial-light',
  bio: 'Arquitecta de formación reconvertida en asesora inmobiliaria. Evalúo cada propiedad con ojo profesional: orientación, materiales, distribución, potencial de reforma. No vendo metros cuadrados, vendo calidad de vida.',
  phone: '+34 628 456 123',
  whatsapp: '+34 628 456 123',
  email: 'ariadna@ariadnacosta.com',
  languages: ['Español', 'Inglés', 'Italiano'],
  experience_years: 9,
  photo: IMG.woman3,
  bio_photo_url: IMG.woman3,
  location: 'El Duque, Costa Adeje',
  city: 'Tenerife Sur',
  stats: { sales: 145, years: 9, clients: 200 },
  quote: 'Una buena casa no se vende. Se presenta, y el comprador se enamora solo.',
};

const editorialLightProperties: TemplateProperty[] = [
  { title: 'Villa de Diseño con Jardín Zen', price: 1650000, location: 'La Caleta', bedrooms: 4, bathrooms: 3, area_m2: 320, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa7, IMG.villa8, IMG.apt5] },
  { title: 'Ático Dúplex con Solárium', price: 780000, location: 'El Duque', bedrooms: 3, bathrooms: 2, area_m2: 165, operation_type: 'sale', images: [IMG.villa3, IMG.apt1] },
  { title: 'Apartamento Reformado de Autor', price: 420000, location: 'Costa Adeje', bedrooms: 2, bathrooms: 2, area_m2: 95, operation_type: 'sale', badge: 'new', images: [IMG.apt2, IMG.apt6, IMG.apt5] },
  { title: 'Casa Adosada con Piscina Comunitaria', price: 365000, location: 'Torviscas', bedrooms: 3, bathrooms: 2, area_m2: 145, operation_type: 'sale', images: [IMG.villa5, IMG.villa9] },
  { title: 'Suite Vacacional con Terraza Panorámica', price: 120, location: 'Bahía del Duque', bedrooms: 2, bathrooms: 1, area_m2: 80, operation_type: 'rent_vacation', images: [IMG.apt4, IMG.apt3] },
  { title: 'Estudio de Lujo Reformado', price: 950, location: 'Fañabé', bedrooms: 1, bathrooms: 1, area_m2: 50, operation_type: 'rent_long', images: [IMG.apt3, IMG.apt2] },
];

const editorialLightHero: TemplateHero = {
  headline: 'Propiedades con alma',
  title: 'Propiedades con alma',
  subtitle: 'Cada espacio tiene un potencial. Con ojo de arquitecta y corazón de asesora, te ayudo a descubrirlo.',
  image: IMG.hero7,
  background_image_url: IMG.hero7,
  cta_text: 'Descubrir',
};

const editorialLightTestimonials: TemplateTestimonial[] = [
  { author: 'Claudia & Stefan Weber', text: 'Ariadna sah sofort Potenzial in einer Wohnung, die wir fast übersehen hätten. Jetzt ist es unser Traumhaus.', rating: 5, quote: 'Ariadna sah sofort Potenzial in einer Wohnung, die wir fast übersehen hätten. Jetzt ist es unser Traumhaus.', client_name: 'Claudia & Stefan Weber', client_location: 'Viena, Austria' },
  { author: 'Rachel & Tom Edwards', text: "Her architect's eye caught things we never would have noticed. Ariadna doesn't just sell properties — she transforms them.", rating: 5, quote: "Her architect's eye caught things we never would have noticed.", client_name: 'Rachel & Tom Edwards', client_location: 'Dublin, Irlanda' },
  { author: 'Paolo & Chiara Ricci', text: "Finalmente un'agente che capisce l'architettura. Ci ha consigliato modifiche che hanno triplicato il valore percepito.", rating: 5, quote: "Finalmente un'agente che capisce l'architettura.", client_name: 'Paolo & Chiara Ricci', client_location: 'Roma, Italia' },
];

const editorialLightServices: TemplateService[] = [
  { title: 'Evaluación Arquitectónica', description: 'Análisis profesional de orientación, materiales, distribución y potencial de reforma' },
  { title: 'Asesoría de Compra', description: 'Acompañamiento experto para encontrar la propiedad que encaja contigo' },
  { title: 'Proyecto de Reforma', description: 'Presupuesto y diseño conceptual para transformar cualquier espacio' },
  { title: 'Home Staging Premium', description: 'Puesta en escena profesional para vender rápido y al mejor precio' },
  { title: 'Valoración de Mercado', description: 'Precio justo basado en datos reales y estado técnico de la propiedad' },
  { title: 'Gestión Documental', description: 'Escrituras, registro, certificados energéticos, IBI, plusvalía' },
];

const editorialLightZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'Zona premium, edificaciones modernas con buena orientación', image: IMG.beach1, image_url: IMG.beach1, property_count: 38 },
  { name: 'El Duque', description: 'Primera línea con los acabados más cuidados del sur', image: IMG.beach2, image_url: IMG.beach2, property_count: 15 },
  { name: 'Torviscas', description: 'Residencial tranquilo, ideal para reformas de alto valor', image: IMG.beach3, image_url: IMG.beach3, property_count: 22 },
  { name: 'La Caleta', description: 'Pueblo costero con villas de autor y personalidad', image: IMG.coast1, image_url: IMG.coast1, property_count: 12 },
];


// ══════════════════════════════════════════════════════════════
// 9. EDITORIAL AGENT — Henrik Lindström (Expat Specialist)
// ══════════════════════════════════════════════════════════════
const editorialAgentAgent: TemplateAgent = {
  full_name: 'Henrik Lindström',
  business_name: 'Henrik Lindström — Tenerife Property Advisor',
  slug: 'henrik-lindstrom',
  template: 'editorial-agent',
  bio: 'Sueco afincado en Tenerife desde 2010. Sé lo que es comprar aquí siendo extranjero porque yo lo hice. Guío a compradores nórdicos y europeos por todo el proceso: desde la primera visita hasta tener las llaves en la mano. Sin sorpresas.',
  phone: '+34 620 789 321',
  whatsapp: '+34 620 789 321',
  email: 'henrik@lindstrom-tenerife.com',
  languages: ['Sueco', 'Inglés', 'Español', 'Noruego'],
  experience_years: 14,
  photo: IMG.man3,
  bio_photo_url: IMG.man3,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 280, years: 14, clients: 400 },
  quote: 'Compré mi primera propiedad aquí en 2010. Sé exactamente qué necesitas saber porque yo pasé por lo mismo.',
};

const editorialAgentProperties: TemplateProperty[] = [
  { title: 'Villa Moderna con Piscina Privada', price: 1450000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 310, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa8, IMG.villa1, IMG.apt5] },
  { title: 'Apartamento Vista Mar Renovado', price: 345000, location: 'Los Cristianos', bedrooms: 2, bathrooms: 1, area_m2: 78, operation_type: 'sale', images: [IMG.apt1, IMG.apt6] },
  { title: 'Penthouse con Jacuzzi en Terraza', price: 620000, location: 'Playa de las Américas', bedrooms: 3, bathrooms: 2, area_m2: 150, operation_type: 'sale', badge: 'new', images: [IMG.villa6, IMG.apt2, IMG.apt4] },
  { title: 'Bungalow Reformado con Jardín', price: 290000, location: 'San Eugenio Bajo', bedrooms: 2, bathrooms: 1, area_m2: 95, operation_type: 'sale', images: [IMG.villa5, IMG.villa9] },
  { title: 'Apartamento Vacacional Amueblado', price: 95, location: 'Fañabé', bedrooms: 1, bathrooms: 1, area_m2: 55, operation_type: 'rent_vacation', images: [IMG.apt3, IMG.apt2] },
  { title: 'Piso Larga Temporada Golf del Sur', price: 1100, location: 'Golf del Sur', bedrooms: 2, bathrooms: 1, area_m2: 72, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt3] },
];

const editorialAgentHero: TemplateHero = {
  headline: 'Tu guía inmobiliario en Tenerife',
  title: 'Tu guía inmobiliario en Tenerife',
  subtitle: 'Sueco afincado en la isla. 14 años ayudando a europeos a encontrar su hogar al sol.',
  image: IMG.hero6,
  background_image_url: IMG.hero6,
  cta_text: 'Contactar a Henrik',
};

const editorialAgentTestimonials: TemplateTestimonial[] = [
  { author: 'Erik & Anna Johansson', text: 'Henrik förstod exakt vad vi letade efter. Hela processen var smidig och trygg. Rekommenderas varmt!', rating: 5, quote: 'Henrik förstod exakt vad vi letade efter. Rekommenderas varmt!', client_name: 'Erik & Anna Johansson', client_location: 'Gotemburgo, Suecia' },
  { author: 'Knut & Ingrid Olsen', text: 'Henrik made buying in Spain feel safe and simple. He handled everything — NIE, bank, notary. Brilliant.', rating: 5, quote: 'Henrik made buying in Spain feel safe and simple.', client_name: 'Knut & Ingrid Olsen', client_location: 'Oslo, Noruega' },
  { author: 'Michael & Sarah Bennett', text: 'As Brits buying abroad, we were nervous. Henrik walked us through every step with patience and expertise.', rating: 5, quote: 'Henrik walked us through every step with patience and expertise.', client_name: 'Michael & Sarah Bennett', client_location: 'Leeds, UK' },
];

const editorialAgentServices: TemplateService[] = [
  { title: 'Búsqueda Personalizada', description: 'Encuentro propiedades que encajan con tu estilo de vida, no solo con tu presupuesto' },
  { title: 'Trámites para Extranjeros', description: 'NIE, cuenta bancaria, gestoría fiscal, poder notarial — todo gestionado' },
  { title: 'Visitas Guiadas', description: 'Tours presenciales o videollamada con recorrido en directo de cada propiedad' },
  { title: 'Negociación Experta', description: 'Consigo el mejor precio posible. Conozco el mercado y sus márgenes' },
  { title: 'Postventa y Mudanza', description: 'Alta de suministros, seguros, reformas menores, conexión de internet' },
  { title: 'Asesoría de Alquiler', description: 'Si decides alquilar tu propiedad, te ayudo con la gestión completa' },
];

const editorialAgentZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'La zona favorita de los compradores nórdicos', image: IMG.beach1, image_url: IMG.beach1, property_count: 52 },
  { name: 'Los Cristianos', description: 'Ambiente internacional, servicios completos', image: IMG.beach2, image_url: IMG.beach2, property_count: 38 },
  { name: 'Golf del Sur', description: 'Comunidad británica, campos de golf, tranquilidad', image: IMG.beach3, image_url: IMG.beach3, property_count: 25 },
  { name: 'Palm-Mar', description: 'Pueblo costero joven y moderno, muy cotizado', image: IMG.coast1, image_url: IMG.coast1, property_count: 15 },
];


// ══════════════════════════════════════════════════════════════
// 10. EDITORIAL TEAM — Costa Realty (equipo multidisciplinar)
// ══════════════════════════════════════════════════════════════
const editorialTeamAgent: TemplateAgent = {
  full_name: 'Costa Realty',
  business_name: 'Costa Realty — Equipo de Expertos',
  slug: 'costa-realty',
  template: 'editorial-team',
  bio: 'Tres perfiles complementarios que cubren compraventa, alquileres vacacionales e inversión inmobiliaria en el sur de Tenerife. Un equipo, todas las respuestas.',
  phone: '+34 922 456 789',
  whatsapp: '+34 650 456 789',
  email: 'info@costarealty.es',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés', 'Italiano'],
  experience_years: 18,
  photo: IMG.man1,
  bio_photo_url: IMG.man1,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 520, years: 18, clients: 700 },
  quote: 'Tres cabezas piensan mejor que una. Y tres especialistas, aún mejor.',
};

const editorialTeamMembers: TemplateTeamMember[] = [
  { name: 'Julián Vega', role: 'Director Comercial — Compraventa residencial', photo: IMG.man1, photo_url: IMG.man1, languages: ['Español', 'Inglés'] },
  { name: 'Elena Martín', role: 'Directora de Alquileres Vacacionales', photo: IMG.woman1, photo_url: IMG.woman1, languages: ['Español', 'Francés', 'Italiano'] },
  { name: 'Marco Torres', role: 'Asesor de Inversiones Internacionales', photo: IMG.man3, photo_url: IMG.man3, languages: ['Español', 'Alemán', 'Inglés'] },
];

const editorialTeamProperties: TemplateProperty[] = [
  { title: 'Villa Premium Costa Adeje', price: 2100000, location: 'Costa Adeje', bedrooms: 5, bathrooms: 4, area_m2: 400, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.villa9] },
  { title: 'Penthouse Panorámico', price: 890000, location: 'Playa de las Américas', bedrooms: 3, bathrooms: 2, area_m2: 170, operation_type: 'sale', images: [IMG.villa6, IMG.apt1] },
  { title: 'Apartamento Playa Primera Línea', price: 130, location: 'Fañabé', bedrooms: 2, bathrooms: 1, area_m2: 75, operation_type: 'rent_vacation', images: [IMG.apt2, IMG.apt5] },
  { title: 'Villa Vacacional de Lujo', price: 280, location: 'La Caleta', bedrooms: 3, bathrooms: 2, area_m2: 200, operation_type: 'rent_vacation', images: [IMG.villa7, IMG.villa3] },
  { title: 'Chalet Inversión Turística', price: 550000, location: 'Los Cristianos', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', badge: 'investment', images: [IMG.villa5, IMG.villa2] },
  { title: 'Estudio Larga Temporada Centro', price: 750, location: 'Adeje Centro', bedrooms: 1, bathrooms: 1, area_m2: 45, operation_type: 'rent_long', images: [IMG.apt3, IMG.apt4] },
];

const editorialTeamHero: TemplateHero = {
  headline: 'Trabaja con los Mejores',
  title: 'Trabaja con los Mejores',
  subtitle: 'Compraventa, alquileres e inversión. Un equipo especializado para cada necesidad.',
  image: IMG.hero4,
  background_image_url: IMG.hero4,
  cta_text: 'Conoce al Equipo',
};

const editorialTeamTestimonials: TemplateTestimonial[] = [
  { author: 'Die Familie Becker', text: 'Marco hat uns perfekt beraten. Unsere Ferienwohnung bringt 7,5% Rendite. Besser als erwartet!', rating: 5, quote: 'Marco hat uns perfekt beraten. Unsere Ferienwohnung bringt 7,5% Rendite.', client_name: 'Die Familie Becker', client_location: 'Düsseldorf, Alemania' },
  { author: 'Famille Dupont', text: "Elena gère notre location saisonnière depuis 2 ans. Taux d'occupation de 85%. Service impeccable.", rating: 5, quote: "Elena gère notre location saisonnière. Taux d'occupation de 85%.", client_name: 'Famille Dupont', client_location: 'Nantes, Francia' },
  { author: 'Robert & Jane Mitchell', text: 'The whole team is brilliant. Julián for buying, Elena for renting out. One-stop shop.', rating: 5, quote: 'The whole team is brilliant. One-stop shop.', client_name: 'Robert & Jane Mitchell', client_location: 'Cardiff, UK' },
];

const editorialTeamServices: TemplateService[] = [
  { title: 'Compraventa Residencial', description: 'Julián: especialista en vivienda habitual y segunda residencia' },
  { title: 'Alquiler Vacacional', description: 'Elena: gestión integral de viviendas turísticas con licencia' },
  { title: 'Inversión Internacional', description: 'Marco: ROI, fiscalidad, Golden Visa y optimización fiscal' },
  { title: 'Property Management', description: 'Mantenimiento, limpieza, check-in/out y reporting mensual' },
  { title: 'Asesoría Legal', description: 'Abogados propios para NIE, escrituras, impuestos no residentes' },
  { title: 'Reformas y Decoración', description: 'Red de profesionales para poner tu propiedad a punto' },
];

const editorialTeamZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'Sede del equipo. Zona premium con máxima demanda.', image: IMG.beach1, image_url: IMG.beach1, property_count: 68 },
  { name: 'Las Américas', description: 'Centro turístico. Ideal para inversión vacacional.', image: IMG.beach2, image_url: IMG.beach2, property_count: 45 },
  { name: 'Los Cristianos', description: 'Mercado mixto: residencial e inversión.', image: IMG.beach3, image_url: IMG.beach3, property_count: 52 },
  { name: 'La Caleta', description: 'Nicho premium. Villas exclusivas con mucho margen.', image: IMG.coast1, image_url: IMG.coast1, property_count: 15 },
];


// ══════════════════════════════════════════════════════════════
// 11. EDITORIAL CATALOG — Costa Properties (marketplace)
// ══════════════════════════════════════════════════════════════
const editorialCatalogAgent: TemplateAgent = {
  full_name: 'Costa Properties',
  business_name: 'Costa Properties — Tu Portal Inmobiliario',
  slug: 'costa-properties',
  template: 'editorial-catalog',
  bio: 'El catálogo inmobiliario más completo del sur de Tenerife. Más de 200 propiedades activas entre venta, alquiler vacacional y alquiler de larga temporada. Filtra, compara y encuentra tu hogar.',
  phone: '+34 922 654 321',
  whatsapp: '+34 650 654 321',
  email: 'info@costaproperties.es',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés'],
  experience_years: 12,
  photo: IMG.woman4,
  bio_photo_url: IMG.woman4,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 400, years: 12, clients: 600 },
  quote: 'El catálogo más amplio. La búsqueda más fácil. La decisión, tuya.',
};

const editorialCatalogProperties: TemplateProperty[] = [
  { title: 'Villa Moderna 4 Dormitorios', price: 1250000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 300, operation_type: 'sale', badge: 'new', images: [IMG.villa1, IMG.villa8] },
  { title: 'Apartamento Centro Adeje', price: 245000, location: 'Adeje', bedrooms: 2, bathrooms: 1, area_m2: 72, operation_type: 'sale', images: [IMG.apt2, IMG.apt5] },
  { title: 'Penthouse con Terraza 100m²', price: 680000, location: 'El Duque', bedrooms: 3, bathrooms: 2, area_m2: 165, operation_type: 'sale', images: [IMG.villa6, IMG.apt1] },
  { title: 'Estudio Vacacional Playa', price: 85, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 40, operation_type: 'rent_vacation', images: [IMG.apt3, IMG.apt4] },
  { title: 'Villa Vacacional Premium', price: 250, location: 'La Caleta', bedrooms: 3, bathrooms: 2, area_m2: 200, operation_type: 'rent_vacation', badge: 'popular', images: [IMG.villa7, IMG.villa9] },
  { title: 'Piso 3 Dorm. Larga Temporada', price: 1100, location: 'Los Cristianos', bedrooms: 3, bathrooms: 2, area_m2: 95, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt2] },
  { title: 'Chalet Pareado con Jardín', price: 480000, location: 'San Eugenio', bedrooms: 4, bathrooms: 3, area_m2: 210, operation_type: 'sale', images: [IMG.villa5, IMG.villa2] },
  { title: 'Apartamento Playa del Duque', price: 520000, location: 'El Duque', bedrooms: 2, bathrooms: 2, area_m2: 110, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa4, IMG.apt6] },
];

const editorialCatalogHero: TemplateHero = {
  headline: 'Encuentra tu propiedad ideal',
  title: 'Encuentra tu propiedad ideal',
  subtitle: '+200 propiedades en venta y alquiler en el sur de Tenerife. Filtra por tipo, zona y precio.',
  image: IMG.hero2,
  background_image_url: IMG.hero2,
  cta_text: 'Explorar Catálogo',
};

const editorialCatalogTestimonials: TemplateTestimonial[] = [
  { author: 'Sandra & Michael Hofmann', text: 'Das umfangreichste Immobilienportal für Teneriffa Süd. Wir haben unser Apartment in 2 Tagen gefunden.', rating: 5, quote: 'Das umfangreichste Immobilienportal für Teneriffa Süd.', client_name: 'Sandra & Michael Hofmann', client_location: 'Stuttgart, Alemania' },
  { author: 'María José Fernández', text: 'La web es súper fácil de usar. Filtré por zona y presupuesto y en 5 minutos ya tenía mis favoritos.', rating: 5, quote: 'En 5 minutos ya tenía mis favoritos.', client_name: 'María José Fernández', client_location: 'Bilbao, España' },
  { author: 'Peter & Linda Svensson', text: 'We browsed 50 properties online before visiting just 3 in person. Bought the first one. Perfect filtering!', rating: 5, quote: 'We browsed 50 properties online before visiting just 3 in person.', client_name: 'Peter & Linda Svensson', client_location: 'Malmö, Suecia' },
];

const editorialCatalogServices: TemplateService[] = [
  { title: 'Venta de Propiedades', description: 'Catálogo completo de viviendas en venta en Tenerife Sur' },
  { title: 'Alquiler Vacacional', description: 'Apartamentos y villas para estancias cortas con todo incluido' },
  { title: 'Alquiler Larga Temporada', description: 'Pisos y casas para vivir todo el año' },
  { title: 'Alertas Personalizadas', description: 'Recibe notificaciones cuando publiquemos propiedades que encajen contigo' },
  { title: 'Visitas Virtuales', description: 'Tours 360° de todas las propiedades para verlas desde cualquier lugar' },
  { title: 'Asesoría de Compra', description: 'Acompañamiento profesional en todo el proceso de compra' },
];

const editorialCatalogZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'Premium. 85 propiedades activas.', image: IMG.beach1, image_url: IMG.beach1, property_count: 85 },
  { name: 'Los Cristianos', description: 'Turístico. 52 propiedades activas.', image: IMG.beach2, image_url: IMG.beach2, property_count: 52 },
  { name: 'Las Américas', description: 'Inversión. 38 propiedades activas.', image: IMG.beach3, image_url: IMG.beach3, property_count: 38 },
  { name: 'Arona & Adeje Interior', description: 'Residencial. 30 propiedades activas.', image: IMG.coast1, image_url: IMG.coast1, property_count: 30 },
];


// ══════════════════════════════════════════════════════════════
// 12. EDITORIAL FULLSERVICE — Costa Living (3 divisiones)
// ══════════════════════════════════════════════════════════════
const editorialFullAgent: TemplateAgent = {
  full_name: 'Isabel Navarro',
  business_name: 'Costa Living — Vive, Invierte, Disfruta',
  slug: 'costa-living',
  template: 'editorial-fullservice',
  bio: 'Costa Living es la agencia más completa del sur de Tenerife. Tres divisiones especializadas: venta residencial, alquiler vacacional y alquiler de larga temporada. Sea cual sea tu necesidad inmobiliaria, tenemos una solución.',
  phone: '+34 922 321 654',
  whatsapp: '+34 650 321 654',
  email: 'info@costaliving.es',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés'],
  experience_years: 16,
  photo: IMG.woman1,
  bio_photo_url: IMG.woman1,
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 480, years: 16, clients: 850 },
  quote: 'No importa cómo quieras vivir Tenerife. Tenemos la llave.',
};

const editorialFullProperties: TemplateProperty[] = [
  // Venta
  { title: 'Villa Moderna con Piscina Infinity', price: 1950000, location: 'Costa Adeje', bedrooms: 5, bathrooms: 4, area_m2: 420, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.villa9] },
  { title: 'Apartamento Reformado Vista Mar', price: 385000, location: 'Los Cristianos', bedrooms: 2, bathrooms: 1, area_m2: 82, operation_type: 'sale', images: [IMG.apt1, IMG.apt5] },
  { title: 'Chalet Adosado con Jardín', price: 495000, location: 'San Eugenio', bedrooms: 3, bathrooms: 2, area_m2: 175, operation_type: 'sale', badge: 'new', images: [IMG.villa5, IMG.villa2] },
  // Vacacional
  { title: 'Ático Panorámico con Solárium', price: 200, location: 'Costa Adeje', bedrooms: 2, bathrooms: 1, area_m2: 90, operation_type: 'rent_vacation', images: [IMG.apt2, IMG.apt6] },
  { title: 'Villa Vacacional Premium 4 Pax', price: 350, location: 'La Caleta', bedrooms: 3, bathrooms: 2, area_m2: 200, operation_type: 'rent_vacation', badge: 'popular', images: [IMG.villa7, IMG.villa3] },
  { title: 'Estudio Playa de las Américas', price: 75, location: 'Playa de las Américas', bedrooms: 1, bathrooms: 1, area_m2: 38, operation_type: 'rent_vacation', images: [IMG.apt3, IMG.apt4] },
  // Larga temporada
  { title: 'Piso 3 Dorm. Adeje Centro', price: 950, location: 'Adeje Centro', bedrooms: 3, bathrooms: 2, area_m2: 110, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt2] },
  { title: 'Estudio Moderno Los Cristianos', price: 750, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 45, operation_type: 'rent_long', images: [IMG.apt3, IMG.apt5] },
  { title: 'Dúplex Familiar Torviscas', price: 1400, location: 'Torviscas Alto', bedrooms: 3, bathrooms: 2, area_m2: 140, operation_type: 'rent_long', images: [IMG.villa4, IMG.apt1] },
];

const editorialFullHero: TemplateHero = {
  headline: 'Vive, Invierte, Disfruta',
  title: 'Vive, Invierte, Disfruta',
  subtitle: 'Tres divisiones. Una misión: encontrarte el espacio perfecto en Tenerife, sea para vivir, invertir o disfrutar.',
  image: IMG.hero2,
  background_image_url: IMG.hero2,
  cta_text: 'Explorar Opciones',
};

const editorialFullTestimonials: TemplateTestimonial[] = [
  { author: 'Patricia & Thomas Krüger', text: 'Wir haben über Costa Living gekauft UND vermieten jetzt über sie. Alles aus einer Hand. Perfekt!', rating: 5, quote: 'Alles aus einer Hand. Perfekt!', client_name: 'Patricia & Thomas Krüger', client_location: 'Colonia, Alemania' },
  { author: 'David & Sophie Turner', text: "Bought a flat for investment, and Costa Living manages the holiday rental. 82% occupancy in year one. Couldn't ask for more.", rating: 5, quote: "82% occupancy in year one. Couldn't ask for more.", client_name: 'David & Sophie Turner', client_location: 'Brighton, UK' },
  { author: 'Ana Belén Martínez', text: 'Alquilé mi piso de larga temporada con ellos. Buenos inquilinos, cero problemas, todo gestionado. Tranquilidad total.', rating: 5, quote: 'Buenos inquilinos, cero problemas. Tranquilidad total.', client_name: 'Ana Belén Martínez', client_location: 'Madrid, España' },
];

const editorialFullServices: TemplateService[] = [
  { title: 'Compraventa Residencial', description: 'Tu hogar permanente o segunda residencia en Tenerife' },
  { title: 'Inversión Inmobiliaria', description: 'Propiedades con alta rentabilidad para inversores nacionales e internacionales' },
  { title: 'Alquiler Vacacional', description: 'Gestión integral: reservas, limpieza, mantenimiento, guest experience' },
  { title: 'Alquiler Larga Temporada', description: 'Búsqueda de inquilinos, contratos, cobros y gestión de incidencias' },
  { title: 'Licencia Turística', description: 'Trámites completos para obtener tu licencia VV (Vivienda Vacacional)' },
  { title: 'Reforma y Decoración', description: 'Ponemos tu propiedad a punto para vivir o para rentar' },
];

const editorialFullZones: TemplateZone[] = [
  { name: 'Costa Adeje', description: 'Nuestra zona principal. Venta, vacacional y larga temporada.', image: IMG.beach1, image_url: IMG.beach1, property_count: 92 },
  { name: 'Los Cristianos', description: 'Alta demanda de alquiler todo el año.', image: IMG.beach2, image_url: IMG.beach2, property_count: 65 },
  { name: 'Las Américas', description: 'Máxima rentabilidad vacacional.', image: IMG.beach3, image_url: IMG.beach3, property_count: 48 },
  { name: 'Arona Interior', description: 'Precios competitivos para larga temporada.', image: IMG.coast1, image_url: IMG.coast1, property_count: 35 },
];


// ══════════════════════════════════════════════════════════════
// 13. MONOLITH — Estudio de arquitectura inmobiliaria
// ══════════════════════════════════════════════════════════════
const monolithAgent: TemplateAgent = {
  full_name: 'Elara Vance',
  business_name: 'MONOLITH',
  slug: 'monolith-tenerife',
  template: 'monolith',
  bio: 'Propiedades de arquitectura contemporánea en Tenerife Sur. No son simples inmuebles — son declaraciones de diseño. Selección extrema: solo aceptamos propiedades que cumplan nuestros estándares arquitectónicos.',
  phone: '+34 922 000 001',
  whatsapp: '+34 650 000 001',
  email: 'studio@monolith.es',
  languages: ['Español', 'Inglés', 'Alemán'],
  experience_years: 12,
  photo: IMG.woman2,
  bio_photo_url: IMG.woman2,
  location: 'Tenerife Sur',
  city: 'Tenerife Sur',
  stats: { sales: 75, years: 12, clients: 90 },
  quote: 'El minimalismo no es ausencia — es la honestidad del material y la pureza de la forma.',
};

const monolithProperties: TemplateProperty[] = [
  { title: 'VILLA ALISIOS', price: 1850000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 380, operation_type: 'sale', badge: 'exclusive', images: [IMG.villa1, IMG.villa8, IMG.apt5] },
  { title: 'ABAMA ROYAL', price: 2950000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 450, operation_type: 'sale', images: [IMG.villa2, IMG.villa9, IMG.villa7] },
  { title: 'CASA BASALTO', price: 280, location: 'La Caleta', bedrooms: 3, bathrooms: 2, area_m2: 200, operation_type: 'rent_vacation', images: [IMG.villa7, IMG.villa3] },
  { title: 'PENTHOUSE HORIZON', price: 150, location: 'Playa de las Américas', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: [IMG.villa6, IMG.apt1] },
  { title: 'GEOMETRÍA VERDE', price: 890000, location: 'Golf del Sur', bedrooms: 3, bathrooms: 2, area_m2: 210, operation_type: 'sale', images: [IMG.villa5, IMG.villa4] },
  { title: 'LOFT INDUSTRIAL', price: 1600, location: 'Granadilla', bedrooms: 1, bathrooms: 1, area_m2: 95, operation_type: 'rent_long', images: [IMG.apt4, IMG.apt3] },
];

const monolithHero: TemplateHero = {
  headline: 'ESCAPA DE LO ORDINARIO.',
  title: 'ESCAPA DE LO ORDINARIO.',
  subtitle: 'Propiedades de arquitectura contemporánea en Tenerife Sur.',
  image: IMG.hero6,
  background_image_url: IMG.hero6,
  cta_text: 'VER COLECCIÓN',
};

const monolithTestimonials: TemplateTestimonial[] = [
  { author: 'Architect Jens Rieper', text: 'MONOLITH versteht Architektur. Als Architekt sage ich: ihr Auge für Design ist außergewöhnlich.', rating: 5, quote: 'MONOLITH versteht Architektur. Ihr Auge für Design ist außergewöhnlich.', client_name: 'Jens Rieper, Architekt', client_location: 'Berlín, Alemania' },
  { author: 'Victoria & James Ashworth', text: 'They showed us just three properties. Each one was a masterpiece. We bought the first.', rating: 5, quote: 'They showed us just three properties. Each one was a masterpiece.', client_name: 'Victoria & James Ashworth', client_location: 'London, UK' },
  { author: 'Studio Forma', text: 'Collaboriamo con MONOLITH per i nostri clienti che cercano architettura contemporanea. Standard altissimi.', rating: 5, quote: 'Standard altissimi. Architettura contemporanea al suo meglio.', client_name: 'Studio Forma', client_location: 'Milán, Italia' },
];

const monolithServices: TemplateService[] = [
  { title: 'Curaduría Arquitectónica', description: 'Solo propiedades que cumplen nuestros estándares de diseño contemporáneo' },
  { title: 'Comisión de Proyecto', description: 'Diseño a medida con nuestra red de arquitectos para tu parcela' },
  { title: 'Art Direction', description: 'Interiorismo y dirección artística para propiedades premium' },
  { title: 'Inversión en Diseño', description: 'Propiedades de autor con alta revalorización garantizada' },
];

const monolithZones: TemplateZone[] = [
  { name: 'La Caleta', description: 'Villas de autor. Arquitectura orgánica junto al mar.', image: IMG.beach1, image_url: IMG.beach1, property_count: 6 },
  { name: 'Abama', description: 'Resort exclusivo. Diseño de firma internacional.', image: IMG.beach3, image_url: IMG.beach3, property_count: 4 },
  { name: 'Golf del Sur', description: 'Líneas limpias. Minimalismo con vistas.', image: IMG.beach2, image_url: IMG.beach2, property_count: 5 },
];


// ══════════════════════════════════════════════════════════════
// BUILD TEMPLATE DATA
// ══════════════════════════════════════════════════════════════
function buildDemo(
  agent: TemplateAgent,
  properties: TemplateProperty[],
  hero: TemplateHero,
  team?: TemplateTeamMember[],
  testimonials?: TemplateTestimonial[],
  services?: TemplateService[],
  zones?: TemplateZone[],
): TemplateData {
  return {
    agent,
    properties,
    hero,
    testimonials: testimonials || [],
    team: team || [],
    services: services || [],
    zones: zones || [],
  };
}


// ══════════════════════════════════════════════════════════════
// EXPORT — 13 fully unique demo datasets
// ══════════════════════════════════════════════════════════════
export const DEMO_DATA: Record<string, TemplateData> = {
  'luxury': buildDemo(luxuryAgent, luxuryProperties, luxuryHero, undefined, luxuryTestimonials, luxuryServices, luxuryZones),
  'mediterranean': buildDemo(mediterraneanAgent, mediterraneanProperties, mediterraneanHero, undefined, mediterraneanTestimonials, mediterraneanServices, mediterraneanZones),
  'corporate': buildDemo(corporateAgent, corporateProperties, corporateHero, corporateTeam, corporateTestimonials, corporateServices, corporateZones),
  'boutique': buildDemo(boutiqueAgent, boutiqueProperties, boutiqueHero, undefined, boutiqueTestimonials, boutiqueServices, boutiqueZones),
  'classic': buildDemo(classicAgent, classicProperties, classicHero, undefined, classicTestimonials, classicServices, classicZones),
  'data': buildDemo(dataAgent, dataProperties, dataHero, dataTeam, dataTestimonials, dataServices, dataZones),
  'editorial-dark': buildDemo(editorialDarkAgent, editorialDarkProperties, editorialDarkHero, undefined, editorialDarkTestimonials, editorialDarkServices, editorialDarkZones),
  'editorial-light': buildDemo(editorialLightAgent, editorialLightProperties, editorialLightHero, undefined, editorialLightTestimonials, editorialLightServices, editorialLightZones),
  'editorial-agent': buildDemo(editorialAgentAgent, editorialAgentProperties, editorialAgentHero, undefined, editorialAgentTestimonials, editorialAgentServices, editorialAgentZones),
  'editorial-team': buildDemo(editorialTeamAgent, editorialTeamProperties, editorialTeamHero, editorialTeamMembers, editorialTeamTestimonials, editorialTeamServices, editorialTeamZones),
  'editorial-catalog': buildDemo(editorialCatalogAgent, editorialCatalogProperties, editorialCatalogHero, undefined, editorialCatalogTestimonials, editorialCatalogServices, editorialCatalogZones),
  'editorial-fullservice': buildDemo(editorialFullAgent, editorialFullProperties, editorialFullHero, undefined, editorialFullTestimonials, editorialFullServices, editorialFullZones),
  'monolith': buildDemo(monolithAgent, monolithProperties, monolithHero, undefined, monolithTestimonials, monolithServices, monolithZones),
};

export default DEMO_DATA;
