"use client";

import { useState } from "react";
import { fireConfetti } from "@/lib/confetti";

/* Dagens faglige quiz - 3 hurtige sporgsmaal om jura og metode.
   Nye sporgsmaal hver dag, streak gemmes kun lokalt i browseren.
   Fagligt mikro-laering, ikke pjat: hvert svar har en kort forklaring,
   og man kan bede Astrid uddybe med ét klik. */

type QuizQ = {
  q: string;
  valg: string[];
  rigtig: number;
  fakta: string;
  prompt: string;
};

const ALLE: QuizQ[] = [
  {
    q: "Hvornår skal en børnefaglig undersøgelse (Barnets Lov §20) senest være afsluttet?",
    valg: ["Inden 2 måneder", "Inden 4 måneder", "Inden 6 måneder"],
    rigtig: 1,
    fakta: "Undersøgelsen skal afsluttes senest 4 måneder efter, at kommunen er blevet opmærksom på, at barnet kan have behov for særlig støtte.",
    prompt: "Forklar mig fristen for den børnefaglige undersøgelse efter Barnets Lov §20, og hvad jeg skal nå inden for de 4 måneder.",
  },
  {
    q: "Hvilken lov kræver partshøring, før der træffes afgørelse?",
    valg: ["Serviceloven", "Forvaltningsloven", "Aktivloven"],
    rigtig: 1,
    fakta: "Partshøring følger af forvaltningslovens §19: parten skal have mulighed for at udtale sig om faktiske oplysninger, der er til ugunst, før der afgøres.",
    prompt: "Forklar mig reglerne om partshøring efter forvaltningslovens §19 med et konkret eksempel fra en social sag.",
  },
  {
    q: "Hvad betyder officialprincippet?",
    valg: [
      "Myndigheden skal oplyse sagen tilstrækkeligt, før der træffes afgørelse",
      "Borgeren skal selv skaffe alle oplysninger",
      "Alle afgørelser skal offentliggøres",
    ],
    rigtig: 0,
    fakta: "Officialprincippet betyder, at det er myndighedens ansvar, at sagen er tilstrækkeligt oplyst, før der træffes afgørelse.",
    prompt: "Forklar officialprincippet, og giv mig en tjekliste til at vurdere om min sag er tilstrækkeligt oplyst.",
  },
  {
    q: "Hvad betyder proportionalitetsprincippet i socialt arbejde?",
    valg: [
      "Vælg altid den billigste indsats",
      "Vælg den mindst indgribende indsats, der er egnet",
      "Alle borgere skal have samme indsats",
    ],
    rigtig: 1,
    fakta: "Proportionalitet: indsatsen skal være egnet til formålet og må ikke være mere indgribende end nødvendigt.",
    prompt: "Forklar proportionalitetsprincippet, og hvordan jeg dokumenterer at jeg har overvejet mindre indgribende indsatser.",
  },
  {
    q: "Hvad skal en skriftlig afgørelse, der ikke giver fuldt medhold, altid indeholde?",
    valg: [
      "En begrundelse med henvisning til retsregler",
      "Sagsbehandlerens personlige mening",
      "En liste over kommunens tilbud",
    ],
    rigtig: 0,
    fakta: "Efter forvaltningslovens §22 og §24 skal afgørelsen begrundes med henvisning til de retsregler, den bygger på, og de hovedhensyn der har været bestemmende.",
    prompt: "Hjælp mig med at skrive en korrekt begrundelse i en afgørelse efter forvaltningslovens §22 og §24.",
  },
  {
    q: "Hvor hurtigt skal kommunen bekræfte modtagelsen af en underretning?",
    valg: ["Inden 24 timer", "Inden 6 hverdage", "Inden 14 dage"],
    rigtig: 1,
    fakta: "Kommunen skal kvittere for modtagelsen af en underretning senest 6 hverdage efter, at den er modtaget.",
    prompt: "Forklar mig processen når kommunen modtager en underretning: kvittering, vurdering inden 24 timer og videre forløb.",
  },
  {
    q: "Hvornår trådte Barnets Lov i kraft?",
    valg: ["1. januar 2024", "1. juli 2023", "1. januar 2025"],
    rigtig: 0,
    fakta: "Barnets Lov trådte i kraft 1. januar 2024 og samlede reglerne om børn og unge fra blandt andet serviceloven.",
    prompt: "Giv mig et overblik over de vigtigste ændringer i Barnets Lov i forhold til serviceloven.",
  },
  {
    q: "Hvad siger Barnets Lov om barnets perspektiv før en afgørelse?",
    valg: [
      "Barnet skal inddrages, og barnets holdning skal belyses",
      "Det er nok at tale med forældrene",
      "Kun børn over 15 år skal høres",
    ],
    rigtig: 0,
    fakta: "Barnets perspektiv er bærende i Barnets Lov: barnet skal inddrages, og dets holdning skal belyses og tillægges vægt efter alder og modenhed.",
    prompt: "Hjælp mig med at forberede en børnesamtale, så barnets perspektiv bliver belyst korrekt før afgørelsen.",
  },
  {
    q: "Hvem har ansvaret for afgørelsen, når et beslutningsstøtte-værktøj har givet et fagligt oplæg?",
    valg: [
      "Værktøjet, hvis svaret er forkert",
      "Altid sagsbehandleren og kommunen",
      "Leverandøren af systemet",
    ],
    rigtig: 1,
    fakta: "Skønnet og myndighedsansvaret ligger altid hos mennesket og kommunen. Et værktøj som Astrid støtter fagligheden, men træffer aldrig afgørelser.",
    prompt: "Forklar hvad ansvarlig brug af AI-beslutningsstøtte betyder i kommunal sagsbehandling.",
  },
];

