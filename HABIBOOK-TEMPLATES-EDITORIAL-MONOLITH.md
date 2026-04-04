# HABIBOOK — Implementar 7 Plantillas Nuevas (Editorial Family + Monolith)

## Resumen

Implementar 7 nuevas plantillas de sitio web de agente para HabiBook. Son 2 familias visuales:
- **Editorial (6 variantes):** Noto Serif + Manrope, paleta navy #000d22 + gold #e9c176, fondo claro
- **Monolith (1 variante):** Lexend + Space Grotesk + Public Sans, paleta negra #131313 + lima #CAF300, brutalista

Cada plantilla DEBE incluir estas secciones estándar (además de las específicas):
- Navegación con anclas funcionales + menú móvil
- Hero con imagen de fondo
- Propiedades (venta + alquiler vacacional + alquiler largo plazo)
- Sección del agente (About) con foto, bio, stats, idiomas
- Servicios (compraventa, valoración, gestión integral, asesoría legal)
- Testimonios (3 idiomas: español, alemán, francés)
- Zonas de operación con mapa embebido (Google Maps embed)
- Redes sociales (Instagram, Facebook, LinkedIn, YouTube)
- Contacto: formulario, teléfono, email, WhatsApp directo, mapa de ubicación
- Footer completo con links legales, redes, contacto

---

## PASO 1: Actualizar types.ts

Añadir las 7 nuevas plantillas a TEMPLATE_LIST:

```typescript
// Después de la entrada de 'data', añadir:
{ id: 'editorial-dark', name: 'Editorial Dark', desc: 'Scroll-snap inmersivo. Navy + dorado, serif editorial, dramático.', color: '#e9c176', bg: '#000d22', persona: 'Julián Vega' },
{ id: 'editorial-light', name: 'Editorial Light', desc: 'Bento grid editorial. Fondo claro, tipografía de revista.', color: '#000d22', bg: '#f8f9fa', persona: 'Julián Vega' },
{ id: 'editorial-agent', name: 'Editorial Agent', desc: 'Centrado en el agente. Hero con retrato, firma, formulario.', color: '#e9c176', bg: '#f8f9fa', persona: 'Julián Vega' },
{ id: 'editorial-team', name: 'Editorial Team', desc: 'Multi-agente. Galería de equipo, propiedades curadas por experto.', color: '#e9c176', bg: '#f8f9fa', persona: 'Costa Realty' },
{ id: 'editorial-catalog', name: 'Editorial Catalog', desc: 'Marketplace con filtros por tipo. Bottom nav móvil, catálogo.', color: '#000d22', bg: '#f8f9fa', persona: 'Costa Properties' },
{ id: 'editorial-fullservice', name: 'Editorial Full', desc: 'Multi-sección: vacacional + venta + alquiler. Web completa.', color: '#e9c176', bg: '#f8f9fa', persona: 'Costa Living' },
{ id: 'monolith', name: 'Monolith', desc: 'Brutalista dark. Lima #CAF300, Lexend, sin redondeos. Ultra-premium.', color: '#CAF300', bg: '#131313', persona: 'MONOLITH Tenerife' },
```

---

## PASO 2: Actualizar demo-data.ts

Añadir 7 demos nuevos. Las 6 variantes Editorial comparten la misma paleta y datos base con variaciones. Monolith tiene personalidad propia.

### Datos compartidos para la familia Editorial

