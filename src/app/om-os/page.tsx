import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om os — holdet bag Astrid",
  description: "Astrid bygges af Kærne — et dansk fagpersons-netværk på det sociale område. Læs om missionen, værdierne og holdet bag.",
};

const sec: React.CSSProperties = { marginTop: 28 };
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 8px" };
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: "0 0 10px" };

export default function OmOsPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>&larr; Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Om os</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Holdet bag Astrid</p>

        <section style={sec}>
          <h2 style={h2}>Hvem står bag</h2>
          <p style={p}>Astrid bygges af <strong>Kærne</strong> — et dansk fagpersons-netværk på det sociale område med base på Sjælland. Vi arbejder til daglig med familiesager efter Barnets Lov og kender derfor hverdagen på socialområdet indefra: dokumentationspresset, fristerne og de svære skøn.</p>
          <p style={p}>Astrid er vores svar på en enkel udfordring: dygtige fagfolk bruger alt for meget af deres tid på papir og for lidt hos borgeren.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Missionen</h2>
          <p style={p}>Astrid er en digital kollega til socialrådgivere, sagsbehandlere og indkøbere i danske kommuner. Hun kender lovgivningen, letter dokumentationen og tænker med i sagerne — men hun træffer aldrig afgørelser. Skønnet og myndighedsansvaret ligger altid hos mennesket og kommunen.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Det tror vi på</h2>
          <p style={p}><strong>Støtte, ikke skøn.</strong> Astrid er beslutningsstøtte — aldrig beslutningstager. Det socialfaglige skøn kan og skal ikke automatiseres.</p>
          <p style={p}><strong>Ærlighed frem for salgsgas.</strong> Vi lover ikke mere, end vi kan holde, og vi bruger ikke opdigtede anbefalinger eller tal. Astrid er ny, og de første kommuner er med til at forme hende.</p>
          <p style={p}><strong>Tryghed i hverdagen.</strong> Samtaler gemmes kun i din egen browser, CPR-numre blokeres automatisk, og vi taler åbent om databehandling og GDPR.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Kontakt</h2>
          <p style={p}>Vil din kommune høre mere, booke en demo eller stille spørgsmål om sikkerhed og databehandling? Skriv til <a href="mailto:astrid@xn--krne-voa.dk" style={{ color: "var(--kaerne-terracotta-deep)", textDecoration: "underline" }}>astrid@kærne.dk</a> — du får svar fra et menneske.</p>
          <p style={{ fontSize: 13, color: "var(--kaerne-muted)", fontStyle: "italic", margin: "14px 0 0" }}>Fulde virksomhedsoplysninger (CVR m.v.) tilføjes her, når selskabsregistreringen er endelig.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Astrid tænker med — du bestemmer. Læs også vores <a href="/privatliv" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>privatlivspolitik</a>.</p>
      </article>
    </main>
  );
}
