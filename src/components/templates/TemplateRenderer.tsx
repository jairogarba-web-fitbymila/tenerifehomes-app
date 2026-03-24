'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, MessageSquare, Bed, Bath, Ruler, Star, ChevronRight, Building2, Globe, Search, TrendingUp, Home, Shield, Calculator, Award, Users, Briefcase, BarChart3 } from 'lucide-react'
import { TemplateData, formatPrice } from './types'

// ========== LUXURY TEMPLATE ==========
function LuxuryTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, services, zones } = data
  return (
    <div className="min-h-screen bg-black text-white" style={{fontFamily:'Georgia, Garamond, serif'}}>
      {/* Nav */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-2xl font-light tracking-widest uppercase" style={{color:'#C9A84C'}}>{agent.business_name}</span>
          <nav className="hidden md:flex gap-8 text-sm tracking-wider uppercase text-white/60">
            <a href="#collection" className="hover:text-white/90 transition">Colección</a>
            <a href="#about" className="hover:text-white/90 transition">Sobre Mí</a>
            <a href="#contact" className="hover:text-white/90 transition">Contacto</a>
          </nav>
        </div>
      </header>
      {/* Hero fullscreen */}
      <section className="relative h-[85vh] flex items-end" style={{backgroundImage:`url(${(hero?.background_image_url||hero?.image)})`,backgroundSize:'cover',backgroundPosition:'center'}}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 pb-20 w-full">
          <div className="flex items-end gap-8">
            {agent.bio_photo_url && <img src={agent.bio_photo_url} alt="" className="w-28 h-28 rounded-full border-2 object-cover hidden md:block" style={{borderColor:'#C9A84C'}} />}
            <div>
              <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{color:'#C9A84C'}}>{agent.city}</p>
              <h1 className="text-5xl md:text-7xl font-light mb-4">{hero?.headline}</h1>
              <p className="text-xl text-white/60 max-w-2xl">{hero?.subtitle}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Stats */}
      {agent.stats && <section className="border-y border-white/10 py-8"><div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">{Object.entries(agent.stats).map(([k,v])=>(<div key={k} className="text-center"><div className="text-3xl font-light" style={{color:'#C9A84C'}}>{typeof v==='number'?v.toLocaleString():'—'}</div><div className="text-xs tracking-wider uppercase text-white/40 mt-1">{k.replace(/_/g,' ')}</div></div>))}</div></section>}
      {/* Properties */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-sm tracking-[0.3em] uppercase mb-12" style={{color:'#C9A84C'}}>Colección Exclusiva</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {properties.filter(p=>p.is_active!==false).map(p=>(
            <div key={p.id} className="group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden mb-4 relative">
                {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
                {p.badge && <span className="absolute top-4 left-4 px-4 py-1.5 text-xs tracking-wider uppercase" style={{backgroundColor:'#C9A84C',color:'#000'}}>{p.badge}</span>}
              </div>
              <div className="flex justify-between items-start">
                <div><h3 className="text-lg font-light mb-1">{p.title}</h3><p className="text-sm text-white/40">{p.location}</p></div>
                <p className="text-xl font-light" style={{color:'#C9A84C'}}>{p.price ? formatPrice(p.price) : 'Consultar'}</p>
              </div>
              <div className="flex gap-6 mt-3 text-sm text-white/40">
                {p.bedrooms!=null && <span>{p.bedrooms} hab.</span>}
                {p.bathrooms!=null && <span>{p.bathrooms} baños</span>}
                {p.size_m2!=null && <span>{p.size_m2}m²</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* About */}
      {agent.bio && <section id="about" className="border-t border-white/10 py-20"><div className="max-w-4xl mx-auto px-6"><h2 className="text-sm tracking-[0.3em] uppercase mb-8" style={{color:'#C9A84C'}}>Sobre Mí</h2><p className="text-xl text-white/70 leading-relaxed">{agent.bio}</p>{agent.quote && <blockquote className="mt-8 text-lg italic text-white/40 border-l-2 pl-6" style={{borderColor:'#C9A84C'}}>&ldquo;{agent.quote}&rdquo;</blockquote>}</div></section>}
      {/* Testimonials */}
      {testimonials.length>0 && <section className="py-20 bg-white/[0.02]"><div className="max-w-6xl mx-auto px-6"><h2 className="text-sm tracking-[0.3em] uppercase mb-12 text-center" style={{color:'#C9A84C'}}>Testimonios</h2><div className="grid md:grid-cols-3 gap-8">{testimonials.map(t=>(<div key={t.id} className="border border-white/10 p-8"><div className="flex gap-1 mb-4">{[...Array(t.rating||5)].map((_,i)=>(<Star key={i} className="w-4 h-4" style={{color:'#C9A84C',fill:'#C9A84C'}} />))}</div><p className="text-white/70 italic mb-4">&ldquo;{t.quote}&rdquo;</p><p className="text-sm" style={{color:'#C9A84C'}}>{t.client_name}</p><p className="text-xs text-white/40">{t.client_location}</p></div>))}</div></div></section>}
      {/* Contact */}
      <section id="contact" className="border-t border-white/10 py-20"><div className="max-w-2xl mx-auto px-6 text-center"><h2 className="text-3xl font-light mb-4">Contacto Privado</h2><p className="text-white/50 mb-8">Reserva una consulta personalizada</p><div className="flex flex-col sm:flex-row gap-4 justify-center">{agent.phone && <a href={`tel:${agent.phone}`} className="px-8 py-3 border text-sm tracking-wider uppercase hover:bg-white/5 transition" style={{borderColor:'#C9A84C',color:'#C9A84C'}}><Phone className="w-4 h-4 inline mr-2" />Llamar</a>}{agent.whatsapp && <a href={`https://wa.me/${agent.whatsapp}`} className="px-8 py-3 text-sm tracking-wider uppercase text-black" style={{backgroundColor:'#C9A84C'}}>WhatsApp</a>}</div></div></section>
      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/30">Powered by <span style={{color:'#C9A84C'}}>HabiBook</span></footer>
    </div>
  )
}
// ========== MEDITERRANEAN TEMPLATE ==========
function MediterraneanTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, services, zones } = data
  const C = { primary: '#C4652E', bg: '#FBF7F2', sand: '#E8DDD0', text: '#3D2B1F' }
  return (
    <div className="min-h-screen" style={{backgroundColor:C.bg,color:C.text,fontFamily:'system-ui,-apple-system,sans-serif'}}>
      {/* Nav */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b" style={{borderColor:C.sand}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold" style={{color:C.primary}}>{agent.business_name}</span>
          <nav className="hidden md:flex gap-6 text-sm"><a href="#propiedades" className="hover:opacity-70">Propiedades</a><a href="#sobre" className="hover:opacity-70">Sobre Mí</a><a href="#contacto" className="hover:opacity-70">Contacto</a></nav>
        </div>
      </header>
      {/* Hero Split */}
      <section className="grid md:grid-cols-2 min-h-[70vh]">
        <div className="flex flex-col justify-center px-8 md:px-16 py-16">
          {agent.bio_photo_url && <img src={agent.bio_photo_url} alt="" className="w-20 h-20 rounded-full object-cover mb-6 border-4" style={{borderColor:C.sand}} />}
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{color:C.primary}}>{hero?.headline}</h1>
          <p className="text-lg mb-6 opacity-70">{hero?.subtitle}</p>
          <a href="#propiedades" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium w-fit" style={{backgroundColor:C.primary}}>{hero?.cta_text || 'Ver Propiedades'} <ChevronRight className="w-4 h-4" /></a>
          {/* Stats inline */}
          {agent.stats && <div className="flex flex-wrap gap-6 mt-10">{Object.entries(agent.stats).slice(0,3).map(([k,v])=>(<div key={k}><span className="text-2xl font-bold" style={{color:C.primary}}>{typeof v==='number'?v:0}</span><span className="text-sm ml-1 opacity-50">{k.replace(/_/g,' ')}</span></div>))}</div>}
        </div>
        <div className="hidden md:block" style={{backgroundImage:`url(${(hero?.background_image_url||hero?.image)})`,backgroundSize:'cover',backgroundPosition:'center'}} />
      </section>
      {/* Properties */}
      <section id="propiedades" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2" style={{color:C.primary}}>Propiedades Disponibles</h2>
        <p className="opacity-60 mb-10">Encuentra tu hogar ideal en el sur de Tenerife</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.filter(p=>p.is_active!==false).map(p=>(
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden relative">
                {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                {p.badge && <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-medium" style={{backgroundColor:C.primary}}>{p.badge}</span>}
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-1 line-clamp-1">{p.title}</h3>
                <p className="text-sm opacity-50 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{p.location}</p>
                <p className="text-xl font-bold mb-3" style={{color:C.primary}}>{p.price ? formatPrice(p.price) : 'Consultar'}</p>
                <div className="flex gap-4 text-sm opacity-60">
                  {p.bedrooms!=null && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{p.bedrooms}</span>}
                  {p.bathrooms!=null && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{p.bathrooms}</span>}
                  {p.size_m2!=null && <span className="flex items-center gap-1"><Ruler className="w-4 h-4" />{p.size_m2}m²</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* About */}
      {agent.bio && <section id="sobre" className="py-16" style={{backgroundColor:C.sand}}><div className="max-w-4xl mx-auto px-6"><h2 className="text-3xl font-bold mb-6" style={{color:C.primary}}>Sobre {agent.business_name}</h2><p className="text-lg leading-relaxed opacity-80">{agent.bio}</p>{agent.languages&&<p className="mt-4 text-sm opacity-50"><Globe className="w-4 h-4 inline mr-1" />Idiomas: {agent.languages.join(', ')}</p>}</div></section>}
      {/* Zones */}
      {zones.length>0 && <section className="max-w-7xl mx-auto px-6 py-16"><h2 className="text-3xl font-bold mb-8" style={{color:C.primary}}>Zonas</h2><div className="grid md:grid-cols-3 gap-6">{zones.map(z=>(<div key={z.id} className="rounded-2xl overflow-hidden relative group cursor-pointer">{z.image_url&&<img src={z.image_url} alt={z.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />}<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-5"><div><h3 className="text-white font-bold text-lg">{z.name}</h3><p className="text-white/70 text-sm">{z.property_count} propiedades</p></div></div></div>))}</div></section>}
      {/* Testimonials */}
      {testimonials.length>0 && <section className="py-16" style={{backgroundColor:C.sand}}><div className="max-w-6xl mx-auto px-6"><h2 className="text-3xl font-bold mb-8 text-center" style={{color:C.primary}}>Lo Que Dicen Nuestros Clientes</h2><div className="grid md:grid-cols-2 gap-6">{testimonials.map(t=>(<div key={t.id} className="bg-white rounded-2xl p-6"><div className="flex gap-1 mb-3">{[...Array(t.rating||5)].map((_,i)=>(<Star key={i} className="w-4 h-4" style={{color:C.primary,fill:C.primary}} />))}</div><p className="italic opacity-70 mb-4">&ldquo;{t.quote}&rdquo;</p><p className="font-semibold">{t.client_name}</p><p className="text-sm opacity-50">{t.client_location}</p></div>))}</div></div></section>}
      {/* Contact */}
      <section id="contacto" className="max-w-2xl mx-auto px-6 py-16 text-center"><h2 className="text-3xl font-bold mb-3" style={{color:C.primary}}>¿Hablamos?</h2><p className="opacity-60 mb-8">Estoy aquí para ayudarte a encontrar tu hogar</p><div className="flex flex-col sm:flex-row gap-4 justify-center">{agent.phone&&<a href={`tel:${agent.phone}`} className="px-6 py-3 rounded-full border-2 font-medium" style={{borderColor:C.primary,color:C.primary}}><Phone className="w-4 h-4 inline mr-2" />{agent.phone}</a>}{agent.whatsapp&&<a href={`https://wa.me/${agent.whatsapp}`} className="px-6 py-3 rounded-full text-white font-medium" style={{backgroundColor:C.primary}}><MessageSquare className="w-4 h-4 inline mr-2" />WhatsApp</a>}</div></section>
      <footer className="py-6 text-center text-sm opacity-40">Powered by <span style={{color:C.primary}}>HabiBook</span></footer>
    </div>
  )
}
// ========== CORPORATE TEMPLATE ==========
function CorporateTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, services, zones, team } = data
  const C = { primary: '#0B2545', accent: '#4A90D9', light: '#F0F4F8' }
  return (
    <div className="min-h-screen bg-white" style={{color:'#1a1a1a',fontFamily:'Inter,system-ui,sans-serif'}}>
      {/* Nav */}
      <header className="text-white" style={{backgroundColor:C.primary}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><Building2 className="w-6 h-6" style={{color:C.accent}} /><span className="text-lg font-bold">{agent.business_name}</span></div>
          <nav className="hidden md:flex gap-6 text-sm text-white/70"><a href="#properties" className="hover:text-white">Propiedades</a><a href="#team" className="hover:text-white">Equipo</a><a href="#services" className="hover:text-white">Servicios</a><a href="#contact" className="hover:text-white">Contacto</a></nav>
        </div>
      </header>
      {/* Stats Bar */}
      {agent.stats && <div style={{backgroundColor:C.accent}} className="text-white"><div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-center gap-8 md:gap-16">{Object.entries(agent.stats).map(([k,v])=>(<div key={k} className="text-center"><span className="text-2xl font-bold">{typeof v==='number'?v.toLocaleString():'—'}</span><span className="text-xs ml-2 uppercase opacity-70">{k.replace(/_/g,' ')}</span></div>))}</div></div>}
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center" style={{backgroundImage:`url(${(hero?.background_image_url||hero?.image)})`,backgroundSize:'cover',backgroundPosition:'center'}}>
        <div className="absolute inset-0" style={{backgroundColor:C.primary,opacity:0.7}} />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{hero?.headline}</h1>
          <p className="text-xl text-white/70 max-w-2xl mb-8">{hero?.subtitle}</p>
          <a href="#properties" className="px-8 py-3 rounded font-medium text-white" style={{backgroundColor:C.accent}}>{hero?.cta_text || 'Explorar Propiedades'}</a>
        </div>
      </section>
      {/* Properties */}
      <section id="properties" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8"><h2 className="text-3xl font-bold" style={{color:C.primary}}>Propiedades Destacadas</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {properties.filter(p=>p.is_active!==false).map(p=>(
            <div key={p.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-[4/3] overflow-hidden relative">
                {p.images?.[0]&&<img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                {p.badge&&<span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-xs font-medium" style={{backgroundColor:C.accent}}>{p.badge}</span>}
              </div>
              <div className="p-4">
                <p className="text-lg font-bold mb-1" style={{color:C.primary}}>{p.price?formatPrice(p.price):'Consultar'}</p>
                <h3 className="text-sm font-medium line-clamp-1 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-400 mb-2"><MapPin className="w-3 h-3 inline" /> {p.location}</p>
                <div className="flex gap-3 text-xs text-gray-500">{p.bedrooms!=null&&<span><Bed className="w-3 h-3 inline" /> {p.bedrooms}</span>}{p.bathrooms!=null&&<span><Bath className="w-3 h-3 inline" /> {p.bathrooms}</span>}{p.size_m2!=null&&<span>{p.size_m2}m²</span>}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Team */}
      {team.length>0 && <section id="team" className="py-16" style={{backgroundColor:C.light}}><div className="max-w-7xl mx-auto px-6"><h2 className="text-3xl font-bold mb-8" style={{color:C.primary}}>Nuestro Equipo</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{team.map(m=>(<div key={m.id} className="bg-white rounded-lg overflow-hidden shadow-sm"><div className="aspect-square">{m.photo_url&&<img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />}</div><div className="p-4"><h3 className="font-semibold">{m.name}</h3><p className="text-sm" style={{color:C.accent}}>{m.role}</p>{m.languages&&<p className="text-xs text-gray-400 mt-1">{m.languages.join(', ')}</p>}</div></div>))}</div></div></section>}
      {/* Services */}
      {services.length>0 && <section id="services" className="max-w-7xl mx-auto px-6 py-16"><h2 className="text-3xl font-bold mb-8" style={{color:C.primary}}>Servicios</h2><div className="grid md:grid-cols-3 gap-6">{services.map(s=>(<div key={s.id} className="p-6 rounded-lg border border-gray-200"><div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{backgroundColor:C.light}}><Briefcase className="w-6 h-6" style={{color:C.accent}} /></div><h3 className="font-semibold mb-2">{s.title}</h3><p className="text-sm text-gray-500">{s.description}</p></div>))}</div></section>}
      {/* Testimonials */}
      {testimonials.length>0 && <section className="py-16" style={{backgroundColor:C.primary}}><div className="max-w-6xl mx-auto px-6"><h2 className="text-3xl font-bold text-white mb-8 text-center">Testimonios</h2><div className="grid md:grid-cols-3 gap-6">{testimonials.map(t=>(<div key={t.id} className="bg-white/10 backdrop-blur rounded-lg p-6"><div className="flex gap-1 mb-3">{[...Array(t.rating||5)].map((_,i)=>(<Star key={i} className="w-4 h-4" style={{color:C.accent,fill:C.accent}} />))}</div><p className="text-white/80 italic mb-4">&ldquo;{t.quote}&rdquo;</p><p className="text-white font-medium">{t.client_name}</p><p className="text-white/50 text-sm">{t.client_location}</p></div>))}</div></div></section>}
      {/* Contact */}
      <section id="contact" className="max-w-2xl mx-auto px-6 py-16 text-center"><h2 className="text-3xl font-bold mb-3" style={{color:C.primary}}>Contáctenos</h2><p className="text-gray-500 mb-8">Nuestro equipo está listo para ayudarle</p><div className="flex flex-col sm:flex-row gap-4 justify-center">{agent.phone&&<a href={`tel:${agent.phone}`} className="px-6 py-3 rounded border-2 font-medium" style={{borderColor:C.primary,color:C.primary}}><Phone className="w-4 h-4 inline mr-2" />Llamar</a>}{agent.email&&<a href={`mailto:${agent.email}`} className="px-6 py-3 rounded text-white font-medium" style={{backgroundColor:C.accent}}><Mail className="w-4 h-4 inline mr-2" />Email</a>}</div></section>
      <footer className="py-6 text-center text-sm text-gray-400" style={{backgroundColor:C.light}}>Powered by <span style={{color:C.accent}}>HabiBook</span></footer>
    </div>
  )
}
// ========== BOUTIQUE TEMPLATE ==========
function BoutiqueTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, services } = data
  const C = { rose: '#C08B7F', sage: '#8B9D77', bg: '#FAF8F5', gold: '#A69060', text: '#2D2926' }
  return (
    <div className="min-h-screen" style={{backgroundColor:C.bg,color:C.text,fontFamily:'Georgia,serif'}}>
      {/* Nav - minimal */}
      <header className="py-8"><div className="max-w-6xl mx-auto px-6 flex items-center justify-between"><span className="text-2xl tracking-wide" style={{color:C.rose}}>{agent.business_name}</span><nav className="hidden md:flex gap-8 text-sm" style={{fontFamily:'system-ui'}}><a href="#portfolio" className="hover:opacity-70">Portfolio</a><a href="#philosophy" className="hover:opacity-70">Filosofía</a><a href="#contact" className="hover:opacity-70">Contacto</a></nav></div></header>
      {/* Hero - large image with text overlay bottom */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="relative rounded-lg overflow-hidden" style={{height:'75vh'}}>
          {(hero?.background_image_url||hero?.image) && <img src={(hero.background_image_url||hero.image)} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
            <p className="text-sm tracking-[0.2em] uppercase mb-4" style={{color:C.sage}}>{agent.city}</p>
            <h1 className="text-4xl md:text-6xl text-white font-normal mb-3">{hero?.headline}</h1>
            <p className="text-lg text-white/70 max-w-xl">{hero?.subtitle}</p>
          </div>
        </div>
      </section>
      {/* Quote */}
      {agent.quote && <section className="max-w-3xl mx-auto px-6 mb-20 text-center"><blockquote className="text-2xl md:text-3xl italic leading-relaxed" style={{color:C.rose}}>&ldquo;{agent.quote}&rdquo;</blockquote><div className="w-12 h-px mx-auto mt-6" style={{backgroundColor:C.gold}} /></section>}
      {/* Portfolio - magazine grid */}
      <section id="portfolio" className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-sm tracking-[0.2em] uppercase mb-10" style={{color:C.sage,fontFamily:'system-ui'}}>Portfolio Selecto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {properties.filter(p=>p.is_active!==false).map((p,i)=>(
            <div key={p.id} className={`group cursor-pointer ${i===0?'md:col-span-2':''}`}>
              <div className={`overflow-hidden rounded-lg mb-4 ${i===0?'aspect-[21/9]':'aspect-[4/3]'}`}>
                {p.images?.[0]&&<img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}
              </div>
              <div className="flex justify-between items-start">
                <div><h3 className="text-xl mb-1">{p.title}</h3><p className="text-sm opacity-50" style={{fontFamily:'system-ui'}}>{p.location}</p></div>
                <p className="text-lg" style={{color:C.rose}}>{p.price?formatPrice(p.price):'Consultar'}</p>
              </div>
              <div className="flex gap-6 mt-2 text-sm opacity-40" style={{fontFamily:'system-ui'}}>{p.bedrooms!=null&&<span>{p.bedrooms} dormitorios</span>}{p.size_m2!=null&&<span>{p.size_m2}m²</span>}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Philosophy / About */}
      <section id="philosophy" className="py-20" style={{backgroundColor:'white'}}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {agent.bio_photo_url && <div className="aspect-[3/4] rounded-lg overflow-hidden"><img src={agent.bio_photo_url} alt="" className="w-full h-full object-cover" /></div>}
          <div><h2 className="text-sm tracking-[0.2em] uppercase mb-6" style={{color:C.sage,fontFamily:'system-ui'}}>Nuestra Filosofía</h2><p className="text-lg leading-relaxed opacity-80">{agent.bio}</p>{agent.languages&&<p className="mt-6 text-sm opacity-40" style={{fontFamily:'system-ui'}}>Idiomas: {agent.languages.join(', ')}</p>}</div>
        </div>
      </section>
      {/* Services */}
      {services.length>0 && <section className="max-w-6xl mx-auto px-6 py-20"><div className="grid md:grid-cols-3 gap-8">{services.map(s=>(<div key={s.id} className="text-center"><div className="w-10 h-10 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor:C.sage+'20'}}><Home className="w-5 h-5" style={{color:C.sage}} /></div><h3 className="font-semibold mb-2" style={{fontFamily:'system-ui'}}>{s.title}</h3><p className="text-sm opacity-60" style={{fontFamily:'system-ui'}}>{s.description}</p></div>))}</div></section>}
      {/* Testimonials */}
      {testimonials.length>0 && <section className="py-20" style={{backgroundColor:'white'}}><div className="max-w-4xl mx-auto px-6"><h2 className="text-sm tracking-[0.2em] uppercase mb-10 text-center" style={{color:C.sage,fontFamily:'system-ui'}}>Testimonios</h2>{testimonials.map(t=>(<div key={t.id} className="mb-10 text-center"><p className="text-xl italic leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p><p className="text-sm font-semibold" style={{fontFamily:'system-ui'}}>{t.client_name}</p><p className="text-xs opacity-40" style={{fontFamily:'system-ui'}}>{t.client_location}</p></div>))}</div></section>}
      {/* Contact */}
      <section id="contact" className="max-w-2xl mx-auto px-6 py-20 text-center"><h2 className="text-3xl mb-3">Concertar una Cita</h2><p className="text-sm opacity-50 mb-8" style={{fontFamily:'system-ui'}}>Atención personalizada, solo con cita previa</p><div className="flex flex-col sm:flex-row gap-4 justify-center">{agent.phone&&<a href={`tel:${agent.phone}`} className="px-8 py-3 rounded-lg text-white text-sm" style={{backgroundColor:C.rose,fontFamily:'system-ui'}}><Phone className="w-4 h-4 inline mr-2" />Llamar</a>}{agent.whatsapp&&<a href={`https://wa.me/${agent.whatsapp}`} className="px-8 py-3 rounded-lg text-white text-sm" style={{backgroundColor:C.sage,fontFamily:'system-ui'}}>WhatsApp</a>}</div></section>
      <footer className="py-6 text-center text-xs opacity-30" style={{fontFamily:'system-ui'}}>Powered by <span style={{color:C.rose}}>HabiBook</span></footer>
    </div>
  )
}
// ========== CLASSIC TEMPLATE ==========
function ClassicTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, services } = data
  const C = { brown: '#3C2415', caramel: '#8B6F47', cream: '#FBF7F2', gold: '#DAA520' }
  return (
    <div className="min-h-screen" style={{backgroundColor:C.cream,color:C.brown,fontFamily:'Palatino,Georgia,serif'}}>
      {/* Nav */}
      <header className="text-white" style={{backgroundColor:C.brown}}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div><span className="text-xl font-bold">{agent.business_name}</span>{agent.city&&<span className="text-sm ml-3 opacity-50">{agent.city}</span>}</div>
          <nav className="hidden md:flex gap-6 text-sm text-white/60"><a href="#propiedades" className="hover:text-white">Propiedades</a><a href="#trayectoria" className="hover:text-white">Trayectoria</a><a href="#contacto" className="hover:text-white">Contacto</a></nav>
        </div>
      </header>
      {/* Hero - classic banner */}
      <section className="relative h-[55vh]" style={{backgroundImage:`url(${(hero?.background_image_url||hero?.image)})`,backgroundSize:'cover',backgroundPosition:'center'}}>
        <div className="absolute inset-0" style={{backgroundColor:C.brown,opacity:0.65}} />
        <div className="relative h-full flex flex-col justify-center max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-3">{hero?.headline}</h1>
          <p className="text-lg text-white/70 max-w-xl mb-6">{hero?.subtitle}</p>
          <a href="#propiedades" className="px-8 py-3 text-sm font-medium text-white w-fit" style={{backgroundColor:C.gold}}>{hero?.cta_text||'Ver Propiedades'}</a>
        </div>
      </section>
      {/* Awards / Stats ribbon */}
      {agent.stats && <div className="border-y-2" style={{borderColor:C.gold,backgroundColor:'white'}}><div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-10">{Object.entries(agent.stats).map(([k,v])=>(<div key={k} className="flex items-center gap-3"><Award className="w-6 h-6" style={{color:C.gold}} /><div><div className="text-2xl font-bold" style={{color:C.brown}}>{typeof v==='number'?v.toLocaleString():'—'}</div><div className="text-xs uppercase tracking-wider opacity-50" style={{fontFamily:'system-ui'}}>{k.replace(/_/g,' ')}</div></div></div>))}</div></div>}
      {/* Properties */}
      <section id="propiedades" className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2" style={{color:C.brown}}>Propiedades Seleccionadas</h2>
        <div className="w-16 h-1 mb-10" style={{backgroundColor:C.gold}} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.filter(p=>p.is_active!==false).map(p=>(
            <div key={p.id} className="bg-white border overflow-hidden group" style={{borderColor:C.caramel+'40'}}>
              <div className="aspect-[4/3] overflow-hidden relative">
                {p.images?.[0]&&<img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                {p.badge&&<span className="absolute top-3 left-3 px-3 py-1 text-white text-xs font-medium" style={{backgroundColor:C.gold}}>{p.badge}</span>}
              </div>
              <div className="p-5"><h3 className="font-bold mb-1">{p.title}</h3><p className="text-sm opacity-50 mb-2" style={{fontFamily:'system-ui'}}><MapPin className="w-3 h-3 inline" /> {p.location}</p><p className="text-xl font-bold" style={{color:C.caramel}}>{p.price?formatPrice(p.price):'Consultar'}</p><div className="flex gap-4 mt-2 text-sm opacity-50" style={{fontFamily:'system-ui'}}>{p.bedrooms!=null&&<span>{p.bedrooms} hab</span>}{p.bathrooms!=null&&<span>{p.bathrooms} bañ</span>}{p.size_m2!=null&&<span>{p.size_m2}m²</span>}</div></div>
            </div>
          ))}
        </div>
      </section>
      {/* About / Trayectoria */}
      <section id="trayectoria" className="py-16" style={{backgroundColor:'white'}}><div className="max-w-4xl mx-auto px-6"><h2 className="text-3xl font-bold mb-2" style={{color:C.brown}}>Trayectoria Profesional</h2><div className="w-16 h-1 mb-8" style={{backgroundColor:C.gold}} /><p className="text-lg leading-relaxed opacity-80">{agent.bio}</p>{agent.quote&&<blockquote className="mt-8 text-xl italic border-l-4 pl-6" style={{borderColor:C.gold,color:C.caramel}}>&ldquo;{agent.quote}&rdquo;</blockquote>}</div></section>
      {/* Testimonials */}
      {testimonials.length>0 && <section className="max-w-6xl mx-auto px-6 py-16"><h2 className="text-3xl font-bold mb-8" style={{color:C.brown}}>Clientes Satisfechos</h2><div className="grid md:grid-cols-2 gap-8">{testimonials.map(t=>(<div key={t.id} className="bg-white p-8 border-l-4" style={{borderColor:C.gold}}><div className="flex gap-1 mb-3">{[...Array(t.rating||5)].map((_,i)=>(<Star key={i} className="w-4 h-4" style={{color:C.gold,fill:C.gold}} />))}</div><p className="italic opacity-70 mb-4">&ldquo;{t.quote}&rdquo;</p><p className="font-bold">{t.client_name}</p><p className="text-sm opacity-50" style={{fontFamily:'system-ui'}}>{t.client_location}</p></div>))}</div></section>}
      {/* Contact */}
      <section id="contacto" className="text-white py-16" style={{backgroundColor:C.brown}}><div className="max-w-2xl mx-auto px-6 text-center"><h2 className="text-3xl font-bold mb-3">Contacte Conmigo</h2><p className="opacity-60 mb-8" style={{fontFamily:'system-ui'}}>Más de dos décadas de experiencia a su servicio</p><div className="flex flex-col sm:flex-row gap-4 justify-center">{agent.phone&&<a href={`tel:${agent.phone}`} className="px-8 py-3 border border-white/30 text-sm" style={{fontFamily:'system-ui'}}><Phone className="w-4 h-4 inline mr-2" />{agent.phone}</a>}{agent.whatsapp&&<a href={`https://wa.me/${agent.whatsapp}`} className="px-8 py-3 text-sm font-medium" style={{backgroundColor:C.gold,color:C.brown,fontFamily:'system-ui'}}>WhatsApp</a>}</div></div></section>
      <footer className="py-6 text-center text-xs opacity-30" style={{fontFamily:'system-ui'}}>Powered by <span style={{color:C.gold}}>HabiBook</span></footer>
    </div>
  )
}
// ========== NETWORK TEMPLATE ==========
function DataTemplate({ data }: { data: TemplateData }) {
  const { agent, properties, hero, testimonials, team, services, zones } = data;
  const [filter, setFilter] = useState<string>("all");
  const filtered = properties.filter(p => filter === "all" || p.operation_type === filter);
  const bg = "#0F172A";
  const cyan = "#06B6D4";
  const slate = "#94A3B8";
  const dark2 = "#1E293B";

  return (
    <div style={{ background: bg, color: "#E2E8F0", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ background: dark2, borderBottom: "1px solid #334155", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: cyan, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: bg }}>D</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>{agent.business_name || agent.full_name}</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Inicio", "Propiedades", "Analytics", "Equipo", "Contacto"].map(l => (
            <a key={l} href={"#" + l.toLowerCase()} style={{ color: slate, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{l}</a>
          ))}
        </div>
      </nav>

      {/* Hero with data overlay */}
      <section style={{ position: "relative", padding: "5rem 2rem", background: `linear-gradient(135deg, ${bg} 0%, ${dark2} 50%, #0E2A3A 100%)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <div style={{ color: cyan, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>DATA-DRIVEN REAL ESTATE</div>
            <h1 style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, color: "#F8FAFC", margin: "0 0 1.5rem" }}>{hero?.title || "Decisiones inmobiliarias basadas en datos"}</h1>
            <p style={{ fontSize: 18, color: slate, lineHeight: 1.7, marginBottom: "2rem" }}>{hero?.subtitle || "Tecnologia avanzada y analisis de mercado en tiempo real"}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#propiedades" style={{ background: cyan, color: bg, padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>Explorar propiedades</a>
              <a href="#analytics" style={{ border: `1px solid ${cyan}`, color: cyan, padding: "14px 28px", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 15 }}>Ver analytics</a>
            </div>
          </div>
          <div style={{ background: dark2, borderRadius: 16, padding: "2rem", border: "1px solid #334155" }}>
            <div style={{ fontSize: 13, color: slate, marginBottom: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Market Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[{ label: "Precio medio/m2", val: "3.152 EUR" }, { label: "Propiedades activas", val: String(properties.length) + "+" }, { label: "Tasa de exito", val: "94.2%" }, { label: "Tiempo medio venta", val: "45 dias" }].map(s => (
                <div key={s.label} style={{ background: bg, borderRadius: 10, padding: "1rem", border: "1px solid #334155" }}>
                  <div style={{ fontSize: 12, color: slate }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: cyan, marginTop: 4 }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Stats bar */}
      <section style={{ background: dark2, borderTop: "1px solid #334155", borderBottom: "1px solid #334155", padding: "1.5rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
          {[{ n: "10.000+", l: "Transacciones analizadas" }, { n: "350+", l: "Clientes satisfechos" }, { n: agent.experience_years ? agent.experience_years + " anos" : "5 anos", l: "En el mercado" }, { n: "6", l: "Agentes especializados" }].map(s => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: cyan }}>{s.n}</div>
              <div style={{ fontSize: 13, color: slate }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Properties with data overlays */}
      <section id="propiedades" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ color: cyan, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>PORTFOLIO</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Propiedades con datos de mercado</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: "2rem" }}>
            {[{ k: "all", l: "Todas" }, { k: "sale", l: "Venta" }, { k: "rent_long", l: "Alquiler" }, { k: "rent_vacation", l: "Vacacional" }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ background: filter === f.k ? cyan : dark2, color: filter === f.k ? bg : slate, border: "1px solid " + (filter === f.k ? cyan : "#334155"), padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{f.l}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {filtered.map((p, i) => (
              <div key={i} style={{ background: dark2, borderRadius: 12, overflow: "hidden", border: "1px solid #334155", transition: "border-color 0.2s" }}>
                <div style={{ position: "relative", height: 200 }}>
                  <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600"} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 50%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                    <span style={{ background: cyan, color: bg, padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{p.operation_type === "sale" ? "VENTA" : p.operation_type === "rent_vacation" ? "VACACIONAL" : "ALQUILER"}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>{formatPrice(p.price)}</div>
                  </div>
                </div>
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>{p.title}</h3>
                  <p style={{ margin: "0 0 12px", fontSize: 13, color: slate }}>{p.location}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: slate, borderTop: "1px solid #334155", paddingTop: 10 }}>
                    <span>{p.bedrooms} hab</span>
                    <span>{p.bathrooms} banos</span>
                    <span>{p.area_m2} m2</span>
                    <span style={{ color: cyan, fontWeight: 700 }}>{p.area_m2 && p.price ? Math.round(p.price / p.area_m2) + " EUR/m2" : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Analytics Section */}
      <section id="analytics" style={{ padding: "5rem 2rem", background: dark2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ color: cyan, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>ANALYTICS</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Datos de mercado en tiempo real</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {[{ title: "Costa Adeje", price: "4.250 EUR/m2", trend: "+12.3%", color: "#10B981" }, { title: "Los Cristianos", price: "3.100 EUR/m2", trend: "+8.7%", color: "#10B981" }, { title: "Puerto de la Cruz", price: "2.400 EUR/m2", trend: "+5.2%", color: "#10B981" }, { title: "Santa Cruz", price: "2.100 EUR/m2", trend: "+3.8%", color: "#F59E0B" }].map(z => (
              <div key={z.title} style={{ background: bg, borderRadius: 12, padding: "1.5rem", border: "1px solid #334155" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", marginBottom: 12 }}>{z.title}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: cyan }}>{z.price}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                  <span style={{ color: z.color, fontSize: 13, fontWeight: 700 }}>{z.trend}</span>
                  <span style={{ fontSize: 12, color: slate }}>vs ano anterior</span>
                </div>
                <div style={{ marginTop: 12, height: 40, background: "#1E293B", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "end", gap: 2, padding: "0 4px" }}>
                  {[35,42,38,55,48,62,58,70,65,78,72,85].map((h,i) => (
                    <div key={i} style={{ flex: 1, background: i > 9 ? cyan : "#334155", height: h + "%", borderRadius: "2px 2px 0 0", transition: "height 0.3s" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team && team.length > 0 && (
        <section id="equipo" style={{ padding: "5rem 2rem" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ color: cyan, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>EQUIPO</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Nuestros especialistas</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
              {team.map((m, i) => (
                <div key={i} style={{ background: dark2, borderRadius: 12, padding: "1.5rem", border: "1px solid #334155", textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", margin: "0 auto 1rem", border: `2px solid ${cyan}` }}>
                    <img src={m.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{m.name}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: cyan }}>{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contacto" style={{ padding: "5rem 2rem", background: dark2 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ color: cyan, fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>CONTACTO</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: "0 0 1rem" }}>Solicita tu valoracion gratuita</h2>
          <p style={{ color: slate, marginBottom: "2rem" }}>Basada en mas de 10.000 transacciones reales analizadas</p>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input placeholder="Nombre" style={{ background: bg, border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", color: "#F8FAFC", fontSize: 14, outline: "none" }} />
              <input placeholder="Email" style={{ background: bg, border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", color: "#F8FAFC", fontSize: 14, outline: "none" }} />
            </div>
            <textarea placeholder="Tu mensaje..." rows={4} style={{ background: bg, border: "1px solid #334155", borderRadius: 8, padding: "12px 16px", color: "#F8FAFC", fontSize: 14, outline: "none", resize: "vertical" }} />
            <button style={{ background: cyan, color: bg, padding: "14px", borderRadius: 8, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer" }}>Enviar solicitud</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: bg, borderTop: "1px solid #334155", padding: "2rem", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: slate }}>Powered by HabiBook &mdash; Data-Driven Real Estate Platform</p>
      </footer>
    </div>
  );
}
// ═══════════════════════════════════════════
// TEMPLATE ROUTER
// ═══════════════════════════════════════════

const TEMPLATE_MAP: Record<string, React.FC<{ data: TemplateData }>> = {
  luxury: LuxuryTemplate,
  mediterranean: MediterraneanTemplate,
  corporate: CorporateTemplate,
  boutique: BoutiqueTemplate,
  classic: ClassicTemplate,
  data: DataTemplate,
};

export function TemplateRenderer({ templateId, data }: { templateId: string; data: TemplateData }) {
  const Component = TEMPLATE_MAP[templateId] || LuxuryTemplate;
  return <Component data={data} />;
}

export default TemplateRenderer;