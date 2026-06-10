"use client";

import { useEffect, useRef, useState } from "react";

type Slide = {
  tag: string;
  title: string;
  text: string;
  kind: "orb" | "chat" | "jura" | "tools" | "tid" | "tryghed" | "cta";
  img?: string;
};

const SLIDES: Slide[] = [
  { tag: "Velkommen", title: "Mød Astrid", text: "Din digitale kollega i socialforvaltningen. Lad mig vise dig, hvad jeg kan, på et halvt minut.", kind: "orb" },
  { tag: "Sagssparring", title: "Få et reelt løsningsforslag", text: "Beskriv en sag anonymt. Du får en faglig vurdering, de rette paragraffer og næste skridt. Ikke bare spørgsmål tilbage.", kind: "chat" },
  { tag: "Jura og notater", title: "Jura og journalnotater på sekunder", text: "Barnets Lov og Serviceloven ved hånden. Lav løse noter om til et færdigt journalnotat.", kind: "jura" },
  { tag: "Værktøjer", title: "Værktøjer der letter hverdagen", text: "Diktér med stemmen, anonymisér med ét klik, upload en sag, og gem dine samtaler.", kind: "tools" },
  { tag: "Tid", title: "Fra timer til minutter", text: "Notater, oplæg og overblik på minutter, så din tid går til borgeren i stedet for dokumentation.", kind: "tid" },
  { tag: "Tryghed", title: "Trygt og fortroligt", text: "Automatisk CPR-blokering, intet gemmes på en server, og du bestemmer altid. Støtte, ikke skøn.", kind: "tryghed" },
  { tag: "Klar?", title: "Lad os komme i gang", text: "Skriv hvad du tumler med, eller vælg et emne. Jeg er klar.", kind: "cta" },
];

const ORB = "https://media.glif.app/i:r/c_limit,w_1200/f_auto/q_auto/fucn4fhdx5txpp7ddqre";

function focusInput() {
  try {
    const el = document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLInputElement | null;
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    // ignorér
  }
}

function Visual({ s }: { s: Slide }) {
  const box: React.CSSProperties = {
    width: "100%", height: 190, borderRadius: 18, display: "flex", alignItems: "center",
    justifyContent: "center", overflow: "hidden", position: "relative",
    border: "1px solid rgba(255,255,255,0.10)",
  };
  if (s.img) {
    return <div style={{ ...box, backgroundImage: "url(" + s.img + ")", backgroundSize: "cover", backgroundPosition: "center" }} />;
  }
  if (s.kind === "orb") {
    return (
      <div style={{ ...box, background: "radial-gradient(circle at 50% 45%, #2a2440, #16131f)" }}>
        <div style={{ width: 132, height: 132, borderRadius: "50%", backgroundImage: "url(" + ORB + ")", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 0 60px rgba(243,179,107,.55)" }} />
      </div>
    );
  }
  if (s.kind === "chat") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#1b1726,#241d33)", flexDirection: "column", gap: 9, padding: 18, alignItems: "stretch", justifyContent: "center" }}>
        <div style={{ alignSelf: "flex-end", background: "#e3794d", color: "#fff", padding: "8px 13px", borderRadius: "14px 14px 4px 14px", fontSize: 12.5, maxWidth: "78%" }}>Mor er ramt af angst, 9-årig passer lillebror. Hvad gør jeg?</div>
        <div style={{ alignSelf: "flex-start", background: "#fff", color: "#2c2824", padding: "8px 13px", borderRadius: "14px 14px 14px 4px", fontSize: 12.5, maxWidth: "82%" }}>Faglig vurdering, BL §20, §32 familiebehandling, og næste skridt med frister…</div>
      </div>
    );
  }
  if (s.kind === "jura") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#181a26,#1f2433)", gap: 10, padding: 16 }}>
        {["§20", "§32", "§85"].map((p, idx) => (
          <div key={p} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "14px 16px", color: "#f3d8a8", fontFamily: "var(--font-serif)", fontSize: 22, transform: "translateY(" + (idx === 1 ? -8 : 0) + "px)" }}>{p}</div>
        ))}
      </div>
    );
  }
  if (s.kind === "tools") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#16131f,#221b30)", flexWrap: "wrap", gap: 9, padding: 18 }}>
        {["🎙 Diktér", "⦸ Anonymisér", "⎙ Upload", "🗂 Samtaler", "☺ Profil"].map((t) => (
          <span key={t} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 999, padding: "7px 13px", fontSize: 12.5 }}>{t}</span>
        ))}
      </div>
    );
  }
  if (s.kind === "tid") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#1a1726,#2a2036)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 40, color: "#86bd8f" }}>timer til min.</div>
          <div style={{ color: "rgba(255,255,255,.6)", fontSize: 12.5, marginTop: 4 }}>mere tid hos borgeren</div>
        </div>
      </div>
    );
  }
  if (s.kind === "tryghed") {
    return (
      <div style={{ ...box, background: "linear-gradient(135deg,#13131f,#1d2230)" }}>
        <div style={{ fontSize: 64 }}>🛡️</div>
      </div>
    );
  }
  return (
    <div style={{ ...box, background: "radial-gradient(circle at 50% 40%, #2a2440, #15121d)" }}>
      <div style={{ fontFamily: "var(--font-script,cursive)", fontSize: 46, color: "#fff" }}>Astrid</div>
    </div>
  );
}

