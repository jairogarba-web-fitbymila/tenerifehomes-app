export interface TemplateAgent {
  full_name: string;
  business_name?: string;
  slug: string;
  template: string;
  bio?: string;
  phone?: string;
  email?: string;
  languages?: string[];
  experience_years?: number;
  photo?: string;
  location?: string;
  bio_photo_url?: string;
  city?: string;
  stats?: Record<string, number>;
  quote?: string;
  whatsapp?: string;
}

export interface TemplateProperty {
  id?: string;
  title: string;
  price: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  size_m2?: number;
  operation_type: 'sale' | 'rent_long' | 'rent_vacation';
  images?: string[];
  is_active?: boolean;
  badge?: string;
}

export interface TemplateHero {
  title?: string;
  subtitle?: string;
  image?: string;
  background_image_url?: string;
  headline?: string;
  cta_text?: string;
}

export interface TemplateTestimonial {
  id?: string;
  author: string;
  text: string;
  rating?: number;
  quote?: string;
  client_name?: string;
  client_location?: string;
}

export interface TemplateTeamMember {
  id?: string;
  name: string;
  role: string;
  photo?: string;
  photo_url?: string;
  languages?: string[];
}

export interface TemplateService {
  id?: string;
  title: string;
  description?: string;
}

export interface TemplateZone {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  image_url?: string;
  property_count?: number;
}

export interface TemplateData {
  agent: TemplateAgent;
  properties: TemplateProperty[];
  hero?: TemplateHero;
  testimonials?: TemplateTestimonial[];
  team?: TemplateTeamMember[];
  services?: TemplateService[];
  zones?: TemplateZone[];
}

export function formatPrice(p: number): string {
  if (p < 100) return p + ' EUR/noche';
  if (p < 5000) return new Intl.NumberFormat('es-ES').format(p) + ' EUR/mes';
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p);
}

export const TEMPLATE_LIST = [
  { id: 'luxury', name: 'Luxury', desc: 'Exclusividad y elegancia. Fondo oscuro, dorado, serif.', color: '#C9A84C', bg: '#0A0A0A', persona: 'Victoria Laurent' },
  { id: 'mediterranean', name: 'Mediterranean', desc: 'C\u00e1lido y acogedor. Terracota, crema, familias.', color: '#C4652E', bg: '#FBF7F2', persona: 'Antonio Reyes' },
  { id: 'corporate', name: 'Corporate', desc: 'Profesional y s\u00f3lido. Azul, blanco, equipo.', color: '#0B2545', bg: '#FFFFFF', persona: 'Tenerife Prime Real Estate' },
  { id: 'boutique', name: 'Boutique', desc: 'Editorial y selectivo. Rose, sage, whitespace.', color: '#C08B7F', bg: '#FAF8F5', persona: 'Maison Tenerife' },
  { id: 'classic', name: 'Classic', desc: 'Veterano y premiado. Marr\u00f3n, crema, serif.', color: '#8B6F47', bg: '#FBF7F2', persona: 'Roberto Fern\u00e1ndez' },
  { id: 'data', name: 'Data-Driven', desc: 'Tecnol\u00f3gico, dashboards. Slate, cyan, datos.', color: '#06B6D4', bg: '#0F172A', persona: 'DataHomes Tenerife' },
];