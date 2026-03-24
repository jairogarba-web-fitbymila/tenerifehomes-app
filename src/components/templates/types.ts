export interface TemplateAgent {
  id: string; slug: string; business_name: string; business_type: string;
  template: string; phone: string | null; email: string | null;
  whatsapp: string | null; city: string | null; languages: string[] | null;
  bio: string | null; bio_photo_url: string | null; quote: string | null;
  stats: Record<string, number> | null; logo_url: string | null; plan: string;
}
export interface TemplateProperty {
  id: string; title: string; slug: string; description: string | null;
  property_type: string; operation_type: 'sale' | 'rent_long' | 'rent_vacation';
  price: number | null; price_per_night: number | null;
  bedrooms: number | null; bathrooms: number | null; size_m2: number | null;
  location: string | null; images: string[] | null; badge: string | null;
  is_featured: boolean; is_active: boolean;
}
export interface TemplateHero { headline: string | null; subtitle: string | null; cta_text: string | null; background_image_url: string | null; overlay_opacity: number; }
export interface TemplateTestimonial { id: string; quote: string; client_name: string; client_location: string | null; rating: number | null; }
export interface TemplateTeamMember { id: string; name: string; role: string; photo_url: string | null; bio: string | null; languages: string[] | null; }
export interface TemplateService { id: string; title: string; description: string | null; icon: string | null; }
export interface TemplateZone { id: string; name: string; description: string | null; image_url: string | null; property_count: number; }
export interface TemplateData { agent: TemplateAgent; properties: TemplateProperty[]; hero: TemplateHero | null; testimonials: TemplateTestimonial[]; team: TemplateTeamMember[]; services: TemplateService[]; zones: TemplateZone[]; }
export function formatPrice(p: number): string { return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p) }
export const TEMPLATE_LIST = [
  { id: 'luxury', name: 'Luxury', desc: 'Exclusividad y elegancia. Fondo oscuro, dorado, serif.', color: '#C9A84C', bg: '#0A0A0A', persona: 'Victoria Laurent' },
  { id: 'mediterranean', name: 'Mediterranean', desc: 'C\u00e1lido y acogedor. Terracota, crema, familias.', color: '#C4652E', bg: '#FBF7F2', persona: 'Antonio Reyes' },
  { id: 'corporate', name: 'Corporate', desc: 'Profesional y s\u00f3lido. Azul, blanco, equipo.', color: '#0B2545', bg: '#FFFFFF', persona: 'Tenerife Prime Real Estate' },
  { id: 'boutique', name: 'Boutique', desc: 'Editorial y selectivo. Rose, sage, whitespace.', color: '#C08B7F', bg: '#FAF8F5', persona: 'Maison Tenerife' },
  { id: 'classic', name: 'Classic', desc: 'Veterano y premiado. Marr\u00f3n, crema, serif.', color: '#8B6F47', bg: '#FBF7F2', persona: 'Roberto Fern\u00e1ndez' },
  { id: 'network', name: 'Network', desc: 'Multi-oficina, volumen. Navy, coral, buscador.', color: '#E8614D', bg: '#FFFFFF', persona: 'Island Properties Group' },
  { id: 'data', name: 'Data-Driven', desc: 'Tecnol\u00f3gico, dashboards. Slate, cyan, datos.', color: '#06B6D4', bg: '#0F172A', persona: 'DataHomes Tenerife' },
]