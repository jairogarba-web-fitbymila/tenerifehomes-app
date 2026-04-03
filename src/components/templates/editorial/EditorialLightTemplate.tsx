'use client'

import { useState } from 'react'
import { Phone, Mail, Star, MapPin, Bed, Bath, Ruler, ChevronRight, Globe, Instagram, Facebook, Linkedin, Youtube, Menu, X } from 'lucide-react'
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

const C = { primary: '#000d22', container: '#002349', gold: '#e9c176', goldLight: '#ffdea5', surface: '#f8f9fa', surfaceLow: '#f3f4f5', text: '#191c1d', secondary: '#51606b', outline: '#74777f' }
const serif = { fontFamily: 'Noto Serif, Georgia, serif' }
const sans = { fontFamily: 'Manrope, system-ui, sans-serif' }

export default function EditorialLightTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { agent, properties, hero, services, testimonials } = data

  const heroImg = hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const headline = hero?.headline || hero?.title || agent.business_name || agent.full_name
  const subtitle = hero?.subtitle || L('hero.subtitle', lang)
  const saleProps = properties.filter(p => p.operation_type === 'sale')
  const rentProps = properties.filter(p => p.operation_type !== 'sale')

  const badgeLabel = (badge: string) => {
    const map: Record<string, string> = { exclusive: L('properties.exclusive', lang), new: L('properties.new', lang), reduced: L('properties.reduced', lang) }
    return map[badge] || badge
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
    setScrollProgress(progress)
  }

  const socialIcons: Record<string, React.ReactNode> = { instagram: <Instagram className="w-4 h-4" />, facebook: <Facebook className="w-4 h-4" />, linkedin: <Linkedin className="w-4 h-4" />, youtube: <Youtube className="w-4 h-4" /> }

  return (
    <div className="relative antialiased" style={{ ...sans, backgroundColor: C.surface, color: C.text }} onScroll={handleScroll}>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-[3px] z-[100]" style={{ width: `${scrollProgress}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.primary})`, transition: 'width 0.1s' }} />

      {/* Mobile Menu Overlay */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-white transition-transform duration-500" style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6"><X className="w-8 h-8" style={{ color: C.text }} /></button>
        {['properties', 'about', 'services', 'contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)} className="text-3xl font-light tracking-widest capitalize transition-colors" style={{ ...serif, color: C.secondary }}>{L(`nav.${s}`, lang)}</a>
        ))}
      </div>

      {/* Glass Nav */}
      <header className="fixed top-0 w-full z-50" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
        <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <button onClick={() => setMenuOpen(true)} className="md:hidden"><Menu className="w-6 h-6" style={{ color: C.text }} /></button>
            <a href="#hero" className="text-xl md:text-2xl italic transition-colors" style={{ ...serif, color: C.text }}>{agent.business_name || agent.full_name}</a>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            {[{ href: '#properties', label: L('nav.properties', lang) }, { href: '#about', label: L('nav.about', lang) }, { href: '#services', label: L('nav.services', lang) }].map(l => (
              <a key={l.href} href={l.href} className="text-sm transition-colors hover:opacity-100" style={{ color: C.secondary }}>{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden md:block text-xs uppercase tracking-widest px-5 py-2.5 border transition-all hover:text-white" style={{ color: C.primary, borderColor: 'rgba(0,13,34,0.2)', backgroundColor: 'transparent' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.primary; e.currentTarget.style.color = '#fff' }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = C.primary }}>
              {L('nav.contact', lang)}
            </a>
            {agent.photo && <img src={agent.photo} alt={agent.full_name} className="w-10 h-10 rounded-full object-cover" style={{ border: `1px solid ${C.outline}30` }} />}
          </div>
        </nav>
      </header>

      <main className="pt-20 md:pt-24">

        {/* HERO */}
        <section id="hero" className="relative flex items-center px-6 md:px-8 overflow-hidden" style={{ height: '85vh', minHeight: 600 }}>
          <div className="absolute inset-0 z-0">
            <img src={heroImg} alt={headline} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,13,34,0.6), rgba(0,13,34,0.3), transparent)' }} />
          </div>
          <div className="relative z-10 max-w-4xl">
            <p className="uppercase tracking-[0.3em] mb-6 text-sm font-bold" style={{ color: C.gold }}>{subtitle}</p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl text-white font-bold leading-[1.05] mb-8 tracking-tighter" style={serif}>
              {headline.split(' ').map((w, i, a) => i === a.length - 1 ? <span key={i} className="italic font-normal">{w}</span> : <span key={i}>{w} </span>)}
            </h1>
            <a href="#properties" className="inline-block bg-white px-10 py-5 text-xs font-bold uppercase tracking-widest transition-all duration-300" style={{ color: C.primary, boxShadow: '0 24px 48px rgba(0,13,34,0.06)' }}>
              {hero?.cta_text || L('hero.cta', lang)}
            </a>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <ChevronRight className="w-6 h-6 text-white rotate-90" />
          </div>
        </section>

        {/* BENTO GRID - Properties */}
        <section id="properties" className="px-6 md:px-8 py-16 md:py-24 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold" style={{ color: C.container }}>{L('properties.featured', lang)}</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 tracking-tight" style={{ ...serif, color: C.primary }}>{L('properties.title', lang)}</h2>
            </div>
          </div>

          {/* Bento asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            {saleProps.slice(0, 2).map((p, i) => {
              const img = p.images?.[0] || '/images/property-placeholder.jpg'
              const span = i === 0 ? 'md:col-span-8' : 'md:col-span-4'
              const h = i === 0 ? 500 : 500
              return (
                <div key={p.id || `sale-${i}`} className={`${span} group relative overflow-hidden cursor-pointer`} style={{ height: h, transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
                  <img src={img} alt={tc(translations, 'properties', p.id, 'title', p.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[#000d22]/20 group-hover:bg-[#000d22]/40 transition-colors duration-500" />
                  {p.badge && <span className="absolute top-6 left-6 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold" style={{ background: C.goldLight, color: '#261900' }}>{badgeLabel(p.badge)}</span>}
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2" style={serif}>{tc(translations, 'properties', p.id, 'title', p.title)}</h3>
                    <p className="opacity-80 mb-3 text-sm">{p.location}</p>
                    <span className="text-lg font-bold">{formatPrice(p.price)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
            {properties.slice(0, 6).map((p, i) => {
              const img = p.images?.[0] || '/images/property-placeholder.jpg'
              return (
                <div key={p.id || i} className="group cursor-pointer" style={{ transition: 'transform 0.4s ease, box-shadow 0.4s ease' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
                  <div className="relative overflow-hidden mb-6" style={{ height: 400 }}>
                    <img src={img} alt={tc(translations, 'properties', p.id, 'title', p.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {p.badge && <span className="absolute top-6 left-6 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold" style={{ background: C.goldLight, color: '#261900' }}>{badgeLabel(p.badge)}</span>}
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold mb-1" style={{ ...serif, color: C.primary }}>{tc(translations, 'properties', p.id, 'title', p.title)}</h4>
                  <p className="text-sm mb-4" style={{ color: C.secondary }}>{p.location}{(p.area_m2 || p.size_m2) ? ` · ${p.area_m2 || p.size_m2} m²` : ''}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold" style={{ ...serif, color: C.primary }}>{formatPrice(p.price)}</span>
                    <div className="flex-grow" style={{ height: 1, background: 'rgba(196,198,207,0.3)' }} />
                    <span className="text-[10px] uppercase tracking-wider whitespace-nowrap" style={{ color: C.secondary }}>
                      {p.bedrooms ? `${p.bedrooms} ${L('properties.beds', lang)}` : ''}{p.bathrooms ? ` · ${p.bathrooms} ${L('properties.baths', lang)}` : ''}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 md:py-32 overflow-hidden" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-screen-2xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-20">
            <div className="relative mx-auto md:mx-0 max-w-md">
              {agent.photo && (
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-[200px] h-[200px] border" style={{ borderColor: 'rgba(196,198,207,0.25)' }} />
                  <div className="relative z-10 bg-white p-3 md:p-4" style={{ boxShadow: '0 24px 48px rgba(0,13,34,0.06)', transform: 'rotate(-1deg)', transition: 'transform 0.7s' }}>
                    <img src={agent.photo} alt={agent.full_name} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-full h-full z-[-1]" style={{ background: 'rgba(0,35,73,0.06)' }} />
                </div>
              )}
            </div>
            <div className="space-y-6 md:space-y-8">
              <span className="text-xs uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('about.title', lang)}</span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight" style={{ ...serif, color: C.primary }}>{agent.full_name}</h2>
              {agent.quote && <p className="text-lg italic leading-relaxed" style={{ color: C.secondary }}>&ldquo;{agent.quote}&rdquo;</p>}
              {agent.bio && <p className="text-sm leading-relaxed" style={{ color: C.secondary }}>{agent.bio}</p>}
              {agent.location && <p className="text-sm" style={{ color: C.secondary }}><MapPin className="w-4 h-4 inline mr-1" />{agent.location}</p>}
              {agent.languages && agent.languages.length > 0 && (
                <div className="flex items-center gap-2 text-xs" style={{ color: C.secondary }}><Globe className="w-4 h-4" style={{ color: C.primary }} />{agent.languages.join(' / ')}</div>
              )}
              <div className="grid grid-cols-3 gap-6 pt-4">
                {agent.experience_years && <div className="text-center md:text-left"><span className="text-3xl font-bold block" style={{ color: C.primary }}>{agent.experience_years}+</span><span className="text-[10px] uppercase tracking-widest" style={{ color: C.secondary }}>{L('about.years', lang)}</span></div>}
                {agent.stats && Object.entries(agent.stats).slice(0, 2).map(([k, v]) => (
                  <div key={k} className="text-center md:text-left"><span className="text-3xl font-bold block" style={{ color: C.primary }}>{v}</span><span className="text-[10px] uppercase tracking-widest" style={{ color: C.secondary }}>{k}</span></div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href="#contact" className="text-white px-8 py-4 text-xs uppercase tracking-widest text-center transition-colors" style={{ backgroundColor: C.primary }}>{L('contact.cta', lang)}</a>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        {services && services.length > 0 && (
          <section id="services" className="py-16 md:py-24 px-6 md:px-8 max-w-screen-2xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.4em] mb-6 block" style={{ color: C.gold }}>{L('services.title', lang)}</span>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ ...serif, color: C.primary }}>{L('services.title', lang)}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.slice(0, 6).map((s, i) => (
                <div key={s.id || i} className="p-8 border transition-all hover:shadow-lg" style={{ borderColor: `${C.outline}30`, backgroundColor: '#fff' }}>
                  <span className="text-3xl font-bold block mb-4" style={{ ...serif, color: C.gold, opacity: 0.4 }}>0{i + 1}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: C.primary }}>{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                  {s.description && <p className="text-sm leading-relaxed" style={{ color: C.secondary }}>{tc(translations, 'services', s.id, 'description', s.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TESTIMONIALS */}
        {testimonials && testimonials.length > 0 && (
          <section className="py-16 md:py-24 px-6 md:px-8" style={{ backgroundColor: C.surfaceLow }}>
            <div className="max-w-screen-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center" style={{ ...serif, color: C.primary }}>{L('testimonials.title', lang)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.slice(0, 3).map((tm, i) => (
                  <div key={tm.id || i} className="bg-white p-8" style={{ boxShadow: '0 24px 48px rgba(0,13,34,0.06)' }}>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: tm.rating || 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" style={{ color: C.gold }} />)}
                    </div>
                    <p className="text-sm italic leading-relaxed mb-6" style={{ color: C.secondary }}>&ldquo;{tm.quote || tm.text}&rdquo;</p>
                    <p className="text-sm font-bold" style={{ color: C.primary }}>{tm.client_name || tm.author}</p>
                    {tm.client_location && <p className="text-xs" style={{ color: C.outline }}>{tm.client_location}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="py-24 md:py-32 px-6 md:px-8 text-center relative overflow-hidden" style={{ backgroundColor: C.primary }}>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-8 leading-tight" style={serif}>
              {L('contact.headline', lang)}
            </h2>
            <p className="text-base md:text-lg mb-12" style={{ color: '#718bb7' }}>{L('contact.description', lang)}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-3 border border-white/20 text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4" />{agent.phone}
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} className="flex items-center justify-center gap-3 px-8 py-4 text-xs uppercase tracking-widest font-bold transition-colors" style={{ backgroundColor: C.gold, color: '#261900' }}>
                  WhatsApp
                </a>
              )}
            </div>
            {agent.email && (
              <a href={`mailto:${agent.email}`} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest">
                <Mail className="w-4 h-4" />{agent.email}
              </a>
            )}
            {agent.location && (
              <div className="mt-6">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(agent.location)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />{agent.location}
                </a>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-10 md:py-12 px-6 md:px-8 flex flex-col md:flex-row justify-between items-center border-t border-white/5" style={{ backgroundColor: C.primary }}>
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <span className="italic text-white text-xl" style={serif}>{agent.business_name || agent.full_name}</span>
          {agent.city && <p className="text-[10px] tracking-widest uppercase mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>{agent.city}</p>}
        </div>
        <div className="flex gap-6 items-center">
          {[Instagram, Facebook, Linkedin, Youtube].map((Icon, i) => (
            <span key={i} className="text-white/30 hover:text-white transition-colors cursor-pointer"><Icon className="w-4 h-4" /></span>
          ))}
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>Powered by <a href="https://habibook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">HabiBook</a></span>
        </div>
      </footer>
    </div>
  )
}
