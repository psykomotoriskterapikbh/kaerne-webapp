import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ofte stillede spørgsmål om Astrid og Barnets Lov",
  description:
    "Svar på de mest stillede spørgsmål om Astrid, Barnets Lov, Serviceloven, frister og sikkerhed. Astrid er gratis at prøve. Støtte, ikke skøn.",
  alternates: { canonical: "/faq" },
};

const qa: { q: string; a: string }[] = [
  { q: "Hvad er forskellen på Barnets Lov og Serviceloven?", a: "Barnets Lov trådte i kraft 1. januar 2024 og samler og moderniserer den del af Serviceloven, der handlede om børn og unge med behov for særlig støtte. Formålet og de bærende principper er i høj grad videreført, men sproget er moderniseret, barnets rettigheder er styrket, og barnet inddrages tidligere og mere direkte. Mange afgørelser om voksne og økonomi ligger fortsat i Serviceloven." },
  { q: "Hvad er fristen for en børnefaglig undersøgelse efter Barnets Lov § 20?", a: "Den børnefaglige undersøgelse efter Barnets Lov § 20 skal som udgangspunkt være afsluttet senest 4 måneder efter, at kommunen er blevet opmærksom på, at et barn eller en ung kan have behov for særlig støtte. Kan fristen undtagelsesvis ikke holdes, skal kommunen lave en foreløbig vurdering og derefter færdiggøre undersøgelsen hurtigst muligt." },
  { q: "Hvornår skal barnet inddrages i sin egen sag?", a: "Efter Barnets Lov § 5 skal barnets holdning og synspunkter tilvejebringes og inddrages løbende gennem samtaler og anden direkte kontakt, inden der træffes afgørelser om barnets forhold. Inddragelse gælder ikke kun de store anbringelsessager, men også mindre afgørelser, der har direkte betydning for barnets hverdag og trivsel." },
  { q: "Hvad er Astrid?", a: "Astrid er en dansk, digital kollega til socialrådgivere og sagsbehandlere i kommunerne. Astrid hjælper med sagssparring, jura i Barnets Lov og Serviceloven, journalnotater, frister og valg af den rette indsats. Astrid træffer aldrig afgørelser. Det socialfaglige skøn og myndighedsansvaret ligger altid hos sagsbehandleren og kommunen." },
  { q: "Er Astrid sikker at bruge med følsomme sager?", a: "Astrid er bygget til en hverdag med følsomme sager. Samtaler gemmes kun lokalt i din egen browser, beskeder med CPR-numre afvises før de sendes, og 1-kliks anonymisering fjerner telefon, e-mail og adresse. Del aldrig CPR-numre eller navne. Spørgsmål om GDPR og databehandling kan stilles direkte på kontakt@astridai.dk." },
  { q: "Hvad koster Astrid?", a: "Astrid er gratis at prøve uden binding. Begynd bare at skrive. For forvaltninger og teams tilbydes onboarding, support og fælles videndeling, hvor pris aftales efter behov." },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.astridai.dk/faq#faq",
  inLanguage: "da-DK",
  mainEntity: qa.map((x) => ({
    "@type": "Question",
    name: x.q,
    acceptedAnswer: { "@type": "Answer", text: x.a },
  })),
};

const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 19, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 6px" };
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: 0 };

export default function Page() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>← Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Ofte stillede spørgsmål</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Astrid, Barnets Lov og sikkerhed</p>

        {qa.map((x, i) => (
          <section key={i} style={{ marginTop: 26 }}>
            <h2 style={h2}>{x.q}</h2>
            <p style={p}>{x.a}</p>
          </section>
        ))}

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Mere viden: <a href="/viden" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>Barnets Lov forklaret</a>. Kig forbi <a href="/" style={{ color: "var(--kaerne-muted)", textDecoration: "underline" }}>astridai.dk</a> og sig hej, det er gratis at prøve.</p>
      </article>
    </main>
  );
}
