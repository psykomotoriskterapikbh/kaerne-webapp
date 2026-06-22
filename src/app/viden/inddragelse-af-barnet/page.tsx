import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hvornår skal barnet inddrages? Barnets Lov § 5",
  description:
    "Efter Barnets Lov § 5 skal barnet inddrages løbende gennem direkte kontakt, før der træffes afgørelse. Også i mindre sager. Sådan dokumenterer du det.",
  alternates: { canonical: "/viden/inddragelse-af-barnet" },
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
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Hvornår skal barnet inddrages? Barnets Lov § 5</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Viden om Barnets Lov</p>

        <section style={sec}>
          <p style={p}><strong>Kort svar:</strong> Efter Barnets Lov § 5 skal barnets holdning og synspunkter tilvejebringes og inddrages løbende gennem samtaler og anden direkte kontakt, inden der træffes afgørelser om barnets forhold. Inddragelse gælder ikke kun de store anbringelsessager, men også mindre afgørelser, der har direkte betydning for barnets hverdag og trivsel.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvad tæller som inddragelse?</h2>
          <p style={p}>Inddragelse er mere end et formelt spørgsmål under en samtale. Det kan også være at få barnets perspektiv frem på en måde, der passer til barnets alder og situation, fx gennem en mere uformel kontakt. Det vigtige er, at barnets stemme reelt indgår, før der træffes afgørelse.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Også i de små sager</h2>
          <p style={p}>Selv afgørelser, der umiddelbart handler om forældrenes økonomi, kan have direkte betydning for barnet, fx hvis en ændring rammer barnets mulighed for at deltage i fællesskaber. Her skal barnet inddrages. Vurderingen er altid konkret og individuel.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Det skal kunne ses i journalen</h2>
          <p style={p}>Når en sag bliver prøvet, er det ofte begrundelsen og dokumentationen af inddragelsen, der bliver afgørende. En tydelig, objektiv beskrivelse af, at barnet er hørt, og hvordan barnets perspektiv har indgået, er din bedste sikring. Astrid kan hjælpe dig med at finde den rette paragraf og sætte ord på inddragelsen i et <a href="/notat-hjaelp" style={a}>fagligt notat</a>. Astrid træffer aldrig afgørelser: skønnet og myndighedsansvaret er dit.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Se også: <a href="/viden/boernefaglig-undersoegelse-frist" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>fristen for den børnefaglige undersøgelse</a>. Støtte, ikke skøn.</p>
      </article>
    </main>
  );
}
