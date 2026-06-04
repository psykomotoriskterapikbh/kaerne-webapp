"use client";

import { useMemo, useState } from "react";
import { AKTORER, AKTOR_KOMPAKT } from "@/data/aktorer";

type Props = { onAsk: (text: string) => void };

const KATEGORIER = ["Alle", "Fagpersons-netværk", "Matrikelløs indsats", "Botilbud", "Vikarbureau"] as const;
const OMRAADER = [
  { value: "alle", label: "Alle målgrupper" },
  { value: "boern", label: "Børn, unge & familier" },
  { value: "voksne", label: "Voksne" },
] as const;
const REGIONER = [
  { value: "sjaelland", label: "Sjælland & Hovedstaden" },
  { value: "jylland", label: "Jylland & Fyn" },
  { value: "alle", label: "Hele landet" },
] as const;

export default function AktorMatch({ onAsk }: Props) {
  const [kategori, setKategori] = useState<string>("Alle");
  const [omraade, setOmraade] = useState<string>("alle");
  const [region, setRegion] = useState<string>("sjaelland");
  const [soeg, setSoeg] = useState("");
  const [opgave, setOpgave] = useState("");

  const resultater = useMemo(() => {
    const q = soeg.trim().toLowerCase();
    return AKTORER.filter((a) => {
      if (kategori !== "Alle" && a.kategori !== kategori) return false;
      if (omraade !== "alle" && a.omraade !== "begge" && a.omraade !== omraade) return false;
      if (region !== "alle" && !a.regioner.includes(region as "sjaelland" | "jylland") && !a.regioner.includes("landsdaekkende")) return false;
      if (q) {
        const hay = `${a.navn} ${a.maalgruppe} ${a.geografi} ${a.paragraffer.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [kategori, omraade, region, soeg]);

  const askAiMatch = () => {
    const t = opgave.trim();
    if (!t) return;
    onAsk(
      `Jeg er sagsbehandler og skal finde den rette indsats og aktør til denne opgave (anonymiseret): «${t}». ` +
      `Her er en vejledende aktør-oversigt: ${AKTOR_KOMPAKT}. ` +
      `Giv mig dit faglige bud: 1) hvilken type indsats og paragraf opgaven peger på, 2) hvilke 2-3 aktører fra oversigten der bedst matcher opgave OG geografi, 3) hvad jeg skal afklare med aktøren før valg (kapacitet, erfaring med målgruppen, pris, opstartstid). Husk: valget er mit.`
    );
    setOpgave("");
  };

  const selectStyle = {
    border: "0.5px solid var(--kaerne-border)",
    background: "#fff",
    color: "var(--kaerne-ink)",
    boxShadow: "0 2px 10px rgba(90,80,72,0.05)",
  };

  return (
    <section id="aktoer" className="max-w-5xl mx-auto mt-16">
      <div className="text-center mb-2 text-[11px]" style={{ letterSpacing: "0.2em", color: "var(--kaerne-sage)", textTransform: "uppercase" }}>
        Aktør-match
      </div>
      <h2 className="text-center mb-3" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 300, color: "var(--kaerne-ink)" }}>
        Beskriv opgaven — Karla giver sit bud
      </h2>
      <p className="text-center mx-auto mb-6" style={{ maxWidth: 580, fontSize: 15, lineHeight: 1.6, color: "var(--kaerne-ink-soft)" }}>
        Skriv hvad sagen kalder på (anonymiseret) — Karla foreslår indsatstype, paragraf,
        konkrete aktører og geografi. Eller filtrér selv i oversigten nedenfor.
      </p>

      <div className="max-w-2xl mx-auto mb-10 relative">
        <textarea
          value={opgave}
          onChange={(e) => setOpgave(e.target.value)}
          rows={3}
          placeholder="Fx: Familie på Vestsjælland med to børn, bekymring for mistrivsel i skolen, mor ønsker hjælp. Vi overvejer familiebehandling med hurtig opstart..."
          className="w-full bg-white rounded-[18px] py-4 pl-5 pr-5 text-[14px] focus:outline-none resize-none"
          style={{ border: "0.5px solid var(--kaerne-border)", boxShadow: "0 2px 14px rgba(90,80,72,0.06)" }}
          aria-label="Beskriv opgaven til Karla"
        />
        <div className="flex justify-end mt-2.5">
          <button
            onClick={askAiMatch}
            disabled={!opgave.trim()}
            className="cursor-pointer px-5 py-2.5 rounded-full text-[13px] hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ background: "var(--kaerne-terracotta)", color: "#fff", boxShadow: "0 3px 10px rgba(226,145,111,0.4)" }}
          >
            Få Karlas bud →
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none" style={selectStyle} aria-label="Filtrér på geografi">
          {REGIONER.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none" style={selectStyle} aria-label="Filtrér på type">
          {KATEGORIER.map((k) => (
            <option key={k} value={k}>{k === "Alle" ? "Alle typer" : k}</option>
          ))}
        </select>
        <select value={omraade} onChange={(e) => setOmraade(e.target.value)} className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none" style={selectStyle} aria-label="Filtrér på målgruppe">
          {OMRAADER.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input
          value={soeg}
          onChange={(e) => setSoeg(e.target.value)}
          placeholder="Søg — fx §32, autisme, BFU..."
          className="px-4 py-2.5 rounded-full text-[13px] w-[210px] focus:outline-none"
          style={selectStyle}
          aria-label="Søg i aktører"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resultater.map((a) => (
          <div
            key={a.navn}
            className="rounded-[18px] p-5 flex flex-col gap-2.5 transition-transform hover:-translate-y-0.5"
            style={
              a.featured
                ? { background: "#fff", border: "1.5px solid var(--kaerne-sage)", boxShadow: "0 6px 24px rgba(138,170,133,0.25)" }
                : { background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 3px 16px rgba(90,80,72,0.07)" }
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: a.farve, color: "#fff", fontFamily: "var(--font-serif)", fontSize: 16 }}
                  aria-hidden="true"
                >
                  {a.navn.charAt(0)}
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--kaerne-ink)" }}>{a.navn}</div>
              </div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px]" style={a.featured ? { background: "var(--kaerne-sage)", color: "#fff", letterSpacing: "0.04em" } : { background: "var(--kaerne-cream)", color: "var(--kaerne-terracotta-deep)", letterSpacing: "0.04em" }}>
                {a.featured ? "Partner" : a.kategori}
              </span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "var(--kaerne-ink-soft)" }}>{a.maalgruppe}</div>
            <div className="flex flex-wrap gap-1.5">
              {a.paragraffer.slice(0, 4).map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-full text-[11px]" style={{ background: "var(--kaerne-sand)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink-soft)" }}>
                  {p}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--kaerne-muted)" }}>{a.geografi}</div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => onAsk(`Jeg overvejer ${a.navn} (${a.kategori.toLowerCase()}, ${a.paragraffer.join(", ")}, ${a.geografi}). Hvad skal jeg afklare og spørge om, før jeg vælger aktør til sådan en opgave?`)}
                className="cursor-pointer px-3.5 py-2 rounded-full text-[12px] hover:opacity-90 transition-opacity"
                style={{ background: "var(--kaerne-ink)", color: "var(--kaerne-sand)" }}
              >
                Spørg Karla
              </button>
              <a
                href={a.web}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full text-[12px] hover:opacity-70 transition-opacity"
                style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)" }}
              >
                Besøg side →
              </a>
            </div>
          </div>
        ))}
      </div>

      {resultater.length === 0 && (
        <p className="text-center mt-6" style={{ fontSize: 14, color: "var(--kaerne-muted)" }}>
          Ingen aktører matcher — prøv et bredere filter, eller beskriv opgaven for Karla ovenfor.
        </p>
      )}

      <p className="text-center mx-auto mt-6" style={{ maxWidth: 640, fontSize: 11.5, lineHeight: 1.6, color: "var(--kaerne-muted)" }}>
        Vejledende oversigt baseret på offentligt tilgængelige oplysninger. KÆRNE er platformens partner
        og vises fremhævet. Karlas bud er faglig støtte — ikke en afgørelse. Tjek altid Tilbudsportalen,
        tilsynsrapporter, takster og økonomi. Valget er altid dit og kommunens.
      </p>
    </section>
  );
}
