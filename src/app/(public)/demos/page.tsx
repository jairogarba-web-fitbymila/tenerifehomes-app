'use client';

import Link from 'next/link';
import { TEMPLATE_LIST } from '@/components/templates/types';

export default function DemosGalleryPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B1120', color: '#E2E8F0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <nav style={{ background: '#111827', borderBottom: '1px solid #1F2937', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href='/' style={{ fontWeight: 800, fontSize: 22, color: '#F8FAFC', textDecoration: 'none' }}>
          Habi<span style={{ color: '#06B6D4' }}>Book</span>
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href='/register' style={{ background: '#06B6D4', color: '#0B1120', padding: '10px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Crear mi web gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 3rem' }}>
        <div style={{ color: '#06B6D4', fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>PLANTILLAS PROFESIONALES</div>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 1rem', color: '#F8FAFC' }}>13 plantillas. Tu estilo.</h1>
        <p style={{ fontSize: 18, color: '#94A3B8', maxWidth: 600, margin: '0 auto 3rem', lineHeight: 1.7 }}>Cada plantilla esta disenada para un perfil de agente diferente. Explora las demos interactivas y elige la tuya.</p>
      </section>

      {/* Template Grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {TEMPLATE_LIST.map(t => {
            return (
              <Link key={t.id} href={'/demos/' + t.id} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111827', borderRadius: 16, overflow: 'hidden', border: '1px solid #1F2937', transition: 'all 0.3s', cursor: 'pointer' }}>
                  {/* Preview image */}
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={'/previews/' + t.id + '.png'} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 16, left: 16 }}>
                      <span style={{ background: t.color, color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{t.id}</span>
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: 20, fontWeight: 700, color: '#F8FAFC' }}>{t.name}</h3>
                    <p style={{ margin: '0 0 12px', fontSize: 14, color: '#94A3B8', lineHeight: 1.6 }}>{t.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>Demo: {t.persona}</span>
                      <span style={{ color: '#06B6D4', fontSize: 14, fontWeight: 600 }}>Ver demo &rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '4rem 2rem', background: '#111827', borderTop: '1px solid #1F2937' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#F8FAFC', margin: '0 0 1rem' }}>Listo para empezar?</h2>
        <p style={{ fontSize: 16, color: '#94A3B8', marginBottom: '2rem' }}>Crea tu web inmobiliaria profesional en 10 minutos</p>
        <Link href='/register' style={{ background: '#06B6D4', color: '#0B1120', padding: '16px 40px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>Empezar ahora</Link>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid #1F2937' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>HabiBook &mdash; Booking Marketplace Inmobiliario</p>
      </footer>
    </div>
  );
}