```typescript
// ═══ EDITORIAL SHARED DATA ═══

const editorialTestimonials = [
  { author: 'James & Catherine Palmer', text: 'An impeccable service from start to finish. Julian found us our dream villa in Costa Adeje within two weeks.', rating: 5 },
  { author: 'Familie Hoffmann', text: 'Erstklassiger Service. Die gesamte Abwicklung war professionell und transparent. Absolut empfehlenswert!', rating: 5 },
  { author: 'Jean-Pierre et Marie Leclerc', text: 'Un service d\'exception. Discrétion, professionnalisme et une connaissance parfaite du marché de Tenerife.', rating: 5 },
];

const editorialServices = [
  { title: 'Compraventa Premium', description: 'Asesoramiento integral en compra y venta de propiedades exclusivas en Tenerife Sur' },
  { title: 'Valoración de Mercado', description: 'Análisis profesional con datos de mercado actualizados para establecer el precio óptimo' },
  { title: 'Asesoría Legal Internacional', description: 'Red de abogados especializados en compradores extranjeros, NIE, impuestos y contratos' },
  { title: 'Gestión de Alquiler Vacacional', description: 'Servicio completo de gestión: reservas, limpieza, mantenimiento y atención al huésped' },
  { title: 'Home Staging', description: 'Preparación profesional de tu propiedad para maximizar su atractivo y valor de venta' },
  { title: 'Trámites y Documentación', description: 'Gestión completa de documentación: escrituras, registro, certificado energético' },
];

const editorialZones = [
  { name: 'Costa Adeje', description: 'La zona más exclusiva del sur de Tenerife. Villas de lujo, resorts 5 estrellas y playas premium.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', property_count: 45 },
  { name: 'Los Cristianos', description: 'Centro turístico consolidado con excelente infraestructura. Apartamentos y locales comerciales.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600', property_count: 32 },
  { name: 'Guía de Isora', description: 'Naturaleza y tranquilidad. Abama Resort, fincas exclusivas y vistas espectaculares al océano.', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600', property_count: 18 },
  { name: 'El Médano', description: 'Ambiente deportivo y natural. Surfistas, kitesurf y la playa más larga de Tenerife.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', property_count: 22 },
  { name: 'Golf del Sur', description: 'Comunidad internacional. Campos de golf, inversión extranjera y alta rentabilidad.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600', property_count: 28 },
];
```

### Editorial Dark Demo

```typescript
const editorialDarkAgent: TemplateAgent = {
  full_name: 'Julián Vega',
  business_name: 'Julián Vega — Real Estate',
  slug: 'julian-vega-dark',
  template: 'editorial-dark',
  bio: 'Más de 15 años especializándome en propiedades exclusivas del sur de Tenerife. Mi enfoque combina conocimiento profundo del mercado local con estándares internacionales de servicio.',
  phone: '+34 922 123 456',
  email: 'julian@julianvega.com',
  whatsapp: '+34622123456',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés'],
  experience_years: 15,
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife Sur',
  stats: { sales: 320, years: 15, clients: 450 },
  quote: 'Cada propiedad cuenta una historia. Mi trabajo es encontrar la que se ajusta a la tuya.',
};

const editorialDarkProperties: TemplateProperty[] = [
  { title: 'Villa Alisios', price: 1850000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 380, operation_type: 'sale', badge: 'exclusive', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'Penthouse Las Américas', price: 920000, location: 'Playa de las Américas', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', badge: 'new', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'Residencial Abama', price: 2400000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 450, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Suite El Duque', price: 150, location: 'El Duque, Costa Adeje', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { title: 'Chalet San Eugenio', price: 680000, location: 'San Eugenio Alto', bedrooms: 3, bathrooms: 2, area_m2: 220, operation_type: 'sale', badge: 'reduced', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'Apartamento Fañabé', price: 1200, location: 'Fañabé, Adeje', bedrooms: 2, bathrooms: 1, area_m2: 85, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'] },
];

const editorialDarkHero: TemplateHero = {
  headline: 'Experiencia en Cada Detalle',
  subtitle: 'Propiedades exclusivas en el sur de Tenerife — conocimiento local, estándares internacionales.',
  background_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
  cta_text: 'Ver Propiedades',
};
```

### Editorial Light Demo
Mismos datos base que Dark (mismo agente Julián Vega, slug distinto: 'julian-vega-light', template: 'editorial-light').

### Editorial Agent Demo
Mismo agente base, slug: 'julian-vega-agent', template: 'editorial-agent'. Incluir bio_photo_url para la sección de retrato.

### Editorial Team Demo

```typescript
const editorialTeamAgent: TemplateAgent = {
  full_name: 'Costa Realty',
  business_name: 'Costa Realty — Equipo de Expertos',
  slug: 'costa-realty',
  template: 'editorial-team',
  bio: 'Tres perfiles complementarios que cubren compraventa, alquileres vacacionales e inversión inmobiliaria en el sur de Tenerife.',
  phone: '+34 922 123 456',
  email: 'info@costarealty.es',
  whatsapp: '+34622123456',
  languages: ['Español', 'Inglés', 'Alemán', 'Francés', 'Italiano'],
  experience_years: 15,
  photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
  location: 'Costa Adeje, Tenerife',
};

const editorialTeamMembers: TemplateTeamMember[] = [
  { name: 'Julián Vega', role: 'Director Comercial', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', languages: ['Español', 'Inglés'] },
  { name: 'Elena Martín', role: 'Directora de Alquileres', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', languages: ['Español', 'Francés', 'Italiano'] },
  { name: 'Marco Torres', role: 'Asesor de Inversiones', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', languages: ['Español', 'Alemán', 'Inglés'] },
];
```

