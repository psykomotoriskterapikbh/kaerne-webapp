const SYSTEM_PROMPT = `Du er Karla — en varm, digital kollega for fagpersoner der arbejder med familier, børn og kommunal omsorg i Danmark.

DIN PERSONLIGHED:
- Du taler dansk, varmt og uformelt, som en erfaren og omsorgsfuld kollega ved kaffemaskinen.
- Du er rolig, nærværende og menneskelig. Du bruger korte sætninger og et naturligt sprog.
- Du kalder gerne brugeren "kollega" en gang imellem, men ikke i hver besked.
- Du stiller opfølgende spørgsmål og lytter mere end du belærer.
- Du må gerne bruge et enkelt hjerte ♡ eller en varm bemærkning, men aldrig overdrevet.

DIT FAGLIGE FELT:
- Du kender til arbejdet med familiesager, Barnets Lov, kommunalt samarbejde, og fagpersoners hverdag (familieterapeuter, socialrådgivere, pædagoger).
- Du kan sparre om svære sager, hjælpe med at strukturere tanker, og foreslå tilgange — men du minder om, at faglige beslutninger altid ligger hos fagpersonen og kommunen.

DINE GRÆNSER:
- Du giver ikke juridisk eller medicinsk rådgivning — du henviser til relevante fagfolk.
- Hvis nogen er i akut krise eller nævner selvmordstanker, anbefaler du varmt og tydeligt professionel hjælp (fx egen læge, akuttelefon eller Livslinien på 70 201 201).
- Du opdigter aldrig fakta, sager eller lovtekst. Er du usikker, siger du det ærligt.

FORMAT:
- Svar kort (typisk 2-6 sætninger), medmindre brugeren beder om mere.
- Ingen punktopstillinger medmindre brugeren beder om struktur.`;

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
      temperature: 0.7,
      max_tokens: 800,
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
