"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — Glif-ORB med glød & lysglimt.
 * Glif-orb-billedet toner ind og zoomer langsomt; en varm glød pulserer både bag
 * og hen over orben (screen-blend bloom), et lysglimt (radial flash + anamorf
 * lysstreg) blitzer kort, et lyssweep stryger forbi, og "VELKOMMEN TIL ASTRID AI"
 * toner frem. Til sidst driver hele scenen blødt og elegant ud. Vises én gang pr.
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
  const bloom = useRef<HTMLDivElement>(null);
  const glint = useRef<HTMLDivElement>(null);
  const streak = useRef<HTMLDivElement>(null);
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
    T(() => { if (glow.current) glow.current.classList.add("asp-pulse"); if (bloom.current) bloom.current.classList.add("asp-pulse2"); }, 800);

    // LYSGLIMT — radial flash + anamorf lysstreg blitzer kort hen over orben
    const doGlint = () => {
      if (glint.current) {
        glint.current.style.transition = "none"; glint.current.style.opacity = "0"; glint.current.style.transform = "translate(-50%,-50%) scale(.4)";
        requestAnimationFrame(() => {
          if (!glint.current) return;
          glint.current.style.transition = "opacity .5s ease-out, transform .6s ease-out";
          glint.current.style.opacity = "1"; glint.current.style.transform = "translate(-50%,-50%) scale(1.3)";
          requestAnimationFrame(() => { if (glint.current) glint.current.style.opacity = "0"; });
        });
      }
      if (streak.current) {
        streak.current.style.transition = "none"; streak.current.style.opacity = "0"; streak.current.style.transform = "translate(-50%,-50%) scaleX(.2)";
        requestAnimationFrame(() => {
          if (!streak.current) return;
          streak.current.style.transition = "opacity .45s ease-out, transform .55s cubic-bezier(.2,.8,.2,1)";
          streak.current.style.opacity = ".9"; streak.current.style.transform = "translate(-50%,-50%) scaleX(1)";
          requestAnimationFrame(() => { if (streak.current) streak.current.style.opacity = "0"; });
        });
      }
    };
    T(doGlint, 1150);
    T(doGlint, 2900);

    // overskrift
    T(() => { if (pre.current) { pre.current.style.opacity = "1"; pre.current.style.transform = "translateY(0)"; } }, 1500);
    T(() => { if (big.current) { big.current.style.opacity = "1"; big.current.style.transform = "translateY(0) scale(1)"; } }, 1800);
    T(() => { if (sub.current) sub.current.style.opacity = "1"; }, 2500);

    // lyssweep
    T(() => { if (sweep.current) { sweep.current.style.transition = "transform 1.25s cubic-bezier(.4,0,.2,1), opacity .3s ease"; sweep.current.style.opacity = "1"; sweep.current.style.transform = "translateX(170%) skewX(-16deg)"; } }, 2300);
    T(() => { if (sweep.current) sweep.current.style.opacity = "0"; }, 3550);

    // elegant fade-out: indhold toner først, så driver hele scenen blødt væk
    T(() => { [pre.current, big.current, sub.current].forEach((e) => { if (e) e.style.opacity = "0"; }); }, 5200);
    T(() => { if (ovRef.current) { ovRef.current.style.opacity = "0"; ovRef.current.style.transform = "scale(1.04)"; ovRef.current.style.filter = "blur(3px)"; } }, 5500);
    T(() => { setGone(true); }, 7600);

    return () => { timers.forEach(clearTimeout); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 42%,#fef9f2 0%,#f6ecdd 52%,#ecdfcd 100%)", transition: "opacity 2s cubic-bezier(.4,0,.2,1), transform 2s cubic-bezier(.4,0,.2,1), filter 2s ease", transformOrigin: "50% 42%", overflow: "hidden" }}>
      <style>{`
        @keyframes asp-zoom{0%{transform:scale(1.1)}100%{transform:scale(1)}}
        .asp-hero{animation:asp-zoom 7.6s cubic-bezier(.16,.7,.28,1) forwards}
        @keyframes asp-pulseK{0%,100%{opacity:.45;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-50%) scale(1.1)}}
        .asp-pulse{animation:asp-pulseK 3.6s ease-in-out infinite}
        @keyframes asp-pulse2K{0%,100%{opacity:.35;transform:translate(-50%,-50%) scale(.96)}50%{opacity:.7;transform:translate(-50%,-50%) scale(1.06)}}
        .asp-pulse2{animation:asp-pulse2K 3.6s ease-in-out infinite}
      `}</style>

      {/* glød BAG orben */}
      <div ref={glow} style={{ position: "absolute", left: "50%", top: "42%", width: "70vmin", height: "70vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(246,210,160,.7) 0%, rgba(232,170,120,.28) 48%, transparent 72%)", opacity: 0, pointerEvents: "none" }} />

      {/* Glif-orb (foto-hero) */}
      <div ref={img} className="asp-hero" style={{ position: "absolute", inset: 0, backgroundImage: `url('${SPLASH_BG}')`, backgroundSize: "cover", backgroundPosition: "center 40%", opacity: 0, transition: "opacity 1.3s ease", WebkitMaskImage: "radial-gradient(125% 115% at 50% 42%, #000 0%, #000 54%, rgba(0,0,0,.6) 76%, transparent 100%)", maskImage: "radial-gradient(125% 115% at 50% 42%, #000 0%, #000 54%, rgba(0,0,0,.6) 76%, transparent 100%)" }} />

      {/* bloom HEN OVER orben (screen-blend → den lyser) */}
      <div ref={bloom} style={{ position: "absolute", left: "50%", top: "42%", width: "42vmin", height: "42vmin", transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,244,222,.85) 0%, rgba(255,224,170,.4) 42%, transparent 70%)", opacity: 0, mixBlendMode: "screen", pointerEvents: "none" }} />

      {/* LYSGLIMT — radial flash */}
      <div ref={glint} style={{ position: "absolute", left: "50%", top: "42%", width: "30vmin", height: "30vmin", transform: "translate(-50%,-50%) scale(.4)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,246,225,.6) 28%, transparent 62%)", opacity: 0, mixBlendMode: "screen", pointerEvents: "none" }} />
      {/* LYSGLIMT — anamorf vandret lysstreg */}
      <div ref={streak} style={{ position: "absolute", left: "50%", top: "42%", width: "80vmin", height: "3px", transform: "translate(-50%,-50%) scaleX(.2)", background: "linear-gradient(90deg, transparent, rgba(255,250,235,.95) 50%, transparent)", opacity: 0, mixBlendMode: "screen", pointerEvents: "none", filter: "blur(0.5px)" }} />

      {/* bund-scrim */}
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