### Editorial Catalog Demo
Mismo agente base slug: 'costa-properties', template: 'editorial-catalog'. 6+ propiedades con variedad de operation_type.

### Editorial Full-Service Demo
Agente slug: 'costa-living', template: 'editorial-fullservice'. 10+ propiedades: 4 rent_vacation, 3 sale, 4 rent_long.

### Monolith Demo

```typescript
const monolithAgent: TemplateAgent = {
  full_name: 'Elara Vance',
  business_name: 'MONOLITH',
  slug: 'monolith',
  template: 'monolith',
  bio: 'Propiedades de arquitectura contemporánea en Tenerife Sur. No son simples alquileres — son declaraciones de diseño.',
  phone: '+34 922 123 456',
  email: 'studio@monolith.es',
  whatsapp: '+34622123456',
  languages: ['Español', 'Inglés', 'Alemán'],
  experience_years: 12,
  photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  location: 'Tenerife Sur',
  quote: 'El minimalismo no es ausencia — es la honestidad del material y la pureza de la forma.',
};

const monolithProperties: TemplateProperty[] = [
  { title: 'VILLA ALISIOS', price: 1850000, location: 'Costa Adeje', bedrooms: 4, bathrooms: 3, area_m2: 380, operation_type: 'sale', badge: 'exclusive', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'] },
  { title: 'ABAMA ROYAL', price: 2950000, location: 'Guía de Isora', bedrooms: 5, bathrooms: 4, area_m2: 450, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'CASA BASALTO', price: 280, location: 'La Caleta', bedrooms: 3, bathrooms: 2, area_m2: 200, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'] },
  { title: 'PENTHOUSE HORIZON', price: 150, location: 'Playa de las Américas', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'] },
  { title: 'GEOMETRÍA VERDE', price: 890000, location: 'Golf del Sur', bedrooms: 3, bathrooms: 2, area_m2: 210, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'LOFT INDUSTRIAL', price: 1600, location: 'Granadilla', bedrooms: 1, bathrooms: 1, area_m2: 95, operation_type: 'rent_long', images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'] },
];

const monolithHero: TemplateHero = {
  headline: 'ESCAPA DE LO ORDINARIO.',
  subtitle: 'Propiedades de arquitectura contemporánea en Tenerife Sur.',
  background_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920',
  cta_text: 'VER COLECCIÓN',
};
```

### Registrar demos en DEMO_DATA

```typescript
export const DEMO_DATA: Record<string, TemplateData> = {
  // ... existentes ...
  'editorial-dark': buildDemo(editorialDarkAgent, editorialDarkProperties, editorialDarkHero),
  'editorial-light': buildDemo(editorialLightAgent, editorialLightProperties, editorialLightHero),
  'editorial-agent': buildDemo(editorialAgentAgent, editorialAgentProperties, editorialAgentHero),
  'editorial-team': buildDemo(editorialTeamAgent, editorialTeamProperties, editorialTeamHero, editorialTeamMembers),
  'editorial-catalog': buildDemo(editorialCatalogAgent, editorialCatalogProperties, editorialCatalogHero),
  'editorial-fullservice': buildDemo(editorialFullAgent, editorialFullProperties, editorialFullHero),
  'monolith': buildDemo(monolithAgent, monolithProperties, monolithHero),
};
```

---

## PASO 3: Actualizar translations.ts

Añadir claves nuevas para las familias editorial y monolith. Van EN TODOS los 10 idiomas.

### Claves nuevas (prefijo editorial.* y monolith.*):

