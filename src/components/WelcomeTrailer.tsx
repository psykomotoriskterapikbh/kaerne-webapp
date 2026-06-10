"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ORB = "https://media.glif.app/i:r/c_limit,w_1200/f_auto/q_auto/fucn4fhdx5txpp7ddqre";

type Step = { find?: string; input?: boolean; title: string; text: string; cta?: string };

const STEPS: Step[] = [
  { title: "Mød Astrid", text: "Din digitale kollega i socialforvaltningen. Tag en hurtig rundvisning." },
  { find: "Diktér", title: "Diktér med stemmen", text: "Tal i stedet for at skrive. Brug kun anonym tekst." },
  { find: "Anonymisér", title: "Anonymisér med ét klik", text: "Fjerner CPR, telefon, e-mail og adresse fra teksten." },
  { find: "Min profil", title: "Gør Astrid personlig", text: "Fortæl hvem du er, så svarene rammer din rolle og kommune." },
  { find: "Mine samtaler", title: "Gem dine samtaler", text: "Gem en samtale, og find den frem igen senere." },
  { input: true, title: "Skriv en sag", text: "Beskriv en sag anonymt, så får du faglig vurdering, de rette paragraffer og næste skridt.", cta: "Prøv det nu" },
];

function findEl(s: Step): HTMLElement | null {
  if (typeof document === "undefined") return null;
  if (s.input) return document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLElement | null;
  if (s.find) {
    const btns = Array.from(document.querySelectorAll("button")) as HTMLElement[];
    return btns.find((b) => (b.textContent || "").trim().includes(s.find as string)) || null;
  }
  return null;
}

