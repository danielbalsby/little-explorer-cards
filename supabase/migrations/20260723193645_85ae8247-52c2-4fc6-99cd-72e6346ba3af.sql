
-- Enums
CREATE TYPE public.card_status AS ENUM ('draft','approved','rejected');
CREATE TYPE public.age_group AS ENUM ('0-2m','2-4m','4-6m','6-9m','9-12m');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.development_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.development_areas TO authenticated;
GRANT ALL ON public.development_areas TO service_role;
ALTER TABLE public.development_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read areas" ON public.development_areas FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write areas" ON public.development_areas FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE SEQUENCE public.cards_card_number_seq START 1;
CREATE TABLE public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number int NOT NULL DEFAULT nextval('public.cards_card_number_seq'),
  title text NOT NULL,
  age_group public.age_group NOT NULL,
  purpose text NOT NULL DEFAULT '',
  primary_development_area text NOT NULL DEFAULT '',
  secondary_development_areas jsonb NOT NULL DEFAULT '[]'::jsonb,
  materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  activity_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  variations jsonb NOT NULL DEFAULT '[]'::jsonb,
  observations text NOT NULL DEFAULT '',
  pause_signs text NOT NULL DEFAULT '',
  safety text NOT NULL DEFAULT '',
  did_you_know text NOT NULL DEFAULT '',
  activity_type text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  status public.card_status NOT NULL DEFAULT 'draft',
  version int NOT NULL DEFAULT 1,
  is_locked boolean NOT NULL DEFAULT false,
  similarity_score numeric,
  is_demo boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.cards_card_number_seq TO authenticated;
GRANT ALL ON SEQUENCE public.cards_card_number_seq TO service_role;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read cards" ON public.cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write cards" ON public.cards FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER cards_touch BEFORE UPDATE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.card_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  version_number int NOT NULL,
  content jsonb NOT NULL,
  change_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.card_versions TO authenticated;
GRANT ALL ON public.card_versions TO service_role;
ALTER TABLE public.card_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read versions" ON public.card_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write versions" ON public.card_versions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX card_versions_card_idx ON public.card_versions(card_id, version_number DESC);

CREATE TABLE public.design_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.design_guidelines TO authenticated;
GRANT ALL ON public.design_guidelines TO service_role;
ALTER TABLE public.design_guidelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read guidelines" ON public.design_guidelines FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write guidelines" ON public.design_guidelines FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER guidelines_touch BEFORE UPDATE ON public.design_guidelines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.project_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name text NOT NULL DEFAULT 'Babyaktivitetskort',
  target_card_count int NOT NULL DEFAULT 120,
  default_language text NOT NULL DEFAULT 'da',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_settings TO authenticated;
GRANT ALL ON public.project_settings TO service_role;
ALTER TABLE public.project_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read settings" ON public.project_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write settings" ON public.project_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER settings_touch BEFORE UPDATE ON public.project_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.project_settings (project_name, target_card_count) VALUES ('Babyaktivitetskort', 120);

INSERT INTO public.development_areas (name, slug, icon) VALUES
  ('Grovmotorik','grovmotorik','Activity'),
  ('Finmotorik','finmotorik','Hand'),
  ('Balance','balance','Scale'),
  ('Koordination','koordination','Waves'),
  ('Kropsbevidsthed','kropsbevidsthed','User'),
  ('Vestibulær sans','vestibulaer','RotateCw'),
  ('Proprioception','proprioception','Move3d'),
  ('Berøring','beroering','Fingerprint'),
  ('Syn','syn','Eye'),
  ('Hørelse','hoerelse','Ear'),
  ('Kommunikation','kommunikation','MessageCircle'),
  ('Tidligt sprog','tidligt-sprog','Speech'),
  ('Følelsesmæssig regulering','folelser','Heart'),
  ('Tilknytning','tilknytning','HeartHandshake'),
  ('Sociale kompetencer','sociale','Users'),
  ('Musik','musik','Music'),
  ('Natur','natur','Leaf'),
  ('Kreativitet','kreativitet','Palette'),
  ('Problemløsning','problemloesning','Puzzle'),
  ('Selvstændighed','selvstaendighed','Sparkles'),
  ('Hverdagsrutiner','rutiner','Sun'),
  ('Søvn','soevn','Moon'),
  ('Rolig stimulering','rolig','Feather'),
  ('Aktiv leg','aktiv','Gamepad2');

