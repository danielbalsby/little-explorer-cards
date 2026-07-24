import { BACK_RENDERERS, type BackVariant } from "./card-variants/backs";
import { useBrandSettings } from "@/hooks/use-brand-settings";

interface CardBackProps {
  scale?: number;
  className?: string;
  /** Override for design-lab / preview. Defaults til den globale master_card_back. */
  variant?: BackVariant;
  brandName?: string;
  tagline?: string;
  showTagline?: boolean;
}

/**
 * Bagsiden er nu ét fælles brand-design på tværs af hele serien.
 * Læser globalt fra project_settings; kan overrides for design-lab / preview.
 * Ingen aktivitetsspecifikke felter (titel, alder, nummer, illustration) vises her.
 */
export function CardBack({
  scale = 1,
  className = "",
  variant,
  brandName,
  tagline,
  showTagline,
}: CardBackProps) {
  const brand = useBrandSettings();
  const chosen: BackVariant = variant ?? brand.master_card_back;
  const R = BACK_RENDERERS[chosen];

  return (
    <div className={"card-back " + className}>
      <R
        scale={scale}
        brandName={brandName ?? brand.brand_name}
        tagline={tagline ?? brand.brand_tagline}
        showTagline={showTagline ?? brand.show_tagline}
      />
    </div>
  );
}
