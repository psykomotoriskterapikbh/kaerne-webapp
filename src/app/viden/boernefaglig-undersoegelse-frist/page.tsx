import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Børnefaglig undersøgelse: frist efter Barnets Lov § 20",
  description:
    "Den børnefaglige undersøgelse efter Barnets Lov § 20 skal som udgangspunkt være afsluttet senest 4 måneder. Få overblik over frist, indhold og notat.",
  alternates: { canonical: "/viden/boernefaglig-undersoegelse-frist" },
};

const sec: React.CSSProperties = { marginTop: 28 };
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 8px" };
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: "0 0 10px" };
const a: React.CSSProperties = { color: "var(--kaerne-terracotta-deep)", textDecoration: "underline" };

export default function Page() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>← Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Børnefaglig undersøgelse: frist efter Barnets Lov § 20</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Viden om Barnets Lov</p>

        <section style={sec}>
          <p style={p}><strong>Kort svar:</strong> Den børnefaglige undersøgelse efter Barnets Lov § 20 skal som udgangspunkt være afsluttet senest 4 måneder efter, at kommunen er blevet opmærksom på, at et barn eller en ung kan have behov for særlig støtte. Kan fristen undtagelsesvis ikke holdes, skal kommunen lave en foreløbig vurdering og derefter færdiggøre undersøgelsen hurtigst muligt.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvornår begynder fristen?</h2>
          <p style={p}>Fristen løber fra det tidspunkt, hvor kommunen bliver opmærksom på, at barnet kan have behov for særlig støtte, fx ved en underretning eller en ansøgning. Undersøgelsen kan også afsluttes tidligere end 4 måneder, hvis de nødvendige oplysninger er indhentet, og der kan træffes afgørelse.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvad skal undersøgelsen afdække?</h2>
          <p style={p}>Den børnefaglige undersøgelse skal belyse barnets samlede situation og behov bredt, så indsatsen bliver proportional: den mindst indgribende indsats, der reelt hjælper. Barnets eget perspektiv skal inddrages undervejs, jf. Barnets Lov § 5.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hold styr på fristen i en travl hverdag</h2>
          <p style={p}>Frister er nemme at miste i en travl sag. Astrids <a href="/frist-beregner" style={a}>frist-beregner</a> hjælper dig med at holde overblik, og <a href="/notat-hjaelp" style={a}>notat-hjælpen</a> kan omsætte dine stikord til et objektivt notat, der viser, hvad du har undersøgt og hvorfor. Astrid regner ikke en afgørelse ud for dig: det faglige skøn bliver hos dig.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Se også: <a href="/viden/barnets-lov-eller-serviceloven" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>forskellen på Barnets Lov og Serviceloven</a>. Astrid tænker med, du bestemmer.</p>
      </article>
    </main>
  );
}
