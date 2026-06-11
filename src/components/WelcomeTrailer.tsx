"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/lib/confetti";

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

// ---- blid baggrundsmusik (genereres live, ingen filer) ----
let musikStop: (() => void) | null = null;

function startMusik() {
  if (musikStop) return; // spiller allerede
  const c = ac(); if (!c) return;
  try {
    const master = c.createGain();
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.linearRampToValueAtTime(0.05, c.currentTime + 2.5);
    master.connect(c.destination);

    // bloed syntetiseret rumklang
    const conv = c.createConvolver();
    const len = Math.floor(c.sampleRate * 2.0);
    const ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
    }
    conv.buffer = ir;
    const wet = c.createGain(); wet.gain.value = 0.5; conv.connect(wet); wet.connect(master);
    const send = (g: GainNode) => { g.connect(master); g.connect(conv); };

    // rolig akkordrunde i F-dur: F - Dm - Bb - C
    const AKKORDER = [
      [174.61, 220.0, 261.63, 349.23],
      [146.83, 220.0, 293.66, 349.23],
      [116.54, 174.61, 233.08, 293.66],
      [130.81, 196.0, 261.63, 329.63],
    ];
    let trin = 0;
    const spilAkkord = () => {
      const t0 = c.currentTime;
      AKKORDER[trin % AKKORDER.length].forEach((f, i) => {
        const o = c.createOscillator(); o.type = "triangle"; o.frequency.value = f;
        const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 850; lp.Q.value = 0.5;
        const g = c.createGain();
        const top = i === 3 ? 0.10 : 0.16;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(top, t0 + 1.8);
        g.gain.setValueAtTime(top, t0 + 3.6);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 5.6);
        o.connect(lp); lp.connect(g); send(g);
        o.start(t0); o.stop(t0 + 5.8);
      });
      trin++;
    };
    spilAkkord();
    const akkordId = setInterval(spilAkkord, 4800);

    // sarte klokketoner (F-pentatont droes)
    const TONER = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 1046.5];
    const klokke = () => {
      if (Math.random() > 0.72) return;
      const f = TONER[Math.floor(Math.random() * TONER.length)];
      const t0 = c.currentTime + Math.random() * 0.6;
      [1, 2].forEach((mult, k) => {
        const o = c.createOscillator(); o.type = "sine"; o.frequency.value = f * mult;
        const g = c.createGain(); const top = k === 0 ? 0.05 : 0.013;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(top, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);
        o.connect(g); send(g);
        o.start(t0); o.stop(t0 + 2.5);
      });
    };
    const klokkeId = setInterval(klokke, 2100);

    musikStop = () => {
      musikStop = null;
      clearInterval(akkordId); clearInterval(klokkeId);
      try {
        master.gain.cancelScheduledValues(c.currentTime);
        master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), c.currentTime);
        master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.0);
      } catch {}
      setTimeout(() => { try { master.disconnect(); conv.disconnect(); } catch {} }, 1200);
    };
  } catch {}
}
function stopMusik() { if (musikStop) musikStop(); }

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

function TypeTekst({ tekst }: { tekst: string }) {
  const [n, setN] = useState(tekst.length);
  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    if (reduce) { setN(tekst.length); return; }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= tekst.length) { clearInterval(id); return v; }
        return v + 2;
      });
    }, 16);
    return () => clearInterval(id);
  }, [tekst]);
  const faerdig = n >= tekst.length;
  return (
    <span>
      {tekst.slice(0, n)}
      {!faerdig && <span className="wt-caret" aria-hidden="true" />}
    </span>
  );
}

