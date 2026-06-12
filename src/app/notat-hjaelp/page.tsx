import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Journalnotat-hjælp til socialrådgivere — skriv fagligt holdbare notater hurtigt | Astrid",
  description: "Fra løse noter til professionelt journalnotat på minutter. Astrid hjælper socialrådgivere med objektivt sprog, korrekt struktur og §20-notater efter Barnets Lov. Gratis at prøve.",
  alternates: { canonical: "/notat-hjaelp" },
};

const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--kaerne-ink)", margin: "28px 0 10px" };
const p: React.CSSProperties = { margin: "0 0 14px" };

export default function Page() {
  return (
    <main style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <Link href="/" style={{ fontFamily: "var(--font-script)", fontSize: 24, color: "var(--kaerne-ink)", textDecoration: "none" }}>Astrid</Link>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kaerne-sage)", margin: "28px 0 8px" }}>Værktøj · journalnotater</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, lineHeight: 1.12, color: "var(--kaerne-ink)", margin: "0 0 14px" }}>Fra løse noter til fagligt journalnotat — på minutter</h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: "var(--kaerne-ink-soft)", margin: "0 0 28px", maxWidth: 640 }}>Dokumentationen er rygraden i godt socialfagligt arbejde — og samtidig det, der æder flest timer. Astrid omsætter dine stikord til et professionelt, juridisk holdbart journalnotat, så du kan bruge tiden hos borgeren.</p>

        <div style={{ marginBottom: 8 }}>
          <Link href="/" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15.5, textDecoration: "none", boxShadow: "0 5px 16px rgba(217,102,55,.34)" }}>Prøv notat-hjælpen gratis →</Link>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--kaerne-muted)", margin: "10px 0 0" }}>Ingen oprettelse nødvendig. Skriv aldrig CPR-numre eller navne — Astrid hjælper med at anonymisere.</p>

        <div style={{ marginTop: 32, fontSize: 15, lineHeight: 1.7, color: "var(--kaerne-ink-soft)" }}>
          <h2 style={h2}>Hvad kendetegner et godt journalnotat?</h2>
          <p style={p}>Et fagligt holdbart notat adskiller fakta fra vurdering, bruger objektivt og respektfuldt sprog, dokumenterer barnets eller borgerens perspektiv og kobler vurderingen til lovgrundlaget — fx Barnets Lov eller serviceloven. Det er ikke kun god praksis: det er retssikkerhed for både borger og myndighed.</p>
          <h2 style={h2}>Sådan hjælper Astrid</h2>
          <p style={p}>Skriv dine stikord fra mødet eller samtalen (anonymiseret), og bed Astrid omsætte dem til et struktureret journalnotat med objektivt sprog. Brug kommandoen /notat i chatten, eller bed om et §20-notat med korrekt opbygning: baggrund, faktiske oplysninger, barnets perspektiv, faglig vurdering og indstilling. Du kan også få et etisk sprogtjek, der fanger stigmatiserende formuleringer.</p>
          <h2 style={h2}>Skønnet er altid dit</h2>
          <p style={p}>Astrid er beslutningsstøtte — aldrig beslutningstager. Udkastet er dit arbejdsredskab: du læser, retter og står fagligt på mål for det færdige notat, præcis som med et udkast fra en god kollega. Samtaler gemmes kun i din egen browser, og CPR-numre blokeres automatisk.</p>
          <h2 style={h2}>Gratis §20-notatskabelon</h2>
          <p style={p}>Vil du have en klar skabelon til den børnefaglige undersøgelses notater? På forsiden kan du hente vores gratis §20-skabelon med de fem afsnit, partshøringstjek og huskeliste — klar til brug i din kommune.</p>
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15.5, textDecoration: "none", boxShadow: "0 5px 16px rgba(217,102,55,.34)" }}>Prøv hele Astrid →</Link>
          <Link href="/frist-beregner" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, border: "0.5px solid var(--kaerne-border)", background: "#fff", color: "var(--kaerne-ink-soft)", fontWeight: 600, fontSize: 15.5, textDecoration: "none" }}>Se frist-beregneren</Link>
        </div>
      </div>
    </main>
  );
}
