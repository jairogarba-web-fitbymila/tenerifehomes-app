'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare, Star, MapPin, Bed, Bath, Ruler, Menu, X, Share2, Globe, Home } from 'lucide-react'
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

const C = { primary: '#000d22', container: '#002349', gold: '#e9c176', goldLight: '#ffdea5', surface: '#f8f9fa', surfaceLow: '#f3f4f5', surfaceHigh: '#e7e8e9', onSurface: '#191c1d', onSurfaceVar: '#43474e', secondary: '#51606b', outline: '#74777f', outlineVar: '#c4c6cf' }
const serif = { fontFamily: 'Noto Serif, Georgia, serif' }
const sans = { fontFamily: 'Manrope, system-ui, sans-serif' }

export default function EditorialAgentTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [formSent, setFormSent] = useState(false)
  const { agent, properties, hero, services, testimonials } = data

  const heroImg = agent.photo || hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const bioImg = agent.bio_photo_url || agent.photo || heroImg
  const headline = hero?.headline || hero?.title || L('hero.title', lang)
  const subtitle = hero?.subtitle || L('hero.subtitle', lang)
  const agentName = agent.full_name
  const bizName = agent.business_name || agentName
  const years = agent.experience_years || 10
  const stats = agent.stats || {}

  const badgeLabel = (b: string) => {
    const map: Record<string, string> = { exclusive: L('properties.exclusive', lang), new: L('properties.new', lang), reduced: L('properties.reduced', lang) }
    return map[b] || b
  }

  const featured = properties[0]
  const secondary = properties.slice(1, 3)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
  }

  return (
    <div className="relative antialiased" style={{ ...sans, backgroundColor: C.surface, color: C.onSurface }} onScroll={handleScroll}>
      {/* Scroll progress */}
      <div className="fixed top-0 left-0 h-[3px] z-[100] transition-[width]" style={{ width: `${scrollPct}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.primary})` }} />

      {/* Mobile Menu */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-7 transition-transform duration-500" style={{ background: 'rgba(248,249,250,0.98)', backdropFilter: 'blur(24px)', transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-7 right-6"><X className="w-7 h-7" style={{ color: C.onSurface }} /></button>
        {['hero', 'about', 'properties', 'services', 'contact'].map(s => (
          <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)} className="text-3xl font-light tracking-widest capitalize transition-colors" style={{ color: C.onSurfaceVar }}>{L(`nav.${s === 'hero' ? 'home' : s}`, lang) || s}</a>
        ))}
      </div>

      {/* Glass Nav */}
      <header className="fixed top-0 w-full z-50 h-20 md:h-24 flex items-center" style={{ background: 'rgba(248,249,250,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center w-full px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMenuOpen(true)}><Menu className="w-6 h-6" style={{ color: C.primary }} /></button>
            <a href="#hero" className="text-xl md:text-2xl font-bold tracking-tighter transition-colors" style={{ ...serif, color: C.primary }}>{bizName}</a>
          </div>
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {[{ href: '#properties', label: L('nav.properties', lang) }, { href: '#about', label: L('nav.about', lang) }, { href: '#services', label: L('nav.services', lang) }, { href: '#contact', label: L('nav.contact', lang) }].map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: C.secondary }}>{l.label}</a>
            ))}
          </nav>
          <a href="#contact" className="text-white px-6 md:px-8 py-3 text-xs uppercase tracking-widest font-bold transition-colors hover:opacity-90" style={{ backgroundColor: C.primary }}>{L('nav.contact', lang)}</a>
        </div>
      </header>

      <main className="pt-20 md:pt-24">
        {/* HERO */}
        <section id="hero" className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden" style={{ backgroundColor: C.primary }}>
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover opacity-50 object-right-top" style={{ mixBlendMode: 'luminosity' }} alt={agentName} src={heroImg} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${C.primary}, ${C.primary}cc, transparent)` }} />
          </div>
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto">
            <div className="max-w-2xl space-y-6 md:space-y-8">
              <span className="block text-xs md:text-sm uppercase tracking-[0.3em]" style={{ color: C.gold }}>{subtitle}</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tighter" style={serif}>{headline}</h1>
              <p className="text-lg md:text-xl max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{agent.bio?.slice(0, 160) || subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="#properties" className="px-8 md:px-10 py-4 md:py-5 font-bold uppercase tracking-widest text-xs text-center transition-colors hover:bg-white" style={{ backgroundColor: C.gold, color: C.primary }}>{L('nav.properties', lang)}</a>
                <a href="#about" className="border border-white/20 text-white px-8 md:px-10 py-4 md:py-5 font-bold uppercase tracking-widest text-xs text-center transition-all hover:bg-white hover:text-[#000d22]">{L('nav.about', lang)}</a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-20 md:py-32" style={{ backgroundColor: C.surface }}>
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="lg:w-5/12 relative">
                <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: C.surfaceHigh }}>
                  <img className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700" alt={agentName} src={bioImg} />
                </div>
                <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-8 p-6 md:p-10 shadow-2xl" style={{ backgroundColor: C.gold, animation: 'floatBadge 3s ease-in-out infinite' }}>
                  <span className="block text-3xl md:text-4xl font-bold" style={{ ...serif, color: C.primary }}>{years}+</span>
                  <span className="block text-[10px] md:text-xs uppercase tracking-widest opacity-80" style={{ color: C.primary }}>{L('agent.years', lang)}</span>
                </div>
              </div>
              <div className="lg:w-7/12 space-y-6 md:space-y-8">
                <span className="text-xs md:text-sm uppercase tracking-[0.2em]" style={{ color: C.secondary }}>{L('about.title', lang)}</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight" style={{ ...serif, color: C.primary }}>{agent.quote || L('about.headline', lang)}</h2>
                <div className="space-y-5 text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: C.onSurfaceVar }}>
                  <p>{tc(translations, 'agents', agent.slug, 'bio', agent.bio || '')}</p>
                </div>
                <div className="pt-6 max-w-md" style={{ borderTop: `1px solid ${C.outlineVar}40` }}>
                  <p className="text-2xl italic mb-2" style={{ ...serif, color: `${C.primary}99` }}>{agentName}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{agent.location || 'Tenerife'}</p>
                </div>
                {Object.keys(stats).length > 0 && (
                  <div className="grid grid-cols-3 gap-6 pt-4">
                    {Object.entries(stats).slice(0, 3).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-2xl md:text-3xl font-bold block" style={{ color: C.primary }}>{v}</span>
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: C.secondary }}>{k}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PROPERTIES BENTO */}
        <section id="properties" className="py-20 md:py-32" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
              <div>
                <span className="text-xs md:text-sm uppercase tracking-[0.2em]" style={{ color: C.secondary }}>{L('properties.featured', lang)}</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl mt-3" style={{ ...serif, color: C.primary }}>{L('nav.properties', lang)}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
              {featured && (
                <div className="md:col-span-8 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={featured.title} src={featured.images?.[0] || '/images/property-placeholder.jpg'} />
                  </div>
                  <div className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      {featured.badge && <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-3 inline-block" style={{ backgroundColor: C.gold, color: C.primary }}>{badgeLabel(featured.badge)}</span>}
                      <h3 className="text-2xl md:text-3xl mb-1" style={{ ...serif, color: C.primary }}>{tc(translations, 'properties', featured.id, 'title', featured.title)}</h3>
                      <p className="text-sm flex items-center gap-1" style={{ color: C.secondary }}><MapPin className="w-3.5 h-3.5" />{featured.location} {featured.area_m2 || featured.size_m2 ? `· ${featured.area_m2 || featured.size_m2} m²` : ''}</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-2xl md:text-3xl" style={{ ...serif, color: C.primary }}>{formatPrice(featured.price)}</p>
                      <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: C.secondary }}>{featured.bedrooms ? `${featured.bedrooms} Hab` : ''} {featured.bathrooms ? `· ${featured.bathrooms} ${L('property.bathrooms', lang)}` : ''}</p>
                    </div>
                  </div>
                </div>
              )}
              {secondary.map((p, i) => (
                <div key={p.id || i} className="md:col-span-4 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                  <div className="aspect-square overflow-hidden">
                    <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={p.title} src={p.images?.[0] || '/images/property-placeholder.jpg'} />
                  </div>
                  <div className="p-6 md:p-8">
                    {p.badge && <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-3 inline-block" style={{ backgroundColor: C.surfaceHigh, color: C.secondary }}>{badgeLabel(p.badge)}</span>}
                    <h3 className="text-lg md:text-xl mb-2" style={{ ...serif, color: C.primary }}>{tc(translations, 'properties', p.id, 'title', p.title)}</h3>
                    <p className="text-xs mb-3 flex items-center gap-1" style={{ color: C.secondary }}><MapPin className="w-3 h-3" />{p.location} {p.area_m2 || p.size_m2 ? `· ${p.area_m2 || p.size_m2} m²` : ''}</p>
                    <p className="text-xl md:text-2xl" style={{ ...serif, color: p.operation_type === 'sale' ? C.primary : C.gold }}>{formatPrice(p.price)}</p>
                  </div>
                </div>
              ))}
              {/* CTA card */}
              {properties.length > 3 && (
                <div className="md:col-span-8 relative p-8 md:p-12 flex flex-col justify-center overflow-hidden" style={{ backgroundColor: C.container, minHeight: 240 }}>
                  <div className="max-w-md relative z-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] mb-4 md:mb-6 block" style={{ color: C.gold }}>{L('contact.title', lang)}</span>
                    <h3 className="text-2xl md:text-4xl text-white mb-4 md:mb-6" style={serif}>{L('contact.cta', lang)}</h3>
                    <a href="#contact" className="inline-block bg-white px-6 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs transition-colors" style={{ color: C.primary }}>{L('nav.contact', lang)}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        {services && services.length > 0 && (
          <section id="services" className="py-20 md:py-32" style={{ backgroundColor: C.surface }}>
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-20 md:mb-32">
                {services.slice(0, 3).map((s, i) => (
                  <div key={s.id || i} className="space-y-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center" style={{ backgroundColor: C.surfaceHigh, color: C.primary }}>
                      <Home className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <h3 className="text-xl md:text-2xl" style={{ ...serif, color: C.primary }}>{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                    <p className="leading-relaxed text-sm md:text-base" style={{ color: C.onSurfaceVar }}>{tc(translations, 'services', s.id, 'description', s.description || '')}</p>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              {testimonials && testimonials.length > 0 && (
                <div className="p-8 md:p-12 lg:p-20 relative overflow-hidden" style={{ backgroundColor: C.primary }}>
                  <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white italic leading-relaxed" style={serif}>
                      &ldquo;{tc(translations, 'testimonials', testimonials[0].id, 'text', testimonials[0].text || testimonials[0].quote || '')}&rdquo;
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <p className="font-bold text-white uppercase tracking-[0.2em] text-xs md:text-sm">{testimonials[0].client_name || testimonials[0].author}</p>
                      {testimonials[0].client_location && <p className="text-white/40 text-xs">{testimonials[0].client_location}</p>}
                      <div className="flex gap-1 justify-center">
                        {Array.from({ length: testimonials[0].rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" style={{ color: C.gold }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="py-20 md:py-32 overflow-hidden" style={{ backgroundColor: C.surfaceLow }}>
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-24">
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-4 md:space-y-6">
                  <span className="text-xs md:text-sm uppercase tracking-[0.2em]" style={{ color: C.secondary }}>{L('contact.title', lang)}</span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ ...serif, color: C.primary }}>{L('contact.headline', lang)}</h2>
                  <p className="text-base md:text-lg leading-relaxed max-w-md" style={{ color: C.onSurfaceVar }}>{L('contact.description', lang)}</p>
                </div>
                <div className="space-y-5">
                  {agent.email && (
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-5 group">
                      <div className="w-10 h-10 border flex items-center justify-center transition-all group-hover:text-white" style={{ borderColor: `${C.outline}66` }}><Mail className="w-4 h-4" /></div>
                      <span className="text-sm font-medium tracking-wide" style={{ color: C.primary }}>{agent.email}</span>
                    </a>
                  )}
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-5 group">
                      <div className="w-10 h-10 border flex items-center justify-center transition-all group-hover:text-white" style={{ borderColor: `${C.outline}66` }}><Phone className="w-4 h-4" /></div>
                      <span className="text-sm font-medium tracking-wide" style={{ color: C.primary }}>{agent.phone}</span>
                    </a>
                  )}
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} className="flex items-center gap-5 group">
                      <div className="w-10 h-10 border flex items-center justify-center transition-all" style={{ borderColor: `${C.outline}66` }}><MessageSquare className="w-4 h-4" /></div>
                      <span className="text-sm font-medium tracking-wide" style={{ color: C.primary }}>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
              <div className="bg-white p-8 md:p-12 lg:p-16 shadow-xl" style={{ border: `1px solid ${C.outlineVar}1a` }}>
                <form className="space-y-6 md:space-y-8" onSubmit={e => { e.preventDefault(); setFormSent(true); setTimeout(() => setFormSent(false), 2500) }}>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('form.name', lang)}</label>
                    <input className="w-full border-0 border-b bg-transparent py-4 outline-none transition-colors focus:border-[#000d22]" style={{ borderBottomWidth: 1, borderColor: C.outlineVar, color: C.primary }} type="text" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('form.email', lang)}</label>
                    <input className="w-full border-0 border-b bg-transparent py-4 outline-none transition-colors focus:border-[#000d22]" style={{ borderBottomWidth: 1, borderColor: C.outlineVar, color: C.primary }} type="email" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('form.phone', lang)}</label>
                    <input className="w-full border-0 border-b bg-transparent py-4 outline-none transition-colors focus:border-[#000d22]" style={{ borderBottomWidth: 1, borderColor: C.outlineVar, color: C.primary }} type="tel" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('form.type', lang)}</label>
                    <select className="w-full border-0 border-b bg-transparent py-4 outline-none cursor-pointer" style={{ borderBottomWidth: 1, borderColor: C.outlineVar, color: C.primary }}>
                      <option value="buy">{L('form.buy', lang)}</option>
                      <option value="rent">{L('form.rent', lang)}</option>
                      <option value="invest">{L('form.invest', lang)}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest font-bold" style={{ color: C.secondary }}>{L('form.message', lang)}</label>
                    <textarea className="w-full border-0 border-b bg-transparent py-4 outline-none resize-none transition-colors focus:border-[#000d22]" style={{ borderBottomWidth: 1, borderColor: C.outlineVar, color: C.primary }} rows={4} />
                  </div>
                  <button type="submit" className="w-full text-white py-4 md:py-5 font-bold uppercase tracking-widest text-xs transition-colors hover:opacity-90" style={{ backgroundColor: C.primary }}>
                    {formSent ? L('form.sent', lang) : L('form.submit', lang)}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 md:py-20" style={{ backgroundColor: C.primary }}>
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 lg:px-16 max-w-[1920px] mx-auto gap-8">
          <div className="text-center md:text-left">
            <span className="text-xl text-white" style={serif}>{bizName}</span>
            <p className="text-[10px] tracking-widest uppercase mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{agent.city || agent.location || 'Tenerife'}</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
            {['properties', 'about', 'services'].map(s => (
              <a key={s} href={`#${s}`} className="text-[10px] tracking-widest uppercase transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{L(`nav.${s}`, lang)}</a>
            ))}
          </nav>
          <div className="flex gap-4">
            <Share2 className="w-5 h-5 cursor-pointer transition-colors hover:text-white" style={{ color: `${C.gold}99` }} />
            <Globe className="w-5 h-5 cursor-pointer transition-colors hover:text-white" style={{ color: `${C.gold}99` }} />
          </div>
        </div>
      </footer>

      {/* Float badge animation */}
      <style>{`@keyframes floatBadge { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }`}</style>
    </div>
  )
}
