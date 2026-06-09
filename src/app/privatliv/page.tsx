import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privatliv & sikkerhed",
  description: "Sådan håndterer Astrid data, anonymisering og GDPR.",
};

const sec: React.CSSProperties = { marginTop: 28 };
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 8px" };
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: "0 0 10px" };

export default function PrivatlivPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>← Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Privatliv & sikkerhed</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Senest opdateret: juni 2026</p>

        <section style={sec}>
          <h2 style={h2}>Kort fortalt</h2>
          <p style={p}>Astrid er beslutningsstøtte til fagligt arbejde — ikke et journalsystem. Du skal aldrig indtaste personhenførbare oplysninger (CPR, fulde navne, adresser). Astrid hjælper dig med at anonymisere, men ansvaret for, at delt tekst er anonym, ligger hos dig og din kommune.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvad vi behandler</h2>
          <p style={p}>Når du skriver til Astrid eller uploader en (anonymiseret) fil, sendes teksten til vores AI-leverandør for at generere et svar. Uploadede filer får automatisk fjernet CPR-numre, telefonnumre, e-mails, adresser og postnumre på serveren, før teksten behandles. Vi gemmer som udgangspunkt ikke dine samtaler på en server.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Automatisk anonymisering</h2>
          <p style={p}>Både i chatten og ved filupload kører en automatisk maskering af tydelige personoplysninger. Det er en hjælp — ikke en garanti. Navne i fri tekst kan ikke altid fanges automatisk, så læs altid teksten igennem, før du sender den.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Login</h2>
          <p style={p}>Hvis du opretter en konto, opbevares din e-mail og loginsession sikkert hos vores databehandler (Supabase). Du kan til enhver tid logge ud, og du kan bede om at få din konto slettet.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Databehandlere</h2>
          <p style={p}>Vi anvender underdatabehandlere til AI-svar (sprogmodel-leverandør) og til konto/login (Supabase). Der indgås databehandleraftaler, og databehandling tilstræbes inden for EU/EØS. Kontakt os for den aktuelle liste og aftalegrundlag.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Dine rettigheder</h2>
          <p style={p}>Efter databeskyttelsesforordningen (GDPR) har du ret til indsigt, berigtigelse og sletning af dine personoplysninger samt ret til at klage til Datatilsynet. Henvendelser om dette behandles hurtigst muligt.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Kontakt</h2>
          <p style={p}>Spørgsmål om privatliv og databehandling kan rettes til den dataansvarlige bag Astrid.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Astrid træffer aldrig afgørelser og bevilger intet. Det socialfaglige skøn ligger hos sagsbehandleren og kommunen.</p>
      </article>
    </main>
  );
}
