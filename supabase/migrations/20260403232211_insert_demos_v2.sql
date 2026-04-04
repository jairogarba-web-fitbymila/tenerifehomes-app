-- Disable only USER triggers (not system ones) to insert demo profiles
ALTER TABLE public.agent_profiles DISABLE TRIGGER USER;

-- Insert maison-tenerife demo
INSERT INTO public.agent_profiles (id, slug, business_name, template, bio, quote, phone, email, whatsapp, languages, bio_photo_url, city, is_active, is_demo, stats)
SELECT
  'd8b3d508-5de4-4ac6-a1d8-320aa2b55280',
  'maison-tenerife',
  'Maison Tenerife',
  'boutique',
  'Somos pequeños por elección. Seleccionamos un máximo de 25 propiedades para ofrecer una atención verdaderamente personalizada.',
  'No vendemos casas. Encontramos hogares con alma.',
  '+34 611 234 567',
  'contact@maisontenerife.com',
  '34611234567',
  ARRAY['Francés', 'Español', 'Inglés'],
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  'Guía de Isora',
  true,
  true,
  '{"propiedades_seleccionadas": 25, "clientes_atendidos": 95, "satisfaccion": 100, "anos_experiencia": 8}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.agent_profiles WHERE slug = 'maison-tenerife');

-- Insert roberto-fernandez demo
INSERT INTO public.agent_profiles (id, slug, business_name, template, bio, quote, phone, email, whatsapp, languages, bio_photo_url, city, is_active, is_demo, stats)
SELECT
  'e55859f0-c5f0-4661-93d4-c7a0e0113ccf',
  'roberto-fernandez',
  'Roberto Fernández — Inmobiliaria desde 1999',
  'classic',
  '27 años en el sector inmobiliario de Tenerife. Más de 600 operaciones de compraventa realizadas.',
  'La experiencia no se compra, se gana año tras año.',
  '+34 922 345 678',
  'roberto@fernandezinmo.com',
  '34922345678',
  ARRAY['Español', 'Inglés'],
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'La Laguna',
  true,
  true,
  '{"operaciones_cerradas": 600, "premios": 4, "anos_experiencia": 27, "clientes_repetidores": 180}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.agent_profiles WHERE slug = 'roberto-fernandez');

-- Re-enable user triggers
ALTER TABLE public.agent_profiles ENABLE TRIGGER USER;
