-- Fix trigger that references agent_sections with wrong schema
-- Replace the trigger function to use the correct schema
CREATE OR REPLACE FUNCTION public.create_default_sections()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.agent_sections (agent_id, section_key, is_active, display_order)
  VALUES
    (NEW.id, 'nav', true, 1),
    (NEW.id, 'hero', true, 2),
    (NEW.id, 'properties_sale', true, 3),
    (NEW.id, 'about', true, 4),
    (NEW.id, 'services', true, 5),
    (NEW.id, 'testimonials', true, 6),
    (NEW.id, 'contact_form', true, 7),
    (NEW.id, 'footer', true, 8)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN undefined_table THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS create_default_sections_trigger ON public.agent_profiles;
CREATE TRIGGER create_default_sections_trigger
  AFTER INSERT ON public.agent_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_sections();
