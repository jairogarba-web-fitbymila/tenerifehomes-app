import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buscar Propiedades en Tenerife',
  description: 'Encuentra tu propiedad ideal en Tenerife. Venta, alquiler vacacional y larga temporada. Propiedades de agentes verificados.',
  alternates: { canonical: 'https://habibook.com/search' },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