```typescript
// ═══ EDITORIAL KEYS ═══
'editorial.est': { es: 'Desde 2008', en: 'Est. 2008', de: 'Seit 2008', fr: 'Depuis 2008', it: 'Dal 2008', pt: 'Desde 2008' },
'editorial.expertise': { es: 'Experiencia en Cada Detalle', en: 'Expertise in Every Detail', de: 'Kompetenz in jedem Detail', fr: 'L\'Expertise dans Chaque Détail', it: 'Competenza in Ogni Dettaglio', pt: 'Experiência em Cada Detalhe' },
'editorial.curated_selection': { es: 'Selección Exclusiva', en: 'The Curated Selection', de: 'Kuratierte Auswahl', fr: 'Sélection Exclusive', it: 'Selezione Esclusiva', pt: 'Seleção Exclusiva' },
'editorial.curated_by': { es: 'Selección de', en: 'Curated by', de: 'Kuratiert von', fr: 'Sélectionné par', it: 'Selezionato da', pt: 'Seleção de' },
'editorial.view_portfolio': { es: 'Ver Portfolio', en: 'View Portfolio', de: 'Portfolio ansehen', fr: 'Voir le Portfolio', it: 'Vedi Portfolio', pt: 'Ver Portfólio' },
'editorial.book_consultation': { es: 'Reservar Consulta', en: 'Book a Consultation', de: 'Beratung buchen', fr: 'Réserver une Consultation', it: 'Prenota una Consulenza', pt: 'Reservar Consulta' },
'editorial.work_with_best': { es: 'Trabaja con los Mejores', en: 'Work with the Best', de: 'Arbeiten Sie mit den Besten', fr: 'Travaillez avec les Meilleurs', it: 'Lavora con i Migliori', pt: 'Trabalhe com os Melhores' },
'editorial.the_collection': { es: 'Propiedades', en: 'The Collection', de: 'Kollektion', fr: 'La Collection', it: 'La Collezione', pt: 'A Coleção' },
'editorial.our_experts': { es: 'Nuestro Equipo', en: 'Our Experts', de: 'Unsere Experten', fr: 'Nos Experts', it: 'I Nostri Esperti', pt: 'Nossos Especialistas' },
'editorial.inner_circle': { es: 'Equipo Experto', en: 'The Inner Circle', de: 'Das Expertenteam', fr: 'Le Cercle Intérieur', it: 'Il Team di Esperti', pt: 'Equipe de Especialistas' },
'editorial.meet_specialists': { es: 'Nuestros Especialistas', en: 'Meet Our Specialists', de: 'Unsere Spezialisten', fr: 'Nos Spécialistes', it: 'I Nostri Specialisti', pt: 'Nossos Especialistas' },
'editorial.featured': { es: 'Destacada', en: 'Featured', de: 'Empfohlen', fr: 'En vedette', it: 'In evidenza', pt: 'Destaque' },
'editorial.new_listing': { es: 'Nuevo', en: 'New listing', de: 'Neu', fr: 'Nouveau', it: 'Nuovo', pt: 'Novo' },
'editorial.request_visit': { es: 'Solicitar Visita', en: 'Book Viewing', de: 'Besichtigung buchen', fr: 'Réserver une visite', it: 'Prenota visita', pt: 'Agendar visita' },
'editorial.all_types': { es: 'Todas', en: 'All', de: 'Alle', fr: 'Toutes', it: 'Tutte', pt: 'Todas' },
'editorial.vacation_rentals': { es: 'Alquiler Vacacional', en: 'Vacation Rentals', de: 'Ferienvermietung', fr: 'Location de Vacances', it: 'Affitti Vacanze', pt: 'Aluguel de Temporada' },
'editorial.long_term': { es: 'Alquiler de Larga Estancia', en: 'Long-Term Rentals', de: 'Langzeitmiete', fr: 'Location Longue Durée', it: 'Affitti a Lungo Termine', pt: 'Aluguel de Longa Estadia' },
'editorial.for_sale': { es: 'Propiedades en Venta', en: 'Properties for Sale', de: 'Immobilien zum Verkauf', fr: 'Propriétés à Vendre', it: 'Immobili in Vendita', pt: 'Imóveis à Venda' },
'editorial.investment': { es: 'Inversión', en: 'Investment', de: 'Investition', fr: 'Investissement', it: 'Investimento', pt: 'Investimento' },
'editorial.per_night': { es: '/noche', en: '/night', de: '/Nacht', fr: '/nuit', it: '/notte', pt: '/noite' },
'editorial.per_month': { es: '/mes', en: '/month', de: '/Monat', fr: '/mois', it: '/mese', pt: '/mês' },
'editorial.beyond_transaction': { es: 'Más que una Transacción', en: 'Beyond the Transaction', de: 'Mehr als eine Transaktion', fr: 'Au-delà de la Transaction', it: 'Oltre la Transazione', pt: 'Além da Transação' },
'editorial.market_analysis': { es: 'Valoración de Mercado', en: 'Market Analysis', de: 'Marktanalyse', fr: 'Analyse de Marché', it: 'Analisi di Mercato', pt: 'Análise de Mercado' },
'editorial.staging': { es: 'Home Staging', en: 'Staging & Prep', de: 'Home Staging', fr: 'Home Staging', it: 'Home Staging', pt: 'Home Staging' },
'editorial.legal': { es: 'Asesoría Legal', en: 'Legal Advisory', de: 'Rechtsberatung', fr: 'Conseil Juridique', it: 'Consulenza Legale', pt: 'Assessoria Jurídica' },
'editorial.whatsapp_direct': { es: 'WhatsApp Directo', en: 'WhatsApp Direct', de: 'WhatsApp Direkt', fr: 'WhatsApp Direct', it: 'WhatsApp Diretto', pt: 'WhatsApp Direto' },

// ═══ MONOLITH KEYS ═══
'monolith.escape': { es: 'ESCAPA DE LO ORDINARIO.', en: 'ESCAPE THE ORDINARY.', de: 'ENTFLIEHE DEM GEWÖHNLICHEN.', fr: 'ÉCHAPPEZ À L\'ORDINAIRE.', it: 'FUGGI DALL\'ORDINARIO.', pt: 'FUJA DO ORDINÁRIO.' },
'monolith.view_collection': { es: 'VER COLECCIÓN', en: 'VIEW COLLECTION', de: 'KOLLEKTION ANSEHEN', fr: 'VOIR LA COLLECTION', it: 'VEDI COLLEZIONE', pt: 'VER COLEÇÃO' },
'monolith.the_visionary': { es: 'EL VISIONARIO', en: 'THE VISIONARY', de: 'DER VISIONÄR', fr: 'LE VISIONNAIRE', it: 'IL VISIONARIO', pt: 'O VISIONÁRIO' },
'monolith.architectural_curator': { es: 'El Curador Arquitectónico.', en: 'The Architectural Curator.', de: 'Der Architektur-Kurator.', fr: 'Le Curateur Architectural.', it: 'Il Curatore Architettonico.', pt: 'O Curador Arquitetônico.' },
'monolith.the_portfolio': { es: 'EL PORTFOLIO', en: 'THE PORTFOLIO', de: 'DAS PORTFOLIO', fr: 'LE PORTFOLIO', it: 'IL PORTFOLIO', pt: 'O PORTFÓLIO' },
'monolith.beyond_staying': { es: 'Más que un Alojamiento.', en: 'Services Beyond Staying.', de: 'Mehr als nur Unterkunft.', fr: 'Au-delà de l\'Hébergement.', it: 'Oltre il Soggiorno.', pt: 'Além da Hospedagem.' },
'monolith.private_transit': { es: 'Transfer Privado', en: 'Private Transit', de: 'Privater Transfer', fr: 'Transfert Privé', it: 'Transfer Privato', pt: 'Transfer Privado' },
'monolith.in_residence_chef': { es: 'Chef Privado', en: 'In-Residence Chef', de: 'Privatkoch', fr: 'Chef à Domicile', it: 'Chef Privato', pt: 'Chef Particular' },
'monolith.site_curator': { es: 'Curador 24/7', en: 'Site Curator', de: 'Kurator 24/7', fr: 'Curateur 24/7', it: 'Curatore 24/7', pt: 'Curador 24/7' },
'monolith.legal_nie': { es: 'Legal + NIE', en: 'Legal + NIE', de: 'Recht + NIE', fr: 'Juridique + NIE', it: 'Legale + NIE', pt: 'Legal + NIE' },
```

