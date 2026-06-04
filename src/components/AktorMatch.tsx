"use client";

import { useMemo, useState } from "react";
import { AKTORER } from "@/data/aktorer";

type Props = { onAsk: (text: string) => void };

const KATEGORIER = ["Alle", "Matrikelløs indsats", "Botilbud", "Vikarbureau"] as const;
const OMRAADER = [
  { value: "alle", label: "Alle målgrupper" },
  { value: "boern", label: "Børn, unge & familier" },
  { value: "voksne", label: "Voksne" },
] as const;

export default function AktorMatch({ onAsk }: Props) {
  const [kategori, setKategori] = useState<string>("Alle");
  const [omraade, setOmraade] = useState<string>("alle");
  const [soeg, setSoeg] = useState("");

  const resultater = useMemo(() => {
    const q = soeg.trim().toLowerCase();
    return AKTORER.filter((a) => {
      if (kategori !== "Alle" && a.kategori !== kategori) return false;
      if (omraade !== "alle" && a.omraade !== "begge" && a.omraade !== omraade) return false;
      if (q) {
        const hay = `${a.navn} ${a.maalgruppe} ${a.geografi} ${a.paragraffer.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [kategori, omraade, soeg]);

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
        Find den rette aktør til opgaven
      </h2>
      <p className="text-center mx-auto mb-7" style={{ maxWidth: 560, fontSize: 15, lineHeight: 1.6, color: "var(--kaerne-ink-soft)" }}>
        Filtrér på paragraf, målgruppe og geografi — og spørg Karla, hvad du skal
        være opmærksom på, før du vælger.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none"
          style={selectStyle}
          aria-label="Filtrér på type"
        >
          {KATEGORIER.map((k) => (
            <option key={k} value={k}>{k === "Alle" ? "Alle typer" : k}</option>
          ))}
        </select>
        <select
          value={omraade}
          onChange={(e) => setOmraade(e.target.value)}
          className="px-4 py-2.5 rounded-full text-[13px] cursor-pointer focus:outline-none"
          style={selectStyle}
          aria-label="Filtrér på målgruppe"
        >
          {OMRAADER.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input
          value={soeg}
          onChange={(e) => setSoeg(e.target.value)}
          placeholder="Søg paragraf eller ord — fx §85, autisme..."
          className="px-4 py-2.5 rounded-full text-[13px] w-[240px] focus:outline-none"
          style={selectStyle}
          aria-label="Søg i aktører"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resultater.map((a) => (
          <div
            key={a.navn}
            className="rounded-[18px] p-5 flex flex-col gap-2.5 transition-transform hover:-translate-y-0.5"
            style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 3px 16px rgba(90,80,72,0.07)" }}
          >
            <div className="flex items-start justify-between gap-2">
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--kaerne-ink)" }}>{a.navn}</div>
              <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px]" style={{ background: "var(--kaerne-cream)", color: "var(--kaerne-terracotta-deep)", letterSpacing: "0.04em" }}>
                {a.kategori}
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
                onClick={() => onAsk(`Jeg overvejer en aktør som ${a.navn} (${a.kategori.toLowerCase()}, ${a.paragraffer.join(", ")}). Hvad skal jeg afklare og spørge om, før jeg vælger leverandør til sådan en opgave?`)}
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
          Ingen aktører matcher — prøv et bredere filter, eller spørg Karla direkte.
        </p>
      )}

      <p className="text-center mx-auto mt-6" style={{ maxWidth: 640, fontSize: 11.5, lineHeight: 1.6, color: "var(--kaerne-muted)" }}>
        Vejledende oversigt baseret på offentligt tilgængelige oplysninger — ikke en anbefaling
        eller rangering. Tjek altid Tilbudsportalen, tilsynsrapporter, takster og økonomi, før du vælger.
        Valget er altid dit og kommunens.
      </p>
    </section>
  );
}
