ALTER TABLE public.agent_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;
COMMENT ON COLUMN public.agent_profiles.is_demo IS 'Flag para perfiles de demostración. Los demos no aparecen en búsquedas públicas.';
