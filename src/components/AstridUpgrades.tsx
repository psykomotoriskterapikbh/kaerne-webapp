"use client";

import { useEffect, useRef, useState } from "react";

/* ============ Skriftkontrol (zoom) ============ */
export function FontControl() {
  const [z, setZ] = useState<"" | "l" | "xl">("");
  useEffect(() => {
    let v = "";
    try { v = localStorage.getItem("astrid_zoom") || ""; } catch {}
    setZ(v as "" | "l" | "xl");
    if (v) document.documentElement.setAttribute("data-zoom", v); else document.documentElement.removeAttribute("data-zoom");
  }, []);
  const apply = (v: "" | "l" | "xl") => {
    setZ(v);
    try { localStorage.setItem("astrid_zoom", v); } catch {}
    if (v) document.documentElement.setAttribute("data-zoom", v); else document.documentElement.removeAttribute("data-zoom");
  };
  const btn = (v: "" | "l" | "xl", label: string) => (
    <button
      onClick={() => apply(v)}
      aria-label={`Skriftstørrelse ${label}`}
      className="cursor-pointer rounded-full transition-all"
      style={{ width: 30, height: 30, fontSize: v === "" ? 12 : v === "l" ? 14 : 16, lineHeight: 1, border: "0.5px solid var(--kaerne-border)", background: z === v ? "var(--kaerne-ink)" : "#fff", color: z === v ? "var(--kaerne-sand)" : "var(--kaerne-ink-soft)" }}
    >A</button>
  );
  return <div className="flex items-center gap-1" title="Skriftstørrelse">{btn("", "normal")}{btn("l", "stor")}{btn("xl", "ekstra stor")}</div>;
}

/* ============ 🔥 Streak-chip ============ */
function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const ys = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return t.getUTCFullYear() + "-" + Math.ceil((((t.getTime() - ys.getTime()) / 86400000) + 1) / 7);
}
export function StreakChip() {
  const [n, setN] = useState(0);
  useEffect(() => {
    try {
      const wk = isoWeek(new Date());
      const last = localStorage.getItem("astrid_streak_week");
      let count = parseInt(localStorage.getItem("astrid_streak") || "0", 10) || 0;
      if (last !== wk) { count = last ? count + 1 : 3; localStorage.setItem("astrid_streak_week", wk); localStorage.setItem("astrid_streak", String(count)); }
      setN(count);
    } catch { setN(3); }
  }, []);
  if (!n) return null;
  return <span className="k-streak" title="Uger i træk med overholdte frister">🔥 {n} uger</span>;
}

/* ============ Kaos → kontrol statusbar ============ */
export function KaosKontrolBar() {
  const [pct, setPct] = useState(34);
  useEffect(() => {
    try { const v = parseInt(localStorage.getItem("astrid_kaos") || "34", 10); if (!isNaN(v)) setPct(Math.max(0, Math.min(100, v))); } catch {}
    const onClose = () => setPct((p) => { const np = Math.min(100, p + 11); try { localStorage.setItem("astrid_kaos", String(np)); } catch {} return np; });
    window.addEventListener("astrid:saglukket", onClose);
    return () => window.removeEventListener("astrid:saglukket", onClose);
  }, []);
  const col = pct < 40 ? "#e0a16a" : pct < 75 ? "#cdbf6a" : "#7fb89f";
  const label = pct < 40 ? "Travlt — vi tager den én sag ad gangen" : pct < 75 ? "Godt på vej" : "Næsten i mål — flot uge!";
  return (
    <div className="k-kaos mb-5">
      <div className="flex justify-between items-center mb-2" style={{ fontSize: 12, color: "var(--kaerne-muted)" }}>
        <span>Fra kaos til kontrol</span><span style={{ color: col, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div className="k-kaos-track"><div className="k-kaos-fill" style={{ width: pct + "%", background: col }} /></div>
      <div style={{ fontSize: 11.5, color: "var(--kaerne-muted)", marginTop: 7 }}>{label}</div>
    </div>
  );
}

/* ============ Daglige AI-guldkorn ============ */
const GULDKORN = [
  "Ny principmeddelelse fra Ankestyrelsen om §32 — vil du have et resumé?",
  "Husk: 3 af dine sager har genbehandlingsfrist i denne måned.",
  "Tip: Børnesamtalen skal afholdes før afgørelsen — skal jeg lave en spørgeguide?",
  "Vidste du? Du har sparet ca. 4 timer på journalnotater i sidste uge ✨",
  "God idé: start ugen med at lukke den ældste åbne sag — jeg hjælper.",
  "Ny vejledning om ungestøtte (§§114-116) er værd at kigge på.",
];
export function GuldkornPopup() {
  const [txt, setTxt] = useState<string | null>(null);
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem("astrid_guldkorn_day") === today) return;
      const t = setTimeout(() => {
        localStorage.setItem("astrid_guldkorn_day", today);
        setTxt(GULDKORN[Math.floor(Math.random() * GULDKORN.length)]);
      }, 1800);
      return () => clearTimeout(t);
    } catch {}
  }, []);
  if (!txt) return null;
  return (
    <div className="k-guld" role="status">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
        <strong style={{ fontSize: 12.5, color: "var(--kaerne-terracotta-deep)" }}>✦ Dagens guldkorn</strong>
        <button onClick={() => setTxt(null)} aria-label="Luk" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--kaerne-muted)", fontSize: 14, lineHeight: 1 }}>✕</button>
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--kaerne-ink)" }}>{txt}</div>
    </div>
  );
}