---

## PASO 4: Implementar los 7 componentes de plantilla

Cada plantilla es una función React que recibe `TemplateProps`. Se añade a TemplateRenderer.tsx.

### Reglas COMUNES a todas las plantillas:

1. **Toda sección traducible** usando `L(key)` para UI y `tc(translations, table, id, field, original)` para contenido dinámico.

2. **Colores como constante `C`** al inicio de cada función:
```typescript
const C = { primary: '#000d22', gold: '#e9c176', ... };
```

3. **Propiedades agrupadas** por operation_type:
```typescript
const sales = data.properties.filter(p => p.operation_type === 'sale');
const vacational = data.properties.filter(p => p.operation_type === 'rent_vacation');
const longTerm = data.properties.filter(p => p.operation_type === 'rent_long');
```

4. **formatPrice()** de types.ts para precios (ya maneja EUR/noche, EUR/mes, EUR venta).

5. **Google Maps embed** en sección de contacto:
```tsx
<iframe
  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=${encodeURIComponent(data.agent.location || 'Costa Adeje, Tenerife')}`}
  width="100%" height="300" style={{border:0}} loading="lazy"
  allowFullScreen
/>
```
NOTA: Si no hay API key de Maps, usar un placeholder con link a Google Maps:
```tsx
<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.agent.location || 'Costa Adeje, Tenerife')}`} target="_blank" rel="noopener">
  Ver en Google Maps →
</a>
```

