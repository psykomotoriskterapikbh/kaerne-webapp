"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ORB = "https://media.glif.app/i:r/c_limit,w_1200/f_auto/q_auto/fucn4fhdx5txpp7ddqre";

// ---- bløde lydeffekter (genereres, ingen filer) ----
let actx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!actx) actx = new AC();
    if (actx.state === "suspended") actx.resume();
    return actx;
  } catch { return null; }
}
function tone(freq: number, dur: number, vol: number, delay = 0) {
  const c = ac(); if (!c) return;
  try {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = "sine"; o.frequency.value = freq;
    const t0 = c.currentTime + delay;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + dur + 0.03);
  } catch {}
}
const sStep = () => tone(640, 0.13, 0.045);
const sOpen = () => { tone(523, 0.18, 0.05); tone(784, 0.22, 0.04, 0.08); };
const sDone = () => { tone(523, 0.2, 0.05); tone(659, 0.22, 0.045, 0.08); tone(784, 0.3, 0.05, 0.16); };

type Step =
  | { type: "orb" }
  | { type: "spot"; find?: string; input?: boolean; tag: string; title: string; text: string }
  | { type: "finish" };

const STEPS: Step[] = [
  { type: "orb" },
  { type: "spot", input: true, tag: "Spørg om alt", title: "Stil din sag, få svar på sekunder", text: "Beskriv en sag anonymt. Du får faglig vurdering, de rette paragraffer og næste skridt, ikke bare spørgsmål tilbage." },
  { type: "spot", find: "Find leverandør", tag: "Den rette indsats", title: "Find den rette leverandør", text: "Astrid foreslår indsats og leverandør, der matcher sagen og din kommune. Neutralt og fagligt." },
  { type: "spot", find: "Anonymisér", tag: "Tryghed", title: "Beskyt borgeren med ét klik", text: "Fjerner CPR, telefon, e-mail og adresse, før noget sendes. Du arbejder altid trygt." },
  { type: "spot", find: "Diktér", tag: "Endnu hurtigere", title: "Tal i stedet for at skrive", text: "Diktér sagen med stemmen, så går det lynhurtigt. Husk kun anonym tekst." },
  { type: "spot", find: "Upload sag", tag: "Spar tid", title: "Smid en hel sag ind", text: "Upload en anonym fil, så læser Astrid den og giver dig overblik og oplæg." },
  { type: "spot", find: "Min profil", tag: "Personligt", title: "Gør Astrid til din", text: "Fortæl hvem du er og hvilken kommune, så rammer svarene dig hver gang." },
  { type: "spot", find: "Mine samtaler", tag: "Altid ved hånden", title: "Gem dine samtaler", text: "Gem en samtale og find den frem igen, når du skal bruge den." },
  { type: "spot", find: "Dagens faglige quiz", tag: "Skarp på 2 minutter", title: "Tag dagens faglige quiz", text: "Tre hurtige spørgsmål om jura og metode, lige ved siden af Astrid. Nye hver dag, og du kan altid spørge hende hvorfor." },
  { type: "finish" },
];
const SPOT_TOTAL = STEPS.filter((s) => s.type === "spot").length;

function findEl(s: Step): HTMLElement | null {
  if (typeof document === "undefined" || s.type !== "spot") return null;
  if (s.input) return document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLElement | null;
  if (s.find) {
    const btns = Array.from(document.querySelectorAll("button")) as HTMLElement[];
    return btns.find((b) => (b.textContent || "").trim().includes(s.find as string)) || null;
  }
  return null;
}

