import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-white font-display text-2xl font-bold">TenerifeHomes</div>
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-white/80 hover:text-white text-sm">Buscar propiedades</Link>
          <Link href="/login" className="text-white/80 hover:text-white text-sm">Iniciar sesion</Link>
          <Link href="/register" className="btn-primary text-sm">Registrar agente</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
            Tu negocio inmobiliario,{' '}
            <span className="text-gold-400">profesionalizado</span>
          </h1>
          <p className="mt-6 text-xl text-white/70 leading-relaxed">
            Web profesional en 10 minutos. Publica en todos los portales desde un solo sitio.
            CRM, leads, contabilidad y MLS compartido — todo incluido.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/register" className="bg-gold-500 text-brand-950 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-gold-400 transition-colors">
              Empieza gratis
            </Link>
            <Link href="/search" className="bg-white/10 text-white px-8 py-3.5 rounded-lg font-medium text-lg hover:bg-white/20 transition-colors backdrop-blur">
              Ver propiedades
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '35', label: 'Regiones en España' },
            { value: '7', label: 'Plantillas de diseño' },
            { value: '11', label: 'Portales conectados' },
            { value: '10', label: 'Idiomas soportados' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-gold-400">{stat.value}</div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
