import { CARD_FORMAT, SHEET_FORMATS, bleedSize, type SheetFormat } from "@/lib/card-format";
import { CardFront } from "./card-front";
import { CardBack } from "./card-back";
import type { PrintContent, AgeGroup } from "@/lib/card-schema";

interface PrintSheetProps {
  sheet: SheetFormat;
  side: "front" | "back";
  cards: Array<{
    print: Partial<PrintContent>;
    age_group?: AgeGroup;
    card_number?: number;
    illustration_url?: string | null;
    illustration_status?: "not_generated" | "draft" | "approved";
  }>;
  guides?: boolean;
  gap?: number; // mm
  scale?: number;
}

/**
 * Imposition af flere kort på et A4/A3-ark med bleed og crop marks.
 * Første iteration — layout beregnes ud fra kortstørrelse og ark.
 */
export function PrintSheet({
  sheet,
  side,
  cards,
  guides = true,
  gap = 6,
  scale = 1,
}: PrintSheetProps) {
  const s = SHEET_FORMATS[sheet];
  const bleed = bleedSize();
  const cols = Math.max(1, Math.floor((s.width + gap) / (bleed.width + gap)));
  const rows = Math.max(1, Math.floor((s.height + gap) / (bleed.height + gap)));
  const perSheet = cols * rows;
  const placed = cards.slice(0, perSheet);

  return (
    <div
      className="relative bg-white shadow-[var(--shadow-card)] mx-auto"
      style={{
        width: `${s.width * scale}mm`,
        height: `${s.height * scale}mm`,
      }}
    >
      <div
        className="absolute inset-0 grid content-start justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${bleed.width * scale}mm)`,
          gap: `${gap * scale}mm`,
          padding: `${((s.height - rows * bleed.height - (rows - 1) * gap) / 2) * scale}mm ${
            ((s.width - cols * bleed.width - (cols - 1) * gap) / 2) * scale
          }mm`,
        }}
      >
        {placed.map((c, i) =>
          side === "front" ? (
            <CardFront key={i} print={c.print} guides={guides} scale={scale} />
          ) : (
            <CardBack
              key={i}
              title={c.print.title}
              age_group={(c.print.age_group as AgeGroup) ?? c.age_group ?? "2-4m"}
              card_number={c.card_number}
              illustration_url={c.illustration_url}
              illustration_status={c.illustration_status}
              seed={c.card_number ?? i}
              guides={guides}
              scale={scale}
            />
          )
        )}
      </div>
      {guides && <CropMarks cols={cols} rows={rows} sheet={s} gap={gap} scale={scale} />}
    </div>
  );
}

function CropMarks({
  cols, rows, sheet, gap, scale,
}: { cols: number; rows: number; sheet: { width: number; height: number }; gap: number; scale: number }) {
  const bleed = bleedSize();
  const marks: React.ReactElement[] = [];
  const marginX = (sheet.width - cols * bleed.width - (cols - 1) * gap) / 2;
  const marginY = (sheet.height - rows * bleed.height - (rows - 1) * gap) / 2;
  const trim = CARD_FORMAT.trim;
  const b = CARD_FORMAT.bleed;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = marginX + c * (bleed.width + gap) + b; // trim x
      const y0 = marginY + r * (bleed.height + gap) + b; // trim y
      const corners = [
        [x0, y0],
        [x0 + trim.width, y0],
        [x0, y0 + trim.height],
        [x0 + trim.width, y0 + trim.height],
      ];
      corners.forEach(([x, y], k) => {
        marks.push(
          <div key={`h-${r}-${c}-${k}`} className="absolute bg-foreground/60" style={{
            left: `${(x - 3) * scale}mm`, top: `${y * scale}mm`,
            width: `${2 * scale}mm`, height: `1px`,
          }} />,
          <div key={`v-${r}-${c}-${k}`} className="absolute bg-foreground/60" style={{
            left: `${x * scale}mm`, top: `${(y - 3) * scale}mm`,
            width: `1px`, height: `${2 * scale}mm`,
          }} />,
        );
      });
    }
  }
  return <>{marks}</>;
}
