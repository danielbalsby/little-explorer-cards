import { CardFront } from "./card-front";
import { CardBack } from "./card-back";
import type { PrintContent, AgeGroup } from "@/lib/card-schema";

interface CardSpreadProps {
  print: Partial<PrintContent>;
  age_group?: AgeGroup;
  card_number?: number;
  illustration_url?: string | null;
  illustration_status?: "not_generated" | "draft" | "approved";
  side?: "front" | "back" | "both";
  guides?: boolean;
  scale?: number;
}

/** Side-om-side visning af forside og bagside. */
export function CardSpread({
  print,
  age_group,
  card_number,
  illustration_url,
  illustration_status,
  side = "both",
  guides = false,
  scale = 1,
}: CardSpreadProps) {
  const age = (print.age_group as AgeGroup) ?? age_group ?? "2-4m";
  const seed = card_number ?? print.title?.length ?? 0;
  return (
    <div className="flex flex-wrap gap-6 items-start justify-center">
      {(side === "front" || side === "both") && (
        <CardFront print={print} guides={guides} scale={scale} />
      )}
      {(side === "back" || side === "both") && (
        <CardBack
          title={print.title}
          age_group={age}
          card_number={card_number}
          illustration_url={illustration_url}
          illustration_status={illustration_status}
          seed={seed}
          guides={guides}
          scale={scale}
        />
      )}
    </div>
  );
}