function dagensSporgsmal(): QuizQ[] {
  const nu = new Date();
  const start = new Date(nu.getFullYear(), 0, 0);
  const dag = Math.floor((nu.getTime() - start.getTime()) / 86400000);
  const res: QuizQ[] = [];
  for (let i = 0; i < 3; i++) res.push(ALLE[(dag * 3 + i) % ALLE.length]);
  return res;
}

function opdaterStreak(): number {
  try {
    const idag = new Date().toDateString();
    const igaar = new Date(Date.now() - 86400000).toDateString();
    const sidst = localStorage.getItem("astrid_quiz_sidst");
    let s = parseInt(localStorage.getItem("astrid_quiz_streak") || "0", 10) || 0;
    if (sidst === idag) return s;
    s = sidst === igaar ? s + 1 : 1;
    localStorage.setItem("astrid_quiz_sidst", idag);
    localStorage.setItem("astrid_quiz_streak", String(s));
    return s;
  } catch {
    return 1;
  }
}

const knapBase: React.CSSProperties = {
  display: "block", width: "100%", textAlign: "left", cursor: "pointer",
  border: "0.5px solid var(--kaerne-border)", background: "#fff",
  borderRadius: 14, padding: "12px 16px", fontSize: 14.5, lineHeight: 1.5,
  color: "var(--kaerne-ink)", transition: "border-color .15s ease, box-shadow .15s ease",
};

