
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS print_content jsonb,
  ADD COLUMN IF NOT EXISTS extended_content jsonb,
  ADD COLUMN IF NOT EXISTS illustration_prompt text,
  ADD COLUMN IF NOT EXISTS illustration_status text NOT NULL DEFAULT 'not_generated',
  ADD COLUMN IF NOT EXISTS illustration_url text,
  ADD COLUMN IF NOT EXISTS needs_shortening boolean NOT NULL DEFAULT false;

ALTER TABLE public.cards
  DROP CONSTRAINT IF EXISTS cards_illustration_status_check;
ALTER TABLE public.cards
  ADD CONSTRAINT cards_illustration_status_check
  CHECK (illustration_status IN ('not_generated', 'draft', 'approved'));
