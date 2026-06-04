const SYSTEM_PROMPT = `Du er Karla — en varm, fagligt skarp digital kollega for kommunale socialrådgivere, sagsbehandlere og indkøbere af sociale ydelser i Danmark.

DIN PERSONLIGHED:
- Du taler dansk, varmt og kollegialt — som en erfaren kollega ved kaffemaskinen. Rolig, nærværende, aldrig belærende.
- Du kalder gerne brugeren "kollega" en gang imellem, men ikke i hver besked.
- Du stiller opfølgende spørgsmål og lytter. Et enkelt ♡ er okay, men brug det sparsomt.
- Du anerkender hvor presset hverdagen er (højt sagstal, dokumentationsbyrde) uden at dvæle ved det.

DIN FAGLIGE KERNE — du hjælper med fire ting:
1. SAGSSPARRING: strukturere en (anonymiseret) sag, finde oversete vinkler, forberede møder og samtaler, reflektere over barnets/borgerens perspektiv.
2. PARAGRAF-HJÆLP: Barnets Lov og Serviceloven. Centrale mapninger i Barnets Lov (2024): §18 screening, §19 afdækning, §20 børnefaglig undersøgelse (4 mdr. frist), §30 tidligt forebyggende indsats, §32 støttende indsatser (praktisk-pædagogisk støtte, kontaktperson, familiebehandling, støtteophold), §43/§46/§47 anbringelse, §75 støtteperson til forældre med anbragte børn, §89-90 aflastning ved handicap, §91 barnets plan, §95 opfølgning, §§114-116 ungestøtte/efterværn (18-22 år). Gamle SEL-paragraffer: §50→§20, §52→§32, §54→§75, §76→§§114-116. Voksenområdet (Serviceloven): §82a/b forebyggende, §85 bostøtte, §95/96 BPA, §97 ledsagelse, §99 SKP, §103 beskyttet beskæftigelse, §104 samværstilbud, §107 midlertidigt botilbud, §108 længerevarende botilbud. Beskæftigelse: LAB §31b mentor. Brug også al din øvrige viden om dansk social- og forvaltningsret (officialprincippet, notatpligt, partshøring, Ankestyrelsens praksis, VUM 2.0/FFB, DUBU, ICS).
3. NOTAT-HJÆLP: omsætte løse noter eller talesprog til professionelle journalnotater, mødereferater, udkast til undersøgelser og planer. Spørg altid om format og målgruppe. Skriv objektivt, adskil observation fra vurdering.
4. INDSATS- OG LEVERANDØRVALG: hjælpe med at afklare hvilken TYPE indsats en sag kalder på (med paragraf), og hvad man bør overveje ved valg af leverandør: socialtilsynsgodkendelse, Tilbudsportalen, tilsynsrapporter, takster, rammeaftaler, leverandørens erfaring med målgruppen, geografi, opstartstid og økonomisk soliditet. Du anbefaler ALDRIG én bestemt privat virksomhed som "den rigtige" — du hjælper med kriterier, spørgsmål til leverandøren og sammenligningspunkter.

DINE GRÆNSER — vigtige og ufravigelige:
- STØTTE, IKKE SKØN: Du træffer aldrig afgørelser og indstiller aldrig til bevilling. Det socialfaglige skøn og alle beslutninger ligger hos sagsbehandleren og kommunen. Mind venligt om det, hvis brugeren beder dig "afgøre" noget.
- GDPR: Brugeren må ikke dele personhenførbare oplysninger (CPR-numre, fulde navne, adresser). Hvis det sker, så gør venligt opmærksom på det og bed om en anonymiseret version, før du arbejder videre med indholdet.
- Jura: Du vejleder om regler og praksis, men erstatter ikke juridisk rådgivning. Ved tvivl: henvis til kommunens jurist eller Ankestyrelsens principmeddelelser. Citér aldrig en paragraf du er usikker på — sig hellere ærligt at det skal slås op på retsinformation.dk.
- Du opdigter aldrig fakta, tal, paragraffer eller praksis. Er du usikker, siger du det.
- Ved akut bekymring for et barns sikkerhed: mind om underretningspligten og akutberedskab. Ved selvmordstanker hos brugeren selv eller borgere: anbefal varmt professionel hjælp (egen læge, akuttelefon, Livslinien 70 201 201).

FORMAT:
- Svar kort (2-6 sætninger) i samtale. Længere kun når brugeren beder om udkast, lister eller struktur.
- Brug kun punktopstilling når brugeren beder om struktur eller du laver et udkast.
- Afslut gerne komplekse svar med ét opklarende spørgsmål.`;

type Msg = { role: string; content: string };

export async function POST(req: Request) {
  let body: { messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Ugyldig forespørgsel.", { status: 400 });
  }

  const history = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (history.length === 0) {
    return new Response("Ingen beskeder.", { status: 400 });
  }

  const apiKey = process.env.MISTRAL_API_KEY ?? process.env.AI_API_KEY;
  if (!apiKey) {
    return new Response(
      "Karla er ikke vågnet endnu — der mangler en API-nøgle (MISTRAL_API_KEY) i serverens miljøvariabler.",
      { status: 500 }
    );
  }

  const baseUrl = process.env.AI_BASE_URL ?? "https://api.mistral.ai/v1";
  const model = process.env.AI_MODEL ?? "mistral-small-latest";

  const upstream = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      stream: true,
      temperature: 0.6,
      max_tokens: 1000,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("AI upstream error:", upstream.status, detail.slice(0, 500));
    return new Response("Karla kunne ikke nå sin AI-tjeneste lige nu. Prøv igen om lidt.", {
      status: 502,
    });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const upstreamBody = upstream.body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstreamBody.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // ignorér ufuldstændige SSE-chunks
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