export default function ParagrafQuiz() {
  const [sp] = useState<QuizQ[]>(dagensSporgsmal);
  const [idx, setIdx] = useState(0);
  const [valgt, setValgt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [faerdig, setFaerdig] = useState(false);
  const [streak, setStreak] = useState(0);

  const aktuel = sp[idx];

  const vaelg = (i: number) => {
    if (valgt !== null) return;
    setValgt(i);
    if (i === aktuel.rigtig) setScore((s) => s + 1);
  };

  const videre = () => {
    if (idx < sp.length - 1) {
      setIdx(idx + 1);
      setValgt(null);
    } else {
      const slutScore = score;
      setFaerdig(true);
      setStreak(opdaterStreak());
      if (slutScore === sp.length) fireConfetti();
    }
  };

  const spoergAstrid = (p: string) => {
    try {
      window.dispatchEvent(new CustomEvent("astrid:ask", { detail: p }));
    } catch {}
  };

  return (
    <div style={{ maxWidth: 640, margin: "56px auto 0" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kaerne-sage)", textAlign: "center", marginBottom: 8 }}>Skarp på 2 minutter</div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, color: "var(--kaerne-ink)", textAlign: "center", margin: "0 0 4px" }}>Dagens faglige quiz</h2>
      <p style={{ fontSize: 14, color: "var(--kaerne-muted)", textAlign: "center", margin: "0 0 18px" }}>Tre hurtige om jura og metode. Nye spørgsmål hver dag.</p>

      <div className="k-card" style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", borderRadius: 18, padding: "22px 22px", boxShadow: "0 2px 12px rgba(90,80,72,0.05)" }}>
        {!faerdig ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "var(--kaerne-muted)", letterSpacing: "0.06em" }}>
                Spørgsmål {idx + 1} af {sp.length}
              </span>
              <span style={{ display: "inline-flex", gap: 5 }} aria-hidden="true">
                {sp.map((_, i) => (
                  <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < idx || (i === idx && valgt !== null) ? "var(--kaerne-sage-deep)" : "var(--kaerne-border)" }} />
                ))}
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, lineHeight: 1.45, color: "var(--kaerne-ink)", marginBottom: 14 }}>{aktuel.q}</div>
            <div style={{ display: "grid", gap: 8 }}>
              {aktuel.valg.map((v, i) => {
                const erRigtig = valgt !== null && i === aktuel.rigtig;
                const erForkertValgt = valgt === i && i !== aktuel.rigtig;
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => vaelg(i)}
                    disabled={valgt !== null}
                    style={{
                      ...knapBase,
                      cursor: valgt !== null ? "default" : "pointer",
                      borderColor: erRigtig ? "var(--kaerne-sage-deep)" : erForkertValgt ? "var(--kaerne-terracotta)" : "var(--kaerne-border)",
                      background: erRigtig ? "#f1f8f0" : erForkertValgt ? "#fdf0e7" : "#fff",
                      boxShadow: erRigtig ? "0 0 0 1px var(--kaerne-sage-deep)" : "none",
                    }}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
            {valgt !== null && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--kaerne-ink-soft)", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", borderRadius: 12, padding: "11px 14px" }}>
                  <strong style={{ color: valgt === aktuel.rigtig ? "var(--kaerne-sage-deep)" : "var(--kaerne-terracotta-deep)" }}>
                    {valgt === aktuel.rigtig ? "Rigtigt. " : "Ikke helt. "}
                  </strong>
                  {aktuel.fakta}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
                  <button type="button" onClick={() => spoergAstrid(aktuel.prompt)} className="cursor-pointer" style={{ fontSize: 12.5, padding: "8px 14px", borderRadius: 999, border: "0.5px solid var(--kaerne-border)", background: "#fff", color: "var(--kaerne-ink-soft)" }}>
                    Spørg Astrid hvorfor →
                  </button>
                  <button type="button" onClick={videre} className="cursor-pointer" style={{ fontSize: 13.5, fontWeight: 600, padding: "8px 20px", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", boxShadow: "0 4px 12px rgba(217,102,55,.3)" }}>
                    {idx < sp.length - 1 ? "Næste spørgsmål" : "Se resultat"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "var(--kaerne-ink)", marginBottom: 4 }}>
              {score} af {sp.length} rigtige
            </div>
            <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--kaerne-ink-soft)", maxWidth: 420, margin: "0 auto 10px" }}>
              {score === sp.length
                ? "Flot, kollega. Fagligheden sidder lige i skabet i dag."
                : score >= 2
                ? "Godt gået. Kig forklaringerne igennem, så sidder det fast."
                : "Helt fint, det er det, quizzen er til. Spørg Astrid, hvis du vil have det uddybet."}
            </div>
            {streak > 0 && (
              <div style={{ display: "inline-block", fontSize: 12.5, color: "var(--kaerne-terracotta-deep)", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", borderRadius: 999, padding: "6px 14px", marginBottom: 6 }}>
                {streak === 1 ? "Dag 1 i træk - kom igen i morgen" : streak + " dage i træk"}
              </div>
            )}
            <div style={{ fontSize: 12.5, color: "var(--kaerne-muted)", marginTop: 6 }}>Nye spørgsmål i morgen. Din streak gemmes kun i din browser.</div>
          </div>
        )}
      </div>
    </div>
  );
}
