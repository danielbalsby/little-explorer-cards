// Bagudkompatibel wrapper — bruger nu det nye CardFront-layout.
import { CardFront } from "./card-front";
import { legacyToPrint } from "@/lib/card-text";
import type { CardContent, PrintContent } from "@/lib/card-schema";

/**
 * Accepterer enten det gamle CardContent (legacy) eller nyt PrintContent.
 * Mapper legacy-felter on-the-fly, så eksisterende views virker.
 */
export function CardPreview({
  card,
  scale = 1,
}: {
  card: Partial<CardContent> | Partial<PrintContent>;
  scale?: number;
}) {
  const anyCard = card as Record<string, unknown>;
  // Detektér: har den de nye felter?
  const isPrint = "intro" in anyCard || "steps" in anyCard || "look_for" in anyCard;
  const print: Partial<PrintContent> = isPrint
    ? (card as Partial<PrintContent>)
    : legacyToPrint({
        title: (anyCard.title as string) ?? "",
        age_group: (anyCard.age_group as string) ?? "2-4m",
        purpose: anyCard.purpose as string | null,
        primary_development_area: anyCard.primary_development_area as string | null,
        secondary_development_areas: anyCard.secondary_development_areas,
        materials: anyCard.materials,
        activity_steps: anyCard.activity_steps,
        variations: anyCard.variations,
        observations: anyCard.observations as string | null,
        pause_signs: anyCard.pause_signs as string | null,
        safety: anyCard.safety as string | null,
        did_you_know: anyCard.did_you_know as string | null,
      });
  return <CardFront print={print} scale={scale} />;
}
