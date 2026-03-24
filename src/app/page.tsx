'use client';

import { useEffect, useState, useRef } from 'react';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const framesRef = useRef<NodeListOf<Element> | null>(null);
  const phrasesRef = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    // Scroll reveal animation
    framesRef.current = document.querySelectorAll('.frame');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    framesRef.current.forEach((f) => obs.observe(f));

    return () => {
      framesRef.current?.forEach((f) => obs.unobserve(f));
    };
  }, []);

  useEffect(() => {
    // Rotating hero phrases — slow cinematic
    phrasesRef.current = document.querySelectorAll('.hero-phrase');
    const interval = setInterval(() => {
      setPhraseIndex((prevIdx) => {
        const prev = prevIdx;
        if (phrasesRef.current) {
          phrasesRef.current[prev].classList.remove('active');
          phrasesRef.current[prev].classList.add('exit');
          setTimeout(
            () => {
              if (phrasesRef.current) {
                phrasesRef.current[prev].classList.remove('exit');
              }
            },
            3000
          );
          const newIdx = (prev + 1) % phrasesRef.current.length;
          phrasesRef.current[newIdx].classList.add('active');
          return newIdx;
        }
        return prevIdx;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <style jsx global>{`
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        :root {
          --navy: #0b1d3a;
          --navy-deep: #061225;
          --gold: #c9a84c;
          --gold-light: #e8d5a0;
          --cream: #f5f0eb;
          --white: #fff;
          --text-light: rgba(255, 255, 255, 0.7);
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'Inter', -apple-system, sans-serif;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: var(--sans);
          background: var(--navy-deep);
          color: var(--white);
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* NAV */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.25rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(6, 18, 37, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.08);
        }
        .logo {
          font-family: var(--serif);
          font-size: 1.4rem;
          color: var(--white);
        }
        .logo span {
          color: var(--gold);
        }
        .nav-r {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-r a {
          color: var(--text-light);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.3s;
        }
        .nav-r a:hover {
          color: var(--white);
        }
        .nav-btn {
          background: var(--gold) !important;
          color: var(--navy) !important;
          padding: 0.55rem 1.4rem;
          border-radius: 6px;
          font-weight: 600 !important;
        }

        /* HERO: VIDEO-STYLE WITH SCROLL INDICATOR */
        .hero {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
        }
        .hero-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(6, 18, 37, 0.85) 0%,
            rgba(6, 18, 37, 0.2) 40%,
            rgba(6, 18, 37, 0.15) 60%,
            rgba(6, 18, 37, 0.35) 100%
          );
        }
        .hero-c {
          position: relative;
          z-index: 1;
          max-width: 800px;
          padding: 0 4rem 5rem;
        }
        .hero-c h1 {
          font-family: var(--serif);
          font-size: 4.5rem;
          font-weight: 700;
          line-height: 1.12;
          margin-bottom: 2rem;
          letter-spacing: -0.02em;
          height: 10.2rem;
          position: relative;
          overflow: hidden;
        }
        .hero-c h1 em {
          color: var(--gold);
          font-style: italic;
        }
        .hero-phrase {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1),
            transform 2.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-phrase.active {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-phrase.exit {
          opacity: 0;
          transform: translateY(-40px);
        }
        .hero-c p {
          font-size: 1.15rem;
          color: var(--text-light);
          font-weight: 300;
          max-width: 520px;
          margin: 0 0 2rem;
          line-height: 1.7;
        }
        .btn-gold {
          background: var(--gold);
          color: var(--navy);
          padding: 1rem 2.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-gold:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 168, 76, 0.25);
        }
        .scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          animation: float 2s infinite;
        }
        .scroll-hint span {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--gold);
        }
        .scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, var(--gold), transparent);
        }
        @keyframes float {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(8px);
          }
        }

        /* ═══ SHOWCASE BLOCKS — EACH IS A CINEMA FRAME ═══ */
        .frame {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          position: relative;
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .frame.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .frame.reverse {
          direction: rtl;
        }
        .frame.reverse > * {
          direction: ltr;
        }

        .frame-img {
          position: relative;
          overflow: hidden;
        }
        .frame-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 8s ease-out;
        }
        .frame.visible .frame-img img {
          transform: scale(1.05);
        }
        .frame-img .overlay-gradient {
          position: absolute;
          inset: 0;
        }

        .frame-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem;
          background: var(--navy-deep);
        }
        .frame-num {
          font-family: var(--serif);
          font-size: 6rem;
          font-weight: 700;
          color: rgba(201, 168, 76, 0.08);
          line-height: 1;
          margin-bottom: -1rem;
          position: relative;
          z-index: 0;
        }
        .frame-body h2 {
          font-family: var(--serif);
          font-size: 2.6rem;
          font-weight: 600;
          line-height: 1.15;
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
        }
        .frame-body h2 em {
          color: var(--gold);
          font-style: italic;
        }
        .frame-body > p {
          font-size: 1rem;
          color: var(--text-light);
          line-height: 1.7;
          font-weight: 300;
          max-width: 420px;
          margin-bottom: 1.5rem;
        }
        .frame-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }
        .highlight-chip {
          background: rgba(201, 168, 76, 0.08);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          font-size: 0.78rem;
          color: var(--gold);
          font-weight: 500;
        }
        .link-arrow {
          color: var(--gold);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: gap 0.3s;
        }
        .link-arrow:hover {
          gap: 0.8rem;
        }
        .link-arrow::after {
          content: '→';
          font-size: 1.1rem;
        }

        /* ═══ PORTALS MARQUEE ═══ */
        .marquee-section {
          padding: 4rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          text-align: center;
        }
        .marquee-section h3 {
          font-family: var(--serif);
          font-size: 1.6rem;
          margin-bottom: 2rem;
          color: var(--text-light);
        }
        .marquee-track {
          display: flex;
          gap: 2rem;
          animation: marquee 20s linear infinite;
          width: max-content;
        }
        .marquee-item {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.25);
          font-weight: 500;
          white-space: nowrap;
          padding: 0.5rem 1.5rem;
          transition: color 0.3s;
        }
        .marquee-item.gold {
          color: var(--gold);
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* ═══ TEMPLATES GALLERY ═══ */
        .gallery {
          padding: 6rem 3rem;
          text-align: center;
        }
        .gallery h2 {
          font-family: var(--serif);
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
        }
        .gallery > p {
          color: var(--text-light);
          font-size: 1rem;
          font-weight: 300;
          margin-bottom: 3rem;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .gal-item {
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 3/4;
          cursor: pointer;
        }
        .gal-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .gal-item:hover img {
          transform: scale(1.08);
        }
        .gal-cap {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(
            0deg,
            rgba(6, 18, 37, 0.9) 0%,
            transparent 100%
          );
        }
        .gal-cap h4 {
          font-family: var(--serif);
          font-size: 1.2rem;
        }
        .gal-cap span {
          font-size: 0.7rem;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ═══ PRICING HORIZONTAL ═══ */
        .pricing {
          padding: 6rem 3rem;
        }
        .pricing-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .pricing-header h2 {
          font-family: var(--serif);
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
        }
        .pricing-header p {
          color: var(--text-light);
          font-size: 1rem;
          font-weight: 300;
        }
        .price-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .p-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s;
        }
        .p-card:hover {
          border-color: rgba(201, 168, 76, 0.3);
          transform: translateY(-4px);
        }
        .p-card.featured {
          border-color: var(--gold);
          background: rgba(201, 168, 76, 0.04);
        }
        .p-badge {
          background: var(--gold);
          color: var(--navy);
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }
        .p-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .p-price {
          font-family: var(--serif);
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--gold);
        }
        .p-price span {
          font-size: 0.8rem;
          color: var(--text-light);
          font-family: var(--sans);
          font-weight: 300;
        }
        .p-sub {
          font-size: 0.75rem;
          color: var(--text-light);
          margin: 0.25rem 0 1.25rem;
        }
        .p-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .p-list li {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          padding-left: 1.1rem;
          position: relative;
        }
        .p-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--gold);
          font-size: 0.7rem;
        }
        .p-btn {
          display: block;
          text-align: center;
          padding: 0.7rem;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--white);
          transition: all 0.3s;
        }
        .p-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
        }
        .p-card.featured .p-btn {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--navy);
        }

        /* ═══ CTA ═══ */
        .final-cta {
          height: 70vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85')
            center/cover no-repeat;
        }
        .final-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(6, 18, 37, 0.65);
        }
        .final-cta-c {
          position: relative;
          z-index: 1;
        }
        .final-cta h2 {
          font-family: var(--serif);
          font-size: 3.5rem;
          margin-bottom: 0.75rem;
        }
        .final-cta h2 em {
          color: var(--gold);
          font-style: italic;
        }
        .final-cta p {
          color: var(--text-light);
          font-size: 1.1rem;
          font-weight: 300;
          max-width: 460px;
          margin: 0 auto 2rem;
        }

        @media (max-width: 1024px) {
          .frame {
            grid-template-columns: 1fr;
            min-height: auto;
          }
          .frame-img {
            height: 50vh;
          }
          .frame-body {
            padding: 3rem 2rem;
          }
          .gallery-grid,
          .price-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          nav {
            padding: 1rem 1.5rem;
          }
          .nav-r a:not(.nav-btn) {
            display: none;
          }
          .hero-c {
            padding: 0 1.5rem 3.5rem;
          }
          .hero-c h1 {
            font-size: 2.5rem;
            height: 5.8rem;
          }
          .frame-body {
            padding: 2.5rem 1.5rem;
          }
          .frame-body h2 {
            font-size: 2rem;
          }
          .frame-num {
            font-size: 4rem;
          }
          .gallery,
          .pricing {
            padding: 4rem 1.5rem;
          }
          .gallery-grid,
          .price-row {
            grid-template-columns: 1fr 1fr;
          }
          .final-cta {
            height: 50vh;
          }
          .final-cta h2 {
            font-size: 2.2rem;
          }
        }
      `}</style>

      <nav>
        <div className="logo">
          Habi<span>Book</span>
        </div>
        <div className="nav-r">
          <a href="#features">Funcionalidades</a>
          <a href="/demos">Plantillas</a>
          <a href="#precios">Precios</a>
          <a href="#" className="nav-btn">
            Prueba 14 días
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=1920&q=85"
            alt="Profesionales inmobiliarios en oficina moderna con vistas panorámicas"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center bottom,rgba(6,18,37,0.4),rgba(6,18,37,0.85))',
            }}
          ></div>
        </div>
        <div className="hero-c">
          <div
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--gold)',
              border: '1px solid rgba(201,168,76,0.4)',
              padding: '0.35rem 1rem',
              borderRadius: '100px',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            Plataforma inmobiliaria global
          </div>
          <h1 id="hero-title">
            <span className="hero-phrase active">
              El futuro inmobiliario
              <br />
              es <em>ahora</em>
            </span>
            <span className="hero-phrase">
              Vende propiedades
              <br />
              <em>sin límites</em>
            </span>
            <span className="hero-phrase">
              Tu negocio,
              <br />
              <em>elevado</em>
            </span>
            <span className="hero-phrase">
              Tenerife merece
              <br />
              <em>lo mejor</em>
            </span>
            <span className="hero-phrase">
              Domina el mercado
              <br />
              <em>inmobiliario</em>
            </span>
          </h1>
          <p>
            Web profesional, CRM, distribución a 11 portales y gestión de
            alquileres. Todo en una plataforma.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" className="btn-gold">
              Empezar ahora →
            </a>
            <a
              href="#features"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'var(--white)',
                padding: '1rem 2.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              Explorar
            </a>
          </div>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* ═══ FRAME 1: WEB ═══ */}
      <section className="frame" id="features">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80"
            alt="Persona diseñando web inmobiliaria en ordenador"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(90deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">01</div>
          <h2>
            7 plantillas.
            <br />
            Tu marca, <em>tu estilo</em>
          </h2>
          <p>
            Elige entre diseños luxury, mediterráneo, corporate, boutique y
            más. Personaliza colores, logo y dominio propio. Lista en 10
            minutos.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">7 plantillas</span>
            <span className="highlight-chip">Dominio propio</span>
            <span className="highlight-chip">SEO multiidioma</span>
            <span className="highlight-chip">100% responsive</span>
          </div>
          <a href="#" className="link-arrow">
            Ver plantillas
          </a>
        </div>
      </section>

      {/* ═══ FRAME 2: DISTRIBUCIÓN ═══ */}
      <section className="frame reverse">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
            alt="Dashboard de distribución a portales inmobiliarios"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(270deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">02</div>
          <h2>
            Publica en <em>11 portales</em>
            <br />
            con un clic
          </h2>
          <p>
            Idealista, Fotocasa, Kyero, Rightmove, ImmoScout24... Crea la
            propiedad una vez, nosotros la distribuimos a toda Europa.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">Sincronización automática</span>
            <span className="highlight-chip">Fotos multiidioma</span>
            <span className="highlight-chip">Analytics por portal</span>
            <span className="highlight-chip">11 portales</span>
          </div>
          <a href="#" className="link-arrow">
            Ver portales
          </a>
        </div>
      </section>

      {/* ═══ FRAME 3: MLS ═══ */}
      <section className="frame">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80"
            alt="Dos agentes inmobiliarios colaborando con tablet"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(90deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">03</div>
          <h2>
            MLS
            <br />
            <em>compartido</em>
          </h2>
          <p>
            Accede al inventario de otras agencias. Comparte propiedades.
            Comisiones automáticas y transparentes entre profesionales.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">Inventario compartido</span>
            <span className="highlight-chip">Comisiones auto</span>
            <span className="highlight-chip">Red de agentes</span>
          </div>
          <a href="#" className="link-arrow">
            Descubrir MLS
          </a>
        </div>
      </section>

      {/* ═══ FRAME 4: ALQUILERES ═══ */}
      <section className="frame reverse">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=1200&q=80"
            alt="Gestión de alquileres vacacionales en laptop"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(270deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">04</div>
          <h2>
            Vacacional y
            <br />
            <em>larga temporada</em>
          </h2>
          <p>
            Calendario unificado, sync con Airbnb y Booking, pricing dinámico
            con IA, gestión de limpiezas e informes al propietario.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">Channel manager</span>
            <span className="highlight-chip">Liquidaciones PDF</span>
            <span className="highlight-chip">Contabilidad IGIC/IRPF</span>
            <span className="highlight-chip">Pricing IA</span>
          </div>
          <a href="#" className="link-arrow">
            Ver módulo
          </a>
        </div>
      </section>

      {/* ═══ FRAME 5: CRM ═══ */}
      <section className="frame">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
            alt="CRM dashboard con analytics y leads en pantalla"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(90deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">05</div>
          <h2>
            Cada lead,
            <br />
            <em>bajo control</em>
          </h2>
          <p>
            Captura, seguimiento y conversión. Email marketing segmentado.
            Analytics en tiempo real. Todo en un panel unificado.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">Leads automáticos</span>
            <span className="highlight-chip">Email marketing</span>
            <span className="highlight-chip">Informes de conversión</span>
            <span className="highlight-chip">Segmentación por perfil</span>
          </div>
          <a href="#" className="link-arrow">
            Ver CRM
          </a>
        </div>
      </section>

      {/* ═══ FRAME 6: PROFESIONALES ═══ */}
      <section className="frame reverse">
        <div className="frame-img">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80"
            alt="Profesionales reunidos discutiendo sobre planos"
          />
          <div
            className="overlay-gradient"
            style={{
              background:
                'linear-gradient(270deg,transparent 60%,var(--navy-deep) 100%)',
            }}
          ></div>
        </div>
        <div className="frame-body">
          <div className="frame-num">06</div>
          <h2>
            Red
            <br />
            <em>profesional</em>
          </h2>
          <p>
            Abogados, arquitectos y aparejadores verificados. Servicio integral
            para cada operación.
          </p>
          <div className="frame-highlights">
            <span className="highlight-chip">Abogados</span>
            <span className="highlight-chip">Arquitectos</span>
            <span className="highlight-chip">Aparejadores</span>
            <span className="highlight-chip">Fiscalistas</span>
          </div>
          <a href="#" className="link-arrow">
            Ver directorio
          </a>
        </div>
      </section>

      {/* PORTAL MARQUEE */}
      <section className="marquee-section">
        <h3>Conectado a los portales que importan</h3>
        <div className="marquee-track">
          <span className="marquee-item gold">Idealista</span>
          <span className="marquee-item">Fotocasa</span>
          <span className="marquee-item gold">Kyero</span>
          <span className="marquee-item">Habitaclia</span>
          <span className="marquee-item gold">Rightmove</span>
          <span className="marquee-item">Pisos.com</span>
          <span className="marquee-item gold">ImmoScout24</span>
          <span className="marquee-item">ThinkSpain</span>
          <span className="marquee-item">Immowelt</span>
          <span className="marquee-item">Milanuncios</span>
          <span className="marquee-item">Yaencontre</span>
          <span className="marquee-item gold">Idealista</span>
          <span className="marquee-item">Fotocasa</span>
          <span className="marquee-item gold">Kyero</span>
          <span className="marquee-item">Habitaclia</span>
          <span className="marquee-item gold">Rightmove</span>
          <span className="marquee-item">Pisos.com</span>
          <span className="marquee-item gold">ImmoScout24</span>
          <span className="marquee-item">ThinkSpain</span>
          <span className="marquee-item">Immowelt</span>
          <span className="marquee-item">Milanuncios</span>
          <span className="marquee-item">Yaencontre</span>
        </div>
      </section>

      {/* TEMPLATES GALLERY */}
      <section className="gallery" id="plantillas">
        <h2>Plantillas que venden</h2>
        <p>7 diseños interactivos. Haz clic para explorar cada demo.</p>
        <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <a href="/demos/luxury" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&q=80" alt="Luxury" /><div className="gal-cap"><span>Premium</span><h4>Luxury</h4></div></a>
            <a href="/demos/mediterranean" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80" alt="Mediterranean" /><div className="gal-cap"><span>Cálido</span><h4>Mediterranean</h4></div></a>
            <a href="/demos/corporate" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80" alt="Corporate" /><div className="gal-cap"><span>Profesional</span><h4>Corporate</h4></div></a>
            <a href="/demos/boutique" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80" alt="Boutique" /><div className="gal-cap"><span>Exclusivo</span><h4>Boutique</h4></div></a>
            <a href="/demos/classic" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80" alt="Classic" /><div className="gal-cap"><span>Clásico</span><h4>Classic</h4></div></a>
            <a href="/demos/network" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80" alt="Network" /><div className="gal-cap"><span>Multi-oficina</span><h4>Network</h4></div></a>
            <a href="/demos/data" className="gal-item" style={{ textDecoration: 'none', color: 'inherit' }}><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80" alt="Data" /><div className="gal-cap"><span>Analytics</span><h4>Data-Driven</h4></div></a>
            <a href="/demos" className="gal-item" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)' }}><div style={{ textAlign: 'center', padding: '2rem' }}><div style={{ fontSize: '2rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>&rarr;</div><h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem' }}>Ver todas</h4><span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>7 demos interactivas</span></div></a>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="precios">
        <div className="pricing-header">
          <h2>Invierte en crecer</h2>
          <p>Escala cuando quieras. Sin permanencia.</p>
        </div>
        <div className="price-row">
          <div className="p-card">
            <h3>Starter</h3>
            <div className="p-price">
              39€<span>/mes</span>
            </div>
            <div className="p-sub">+ IGIC · Para agentes independientes</div>
            <ul className="p-list">
              <li>20 propiedades</li>
              <li>3 plantillas</li>
              <li>2 portales</li>
              <li>CRM completo</li>
            </ul>
            <a href="#" className="p-btn">
              Prueba 14 días
            </a>
          </div>
          <div className="p-card featured">
            <div className="p-badge">Popular</div>
            <h3>Pro</h3>
            <div className="p-price">
              79€<span>/mes</span>
            </div>
            <div className="p-sub">+ IGIC · El más elegido</div>
            <ul className="p-list">
              <li>100 propiedades</li>
              <li>7 plantillas</li>
              <li>5 portales</li>
              <li>Alquileres</li>
              <li>Email marketing</li>
            </ul>
            <a href="#" className="p-btn">
              Elegir Pro
            </a>
          </div>
          <div className="p-card">
            <h3>Premium</h3>
            <div className="p-price">
              149€<span>/mes</span>
            </div>
            <div className="p-sub">+ IGIC · Sin límites</div>
            <ul className="p-list">
              <li>Ilimitadas</li>
              <li>11 portales</li>
              <li>MLS completo</li>
              <li>Channel manager</li>
              <li>Contabilidad</li>
            </ul>
            <a href="#" className="p-btn">
              Elegir Premium
            </a>
          </div>
          <div className="p-card">
            <h3>Agencia</h3>
            <div className="p-price">
              349€<span>/mes</span>
            </div>
            <div className="p-sub">+ IGIC · Multi-agente</div>
            <ul className="p-list">
              <li>Todo Premium</li>
              <li>15 agentes</li>
              <li>Panel centralizado</li>
              <li>API + reporting</li>
              <li>Soporte prioritario</li>
            </ul>
            <a href="#" className="p-btn">
              Contactar
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="final-cta">
        <div className="final-cta-c">
          <h2>
            Empieza hoy,
            <br />
            <em>domina mañana</em>
          </h2>
          <p>Tu web profesional en 10 minutos. Prueba sin compromiso.</p>
          <a href="#" className="btn-gold">
            Empezar ahora →
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