/* ============ "Sag lukket"-dopamin ============ */
export function LukSagButton() {
  const [fx, setFx] = useState(false);
  const fire = () => {
    setFx(true);
    try { window.dispatchEvent(new Event("astrid:saglukket")); } catch {}
    setTimeout(() => setFx(false), 1700);
  };
  return (
    <>
      <button type="button" onClick={fire} className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-80 transition-opacity" style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)", background: "#fff" }}>
        ✓ Luk sag
      </button>
      {fx && (
        <div className="k-luk-ov" aria-hidden="true">
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="k-luk-doc" />
            <div className="k-luk-check">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============ 1-kliks anonymisering ============ */
export function anonymiser(text: string): string {
  let t = text;
  // CPR-numre
  t = t.replace(/\b\d{6}[-\s]?\d{4}\b/g, "[CPR fjernet]");
  // Telefonnumre (8 cifre, evt. mellemrum)
  t = t.replace(/\b(?:\+45[\s]?)?(?:\d{2}[\s]?){4}\b/g, "[tlf fjernet]");
  // E-mails
  t = t.replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email fjernet]");
  // Adresser (Vej/gade/allé + husnr)
  t = t.replace(/\b([A-ZÆØÅ][a-zæøå]+(?:vej|gade|allé|alle|vænge|parken|boulevard|stræde|plads|toften|haven))\s+\d+[A-Za-z]?(?:,?\s?\d{1,2}\.?\s?(?:tv|th|mf)?)?/g, "[adresse fjernet]");
  // Postnr + by
  t = t.replace(/\b\d{4}\s+[A-ZÆØÅ][a-zæøå]+\b/g, "[postnr+by fjernet]");
  return t;
}

/* ============ Slash-kommandoer ============ */
export type SlashCmd = { cmd: string; desc: string; panel?: "frister" | "paragraf" | "aktoer" | "faq"; prompt?: string };
export const SLASH_COMMANDS: SlashCmd[] = [
  { cmd: "/notat", desc: "Stikord → professionelt journalnotat", prompt: "Omsæt disse stikord til et professionelt, juridisk holdbart journalnotat (objektivt sprog, faglig struktur):\n\n" },
  { cmd: "/brev", desc: "Børnevenligt brev af en afgørelse", prompt: "Oversæt denne myndighedsafgørelse til et letforståeligt brev til et barn (rolig, tryg tone, korte sætninger). Angiv gerne barnets alder:\n\n" },
  { cmd: "/sprogtjek", desc: "Etisk sprog-tjek (fjern stigmatisering)", prompt: "Gennemgå denne tekst for stigmatiserende eller værdiladet sprog og foreslå objektive, respektfulde formuleringer:\n\n" },
  { cmd: "/compliance", desc: "Kvalitetstjek før afsendelse", prompt: "Lav et kvalitetstjek af dette dokument før afsendelse: er barnet hørt og dokumenteret, er partshøring nævnt, er afgørelsen begrundet, mangler der noget (officialprincippet)?\n\n" },
  { cmd: "/resume", desc: "Resumé + tidslinje + næste skridt", prompt: "Lav ud fra denne (anonymiserede) tekst: 1) et kort resumé, 2) en kronologisk tidslinje over vigtigste hændelser, diagnoser og indsatser, 3) hvad der mangler at blive belyst (officialprincippet), 4) forslag til næste skridt og relevante frister. Objektivt, fagligt sprog:\n\n" },
  { cmd: "/referat", desc: "Noter/transskription → mødereferat", prompt: "Lav et struktureret mødereferat ud fra disse (anonymiserede) noter eller transskription. Inkludér: deltagere og roller (hvis nævnt), dagsordenspunkter, vigtigste drøftelser, BESLUTNINGER, aftaler med ANSVARLIG og FRIST, samt opfølgningspunkter. Objektivt, fagligt sprog:\n\n" },
  { cmd: "/paragraf", desc: "Åbn paragraf-oversætter", panel: "paragraf" },
  { cmd: "/aktør", desc: "Find den rette aktør", panel: "aktoer" },
  { cmd: "/frist", desc: "Beregn en frist", panel: "frister" },
];
