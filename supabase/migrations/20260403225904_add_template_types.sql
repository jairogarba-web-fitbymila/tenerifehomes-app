-- Add missing template types to the enum
DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'classic';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'data';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-dark';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-light';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-agent';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-team';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-catalog';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'editorial-fullservice';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE template_type ADD VALUE IF NOT EXISTS 'monolith';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
