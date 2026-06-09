"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — EKSPLOSIV.
 * Glif-billedet zoomer hurtigt ind, et lysglimt + en radial partikel-eksplosion
 * (§, ♥, gnister) skyder udad, en stødring breder sig, og "VELKOMMEN TIL ASTRID"
 * popper energisk frem med store bogstaver. Dopamin-forward. Vises én gang pr.
 * session. Ingen lyd.
 */
const SPLASH_BG =
  "https://media.glif.app/i:r/c_limit,w_3840/f_auto/q_auto/abzcrlgaoishv9ypz0uu";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("astrid_splash_seen") === "1"; } catch {}
    if (seen) { setGone(true); return; }
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    if (reduce) { setGone(true); return; }
    try { sessionStorage.setItem("astrid_splash_seen", "1"); } catch {}
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const T = (f: () => void, ms: number) => timers.push(setTimeout(f, ms));

    // billede toner hurtigt ind
    T(() => { if (img.current) img.current.style.opacity = "0.92"; }, 40);

    // EKSPLOSION — partikler skyder udad fra centrum
    const detonate = () => {
      if (!burst.current) return;
      const cols = ["#e0a16a", "#e2916f", "#cf7f57", "#8aa885", "#f1c27a", "#7fb8b0"];
      const glyphs = ["§", "♥", "✦", "•", "§", "♥"];
      const N = 46;
      for (let i = 0; i < N; i++) {
        const p = document.createElement("div");
        const isGlyph = Math.random() < 0.5;
        const ang = (i / N) * 6.283 + Math.random() * 0.5;
        const dist = 160 + Math.random() * 320;
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist;
        const rot = (Math.random() * 720 - 360).toFixed(0);
        if (isGlyph) {
          p.textContent = glyphs[i % glyphs.length];
          p.style.cssText = `position:absolute;left:50%;top:46%;font-size:${(14 + Math.random() * 16).toFixed(0)}px;font-weight:700;color:${cols[i % cols.length]};`;
        } else {
          const s = (5 + Math.random() * 9).toFixed(0);
          p.style.cssText = `position:absolute;left:50%;top:46%;width:${s}px;height:${s}px;border-radius:50%;background:${cols[i % cols.length]};`;
        }
        p.style.transform = "translate(-50%,-50%) scale(.2)";
        p.style.opacity = "1";
        p.style.transition = "transform .95s cubic-bezier(.15,.75,.25,1), opacity .95s ease-out";
        p.style.pointerEvents = "none";
        p.style.willChange = "transform, opacity";
        burst.current.appendChild(p);
        requestAnimationFrame(() => {
          p.style.transform = `translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${dy.toFixed(0)}px)) scale(${(0.8 + Math.random()).toFixed(2)}) rotate(${rot}deg)`;
          p.style.opacity = "0";
        });
        timers.push(setTimeout(() => p.remove(), 1100));
      }
    };

    // tidslinje — punchy
    T(() => {
      // lysglimt
      if (flash.current) { flash.current.style.opacity = "0.85"; flash.current.style.transition = "opacity .5s ease-out"; requestAnimationFrame(() => { if (flash.current) flash.current.style.opacity = "0"; }); }
      // stødring
      if (ring.current) { ring.current.style.transition = "transform .8s cubic-bezier(.1,.7,.2,1), opacity .8s ease-out"; ring.current.style.opacity = "0.9"; requestAnimationFrame(() => { if (ring.current) { ring.current.style.transform = "translate(-50%,-50%) scale(11)"; ring.current.style.opacity = "0"; } }); }
      detonate();
    }, 620);

    // VELKOMMEN TIL (lille, over)
    T(() => { if (pre.current) { pre.current.style.opacity = "1"; pre.current.style.transform = "translateY(0)"; } }, 540);
    // ASTRID popper stort frem
    T(() => { if (big.current) { big.current.style.opacity = "1"; big.current.style.transform = "scale(1)"; } }, 700);
    // andet lille glimt af gnister
    T(() => detonate(), 1500);
    // undertekst
    T(() => { if (sub.current) sub.current.style.opacity = "1"; }, 1700);

    // fade ud + væk
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 4600);
    T(() => { setGone(true); }, 6000);

    return () => { timers.forEach(clearTimeout); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 44%,#fdf5ea 0%,#f3e7d4 55%,#e7d8bf 100%)", transition: "opacity 1.2s ease", overflow: "hidden" }}>
      <style>{`
        @keyframes asp-zoom{0%{transform:scale(1.18)}100%{transform:scale(1)}}
        .asp-hero{animation:asp-zoom 4.2s cubic-bezier(.12,.7,.25,1) forwards}
      `}</style>

      {/* foto-hero baggrund */}
      <div ref={img} className="asp-hero" style={{ position: "absolute", inset: 0, backgroundImage: `url('${SPLASH_BG}')`, backgroundSize: "cover", backgroundPosition: "center 42%", opacity: 0, transition: "opacity .6s ease", WebkitMaskImage: "radial-gradient(125% 115% at 50% 44%, #000 0%, #000 56%, rgba(0,0,0,.6) 78%, transparent 100%)", maskImage: "radial-gradient(125% 115% at 50% 44%, #000 0%, #000 56%, rgba(0,0,0,.6) 78%, transparent 100%)" }} />

      {/* bund-scrim */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(247,240,228,0) 40%, rgba(247,240,228,.5) 72%, rgba(244,236,221,.88) 100%)", pointerEvents: "none" }} />

      {/* stødring */}
      <div ref={ring} style={{ position: "absolute", left: "50%", top: "46%", width: 60, height: 60, marginLeft: -30, marginTop: -30, borderRadius: "50%", border: "2px solid #e0a16a", opacity: 0, transform: "translate(-50%,-50%) scale(.2)", pointerEvents: "none" }} />

      {/* partikel-eksplosion */}
      <div ref={burst} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* lysglimt */}
      <div ref={flash} style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%, #fff6e9 0%, rgba(255,246,233,.6) 30%, transparent 65%)", opacity: 0, pointerEvents: "none" }} />

      {/* overskrift */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>
        <div ref={pre} style={{ fontSize: "clamp(11px,2.4vw,15px)", letterSpacing: ".42em", textTransform: "uppercase", fontWeight: 600, color: "#b06a45", opacity: 0, transform: "translateY(10px)", transition: "all .6s cubic-bezier(.2,.8,.3,1)" }}>Velkommen til</div>
        <div ref={big} style={{ fontSize: "clamp(54px,13vw,124px)", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 0.95, color: "#2c2824", textTransform: "uppercase", opacity: 0, transform: "scale(.4)", transition: "all .7s cubic-bezier(.2,1.5,.35,1)", textShadow: "0 6px 40px rgba(226,145,111,.4)" }}>Astrid</div>
        <div ref={sub} style={{ marginTop: 16, fontSize: "clamp(11px,2.2vw,13px)", letterSpacing: ".28em", textTransform: "uppercase", color: "#9a6a47", opacity: 0, transition: "opacity .7s ease" }}>Din digitale kollega</div>
      </div>
    </div>
  );
}
