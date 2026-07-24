
-- 1) Udvid status-enum
ALTER TYPE public.card_status ADD VALUE IF NOT EXISTS 'candidate';
ALTER TYPE public.card_status ADD VALUE IF NOT EXISTS 'archived';

-- 2) Nye felter på cards
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS deserves_spot text,
  ADD COLUMN IF NOT EXISTS editorial_verdict text,
  ADD COLUMN IF NOT EXISTS editor_notes text,
  ADD COLUMN IF NOT EXISTS print_fit_percentage numeric,
  ADD COLUMN IF NOT EXISTS illustration_quality jsonb;

-- 3) editorial_feedback tabel
CREATE TABLE IF NOT EXISTS public.editorial_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id uuid REFERENCES public.cards(id) ON DELETE CASCADE,
  feedback_type text NOT NULL,
  feedback_reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  feedback_note text,
  action_taken text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.editorial_feedback TO authenticated;
GRANT ALL ON public.editorial_feedback TO service_role;

ALTER TABLE public.editorial_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read feedback" ON public.editorial_feedback
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth insert feedback" ON public.editorial_feedback
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "admin manage feedback" ON public.editorial_feedback
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS editorial_feedback_card_id_idx ON public.editorial_feedback(card_id);
