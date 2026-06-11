"use client";

import { useState } from "react";

function bygSkabelon(): string {
  return [
    "§20-NOTAT — SKABELON",
    "(Astrid · kaerne.dk — fagligt udkast, tilret altid til din konkrete sag)",
    "",
    "Dato: __________   Sagsbehandler: __________",
    "Barn/ung (anonymiseret ID): __________   Alder: ____",
    "",
    "1. BAGGRUND OG ANLEDNING",
    "- Kort, objektiv beskrivelse af hvad notatet handler om, og hvorfor det skrives nu.",
    "",
    "2. FAKTISKE OPLYSNINGER",
    "- Relevante, dokumenterbare oplysninger (hvem, hvad, hvornaar). Hold fakta adskilt fra vurdering.",
    "",
    "3. BARNETS / DEN UNGES PERSPEKTIV",
    "- Er barnet hoert? Hvordan? Gengiv synspunkter (boernesamtale foer afgoerelse).",
    "",
    "4. FAGLIG VURDERING",
    "- Din socialfaglige vurdering, koblet til lovgrundlag (fx Barnets Lov §§ ...).",
    "- Proportionalitet: er indsatsen mindst indgribende og bedst egnede?",
    "",
    "5. INDSTILLING / NÆSTE SKRIDT",
    "- Hvad indstilles der til, og hvad er de naeste konkrete skridt og frister?",
    "",
    "Partshoering gennemfoert: [ ] ja  [ ] nej     Begrundelse vedlagt: [ ] ja  [ ] nej",
    "",
    "Skoennet og myndighedsansvaret er altid dit. Astrid er beslutningsstoette, ikke afgoerelse.",
  ].join("\n");
}

const card: React.CSSProperties = {
  background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border)", borderRadius: 18,
  padding: "22px 22px", textAlign: "center", maxWidth: 460, margin: "0 auto",
};
const knap: React.CSSProperties = {
  display: "inline-block", padding: "12px 24px", borderRadius: 999, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15,
  boxShadow: "0 5px 16px rgba(217,102,55,.32)",
};

export default function LeadMagnet() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState(false);

  const download = () => {
    const blob = new Blob([bygSkabelon()], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "astrid-paragraf20-notatskabelon.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
    if (!ok) { setErr(true); return; }
    setErr(false); setSending(true);
    try {
      await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email.trim() }) });
    } catch {}
    setSending(false); setDone(true); download();
  };

  return (
    <div style={card}>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--kaerne-terracotta-deep)", marginBottom: 4 }}>Gratis vaerktoej: §20-notatskabelon</div>
      <div style={{ fontSize: 13.5, color: "var(--kaerne-ink-soft)", lineHeight: 1.55, marginBottom: 14 }}>En klar, faglig skabelon til dine §20-notater. Skriv din arbejds-e-mail, saa kan du downloade den med det samme.</div>
      {!open && !done && (
        <button type="button" style={knap} onClick={() => setOpen(true)}>↓ Hent §20-skabelon</button>
      )}
      {open && !done && (
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (err) setErr(false); }} placeholder="dig@kommune.dk" aria-label="Din arbejds-e-mail"
            style={{ width: "100%", maxWidth: 320, padding: "11px 14px", borderRadius: 12, border: "0.5px solid var(--kaerne-border)", background: "#fff", fontSize: 14 }} />
          <button type="submit" style={knap} disabled={sending}>{sending ? "Sender…" : "Send mig skabelonen"}</button>
          {err && <div style={{ fontSize: 12.5, color: "#a14b32" }}>Skriv en gyldig e-mail.</div>}
          <div style={{ fontSize: 11.5, color: "var(--kaerne-muted)" }}>Vi sender ikke spam. Kun skabelonen og enkelte relevante opdateringer.</div>
        </form>
      )}
      {done && (
        <div style={{ fontSize: 14, color: "var(--kaerne-ink)" }}>
          Tak! Skabelonen er hentet. <button type="button" onClick={download} style={{ background: "none", border: "none", color: "var(--kaerne-terracotta-deep)", textDecoration: "underline", cursor: "pointer", fontSize: 14 }}>Hent igen</button>
        </div>
      )}
    </div>
  );
}
