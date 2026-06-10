"use client";

import { useMemo, useState } from "react";

/* ---------- Frist-beregner ---------- */

type Frist = { id: string; navn: string; mdr?: number; timer?: number; note: string };

const FRISTER: Frist[] = [
  { id: "bfu", navn: "Børnefaglig undersøgelse, BL §20", mdr: 4, note: "Skal afsluttes senest 4 måneder efter, at kommunen er blevet bekendt med, at barnet kan have behov for særlig støtte." },
  { id: "plan", navn: "Barnets plan, BL §91", mdr: 3, note: "Udarbejdes senest 3 måneder efter afgørelsen om en støttende indsats eller anbringelse." },
  { id: "opf", navn: "Første opfølgning på indsats, BL §95", mdr: 3, note: "Følg op på indsatsen senest 3 måneder efter, at den er iværksat." },
  { id: "underretning", navn: "Vurdering af underretning, BL §136", timer: 24, note: "Vurdér inden for 24 timer, om barnets sundhed eller udvikling er i fare, og om der skal handles akut." },
  { id: "egen", navn: "Egen frist, vælg antal måneder", note: "Til genbehandlingsfrister, handleplansrevision eller andet med fast interval." },
];

function plusMonths(d: Date, m: number): Date {
  const r = new Date(d);
  const day = r.getDate();
  r.setMonth(r.getMonth() + m);
  if (r.getDate() < day) r.setDate(0);
  return r;
}

