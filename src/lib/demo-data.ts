import { TemplateData, TemplateAgent, TemplateProperty, TemplateHero } from '@/components/templates/types';

// ═══ LUXURY DEMO ═══
const luxuryAgent: TemplateAgent = {
  full_name: 'Victoria Laurent',
  business_name: 'Victoria Laurent Luxury Properties',
  slug: 'victoria-laurent',
  template: 'luxury',
  bio: 'Especialista en propiedades de lujo en la costa sur de Tenerife. Con 12 anos de experiencia y una red exclusiva de clientes internacionales, ofrezco un servicio discreto y personalizado para compradores exigentes.',
  phone: '+34 622 456 789',
  email: 'victoria@luxuryproperties.com',
  languages: ['Espanol', 'Frances', 'Ingles', 'Italiano'],
  experience_years: 12,
  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
  location: 'Costa Adeje, Tenerife',
};

const luxuryProperties: TemplateProperty[] = [
  { title: 'Villa Contemporanea con Vistas al Mar', price: 2850000, location: 'Abama, Guia de Isora', bedrooms: 5, bathrooms: 4, area_m2: 420, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'Penthouse de Lujo en Primera Linea', price: 1950000, location: 'La Caleta, Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 280, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
  { title: 'Finca Exclusiva con Piscina Infinita', price: 3200000, location: 'San Eugenio Alto', bedrooms: 6, bathrooms: 5, area_m2: 550, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Apartamento Boutique en Resort Premium', price: 890000, location: 'Bahia del Duque', bedrooms: 3, bathrooms: 2, area_m2: 165, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { title: 'Villa Panoramica Oceano', price: 4500000, location: 'Playa Paraiso', bedrooms: 7, bathrooms: 6, area_m2: 680, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'Suite de Lujo con Terraza Privada', price: 1200000, location: 'Torviscas Alto', bedrooms: 3, bathrooms: 3, area_m2: 195, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
];

const luxuryHero: TemplateHero = {
  title: 'Propiedades exclusivas en Tenerife',
  subtitle: '12 anos conectando compradores exigentes con las mejores residencias de la isla',
  image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
};

// ═══ MEDITERRANEAN DEMO ═══
const mediterraneanAgent: TemplateAgent = {
  full_name: 'Antonio Reyes',
  business_name: 'Antonio Reyes Inmobiliaria',
  slug: 'antonio-reyes',
  template: 'mediterranean',
  bio: '15 anos ayudando a familias a encontrar su hogar perfecto en Tenerife. Mas de 320 ventas realizadas. Mi compromiso es acompanarte en cada paso del proceso, desde la primera visita hasta la firma en notaria.',
  phone: '+34 666 123 456',
  email: 'antonio@reyesinmo.com',
  languages: ['Espanol', 'Ingles', 'Aleman'],
  experience_years: 15,
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  location: 'Los Cristianos, Tenerife',
};

const mediterraneanProperties: TemplateProperty[] = [
  { title: 'Apartamento Luminoso con Terraza', price: 285000, location: 'Los Cristianos', bedrooms: 2, bathrooms: 1, area_m2: 85, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'] },
  { title: 'Chalet Familiar con Jardin', price: 425000, location: 'San Isidro', bedrooms: 4, bathrooms: 2, area_m2: 180, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Piso Reformado Centro', price: 195000, location: 'Arona', bedrooms: 3, bathrooms: 1, area_m2: 95, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'] },
  { title: 'Duplex con Vistas al Teide', price: 340000, location: 'Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
  { title: 'Estudio Vacacional Primera Linea', price: 1200, location: 'Playa de las Americas', bedrooms: 1, bathrooms: 1, area_m2: 45, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'] },
  { title: 'Apartamento Larga Temporada', price: 850, location: 'Los Cristianos Centro', bedrooms: 2, bathrooms: 1, area_m2: 70, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
];

const mediterraneanHero: TemplateHero = {
  title: 'Tu hogar en Tenerife te espera',
  subtitle: '15 anos de experiencia. 320+ familias felices. Tu proximo hogar esta aqui.',
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
};
// ═══ CORPORATE DEMO ═══
const corporateAgent: TemplateAgent = {
  full_name: 'Carlos Mendez',
  business_name: 'Tenerife Prime Real Estate',
  slug: 'tenerife-prime',
  template: 'corporate',
  bio: 'Tenerife Prime es una agencia consolidada con 8 agentes especializados y mas de 20 anos en el mercado. Mas de 500 millones de euros en volumen de ventas gestionado.',
  phone: '+34 922 789 456',
  email: 'info@tenerifeprime.com',
  languages: ['Espanol', 'Ingles', 'Aleman', 'Frances', 'Ruso'],
  experience_years: 20,
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  location: 'Costa Adeje, Tenerife',
};

const corporateProperties: TemplateProperty[] = [
  { title: 'Oficina Premium Zona Comercial', price: 385000, location: 'Santa Cruz de Tenerife', bedrooms: 0, bathrooms: 2, area_m2: 120, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'] },
  { title: 'Apartamento Vista Mar 3 Dormitorios', price: 320000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 110, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Villa de Lujo con Piscina', price: 1250000, location: 'Torviscas Alto', bedrooms: 5, bathrooms: 4, area_m2: 350, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'Estudio Centro Historico', price: 155000, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 48, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'] },
  { title: 'Chalet Pareado Nuevo', price: 445000, location: 'El Medano', bedrooms: 4, bathrooms: 3, area_m2: 200, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'Local Comercial Avenida Principal', price: 2200, location: 'Las Americas', bedrooms: 0, bathrooms: 1, area_m2: 95, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'] },
];

const corporateHero: TemplateHero = {
  title: 'Tu agencia inmobiliaria de confianza',
  subtitle: '20 anos de experiencia. 8 agentes especializados. Mas de 500M EUR gestionados.',
  image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
};

const corporateTeam = [
  { name: 'Carlos Mendez', role: 'Director General', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Elena Ruiz', role: 'Directora Comercial', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200' },
  { name: 'Thomas Muller', role: 'Mercado Aleman', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Sarah Williams', role: 'Mercado Britanico', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' },
  { name: 'Marco Rossi', role: 'Propiedades Lujo', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200' },
  { name: 'Ana Garcia', role: 'Alquileres', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];

// ═══ BOUTIQUE DEMO ═══
const boutiqueAgent: TemplateAgent = {
  full_name: 'Sophie et Pierre Delacroix',
  business_name: 'Maison Tenerife',
  slug: 'maison-tenerife',
  template: 'boutique',
  bio: 'Somos pequenos por eleccion. Seleccionamos un maximo de 25 propiedades para ofrecer una atencion verdaderamente personalizada. Cada propiedad que aceptamos ha pasado nuestra curaduria personal.',
  phone: '+34 611 234 567',
  email: 'contact@maisontenerife.com',
  languages: ['Frances', 'Espanol', 'Ingles'],
  experience_years: 8,
  photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  location: 'Costa Adeje, Tenerife',
};

const boutiqueProperties: TemplateProperty[] = [
  { title: 'Villa Minimalista con Infiniti Pool', price: 1850000, location: 'La Caleta', bedrooms: 4, bathrooms: 3, area_m2: 300, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
  { title: 'Ático Exclusivo Frente al Mar', price: 920000, location: 'El Duque', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Casa de Autor con Bodega', price: 1450000, location: 'Guia de Isora', bedrooms: 5, bathrooms: 4, area_m2: 380, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Suite Boutique con Servicio', price: 2800, location: 'Bahia del Duque', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { title: 'Loft de Diseno Contemporaneo', price: 680000, location: 'San Eugenio', bedrooms: 2, bathrooms: 2, area_m2: 130, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
  { title: 'Residencia de Artista con Estudio', price: 1100000, location: 'Playa San Juan', bedrooms: 3, bathrooms: 2, area_m2: 250, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
];

const boutiqueHero: TemplateHero = {
  title: 'Seleccion curada de propiedades unicas',
  subtitle: 'Maximo 25 propiedades. Atencion absoluta. Calidad sobre cantidad.',
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
};
// ═══ CLASSIC DEMO ═══
const classicAgent: TemplateAgent = {
  full_name: 'Roberto Fernandez',
  business_name: 'Roberto Fernandez — Inmobiliaria desde 1999',
  slug: 'roberto-fernandez',
  template: 'classic',
  bio: '27 anos en el sector inmobiliario de Tenerife. Mas de 600 operaciones de compraventa realizadas. Premio al Mejor Agente del ano 2019 y 2022. Nadie conoce este mercado como yo.',
  phone: '+34 922 345 678',
  email: 'roberto@fernandezinmo.com',
  languages: ['Espanol', 'Ingles'],
  experience_years: 27,
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  location: 'La Laguna, Tenerife',
};

const classicProperties: TemplateProperty[] = [
  { title: 'Casa Canaria Restaurada con Patio', price: 380000, location: 'La Laguna Centro', bedrooms: 4, bathrooms: 2, area_m2: 220, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Finca Rustica con Plataneras', price: 520000, location: 'Tacoronte', bedrooms: 5, bathrooms: 3, area_m2: 280, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'Piso Senorial en Edificio Historico', price: 265000, location: 'Santa Cruz Centro', bedrooms: 3, bathrooms: 2, area_m2: 130, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Adosado con Huerto y Bodega', price: 340000, location: 'El Sauzal', bedrooms: 3, bathrooms: 2, area_m2: 175, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
  { title: 'Casa Tradicional con Vistas al Valle', price: 290000, location: 'La Orotava', bedrooms: 4, bathrooms: 2, area_m2: 200, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { title: 'Almacen Convertido en Loft', price: 1100, location: 'La Laguna', bedrooms: 1, bathrooms: 1, area_m2: 85, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
];

const classicHero: TemplateHero = {
  title: '27 anos de experiencia inmobiliaria',
  subtitle: 'Mas de 600 operaciones exitosas. Conocimiento profundo del mercado de Tenerife.',
  image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
};

// ═══ NETWORK DEMO ═══
const networkAgent: TemplateAgent = {
  full_name: 'James Morrison',
  business_name: 'Island Properties Group',
  slug: 'island-properties',
  template: 'network',
  bio: 'La mayor red inmobiliaria del sur de Tenerife. 3 oficinas, 15 agentes, mas de 400 propiedades en cartera. Si esta en venta en Tenerife, lo tenemos.',
  phone: '+34 922 567 890',
  email: 'info@islandproperties.es',
  languages: ['Ingles', 'Espanol', 'Aleman', 'Frances', 'Ruso', 'Holandes'],
  experience_years: 25,
  photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  location: 'Costa Adeje, Tenerife',
};

const networkProperties: TemplateProperty[] = [
  { title: 'Apartamento Turistico Renovado', price: 245000, location: 'Playa de las Americas', bedrooms: 2, bathrooms: 1, area_m2: 72, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'] },
  { title: 'Villa Familiar con Jardin Tropical', price: 680000, location: 'Callao Salvaje', bedrooms: 4, bathrooms: 3, area_m2: 240, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'Estudio con Licencia Vacacional', price: 185000, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 42, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'] },
  { title: 'Chalet de Montana con Vistas', price: 390000, location: 'Vilaflor', bedrooms: 3, bathrooms: 2, area_m2: 160, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
  { title: 'Apartamento Vacacional Premium', price: 1500, location: 'Costa Adeje', bedrooms: 2, bathrooms: 2, area_m2: 80, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Local + Vivienda Comercial', price: 1800, location: 'Las Americas Centro', bedrooms: 2, bathrooms: 1, area_m2: 110, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'] },
];

const networkHero: TemplateHero = {
  title: 'La mayor red inmobiliaria de Tenerife Sur',
  subtitle: '3 oficinas. 15 agentes. 400+ propiedades. Si existe, lo encontramos.',
  image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
};

const networkTeam = [
  { name: 'James Morrison', role: 'CEO & Fundador', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Maria Santos', role: 'Directora Oficina Adeje', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200' },
  { name: 'Klaus Weber', role: 'Director Oficina Americas', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200' },
  { name: 'Laura Martinez', role: 'Directora Oficina Cristianos', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200' },
  { name: 'David Chen', role: 'Marketing Digital', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Natalia Petrova', role: 'Mercado Ruso', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];
// ═══ DATA-DRIVEN DEMO ═══
const dataAgent: TemplateAgent = {
  full_name: 'Miguel Torres',
  business_name: 'DataHomes Tenerife',
  slug: 'datahomes',
  template: 'data',
  bio: 'No adivinamos precios, los sabemos. Mas de 10.000 transacciones analizadas con IA. Usamos tecnologia avanzada y analisis de mercado en tiempo real para tomar decisiones basadas en datos, no en intuicion.',
  phone: '+34 611 987 654',
  email: 'info@datahomes.es',
  languages: ['Espanol', 'Ingles', 'Aleman'],
  experience_years: 5,
  photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
  location: 'Santa Cruz, Tenerife',
};

const dataProperties: TemplateProperty[] = [
  { title: 'Penthouse Smart Home Automatizado', price: 485000, location: 'Costa Adeje', bedrooms: 3, bathrooms: 2, area_m2: 140, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Apartamento Inversion Alta Rentabilidad', price: 210000, location: 'Playa de las Americas', bedrooms: 2, bathrooms: 1, area_m2: 68, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'] },
  { title: 'Villa Eficiente Energetica A+', price: 750000, location: 'Adeje', bedrooms: 4, bathrooms: 3, area_m2: 250, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'Loft Tecnologico Centro', price: 195000, location: 'Santa Cruz', bedrooms: 1, bathrooms: 1, area_m2: 55, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
  { title: 'Estudio ROI 8.2% Anual', price: 95, location: 'Los Cristianos', bedrooms: 1, bathrooms: 1, area_m2: 38, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'] },
  { title: 'Nave Industrial Reconvertida', price: 1600, location: 'Poligono Granadilla', bedrooms: 0, bathrooms: 2, area_m2: 320, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800'] },
];

const dataHero: TemplateHero = {
  title: 'Decisiones inmobiliarias basadas en datos',
  subtitle: '10.000+ transacciones analizadas. IA y analytics de mercado en tiempo real.',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600',
};

const dataTeam = [
  { name: 'Miguel Torres', role: 'CEO & Data Scientist', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200' },
  { name: 'Ana Vega', role: 'ML Engineer', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200' },
  { name: 'Pablo Ruiz', role: 'Market Analyst', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
];

// ═══ SHARED DATA ═══
const sharedTestimonials = [
  { author: 'John & Mary Williams', text: 'Increible servicio. Nos ayudaron a encontrar nuestra villa sonada en solo 3 semanas. Profesionalidad total.', rating: 5 },
  { author: 'Familie Schmidt', text: 'Wir sind sehr zufrieden. Der gesamte Kaufprozess war transparent und professionell. Sehr empfehlenswert!', rating: 5 },
  { author: 'Pierre Dubois', text: 'Service exceptionnel du debut a la fin. Je recommande vivement pour tout achat immobilier a Tenerife.', rating: 5 },
];

const sharedServices = [
  { title: 'Compraventa', description: 'Asesoramiento integral en compra y venta de propiedades' },
  { title: 'Valoracion gratuita', description: 'Tasacion profesional de tu propiedad sin compromiso' },
  { title: 'Gestion integral', description: 'Acompanamiento desde la busqueda hasta la firma en notaria' },
  { title: 'Asesoria legal', description: 'Red de abogados especializados en derecho inmobiliario' },
];

const sharedZones = [
  { name: 'Costa Adeje', description: 'Zona premium del sur', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
  { name: 'Los Cristianos', description: 'Centro turistico consolidado', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400' },
  { name: 'Puerto de la Cruz', description: 'Encanto del norte', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400' },
];

// ═══ BUILD TEMPLATE DATA ═══
function buildDemo(agent: TemplateAgent, properties: TemplateProperty[], hero: TemplateHero, team?: any[]): TemplateData {
  return {
    agent,
    properties,
    hero,
    testimonials: sharedTestimonials,
    team: team || [],
    services: sharedServices,
    zones: sharedZones,
  };
}

export const DEMO_DATA: Record<string, TemplateData> = {
  luxury: buildDemo(luxuryAgent, luxuryProperties, luxuryHero),
  mediterranean: buildDemo(mediterraneanAgent, mediterraneanProperties, mediterraneanHero),
  corporate: buildDemo(corporateAgent, corporateProperties, corporateHero, corporateTeam),
  boutique: buildDemo(boutiqueAgent, boutiqueProperties, boutiqueHero),
  classic: buildDemo(classicAgent, classicProperties, classicHero),
  network: buildDemo(networkAgent, networkProperties, networkHero, networkTeam),
  data: buildDemo(dataAgent, dataProperties, dataHero, dataTeam),
};

export default DEMO_DATA;