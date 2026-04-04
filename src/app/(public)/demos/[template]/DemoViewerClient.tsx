'use client'

import Link from 'next/link'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { TemplateData, TEMPLATE_LIST } from '@/components/templates/types'

interface DemoViewerClientProps {
  templateId: string
  data: TemplateData
  templateInfo: { id: string; name: string; color: string }
}

export default function DemoViewerClient({ templateId, data, templateInfo }: DemoViewerClientProps) {
  return (
    <div>
      {/* Floating toolbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: '#111827EE', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1F2937', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href='/demos' style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>&larr; Plantillas</Link>
          <div style={{ width: 1, height: 20, background: '#334155' }} />
          <span style={{ color: '#F8FAFC', fontSize: 14, fontWeight: 700 }}>{templateInfo.name}</span>
          <span style={{ background: templateInfo.color, color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{templateInfo.id.toUpperCase()}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {TEMPLATE_LIST.map(t => (
            <Link key={t.id} href={'/demos/' + t.id} style={{ width: 28, height: 28, borderRadius: 6, background: t.id === templateId ? t.color : '#1F2937', border: t.id === templateId ? '2px solid #F8FAFC' : '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 10, fontWeight: 700, color: t.id === templateId ? '#fff' : '#64748B' }} title={t.name}>{t.id[0].toUpperCase()}</Link>
          ))}
          <div style={{ width: 1, height: 20, background: '#334155', marginLeft: 8 }} />
          <Link href={'/register?template=' + templateId} style={{ background: '#06B6D4', color: '#0B1120', padding: '6px 16px', borderRadius: 6, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Usar esta plantilla</Link>
        </div>
      </div>
      {/* Template content */}
      <div style={{ paddingTop: 48 }}>
        <TemplateRenderer templateId={templateId} data={data} />
      </div>
    </div>
  )
}