function fmtDato(d: Date): string {
  return d.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function icsDate(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function downloadIcs(titel: string, note: string, deadline: Date) {
  const dagEfter = new Date(deadline);
  dagEfter.setDate(dagEfter.getDate() + 1);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Astrid//Fristberegner//DA",
    "BEGIN:VEVENT",
    `UID:astrid-${Date.now()}@astrid`,
    `DTSTAMP:${icsDate(new Date())}T090000Z`,
    `DTSTART;VALUE=DATE:${icsDate(deadline)}`,
    `DTEND;VALUE=DATE:${icsDate(dagEfter)}`,
    `SUMMARY:Frist: ${titel}`,
    `DESCRIPTION:${note.replace(/,/g, "\\,")} (Beregnet med Astrid, kontrollér altid fristen i sagen.)`,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Om 7 dage: ${titel}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "astrid-frist.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function FristBeregner() {
  const [fristId, setFristId] = useState("bfu");
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [egneMdr, setEgneMdr] = useState(3);

  const frist = FRISTER.find((f) => f.id === fristId)!;
  const startDato = useMemo(() => (start ? new Date(`${start}T12:00:00`) : null), [start]);

  const deadline = useMemo(() => {
    if (!startDato || isNaN(startDato.getTime())) return null;
    if (frist.timer) {
      const d = new Date(startDato);
      d.setHours(d.getHours() + frist.timer);
      return d;
    }
    return plusMonths(startDato, frist.mdr ?? egneMdr);
  }, [startDato, frist, egneMdr]);

  const dageTilbage = deadline ? Math.ceil((deadline.getTime() - Date.now()) / 86400000) : null;

  const inputStyle = {
    border: "0.5px solid var(--kaerne-border)",
    background: "#fff",
    color: "var(--kaerne-ink)",
    boxShadow: "0 2px 10px rgba(90,80,72,0.05)",
  };

  return (
    <div className="rounded-[18px] p-6 flex flex-col gap-4" style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 3px 16px rgba(90,80,72,0.07)" }}>
      <div>
        <div className="mb-1" style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-ink)" }}>Frist-beregner</div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--kaerne-ink-soft)" }}>
          Vælg frist og startdato, få deadline med det samme, og læg den direkte i Outlook med ét klik.
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <select value={fristId} onChange={(e) => setFristId(e.target.value)} className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none" style={inputStyle} aria-label="Vælg fristtype">
          {FRISTER.map((f) => (
            <option key={f.id} value={f.id}>{f.navn}</option>
          ))}
        </select>
        <div className="flex gap-2.5 flex-wrap items-center">
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="px-4 py-2.5 rounded-full text-[13px] focus:outline-none" style={inputStyle} aria-label="Startdato" />
          {fristId === "egen" && (
            <label className="flex items-center gap-2 text-[13px]" style={{ color: "var(--kaerne-ink-soft)" }}>
              <input type="number" min={1} max={36} value={egneMdr} onChange={(e) => setEgneMdr(Math.max(1, Math.min(36, Number(e.target.value) || 1)))} className="px-3 py-2.5 rounded-full text-[13px] w-[72px] focus:outline-none" style={inputStyle} aria-label="Antal måneder" />
              måneder
            </label>
          )}
        </div>
      </div>

      {deadline && (
        <div className="rounded-[14px] px-5 py-4" style={{ background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)" }}>
          <div style={{ fontSize: 12, color: "var(--kaerne-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Deadline</div>
          <div className="mt-0.5" style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--kaerne-ink)" }}>
            {frist.timer ? `${fmtDato(deadline)} kl. ${deadline.toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" })}` : fmtDato(deadline)}
          </div>
          {dageTilbage !== null && !frist.timer && (
            <div className="mt-1" style={{ fontSize: 12.5, color: dageTilbage < 14 ? "var(--kaerne-terracotta-deep)" : "var(--kaerne-ink-soft)" }}>
              {dageTilbage >= 0 ? `${dageTilbage} dage fra i dag` : `Overskredet med ${-dageTilbage} dage`}
            </div>
          )}
          <div className="mt-2" style={{ fontSize: 12, lineHeight: 1.5, color: "var(--kaerne-muted)" }}>{frist.note}</div>
          <button
            onClick={() => downloadIcs(frist.navn, frist.note, deadline)}
            className="mt-3 cursor-pointer px-4 py-2.5 rounded-full text-[12.5px] hover:opacity-90 transition-opacity"
            style={{ background: "var(--kaerne-ink)", color: "var(--kaerne-sand)" }}
          >
            ↓ Læg i kalenderen (.ics)
          </button>
        </div>
      )}

      <div style={{ fontSize: 11, lineHeight: 1.5, color: "var(--kaerne-muted)" }}>
        Vejledende beregning, kontrollér altid fristen i den konkrete sag og jeres interne retningslinjer.
      </div>
    </div>
  );
}

/* ---------- Paragraf-oversætter ---------- */

type Mapping = { gammel: string; ny: string; emne: string };

const MAPPINGS: Mapping[] = [
  { gammel: "SEL §11, stk. 3", ny: "BL §30", emne: "Tidligt forebyggende indsats" },
  { gammel: "SEL §50", ny: "BL §20", emne: "Børnefaglig undersøgelse (4 mdr. frist)" },
  { gammel: "SEL §51", ny: "BL §22", emne: "Undersøgelse uden samtykke" },
  { gammel: "SEL §52, stk. 3", ny: "BL §32", emne: "Støttende indsatser (familiebehandling, kontaktperson m.fl.)" },
  { gammel: "SEL §52a", ny: "BL §35", emne: "Økonomisk støtte til forældre" },
  { gammel: "SEL §54", ny: "BL §75", emne: "Støtteperson til forældre ved anbringelse" },
  { gammel: "SEL §57a", ny: "BL §38", emne: "Forældrepålæg" },
  { gammel: "SEL §57b", ny: "BL §39", emne: "Børne- og ungepålæg" },
  { gammel: "SEL §58", ny: "BL §47", emne: "Anbringelse uden samtykke" },
  { gammel: "SEL §70", ny: "BL §95", emne: "Opfølgning på indsats" },
  { gammel: "SEL §71", ny: "BL §103", emne: "Samvær og kontakt under anbringelse" },
  { gammel: "SEL §76", ny: "BL §§114-116", emne: "Efterværn → ungestøtte (18-22 år)" },
  { gammel: "SEL §140", ny: "BL §91", emne: "Handleplan → barnets plan" },
  { gammel: "SEL §153", ny: "BL §133", emne: "Underretningspligt (fagpersoner)" },
];

export function ParagrafOversaetter() {
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return MAPPINGS;
    return MAPPINGS.filter((m) => `${m.gammel} ${m.ny} ${m.emne}`.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="rounded-[18px] p-6 flex flex-col gap-4" style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 3px 16px rgba(90,80,72,0.07)" }}>
      <div>
        <div className="mb-1" style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-ink)" }}>Paragraf-oversætter</div>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--kaerne-ink-soft)" }}>
          Fra gammel Servicelov til Barnets Lov, slå op på sekunder. Spørg Astrid i chatten, hvis du vil have paragraffen forklaret.
        </div>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Søg, fx §50, efterværn, handleplan..."
        className="px-4 py-2.5 rounded-full text-[13px] focus:outline-none"
        style={{ border: "0.5px solid var(--kaerne-border)", background: "#fff", color: "var(--kaerne-ink)", boxShadow: "0 2px 10px rgba(90,80,72,0.05)" }}
        aria-label="Søg i paragraf-oversigten"
      />
      <div className="overflow-y-auto pr-1" style={{ maxHeight: 282 }}>
        {hits.map((m) => (
          <div key={m.gammel} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "0.5px solid var(--kaerne-border-soft)" }}>
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[11.5px]" style={{ background: "var(--kaerne-sand)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink-soft)" }}>{m.gammel}</span>
            <span aria-hidden="true" style={{ color: "var(--kaerne-terracotta)", fontSize: 14 }}>→</span>
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[11.5px]" style={{ background: "var(--kaerne-cream)", color: "var(--kaerne-terracotta-deep)" }}>{m.ny}</span>
            <span className="min-w-0" style={{ fontSize: 12.5, lineHeight: 1.4, color: "var(--kaerne-ink-soft)" }}>{m.emne}</span>
          </div>
        ))}
        {hits.length === 0 && (
          <div className="py-3" style={{ fontSize: 13, color: "var(--kaerne-muted)" }}>Ingen match, prøv et bredere ord, eller spørg Astrid i chatten.</div>
        )}
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.5, color: "var(--kaerne-muted)" }}>
        Vejledende oversigt over de mest brugte bestemmelser, se den fulde lov på retsinformation.dk.
      </div>
    </div>
  );
}

