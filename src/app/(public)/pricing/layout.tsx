import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planes y Precios',
  description: 'Elige el plan que mejor se adapta a tu negocio inmobiliario. Desde 19 EUR/mes. Starter, Pro, Premium y Agency. Dominio propio disponible por 69 EUR/ano.',
  alternates: { canonical: 'https://habibook.com/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
