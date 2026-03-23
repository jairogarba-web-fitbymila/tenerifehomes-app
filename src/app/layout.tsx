import type { Metadata } from 'next'
import '@/styles/globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'HabiBook — Plataforma Inmobiliaria',
  description: 'Marketplace inmobiliario multi-idioma para agentes y agencias en Canarias y toda España.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
