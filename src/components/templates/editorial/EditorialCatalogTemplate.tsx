'use client'

import { useState } from 'react'
import { Phone, MessageSquare, MapPin, Bed, Bath, Ruler, Home, Key, Palmtree, TrendingUp, Tag, BadgeCheck, Menu, X } from 'lucide-react'
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

const C = { primary: '#000d22', container: '#002349', gold: '#e9c176', goldLight: '#ffdea5', surface: '#f8f9fa', outline: '#74777f', secondary: '#51606b', secContainer: '#d2e2ee' }
const serif = { fontFamily: 'Noto Serif, Georgia, serif' }
const sans = { fontFamily: 'Manrope, system-ui, sans-serif' }

const CATEGORIES = [
  { key: 'all', icon: Home, label: 'Todas' },
  { key: 'sale', icon: Tag, label: 'Venta' },
  { key: 'rent_long', icon: Key, label: 'Alquiler' },
  { key: 'rent_vacation', icon: Palmtree, label: 'Vacacional' },
  { key: 'investment', icon: TrendingUp, label: 'Inversi\u00f3n' },
]

function badgeColor(type: string): string {
  if (type === 'sale') return C.gold
  if (type === 'rent_long') return C.primary
  return '#e59700'
}

function badgeText(type: string): string {
  if (type === 'sale') return C.primary
  return '#fff'
}

function badgeLabel(type: string, badge?: string): string {
  if (badge === 'investment') return 'Inversi\u00f3n'
  if (type === 'sale') return 'Venta'
  if (type === 'rent_long') return 'Alquiler'
  return 'Vacacional'
}

