'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { TemplateData } from '@/components/templates/types';

export default function AgentPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<TemplateData | null>(null);
  const [templateId, setTemplateId] = useState<string>('luxury');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch('/api/agent/' + slug);
        if (!res.ok) throw new Error('Agente no encontrado');
        const json = await res.json();
        const profile = json.profile;
        const sections = json.sections || [];
        const heroConfig = json.hero_config;

        // Map API data to TemplateData
        const templateData: TemplateData = {
          agent: {
            full_name: profile.full_name || '',
            business_name: profile.business_name || '',
            slug: profile.slug || slug,
            template: profile.template || 'luxury',
            bio: profile.bio || '',
            phone: profile.phone || '',
            email: profile.email || '',
            languages: profile.languages || [],
            experience_years: profile.experience_years,
            photo: profile.photo || '',
            location: profile.location || '',
          },
          properties: (json.properties || []).map((p: Record<string, unknown>) => ({
            title: (p.title as string) || '',
            price: (p.price as number) || 0,
            location: (p.location as string) || '',
            bedrooms: (p.bedrooms as number) || 0,
            bathrooms: (p.bathrooms as number) || 0,
            area_m2: (p.area_m2 as number) || 0,
            operation_type: (p.operation_type as string) || 'sale',
            images: Array.isArray(p.images) ? p.images : [],
          })),
          hero: heroConfig ? {
            title: heroConfig.title || '',
            subtitle: heroConfig.subtitle || '',
            image: heroConfig.background_image || heroConfig.image || '',
          } : undefined,
          testimonials: (json.testimonials || []).map((t: Record<string, unknown>) => ({
            author: (t.author as string) || (t.client_name as string) || '',
            text: (t.text as string) || (t.content as string) || '',
            rating: (t.rating as number) || 5,
          })),
          team: (json.team || []).map((m: Record<string, unknown>) => ({
            name: (m.name as string) || (m.full_name as string) || '',
            role: (m.role as string) || (m.position as string) || '',
            photo: (m.photo as string) || (m.image as string) || '',
          })),
          services: (json.services || []).map((s: Record<string, unknown>) => ({
            title: (s.title as string) || (s.name as string) || '',
            description: (s.description as string) || '',
          })),
          zones: (json.zones || []).map((z: Record<string, unknown>) => ({
            name: (z.name as string) || '',
            description: (z.description as string) || '',
            image: (z.image as string) || '',
          })),
        };

        setData(templateData);
        setTemplateId(profile.template || 'luxury');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando agente');
      } finally {
        setLoading(false);
      }
    }
    fetchAgent();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#94A3B8', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #1E293B', borderTopColor: '#06B6D4', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p>Cargando...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#94A3B8', fontFamily: 'system-ui' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, color: '#F8FAFC', marginBottom: 8 }}>404</h1>
          <p style={{ fontSize: 18 }}>{error || 'Agente no encontrado'}</p>
        </div>
      </div>
    );
  }

  return <TemplateRenderer templateId={templateId} data={data} />;
}