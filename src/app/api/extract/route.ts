import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/* Server-side anonymisering — defensiv: filens rå tekst forlader aldrig
   serveren uden at CPR, navne-nære mønstre, adresser, tlf og mails er fjernet. */
function anonymiser(text: string): string {
  let t = text;
  t = t.replace(/\b\d{6}[-\s]?\d{4}\b/g, "[CPR fjernet]");
  t = t.replace(/\b(?:\+45[\s]?)?(?:\d{2}[\s]?){4}\b/g, "[tlf fjernet]");
  t = t.replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[email fjernet]");
  t = t.replace(
    /\b([A-ZÆØÅ][a-zæøå]+(?:vej|gade|allé|alle|vænge|parken|boulevard|stræde|plads|toften|haven))\s+\d+[A-Za-z]?(?:,?\s?\d{1,2}\.?\s?(?:tv|th|mf)?)?/g,
    "[adresse fjernet]"
  );
  t = t.replace(/\b\d{4}\s+[A-ZÆØÅ][a-zæøå]+\b/g, "[postnr+by fjernet]");
  return t;
}

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "Ugyldig forespørgsel." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Ingen fil modtaget." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return Response.json({ error: "Filen er for stor (maks. 8 MB)." }, { status: 413 });
  }

  const name = file.name.toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  let text = "";

  try {
    if (name.endsWith(".pdf")) {
      const pdf = (await import("pdf-parse/lib/pdf-parse.js")).default as (b: Buffer) => Promise<{ text: string }>;
      text = (await pdf(buf)).text;
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      text = (await mammoth.extractRawText({ buffer: buf })).value;
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buf.toString("utf-8");
    } else {
      return Response.json({ error: "Filtype understøttes ikke (brug PDF, Word eller TXT)." }, { status: 415 });
    }
  } catch {
    return Response.json({ error: "Kunne ikke læse filen — er den måske scannet/billedbaseret?" }, { status: 422 });
  }

  const clean = anonymiser(text).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 12000);

  if (!clean) {
    return Response.json({ error: "Fandt ingen læsbar tekst i filen." }, { status: 422 });
  }

  return Response.json({ text: clean, chars: clean.length });
}