export default function EditorialCatalogTemplate({ data, lang, translations }: TemplateProps) {
  const [filter, setFilter] = useState('all')
  const [menuOpen, setMenuOpen] = useState(false)
  const { agent, properties, hero, services } = data

  const filtered = properties.filter(p =>
    filter === 'all' || p.operation_type === filter ||
    (filter === 'investment' && p.operation_type === 'sale' && p.badge === 'investment')
  )

  const heroImg = hero?.background_image_url || hero?.image || '/images/hero-default.jpg'
  const headline = hero?.headline || hero?.title || L('hero.title', lang)
  const subtitle = hero?.subtitle || L('hero.subtitle', lang)
  const name = agent.business_name || agent.full_name

  return (
    <div className="min-h-screen antialiased" style={{ ...sans, backgroundColor: C.surface, color: '#191c1d' }}>

      {/* Glass Nav */}
      <header className="fixed top-0 w-full z-50 border-b" style={{ background: 'rgba(248,249,250,0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(196,198,207,0.1)' }}>
        <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto">
          <span className="text-xl font-bold tracking-tighter" style={{ ...serif, color: C.primary }}>{name}</span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#propiedades" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('nav.properties', lang)}</a>
            <a href="#agente" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('nav.agent', lang)}</a>
            <a href="#servicios" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('nav.services', lang)}</a>
          </div>
          <a href="#contacto" className="hidden md:inline-block px-5 py-2 text-sm font-medium uppercase tracking-wider hover:opacity-80 transition-opacity" style={{ background: C.primary, color: '#fff', borderRadius: 2 }}>{L('nav.contact', lang)}</a>
          <button onClick={() => setMenuOpen(true)} className="md:hidden" style={{ color: C.primary }}><Menu className="w-6 h-6" /></button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-300" style={{ background: C.primary, transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6"><X className="w-7 h-7 text-white" /></button>
        {[{ href: '#propiedades', l: L('nav.properties', lang) }, { href: '#agente', l: L('nav.agent', lang) }, { href: '#servicios', l: L('nav.services', lang) }, { href: '#contacto', l: L('nav.contact', lang) }].map(n => (
          <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="text-3xl text-white/80 hover:text-white transition-colors" style={serif}>{n.l}</a>
        ))}
      </div>

      <main className="pt-16">
        {/* Hero */}
        <section className="px-6 py-12 md:py-24 overflow-hidden" style={{ background: '#f3f4f5' }}>
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
            <div className="w-full md:w-1/2">
              <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: C.secondary }}>{agent.location || 'Tenerife'} &middot; {agent.experience_years ? `Desde ${new Date().getFullYear() - agent.experience_years}` : ''}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6" style={{ ...serif, color: C.primary }}>{tc(translations, 'hero', hero?.title, 'headline', headline)}</h1>
              <div className="flex gap-4">
                <a href="#propiedades" className="px-6 py-3 font-semibold text-sm transition-transform active:scale-95" style={{ background: C.primary, color: '#fff', borderRadius: 2 }}>{L('hero.cta', lang)}</a>
                <a href="#contacto" className="px-2 py-3 font-semibold text-sm" style={{ color: C.primary, borderBottom: `2px solid ${C.primary}` }}>{L('nav.contact', lang)}</a>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="overflow-hidden shadow-sm" style={{ aspectRatio: '4/5', borderRadius: 2 }}>
                <img className="w-full h-full object-cover" src={heroImg} alt={headline} />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 md:py-8 px-6" style={{ background: C.surface }}>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-2 max-w-screen-xl mx-auto" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => {
              const active = filter === cat.key
              const Icon = cat.icon
              return (
                <button key={cat.key} onClick={() => setFilter(cat.key)} className="flex-shrink-0 flex items-center gap-2 px-5 md:px-6 py-3 text-sm font-medium transition-all" style={{
                  background: active ? C.primary : '#fff', color: active ? '#fff' : '#191c1d',
                  border: active ? 'none' : '1px solid rgba(196,198,207,0.15)', borderRadius: 2
                }}>
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Property Grid */}
        <section id="propiedades" className="px-6 py-10 md:py-12 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-end mb-8 md:mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl mb-2" style={{ ...serif, color: C.primary }}>{L('properties.title', lang)}</h2>
              <p className="max-w-md text-sm" style={{ color: C.secondary }}>{L('properties.subtitle', lang)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((p, i) => (
              <div key={p.id || i} className="flex flex-col group">
                <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '3/2', background: '#e7e8e9', borderRadius: 2 }}>
                  {p.images?.[0] && <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={p.images[0]} alt={p.title} />}
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-widest" style={{ background: badgeColor(p.operation_type), color: badgeText(p.operation_type), borderRadius: 2 }}>
                    {badgeLabel(p.operation_type, p.badge)}
                  </span>
                </div>
                <div className="px-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg md:text-xl" style={{ ...serif, color: C.primary }}>{tc(translations, 'properties', p.id, 'title', p.title)}</h3>
                    <span className="text-lg md:text-xl font-bold" style={{ color: C.primary }}>{formatPrice(p.price)}</span>
                  </div>
                  {p.location && (
                    <p className="text-sm mb-3 flex items-center gap-1" style={{ color: C.secondary }}>
                      <MapPin className="w-3.5 h-3.5" />{p.location}
                    </p>
                  )}
                  <div className="flex gap-5 py-3" style={{ borderTop: '1px solid rgba(196,198,207,0.2)' }}>
                    {p.bedrooms != null && <span className="flex items-center gap-1.5 text-sm" style={{ color: C.secondary }}><Bed className="w-4 h-4" />{p.bedrooms} Hab</span>}
                    {p.bathrooms != null && <span className="flex items-center gap-1.5 text-sm" style={{ color: C.secondary }}><Bath className="w-4 h-4" />{p.bathrooms} Ba&ntilde;os</span>}
                    {(p.area_m2 || p.size_m2) && <span className="flex items-center gap-1.5 text-sm" style={{ color: C.secondary }}><Ruler className="w-4 h-4" />{p.area_m2 || p.size_m2} m&sup2;</span>}
                  </div>
                  <button className="w-full py-3 font-semibold mt-2 text-sm transition-colors hover:opacity-80" style={{ background: C.secContainer, color: '#55656f', borderRadius: 2 }}>
                    {p.operation_type === 'rent_vacation' ? L('properties.book', lang) : L('properties.visit', lang)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agent Spotlight */}
        <section id="agente" className="py-16 md:py-20 px-6" style={{ background: '#f3f4f5' }}>
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
            <div className="w-full md:w-1/3">
              <div className="overflow-hidden transition-all duration-500 grayscale hover:grayscale-0" style={{ aspectRatio: '3/4', background: '#d9dadb', borderRadius: 2 }}>
                {(agent.photo || agent.bio_photo_url) && <img className="w-full h-full object-cover object-top" src={agent.photo || agent.bio_photo_url} alt={agent.full_name} />}
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <span className="font-bold tracking-[0.2em] text-xs uppercase mb-4 block" style={{ color: C.gold }}>{L('agent.your_agent', lang)}</span>
              <h2 className="text-3xl md:text-4xl mb-5" style={{ ...serif, color: C.primary }}>{agent.full_name}</h2>
              {agent.bio && <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: C.secondary }}>{tc(translations, 'agents', agent.slug, 'bio', agent.bio)}</p>}
              {agent.stats && (
                <div className="grid grid-cols-2 gap-6 mb-8 pl-6" style={{ borderLeft: '1px solid rgba(196,198,207,0.3)' }}>
                  {Object.entries(agent.stats).slice(0, 2).map(([k, v]) => (
                    <div key={k}>
                      <span className="block text-2xl font-bold" style={{ color: C.primary }}>{v}+</span>
                      <span className="text-sm uppercase tracking-widest" style={{ color: C.secondary }}>{k}</span>
                    </div>
                  ))}
                </div>
              )}
              <a href="#contacto" className="inline-block px-8 py-4 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity" style={{ background: C.primary, color: '#fff', borderRadius: 2 }}>
                {L('nav.contact', lang)} {agent.full_name.split(' ')[0]}
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        {services && services.length > 0 && (
          <section id="servicios" className="py-20 md:py-24 px-6 max-w-screen-xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl mb-4" style={{ ...serif, color: C.primary }}>{L('services.title', lang)}</h2>
              <p className="max-w-lg mx-auto text-sm md:text-base" style={{ color: C.secondary }}>{L('services.subtitle', lang)}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
              {services.map((s, i) => (
                <div key={s.id || i} className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#e7e8e9' }}>
                    <BadgeCheck className="w-7 h-7" style={{ color: C.primary }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-3" style={{ color: C.primary }}>{tc(translations, 'services', s.id, 'title', s.title)}</h3>
                  {s.description && <p className="text-sm" style={{ color: C.secondary }}>{tc(translations, 'services', s.id, 'description', s.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section id="contacto" className="py-20 md:py-24 px-6" style={{ background: C.primary }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-white mb-6" style={serif}>{L('contact.title', lang)}</h2>
            <p className="text-base md:text-lg mb-10 leading-relaxed" style={{ color: '#718bb7' }}>{L('contact.subtitle', lang)}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 px-8 py-4 font-bold uppercase tracking-[0.15em] text-sm hover:opacity-90 transition-colors" style={{ background: C.gold, color: C.primary, borderRadius: 2 }}>
                  <Phone className="w-4 h-4" />{agent.phone}
                </a>
              )}
              {agent.whatsapp && (
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 font-bold uppercase tracking-[0.15em] text-sm hover:bg-white/10 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 2 }}>
                  <MessageSquare className="w-4 h-4" />WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pb-20 md:pb-0" style={{ background: '#f1f2f3' }}>
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-8 md:py-10 max-w-screen-2xl mx-auto gap-4" style={{ borderTop: '1px solid #e1e3e4' }}>
          <span className="font-bold text-lg" style={{ ...serif, color: C.primary }}>{name}</span>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#propiedades" className="text-sm hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('nav.properties', lang)}</a>
            <a href="#agente" className="text-sm hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('nav.agent', lang)}</a>
            <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('footer.privacy', lang)}</a>
            <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: C.secondary }}>{L('footer.legal', lang)}</a>
          </div>
          <p className="text-sm" style={{ color: C.secondary }}>&copy; {new Date().getFullYear()} {name}</p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: 'rgba(248,249,250,0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(196,198,207,0.1)' }}>
        <div className="flex justify-around items-center h-16">
          {[
            { key: 'sale', icon: Tag, label: 'Venta', href: '#propiedades' },
            { key: 'rent_long', icon: Key, label: 'Alquiler', href: '#propiedades' },
            { key: 'rent_vacation', icon: Palmtree, label: 'Vacacional', href: '#propiedades' },
            { key: 'agent', icon: BadgeCheck, label: 'Agente', href: '#agente' },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = filter === tab.key
            return (
              <a key={tab.key} href={tab.href} onClick={() => { if (tab.key !== 'agent') setFilter(tab.key) }} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5" style={{ color: isActive ? C.primary : C.secondary }} />
                <span className="text-[10px] uppercase tracking-tight font-semibold" style={{ color: isActive ? C.primary : C.secondary }}>{tab.label}</span>
              </a>
            )
          })}
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  )
}