export default function WelcomeTrailer() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem("astrid_intro_seen") === "1"; } catch {}
    if (!seen) {
      const t = setTimeout(() => setPrompt(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setI((v) => {
        if (v >= SLIDES.length - 1) { if (timer.current) clearInterval(timer.current); return v; }
        return v + 1;
      });
    }, 5200);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [open]);

  const markSeen = () => { try { localStorage.setItem("astrid_intro_seen", "1"); } catch {} };
  const start = () => { markSeen(); setPrompt(false); setI(0); setOpen(true); };
  const skip = () => { markSeen(); setPrompt(false); };
  const close = () => { if (timer.current) clearInterval(timer.current); setOpen(false); };
  const komIgang = () => { close(); setTimeout(focusInput, 250); };

  const s = SLIDES[i];
  const last = i === SLIDES.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => { setI(0); setOpen(true); }}
        aria-label="Se intro til Astrid"
        style={{
          position: "fixed", right: 18, bottom: 18, zIndex: 900, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 999,
          border: "none", color: "#fff", fontSize: 13, fontWeight: 600,
          background: "linear-gradient(135deg,#ef9355,#d96637)", boxShadow: "0 6px 20px rgba(217,102,55,.42)",
        }}
      >
        <span aria-hidden="true">▶</span> Intro
      </button>

      {prompt && !open && (
        <div style={{ position: "fixed", right: 18, bottom: 70, zIndex: 901, width: 290, background: "#fff", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 18, padding: "18px 18px 16px", boxShadow: "0 18px 50px rgba(120,92,67,.24)" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--kaerne-ink,#2c2824)", marginBottom: 4 }}>Hej, velkommen 👋</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--kaerne-ink-soft,#5f5648)", marginBottom: 14 }}>Vil du se en hurtig intro til, hvad Astrid kan, og hvordan du bruger hende?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={start} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Ja, vis mig</button>
            <button type="button" onClick={skip} style={{ padding: "10px 14px", borderRadius: 11, border: "0.5px solid var(--kaerne-border,#d8c6a8)", cursor: "pointer", background: "#fff", color: "var(--kaerne-ink-soft,#5f5648)", fontSize: 13.5 }}>Senere</button>
          </div>
        </div>
      )}

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 18, background: "rgba(18,15,24,0.72)", backdropFilter: "blur(6px)" }}
        >
          <div style={{ width: "100%", maxWidth: 560, background: "linear-gradient(160deg,#211b2e,#15121d)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 24, padding: "22px 22px 20px", boxShadow: "0 30px 80px rgba(0,0,0,.5)", color: "#fff", position: "relative" }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
              {SLIDES.map((_, k) => (
                <div key={k} style={{ flex: 1, height: 3, borderRadius: 3, background: k <= i ? "#ef9355" : "rgba(255,255,255,.16)", transition: "background .4s ease" }} />
              ))}
            </div>

            <button type="button" onClick={close} aria-label="Luk" style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "rgba(255,255,255,.55)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>

            <div style={{ fontSize: 12, letterSpacing: ".18em", textTransform: "uppercase", color: "#ef9355", fontWeight: 600, marginBottom: 12 }}>{s.tag}</div>

            <Visual s={s} />

            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 400, margin: "18px 0 8px", lineHeight: 1.15 }}>{s.title}</h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,255,255,.78)", margin: 0, minHeight: 46 }}>{s.text}</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
              <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.7)", cursor: i === 0 ? "default" : "pointer", fontSize: 13.5 }}>← Tilbage</button>

              <div style={{ display: "flex", gap: 6 }}>
                {SLIDES.map((_, k) => (
                  <button key={k} type="button" aria-label={"Slide " + (k + 1)} onClick={() => setI(k)} style={{ width: 7, height: 7, borderRadius: "50%", border: "none", cursor: "pointer", background: k === i ? "#ef9355" : "rgba(255,255,255,.25)" }} />
                ))}
              </div>

              {last ? (
                <button type="button" onClick={komIgang} style={{ padding: "10px 18px", borderRadius: 999, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Kom i gang →</button>
              ) : (
                <button type="button" onClick={() => setI((v) => Math.min(SLIDES.length - 1, v + 1))} style={{ padding: "9px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", cursor: "pointer", background: "rgba(255,255,255,.06)", color: "#fff", fontSize: 13.5 }}>Næste →</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