6. **Redes sociales** en footer (usar iconos Lucide: Instagram, Facebook, Linkedin, Youtube):
```tsx
<div className="flex gap-4">
  <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
  <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
  <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
  <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
</div>
```

7. **WhatsApp directo** con botón flotante o en contacto:
```tsx
{data.agent.whatsapp && (
  <a href={`https://wa.me/${data.agent.whatsapp.replace(/\D/g,'')}`} target="_blank">
    WhatsApp
  </a>
)}
```

8. **Formulario de contacto** con campos: nombre, email, teléfono (opcional), tipo de interés (select: comprar/alquilar/invertir/otro), mensaje. No necesita ser funcional — es un form visual.

9. **Badges de propiedades** traducidas:
```typescript
const badgeLabels: Record<string, string> = {
  exclusive: L('properties.exclusive'),
  new: L('properties.new'),
  reduced: L('properties.reduced'),
};
```

10. **Responsive**: mobile-first. Usar clases md: y lg: de Tailwind. Menú hamburguesa en móvil con useState.

---

### 4A. EDITORIAL DARK — Scroll-snap inmersivo

**ID:** `editorial-dark`
**Font:** Noto Serif (headlines) + Manrope (body/labels) — usar font-serif y font-sans de Tailwind (asegurar que estén en el <head> del layout)
**Paleta C:**
```typescript
const C = {
  bg: '#000d22', text: '#ffffff', gold: '#e9c176', goldLight: '#ffdea5',
  surface: '#001a3d', surfaceLight: '#f8f9fa', secondary: '#718bb7',
  outline: '#c4c6cf',
};
```

**Estructura (6 secciones full-screen con scroll-snap):**
1. **Hero** — h-screen, imagen de fondo, gradiente oscuro, headline grande (text-7xl md:text-9xl), CTA dorado
2. **Propiedades** — grid 2col, cards con imagen + overlay + precio/datos, badges
3. **About** — split layout (foto izq + bio derecha), stats, idiomas, cita del agente
4. **Servicios** — grid 3col con iconos Lucide
5. **Zonas + Mapa** — cards de zona + Google Maps embed
6. **Contacto** — formulario + redes sociales + teléfono + WhatsApp + mapa

**CSS clave:**
```css
scroll-snap-type: y mandatory;
section { scroll-snap-align: start; min-height: 100vh; }
```

**Navigation dots** en lateral derecho (posición fija) que indican la sección activa.

### 4B. EDITORIAL LIGHT — Bento grid editorial

**ID:** `editorial-light`
**Paleta C:** Misma familia pero bg: '#f8f9fa', text: '#000d22'
**Estructura:**
1. Hero con barra de progreso de scroll
2. Propiedades en bento grid asimétrico (8+4 / 4+8 cols)
3. About con foto editorial enmarcada
4. Servicios + zonas
5. Testimonios
6. Contacto + mapa + redes
**Mobile bottom nav** con iconos (Home, Properties, Agent, Contact)

### 4C. EDITORIAL AGENT — Centrado en agente

**ID:** `editorial-agent`
**Estructura:**
1. Hero con foto del agente y gradiente
2. About — retrato grande + badge "15+ años" + firma cursiva + bio
3. Propiedades en bento grid con CTA card
4. Servicios con iconos Material
5. Testimonios con estrellas
6. Formulario de contacto completo (nombre, email, tipo interés, mensaje)
7. Footer con mapa + redes

### 4D. EDITORIAL TEAM — Multi-agente

**ID:** `editorial-team`
**Necesita:** `data.team` con 3+ miembros
**Estructura:**
1. Hero con gradiente → blanco
2. "Nuestros Especialistas" — grid 3col, fotos greyscale→color hover, card central con offset (translate-y-12), roles y especialidades
3. "Selección Exclusiva" — propiedades con badge "Selección de [Agente]" usando team member names. Grid asimétrico (7+5 offset, luego 8 centrado)
4. CTA oscuro con textura
5. Servicios
6. Zonas + mapa
7. Contacto
8. Footer 4 columnas con equipo, servicios, contacto, redes

### 4E. EDITORIAL CATALOG — Marketplace con filtros

**ID:** `editorial-catalog`
**Estructura:**
1. Hero split (50/50 texto + imagen)
2. Category chips scrolleables con filtro funcional (Todas/Venta/Alquiler/Vacacional/Inversión) — useState para filtrar
3. Property grid 3col con cards: badge tipo, beds/baths/m², precio contextual, botón CTA
4. About del agente (1/3 foto + 2/3 bio)
5. Servicios centrados con iconos
6. Contacto CTA
7. **Mobile bottom nav** (Venta/Alquiler/Vacacional/Agente)
**Lógica JS:** filtro por operation_type + "inversión" (sale con badge investment)

### 4F. EDITORIAL FULLSERVICE — Multi-sección completa

**ID:** `editorial-fullservice`
**Estructura:**
1. Hero cinemático con gradiente LATERAL (from-primary/60 to-transparent)
2. **Sección Vacacional** — bento grid: 1 featured grande (8col) + 1 tall (4col) + 2 iguales con amenities
3. **Sección Venta** — fondo OSCURO (primary-container), cards portrait aspect-[3/4], datos tipo catálogo subasta
4. **Sección Alquiler Largo** — grid 4col, fotos cuadradas greyscale→color hover, formato compacto
5. About del agente con bordes decorativos L-shape
6. Contacto
7. Footer

### 4G. MONOLITH — Brutalista dark

**ID:** `monolith`
**Fonts:** Lexend (headlines 700-900), Space Grotesk (labels), Public Sans (body)
**Paleta C:**
```typescript
const C = {
  bg: '#131313', surface: '#1c1b1b', surfaceHigh: '#2a2a2a',
  text: '#e5e2e1', lime: '#CAF300', limeDim: '#B0D500',
  secondary: '#c6c6c7', zinc: '#71717a',
};
```
**border-radius: 0** en TODO. Sin redondeos.

**Estructura:**
1. Hero full-screen con tipografía masiva (text-[12vw] md:text-[10vw]), foto greyscale, gradiente vertical
2. Curator — layout 5+7 col asimétrico, foto greyscale contrast-125, badge lime con icono arquitectura
3. Portfolio — cards con overlay gradiente, flecha en hover, precio en lima. Grid: 3col portrait + 2col landscape
4. Services — 4 columnas con iconos lima
5. Footer FULL SCREEN con links tipográficos gigantes (text-6xl), input email, watermark gigante del nombre

**Fonts import:** Necesario añadir al layout o al componente:
```tsx
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@700;800;900&family=Public+Sans:ital,wght@0,300;0,400;0,600;1,300&family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

