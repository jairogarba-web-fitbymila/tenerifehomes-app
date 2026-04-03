import type { Metadata } from 'next'
import '@/styles/globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://habibook.com'),
  title: {
    default: 'HabiBook — Plataforma Inmobiliaria para Agentes',
    template: '%s | HabiBook',
  },
  description: 'Crea tu web inmobiliaria profesional en minutos. CRM, leads, valoracion IA y MLS compartido.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'HabiBook',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Manrope:wght@300;400;500;700;800&family=Lexend:wght@700;800;900&family=Space+Grotesk:wght@300;400;500;700&family=Public+Sans:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
