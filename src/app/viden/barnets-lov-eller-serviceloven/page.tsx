import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barnets Lov eller Serviceloven? Sådan ser du forskellen",
  description:
    "Barnets Lov afløste børneområdet i Serviceloven 1. januar 2024. Få et klart overblik over forskellen, hvornår du bruger hvad, og hvad der ændrede sig.",
  alternates: { canonical: "/viden/barnets-lov-eller-serviceloven" },
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
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Barnets Lov eller Serviceloven? Sådan ser du forskellen</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Viden om Barnets Lov</p>

        <section style={sec}>
          <p style={p}><strong>Kort svar:</strong> Barnets Lov trådte i kraft 1. januar 2024 og samlede og moderniserede den del af Serviceloven, der handlede om børn og unge med behov for særlig støtte. Formålet og de bærende principper er i høj grad de samme, men sproget er moderniseret, barnets rettigheder er styrket, og barnet inddrages tidligere og mere direkte. Indsatser og afgørelser for voksne ligger fortsat i Serviceloven.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvornår bruger du hvad?</h2>
          <p style={p}>Du bruger Barnets Lov, når sagen handler om et barn eller en ung med behov for særlig støtte: underretninger, screening, den børnefaglige undersøgelse, valg af indsats, anbringelse og opfølgning. Du bruger fortsat Serviceloven, når sagen handler om voksne, eller om ydelser der ikke er flyttet over i Barnets Lov.</p>
          <p style={p}>Mange begreber går igen fra Serviceloven, fx indsats og opfølgning. Det betyder ikke, at alt er som før. Barnets Lov er udtryk for et nyt børnesyn, hvor barnet i højere grad er aktør i egen sag.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Tre ting, der ændrede sig</h2>
          <p style={p}>1. Barnet inddrages tidligere og mere direkte. Efter Barnets Lov § 5 skal barnets holdning tilvejebringes og inddrages løbende gennem samtaler og anden direkte kontakt, inden der træffes afgørelse.</p>
          <p style={p}>2. Partsstatus fra 10 år. Efter Barnets Lov § 3 er aldersgrænsen for selvstændig partsstatus sænket fra 12 til 10 år.</p>
          <p style={p}>3. Mere fokus på kvalitet og inddragelse end på proceskrav. Nogle proceskrav er lempet, men der stilles til gengæld nye krav til, hvordan inddragelse og faglig kvalitet dokumenteres i journalen.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvad betyder det for dit notat?</h2>
          <p style={p}>Når vægten flytter fra flueben til kvalitet og inddragelse, skal det kunne læses i sagen, at barnet er hørt, og hvorfor du har valgt som du har. En tydelig, objektiv begrundelse er din bedste sikring, både fagligt og retssikkerhedsmæssigt.</p>
          <p style={p}>Astrid kan oversætte den rette paragraf til hverdagssprog og hjælpe dig med at sætte ord på inddragelsen i et fagligt notat. Prøv <a href="/paragraf-oversaetter" style={a}>paragraf-oversætteren</a> eller få <a href="/notat-hjaelp" style={a}>hjælp til notatet</a>. Astrid træffer aldrig afgørelser: skønnet er dit.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Se også: <a href="/viden/boernefaglig-undersoegelse-frist" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>fristen for den børnefaglige undersøgelse</a> og <a href="/viden/inddragelse-af-barnet" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>hvornår barnet skal inddrages</a>. Astrid tænker med, du bestemmer.</p>
      </article>
    </main>
  );
}