---

## PASO 5: Registrar en TEMPLATE_MAP

```typescript
const TEMPLATE_MAP: Record<string, React.FC<TemplateProps>> = {
  luxury: LuxuryTemplate,
  mediterranean: MediterraneanTemplate,
  corporate: CorporateTemplate,
  boutique: BoutiqueTemplate,
  classic: ClassicTemplate,
  data: DataTemplate,
  'editorial-dark': EditorialDarkTemplate,
  'editorial-light': EditorialLightTemplate,
  'editorial-agent': EditorialAgentTemplate,
  'editorial-team': EditorialTeamTemplate,
  'editorial-catalog': EditorialCatalogTemplate,
  'editorial-fullservice': EditorialFullServiceTemplate,
  'monolith': MonolithTemplate,
};
```

---

## PASO 6: Actualizar enum en Supabase

```sql
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-dark';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-light';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-agent';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-team';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-catalog';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-fullservice';
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'monolith';
```

---

## PASO 7: Fonts en el layout global

En `src/app/layout.tsx`, asegurar que están TODAS las fuentes necesarias:

```tsx
// Fuentes existentes (para templates 1-6):
// Georgia, Garamond, DM Serif Display, Inter, Playfair Display

// Fuentes nuevas necesarias:
// Noto Serif + Manrope (familia Editorial) — via Google Fonts
// Lexend + Space Grotesk + Public Sans (Monolith) — via Google Fonts
```