/* ---------- FAQ ---------- */

const FAQ_ITEMS = [
  {
    q: "Træffer Astrid afgørelser i mine sager?",
    a: "Nej, aldrig. Astrid er støtte, ikke skøn. Hun strukturerer, foreslår og finder vinkler, men det socialfaglige skøn og alle afgørelser ligger hos dig og din kommune. Det er et bevidst designvalg, ikke en begrænsning.",
  },
  {
    q: "Hvad sker der med det, jeg skriver til Astrid?",
    a: "Din samtale bruges kun til at generere svaret her og nu, Astrid gemmer ingen samtaler på en server, og din profil og gemte samtaler ligger kun lokalt i din browser, aldrig på en server. Skriv aldrig CPR-numre, navne eller adresser; Astrid blokerer automatisk beskeder, der ligner CPR-numre.",
  },
  {
    q: "Kan jeg stole på paragrafferne?",
    a: "Astrid er trænet på Barnets Lov (2024) og Serviceloven og siger ærligt til, hvis hun er usikker. Men AI kan fejle, brug hendes svar som kvalificeret udkast, og slå altid efter på retsinformation.dk, før noget lander i en afgørelse.",
  },
  {
    q: "Hvad koster det?",
    a: "Astrid er gratis at prøve, bare begynd at skrive. Skal hele teamet eller forvaltningen med, kan der laves en aftale for jeres kommune.",
  },
  {
    q: "Er aktør-oversigten neutral?",
    a: "Ja. Ingen aktør betaler for at være med eller blive fremhævet. Astrid anbefaler alene ud fra fagligt match, målgruppe og geografi, og valget er altid dit og kommunens. Tjek altid Tilbudsportalen og tilsynsrapporter.",
  },
  {
    q: "Hvordan kommer jeg i gang?",
    a: "Bare skriv hvad du tumler med, eller klik på en af forslags-knapperne under skrivefeltet. Astrid svarer med det samme. Du behøver ikke logge ind for at prøve.",
  },
  {
    q: "Kan Astrid huske mig og gemme mine samtaler?",
    a: "Ja, men kun lokalt på din egen enhed. Det du sætter under Min profil, og de samtaler du gemmer under Mine samtaler, ligger i din browser, aldrig på en server. Du kan altid rydde det igen.",
  },
  {
    q: "Kan jeg tale i stedet for at skrive?",
    a: "Ja, brug Diktér-knappen. Den bruger browserens tale-tjeneste, så brug den kun til anonym tekst, aldrig borgeroplysninger.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-2.5">
        {FAQ_ITEMS.map((f) => (
          <details key={f.q} className="k-faq rounded-[16px] px-5 py-1" style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 2px 12px rgba(90,80,72,0.05)" }}>
            <summary className="cursor-pointer py-3.5 list-none flex justify-between items-center gap-3" style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--kaerne-ink)" }}>
              {f.q}
              <span className="k-faq-pil shrink-0" aria-hidden="true" style={{ color: "var(--kaerne-terracotta)", fontSize: 18 }}>+</span>
            </summary>
            <p className="pb-4" style={{ fontSize: 14, lineHeight: 1.65, color: "var(--kaerne-ink-soft)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
