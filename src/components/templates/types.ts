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
}

export interface TemplateProperty {
  title: string;
  price: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  operation_type: 'sale' | 'rent_long' | 'rent_vacation';
  images?: string[];
}

export interface TemplateHero {
  title?: string;
  subtitle?: string;
  image?: string;
}

export interface TemplateTestimonial {
  author: string;
  text: string;
  rating?: number;
}

export interface TemplateTeamMember {
  name: string;
  role: string;
  photo?: string;
}

export interface TemplateService {
  title: string;
  description?: string;
}

export interface TemplateZone {
  name: string;
  description?: string;
  image?: string;
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
  { id: 'network', name: 'Network', desc: 'Multi-oficina, volumen. Navy, coral, buscador.', color: '#E8614D', bg: '#FFFFFF', persona: 'Island Properties Group' },
  { id: 'data', name: 'Data-Driven', desc: 'Tecnol\u00f3gico, dashboards. Slate, cyan, datos.', color: '#06B6D4', bg: '#0F172A', persona: 'DataHomes Tenerife' },
];