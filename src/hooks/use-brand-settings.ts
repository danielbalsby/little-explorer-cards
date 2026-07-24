import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { BackVariant } from "@/components/card-variants/backs";

export interface BrandSettings {
  brand_name: string;
  brand_tagline: string;
  show_tagline: boolean;
  brand_logo_url: string | null;
  brand_mark_url: string | null;
  master_card_back: BackVariant;
  primary_brand_color: string;
  secondary_brand_color: string;
  print_texture: "baked_in" | "clean";
  duplex_flip: "long_edge" | "short_edge";
}

export const DEFAULT_BRAND: BrandSettings = {
  brand_name: "Babykort",
  brand_tagline: "Små stunder sammen",
  show_tagline: true,
  brand_logo_url: null,
  brand_mark_url: null,
  master_card_back: "storybook_emblem",
  primary_brand_color: "#342D27",
  secondary_brand_color: "#AAB9A3",
  print_texture: "baked_in",
  duplex_flip: "long_edge",
};

/** Læser globale brandindstillinger (med fallback til localStorage-preview og defaults). */
export function useBrandSettings() {
  const query = useQuery({
    queryKey: ["brand-settings"],
    queryFn: async (): Promise<BrandSettings> => {
      const { data } = await supabase.from("project_settings").select("*").maybeSingle();
      if (!data) return DEFAULT_BRAND;
      const localBack =
        typeof window !== "undefined"
          ? (localStorage.getItem("master_card_back") as BackVariant | null)
          : null;
      return {
        brand_name: data.brand_name ?? DEFAULT_BRAND.brand_name,
        brand_tagline: data.brand_tagline ?? DEFAULT_BRAND.brand_tagline,
        show_tagline: data.show_tagline ?? DEFAULT_BRAND.show_tagline,
        brand_logo_url: data.brand_logo_url ?? null,
        brand_mark_url: data.brand_mark_url ?? null,
        master_card_back:
          (data.master_card_back as BackVariant | null) ??
          localBack ??
          DEFAULT_BRAND.master_card_back,
        primary_brand_color: data.primary_brand_color ?? DEFAULT_BRAND.primary_brand_color,
        secondary_brand_color:
          data.secondary_brand_color ?? DEFAULT_BRAND.secondary_brand_color,
        print_texture:
          (data.print_texture as "baked_in" | "clean" | null) ?? DEFAULT_BRAND.print_texture,
        duplex_flip:
          (data.duplex_flip as "long_edge" | "short_edge" | null) ?? DEFAULT_BRAND.duplex_flip,
      };
    },
    staleTime: 60_000,
  });
  return query.data ?? DEFAULT_BRAND;
}
