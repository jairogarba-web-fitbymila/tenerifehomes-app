import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DEMO_DATA } from '@/lib/demo-data'
import { TEMPLATE_LIST } from '@/components/templates/types'
import DemoViewerClient from './DemoViewerClient'

const TEMPLATE_META: Record<string, { title: string; description: string }> = {
  luxury: {
    title: 'Plantilla Luxury — Web Inmobiliaria Premium',
    description: 'Diseno elegante con fondo oscuro y dorado. Ideal para agentes de villas premium y propiedades exclusivas.',
  },
  mediterranean: {
    title: 'Plantilla Mediterranean — Web Inmobiliaria Calida',
    description: 'Diseno mediterraneo con tonos calidos. Perfecto para agentes generalistas y mercado medio-alto.',
  },
  corporate: {
    title: 'Plantilla Corporate — Web para Agencias Inmobiliarias',
    description: 'Diseno profesional azul corporativo. Ideal para agencias medianas con equipo.',
  },
  boutique: {
    title: 'Plantilla Boutique — Web Inmobiliaria Editorial',
    description: 'Diseno editorial con estetica de revista. Para agencias boutique que priorizan calidad.',
  },
  classic: {
    title: 'Plantilla Classic — Web Inmobiliaria Elegante',
    description: 'Diseno clasico con tonos tierra. Para agentes veteranos con trayectoria reconocida.',
  },
  data: {
    title: 'Plantilla Data — Web Inmobiliaria con Analytics',
    description: 'Diseno tech-forward con dashboard y datos. Para agencias que usan datos como ventaja competitiva.',
  },
}

export async function generateMetadata({ params }: { params: { template: string } }): Promise<Metadata> {
  const meta = TEMPLATE_META[params.template]
  if (!meta) return { title: 'Plantilla no encontrada' }
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `https://habibook.com/demos/${params.template}` },
  }
}

export default function DemoViewerPage({ params }: { params: { template: string } }) {
  const templateId = params.template
  const data = DEMO_DATA[templateId]
  const templateInfo = TEMPLATE_LIST.find(t => t.id === templateId)

  if (!data || !templateInfo) {
    notFound()
  }

  return (
    <DemoViewerClient
      templateId={templateId}
      data={data}
      templateInfo={{ id: templateInfo.id, name: templateInfo.name, color: templateInfo.color }}
    />
  )
}
