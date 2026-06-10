import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privatliv & databeskyttelse",
  description: "Sådan håndterer Astrid data, anonymisering og GDPR i en kommunal kontekst.",
};

const sec: React.CSSProperties = { marginTop: 28 };
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 8px" };
const p: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.65, color: "var(--kaerne-ink-soft)", margin: "0 0 10px" };
const note: React.CSSProperties = { fontSize: 13, color: "var(--kaerne-muted)", fontStyle: "italic" };

export default function PrivatlivPage() {
  return (
    <main style={{ minHeight: "100dvh", background: "var(--kaerne-sand)", padding: "56px 24px 80px" }}>
      <article style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--kaerne-terracotta-deep)", textDecoration: "none" }}>← Tilbage til Astrid</a>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 300, color: "var(--kaerne-ink)", margin: "18px 0 6px", letterSpacing: "-0.015em" }}>Privatliv & databeskyttelse</h1>
        <p style={{ fontSize: 13, color: "var(--kaerne-muted)", margin: 0 }}>Senest opdateret: juni 2026</p>

        <section style={sec}>
          <h2 style={h2}>Kort fortalt</h2>
          <p style={p}>Astrid er et fagligt beslutningsstøtte-værktøj — ikke et journal- eller sagssystem og ikke myndighedsudøvelse. Du skal aldrig indtaste personhenførbare oplysninger om borgere (CPR, fulde navne, adresser, helbred). Astrid hjælper med at anonymisere, men ansvaret for, at delt tekst er anonym, ligger hos dig som medarbejder og hos kommunen som arbejdsgiver.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Dataansvarlig</h2>
          <p style={p}>Når Astrid tages i brug i en kommune, er den pågældende kommune dataansvarlig for sine medarbejderes brug, og spørgsmål om databeskyttelse rettes til kommunens databeskyttelsesrådgiver (DPO). I udviklings- og pilotfasen drives Astrid af holdet bag løsningen, der kan kontaktes om databeskyttelse.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Hvad vi behandler</h2>
          <p style={p}>Når du skriver til Astrid eller uploader en (anonymiseret) fil, sendes teksten til vores AI-underdatabehandler for at generere et svar. Uploadede filer får automatisk fjernet CPR-numre, telefonnumre, e-mails, adresser og postnumre på serveren, før teksten behandles. Samtaler gemmes som udgangspunkt ikke på en server. Opretter du en konto, behandles din arbejds-e-mail og en loginsession. Din personlige profil (navn, rolle, fagområde) gemmes kun lokalt i din browser.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Behandlingsgrundlag</h2>
          <p style={p}>Behandling af medarbejderens kontooplysninger sker for at stille et fagligt arbejdsredskab til rådighed i ansættelsesforholdet (databeskyttelsesforordningen art. 6, stk. 1, litra e/f samt databeskyttelseslovens regler for offentlige myndigheder). Astrid er ikke beregnet til behandling af borgeres personoplysninger; indtastes sådanne alligevel, er kommunen dataansvarlig, og behandlingen skal ske inden for kommunens eksisterende hjemmel for den konkrete sagsbehandling.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Underdatabehandlere</h2>
          <p style={p}>Vi anvender to underdatabehandlere: en sprogmodel-leverandør (AI-svar) og Supabase (konto/login). Der indgås databehandleraftaler med begge, og databehandling tilstræbes inden for EU/EØS. En aktuel liste over underdatabehandlere og aftalegrundlag kan rekvireres.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Automatisk anonymisering & sikkerhed</h2>
          <p style={p}>Både i chatten og ved filupload kører en automatisk maskering af tydelige personoplysninger. Det er en hjælp — ikke en garanti. Navne i fri tekst kan ikke altid fanges automatisk, så læs altid teksten igennem, før du sender den. Al trafik sker over krypteret forbindelse (HTTPS), og samtaleindhold logges ikke.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Konsekvensanalyse (DPIA)</h2>
          <p style={p}>Inden bredere idriftsættelse i kommunen anbefales det at gennemføre en konsekvensanalyse vedrørende databeskyttelse (DPIA) og at lade løsningen indgå i kommunens fortegnelse over behandlingsaktiviteter. Vi bidrager gerne med teknisk dokumentation til dette.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Login & nye brugere</h2>
          <p style={p}>Medarbejdere kan oprette en konto med arbejds-e-mail og adgangskode. Ved oprettelse accepteres denne privatlivspolitik. Du kan til enhver tid logge ud, rydde din lokale profil eller slette din konto og dine kontodata permanent fra menuen.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Dine rettigheder</h2>
          <p style={p}>Efter databeskyttelsesforordningen (GDPR) har du ret til indsigt, berigtigelse og sletning af dine personoplysninger, ret til begrænsning samt ret til at klage til Datatilsynet (datatilsynet.dk). Henvendelser herom rettes til kommunens databeskyttelsesrådgiver og behandles hurtigst muligt.</p>
        </section>

        <section style={sec}>
          <h2 style={h2}>Kontakt</h2>
          <p style={p}>Spørgsmål om privatliv og databehandling rettes til kommunens databeskyttelsesrådgiver (DPO) eller til den dataansvarlige enhed bag Astrid.</p>
        </section>

        <p style={{ ...p, marginTop: 32, fontSize: 13, color: "var(--kaerne-muted)" }}>Astrid træffer aldrig afgørelser og bevilger intet. Det socialfaglige skøn og myndighedsansvaret ligger hos sagsbehandleren og kommunen.</p>
      </article>
    </main>
  );
}
