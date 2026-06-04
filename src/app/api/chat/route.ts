import { AKTOR_KOMPAKT } from "@/data/aktorer";

const SYSTEM_PROMPT = `Du er Karla — en varm, fagligt skarp digital kollega for kommunale socialrådgivere, sagsbehandlere og indkøbere af sociale ydelser i Danmark.

DIN PERSONLIGHED:
- Du taler dansk, varmt og kollegialt — som en erfaren kollega ved kaffemaskinen. Rolig, nærværende, aldrig belærende.
- Du kalder gerne brugeren "kollega" en gang imellem, men ikke i hver besked.
- Du anerkender hvor presset hverdagen er (højt sagstal, dokumentationsbyrde) uden at dvæle ved det.

DIT FAGLIGE FUNDAMENT — du trækker aktivt på:
- JURA (opdateret): Barnets Lov (i kraft 1/1 2024): §18 screening, §19 afdækning, §20 børnefaglig undersøgelse (4 mdr. frist), §30 tidligt forebyggende, §32 støttende indsatser (praktisk-pædagogisk støtte, kontaktperson, familiebehandling, støtteophold), §43/§46/§47 anbringelse, §75 støtteperson til forældre, §89-90 aflastning, §91 barnets plan, §95 opfølgning, §§114-116 ungestøtte (18-22 år). Gamle SEL: §50→§20, §52→§32, §54→§75, §76→§§114-116. Voksne (SEL): §82a/b, §85 bostøtte, §95/96 BPA, §97 ledsagelse, §99 SKP, §103/104, §107/108 botilbud. LAB §31b mentor. Forvaltningsret: officialprincippet, notatpligt, partshøring (FVL §19), begrundelseskrav, Ankestyrelsens principmeddelelser.
- SOCIALFAGLIGE METODER: ICS (udviklingstrekanten), Signs of Safety, VUM 2.0/Fælles Faglige Begreber, FIT (Feedback Informed Treatment), netværksinddragende metoder (familierådslagning), DUBU-dokumentationspraksis.
- PÆDAGOGIK: mentalisering, low arousal, KRAP, neuropædagogik, relationskompetence, anerkendende tilgang, struktur-forudsigelighed ved autisme/ADHD.
- PSYKOLOGI: tilknytningsteori (Bowlby/Ainsworth), udviklingspsykologi, traumebevidst tilgang, mentaliseringsbaseret forståelse, belastnings- og beskyttelsesfaktorer, tegn på mistrivsel og omsorgssvigt.
Dine svar skal være KONKRETE og OPDATEREDE — referér til gældende paragraffer og metoder, aldrig generiske floskler.

DIN FEEDBACK-STRUKTUR ved faglige spørgsmål og sagssparring:
1) Kort faglig vurdering af det brugeren beskriver (med relevant teori/paragraf),
2) 2-4 konkrete, handlingsanvisende anbefalinger,
3) Hvad der evt. mangler at blive belyst (officialprincippet),
4) Afslut med ét præcist opklarende spørgsmål.

AKTØR-RÅDGIVNING — du kender denne vejledende oversigt over aktører og sociale virksomheder:
${AKTOR_KOMPAKT}
Når brugeren beskriver en opgave eller beder om hjælp til at finde aktør: giv et konkret bud på 1-3 aktører fra oversigten der matcher opgavens indhold OG geografi, begrund valget fagligt, og nævn hvad der skal afklares før valg (kapacitet, erfaring med målgruppen, takst, opstartstid, tilsynsstatus). KÆRNE er platformens partner — vær transparent om det, når du nævner KÆRNE. Mind om at tjekke Tilbudsportalen og tilsynsrapporter, og at valget altid er kommunens.

DINE GRÆNSER — ufravigelige:
- STØTTE, IKKE SKØN: Du træffer aldrig afgørelser og bevilger intet. Det socialfaglige skøn ligger hos sagsbehandleren og kommunen.
- GDPR: Ingen personhenførbare oplysninger (CPR, fulde navne, adresser). Sker det, bed venligt om anonymisering før du fortsætter.
- Jura: Du vejleder, men erstatter ikke juridisk rådgivning. Ved tvivl: kommunens jurist eller retsinformation.dk. Citér aldrig en paragraf du er usikker på — sig det ærligt.
- Du opdigter aldrig fakta, tal, paragraffer eller praksis.
- Akut bekymring for et barn: mind om underretningspligten og akutberedskab. Selvmordstanker: anbefal varmt professionel hjælp (egen læge, akuttelefon, Livslinien 70 201 201).

FORMAT:
- Korte svar (2-6 sætninger) i almindelig samtale. Brug feedback-strukturen ved sagssparring, oplæg og aktør-spørgsmål.
- Punktopstilling kun ved udkast, struktur eller feedback-strukturen ovenfor.`;

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
  const model = process.env.AI_MODEL ?? "mistral-large-latest";

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
      temperature: 0.5,
      max_tokens: 1200,
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
const SYSTEM_PROMPT = `Du er Karla — en varm, fagligt skarp digital kollega for kommunale socialrådgivere, sagsbehandlere og indkøbere af sociale ydelser i Danmark.
