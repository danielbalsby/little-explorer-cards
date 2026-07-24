
-- 1) Extend cards with new metadata (all nullable / defaulted)
ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS parent_category text,
  ADD COLUMN IF NOT EXISTS activity_mechanics jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS caregiver_energy text,
  ADD COLUMN IF NOT EXISTS setup_level text,
  ADD COLUMN IF NOT EXISTS good_when jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS card_type text NOT NULL DEFAULT 'activity',
  ADD COLUMN IF NOT EXISTS quality_score jsonb,
  ADD COLUMN IF NOT EXISTS fact_statement text,
  ADD COLUMN IF NOT EXISTS fact_source text,
  ADD COLUMN IF NOT EXISTS fact_source_url text,
  ADD COLUMN IF NOT EXISTS fact_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fact_verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS evidence_level text,
  ADD COLUMN IF NOT EXISTS generation_rationale text,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- 2) Safety rules table
CREATE TABLE IF NOT EXISTS public.activity_safety_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  trigger text NOT NULL,
  safety_instruction text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  source text,
  source_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_safety_rules TO authenticated;
GRANT ALL ON public.activity_safety_rules TO service_role;

ALTER TABLE public.activity_safety_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read safety rules"
  ON public.activity_safety_rules FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "admin write safety rules"
  ON public.activity_safety_rules FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_safety_rules_updated_at
  BEFORE UPDATE ON public.activity_safety_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Seed safety rules
INSERT INTO public.activity_safety_rules (category, trigger, safety_instruction, severity) VALUES
  ('sleep','sleep','Baby skal altid sove på ryggen på en fast, flad madras uden løse tæpper, puder eller legetøj.','critical'),
  ('water','water','Efterlad aldrig baby uden opsyn nær vand — heller ikke få centimeter i badet.','critical'),
  ('tummy_time','tummy_time','Mavelæg altid mens baby er vågen og under opsyn. Stop hvis baby græder eller virker udmattet.','high'),
  ('small_objects','small_objects','Undgå små løse dele der kan gå i munden. Alt under 4 cm er potentielt kvælningsfare.','critical'),
  ('elevated_surface','elevated_surface','Hold altid en hånd på baby på puslebord, seng eller sofa. Baby kan rulle uventet fra ~3 måneder.','high'),
  ('sunlight','sunlight','Baby under 6 måneder skal ikke i direkte sol. Brug skygge, tøj og hat.','high'),
  ('carrying','carrying','Sørg for at babys ansigt er frit og luftvejene ikke er dækket i bæresele.','high'),
  ('bath','bath','Test altid vandtemperatur (ca. 37°C). Slip aldrig baby i badet.','critical'),
  ('food','food','Aktiviteter må ikke involvere mad før baby er klar til smagsprøver (typisk 4–6 mdr.).','high'),
  ('outdoor','outdoor','Klæd baby efter vejret. Tjek at baby ikke bliver for varm eller for kold.','info'),
  ('natural_materials','natural_materials','Skyl og tjek naturmaterialer for skarpe kanter, insekter eller små løse dele.','info')
ON CONFLICT DO NOTHING;

-- 4) Seed new design guideline sections
INSERT INTO public.design_guidelines (category, title, content, sort_order) VALUES
  ('Produktets kerne','Kortene understøtter samvær — ikke træning','Aktiviteter skal skabe nærvær, samspil, nysgerrighed, fælles opmærksomhed, glæde, ro, bevægelse og kontakt. Kortene må aldrig føles som træning, test eller præstationsmål.',10),
  ('Samspilsprincipper','VIS → VENT → SE → SVAR','Mange aktiviteter skal indeholde naturlige små pauser. Den voksne viser noget, venter, ser hvad baby gør, og svarer på babys blik, lyd eller bevægelse. Undgå konstant stimulering uden pauser.',20),
  ('Samspilsprincipper','Følg baby','Hvis baby bliver optaget af noget andet under aktiviteten, må den voksne gerne følge den interesse. Aktiviteten behøver ikke gennemføres som beskrevet.',21),
  ('Skriveregler','Forbudte fraser','Undgå: "Træn babys…", "Få baby til at…", "Baby bør kunne…", "Øv indtil…". Undgå fagsprog som "sanseintegration", "neuropsykologisk udvikling" og "sensorisk bearbejdning".',30),
  ('Skriveregler','Foretrukne fraser','Brug hellere: "Prøv…", "Se hvad baby gør…", "Vent lidt…", "Følg babys interesse…", "Hvis baby har lyst…", "En kort stund er nok."',31),
  ('Skriveregler','Konkrete ord over fagsprog','Skriv mærke, se, høre, bevæge, opdage, vente, smile, lytte, række, undersøge, være sammen — i stedet for at demonstrere faglighed.',32),
  ('Kvalitet','No filler policy','Et nyt kort skal kun oprettes hvis det tilfører en meningsfuldt anderledes aktivitet, situation eller oplevelse. 90 exceptionelt gode kort er bedre end 120 kort med gentagelser.',40),
  ('Kvalitet','Fortjener kortet sin plads?','Før et kort godkendes: Er baby en aktiv deltager? Er der plads til at vente på babys respons? Er det reelt anderledes end eksisterende kort? Kan aktiviteten forstås næsten med det samme?',41)
ON CONFLICT DO NOTHING;