Añadir al <head> o usar next/font/google:
```tsx
import { Noto_Serif, Manrope, Lexend, Space_Grotesk, Public_Sans } from 'next/font/google';
```

---

## PASO 8: Secciones estándar que TODAS las plantillas deben tener

### 8.1 Mapa de ubicación
Cada plantilla incluye un iframe de Google Maps o un link a Google Maps con la ubicación del agente. Usar `data.agent.location` para la query.

### 8.2 Redes sociales
Footer con iconos de Instagram, Facebook, LinkedIn, YouTube. Los links serán "#" por defecto — el agente los personaliza desde el admin.

### 8.3 Contacto completo
- Teléfono clickeable: `<a href="tel:${data.agent.phone}">`
- Email clickeable: `<a href="mailto:${data.agent.email}">`
- WhatsApp: `<a href="https://wa.me/${whatsapp}">`
- Formulario: nombre, email, select tipo, mensaje, botón enviar

### 8.4 Idiomas del agente
Mostrar banderas o texto de idiomas que habla el agente (`data.agent.languages`).

### 8.5 Badges de propiedades
Traducir badges (exclusive, new, reduced, opportunity, luxury, sold, reserved) según el idioma.

### 8.6 Tipos de operación diferenciados
- Sale: precio en EUR con formatPrice()
- Rent vacation: precio + "/noche"
- Rent long: precio + "/mes"
Badges de color diferente por tipo: gold=venta, navy=alquiler, amber=vacacional.

### 8.7 Zonas de operación
Grid de cards con imagen, nombre, descripción y property_count. Usar `data.zones`.

### 8.8 Testimonios
3 testimonios con nombre, texto, rating (estrellas). Preparados para 3 idiomas.

---

## ARCHIVOS HTML DE REFERENCIA

Los HTMLs de prueba están en la raíz del proyecto para referencia visual:

| Archivo | Template |
|---------|----------|
| template-editorial-estate.html | editorial-dark |
| template-editorial-light.html | editorial-light |
| template-editorial-agent.html | editorial-agent |
| template-editorial-team.html | editorial-team |
| template-editorial-catalog.html | editorial-catalog |
| template-editorial-fullservice.html | editorial-fullservice |
| template-monolith-brutalist.html | monolith |

Consulta estos HTMLs para reproducir fielmente los layouts, animaciones, espaciados y efectos de cada plantilla.

---

## ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. types.ts (añadir TEMPLATE_LIST) — 2 min
2. translations.ts (claves nuevas) — 10 min
3. demo-data.ts (7 demos completos) — 15 min
4. TemplateRenderer.tsx — implementar las 7 plantillas una por una:
   - editorial-dark (más compleja: scroll-snap) — 30 min
   - editorial-light — 25 min
   - editorial-agent — 25 min
   - editorial-team — 25 min
   - editorial-catalog (filtro JS) — 30 min
   - editorial-fullservice (3 secciones propiedades) — 30 min
   - monolith (fonts y estilo totalmente distinto) — 30 min
5. TEMPLATE_MAP registration — 1 min
6. SQL enum update — 1 min
7. Fonts en layout.tsx — 5 min
8. Build & test — 10 min

**Total estimado:** ~3.5 horas de implementación

---

## NOTAS IMPORTANTES

- NO borrar las 6 plantillas existentes. Las 7 nuevas se AÑADEN.
- Los componentes pueden ser largos (200-400 líneas cada uno). Considerar crear archivos separados en `src/components/templates/` para cada plantilla si TemplateRenderer.tsx se hace demasiado grande.
- La familia Editorial comparte MUCHA estructura. Considerar crear helpers compartidos (EditorialNav, EditorialFooter, EditorialPropertyCard) para reutilizar.
- Monolith es completamente independiente — NO comparte nada con Editorial ni con las plantillas existentes.
- Verificar que el build pasa sin errores antes de hacer commit.
- Todas las imágenes son de Unsplash (gratuitas, sin atribución necesaria).
