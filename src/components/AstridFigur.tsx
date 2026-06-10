"use client";

import { useEffect, useState } from "react";

const ORB =
  "https://media.glif.app/i:r/c_limit,w_1200/f_auto/q_auto/fucn4fhdx5txpp7ddqre";

const IDLE = [
  "§20: 4 mdr. frist ⏳", "Barnet i midten.", "Officialprincippet, husk det.",
  "Anonymisér først 👀", "Skriv notatet nu 📝", "Du bestemmer — jeg støtter ♡",
  "Tjek tilsynsrapporten 👀", "Børnesamtalen før afgørelsen.", "Partshøring før afgørelse.",
  "En klar handleplan letter alt.", "Underret hellere for tidligt.", "Jeg holder hovedet koldt.",
  "Tag den svære samtale tidligt.", "Jeg er på din side ♡", "Hvad ligger der på dit bord?",
];
const THINKING = ["Tænker med…", "Et øjeblik…", "Slår det op…", "Regner på det…", "Lige et sek…"];
const TYPING = ["Jeg lytter…", "Fortæl løs…", "Mhm…", "Jeg er klar.", "Ja, fortsæt…"];

type Props = { loading?: boolean; typing?: boolean; chatActive?: boolean };

export default function AstridFigur({ loading, typing }: Props) {
  const [idx, setIdx] = useState(0);
  const [quip, setQuip] = useState<string>(IDLE[0]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % IDLE.length), 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (loading) { setQuip(THINKING[Math.floor(Math.random() * THINKING.length)]); return; }
    if (typing) { setQuip(TYPING[Math.floor(Math.random() * TYPING.length)]); return; }
    setQuip(IDLE[idx]);
  }, [loading, typing, idx]);

  const cls = "astrid-orb" + (loading ? " thinking" : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <div style={{ position: "relative", width: 150, height: 150 }}>
        <div style={{ position: "absolute", inset: -22, borderRadius: "50%", background: "radial-gradient(circle, rgba(246,200,150,.45), transparent 70%)", filter: "blur(6px)", pointerEvents: "none" }} />
        <div
          className={cls}
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            backgroundImage: "url(" + ORB + ")", backgroundSize: "cover", backgroundPosition: "center",
            boxShadow: "0 0 26px rgba(243,179,107,.5), inset 0 0 30px rgba(255,255,255,.08)",
          }}
        />
      </div>
      <div style={{ fontFamily: "var(--font-script, cursive)", fontSize: 30, color: "var(--kaerne-ink)", marginTop: 14, lineHeight: 1 }}>Astrid</div>
      <div style={{ fontSize: 10.5, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--kaerne-muted)", marginTop: 6 }}>Din digitale kollega</div>
      <div
        key={quip}
        className="astrid-quip"
        style={{ marginTop: 14, maxWidth: 200, minHeight: 20, fontSize: 12.5, lineHeight: 1.4, color: "var(--kaerne-ink-soft)", fontStyle: "italic" }}
      >
        {quip}
      </div>
    </div>
  );
}
