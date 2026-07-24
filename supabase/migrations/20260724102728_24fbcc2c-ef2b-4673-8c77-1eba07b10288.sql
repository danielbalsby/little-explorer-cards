
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS is_gold_standard boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gold_standard_reason text,
  ADD COLUMN IF NOT EXISTS gold_standard_tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gold_standard_added_at timestamptz,
  ADD COLUMN IF NOT EXISTS gold_standard_removed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reason_to_exist text,
  ADD COLUMN IF NOT EXISTS activity_in_one_sentence text,
  ADD COLUMN IF NOT EXISTS five_second_test text,
  ADD COLUMN IF NOT EXISTS intro_pattern text,
  ADD COLUMN IF NOT EXISTS blocking_issues jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS cards_is_gold_standard_idx ON public.cards (is_gold_standard) WHERE is_gold_standard = true;

CREATE OR REPLACE FUNCTION public.enforce_gold_standard_requires_approved()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_gold_standard = true AND NEW.status <> 'approved' THEN
    RAISE EXCEPTION 'Only approved cards can be marked as Gold Standard';
  END IF;
  IF NEW.is_gold_standard = true AND (OLD.is_gold_standard IS DISTINCT FROM true) THEN
    NEW.gold_standard_added_at := now();
    NEW.gold_standard_removed_at := NULL;
  END IF;
  IF NEW.is_gold_standard = false AND OLD.is_gold_standard = true THEN
    NEW.gold_standard_removed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cards_gold_standard_guard ON public.cards;
CREATE TRIGGER cards_gold_standard_guard
  BEFORE INSERT OR UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.enforce_gold_standard_requires_approved();
