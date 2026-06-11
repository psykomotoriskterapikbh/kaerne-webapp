"use client";

import { useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { dagensSporgsmal, opdaterStreak } from "@/components/ParagrafQuiz";
import type { QuizQ } from "@/components/ParagrafQuiz";

/* Dagens faglige quiz som en del af Astrid-orben:
   Astrid "siger" sporgsmaalet i en taleboble, og svarene svaever
   som interaktive glas-bobler under hende. Pop en boble for at svare.
   Respekterer prefers-reduced-motion (boblerne ligger saa stille). */

const bobleGlas: React.CSSProperties = {
  display: "block", width: "100%", textAlign: "center", cursor: "pointer",
  border: "0.5px solid var(--kaerne-border)",
  background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,.95), rgba(253,242,236,.88) 55%, rgba(247,232,214,.85))",
  borderRadius: 999, padding: "10px 16px", fontSize: 13, lineHeight: 1.4,
  color: "var(--kaerne-ink)", boxShadow: "0 4px 14px rgba(90,80,72,.1), inset 0 1px 0 rgba(255,255,255,.9)",
  backdropFilter: "blur(4px)", transition: "transform .15s ease, border-color .15s ease, box-shadow .15s ease",
};

export default function AstridQuizBobler() {
  const [aaben, setAaben] = useState(false);
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
      setFaerdig(true);
      setStreak(opdaterStreak());
      if (score === sp.length) fireConfetti();
    }
  };

  const spoergAstrid = (p: string) => {
    try {
      window.dispatchEvent(new CustomEvent("astrid:ask", { detail: p }));
    } catch {}
  };

  const nulstil = () => { setAaben(false); setIdx(0); setValgt(null); setScore(0); setFaerdig(false); };

  return (
    <div style={{ width: "100%", maxWidth: 260, margin: "2px auto 0", position: "relative" }}>
      <style>{[
        "@keyframes kqb-flyd{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}",
        ".kqb-bob{animation:kqb-flyd 3.4s ease-in-out infinite}",
        ".kqb-bob2{animation:kqb-flyd 4.1s ease-in-out .6s infinite}",
        ".kqb-bob3{animation:kqb-flyd 3.8s ease-in-out 1.1s infinite}",
        ".kqb-pop:hover{transform:scale(1.045);border-color:var(--kaerne-terracotta);box-shadow:0 6px 18px rgba(217,102,55,.18), inset 0 1px 0 rgba(255,255,255,.9)}",
        "@media (prefers-reduced-motion: reduce){.kqb-bob,.kqb-bob2,.kqb-bob3{animation:none}}",
      ].join("")}</style>

      {!aaben ? (
        <button type="button" onClick={() => setAaben(true)} className="kqb-bob kqb-pop" style={{ ...bobleGlas, marginTop: 4 }} aria-label="Åbn dagens faglige quiz">
          <span style={{ color: "var(--kaerne-terracotta)", marginRight: 6 }} aria-hidden="true">&#10022;</span>
          <strong style={{ fontWeight: 600 }}>Dagens faglige quiz</strong>
          <span style={{ display: "block", fontSize: 11, color: "var(--kaerne-muted)", marginTop: 1 }}>3 hurtige &middot; nye hver dag</span>
        </button>
      ) : (
        <div>
          {/* taleboble fra orben */}
          <div style={{ position: "relative", background: "#fff", border: "0.5px solid var(--kaerne-border)", borderRadius: 16, padding: "12px 14px", boxShadow: "0 3px 12px rgba(90,80,72,.08)" }}>
            <span aria-hidden="true" style={{ position: "absolute", top: -6, left: "50%", width: 12, height: 12, background: "#fff", borderLeft: "0.5px solid var(--kaerne-border)", borderTop: "0.5px solid var(--kaerne-border)", transform: "translateX(-50%) rotate(45deg)" }} />
            {!faerdig ? (
              <>
                <div style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--kaerne-sage)", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Dagens quiz &middot; {idx + 1}/{sp.length}</span>
                  <button type="button" onClick={nulstil} aria-label="Luk quizzen" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--kaerne-muted)", fontSize: 13, lineHeight: 1, padding: 2 }}>&times;</button>
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 14.5, lineHeight: 1.45, color: "var(--kaerne-ink)" }}>{aktuel.q}</div>
                {valgt !== null && (
                  <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.55, color: "var(--kaerne-ink-soft)", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", borderRadius: 10, padding: "8px 10px" }}>
                    <strong style={{ color: valgt === aktuel.rigtig ? "var(--kaerne-sage-deep)" : "var(--kaerne-terracotta-deep)" }}>
                      {valgt === aktuel.rigtig ? "Rigtigt. " : "Ikke helt. "}
                    </strong>
                    {aktuel.fakta}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--kaerne-ink)" }}>{score} af {sp.length} rigtige</div>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--kaerne-ink-soft)", marginTop: 3 }}>
                  {score === sp.length ? "Flot, kollega. Den sidder lige i skabet." : score >= 2 ? "Godt gået. I morgen er der nye." : "Helt fint. Spørg mig, hvis du vil have det uddybet."}
                </div>
                {streak > 0 && (
                  <div style={{ display: "inline-block", fontSize: 11, color: "var(--kaerne-terracotta-deep)", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", borderRadius: 999, padding: "4px 10px", marginTop: 7 }}>
                    {streak === 1 ? "Dag 1 i træk" : streak + " dage i træk"}
                  </div>
                )}
                <button type="button" onClick={nulstil} style={{ display: "block", margin: "9px auto 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 11.5, color: "var(--kaerne-muted)", textDecoration: "underline" }}>Luk</button>
              </div>
            )}
          </div>

          {/* svar-bobler */}
          {!faerdig && valgt === null && (
            <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
              {aktuel.valg.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => vaelg(i)}
                  className={["kqb-bob", "kqb-bob2", "kqb-bob3"][i % 3] + " kqb-pop"}
                  style={{ ...bobleGlas, marginLeft: i % 2 === 0 ? 0 : 14, marginRight: i % 2 === 0 ? 14 : 0, width: "auto" }}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* handlinger efter svar */}
          {!faerdig && valgt !== null && (
            <div style={{ display: "flex", gap: 7, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={() => spoergAstrid(aktuel.prompt)} className="kqb-pop" style={{ ...bobleGlas, width: "auto", padding: "7px 13px", fontSize: 11.5 }}>
                Spørg Astrid hvorfor &rarr;
              </button>
              <button type="button" onClick={videre} style={{ border: "none", cursor: "pointer", borderRadius: 999, padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg,#ef9355,#d96637)", boxShadow: "0 4px 12px rgba(217,102,55,.3)" }}>
                {idx < sp.length - 1 ? "Næste" : "Resultat"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
