"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);

  const configured = true;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!configured) {
      setMsg("Login er ikke konfigureret endnu (Supabase-nøgler mangler i miljøet).");
      return;
    }
    if (!consent) {
      setMsg("Du skal acceptere privatlivspolitikken for at fortsætte.");
      return;
    }
    setBusy(true);
    try {
      const sb = createClient();
      if (mode === "in") {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { data, error } = await sb.auth.signUp({ email, password: pw });
        if (error) throw error;
        if (data.session) {
          router.push("/");
          router.refresh();
        } else {
          setMsg("Næsten i mål — tjek din mail (også spam) for at bekræfte din konto, og log derefter ind.");
        }
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 12,
    border: "0.5px solid var(--kaerne-border, #d8c6a8)", background: "#fff",
    fontSize: 14, color: "var(--kaerne-ink, #2c2824)", outline: "none",
  };

  return (
    <main style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "radial-gradient(circle at 50% 38%,#fbf3e7 0%,#f3e7d4 60%,#e7d8bf 100%)" }}>
      <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,253,249,0.92)", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 20, padding: "32px 28px", boxShadow: "0 12px 40px rgba(120,92,67,.12)" }}>
        <div style={{ fontFamily: "var(--font-script, cursive)", fontSize: 40, color: "#2c2824", lineHeight: 1, marginBottom: 4 }}>Astrid</div>
        <p style={{ fontSize: 13.5, color: "var(--kaerne-muted,#8a7a66)", marginBottom: 22 }}>
          {mode === "in" ? "Velkommen tilbage, kollega." : "Opret din konto."}
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} autoComplete="email" />
          <input type="password" required placeholder="Adgangskode" value={pw} onChange={(e) => setPw(e.target.value)} style={inputStyle} autoComplete={mode === "in" ? "current-password" : "new-password"} minLength={6} />
          <label style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12.5, color: "var(--kaerne-muted,#8a7a66)", lineHeight: 1.5, cursor: "pointer" }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2 }} />
            <span>Jeg har læst og accepterer <a href="/privatliv" target="_blank" style={{ color: "#9a6a47", textDecoration: "underline" }}>privatlivspolitikken</a>.</span>
          </label>
          <button type="submit" disabled={busy || !consent} style={{ marginTop: 4, padding: "12px 14px", borderRadius: 12, border: "none", cursor: busy || !consent ? "default" : "pointer", background: "var(--kaerne-ink,#2c2824)", color: "var(--kaerne-sand,#f3e7d4)", fontSize: 14, opacity: busy || !consent ? 0.6 : 1 }}>
            {busy ? "Et øjeblik…" : mode === "in" ? "Log ind" : "Opret konto"}
          </button>
        </form>

        {msg && <p style={{ marginTop: 14, fontSize: 13, color: "#9a6a47", lineHeight: 1.5 }}>{msg}</p>}

        <button onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} style={{ marginTop: 18, background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--kaerne-muted,#8a7a66)", textDecoration: "underline", padding: 0 }}>
          {mode === "in" ? "Har du ikke en konto? Opret en" : "Har du allerede en konto? Log ind"}
        </button>

        <p style={{ marginTop: 22, fontSize: 11, color: "var(--kaerne-muted,#8a7a66)", lineHeight: 1.5 }}>
          Astrid er beslutningsstøtte — ikke skøn. Del aldrig CPR eller navne i samtaler.
        </p>
      </div>
    </main>
  );
}
