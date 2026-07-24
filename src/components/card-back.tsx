import { CARD_FORMAT } from "@/lib/card-format";
import { AGE_TOKEN, type AgeGroup } from "@/lib/card-schema";
import { IllustrationPlaceholder } from "./illustration-placeholder";

interface CardBackProps {
  title?: string;
  age_group?: AgeGroup;
  card_number?: number;
  illustration_url?: string | null;
  illustration_status?: "not_generated" | "draft" | "approved";
  seed?: number;
  guides?: boolean;
  scale?: number;
  className?: string;
}

export function CardBack({
  title,
  age_group = "2-4m",
  card_number,
  illustration_url,
  illustration_status = "not_generated",
  seed = 0,
  guides = false,
  scale = 1,
  className = "",
}: CardBackProps) {
  const { trim, bleed, safe, cornerRadius } = CARD_FORMAT;
  const token = AGE_TOKEN[age_group];

  return (
    <div
      className={"card-back " + className}
      style={{
        width: `${(trim.width + bleed * 2) * scale}mm`,
        height: `${(trim.height + bleed * 2) * scale}mm`,
        padding: `${bleed * scale}mm`,
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${trim.width * scale}mm`,
          height: `${trim.height * scale}mm`,
          borderRadius: `${cornerRadius * scale}mm`,
          overflow: "hidden",
          position: "relative",
          background: `color-mix(in oklab, var(--color-${token}) 25%, var(--color-card))`,
          boxShadow: guides ? "none" : "var(--shadow-card)",
        }}
      >
        {/* Illustration eller placeholder */}
        <div
          style={{
            position: "absolute",
            inset: `${safe * scale}mm ${safe * scale}mm ${(safe + 12) * scale}mm ${safe * scale}mm`,
            borderRadius: `${(cornerRadius - 1) * scale}mm`,
            overflow: "hidden",
          }}
        >
          {illustration_url && illustration_status !== "not_generated" ? (
            <img
              src={illustration_url}
              alt={title ?? "Illustration"}
              className="w-full h-full object-cover"
            />
          ) : (
            <IllustrationPlaceholder age_group={age_group} seed={seed} />
          )}
        </div>

        {/* Bund-band: titel + kortnummer + brandmark */}
        <div
          className="absolute bottom-0 inset-x-0 flex items-baseline justify-between"
          style={{
            padding: `${1.5 * scale}mm ${safe * scale}mm ${safe * scale}mm`,
          }}
        >
          <div className="min-w-0 flex-1">
            <div
              className="font-serif truncate text-foreground"
              style={{ fontSize: `${8.5 * scale}pt` }}
            >
              {title || "Uden titel"}
            </div>
          </div>
          <div
            className="flex items-baseline gap-2 text-muted-foreground shrink-0"
            style={{ fontSize: `${6.5 * scale}pt` }}
          >
            {typeof card_number === "number" && (
              <span className="tabular-nums">#{String(card_number).padStart(3, "0")}</span>
            )}
            <span className="uppercase tracking-widest">Babykort</span>
          </div>
        </div>
      </div>
    </div>
  );
}
