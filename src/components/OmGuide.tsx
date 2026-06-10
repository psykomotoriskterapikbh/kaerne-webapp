"use client";

/* Forsidesektion: Sådan virker det, brug-guide, om Astrid, pris (gratis) og kontakt.
   Hjælper både nye brugere og kommuner, der lander på siden, med at forstå tilbuddet. */

const TRIN = [
  { n: "1", t: "Skriv eller vælg et emne", d: "Fortæl Astrid om en sag, et notat, en paragraf, eller bare det du tumler med. Du kan også klikke på en af forslags-knapperne." },
  { n: "2", t: "Astrid tænker med", d: "Du får en faglig vurdering, et konkret løsningsforslag, de rette paragraffer og næste skridt, på sekunder." },
  { n: "3", t: "Du bestemmer", d: "Brug svaret som udkast, gem samtalen, eller luk sagen. Det socialfaglige skøn er altid dit." },
];

const VAERKTOEJER = [
  { i: "☺", t: "Min profil", d: "Fortæl hvem du er, så svarene rammer din rolle og kommune." },
  { i: "🗂", t: "Mine samtaler", d: "Gem en samtale og find den frem igen senere." },
  { i: "🎙", t: "Diktér", d: "Tal i stedet for at skrive. Kun til anonym tekst." },
  { i: "⦸", t: "Anonymisér", d: "Fjerner CPR, telefon, e-mail og adresse fra teksten." },
  { i: "⎙", t: "Upload sag", d: "Smid en anonym fil ind, så læser Astrid den." },
  { i: "⌂", t: "Find aktør m.m.", d: "Hurtige værktøjer: aktør-match, frist-beregner og paragraf-oversætter." },
];

const card: React.CSSProperties = {
  background: "#fff", border: "0.5px solid var(--kaerne-border)", borderRadius: 18,
  padding: "20px 20px", boxShadow: "0 2px 12px rgba(90,80,72,0.05)",
};
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, color: "var(--kaerne-ink)", textAlign: "center", margin: "0 0 4px" };
const lead: React.CSSProperties = { fontSize: 14, color: "var(--kaerne-muted)", textAlign: "center", margin: "0 0 22px" };

export function OmGuide() {
  return (
    <section className="max-w-5xl mx-auto mt-20 px-6 md:px-0">
      {/* Sådan virker det */}
      <h2 style={h2}>Sådan virker det</h2>
      <p style={lead}>Tre enkle trin, fra tanke til handling.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {TRIN.map((s) => (
          <div key={s.n} style={card}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--kaerne-terracotta)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{s.n}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--kaerne-ink)", marginBottom: 6 }}>{s.t}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--kaerne-ink-soft)" }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Sådan bruger du værktøjerne */}
      <h2 style={{ ...h2, marginTop: 56 }}>Sådan bruger du værktøjerne</h2>
      <p style={lead}>Knapperne under skrivefeltet, kort forklaret.</p>
      <div className="grid gap-3.5 md:grid-cols-2">
        {VAERKTOEJER.map((v) => (
          <div key={v.t} style={{ ...card, display: "flex", gap: 13, alignItems: "flex-start", padding: "15px 18px" }}>
            <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden="true">{v.i}</span>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--kaerne-ink)", marginBottom: 2 }}>{v.t}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--kaerne-ink-soft)" }}>{v.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Om + Gratis + Kontakt */}
      <div style={{ ...card, marginTop: 56, padding: "30px 28px", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", textAlign: "center" }}>
        <h2 style={{ ...h2, margin: "0 0 10px" }}>Om Astrid</h2>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", maxWidth: 620, margin: "0 auto 18px" }}>
          Astrid er et fagligt beslutningsstøtte-værktøj til kommunalt socialarbejde. Hun kender Barnets Lov og Serviceloven, letter dokumentationen og tænker med i dine sager, men hun træffer aldrig afgørelser. Skønnet og myndighedsansvaret ligger altid hos dig og din kommune.
        </p>
        <div style={{ display: "inline-block", background: "#fff", border: "0.5px solid var(--kaerne-border)", borderRadius: 14, padding: "14px 22px", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-terracotta-deep)" }}>Gratis at prøve</div>
          <div style={{ fontSize: 13.5, color: "var(--kaerne-ink-soft)", marginTop: 2 }}>Skal hele teamet eller forvaltningen med, laver vi en aftale for jeres kommune.</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <a href="mailto:kontakt@kaerne.dk?subject=Astrid%20%E2%80%93%20book%20en%20demo%20for%20vores%20forvaltning" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15.5, textDecoration: "none", boxShadow: "0 5px 16px rgba(217,102,55,.34)" }}>Book 15 min for din forvaltning →</a>
        </div>
        <p style={{ fontSize: 14, color: "var(--kaerne-ink-soft)", margin: "4px 0 0" }}>
          Vil din kommune høre mere, eller har du spørgsmål? <a href="mailto:kontakt@kaerne.dk" style={{ color: "var(--kaerne-terracotta-deep)", textDecoration: "underline" }}>Skriv til os</a>.
        </p>
      </div>
    </section>
  );
}
