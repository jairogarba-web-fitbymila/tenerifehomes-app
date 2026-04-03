'use client'

import { useState } from 'react'
import { Phone, Mail, MessageSquare, MapPin, Bed, Bath, Ruler, Globe, Menu, X, Home } from 'lucide-react'
import { TemplateData, TemplateTeamMember, formatPrice } from '../types'
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

const COLORS = { primary: '#000d22', container: '#002349', gold: '#e9c176', goldLight: '#ffdea5', surface: '#f8f9fa', surfaceLow: '#f3f4f5' }
const serif = { fontFamily: 'Noto Serif, Georgia, serif' }
const sans = { fontFamily: 'Manrope, system-ui, sans-serif' }

export default function EditorialTeamTemplate({ data, lang, translations }: TemplateProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { agent, properties, hero, services, team } = data

  const members: TemplateTeamMember[] = team && team.length > 0
    ? team
    : [{ name: agent.full_name, role: agent.bio || 'Agent', photo: agent.photo, photo_url: agent.bio_photo_url, languages: agent.languages }]

  const heroImg = hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const headline = hero?.headline || hero?.title || L('team.headline', lang)
  const subtitle = hero?.subtitle || agent.business_name || agent.full_name
  const bizName = agent.business_name || agent.full_name

  return (
    <div className="min-h-screen text-[#191c1d] antialiased" style={{ ...sans, backgroundColor: COLORS.surface }}>

      {/* Mobile Menu */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500" style={{ background: COLORS.primary, transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6"><X className="w-7 h-7 text-white" /></button>
        {[{ href: '#equipo', label: L('nav.about', lang) }, { href: '#propiedades', label: L('nav.properties', lang) }, { href: '#contacto', label: L('nav.contact', lang) }].map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-3xl text-white/70 hover:text-[#e9c176] transition-colors" style={serif}>{l.label}</a>
        ))}
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-white/50 text-sm mt-8">
            <Phone className="w-4 h-4" /> {agent.phone}
          </a>
        )}
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}>
        <nav className="flex justify-between items-center px-6 md:px-8 py-5 max-w-full mx-auto">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6" style={{ color: COLORS.primary }} />
            <span className="text-lg md:text-xl font-bold uppercase tracking-[0.15em]" style={{ color: COLORS.primary }}>{bizName}</span>
          </div>
          <div className="hidden md:flex gap-10 items-center">
            <a href="#propiedades" className="text-[#51606b] font-medium hover:text-[#000d22] transition-colors text-sm">{L('nav.properties', lang)}</a>
            <a href="#equipo" className="font-bold border-b-2 pb-1 text-sm" style={{ color: COLORS.primary, borderColor: COLORS.primary }}>{L('nav.about', lang)}</a>
            <a href="#contacto" className="text-[#51606b] font-medium hover:text-[#000d22] transition-colors text-sm">{L('nav.contact', lang)}</a>
          </div>
          <button onClick={() => setMenuOpen(true)} className="md:hidden"><Menu className="w-6 h-6" style={{ color: COLORS.primary }} /></button>
          <a href="#contacto" className="hidden md:inline-block text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity" style={{ backgroundColor: COLORS.primary }}>
            {L('nav.contact', lang)}
          </a>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative h-screen flex items-end justify-start overflow-hidden pt-24">
          <div className="absolute inset-0 z-0">
            <img src={heroImg} alt={headline} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,13,34,0.4) 0%, rgba(0,13,34,0.1) 50%, rgba(248,249,250,1) 100%)' }} />
          </div>
          <div className="relative z-10 px-6 md:px-8 pb-24 md:pb-32 max-w-7xl">
            <span className="block text-sm uppercase tracking-[0.2em] mb-4" style={{ color: COLORS.primary }}>{subtitle}</span>
            <h1 className="text-5xl md:text-7xl lg:text-9xl leading-none tracking-tighter max-w-4xl" style={{ ...serif, color: COLORS.primary }}>
              {headline}
            </h1>
            {hero?.subtitle && (
              <div className="mt-8 md:mt-12 flex items-center gap-8">
                <div className="hidden md:block h-[1px] w-32" style={{ backgroundColor: COLORS.primary }} />
                <p className="text-[#51606b] max-w-md text-base md:text-lg leading-relaxed">{hero.subtitle}</p>
              </div>
            )}
          </div>
        </section>

        {/* TEAM GALLERY */}
        <section id="equipo" className="py-20 md:py-32 px-6 md:px-8" style={{ backgroundColor: COLORS.surface }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
              <div className="max-w-2xl">
                <span className="text-xs uppercase tracking-[0.3em] px-3 py-1 mb-6 inline-block" style={{ color: '#a78541', backgroundColor: COLORS.goldLight }}>{L('team.badge', lang)}</span>
                <h2 className="text-4xl md:text-5xl lg:text-7xl tracking-tight" style={{ ...serif, color: COLORS.primary }}>{L('team.title', lang)}</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-px" style={{ backgroundColor: 'rgba(196,198,207,0.2)' }}>
              {members.slice(0, 3).map((m, i) => {
                const photo = m.photo || m.photo_url || '/images/agent-placeholder.jpg'
                const isCenter = i === 1
                return (
                  <div key={m.id || i} className={`bg-white group cursor-pointer overflow-hidden pb-8 md:pb-12 ${isCenter ? 'md:translate-y-12' : ''}`}>
                    <div className="relative h-[450px] md:h-[600px] overflow-hidden mb-6 md:mb-8">
                      <img src={photo} alt={m.name} className="w-full h-full object-cover transition-all duration-700" style={{ filter: 'grayscale(100%)', transform: 'scale(1.05)' }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0%)'; e.currentTarget.style.transform = 'scale(1)' }}
                        onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.transform = 'scale(1.05)' }} />
                    </div>
                    <div className="px-4 md:px-8">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-[#51606b] mb-2">{m.role}</p>
                      <h3 className="text-2xl md:text-3xl mb-3" style={{ ...serif, color: COLORS.primary }}>{m.name}</h3>
                      <div className="flex items-center justify-between">
                        {m.languages && m.languages.length > 0 && (
                          <span className="flex items-center gap-1.5 text-sm text-[#43474e] italic">
                            <Globe className="w-3.5 h-3.5" /> {m.languages.join(' / ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PROPERTIES BY EXPERT */}
        <section id="propiedades" className="py-24 md:py-40 px-6 md:px-8" style={{ backgroundColor: COLORS.surfaceLow }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-baseline gap-4 mb-16 md:mb-20">
              <h2 className="text-3xl md:text-4xl" style={{ ...serif, color: COLORS.primary }}>{L('properties.featured', lang)}</h2>
              <div className="hidden md:block flex-grow h-[1px]" style={{ backgroundColor: 'rgba(196,198,207,0.3)' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              {properties.slice(0, 3).map((p, i) => {
                const img = p.images?.[0] || '/images/property-placeholder.jpg'
                const memberName = members[i % members.length]?.name || agent.full_name
                const spanClass = i === 0 ? 'md:col-span-7' : i === 1 ? 'md:col-span-5 md:pt-24' : 'md:col-span-8 md:col-start-3'
                const aspect = i === 0 ? 'aspect-[16/10]' : i === 1 ? 'aspect-[4/5]' : 'aspect-[21/9]'
                return (
                  <div key={p.id || i} className={`${spanClass} group`}>
                    <div className={`relative ${aspect} overflow-hidden mb-5 md:mb-6`}>
                      <img src={img} alt={tc(translations, 'properties', p.id, 'title', p.title)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute top-4 md:top-6 left-4 md:left-6 text-white text-[10px] uppercase tracking-widest px-3 md:px-4 py-2" style={{ backgroundColor: COLORS.primary }}>
                        {L('properties.selectionOf', lang)} {memberName}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xl md:text-2xl" style={{ ...serif, color: COLORS.primary }}>{tc(translations, 'properties', p.id, 'title', p.title)}</h4>
                        <p className="text-[#51606b] text-sm">
                          {p.location}{p.bedrooms ? ` \u00B7 ${p.bedrooms} hab` : ''}{(p.area_m2 || p.size_m2) ? ` \u00B7 ${p.area_m2 || p.size_m2} m\u00B2` : ''}
                        </p>
                      </div>
                      <span className="text-xl md:text-2xl" style={{ ...serif, color: COLORS.primary }}>{formatPrice(p.price)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        {services && services.length > 0 && (
          <section className="py-20 md:py-32 px-6 md:px-8" style={{ backgroundColor: COLORS.surface }}>
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-5xl mb-12 md:mb-16 tracking-tight" style={{ ...serif, color: COLORS.primary }}>{L('services.title', lang)}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {services.slice(0, 6).map((s, i) => (
                  <div key={s.id || i} className="border border-[#c4c6cf]/40 p-8 hover:border-[#e9c176] transition-colors">
                    <span className="text-2xl font-bold block mb-4" style={{ ...serif, color: COLORS.gold, opacity: 0.5 }}>0{i + 1}</span>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: COLORS.primary }}>{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                    {s.description && <p className="text-[#43474e] text-sm leading-relaxed">{tc(translations, 'services', s.id, 'description', s.description)}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section id="contacto" className="relative py-32 md:py-48 px-6 md:px-8 overflow-hidden" style={{ backgroundColor: COLORS.primary }}>
          <div className="absolute inset-0 opacity-15">
            <img src={heroImg} alt="" className="w-full h-full object-cover" style={{ mixBlendMode: 'overlay' }} />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl lg:text-8xl text-white mb-8 md:mb-12 tracking-tight" style={serif}>{L('contact.headline', lang)}</h2>
            <p className="text-[#718bb7] text-lg md:text-xl lg:text-2xl mb-12 md:mb-16 max-w-2xl mx-auto font-light leading-relaxed">{hero?.subtitle || L('contact.subtitle', lang)}</p>
            <div className="flex flex-col md:flex-row gap-5 md:gap-6 justify-center items-center">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="px-10 md:px-12 py-4 md:py-5 text-sm font-bold uppercase tracking-[0.2em] w-full md:w-auto text-center transition-colors" style={{ backgroundColor: COLORS.gold, color: '#261900' }}>
                  {L('contact.bookConsultation', lang)}
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white text-xs uppercase tracking-[0.3em] border-b border-white pb-2 hover:opacity-70 transition-opacity">
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-16 md:py-20 px-6 md:px-8" style={{ backgroundColor: '#0f172a' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-7xl mx-auto border-t border-white/10 pt-10 md:pt-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-white" />
              <span className="text-white text-lg" style={serif}>{bizName}</span>
            </div>
            {agent.location && <p className="text-slate-400 text-xs leading-loose">{agent.location}</p>}
          </div>
          {/* Team */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs tracking-widest uppercase mb-2">{L('team.title', lang)}</span>
            {members.slice(0, 4).map((m, i) => (
              <span key={m.id || i} className="text-slate-400 text-xs uppercase tracking-widest">{m.name}</span>
            ))}
          </div>
          {/* Services */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs tracking-widest uppercase mb-2">{L('services.title', lang)}</span>
            {services?.slice(0, 3).map((s, i) => (
              <span key={s.id || i} className="text-slate-400 text-xs uppercase tracking-widest">{tc(translations, 'services', s.id, 'title', s.title)}</span>
            ))}
          </div>
          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-white text-xs tracking-widest uppercase mb-2">{L('nav.contact', lang)}</span>
            {agent.phone && <a href={`tel:${agent.phone}`} className="text-slate-400 hover:text-[#e9c176] transition-colors text-xs uppercase tracking-widest">{agent.phone}</a>}
            {agent.email && <a href={`mailto:${agent.email}`} className="text-slate-400 hover:text-[#e9c176] transition-colors text-xs uppercase tracking-widest">Email</a>}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 md:mt-20 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6 md:pt-8">
          <span className="text-slate-500 text-[10px] tracking-widest uppercase">&copy; {new Date().getFullYear()} {bizName}</span>
          <span className="text-[10px] uppercase tracking-widest text-white/20">Powered by <a href="https://habibook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e9c176] transition-colors">HabiBook</a></span>
        </div>
      </footer>
    </div>
  )
}
