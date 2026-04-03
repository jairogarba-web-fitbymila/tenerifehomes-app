'use client'

import { useState } from 'react'
import { Phone, Mail, Star, MapPin, Bed, Bath, Ruler, ArrowUpRight, Instagram, Facebook, Linkedin, Youtube, Menu, X, Home as HomeIcon, Search, Calendar, User } from 'lucide-react'
import { TemplateData, formatPrice } from '../types'
import { t } from '@/lib/i18n'
import { getTranslatedContent, TranslationsMap } from '@/lib/i18n/content'

interface TemplateProps {
  data: TemplateData
  lang: string
  translations: TranslationsMap | null
}

function tc(translations: TranslationsMap | null, table: string, id: string | undefined, field: string, original: string): string {
  if (!id) return original
  return getTranslatedContent(translations, table, id, field, original)
}

const LIME = '#CAF300'
const BG = '#131313'
const SURFACE = '#1c1b1b'

export default function MonolithTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { agent, properties, hero, services } = data
  const heroImg = hero?.background_image_url || hero?.image || properties?.[0]?.images?.[0] || ''
  const agentName = agent.full_name || agent.business_name || 'MONOLITH'
  const topProps = properties.filter(p => p.is_active !== false).slice(0, 5)
  const row1 = topProps.slice(0, 3)
  const row2 = topProps.slice(3, 5)

  return (
    <div className="min-h-screen w-full antialiased selection:bg-[#CAF300] selection:text-[#2a3400]" style={{ fontFamily: "'Public Sans', system-ui, sans-serif", background: BG, color: '#e5e2e1' }}>

      {/* NAVIGATION */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="md:hidden">
              <Menu className="w-6 h-6 text-white" />
            </button>
            <span className="uppercase tracking-tighter text-xl md:text-2xl text-white" style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
              {agent.business_name || 'MONOLITH'}
            </span>
          </div>
          <nav className="hidden md:flex gap-10 text-sm" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", letterSpacing: '0.2em' }}>
            <a href="#propiedades" style={{ color: LIME }}>{t('nav.properties', lang).toUpperCase()}</a>
            <a href="#agente" className="text-white hover:opacity-80 transition-colors">{t('nav.about', lang).toUpperCase()}</a>
            <a href="#servicios" className="text-white hover:opacity-80 transition-colors">{t('nav.services', lang).toUpperCase()}</a>
            <a href="#contacto" className="text-white hover:opacity-80 transition-colors">{t('nav.contact', lang).toUpperCase()}</a>
          </nav>
          <a href="#contacto" className="hidden md:flex items-center">
            <Search className="w-5 h-5 text-white hover:opacity-80 transition-colors" />
          </a>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-[60] bg-black text-white transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center px-6 py-4">
          <span className="uppercase tracking-tighter text-xl" style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
            {agent.business_name || 'MONOLITH'}
          </span>
          <button onClick={() => setMenuOpen(false)}>
            <X className="w-7 h-7 text-white" />
          </button>
        </div>
        <div className="flex flex-col items-start justify-center h-[75vh] px-8 gap-6">
          {[
            { href: '#propiedades', label: t('nav.properties', lang) },
            { href: '#agente', label: t('nav.about', lang) },
            { href: '#servicios', label: t('nav.services', lang) },
            { href: '#contacto', label: t('nav.contact', lang) },
          ].map(link => (
            <a key={link.href} onClick={() => setMenuOpen(false)} href={link.href}
              className="text-4xl tracking-tighter uppercase text-zinc-400 hover:opacity-80 transition-colors"
              style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900, color: undefined }}>
              {link.label.toUpperCase()}
            </a>
          ))}
          {agent.phone && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <a href={`tel:${agent.phone}`} className="text-zinc-500 text-sm" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", letterSpacing: '0.1em' }}>{agent.phone}</a>
            </div>
          )}
        </div>
      </div>

      <main>
        {/* HERO */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            {heroImg && <img className="w-full h-full object-cover opacity-50 scale-110" style={{ filter: 'grayscale(1)' }} src={heroImg} alt="" />}
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, rgba(19,19,19,0.2) 50%, ${BG} 100%)` }} />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-8 pb-20 md:pb-32">
            <div className="max-w-[95vw]">
              <h1 className="text-[13vw] md:text-[10vw] leading-[0.85] tracking-tighter text-white uppercase"
                style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
                {hero?.headline || t('monolith.escape', lang)}
              </h1>
              <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                <p className="max-w-md text-zinc-400 font-light text-base md:text-lg leading-relaxed">
                  {hero?.subtitle || agent.bio || ''}
                </p>
                <a href="#propiedades" className="px-8 md:px-10 py-4 md:py-5 text-sm tracking-widest"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, background: 'white', color: '#2a3400' }}>
                  {hero?.cta_text || t('monolith.view_collection', lang)}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CURATOR / AGENT */}
        <section id="agente" className="py-20 md:py-32 px-6 md:px-8 overflow-hidden" style={{ background: BG }}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
            <div className="md:col-span-5 order-2 md:order-1 mt-8 md:mt-0">
              <div className="md:sticky md:top-32">
                <span className="text-xs tracking-[0.4em] mb-6 block" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: LIME }}>
                  {t('monolith.the_visionary', lang).toUpperCase()}
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-7xl leading-none tracking-tighter mb-6 md:mb-8 uppercase text-white"
                  style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 800 }}>
                  {t('monolith.architectural_curator', lang)}
                </h2>
                {agent.quote && (
                  <p className="text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-sm italic text-zinc-400">
                    &ldquo;{agent.quote}&rdquo;
                  </p>
                )}
                <div className="border-t border-white/10 pt-8 md:pt-10">
                  <h4 className="text-sm text-white tracking-widest mb-2" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700 }}>
                    {agentName.toUpperCase()}
                  </h4>
                  <p className="text-zinc-500 text-xs tracking-widest uppercase" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                    {agent.location || agent.city || ''}{agent.experience_years ? ` · ${agent.experience_years}+ ${lang === 'es' ? 'Años' : 'Years'}` : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="relative aspect-[3/4] md:aspect-square overflow-hidden" style={{ background: SURFACE }}>
                {(agent.photo || agent.bio_photo_url) && (
                  <img className="w-full h-full object-cover" style={{ filter: 'grayscale(1) contrast(1.25)' }}
                    src={agent.bio_photo_url || agent.photo} alt={agentName} />
                )}
                <div className="absolute bottom-0 right-0 p-6 md:p-8 hidden md:flex items-center justify-center" style={{ background: LIME }}>
                  <Star className="w-10 h-10 md:w-12 md:h-12" style={{ color: '#2a3400' }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="propiedades" className="py-20 md:py-32 px-6 md:px-8" style={{ background: SURFACE }}>
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6 md:pb-8">
            <h2 className="text-3xl md:text-4xl lg:text-6xl text-white tracking-tighter uppercase"
              style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
              {t('monolith.the_portfolio', lang)}
            </h2>
            <div className="text-sm tracking-widest mt-2 md:mt-0" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: LIME }}>
              01 — {String(topProps.length).padStart(2, '0')}
            </div>
          </div>

          {/* Row 1: 3-column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
            {row1.map((prop, i) => (
              <PropertyCard key={prop.id || i} prop={prop} aspect="aspect-[4/5]" translations={translations} lang={lang} />
            ))}
          </div>

          {/* Row 2: 2-column wide */}
          {row2.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[2px] mt-[2px]">
              {row2.map((prop, i) => (
                <PropertyCard key={prop.id || `r2-${i}`} prop={prop} aspect="aspect-[16/9]" translations={translations} lang={lang} />
              ))}
            </div>
          )}
        </section>

        {/* SERVICES */}
        <section id="servicios" className="py-20 md:py-32 px-6 md:px-8" style={{ background: BG }}>
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl lg:text-7xl text-white tracking-tighter mb-12 md:mb-16 leading-tight uppercase"
              style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
              {t('monolith.beyond_staying', lang)}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {(services && services.length > 0 ? services : defaultServices(lang)).map((svc, i) => (
              <div key={svc.id || i} className="space-y-4 md:space-y-6">
                <div style={{ color: LIME }}>{serviceIcons[i % serviceIcons.length]}</div>
                <h4 className="text-base md:text-lg text-white tracking-widest uppercase"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700 }}>
                  {tc(translations, 'services', svc.id, 'title', svc.title)}
                </h4>
                {svc.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {tc(translations, 'services', svc.id, 'description', svc.description)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contacto" className="w-full min-h-[70vh] md:min-h-screen flex flex-col justify-end bg-zinc-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 p-6 md:p-8 w-full">
          <div className="flex flex-col justify-between">
            <div className="space-y-2">
              {[
                { href: '#propiedades', label: t('nav.properties', lang) },
                { href: '#servicios', label: t('nav.services', lang) },
                { href: '#agente', label: t('nav.about', lang) },
                { href: '#contacto', label: t('nav.contact', lang) },
              ].map(link => (
                <a key={link.href} href={link.href}
                  className="block text-3xl md:text-4xl lg:text-6xl tracking-tighter leading-none text-zinc-400 hover:opacity-80 transition-all duration-500"
                  style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 700 }}>
                  {link.label.toUpperCase()}
                </a>
              ))}
            </div>
            <div className="mt-12 md:mt-24 text-zinc-600 text-xs tracking-widest" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              © {new Date().getFullYear()} {(agent.business_name || agentName).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col justify-end items-start md:items-end">
            <div className="text-left md:text-right max-w-sm">
              {agent.bio && <p className="text-white text-lg md:text-xl mb-6 md:mb-8 leading-relaxed">{agent.bio}</p>}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="px-6 py-3 text-sm tracking-widest text-center hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, background: LIME, color: '#2a3400' }}>
                    {agent.phone}
                  </a>
                )}
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="border border-white/20 text-white px-6 py-3 text-sm tracking-widest text-center hover:bg-white/10 transition-colors"
                    style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700 }}>
                    WHATSAPP
                  </a>
                )}
              </div>
            </div>
            <h2 className="text-zinc-800 text-[18vw] md:text-[12vw] leading-[0.8] tracking-tighter select-none pointer-events-none mt-8 md:mt-24"
              style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 900 }}>
              {(agent.business_name || 'MONOLITH').toUpperCase()}
            </h2>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-14 flex justify-around items-center bg-zinc-900/90 backdrop-blur-2xl z-50">
        <a href="#propiedades" style={{ color: LIME }}><HomeIcon className="w-5 h-5" /></a>
        <a href="#propiedades" className="text-zinc-500 hover:text-white transition-all"><Search className="w-5 h-5" /></a>
        <a href="#contacto" className="text-zinc-500 hover:text-white transition-all"><Calendar className="w-5 h-5" /></a>
        <a href="#agente" className="text-zinc-500 hover:text-white transition-all"><User className="w-5 h-5" /></a>
      </nav>
    </div>
  )
}

/* ── Property Card ── */
function PropertyCard({ prop, aspect, translations, lang }: {
  prop: TemplateData['properties'][0]; aspect: string; translations: TranslationsMap | null; lang: string
}) {
  const img = prop.images?.[0] || ''
  const loc = prop.location || ''
  return (
    <div className="group relative overflow-hidden">
      <div className={`${aspect} overflow-hidden`}>
        {img && <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={img} alt={prop.title} />}
      </div>
      <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
        <div className="flex justify-between items-end">
          <div>
            {loc && <p className="text-xs tracking-widest mb-2" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", color: LIME }}>{loc.toUpperCase()}</p>}
            <h3 className="text-2xl md:text-3xl text-white tracking-tighter mb-1"
              style={{ fontFamily: "'Lexend', system-ui, sans-serif", fontWeight: 700 }}>
              {tc(translations, 'properties', prop.id, 'title', prop.title).toUpperCase()}
            </h3>
            <p className="text-base md:text-lg tracking-tighter" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, color: LIME }}>
              {formatPrice(prop.price)}
            </p>
          </div>
          <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  )
}

/* ── Service icons (cycling) ── */
const serviceIcons = [
  <MapPin key="ic1" className="w-8 h-8 md:w-10 md:h-10" />,
  <Star key="ic2" className="w-8 h-8 md:w-10 md:h-10" />,
  <Phone key="ic3" className="w-8 h-8 md:w-10 md:h-10" />,
  <Mail key="ic4" className="w-8 h-8 md:w-10 md:h-10" />,
]

/* ── Fallback services ── */
function defaultServices(lang: string) {
  return [
    { id: undefined, title: t('monolith.private_transit', lang), description: '' },
    { id: undefined, title: t('monolith.in_residence_chef', lang), description: '' },
    { id: undefined, title: t('monolith.site_curator', lang), description: '' },
    { id: undefined, title: t('monolith.legal_nie', lang), description: '' },
  ]
}