INSERT INTO public.design_guidelines (category, title, content, sort_order) VALUES
  ('Tone of voice','Overordnet stemning','Varm, faglig, nærværende. Skriv til den voksne som ligeværdig samarbejdspartner — ikke belærende.',1),
  ('Tone of voice','Undgå','Barnet skal kunne..., præstationssprog, kategoriske udsagn om udvikling.',2),
  ('Tone of voice','Foretræk','Mange børn begynder..., Nogle børn vil..., Udvikling varierer fra barn til barn.',3),
  ('Sikkerhed','Grundprincip','Aldrig medicinsk rådgivning. Ved tvivl: henvis til sundhedsplejerske eller læge.',4),
  ('Produktværdier','Kerneværdier','Originalt, evidensinformeret, trygt, realistisk, inkluderende, nærværsskabende, uden præstationspres.',5),
  ('Typografi','Overskrifter','Blød serif eller humanistisk sans. Rolig vægt.',6),
  ('Farver','Aldersfarvekode','Bruges primært som kategori- og aldersmarkører — ikke som pynt.',7);

INSERT INTO public.cards (
  title, age_group, purpose, primary_development_area, secondary_development_areas,
  materials, activity_steps, variations, observations, pause_signs, safety, did_you_know,
  activity_type, duration, status, is_demo
) VALUES
  ('Ansigt til ansigt','0-2m',
   'Rolig kontakt der styrker tilknytning og understøtter tidligt syn. Aktiviteten inviterer til øjenkontakt og genkendelse.',
   'Tilknytning', jsonb_build_array('Syn','Kommunikation'),
   jsonb_build_array('Ingen materialer'),
   jsonb_build_array('Læg barnet på ryggen på et blødt underlag.','Placér dit ansigt ca. 20-30 cm over barnets.','Tal roligt og hold pauser.','Følg barnets blik og reaktioner.'),
   jsonb_build_array('Prøv en blid smågrimasse.','Syng en rolig strofe.','Lav aktiviteten under bleskift.'),
   'Mange små børn kigger længere når stemmen er rolig og pauserne tydelige.',
   'Kigger væk, gaber, bliver stiv i kroppen.',
   'Støt altid hovedet ved løft. Hold underlaget rent og blødt.',
   'Nyfødte ser skarpest på 20-30 cm afstand — cirka som til dit ansigt under amning.',
   'Kontakt og nærvær','3-5 minutter','approved',true),
  ('Puste-leg','2-4m',
   'Blid sansestimulering af hud og hørelse. Styrker opmærksomhed og tryghed i den voksnes nærhed.',
   'Berøring', jsonb_build_array('Hørelse','Tilknytning'),
   jsonb_build_array('Ingen materialer'),
   jsonb_build_array('Læg barnet magelig på ryggen.','Pust let mod barnets hånd eller kind.','Vent på reaktionen.','Gentag i barnets tempo.'),
   jsonb_build_array('Pust mod maven i stedet.','Kombinér med en blød hvislelyd.','Skift mellem korte og lange pust.'),
   'Nogle børn smiler, andre kigger overrasket — begge dele er tegn på engagement.',
   'Vender hovedet væk, græder, rynker panden.',
   'Pust roligt og fra kort afstand. Undgå ansigtet.',
   'Berøring og lette luftbevægelser aktiverer huden og kan berolige mange små børn.',
   'Sansestimulering','3-5 minutter','approved',true),
  ('Trille tørklæde','4-6m',
   'Understøtter greb og øje-hånd-koordination. Barnet oplever årsag og virkning når tørklædet flytter sig.',
   'Finmotorik', jsonb_build_array('Syn','Koordination'),
   jsonb_build_array('Et tyndt tørklæde eller viskestykke'),
   jsonb_build_array('Sæt jer over for hinanden på gulvet.','Rul tørklædet frem og tilbage.','Peg og benævn hvor tørklædet dukker op.'),
   jsonb_build_array('Brug to tørklæder.','Prøv med en let bold.','Sid på et tæppe udendørs.'),
   'Mange børn strækker armen mod tørklædet — det er tidlig griberespons.',
   'Kigger væk, mister interesse, bliver rastløs.',
   'Hold tørklædet væk fra ansigtet. Vær opmærksom hvis barnet putter det i munden.',
   'Øje-hånd-koordination udvikles tydeligt i 4-6 måneders alderen.',
   'Rolig leg','5-10 minutter','draft',true),
  ('Sang og rytme','6-9m',
   'Understøtter tidligt sprog og glæde ved gentagelse. Rytmen skaber forudsigelighed.',
   'Musik', jsonb_build_array('Tidligt sprog','Kommunikation'),
   jsonb_build_array('Ingen materialer'),
   jsonb_build_array('Hold barnet på skødet eller sid overfor.','Syng en enkel sang med tydelige pauser.','Klap med i rytmen.','Gentag samme sang flere gange.'),
   jsonb_build_array('Skift til en anden kendt sang.','Brug hænderne til fagter.','Syng lavere og langsommere.'),
   'Mange børn begynder at pludre eller bevæge sig i takt.',
   'Vender hovedet væk, virker overstimuleret, græder.',
   'Undgå meget høje lyde tæt på øret.',
   'Gentagelse hjælper hjernen med at genkende mønstre — grundlaget for sprog.',
   'Musik','5-10 minutter','approved',true),
  ('Kravle-tunnel','9-12m',
   'Understøtter grovmotorik og rumlig forståelse. Barnet øver planlagt bevægelse.',
   'Grovmotorik', jsonb_build_array('Problemløsning','Kropsbevidsthed'),
   jsonb_build_array('En dyne eller et par stole med et tæppe over'),
   jsonb_build_array('Byg en lille tunnel af tæppe og stole.','Læg et yndlingsobjekt i den anden ende.','Opmuntr barnet til at kravle igennem.','Vent tålmodigt ved åbningen.'),
   jsonb_build_array('Læg puder til at støtte sig på.','Kravl med igennem.','Kortere eller længere tunnel.'),
   'Nogle børn stopper og kigger op — det er en normal pause for at orientere sig.',
   'Virker frustreret, græder, vil op.',
   'Tjek at tunnelen er stabil og ikke kan falde sammen.',
   'Kravling træner både muskler og hjernen samtidig.',
   'Aktiv leg','5-10 minutter','draft',true),
  ('Blid massage','0-2m',
   'Beroligende berøring der understøtter tryghed og reguleret vejrtrækning.',
   'Rolig stimulering', jsonb_build_array('Berøring','Tilknytning'),
   jsonb_build_array('Blødt håndklæde'),
   jsonb_build_array('Læg barnet varmt og trygt.','Læg din hånd blødt på brystet et øjeblik.','Stryg langsomt ned ad arme og ben.','Følg barnets tempo.'),
   jsonb_build_array('Nyn samtidig.','Kortere version på 2 minutter.','Efter bad.'),
   'Mange børn slapper af i skuldre og hænder når berøringen er langsom.',
   'Bliver stiv, græder, trækker sig væk.',
   'Undgå tryk på maven. Sørg for varm hud.',
   'Blid berøring kan sænke stresshormoner hos små børn.',
   'Rolig leg','3-5 minutter','approved',true);
