import type { PrintContent } from "./card-schema";

export const REFERENCE_CARD: PrintContent = {
  title: "Ansigt til ansigt",
  age_group: "2-4m",
  intro: "En enkel lille kontaktleg med ansigt, lyd og pauser.",
  development_areas: ["Kontakt", "Mimik", "Turtagning"],
  materials: "",
  steps: [
    "Sæt dig tæt på baby, så I kan se hinanden.",
    "Smil eller lav en lille lyd.",
    "Vent et øjeblik.",
    "Svar på babys blik, lyd eller mimik.",
  ],
  variations: ["Skift ansigtsudtryk langsomt", "Prøv en blid nynnen"],
  look_for: "Hvis baby svarer med blik eller lyd, så vent og svar igen.",
  pause_if: "Baby vender sig væk, gaber eller bliver urolig.",
  did_you_know:
    "Babyer på 2–4 måneder efterligner mimik og elsker turtagning — det er sprogets første form.",
  safety: "",
};

export const VARIANT_PALETTE = {
  ivory: "#F8F4EC",
  ink: "#342D27",
  sage: "#AAB9A3",
  sand: "#D8C9B7",
  mist: "#A9BBC2",
  clay: "#C58D76",
  butter: "#E5CF91",
} as const;

/** Meget subtil papirtekstur som CSS background-image (base64 SVG noise) */
export const PAPER_TEXTURE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.20  0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
