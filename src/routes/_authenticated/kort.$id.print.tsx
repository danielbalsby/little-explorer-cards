import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CardFront } from "@/components/card-front";
import { CardBack } from "@/components/card-back";
import { PrintSheet } from "@/components/print-sheet";
import { resolvePrintContent } from "@/lib/card-text";
import type { IllustrationStatus } from "@/lib/card-schema";
import { Button } from "@/components/ui/button";
import { SHEET_FORMATS, type SheetFormat } from "@/lib/card-format";
import { useBrandSettings } from "@/hooks/use-brand-settings";
import { ArrowLeft, Printer } from "lucide-react";

export const Route = createFileRoute("/_authenticated/kort/$id/print")({
  head: () => ({ meta: [{ title: "Print preview — Babykort" }] }),
  component: PrintPreview,
});

function PrintPreview() {
  const { id } = Route.useParams();
  const { data: card } = useQuery({
    queryKey: ["card", id],
    queryFn: async () => (await supabase.from("cards").select("*").eq("id", id).single()).data,
  });
  const brand = useBrandSettings();

  const [side, setSide] = useState<"front" | "back" | "both">("both");
  const [guides, setGuides] = useState(false);
  const [mode, setMode] = useState<"single" | "sheet">("single");
  const [sheet, setSheet] = useState<SheetFormat>("A4");
  const [sheetSide, setSheetSide] = useState<"front" | "back">("front");

  if (!card) return <div className="p-10 text-muted-foreground">Indlæser…</div>;

  const { print } = resolvePrintContent(card as never);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap print:hidden">
        <div className="flex items-center gap-3">
          <Link to="/kort/$id" params={{ id }}>
            <Button variant="outline" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" /> Tilbage</Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl">{card.title}</h1>
            <div className="text-xs text-muted-foreground">
              #{String(card.card_number).padStart(3, "0")} · duplex: {brand.duplex_flip === "long_edge" ? "lang kant" : "kort kant"}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Toggle values={["single", "sheet"]} labels={{ single: "Ét kort", sheet: "Printark" }} value={mode} onChange={setMode} />
          {mode === "single" ? (
            <Toggle values={["front", "back", "both"]} labels={{ front: "Forside", back: "Bagside", both: "Begge" }} value={side} onChange={setSide} />
          ) : (
            <>
              <Toggle values={["front", "back"]} labels={{ front: "Front sheet", back: "Back sheet" }} value={sheetSide} onChange={setSheetSide} />
              <Toggle values={["A4", "A3"]} labels={{ A4: "A4", A3: "A3" }} value={sheet} onChange={setSheet} />
            </>
          )}
          <label className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border">
            <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} />
            Hjælpelinjer
          </label>
          <Button size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-4 w-4" /> Print / PDF
          </Button>
        </div>
      </header>

      <div className="rounded-2xl border bg-muted/20 p-6 print:p-0 print:border-0 print:bg-transparent">
        {mode === "single" ? (
          <div className="flex flex-wrap items-start justify-center gap-8 print:gap-0">
            {(side === "front" || side === "both") && (
              <CardFront print={print} guides={guides} />
            )}
            {(side === "back" || side === "both") && (
              <div className="flex flex-col items-center gap-2">
                <CardBack />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground print:hidden">
                  Global bagside · fælles for hele serien
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <PrintSheet
              sheet={sheet}
              side={sheetSide}
              guides={guides}
              cards={Array.from({ length: 20 }).map(() => ({
                print,
                card_number: card.card_number,
                illustration_url: card.illustration_url,
                illustration_status: (card.illustration_status as IllustrationStatus) ?? "not_generated",
              }))}
            />
            <p className="text-center text-xs text-muted-foreground">
              {sheetSide === "front" ? "Forside" : "Bagside (global master)"} ·{" "}
              {sheet} ({SHEET_FORMATS[sheet].width}×{SHEET_FORMATS[sheet].height} mm) · duplex{" "}
              {brand.duplex_flip === "long_edge" ? "lang kant" : "kort kant"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle<T extends string>({
  values, labels, value, onChange,
}: {
  values: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md border overflow-hidden text-sm">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={"px-3 py-1.5 " + (value === v ? "bg-muted" : "hover:bg-muted/50")}
        >
          {labels[v]}
        </button>
      ))}
    </div>
  );
}
