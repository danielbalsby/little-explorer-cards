import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AGE_GROUPS, AGE_LABELS, DEVELOPMENT_AREAS, STATUS_LABEL,
  type AgeGroup, type CardStatus,
} from "@/lib/card-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List, Search, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bibliotek")({
  head: () => ({ meta: [{ title: "Kortbibliotek — Babykort" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { data } = useQuery({
    queryKey: ["library"],
    queryFn: async () => (await supabase.from("cards").select("*").order("card_number", { ascending: true })).data ?? [],
  });

  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [ageF, setAgeF] = useState<string>("all");
  const [areaF, setAreaF] = useState<string>("all");
  const [statusF, setStatusF] = useState<string>("all");

  const filtered = useMemo(() => {
    return (data ?? []).filter((c) => {
      if (ageF !== "all" && c.age_group !== ageF) return false;
      if (areaF !== "all" && c.primary_development_area !== areaF) return false;
      if (statusF !== "all" && c.status !== statusF) return false;
      if (q && !c.title.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [data, q, ageF, areaF, statusF]);

  function exportCsv() {
    const rows = [
      ["card_number", "title", "age_group", "primary_area", "status", "activity_type", "duration"],
      ...filtered.map((c) => [c.card_number, c.title, c.age_group, c.primary_development_area, c.status, c.activity_type, c.duration]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(csv, "babykort.csv", "text/csv");
  }
  function exportJson() {
    downloadBlob(JSON.stringify(filtered, null, 2), "babykort.json", "application/json");
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-4xl">Kortbibliotek</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} af {data?.length ?? 0} kort</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="mr-1.5 h-4 w-4" /> CSV</Button>
          <Button variant="outline" size="sm" onClick={exportJson}><Download className="mr-1.5 h-4 w-4" /> JSON</Button>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_auto_auto_auto_auto] gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Søg efter titel…" className="pl-9" />
        </div>
        <Select value={ageF} onValueChange={setAgeF}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Alder" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle aldre</SelectItem>
            {AGE_GROUPS.map((a) => <SelectItem key={a} value={a}>{AGE_LABELS[a]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={areaF} onValueChange={setAreaF}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Område" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">Alle områder</SelectItem>
            {DEVELOPMENT_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle status</SelectItem>
            <SelectItem value="draft">Udkast</SelectItem>
            <SelectItem value="candidate">Kandidat</SelectItem>
            <SelectItem value="approved">Godkendt</SelectItem>
            <SelectItem value="rejected">Afvist</SelectItem>
            <SelectItem value="archived">Arkiveret</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex rounded-md border overflow-hidden">
          <button className={"px-3 " + (view === "grid" ? "bg-muted" : "")} onClick={() => setView("grid")} title="Grid"><LayoutGrid className="h-4 w-4" /></button>
          <button className={"px-3 " + (view === "list" ? "bg-muted" : "")} onClick={() => setView("list")} title="Liste"><List className="h-4 w-4" /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Link key={c.id} to="/kort/$id" params={{ id: c.id }} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-[var(--shadow-card)] transition-shadow">
              <div className="h-2" style={{ backgroundColor: `var(--color-age-${AGE_GROUPS.indexOf(c.age_group as AgeGroup) + 1})` }} />
              <div className="p-5">
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>#{String(c.card_number).padStart(3, "0")}</span>
                  <span>{AGE_LABELS[c.age_group as AgeGroup]}</span>
                </div>
                <h3 className="font-serif text-xl mt-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{c.primary_development_area}</p>
                <div className="mt-4 flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{STATUS_LABEL[c.status as CardStatus]}</span>
                  <div className="flex items-center gap-1">
                    {c.deserves_spot === "ja" && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[color:var(--color-sage)]/30">Fortjener plads</span>
                    )}
                    {c.deserves_spot === "nej" && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Drop</span>
                    )}
                    {c.needs_shortening && (
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Forkort</span>
                    )}
                    {c.is_demo && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">demo</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground">Ingen kort matcher filtrene.</div>}
        </div>
      ) : (
        <div className="rounded-2xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Titel</th>
                <th className="text-left px-4 py-3">Alder</th>
                <th className="text-left px-4 py-3">Område</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Redigeret</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">#{String(c.card_number).padStart(3, "0")}</td>
                  <td className="px-4 py-3"><Link to="/kort/$id" params={{ id: c.id }} className="font-medium hover:underline">{c.title}</Link></td>
                  <td className="px-4 py-3">{AGE_LABELS[c.age_group as AgeGroup]}</td>
                  <td className="px-4 py-3">{c.primary_development_area}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted">{STATUS_LABEL[c.status as CardStatus]}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(c.updated_at).toLocaleDateString("da-DK")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function downloadBlob(content: string, name: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