export default function WelcomeTrailer() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem("astrid_intro_seen") === "1"; } catch {}
    if (!seen) { const t = setTimeout(() => setPrompt(true), 900); return () => clearTimeout(t); }
  }, []);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, []);

  useEffect(() => {
    if (!open) return;
    const s = STEPS[step];
    const el = s.input || s.find ? findEl(s) : null;
    targetRef.current = el;
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "center" });
      const raf = requestAnimationFrame(() => { measure(); requestAnimationFrame(measure); });
      const t1 = setTimeout(measure, 140);
      const t2 = setTimeout(measure, 320);
      return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
    } else {
      setRect(null);
    }
  }, [open, step, measure]);

  useEffect(() => {
    if (!open) return;
    const h = () => measure();
    window.addEventListener("resize", h);
    window.addEventListener("scroll", h, true);
    return () => { window.removeEventListener("resize", h); window.removeEventListener("scroll", h, true); };
  }, [open, measure]);

  useEffect(() => {
    if (!open || step === STEPS.length - 1) return;
    if (timer.current) clearTimeout(timer.current);
    const dur = step === 0 ? 3400 : 5000;
    timer.current = setTimeout(() => { setStep((v) => Math.min(STEPS.length - 1, v + 1)); }, dur);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [open, step]);

  const markSeen = () => { try { localStorage.setItem("astrid_intro_seen", "1"); } catch {} };
  const start = () => { markSeen(); setPrompt(false); setStep(0); setOpen(true); };
  const skip = () => { markSeen(); setPrompt(false); };
  const close = () => { if (timer.current) clearTimeout(timer.current); setOpen(false); setStep(0); };
  const focusInput = () => { const el = document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLInputElement | null; el?.focus(); el?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const proev = () => { close(); setTimeout(focusInput, 320); };

  const s = STEPS[step];
  const last = step === STEPS.length - 1;
  const isOrb = step === 0;
  const PAD = 8;

  let tip: React.CSSProperties = {};
  if (rect && typeof window !== "undefined") {
    const below = rect.y + rect.h + 210 < window.innerHeight;
    const cx = Math.max(180, Math.min(rect.x + rect.w / 2, window.innerWidth - 180));
    tip = below
      ? { top: rect.y + rect.h + 18, left: cx, transform: "translateX(-50%)" }
      : { top: Math.max(18, rect.y - 18), left: cx, transform: "translate(-50%,-100%)" };
  }

  return (
    <>
      <button type="button" onClick={() => { setStep(0); setOpen(true); }} aria-label="Se intro til Astrid"
        style={{ position: "fixed", right: 18, bottom: 18, zIndex: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 999, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg,#ef9355,#d96637)", boxShadow: "0 6px 20px rgba(217,102,55,.42)" }}>
        <span aria-hidden="true">▶</span> Intro
      </button>

      {prompt && !open && (
        <div style={{ position: "fixed", right: 18, bottom: 70, zIndex: 901, width: 290, background: "#fff", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 18, padding: "18px 18px 16px", boxShadow: "0 18px 50px rgba(120,92,67,.24)" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--kaerne-ink,#2c2824)", marginBottom: 4 }}>Hej, velkommen 👋</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--kaerne-ink-soft,#5f5648)", marginBottom: 14 }}>Skal jeg give dig en hurtig rundvisning i Astrid?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" onClick={start} style={{ flex: 1, padding: "10px", borderRadius: 11, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Ja, vis mig</button>
            <button type="button" onClick={skip} style={{ padding: "10px 14px", borderRadius: 11, border: "0.5px solid var(--kaerne-border,#d8c6a8)", cursor: "pointer", background: "#fff", color: "var(--kaerne-ink-soft,#5f5648)", fontSize: 13.5 }}>Senere</button>
          </div>
        </div>
      )}

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100 }}>
          {isOrb || !rect ? (
            <div onClick={() => { if (!isOrb) setStep((v) => Math.min(STEPS.length - 1, v + 1)); }} style={{ position: "absolute", inset: 0, background: "rgba(18,15,24,0.82)", backdropFilter: "blur(4px)" }} />
          ) : (
            <div style={{ position: "absolute", top: rect.y - PAD, left: rect.x - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2, borderRadius: 16, boxShadow: "0 0 0 9999px rgba(18,15,24,0.80), 0 0 0 3px #ef9355, 0 0 30px rgba(239,147,85,.75)", transition: "all .45s cubic-bezier(.4,0,.2,1)", pointerEvents: "none" }} />
          )}

          <button type="button" onClick={close} aria-label="Luk" style={{ position: "absolute", top: 18, right: 20, zIndex: 5, background: "rgba(255,255,255,.14)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 22, cursor: "pointer" }}>×</button>

          {isOrb && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
              <div style={{ position: "relative", width: 220, height: 220, marginBottom: 26 }}>
                <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: "radial-gradient(circle, rgba(246,200,150,.55), transparent 70%)", filter: "blur(8px)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: "url(" + ORB + ")", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 0 80px rgba(243,179,107,.55)" }} />
              </div>
              <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#ef9355", fontWeight: 700, marginBottom: 12 }}>Velkommen</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 56, color: "#fff", lineHeight: 1.05 }}>Mød Astrid</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,.8)", marginTop: 10, maxWidth: 440 }}>Din digitale kollega i socialforvaltningen. Tag en hurtig rundvisning.</div>
              <button type="button" onClick={() => setStep(1)} style={{ marginTop: 26, padding: "12px 26px", borderRadius: 999, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15 }}>Start rundvisning →</button>
              <button type="button" onClick={close} style={{ marginTop: 12, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13 }}>Spring over</button>
            </div>
          )}

          {!isOrb && rect && (
            <div style={{ position: "absolute", zIndex: 6, width: 320, maxWidth: "86vw", background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 20px 50px rgba(0,0,0,.4)", ...tip }}>
              <div style={{ fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--kaerne-terracotta-deep,#8f4327)", fontWeight: 700, marginBottom: 6 }}>{step} / {STEPS.length - 1}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-ink,#2c2824)", marginBottom: 5 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--kaerne-ink-soft,#5f5648)" }}>{s.text}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <button type="button" onClick={() => setStep((v) => Math.max(1, v - 1))} disabled={step <= 1} style={{ background: "none", border: "none", cursor: step <= 1 ? "default" : "pointer", color: step <= 1 ? "#cfc3b0" : "var(--kaerne-ink-soft,#5f5648)", fontSize: 13 }}>← Forrige</button>
                {last ? (
                  <button type="button" onClick={proev} style={{ padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>{s.cta || "Færdig"}</button>
                ) : (
                  <button type="button" onClick={() => setStep((v) => v + 1)} style={{ padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Næste →</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
