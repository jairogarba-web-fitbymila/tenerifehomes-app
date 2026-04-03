'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare, MapPin, Bed, Bath, Ruler, Home, Menu, X, Briefcase, Key, TrendingUp } from 'lucide-react'
import { TemplateData, formatPrice } from '../types'
import { t } from '@/lib/i18n'
import { getTranslatedContent, TranslationsMap } from '@/lib/i18n/content'

interface TemplateProps {
  data: TemplateData
  lang: string
  translations: TranslationsMap | null
}

const L = (key: string, lang: string) => t(key, lang)

function tc(translations: TranslationsMap | null, table: string, id: string | undefined, field: string, original: string): string {
  if (!id) return original
  return getTranslatedContent(translations, table, id, field, original)
}

const COLORS = { primary: '#000d22', container: '#002349', gold: '#e9c176', goldLight: '#ffdea5', surface: '#f8f9fa' }
const serif = { fontFamily: 'Noto Serif, Georgia, serif' }
const sans = { fontFamily: 'Manrope, system-ui, sans-serif' }

const SERVICE_ICONS = [Briefcase, Key, TrendingUp, Home, Briefcase, Key]

export default function EditorialFullServiceTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { agent, properties, hero, services } = data

  const vacation = properties.filter(p => p.operation_type === 'rent_vacation')
  const sales = properties.filter(p => p.operation_type === 'sale')
  const longTerm = properties.filter(p => p.operation_type === 'rent_long')

  const heroImg = hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const headline = hero?.headline || hero?.title || agent.business_name || agent.full_name
  const subtitle = hero?.subtitle || L('hero.subtitle', lang)
  const bizName = agent.business_name || agent.full_name

  const PropFeatures = ({ p }: { p: typeof properties[0] }) => (
    <div className="flex gap-3 text-xs font-medium opacity-70">
      {p.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
      {p.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
      {(p.area_m2 || p.size_m2) && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{p.area_m2 || p.size_m2} m²</span>}
    </div>
  )

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] antialiased" style={sans}>
      {/* Mobile Menu */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500" style={{ background: COLORS.primary, transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6"><X className="w-8 h-8 text-white" /></button>
        {['vacacional', 'venta', 'alquiler', 'agente', 'contacto'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)} className="text-3xl text-white/70 hover:text-[#e9c176] transition-colors capitalize" style={serif}>{s}</a>
        ))}
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-black/5" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5" style={{ color: COLORS.primary }} />
            <span className="text-xl md:text-2xl font-bold tracking-tight" style={{ ...serif, color: COLORS.primary }}>{bizName}</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {vacation.length > 0 && <a href="#vacacional" className="text-sm font-medium" style={{ color: COLORS.primary, borderBottom: `2px solid ${COLORS.gold}`, paddingBottom: 4 }}>{L('editorial.vacation_rentals', lang)}</a>}
            {sales.length > 0 && <a href="#venta" className="text-sm font-medium text-[#51606b] hover:text-[#000d22] transition-colors">{L('editorial.for_sale', lang)}</a>}
            {longTerm.length > 0 && <a href="#alquiler" className="text-sm font-medium text-[#51606b] hover:text-[#000d22] transition-colors">{L('editorial.long_term', lang)}</a>}
            <a href="#agente" className="text-sm font-medium text-[#51606b] hover:text-[#000d22] transition-colors">{L('nav.about', lang)}</a>
          </nav>
          <a href="#contacto" className="hidden md:inline-block text-white text-sm uppercase tracking-wider px-6 py-2.5 font-bold hover:opacity-80 transition-opacity" style={{ background: COLORS.primary }}>{L('nav.contact', lang)}</a>
          <button onClick={() => setMenuOpen(true)} className="md:hidden"><Menu className="w-6 h-6" style={{ color: COLORS.primary }} /></button>
        </div>
      </header>

      <main className="pt-16 md:pt-24">
        {/* Hero */}
        <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden px-6 md:px-8 mb-12 md:mb-16">
          <div className="absolute inset-0 z-0">
            <img src={heroImg} alt={headline} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000d22]/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-screen-xl mx-auto w-full">
            <div className="max-w-2xl text-white">
              <span className="text-sm uppercase tracking-[0.3em] block mb-4" style={{ color: COLORS.gold }}>{agent.city || 'Tenerife'} · 2026</span>
              <h1 className="text-4xl md:text-6xl lg:text-8xl leading-tight mb-6 md:mb-8" style={serif}>{headline}</h1>
              <p className="text-base md:text-lg text-slate-200 font-light leading-relaxed max-w-lg mb-8 md:mb-10">{subtitle}</p>
              <a href="#vacacional" className="inline-block px-8 md:px-10 py-3 md:py-4 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors" style={{ background: COLORS.goldLight, color: '#261900' }}>
                {hero?.cta_text || L('hero.cta', lang)}
              </a>
            </div>
          </div>
        </section>

        {/* Vacation Rentals - Bento Grid */}
        {vacation.length > 0 && (
          <section id="vacacional" className="max-w-screen-2xl mx-auto px-6 md:px-8 mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl mb-4 md:mb-6" style={{ ...serif, color: COLORS.primary }}>{L('editorial.vacation_rentals', lang)}</h2>
                <p className="text-[#51606b] text-base md:text-lg">{L('hero.subtitle', lang)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {vacation.slice(0, 5).map((p, i) => {
                const img = p.images?.[0] || '/images/property-placeholder.jpg'
                const title = tc(translations, 'properties', p.id, 'title', p.title)
                if (i === 0) return (
                  <div key={p.id || i} className="md:col-span-8 group overflow-hidden">
                    <div className="relative aspect-[16/9] mb-5 md:mb-6 overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      {p.badge && <span className="absolute top-4 md:top-6 left-4 md:left-6 px-3 md:px-4 py-1 text-xs font-bold tracking-widest uppercase" style={{ background: COLORS.gold, color: '#261900' }}>{p.badge}</span>}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                      <div>
                        <h3 className="text-xl md:text-2xl mb-1" style={{ ...serif, color: COLORS.primary }}>{title}</h3>
                        {p.location && <p className="text-[#51606b] text-sm flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{p.location}</p>}
                        <PropFeatures p={p} />
                      </div>
                      <div className="md:text-right">
                        <span className="block text-2xl md:text-3xl" style={{ ...serif, color: COLORS.primary }}>{formatPrice(p.price)}</span>
                        <span className="text-[#51606b] text-sm uppercase tracking-tight">{L('editorial.per_night', lang)}</span>
                      </div>
                    </div>
                  </div>
                )
                if (i === 1) return (
                  <div key={p.id || i} className="md:col-span-4 group">
                    <div className="relative aspect-[3/4] md:aspect-[4/5] mb-5 md:mb-6 overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="text-xl md:text-2xl mb-1" style={{ ...serif, color: COLORS.primary }}>{title}</h3>
                    {p.location && <p className="text-[#51606b] text-sm mb-3">{p.location}</p>}
                    <div className="flex justify-between items-center pt-3 border-t border-black/10">
                      <PropFeatures p={p} />
                      <span className="text-xl" style={{ ...serif, color: COLORS.primary }}>{formatPrice(p.price)}<span className="text-xs text-[#51606b]" style={{ fontFamily: 'Manrope' }}>/{L('editorial.per_night', lang)}</span></span>
                    </div>
                  </div>
                )
                return (
                  <div key={p.id || i} className="md:col-span-6 group">
                    <div className="relative aspect-[4/3] mb-5 md:mb-6 overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-4 bg-[#f3f4f5]">
                      <h3 className="text-xl md:text-2xl mb-1" style={{ ...serif, color: COLORS.primary }}>{title}</h3>
                      {p.location && <p className="text-[#51606b] text-sm mb-4">{p.location}</p>}
                      <div className="flex justify-between items-end">
                        <PropFeatures p={p} />
                        <span className="text-xl md:text-2xl" style={{ ...serif, color: COLORS.primary }}>{formatPrice(p.price)}<span className="text-sm text-[#51606b]" style={{ fontFamily: 'Manrope' }}>/{L('editorial.per_night', lang)}</span></span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Sale Properties - Dark Section */}
        {sales.length > 0 && (
          <section id="venta" className="text-white py-20 md:py-32" style={{ background: COLORS.container }}>
            <div className="max-w-screen-2xl mx-auto px-6 md:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-20 gap-6">
                <div className="max-w-2xl">
                  <span className="text-sm uppercase tracking-[0.2em] text-[#718bb7] block mb-4">{L('editorial.for_sale', lang)}</span>
                  <h2 className="text-3xl md:text-5xl mb-4 md:mb-6" style={serif}>{L('editorial.for_sale', lang)}</h2>
                </div>
                <a href="#contacto" className="border border-[#718bb7] px-6 md:px-8 py-3 uppercase text-xs tracking-widest font-bold hover:bg-white hover:text-[#000d22] transition-all">{L('nav.contact', lang)}</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {sales.slice(0, 6).map((p, i) => {
                  const img = p.images?.[0] || '/images/property-placeholder.jpg'
                  const title = tc(translations, 'properties', p.id, 'title', p.title)
                  return (
                    <div key={p.id || i} className="group">
                      <div className="aspect-[3/4] mb-6 md:mb-8 overflow-hidden">
                        <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </div>
                      <h4 className="text-xl md:text-2xl mb-2" style={serif}>{title}</h4>
                      {p.location && <p className="text-[#718bb7] text-sm mb-4 md:mb-6 uppercase tracking-widest">{p.location}</p>}
                      <p className="text-2xl md:text-3xl mb-6 md:mb-8" style={serif}>{formatPrice(p.price)}</p>
                      <div className="grid grid-cols-3 gap-3 text-xs uppercase tracking-tight opacity-80 border-t border-white/20 pt-4 md:pt-6">
                        {p.bedrooms && <span>{p.bedrooms} Hab</span>}
                        {p.bathrooms && <span>{p.bathrooms} Baños</span>}
                        {(p.area_m2 || p.size_m2) && <span>{p.area_m2 || p.size_m2} m²</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Long-Term Rentals - 4 col grid */}
        {longTerm.length > 0 && (
          <section id="alquiler" className="max-w-screen-2xl mx-auto px-6 md:px-8 py-16 md:py-24">
            <h2 className="text-3xl md:text-5xl text-center mb-10 md:mb-16" style={{ ...serif, color: COLORS.primary }}>{L('editorial.long_term', lang)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {longTerm.slice(0, 8).map((p, i) => {
                const img = p.images?.[0] || '/images/property-placeholder.jpg'
                const title = tc(translations, 'properties', p.id, 'title', p.title)
                return (
                  <div key={p.id || i} className="bg-white p-3 md:p-4 group">
                    <div className="aspect-square mb-4 md:mb-6 overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]" />
                    </div>
                    <h5 className="text-base md:text-xl" style={{ ...serif, color: COLORS.primary }}>{title}</h5>
                    {p.location && <p className="text-[#51606b] text-xs md:text-sm mb-2 md:mb-4">{p.location}</p>}
                    <p className="font-bold text-sm md:text-base" style={{ color: COLORS.primary }}>{formatPrice(p.price)}/{L('editorial.per_month', lang)}</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* About Agent */}
        <section id="agente" className="max-w-screen-2xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-20">
            <div className="relative order-2 md:order-1">
              <div className="absolute -top-6 md:-top-10 -left-6 md:-left-10 w-24 md:w-40 h-24 md:h-40 border-t-2 border-l-2" style={{ borderColor: COLORS.gold }} />
              {agent.photo && <img src={agent.photo} alt={agent.full_name} className="w-full h-auto object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-1000" />}
              <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 w-24 md:w-40 h-24 md:h-40 bg-[#e7e8e9] -z-10" />
              {/* Floating stats badge */}
              {agent.experience_years && (
                <div className="absolute -bottom-4 -right-4 md:bottom-8 md:right-[-2rem] text-white p-4 md:p-6 shadow-xl" style={{ background: COLORS.primary }}>
                  <span className="block text-2xl md:text-3xl font-bold" style={serif}>{agent.experience_years}+</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/60">{L('about.years', lang)}</span>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm uppercase tracking-[0.3em] text-[#51606b] block mb-4 md:mb-6">{L('about.title', lang)}</span>
              <h2 className="text-3xl md:text-5xl leading-tight mb-6 md:mb-8" style={{ ...serif, color: COLORS.primary }}>{agent.full_name}</h2>
              {agent.quote && <p className="text-base md:text-lg text-[#51606b] mb-6 md:mb-8 leading-relaxed italic" style={serif}>&ldquo;{agent.quote}&rdquo;</p>}
              {agent.bio && <p className="text-[#51606b] mb-8 md:mb-10 leading-relaxed text-sm md:text-base">{agent.bio}</p>}
              <div className="flex flex-col gap-4">
                <a href="#contacto" className="flex items-center gap-4 group/link">
                  <span className="w-10 md:w-12 h-[1px] group-hover/link:w-16 transition-all" style={{ background: COLORS.primary }} />
                  <span className="font-bold tracking-widest uppercase text-xs" style={{ color: COLORS.primary }}>{L('contact.getInTouch', lang)}</span>
                </a>
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-4 group/link">
                    <span className="w-10 md:w-12 h-[1px] group-hover/link:w-16 transition-all" style={{ background: COLORS.primary }} />
                    <span className="font-bold tracking-widest uppercase text-xs" style={{ color: COLORS.primary }}>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        {services && services.length > 0 && (
          <section className="max-w-screen-2xl mx-auto px-6 md:px-8 py-16 md:py-24">
            <h2 className="text-3xl md:text-5xl text-center mb-12 md:mb-16" style={{ ...serif, color: COLORS.primary }}>{L('services.title', lang)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 6).map((s, i) => {
                const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
                return (
                  <div key={s.id || i} className="border border-black/10 p-8 hover:border-[#e9c176] transition-colors group">
                    <Icon className="w-8 h-8 mb-6 transition-colors" style={{ color: COLORS.gold }} />
                    <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-sm" style={{ color: COLORS.primary }}>{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                    {s.description && <p className="text-[#51606b] text-sm leading-relaxed">{tc(translations, 'services', s.id, 'description', s.description)}</p>}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Contact Form */}
        <section id="contacto" className="py-16 md:py-24 px-6 md:px-8" style={{ background: COLORS.primary }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-white text-center mb-6" style={serif}>{L('contact.headline', lang)}</h2>
            <p className="text-[#718bb7] text-center text-base md:text-lg mb-8 md:mb-10 leading-relaxed">{L('contact.getInTouch', lang)}</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6">
              <input type="text" placeholder={L('contact.name', lang)} className="bg-transparent border-b border-white/20 text-white py-3 px-1 text-sm focus:outline-none focus:border-[#e9c176] transition-colors placeholder:text-white/30" />
              <input type="email" placeholder={L('contact.email', lang)} className="bg-transparent border-b border-white/20 text-white py-3 px-1 text-sm focus:outline-none focus:border-[#e9c176] transition-colors placeholder:text-white/30" />
              <input type="tel" placeholder={L('contact.phone', lang)} className="bg-transparent border-b border-white/20 text-white py-3 px-1 text-sm focus:outline-none focus:border-[#e9c176] transition-colors placeholder:text-white/30" />
              <select className="bg-transparent border-b border-white/20 text-white/50 py-3 px-1 text-sm focus:outline-none focus:border-[#e9c176] transition-colors">
                <option value="">{L('contact.interest', lang)}</option>
                <option value="vacation">{L('editorial.vacation_rentals', lang)}</option>
                <option value="sale">{L('editorial.for_sale', lang)}</option>
                <option value="long_term">{L('editorial.long_term', lang)}</option>
              </select>
              <textarea placeholder={L('contact.message', lang)} rows={3} className="bg-transparent border-b border-white/20 text-white py-3 px-1 text-sm focus:outline-none focus:border-[#e9c176] transition-colors placeholder:text-white/30 resize-none" />
              <button type="submit" className="mt-4 py-4 font-bold uppercase text-sm tracking-widest hover:opacity-90 transition-opacity" style={{ background: COLORS.gold, color: '#261900' }}>
                {L('contact.send', lang)}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 w-full py-12 md:py-16 px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-screen-2xl mx-auto items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-white" />
              <h3 className="text-xl md:text-2xl font-bold text-white" style={serif}>{bizName}</h3>
            </div>
            <p className="text-slate-400 text-xs md:text-sm max-w-sm">© {new Date().getFullYear()} {bizName} · Powered by <a href="https://habibook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9c176] transition-colors">HabiBook</a></p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8 md:justify-end">
            {vacation.length > 0 && <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#vacacional">{L('editorial.vacation_rentals', lang)}</a>}
            {sales.length > 0 && <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#venta">{L('editorial.for_sale', lang)}</a>}
            {longTerm.length > 0 && <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#alquiler">{L('editorial.long_term', lang)}</a>}
            <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#agente">{L('nav.about', lang)}</a>
            {agent.phone && <a className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1" href={`tel:${agent.phone}`}><Phone className="w-3 h-3" />{agent.phone}</a>}
            {agent.email && <a className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1" href={`mailto:${agent.email}`}><Mail className="w-3 h-3" />{agent.email}</a>}
          </div>
        </div>
      </footer>
    </div>
  )
}
