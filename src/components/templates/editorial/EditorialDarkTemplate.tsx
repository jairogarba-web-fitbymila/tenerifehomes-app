'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare, Star, MapPin, Bed, Bath, Ruler, ChevronRight, Globe, Home, Instagram, Facebook, Linkedin, Youtube, Menu, X } from 'lucide-react'
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

export default function EditorialDarkTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('sale')
  const { agent, properties, hero, services } = data

  const badgeLabel = (badge: string) => {
    const map: Record<string, string> = { exclusive: L('properties.exclusive', lang), new: L('properties.new', lang), reduced: L('properties.reduced', lang) }
    return map[badge] || badge
  }

  const saleProps = properties.filter(p => p.operation_type === 'sale')
  const rentProps = properties.filter(p => p.operation_type !== 'sale')
  const activeProps = activeTab === 'sale' ? saleProps : rentProps
  const heroImg = hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const headline = hero?.headline || hero?.title || agent.business_name || agent.full_name
  const subtitle = hero?.subtitle || L('hero.subtitle', lang)
  const sections = ['hero', 'properties', 'about', 'services', 'contact']

  return (
    <div className="relative text-white antialiased" style={{ ...sans, backgroundColor: COLORS.primary, scrollSnapType: 'y mandatory', overflowY: 'scroll', height: '100vh' }}>

      {/* Mobile Menu Overlay */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500" style={{ background: 'rgba(0,13,34,0.97)', backdropFilter: 'blur(30px)', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6"><X className="w-8 h-8 text-white" /></button>
        {['hero', 'properties', 'about', 'services', 'contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)} className="text-3xl font-light tracking-widest text-white/70 hover:text-[#e9c176] transition-colors capitalize">{s}</a>
        ))}
      </div>

      {/* Section Dots */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3" style={{ mixBlendMode: 'difference' }}>
        {sections.map((s, i) => (
          <a key={s} href={`#${s}`} className="w-2 h-2 rounded-full transition-all duration-300 hover:scale-150" style={{ background: i === 0 ? COLORS.gold : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/10" style={{ background: 'rgba(0,13,34,0.6)', backdropFilter: 'blur(24px)' }}>
        <nav className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-6">
            <button onClick={() => setMenuOpen(true)} className="md:hidden"><Menu className="w-6 h-6 text-white" /></button>
            <a href="#hero" className="text-xl italic text-white tracking-tight hover:text-[#e9c176] transition-colors" style={serif}>{agent.business_name || agent.full_name}</a>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            {[{ href: '#properties', label: L('nav.properties', lang) }, { href: '#about', label: L('nav.about', lang) }, { href: '#services', label: L('nav.services', lang) }].map(l => (
              <a key={l.href} href={l.href} className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-[#e9c176] transition-colors">{l.label}</a>
            ))}
          </div>
          <a href="#contact" className="hidden md:block text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors" style={{ color: COLORS.gold, borderColor: 'rgba(233,193,118,0.3)' }}>{L('nav.contact', lang)}</a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section id="hero" className="relative flex items-center justify-center text-center" style={{ scrollSnapAlign: 'start', height: '100vh', overflow: 'hidden' }}>
          <div className="absolute inset-0">
            <img src={heroImg} alt={headline} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,13,34,0.3), rgba(0,13,34,0.4), rgba(0,13,34,0.7))' }} />
          </div>
          <div className="relative z-10 px-6">
            <h1 className="text-6xl sm:text-7xl md:text-[10rem] text-white font-bold leading-none tracking-tighter mb-6" style={serif}>
              {headline.split(' ').map((w, i) => i === headline.split(' ').length - 1 ? <span key={i} className="italic font-light">{w}</span> : w + ' ')}
            </h1>
            <p className="uppercase tracking-[0.5em] text-sm mb-12" style={{ color: COLORS.gold }}>{subtitle}</p>
            <a href="#properties" className="inline-block border border-white/30 text-white px-12 py-5 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-[#000d22] transition-all duration-500" style={{ backdropFilter: 'blur(8px)' }}>
              {hero?.cta_text || L('hero.cta', lang)}
            </a>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <ChevronRight className="w-8 h-8 text-white rotate-90" />
          </div>
        </section>

        {/* PROPERTIES */}
        <section id="properties" className="relative p-8 md:p-16 flex flex-col" style={{ scrollSnapAlign: 'start', height: '100vh', overflow: 'hidden', backgroundColor: COLORS.container }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
            <h2 className="text-4xl md:text-5xl text-white font-bold tracking-tighter" style={serif}>
              Featured<br /><span className="italic font-light opacity-60">Portfolio.</span>
            </h2>
            <div className="flex gap-4">
              {[{ key: 'sale', label: L('properties.sale', lang) }, { key: 'rent', label: L('properties.rent', lang) }].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="text-xs uppercase tracking-[0.3em] px-4 py-2 border transition-all duration-300" style={{ color: activeTab === tab.key ? COLORS.primary : 'rgba(255,255,255,0.6)', backgroundColor: activeTab === tab.key ? COLORS.gold : 'transparent', borderColor: activeTab === tab.key ? COLORS.gold : 'rgba(255,255,255,0.2)' }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 md:gap-6 flex-1 min-h-0 overflow-hidden">
            {activeProps.slice(0, 4).map((p, i) => {
              const img = p.images?.[0] || '/images/property-placeholder.jpg'
              const span = i === 0 ? 'col-span-12 md:col-span-5 md:row-span-2' : i === 1 ? 'col-span-12 md:col-span-7' : 'col-span-6 md:col-span-3'
              return (
                <div key={p.id || i} className={`${span} relative group overflow-hidden cursor-pointer`} style={{ minHeight: i === 0 ? 300 : 180, transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
                  <img src={img} alt={tc(translations, 'properties', p.id, 'title', p.title)} className="w-full h-full object-cover transition-transform duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,13,34,0.9) 0%, rgba(0,13,34,0.4) 40%, transparent 70%)' }} />
                  {p.badge && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold" style={{ color: COLORS.gold, background: 'rgba(233,193,118,0.15)', border: '1px solid rgba(233,193,118,0.3)', backdropFilter: 'blur(10px)' }}>{badgeLabel(p.badge)}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg font-bold mb-1">{tc(translations, 'properties', p.id, 'title', p.title)}</h3>
                    {p.location && <p className="text-white/50 text-xs mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>}
                    <div className="flex items-center gap-3 text-white/40 text-xs mb-2">
                      {p.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
                      {p.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                      {(p.area_m2 || p.size_m2) && <span className="flex items-center gap-1"><Ruler className="w-3 h-3" />{p.area_m2 || p.size_m2} m&sup2;</span>}
                    </div>
                    <p className="font-bold" style={{ color: COLORS.gold }}>{formatPrice(p.price)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ABOUT AGENT */}
        <section id="about" className="relative flex items-center" style={{ scrollSnapAlign: 'start', height: '100vh', overflow: 'hidden', backgroundColor: COLORS.primary }}>
          <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full opacity-30 md:opacity-100">
            <div className="relative h-full w-full overflow-hidden">
              {agent.photo && <img src={agent.photo} alt={agent.full_name} className="absolute bottom-0 right-0 h-[110%] w-auto object-cover object-bottom grayscale hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]" />}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #000d22, rgba(0,13,34,0.5), transparent)' }} />
            </div>
          </div>
          <div className="relative z-20 px-8 md:px-16 w-full md:w-1/2">
            <span className="uppercase tracking-[0.4em] text-xs mb-8 block" style={{ color: COLORS.gold }}>{L('about.title', lang)}</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-white font-bold mb-8 leading-tight" style={serif}>
              {agent.full_name.split(' ')[0]}<span className="italic font-light opacity-60">{agent.full_name.split(' ').slice(1).join(' ') ? ' ' + agent.full_name.split(' ').slice(1).join(' ') : ''}</span>
            </h2>
            {agent.quote && <p className="text-white/50 text-lg md:text-xl italic max-w-lg mb-8">&ldquo;{agent.quote}&rdquo;</p>}
            {agent.bio && <p className="text-white/40 text-sm max-w-lg mb-10 leading-relaxed">{agent.bio}</p>}
            {agent.languages && agent.languages.length > 0 && (
              <div className="flex items-center gap-2 mb-10 text-white/40 text-xs"><Globe className="w-4 h-4" style={{ color: COLORS.gold }} />{agent.languages.join(' / ')}</div>
            )}
            <div className="flex gap-12 opacity-60">
              {agent.experience_years && <div><span className="text-3xl font-bold text-white block">{agent.experience_years}+</span><span className="text-[10px] uppercase tracking-widest text-white/50">{L('about.years', lang)}</span></div>}
              {agent.stats && Object.entries(agent.stats).slice(0, 2).map(([k, v]) => (
                <div key={k}><span className="text-3xl font-bold text-white block">{v}</span><span className="text-[10px] uppercase tracking-widest text-white/50">{k}</span></div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        {services && services.length > 0 && (
          <section id="services" className="relative flex items-center justify-center" style={{ scrollSnapAlign: 'start', height: '100vh', overflow: 'hidden', backgroundColor: COLORS.primary }}>
            <div className="w-full max-w-6xl px-8 md:px-16">
              <div className="text-center mb-16">
                <span className="uppercase tracking-[0.4em] text-xs mb-6 block" style={{ color: COLORS.gold }}>{L('services.title', lang)}</span>
                <h2 className="text-4xl md:text-6xl text-white font-bold" style={serif}>Our <span className="italic font-light opacity-60">Services.</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.slice(0, 6).map((s, i) => (
                  <div key={s.id || i} className="border border-white/10 p-8 hover:border-[#e9c176]/30 transition-colors group">
                    <span className="text-3xl font-bold block mb-4" style={{ ...serif, color: COLORS.gold, opacity: 0.4 }}>0{i + 1}</span>
                    <h3 className="text-white text-lg font-bold mb-3 uppercase tracking-wider text-sm">{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                    {s.description && <p className="text-white/40 text-sm leading-relaxed">{tc(translations, 'services', s.id, 'description', s.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="relative flex flex-col justify-between p-8 md:p-16" style={{ scrollSnapAlign: 'start', height: '100vh', overflow: 'hidden', backgroundColor: COLORS.primary }}>
          <div className="flex-1 flex items-center">
            <div className="text-center max-w-4xl mx-auto w-full">
              <span className="uppercase tracking-[0.4em] text-xs mb-8 block" style={{ color: COLORS.gold }}>{L('contact.getInTouch', lang)}</span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-12 leading-none" style={serif}>
                {L('contact.headline', lang).split(' ').map((w, i, a) => i === 1 ? <span key={i} className="italic font-light opacity-50">{w} </span> : w + (i < a.length - 1 ? ' ' : ''))}
              </h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-white/40 hover:text-[#e9c176] transition-colors">
                    <Phone className="w-5 h-5" /><span className="text-xs uppercase tracking-widest">{agent.phone}</span>
                  </a>
                )}
                {agent.whatsapp && (
                  <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-3 text-white/40 hover:text-[#e9c176] transition-colors">
                    <MessageSquare className="w-5 h-5" /><span className="text-xs uppercase tracking-widest">WhatsApp</span>
                  </a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-white/40 hover:text-[#e9c176] transition-colors">
                    <Mail className="w-5 h-5" /><span className="text-xs uppercase tracking-widest">{agent.email}</span>
                  </a>
                )}
              </div>
              {agent.location && (
                <a href={`https://maps.google.com/?q=${encodeURIComponent(agent.location)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/30 hover:text-[#e9c176] transition-colors text-xs uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />{agent.location}
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="pt-12 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-white/5 mt-auto">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <span className="italic text-white text-2xl" style={serif}>{agent.business_name || agent.full_name}</span>
              {agent.city && <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mt-3">{agent.city}</p>}
            </div>
            <div className="flex gap-6 items-center">
              <span className="text-[10px] uppercase tracking-widest text-white/20">Powered by <a href="https://habibook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9c176] transition-colors">HabiBook</a></span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  )
}
