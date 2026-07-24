-- Brand + global back settings on project_settings
ALTER TABLE public.project_settings
  ADD COLUMN IF NOT EXISTS brand_name TEXT NOT NULL DEFAULT 'Babykort',
  ADD COLUMN IF NOT EXISTS brand_tagline TEXT NOT NULL DEFAULT 'Små stunder sammen',
  ADD COLUMN IF NOT EXISTS show_tagline BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS brand_logo_url TEXT,
  ADD COLUMN IF NOT EXISTS brand_mark_url TEXT,
  ADD COLUMN IF NOT EXISTS master_card_back TEXT NOT NULL DEFAULT 'storybook_emblem',
  ADD COLUMN IF NOT EXISTS primary_brand_color TEXT NOT NULL DEFAULT '#342D27',
  ADD COLUMN IF NOT EXISTS secondary_brand_color TEXT NOT NULL DEFAULT '#AAB9A3',
  ADD COLUMN IF NOT EXISTS print_texture TEXT NOT NULL DEFAULT 'baked_in',
  ADD COLUMN IF NOT EXISTS duplex_flip TEXT NOT NULL DEFAULT 'long_edge';

-- Constrain master_card_back to the three defined variants
DO $$ BEGIN
  ALTER TABLE public.project_settings
    ADD CONSTRAINT project_settings_master_card_back_check
    CHECK (master_card_back IN ('iconic_minimal', 'storybook_emblem', 'organic_pattern'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.project_settings
    ADD CONSTRAINT project_settings_print_texture_check
    CHECK (print_texture IN ('baked_in', 'clean'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.project_settings
    ADD CONSTRAINT project_settings_duplex_flip_check
    CHECK (duplex_flip IN ('long_edge', 'short_edge'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Preserve any previously generated unique back illustration on cards
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS legacy_card_back_illustration TEXT;