export default function WelcomeTrailer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manual = useRef(false);

  const markSeen = () => { try { localStorage.setItem("astrid_intro_seen", "1"); } catch {} };

  // auto-åbn efter splash, første gang
  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem("astrid_intro_seen") === "1"; } catch {}
    if (seen) return;
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    const t = setTimeout(() => { markSeen(); setStep(0); setOpen(true); }, reduce ? 1200 : 5600);
    return () => clearTimeout(t);
  }, []);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
  }, []);

  useEffect(() => {
    if (!open) return;
    setRect(null);
    const s = STEPS[step];
    const el = findEl(s);
    targetRef.current = el;
    if (el) {
      el.scrollIntoView({ behavior: "auto", block: "center" });
      const raf = requestAnimationFrame(() => { measure(); requestAnimationFrame(measure); });
      const t1 = setTimeout(measure, 160);
      const t2 = setTimeout(measure, 360);
      return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); };
    } else {
      setRect(null);
      if (s.type === "spot") {
        const skip = setTimeout(() => setStep((v) => Math.min(STEPS.length - 1, v + 1)), 60);
        return () => clearTimeout(skip);
      }
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
    if (!open) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { if (timer.current) clearTimeout(timer.current); setOpen(false); setStep(0); }
      else if (e.key === "ArrowRight") { manual.current = true; setStep((v) => Math.min(STEPS.length - 1, v + 1)); }
      else if (e.key === "ArrowLeft") { manual.current = true; setStep((v) => Math.max(1, v - 1)); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  useEffect(() => {
    if (!open || manual.current || STEPS[step].type === "finish") return;
    if (timer.current) clearTimeout(timer.current);
    const dur = STEPS[step].type === "orb" ? 3800 : 5200;
    timer.current = setTimeout(() => { setStep((v) => { sStep(); return Math.min(STEPS.length - 1, v + 1); }); }, dur);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [open, step]);

  const openTour = () => { sOpen(); manual.current = false; setStep(0); setOpen(true); };
  const close = () => { if (timer.current) clearTimeout(timer.current); setOpen(false); setStep(0); };
  const next = () => { sStep(); manual.current = true; setStep((v) => Math.min(STEPS.length - 1, v + 1)); };
  const prev = () => { sStep(); manual.current = true; setStep((v) => Math.max(1, v - 1)); };
  const focusInput = () => { const el = document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLInputElement | null; el?.focus(); el?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const proev = () => { sDone(); close(); setTimeout(focusInput, 320); };

  const s = STEPS[step];
  const PAD = 8;
  const spotNo = STEPS.slice(0, step + 1).filter((x) => x.type === "spot").length;

  let tip: React.CSSProperties = {};
  if (rect && typeof window !== "undefined") {
    const below = rect.y + rect.h + 220 < window.innerHeight;
    const cx = Math.max(180, Math.min(rect.x + rect.w / 2, window.innerWidth - 180));
    tip = below
      ? { top: rect.y + rect.h + 18, left: cx, transform: "translateX(-50%)" }
      : { top: Math.max(18, rect.y - 18), left: cx, transform: "translate(-50%,-100%)" };
  }

  const Card = (children: React.ReactNode) => (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>{children}</div>
  );

  return (
    <>
      <button type="button" onClick={openTour} aria-label="Se hvad Astrid kan"
        style={{ position: "fixed", right: 18, bottom: 18, zIndex: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 999, border: "none", color: "#fff", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg,#ef9355,#d96637)", boxShadow: "0 6px 20px rgba(217,102,55,.42)" }}>
        <span aria-hidden="true">✦</span> Se hvad Astrid kan
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100 }}>
          {s.type === "spot" && rect ? (
            <div style={{ position: "absolute", top: rect.y - PAD, left: rect.x - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2, borderRadius: 16, boxShadow: "0 0 0 9999px rgba(18,15,24,0.80), 0 0 0 3px #ef9355, 0 0 30px rgba(239,147,85,.75)", transition: "top .3s ease, left .3s ease, width .3s ease, height .3s ease", pointerEvents: "none" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "rgba(18,15,24,0.86)", backdropFilter: "blur(4px)" }} />
          )}

          <button type="button" onClick={close} aria-label="Luk" style={{ position: "absolute", top: 18, right: 20, zIndex: 5, background: "rgba(255,255,255,.14)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 22, cursor: "pointer" }}>×</button>

          {s.type === "orb" && Card(
            <>
              <div style={{ position: "relative", width: 220, height: 220, marginBottom: 26 }}>
                <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: "radial-gradient(circle, rgba(246,200,150,.55), transparent 70%)", filter: "blur(8px)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: "url(" + ORB + ")", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 0 80px rgba(243,179,107,.55)" }} />
              </div>
              <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#ef9355", fontWeight: 700, marginBottom: 12 }}>Velkommen</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 56, color: "#fff", lineHeight: 1.05 }}>Mød Astrid</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,.82)", marginTop: 12, maxWidth: 480, lineHeight: 1.5 }}>Din digitale kollega, der klarer jura, notater og frister, så du kan bruge tiden hos borgeren.</div>
              <button type="button" onClick={() => { sStep(); setStep(1); }} style={{ marginTop: 28, padding: "13px 28px", borderRadius: 999, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15 }}>Vis mig rundt (30 sek) →</button>
              <button type="button" onClick={close} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13 }}>Spring over</button>
            </>
          )}

          {s.type === "finish" && Card(
            <>
              <div style={{ fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase", color: "#ef9355", fontWeight: 700, marginBottom: 14 }}>Det får du ud af det</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 48, color: "#fff", lineHeight: 1.1, maxWidth: 620 }}>Mere tid til det vigtige</div>
              <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                {["Jura og notater klaret på minutter", "Aldrig i tvivl om den rette paragraf", "Mere tid hos borgeren, mindre på papir"].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 17, color: "rgba(255,255,255,.9)" }}>
                    <span style={{ color: "#86bd8f", fontSize: 20 }}>✓</span> {b}
                  </div>
                ))}
              </div>
              <button type="button" onClick={proev} style={{ marginTop: 30, padding: "13px 30px", borderRadius: 999, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 16 }}>Prøv det nu, det er gratis →</button>
              <button type="button" onClick={close} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13 }}>Luk</button>
            </>
          )}

          {s.type === "spot" && rect && (
            <div style={{ position: "absolute", zIndex: 6, width: 330, maxWidth: "86vw", background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 20px 50px rgba(0,0,0,.4)", ...tip }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ fontSize: 11, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--kaerne-terracotta-deep,#8f4327)", fontWeight: 700 }}>{s.tag}</span>
                <span style={{ fontSize: 11.5, color: "var(--kaerne-muted,#8a7a66)" }}>{spotNo} / {SPOT_TOTAL}</span>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-ink,#2c2824)", marginBottom: 5, lineHeight: 1.2 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--kaerne-ink-soft,#5f5648)" }}>{s.text}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <button type="button" onClick={prev} disabled={step <= 1} style={{ background: "none", border: "none", cursor: step <= 1 ? "default" : "pointer", color: step <= 1 ? "#cfc3b0" : "var(--kaerne-ink-soft,#5f5648)", fontSize: 13 }}>← Forrige</button>
                <button type="button" onClick={next} style={{ padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Næste →</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
