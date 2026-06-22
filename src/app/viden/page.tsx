import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Viden om Barnets Lov og Serviceloven",
  description:
    "Korte, faglige svar om Barnets Lov og Serviceloven: forskelle, frister og inddragelse af barnet. Skrevet til en travl hverdag på socialområdet.",
  alternates: { canonical: "/viden" },
};

const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: "0 0 10px" };
const card: React.CSSProperties = { display: "block", marginTop: 16, padding: "16px 18px", borderRadius: 14, background: "var(--kaerne-card, #fff)", border: "1px solid rgba(0,0,0,0.06)", textDecoration: "none" };
const ct: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 4px" };
const cd: React.CSSProperties = { fontSize: 14, lineHeight: 1.5, color: "var(--kaerne-muted)", margin: 0 };

export default function Page() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>← Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Viden om Barnets Lov</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Korte, faglige svar til hverdagen</p>
        <p style={{ ...p, marginTop: 18 }}>Her samler vi klare svar på det, mange socialrådgivere og sagsbehandlere søger efter. Astrid støtter fagligheden, men træffer aldrig afgørelser: skønnet er altid dit.</p>

        <a href="/viden/barnets-lov-eller-serviceloven" style={card}>
          <p style={ct}>Barnets Lov eller Serviceloven? Sådan ser du forskellen</p>
          <p style={cd}>Hvad ændrede sig 1. januar 2024, og hvornår bruger du hvad.</p>
        </a>
        <a href="/viden/boernefaglig-undersoegelse-frist" style={card}>
          <p style={ct}>Børnefaglig undersøgelse: frist efter § 20</p>
          <p style={cd}>Som udgangspunkt 4 måneder. Sådan hænger frist, indhold og notat sammen.</p>
        </a>
        <a href="/viden/inddragelse-af-barnet" style={card}>
          <p style={ct}>Hvornår skal barnet inddrages? § 5</p>
          <p style={cd}>Inddragelse gennem direkte kontakt, også i de mindre sager.</p>
        </a>
        <a href="/faq" style={card}>
          <p style={ct}>Ofte stillede spørgsmål</p>
          <p style={cd}>Svar om Astrid, sikkerhed, pris og jura.</p>
        </a>
      </article>
    </main>
  );
}