export default function WelcomeTrailer() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manual = useRef(false);
  const [musik, setMusik] = useState(true);

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
      if (e.key === "Escape") { if (timer.current) clearTimeout(timer.current); stopMusik(); setOpen(false); setStep(0); }
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

  useEffect(() => {
    if (open && STEPS[step].type === "finish") { try { fireConfetti(); } catch {} }
  }, [open, step]);

  const openTour = () => { sOpen(); manual.current = false; setStep(0); setOpen(true); if (musik) startMusik(); };
  const close = () => { if (timer.current) clearTimeout(timer.current); stopMusik(); setOpen(false); setStep(0); };
  const next = () => { sStep(); manual.current = true; if (musik) startMusik(); setStep((v) => Math.min(STEPS.length - 1, v + 1)); };
  const prev = () => { sStep(); manual.current = true; setStep((v) => Math.max(1, v - 1)); };
  const focusInput = () => { const el = document.querySelector('input[aria-label="Skriv til Astrid"]') as HTMLInputElement | null; el?.focus(); el?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const proev = () => { sDone(); close(); setTimeout(focusInput, 320); };
  const skiftMusik = () => { setMusik((m) => { const ny = !m; if (ny) startMusik(); else stopMusik(); return ny; }); };

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

  const PARTIKLER = [8, 22, 37, 55, 68, 81, 93, 14, 46, 74, 60, 30];
  const fjedring = "cubic-bezier(.22,1,.36,1)";

  return (
    <>
      <style>{[
        "@keyframes wt-in{0%{opacity:0;transform:translateY(16px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}",
        "@keyframes wt-pop{0%{opacity:0;transform:translateY(12px) scale(.94)}100%{opacity:1;transform:translateY(0) scale(1)}}",
        "@keyframes wt-halo{0%,100%{box-shadow:0 0 0 2.5px rgba(239,147,85,.95),0 0 22px rgba(239,147,85,.5)}50%{box-shadow:0 0 0 6px rgba(239,147,85,.45),0 0 52px rgba(239,147,85,.9)}}",
        "@keyframes wt-ring{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
        "@keyframes wt-sv{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}",
        "@keyframes wt-part{0%{transform:translateY(20px) scale(.6);opacity:0}15%{opacity:.95}70%{opacity:.55}100%{transform:translateY(-150px) scale(1.1);opacity:0}}",
        "@keyframes wt-skin{0%{background-position:-220% 0}100%{background-position:220% 0}}",
        ".wt-fab{animation:wt-sv 4.4s ease-in-out infinite;transition:transform .25s cubic-bezier(.2,.9,.3,1.35),box-shadow .25s ease}",
        ".wt-fab:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 12px 32px rgba(217,102,55,.55)}",
        ".wt-cta{transition:transform .22s cubic-bezier(.2,.9,.3,1.35),box-shadow .22s ease}",
        ".wt-cta:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 14px 36px rgba(217,102,55,.5)}",
        ".wt-card{animation:wt-pop .42s cubic-bezier(.2,.9,.3,1.12) both}",
        ".wt-spot{animation:wt-halo 2.3s ease-in-out infinite}",
        ".wt-luk{transition:transform .25s ease,background .25s ease}",
        ".wt-luk:hover{transform:rotate(90deg) scale(1.08);background:rgba(255,255,255,.26)}",
        ".wt-shimmer{background:linear-gradient(110deg,#fff 38%,#ffd2a8 50%,#fff 62%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:wt-skin 4.6s linear infinite}",
        "@keyframes wt-scan{0%{top:-6%;opacity:0}12%{opacity:.95}88%{opacity:.95}100%{top:103%;opacity:0}}",
        "@keyframes wt-hudind{0%{opacity:0;transform:scale(1.3)}100%{opacity:1;transform:scale(1)}}",
        "@keyframes wt-aur{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(180deg) scale(1.18)}100%{transform:rotate(360deg) scale(1)}}",
        "@keyframes wt-orbit{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}",
        "@keyframes wt-blink{0%,100%{opacity:1}50%{opacity:.2}}",
        ".wt-hud{animation:wt-hudind .5s cubic-bezier(.2,.9,.3,1.25) both}",
        ".wt-caret{display:inline-block;width:7px;height:.95em;vertical-align:-2px;border-radius:1px;background:#d96637;margin-left:3px;animation:wt-blink .75s steps(1) infinite}",
        "@media (prefers-reduced-motion: reduce){.wt-fab,.wt-spot,.wt-card,.wt-shimmer,.wt-anim,.wt-prt,.wt-hud,.wt-scan,.wt-caret{animation:none !important}}",
      ].join("")}</style>

      <button type="button" onClick={openTour} aria-label="Se hvad Astrid kan" className="wt-fab"
        style={{ position: "fixed", right: 18, bottom: 18, zIndex: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 999, border: "0.5px solid rgba(255,255,255,.35)", color: "#fff", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg,#ef9355,#d96637)", boxShadow: "0 6px 20px rgba(217,102,55,.42), inset 0 1px 0 rgba(255,255,255,.35)" }}>
        <span aria-hidden="true">&#10022;</span> Se hvad Astrid kan
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1100 }}>
          {s.type === "spot" && rect ? (
            <>
              <div onClick={next} aria-hidden="true" style={{ position: "absolute", inset: 0, cursor: "pointer" }} />
              <div style={{ position: "absolute", top: rect.y - PAD, left: rect.x - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2, borderRadius: 18, boxShadow: "0 0 0 9999px rgba(16,12,22,0.82)", transition: "top .45s " + fjedring + ", left .45s " + fjedring + ", width .45s " + fjedring + ", height .45s " + fjedring, pointerEvents: "none" }} />
              <div className="wt-spot" style={{ position: "absolute", top: rect.y - PAD, left: rect.x - PAD, width: rect.w + PAD * 2, height: rect.h + PAD * 2, borderRadius: 18, transition: "top .45s " + fjedring + ", left .45s " + fjedring + ", width .45s " + fjedring + ", height .45s " + fjedring, pointerEvents: "none" }} />
              <div key={"hud" + step} className="wt-hud" aria-hidden="true" style={{ position: "absolute", top: rect.y - PAD - 7, left: rect.x - PAD - 7, width: rect.w + PAD * 2 + 14, height: rect.h + PAD * 2 + 14, transition: "top .45s " + fjedring + ", left .45s " + fjedring + ", width .45s " + fjedring + ", height .45s " + fjedring, pointerEvents: "none" }}>
                {[0, 1, 2, 3].map((h) => (
                  <span key={h} style={{ position: "absolute", width: 17, height: 17, borderColor: "rgba(255,217,176,.95)", borderStyle: "solid", borderWidth: 0, filter: "drop-shadow(0 0 6px rgba(239,147,85,.8))", top: h < 2 ? 0 : undefined, bottom: h >= 2 ? 0 : undefined, left: h % 2 === 0 ? 0 : undefined, right: h % 2 === 1 ? 0 : undefined, borderTopWidth: h < 2 ? 2 : 0, borderBottomWidth: h >= 2 ? 2 : 0, borderLeftWidth: h % 2 === 0 ? 2 : 0, borderRightWidth: h % 2 === 1 ? 2 : 0, borderTopLeftRadius: h === 0 ? 9 : 0, borderTopRightRadius: h === 1 ? 9 : 0, borderBottomLeftRadius: h === 2 ? 9 : 0, borderBottomRightRadius: h === 3 ? 9 : 0 }} />
                ))}
                <div style={{ position: "absolute", inset: 7, borderRadius: 16, overflow: "hidden" }}>
                  <div className="wt-scan" key={"scan" + step} style={{ position: "absolute", left: 0, right: 0, height: 2, top: "-6%", background: "linear-gradient(90deg, transparent, rgba(255,228,195,.95), transparent)", boxShadow: "0 0 14px rgba(239,147,85,.85)", animation: "wt-scan 1.5s ease-in-out .25s 1 both" }} />
                </div>
              </div>
            </>
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 50% 38%, rgba(28,20,34,0.84) 0%, rgba(14,10,20,0.92) 100%)", backdropFilter: "blur(6px)" }} />
          )}

          {(s.type === "orb" || s.type === "finish") && (
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
              <div className="wt-anim" style={{ position: "absolute", inset: "-25%", background: "radial-gradient(42% 36% at 30% 36%, rgba(239,147,85,.17), transparent 70%), radial-gradient(38% 32% at 72% 62%, rgba(134,189,143,.13), transparent 70%), radial-gradient(30% 26% at 56% 22%, rgba(247,186,160,.12), transparent 70%)", filter: "blur(34px)", animation: "wt-aur 26s linear infinite" }} />
              {PARTIKLER.map((x, i) => (
                <span key={i} className="wt-prt" style={{ position: "absolute", left: x + "%", bottom: "26%", width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3, borderRadius: "50%", background: i % 4 === 0 ? "rgba(255,214,170,.95)" : "rgba(255,244,225,.8)", filter: "blur(.4px)", animation: "wt-part " + (4.6 + (i % 5)) + "s linear " + (i * 0.65) + "s infinite" }} />
              ))}
            </div>
          )}

          <button type="button" onClick={skiftMusik} aria-label={musik ? "Sluk musik" : "Taend musik"} title={musik ? "Sluk musik" : "Tænd musik"} style={{ position: "absolute", top: 18, right: 70, zIndex: 5, background: "rgba(255,255,255,.14)", border: "0.5px solid rgba(255,255,255,.25)", backdropFilter: "blur(6px)", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 16, cursor: "pointer", opacity: musik ? 1 : 0.5, textDecoration: musik ? "none" : "line-through" }}>&#9834;</button>
          <button type="button" onClick={close} aria-label="Luk" className="wt-luk" style={{ position: "absolute", top: 18, right: 20, zIndex: 5, background: "rgba(255,255,255,.14)", border: "0.5px solid rgba(255,255,255,.25)", backdropFilter: "blur(6px)", color: "#fff", width: 40, height: 40, borderRadius: "50%", fontSize: 22, cursor: "pointer" }}>&times;</button>

          {s.type === "orb" && Card(
            <>
              <div className="wt-anim" style={{ position: "relative", width: 226, height: 226, marginBottom: 28, animation: "wt-in .7s " + fjedring + " both" }}>
                <div style={{ position: "absolute", inset: -64, borderRadius: "50%", background: "radial-gradient(circle, rgba(246,200,150,.55), transparent 70%)", filter: "blur(10px)" }} />
                <div className="wt-anim" style={{ position: "absolute", inset: -16, borderRadius: "50%", background: "conic-gradient(from 0deg, transparent 0%, transparent 38%, rgba(255,199,140,.95) 50%, transparent 62%, transparent 100%)", WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))", maskImage: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))", animation: "wt-ring 6.5s linear infinite" }} />
                <div className="wt-anim" style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundImage: "url(" + ORB + ")", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 0 90px rgba(243,179,107,.6), inset 0 0 30px rgba(255,255,255,.18)", animation: "wt-sv 5.2s ease-in-out infinite" }} />
                <div aria-hidden="true" className="wt-anim" style={{ position: "absolute", inset: -34, animation: "wt-orbit 9s linear infinite" }}>
                  <span style={{ position: "absolute", top: -3, left: "50%", width: 7, height: 7, marginLeft: -3.5, borderRadius: "50%", background: "#ffd9b0", boxShadow: "0 0 14px rgba(255,200,140,.95)" }} />
                </div>
                <div aria-hidden="true" className="wt-anim" style={{ position: "absolute", inset: -52, animation: "wt-orbit 15s linear infinite reverse" }}>
                  <span style={{ position: "absolute", top: -2, left: "50%", width: 5, height: 5, marginLeft: -2.5, borderRadius: "50%", background: "#cadfc1", boxShadow: "0 0 10px rgba(160,210,170,.9)" }} />
                </div>
              </div>
              <div style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#f3a06b", fontWeight: 700, marginBottom: 12, animation: "wt-in .6s " + fjedring + " .12s both" }}>Velkommen</div>
              <div className="wt-shimmer" style={{ fontFamily: "var(--font-serif)", fontSize: 58, lineHeight: 1.05, animation: "wt-in .6s " + fjedring + " .2s both" }}>M&oslash;d Astrid</div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,.84)", marginTop: 12, maxWidth: 480, lineHeight: 1.5, animation: "wt-in .6s " + fjedring + " .3s both" }}>Din digitale kollega, der klarer jura, notater og frister, s&aring; du kan bruge tiden hos borgeren.</div>
              <button type="button" className="wt-cta" onClick={() => { sStep(); if (musik) startMusik(); setStep(1); }} style={{ marginTop: 28, padding: "14px 30px", borderRadius: 999, border: "0.5px solid rgba(255,255,255,.35)", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15, boxShadow: "0 8px 26px rgba(217,102,55,.45), inset 0 1px 0 rgba(255,255,255,.35)", animation: "wt-in .6s " + fjedring + " .42s both" }}>Vis mig rundt (30 sek) &rarr;</button>
              <button type="button" onClick={close} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13, animation: "wt-in .6s " + fjedring + " .5s both" }}>Spring over</button>
            </>
          )}

          {s.type === "finish" && Card(
            <>
              <div style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#f3a06b", fontWeight: 700, marginBottom: 14, animation: "wt-in .6s " + fjedring + " both" }}>Det f&aring;r du ud af det</div>
              <div className="wt-shimmer" style={{ fontFamily: "var(--font-serif)", fontSize: 50, lineHeight: 1.1, maxWidth: 620, animation: "wt-in .6s " + fjedring + " .1s both" }}>Mere tid til det vigtige</div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 13, alignItems: "center" }}>
                {["Jura og notater klaret p\u00e5 minutter", "Aldrig i tvivl om den rette paragraf", "Mere tid hos borgeren, mindre p\u00e5 papir"].map((b, i) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 17, color: "rgba(255,255,255,.92)", background: "rgba(255,255,255,.07)", border: "0.5px solid rgba(255,255,255,.14)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "10px 22px", animation: "wt-in .55s " + fjedring + " " + (0.25 + i * 0.14) + "s both" }}>
                    <span style={{ color: "#8fd49a", fontSize: 19 }}>&#10003;</span> {b}
                  </div>
                ))}
              </div>
              <button type="button" className="wt-cta" onClick={proev} style={{ marginTop: 30, padding: "14px 32px", borderRadius: 999, border: "0.5px solid rgba(255,255,255,.35)", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 16, boxShadow: "0 8px 26px rgba(217,102,55,.45), inset 0 1px 0 rgba(255,255,255,.35)", animation: "wt-in .6s " + fjedring + " .7s both" }}>Pr&oslash;v det nu, det er gratis &rarr;</button>
              <button type="button" onClick={close} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 13, animation: "wt-in .6s " + fjedring + " .8s both" }}>Luk</button>
            </>
          )}

          {s.type === "spot" && rect && (
            <div key={step} className="wt-card" style={{ position: "absolute", zIndex: 6, width: 334, maxWidth: "86vw", background: "rgba(255,251,246,.92)", backdropFilter: "blur(16px) saturate(1.5)", border: "0.5px solid rgba(255,255,255,.7)", borderRadius: 18, padding: "15px 18px 16px", boxShadow: "0 24px 60px rgba(10,6,18,.45), inset 0 1px 0 rgba(255,255,255,.8)", ...tip }}>
              <div style={{ height: 3, borderRadius: 999, background: "rgba(143,67,39,.14)", overflow: "hidden", marginBottom: 11 }}>
                <div style={{ height: "100%", width: (spotNo / SPOT_TOTAL) * 100 + "%", borderRadius: 999, background: "linear-gradient(90deg,#ef9355,#d96637)", transition: "width .5s " + fjedring }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--kaerne-terracotta-deep,#8f4327)", fontWeight: 700 }}>
                  <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#ef9355,#d96637)" }} />
                  {s.tag}
                </span>
                <span style={{ fontSize: 11.5, color: "var(--kaerne-muted,#8a7a66)", fontVariantNumeric: "tabular-nums" }}>{spotNo} / {SPOT_TOTAL}</span>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--kaerne-ink,#2c2824)", marginBottom: 5, lineHeight: 1.2 }}>{s.title}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--kaerne-ink-soft,#5f5648)", minHeight: 63 }}><TypeTekst tekst={s.text} /></div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <button type="button" onClick={prev} disabled={step <= 1} style={{ background: "none", border: "none", cursor: step <= 1 ? "default" : "pointer", color: step <= 1 ? "#cfc3b0" : "var(--kaerne-ink-soft,#5f5648)", fontSize: 13 }}>&larr; Forrige</button>
                <button type="button" onClick={next} className="wt-cta" style={{ padding: "9px 20px", borderRadius: 999, border: "none", cursor: "pointer", background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 13.5, boxShadow: "0 5px 16px rgba(217,102,55,.4), inset 0 1px 0 rgba(255,255,255,.3)" }}>N&aelig;ste &rarr;</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
