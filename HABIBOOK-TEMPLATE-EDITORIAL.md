# INSTRUCCIONES: Implementar Template "Editorial" (Template 7 Premium)

## OBJETIVO
Añadir un 7º template llamado "editorial" al sistema de plantillas de HabiBook. Es un diseño premium de lujo con scroll-snap full-screen sections, estética editorial de revista, fondo oscuro navy (#000d22), acentos dorados (#e9c176), tipografía Noto Serif + Manrope. Estilo "The Editorial Estate".

## ARCHIVOS A MODIFICAR

### 1. src/components/templates/types.ts

Añadir al array TEMPLATE_LIST:

```typescript
{ id: 'editorial', name: 'Editorial', desc: 'Premium editorial. Secciones full-screen, scroll-snap, navy + dorado, serif.', color: '#e9c176', bg: '#000d22', persona: 'Julian Vance' },
```

### 2. src/lib/demo-data.ts

Añadir ANTES de la sección "SHARED DATA" el siguiente demo data:

```typescript
// ═══ EDITORIAL DEMO ═══
const editorialAgent: TemplateAgent = {
  full_name: 'Julian Vance',
  business_name: 'The Editorial Estate',
  slug: 'julian-vance',
  template: 'editorial',
  bio: 'Curador inmobiliario con 15 años de experiencia en propiedades arquitectónicas únicas. Especializado en residencias de autor y patrimonio moderno en Tenerife. Cada propiedad que represento es seleccionada personalmente.',
  phone: '+34 611 789 012',
  email: 'julian@editorialestate.com',
  whatsapp: '+34611789012',
  languages: ['Español', 'Inglés', 'Francés', 'Alemán'],
  experience_years: 15,
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  bio_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  location: 'Costa Adeje, Tenerife',
  city: 'Tenerife, Canary Islands',
  stats: { 'Años experiencia': 15, 'En transacciones': 240, 'Satisfacción': 98, 'Propiedades exclusivas': 42 },
  quote: 'La curación es el acto de seleccionar lo que importa. Aplico esta filosofía a tu portfolio inmobiliario.',
};

const editorialProperties: TemplateProperty[] = [
  { title: 'The Obsidian', price: 2850000, location: 'Costa Adeje, Tenerife', bedrooms: 5, bathrooms: 4, area_m2: 520, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'], badge: 'Exclusiva' },
  { title: 'Sky Loft 44', price: 890000, location: 'Santa Cruz, Tenerife', bedrooms: 3, bathrooms: 2, area_m2: 180, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'], badge: 'Nueva' },
  { title: 'Villa Serena', price: 1200000, location: 'La Orotava, Tenerife', bedrooms: 4, bathrooms: 3, area_m2: 310, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'] },
  { title: 'Retreat Oceánico', price: 350, location: 'Playa Paraíso', bedrooms: 2, bathrooms: 2, area_m2: 120, operation_type: 'rent_vacation', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
  { title: 'Ático Montaña Roja', price: 1650000, location: 'El Médano, Tenerife', bedrooms: 3, bathrooms: 3, area_m2: 195, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'] },
  { title: 'Penthouse Abama', price: 3200000, location: 'Guía de Isora', bedrooms: 4, bathrooms: 4, area_m2: 380, operation_type: 'sale', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], badge: 'Exclusiva' },
];

const editorialHero: TemplateHero = {
  title: 'ARCHITECTURE.',
  subtitle: 'Bespoke Living Curator',
  headline: 'ARCHITECTURE.',
  cta_text: 'Explore The Collection',
  image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
  background_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
};
```

Y en el objeto DEMO_DATA, añadir:

```typescript
editorial: buildDemo(editorialAgent, editorialProperties, editorialHero),
```

### 3. src/lib/i18n/translations.ts

Añadir las siguientes claves de traducción a CADA idioma (es, en, de, fr, it, pt, nl, ru, sv, no). Ejemplo para ES y EN (genera el resto siguiendo el patrón):

```typescript
// ES
'nav.sale': 'Venta',
'nav.rental': 'Alquiler',
'nav.advisory': 'Asesoramiento',
'editorial.bespoke_curator': 'Curación Inmobiliaria a Medida',
'editorial.explore_collection': 'Explorar la Colección',
'editorial.legacy_acquisitions': 'Adquisiciones Selectas',
'editorial.temporary_escapes': 'Escapadas Exclusivas',
'editorial.book_retreat': 'Reservar Retiro',
'editorial.strategic_consulting': 'Consultoría Estratégica',
'editorial.methodology': 'La Metodología',
'editorial.featured_portfolio': 'Portfolio Destacado',
'editorial.curated': 'Curación',
'editorial.view_all': 'Ver Todas',
'editorial.next_era': 'Tu próxima era comienza aquí.',
'editorial.initiate': 'Contactar',
'editorial.inquire': 'Consultar',
'editorial.view_options': 'Ver Opciones',

// EN
'nav.sale': 'Sale',
'nav.rental': 'Rental',
'nav.advisory': 'Advisory',
'editorial.bespoke_curator': 'Bespoke Living Curator',
'editorial.explore_collection': 'Explore The Collection',
'editorial.legacy_acquisitions': 'Legacy Acquisitions',
'editorial.temporary_escapes': 'Temporary Escapes',
'editorial.book_retreat': 'Book a Retreat',
'editorial.strategic_consulting': 'Strategic Consulting',
'editorial.methodology': 'The Methodology',
'editorial.featured_portfolio': 'Featured Portfolio',
'editorial.curated': 'Curated',
'editorial.view_all': 'View All',
'editorial.next_era': 'Your next era begins here.',
'editorial.initiate': 'Initiate',
'editorial.inquire': 'Inquire',
'editorial.view_options': 'View Options',
```

### 4. src/components/templates/TemplateRenderer.tsx

#### 4a. Añadir al import de lucide-react: `ArrowRight, Clock, Sparkles, Eye`

#### 4b. Añadir la función EditorialTemplate ANTES del TEMPLATE ROUTER section (antes de la línea `const TEMPLATE_MAP`). Este es el template completo:

```typescript
// ========== EDITORIAL TEMPLATE ==========
function EditorialTemplate({ data, lang, translations }: TemplateProps) {
  const { agent, properties, hero, testimonials, services, zones, team } = data
  const L = (key: string) => t(key, lang)

  // Color palette
  const C = {
    primary: '#000d22',
    container: '#002349',
    gold: '#e9c176',
    goldDark: '#261900',
    white: '#ffffff',
    white60: 'rgba(255,255,255,0.6)',
    white40: 'rgba(255,255,255,0.4)',
    white30: 'rgba(255,255,255,0.3)',
    white10: 'rgba(255,255,255,0.1)',
    white5: 'rgba(255,255,255,0.05)',
  }

  const saleProps = properties.filter(p => p.operation_type === 'sale')
  const rentalProps = properties.filter(p => p.operation_type !== 'sale')

  // Inline styles for scroll-snap
  const sectionStyle: React.CSSProperties = {
    height: '100vh',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    scrollSnapAlign: 'start',
  }

  return (
    <div style={{
      scrollSnapType: 'y mandatory',
      overflowY: 'scroll',
      height: '100vh',
      background: C.primary,
      fontFamily: 'Manrope, system-ui, sans-serif',
      color: C.white,
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* ===== NAVIGATION ===== */}
      <header style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 50,
        background: 'rgba(0,13,34,0.7)', backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${C.white10}`,
      }}>
        <nav style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 24px', maxWidth: '1536px', margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontSize: 20, fontFamily: 'Noto Serif, Georgia, serif',
              fontStyle: 'italic', color: C.white, letterSpacing: '-0.02em',
            }}>
              {agent.business_name || agent.full_name}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            {['sale', 'rental', 'advisory'].map(k => (
              <a key={k} href={`#${k}`} style={{
                fontSize: 11, fontFamily: 'Manrope, sans-serif', textTransform: 'uppercase',
                letterSpacing: '0.3em', color: C.white60, textDecoration: 'none',
              }}>
                {L(`nav.${k}`)}
              </a>
            ))}
          </div>
          {agent.bio_photo_url && (
            <img src={agent.bio_photo_url} alt={agent.full_name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
                filter: 'grayscale(100%)', border: `1px solid ${C.white10}` }}
            />
          )}
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section style={sectionStyle} id="hero">
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={hero?.background_image_url || hero?.image || ''} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,13,34,0.3), rgba(0,13,34,0.4), rgba(0,13,34,0.7))' }} />
        </div>
        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 24px',
        }}>
          <h1 style={{
            fontFamily: 'Noto Serif, Georgia, serif', fontSize: 'clamp(3rem, 10vw, 10rem)',
            fontWeight: 700, color: C.white, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: 24,
          }}>
            {tc(translations, 'hero_config', agent.slug, 'headline', hero?.headline || hero?.title || agent.business_name || '')}
          </h1>
          <p style={{
            fontFamily: 'Manrope, sans-serif', color: C.gold, textTransform: 'uppercase',
            letterSpacing: '0.5em', fontSize: 14, marginBottom: 48,
          }}>
            {tc(translations, 'hero_config', agent.slug, 'subtitle', hero?.subtitle || L('editorial.bespoke_curator'))}
          </p>
          <a href="#sale" style={{
            border: `1px solid ${C.white30}`, color: C.white,
            padding: '20px 48px', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.3em',
            textDecoration: 'none', backdropFilter: 'blur(8px)',
          }}>
            {hero?.cta_text || L('editorial.explore_collection')}
          </a>
        </div>
      </section>

      {/* ===== VENTA (SALE) ===== */}
      <section style={sectionStyle} id="sale">
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {/* Main image 75% */}
          <div style={{ width: '75%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {saleProps[0]?.images?.[0] && (
              <img src={saleProps[0].images[0]} alt={saleProps[0].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s' }} />
            )}
            <div style={{ position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,13,34,0.9), rgba(0,13,34,0.2), transparent)' }} />
            <div style={{ position: 'absolute', bottom: 64, left: 64 }}>
              <p style={{ color: C.gold, letterSpacing: '0.3em', textTransform: 'uppercase', fontSize: 11, marginBottom: 12 }}>
                {L('editorial.legacy_acquisitions')}
              </p>
              <h2 style={{
                fontFamily: 'Noto Serif, Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 700, color: C.white,
              }}>
                {L('nav.sale')}
              </h2>
            </div>
          </div>
          {/* Side panel 25% */}
          <div style={{
            width: '25%', background: C.container, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 48,
            borderLeft: `1px solid ${C.white5}`,
          }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: C.gold, fontSize: 48, fontFamily: 'Noto Serif, Georgia, serif', display: 'block', marginBottom: 32 }}>01</span>
              <p style={{ color: C.white60, fontWeight: 300, lineHeight: 1.7, marginBottom: 32, fontSize: 16 }}>
                {tc(translations, 'agent_profiles', agent.slug, 'bio', agent.bio || '')}
              </p>
              <a href="#contact" style={{
                color: C.white, fontSize: 11, textTransform: 'uppercase',
                letterSpacing: '0.15em', textDecoration: 'none',
                borderBottom: `1px solid ${C.gold}`, paddingBottom: 8,
              }}>
                {L('editorial.inquire')} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ALQUILER VACACIONAL ===== */}
      {rentalProps.length > 0 && (
        <section style={sectionStyle} id="rental">
          <div style={{ position: 'absolute', inset: 0 }}>
            {rentalProps[0]?.images?.[0] && (
              <img src={rentalProps[0].images[0]} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,13,34,0.6)', mixBlendMode: 'multiply' }} />
          </div>
          <div style={{
            position: 'relative', zIndex: 10, height: '100%',
            display: 'flex', alignItems: 'center', padding: '0 64px',
          }}>
            <div style={{ maxWidth: 640 }}>
              <span style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: 11, marginBottom: 24, display: 'block' }}>
                {L('editorial.temporary_escapes')}
              </span>
              <h2 style={{
                fontFamily: 'Noto Serif, Georgia, serif',
                fontSize: 'clamp(2.5rem, 8vw, 9rem)',
                fontWeight: 700, color: C.white, lineHeight: 0.95, marginBottom: 40,
              }}>
                {L('properties.rent_vacation')}
              </h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#contact" style={{
                  background: C.gold, color: C.primary,
                  padding: '24px 64px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11,
                  textDecoration: 'none',
                }}>
                  {L('editorial.book_retreat')}
                </a>
                <a href="#portfolio" style={{
                  border: `1px solid ${C.white30}`, color: C.white,
                  padding: '24px 48px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11,
                  textDecoration: 'none',
                }}>
                  {L('editorial.view_options')}
                </a>
              </div>
            </div>
          </div>
          {/* Decorative number */}
          <div style={{ position: 'absolute', bottom: 64, right: 64, opacity: 0.15 }}>
            <span style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: 'clamp(6rem, 10vw, 12rem)', color: C.white, fontWeight: 700, lineHeight: 1 }}>02</span>
          </div>
        </section>
      )}

      {/* ===== ASESORAMIENTO (AGENT DEPTH) ===== */}
      <section style={{ ...sectionStyle, background: C.primary, display: 'flex', alignItems: 'center' }} id="advisory">
        {/* Agent photo right side */}
        {agent.bio_photo_url && (
          <div style={{
            position: 'absolute', right: 0, bottom: 0, width: '50%', height: '100%',
          }}>
            <div style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
              <img src={agent.bio_photo_url} alt={agent.full_name}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  height: '110%', width: 'auto', objectFit: 'cover',
                  objectPosition: 'bottom', filter: 'grayscale(100%)',
                }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to right, ${C.primary}, rgba(0,13,34,0.5), transparent)`,
              }} />
            </div>
          </div>
        )}
        {/* Content left side */}
        <div style={{ position: 'relative', zIndex: 20, padding: '0 64px', width: '50%' }}>
          <span style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: 11, marginBottom: 32, display: 'block' }}>
            {L('editorial.strategic_consulting')}
          </span>
          <h2 style={{
            fontFamily: 'Noto Serif, Georgia, serif',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 700, color: C.white, marginBottom: 32, lineHeight: 1.1,
          }}>
            {L('nav.advisory')}
          </h2>
          {agent.quote && (
            <p style={{ color: C.white40, fontStyle: 'italic', fontSize: 20, maxWidth: 480, marginBottom: 48, lineHeight: 1.6 }}>
              "{tc(translations, 'agent_profiles', agent.slug, 'quote', agent.quote)}"
            </p>
          )}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a href="#portfolio" style={{
              border: `1px solid ${C.gold}`, color: C.gold,
              padding: '16px 40px', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontSize: 10, fontWeight: 700,
              textDecoration: 'none',
            }}>
              {L('editorial.methodology')}
            </a>
            <a href="#contact" style={{
              background: C.white, color: C.primary,
              padding: '16px 40px', textTransform: 'uppercase',
              letterSpacing: '0.15em', fontSize: 10, fontWeight: 700,
              textDecoration: 'none',
            }}>
              {L('contact.title')}
            </a>
          </div>
          {/* Agent stats */}
          {agent.stats && (
            <div style={{ marginTop: 64, display: 'flex', gap: 48, opacity: 0.6 }}>
              {Object.entries(agent.stats).slice(0, 3).map(([k, v]) => (
                <div key={k}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: C.white, display: 'block' }}>
                    {typeof v === 'number' ? (v > 100 ? `€${v}M` : v > 50 ? `${v}%` : `${v}+`) : v}
                  </span>
                  <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.white40 }}>
                    {k.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section style={{ ...sectionStyle, background: C.container, padding: 64, display: 'flex', flexDirection: 'column' }} id="portfolio">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: C.white }}>
            {L('editorial.featured_portfolio')}
          </h2>
          <p style={{ color: C.gold, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            {L('editorial.curated')} 2024
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 24, flex: 1, minHeight: 0,
        }}>
          {/* Large left card */}
          {saleProps[0] && (
            <div style={{
              gridColumn: 'span 5', gridRow: 'span 2',
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }}>
              <img src={saleProps[0].images?.[0] || ''} alt={saleProps[0].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,13,34,0.9) 0%, rgba(0,13,34,0.4) 40%, transparent 70%)',
              }} />
              {saleProps[0].badge && (
                <div style={{
                  position: 'absolute', top: 24, left: 24,
                  background: 'rgba(233,193,118,0.15)', border: '1px solid rgba(233,193,118,0.3)',
                  backdropFilter: 'blur(10px)', color: C.gold,
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em',
                  padding: '6px 12px', fontWeight: 700,
                }}>
                  {saleProps[0].badge}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
                <h3 style={{ color: C.white, fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{tc(translations, 'properties', saleProps[0].id, 'title', saleProps[0].title)}</h3>
                <p style={{ color: C.white40, fontSize: 12, marginBottom: 8 }}>{saleProps[0].location} · {saleProps[0].area_m2} m²</p>
                <p style={{ color: C.gold, fontSize: 18, fontWeight: 700 }}>{formatPrice(saleProps[0].price)}</p>
              </div>
            </div>
          )}
          {/* Top right wide */}
          {saleProps[1] && (
            <div style={{
              gridColumn: 'span 7', position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }}>
              <img src={saleProps[1].images?.[0] || ''} alt={saleProps[1].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,13,34,0.9) 0%, rgba(0,13,34,0.4) 40%, transparent 70%)',
              }} />
              <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                <h3 style={{ color: C.white, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{tc(translations, 'properties', saleProps[1].id, 'title', saleProps[1].title)}</h3>
                <p style={{ color: C.white40, fontSize: 11, marginBottom: 4 }}>{saleProps[1].location} · {saleProps[1].area_m2} m²</p>
                <p style={{ color: C.gold, fontWeight: 700 }}>{formatPrice(saleProps[1].price)}</p>
              </div>
            </div>
          )}
          {/* Bottom small */}
          {saleProps[2] && (
            <div style={{
              gridColumn: 'span 3', position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }}>
              <img src={saleProps[2].images?.[0] || ''} alt={saleProps[2].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,13,34,0.9) 0%, rgba(0,13,34,0.4) 40%, transparent 70%)',
              }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                <h3 style={{ color: C.white, fontSize: 14, fontWeight: 700 }}>{tc(translations, 'properties', saleProps[2].id, 'title', saleProps[2].title)}</h3>
                <p style={{ color: C.gold, fontSize: 12, fontWeight: 700, marginTop: 4 }}>{formatPrice(saleProps[2].price)}</p>
              </div>
            </div>
          )}
          {/* CTA card */}
          <div style={{
            gridColumn: 'span 4', background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${C.white10}`, cursor: 'pointer',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: C.white40, textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: 10, fontWeight: 700 }}>
                {L('editorial.view_all')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / FOOTER ===== */}
      <section style={{
        ...sectionStyle, background: C.primary,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 64,
      }} id="contact">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 800, width: '100%' }}>
            <span style={{ color: C.gold, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: 11, marginBottom: 32, display: 'block' }}>
              {L('contact.title')}
            </span>
            <h2 style={{
              fontFamily: 'Noto Serif, Georgia, serif',
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              fontWeight: 700, color: C.white, marginBottom: 48, lineHeight: 1.1,
            }}>
              {L('editorial.next_era')}
            </h2>
            {/* Contact options */}
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              {agent.phone && (
                <a href={`tel:${agent.phone}`} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: C.white40, textDecoration: 'none', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                  <Phone size={16} /> {agent.phone}
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp?.replace(/\D/g,'')}`} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: C.white40, textDecoration: 'none', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                  <MessageSquare size={16} /> WhatsApp
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: C.white40, textDecoration: 'none', fontSize: 12,
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>
                  <Mail size={16} /> {agent.email}
                </a>
              )}
            </div>
            <a href={`mailto:${agent.email}`} style={{
              display: 'inline-block', background: C.white, color: C.primary,
              padding: '24px 64px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11,
              textDecoration: 'none',
            }}>
              {L('editorial.initiate')}
            </a>
          </div>
        </div>
        {/* Footer */}
        <footer style={{
          borderTop: `1px solid ${C.white5}`, paddingTop: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <span style={{ fontFamily: 'Noto Serif, Georgia, serif', fontStyle: 'italic', color: C.white, fontSize: 20 }}>
              {agent.business_name || agent.full_name}
            </span>
            <p style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 12 }}>
              {agent.city || agent.location}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)' }}>
              {L('footer.powered_by')} HabiBook
            </span>
          </div>
        </footer>
      </section>
    </div>
  )
}
```

#### 4c. Registrar en TEMPLATE_MAP:

```typescript
const TEMPLATE_MAP: Record<string, React.FC<TemplateProps>> = {
  luxury: LuxuryTemplate,
  mediterranean: MediterraneanTemplate,
  corporate: CorporateTemplate,
  boutique: BoutiqueTemplate,
  classic: ClassicTemplate,
  data: DataTemplate,
  editorial: EditorialTemplate,
};
```

### 5. Actualizar enum en Supabase (si aplica)

Si el enum `template_type` existe en Supabase y no admite valores fuera del enum, ejecutar:

```sql
ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial';
```

## VERIFICACIÓN

1. `npm run build` debe pasar sin errores
2. Acceder a /demos y verificar que aparece la plantilla Editorial con la persona "Julian Vance"
3. Verificar que el scroll-snap funciona correctamente
4. Verificar que las 6 secciones renderizan: Hero, Venta, Alquiler, Asesoramiento, Portfolio, Contacto
5. Verificar responsive (aunque el template está optimizado para desktop, no debe romper en mobile)

## NOTAS

- El template usa scroll-snap CSS nativo — NO necesita librerías externas
- Las fuentes Noto Serif y Manrope se cargan via Google Fonts, ya incluidas en el layout global o por link directo en el head
- Verificar que Noto Serif está incluida en el `<link>` de Google Fonts en el layout raíz. Si no está, añadir: `https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap`
- NO añadir Material Symbols — los iconos usan lucide-react como el resto de templates
- Este template es PREMIUM — solo disponible en planes Pro/Premium/Agencia
