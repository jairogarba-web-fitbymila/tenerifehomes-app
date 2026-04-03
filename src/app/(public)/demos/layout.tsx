import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plantillas de Diseno para tu Web Inmobiliaria',
  description: 'Explora nuestras plantillas profesionales. Luxury, Mediterranean, Corporate, Boutique, Classic y Data. Personaliza la tuya en minutos.',
  alternates: { canonical: 'https://habibook.com/demos' },
}

export default function DemosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
