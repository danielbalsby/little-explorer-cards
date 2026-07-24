import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PREVIEW_AUTH_ORIGIN = "https://id-preview--c316b1d2-d9c8-4bc3-af2b-34a9c8dbd171.lovable.app";

function getAuthRedirectUrl() {
  const { hostname, origin } = window.location;
  const authOrigin = hostname === "localhost" || hostname === "127.0.0.1" ? PREVIEW_AUTH_ORIGIN : origin;
  return `${authOrigin}/auth`;
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Log ind — Babykort" },
      { name: "description", content: "Administrator-login til Babykort-redaktion." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!mounted) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: getAuthRedirectUrl() },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Konto oprettet. Tjek din mail for at bekræfte brugeren.");
          return;
        }
        toast.success("Konto oprettet. Du er logget ind.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      window.location.href = "/";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kunne ikke logge ind");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-background">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary grid place-items-center text-primary-foreground font-serif text-xl mb-4">b</div>
          <h1 className="font-serif text-3xl">Babykort redaktion</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Log ind for at fortsætte." : "Opret administrator-konto."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Adgangskode</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Vent…" : mode === "signup" ? "Opret konto" : "Log ind"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground w-full text-center"
        >
          {mode === "signin" ? "Ny administrator? Opret konto" : "Har du allerede en konto? Log ind"}
        </button>
      </div>
    </div>
  );
}
