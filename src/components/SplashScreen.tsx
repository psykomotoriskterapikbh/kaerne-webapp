"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — Glif-ORB (foto-hero).
 * Det Glif-genererede orb-billede er omdrejningspunktet: det toner blødt ind og
 * zoomer ganske langsomt, en blød glød pulserer, et lyssweep stryger forbi,
 * og "VELKOMMEN TIL ASTRID AI" toner frem. Ingen blomst. Vises én gang pr.
 * session. Ingen lyd.
 */
const SPLASH_BG =
  "https://media.glif.app/i:r/c_limit,w_3840/f_auto/q_auto/fucn4fhdx5txpp7ddqre";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
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

    T(() => { if (img.current) img.current.style.opacity = "1"; }, 50);
    T(() => { if (glow.current) glow.current.classList.add("asp-pulse"); }, 900);
    // overskrift
    T(() => { if (pre.current) { pre.current.style.opacity = "1"; pre.current.style.transform = "translateY(0)"; } }, 1500);
    T(() => { if (big.current) { big.current.style.opacity = "1"; big.current.style.transform = "translateY(0) scale(1)"; } }, 1800);
    T(() => { if (sub.current) sub.current.style.opacity = "1"; }, 2500);
    // lyssweep
    T(() => { if (sweep.current) { sweep.current.style.transition = "transform 1.25s cubic-bezier(.4,0,.2,1), opacity .3s ease"; sweep.current.style.opacity = "1"; sweep.current.style.transform = "translateX(170%) skewX(-16deg)"; } }, 2700);
    T(() => { if (sweep.current) sweep.current.style.opacity = "0"; }, 3950);
    // fade ud + væk
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 5400);
    T(() => { setGone(true); }, 6800);

    return () => { timers.forEach(clearTimeout); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 42%,#fef9f2 0%,#f6ecdd 52%,#ecdfcd 100%)", transition: "opacity 1.3s ease", overflow: "hidden" }}>
      <style>{`
        @keyframes asp-zoom{0%{transform:scale(1.1)}100%{transform:scale(1)}}
        .asp-hero{animation:asp-zoom 7.4s cubic-bezier(.16,.7,.28,1) forwards}
        @keyframes asp-pulseK{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.08)}}
        .asp-pulse{animation:asp-pulseK 4s ease-in-out infinite}
      `}</style>

      {/* blød glød bag orben */}
      <div ref={glow} style={{ position: "absolute", left: "50%", top: "42%", width: "62vmin", height: "62vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,207,163,.55) 0%, rgba(232,185,142,.2) 50%, transparent 72%)", opacity: 0, pointerEvents: "none" }} />

      {/* Glif-orb (foto-hero) */}
      <div ref={img} className="asp-hero" style={{ position: "absolute", inset: 0, backgroundImage: `url('${SPLASH_BG}')`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0, transition: "opacity 1.3s ease", WebkitMaskImage: "radial-gradient(125% 115% at 50% 42%, #000 0%, #000 54%, rgba(0,0,0,.6) 76%, transparent 100%)", maskImage: "radial-gradient(125% 115% at 50% 42%, #000 0%, #000 54%, rgba(0,0,0,.6) 76%, transparent 100%)" }} />

      {/* bund-scrim så teksten er læsbar */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(247,240,228,0) 44%, rgba(247,240,228,.5) 74%, rgba(244,236,221,.9) 100%)", pointerEvents: "none" }} />

      {/* lyssweep */}
      <div ref={sweep} style={{ position: "absolute", top: 0, bottom: 0, left: "-30%", width: "30%", opacity: 0, transform: "translateX(-60%) skewX(-16deg)", background: "linear-gradient(90deg, transparent, rgba(255,251,242,.45), transparent)", pointerEvents: "none" }} />

      {/* overskrift */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "16%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>
        <div ref={pre} style={{ fontSize: "clamp(11px,2.4vw,15px)", letterSpacing: ".42em", textTransform: "uppercase", fontWeight: 600, color: "#b06a45", opacity: 0, transform: "translateY(10px)", transition: "all .7s cubic-bezier(.2,.8,.3,1)" }}>Velkommen til</div>
        <div ref={big} style={{ marginTop: 8, fontSize: "clamp(44px,9vw,96px)", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1, color: "#2d2a26", textTransform: "uppercase", opacity: 0, transform: "translateY(12px) scale(.88)", transition: "all .8s cubic-bezier(.2,1.4,.35,1)", textShadow: "0 4px 34px rgba(226,145,111,.34)" }}>Astrid AI</div>
        <div ref={sub} style={{ marginTop: 12, fontSize: "clamp(10.5px,2.1vw,12px)", letterSpacing: ".3em", textTransform: "uppercase", color: "#9a6a47", opacity: 0, transition: "opacity .8s ease" }}>Din digitale kollega</div>
      </div>
    </div>
  );
}
