CREATE TABLE IF NOT EXISTS public.content_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.agent_profiles(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  source_field TEXT NOT NULL,
  source_language TEXT NOT NULL DEFAULT 'es',
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_table, source_id, source_field, target_language)
);

CREATE INDEX IF NOT EXISTS idx_translations_lookup
  ON public.content_translations(agent_id, source_table, source_id, target_language);
CREATE INDEX IF NOT EXISTS idx_translations_pending
  ON public.content_translations(status) WHERE status = 'pending';

ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read translations" ON public.content_translations
  FOR SELECT USING (true);

CREATE POLICY "Agents manage own translations" ON public.content_translations
  FOR ALL USING (agent_id = auth.uid());
