"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — kaffekande hælder § + ♥ + kaffe i koppen.
 * High-tech men varm: glødende strøm (bloom), ripples på kaffen når
 * symboler lander, HUD-ring + scan-bue om koppen, og "SYSTEM KLAR"
 * der dekrypteres frem. Vises én gang pr. session. Ingen lyd.
 */
const SPLASH_BG =
  "https://media.glif.app/i:r/c_limit,w_3840/f_auto/q_auto/abzcrlgaoishv9ypz0uu";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);

  const pot = useRef<SVGGElement>(null);
  const stream = useRef<SVGGElement>(null);
  const fx = useRef<SVGGElement>(null);
  const ripples = useRef<SVGGElement>(null);
  const fill = useRef<SVGRectElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const hud = useRef<SVGGElement>(null);
  const scan = useRef<SVGGElement>(null);
  const steam = useRef<SVGGElement>(null);
  const flash = useRef<SVGRectElement>(null);
  const nameEl = useRef<HTMLDivElement>(null);
  const subEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("astrid_splash_seen") === "1"; } catch {}
    if (seen) { setGone(true); return; }
    try { sessionStorage.setItem("astrid_splash_seen", "1"); } catch {}
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const NS = "http://www.w3.org/2000/svg";
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const T = (f: () => void, ms: number) => timers.push(setTimeout(f, ms));

    const spoutX = 360, spoutY = 214;
    const cupRimY = 318;
    const fillTopMin = 300, fillBottom = 388;
    const cupCx = 338, cupCy = 352;
    let surfaceY = fillBottom; // kaffeoverfladens y, til ripples

    // ---- HUD-ring + scan-bue ----
    if (hud.current) {
      const mkTicks = (r: number, n: number, len: number) => {
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 6.283;
          const l = document.createElementNS(NS, "line");
          l.setAttribute("x1", String(cupCx + Math.cos(a) * r));
          l.setAttribute("y1", String(cupCy + Math.sin(a) * r));
          l.setAttribute("x2", String(cupCx + Math.cos(a) * (r + len)));
          l.setAttribute("y2", String(cupCy + Math.sin(a) * (r + len)));
          l.setAttribute("stroke", "#b9a888");
          l.setAttribute("stroke-width", "1");
          l.setAttribute("opacity", i % 4 === 0 ? ".5" : ".22");
          hud.current!.appendChild(l);
        }
      };
      mkTicks(72, 48, 6);
      const ring = document.createElementNS(NS, "circle");
      ring.setAttribute("cx", String(cupCx)); ring.setAttribute("cy", String(cupCy));
      ring.setAttribute("r", "72"); ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", "#caa98c"); ring.setAttribute("stroke-width", ".8");
      ring.setAttribute("opacity", ".3"); hud.current.appendChild(ring);
    }
    if (scan.current) {
      const arc = document.createElementNS(NS, "circle");
      arc.setAttribute("cx", String(cupCx)); arc.setAttribute("cy", String(cupCy));
      arc.setAttribute("r", "80"); arc.setAttribute("fill", "none");
      arc.setAttribute("stroke", "url(#ksp-scan)"); arc.setAttribute("stroke-width", "2.5");
      arc.setAttribute("stroke-linecap", "round"); arc.setAttribute("stroke-dasharray", "62 440");
      arc.setAttribute("opacity", ".75"); scan.current.appendChild(arc);
    }

    // ---- ripple på kaffeoverfladen ----
    const ripple = (x: number) => {
      if (!ripples.current) return;
      const e = document.createElementNS(NS, "ellipse");
      e.setAttribute("cx", String(x)); e.setAttribute("cy", String(surfaceY + 2));
      e.setAttribute("rx", "11"); e.setAttribute("ry", "3.4");
      e.setAttribute("fill", "none"); e.setAttribute("stroke", "#d8b48f");
      e.setAttribute("stroke-width", "1.6"); e.setAttribute("opacity", ".6");
      e.style.transition = "transform .75s ease-out, opacity .75s ease-out";
      e.style.transformBox = "fill-box"; e.style.transformOrigin = "center";
      e.style.transform = "scale(.25)";
      ripples.current.appendChild(e);
      requestAnimationFrame(() => { e.style.transform = "scale(1.8)"; e.setAttribute("opacity", "0"); });
      timers.push(setTimeout(() => e.remove(), 820));
    };

    // ---- faldende elementer (§, ♥, kaffedråber) ----
    const browns = ["#6f4e37", "#7c5a43", "#8a6650"];
    const accents = ["#e2916f", "#cf7f57"];
    const spawn = () => {
      if (!fx.current) return;
      const kind = Math.random();
      const x = spoutX + (Math.random() * 16 - 8);
      let node: SVGElement;
      if (kind < 0.34) {
        node = document.createElementNS(NS, "text");
        node.textContent = "§";
        node.setAttribute("font-size", (20 + Math.random() * 8).toFixed(0));
        node.setAttribute("font-weight", "600");
        node.setAttribute("fill", "#5a4636");
        node.setAttribute("text-anchor", "middle");
      } else if (kind < 0.62) {
        node = document.createElementNS(NS, "text");
        node.textContent = "♥";
        node.setAttribute("font-size", (16 + Math.random() * 7).toFixed(0));
        node.setAttribute("fill", accents[Math.floor(Math.random() * accents.length)]);
        node.setAttribute("text-anchor", "middle");
      } else {
        node = document.createElementNS(NS, "circle");
        node.setAttribute("r", (3 + Math.random() * 3.5).toFixed(1));
        node.setAttribute("fill", browns[Math.floor(Math.random() * browns.length)]);
      }
      node.setAttribute("filter", "url(#ksp-glow)"); // bloom
      const rot = (Math.random() * 60 - 30).toFixed(0);
      if (node.tagName === "circle") {
        node.setAttribute("cx", String(x)); node.setAttribute("cy", String(spoutY));
      } else {
        node.setAttribute("x", String(x)); node.setAttribute("y", String(spoutY));
      }
      node.setAttribute("opacity", "0");
      node.style.transition = "transform 1.05s cubic-bezier(.45,.05,.7,1), opacity .5s ease";
      node.style.transformBox = "fill-box";
      node.style.transformOrigin = "center";
      fx.current.appendChild(node);
      const drop = cupRimY - spoutY + (surfaceY - cupRimY) * 0.4 + (Math.random() * 10);
      requestAnimationFrame(() => {
        node.setAttribute("opacity", "0.96");
        node.style.transform = `translateY(${drop}px) rotate(${rot}deg)`;
      });
      timers.push(setTimeout(() => ripple(x), 980));     // plask når den lander
      timers.push(setTimeout(() => { node.setAttribute("opacity", "0"); }, 760));
      timers.push(setTimeout(() => { node.remove(); }, 1150));
    };

    // ---- koppen fyldes ----
    let lvl = 0;
    const raise = () => {
      lvl = Math.min(1, lvl + 0.045);
      const top = fillBottom - (fillBottom - fillTopMin) * lvl;
      surfaceY = top;
      if (fill.current) {
        fill.current.setAttribute("y", String(top));
        fill.current.setAttribute("height", String(fillBottom - top));
      }
    };

    // ---- decrypt-tekst ----
    const finalSub = "System klar — dit rolige arbejdsrum";
    const decrypt = () => {
      if (!subEl.current) return;
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ§◊∆0123456789";
      let frame = 0;
      const iv = setInterval(() => {
        frame++;
        const revealed = Math.floor(frame / 1.4);
        let out = "";
        for (let i = 0; i < finalSub.length; i++) {
          const c = finalSub[i];
          if (c === " " || c === "—") { out += c; continue; }
          out += i < revealed ? c : charset[Math.floor(Math.random() * charset.length)];
        }
        if (subEl.current) subEl.current.textContent = out;
        if (revealed >= finalSub.length) { clearInterval(iv); if (subEl.current) subEl.current.textContent = finalSub; }
      }, 45);
      intervals.push(iv);
    };

    // ---- tidslinje ----
    T(() => { if (halo.current) { halo.current.style.transition = "opacity 1s ease"; halo.current.setAttribute("opacity", "1"); } }, 200);
    T(() => { if (pot.current) { pot.current.style.transition = "transform 1s cubic-bezier(.3,.7,.3,1)"; pot.current.style.transform = "rotate(-26deg)"; } }, 500);
    // HUD toner ind og roterer
    T(() => {
      if (hud.current) { hud.current.style.transition = "opacity 1s ease"; hud.current.setAttribute("opacity", "1"); hud.current.classList.add("ksp-on"); }
      if (scan.current) { scan.current.style.transition = "opacity 1s ease"; scan.current.setAttribute("opacity", "1"); scan.current.classList.add("ksp-on"); }
    }, 1000);
    // strøm + spawning + fyld
    T(() => {
      if (stream.current) { stream.current.style.transition = "opacity .5s ease"; stream.current.setAttribute("opacity", "1"); }
      intervals.push(setInterval(spawn, 150));
      intervals.push(setInterval(raise, 230));
    }, 1300);
    T(() => { if (steam.current) steam.current.classList.add("ksp-steam-on"); }, 2600);
    // stop med at hælde
    T(() => {
      intervals.forEach(clearInterval); intervals.length = 0;
      if (stream.current) stream.current.setAttribute("opacity", "0");
      if (pot.current) pot.current.style.transform = "rotate(-6deg)";
      lvl = 1; surfaceY = fillTopMin;
      if (fill.current) { fill.current.setAttribute("y", String(fillTopMin)); fill.current.setAttribute("height", String(fillBottom - fillTopMin)); }
    }, 5200);
    // navn + decrypt-undertekst
    T(() => { if (nameEl.current) { nameEl.current.style.opacity = "1"; nameEl.current.style.transform = "translateY(0)"; } }, 5400);
    T(() => { if (subEl.current) subEl.current.style.opacity = "1"; decrypt(); }, 6000);
    // varmt lysglimt
    T(() => { if (flash.current) { flash.current.style.transition = "opacity .18s ease"; flash.current.setAttribute("opacity", ".45"); } }, 6300);
    T(() => { if (flash.current) flash.current.setAttribute("opacity", "0"); }, 6550);
    // fade ud + væk
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 7600);
    T(() => { setGone(true); }, 9000);

    return () => { timers.forEach(clearTimeout); intervals.forEach(clearInterval); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 42%,#fef9f2 0%,#f6ecdd 52%,#ecdfcd 100%)", transition: "opacity 1.4s ease", overflow: "hidden" }}>
      {/* Glif-genereret kunstnerisk baggrund */}
      <div className="ksp-bg" style={{ position: "absolute", inset: "-4%", backgroundImage: `url('${SPLASH_BG}')`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0, filter: "saturate(1.05)", WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 0%, #000 36%, rgba(0,0,0,.5) 62%, transparent 86%)", maskImage: "radial-gradient(circle at 50% 46%, #000 0%, #000 36%, rgba(0,0,0,.5) 62%, transparent 86%)", pointerEvents: "none" }} />
      <style>{`
        @keyframes ksp-bgin{0%{opacity:0;transform:scale(1.08)}100%{opacity:.55;transform:scale(1)}}
        .ksp-bg{animation:ksp-bgin 3s ease-out .15s forwards}
        @keyframes ksp-haloB{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.82;transform:scale(1.08)}}
        #ksp-halo.ksp-on{transform-origin:center;animation:ksp-haloB 4s ease-in-out infinite}
        @keyframes ksp-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        #ksp-hud.ksp-on{transform-box:view-box;transform-origin:338px 352px;animation:ksp-spin 22s linear infinite}
        #ksp-scanwrap.ksp-on{transform-box:view-box;transform-origin:338px 352px;animation:ksp-spin 3.4s linear infinite}
        @keyframes ksp-flow{0%{stroke-dashoffset:34}100%{stroke-dashoffset:0}}
        @keyframes ksp-steam{0%{opacity:0;transform:translateY(6px) scaleX(1)}35%{opacity:.5}100%{opacity:0;transform:translateY(-20px) scaleX(1.25)}}
        .ksp-steam-on .ksp-s{animation:ksp-steam 3s ease-in-out infinite}
        .ksp-steam-on .ksp-s2{animation-delay:.7s}
        .ksp-steam-on .ksp-s3{animation-delay:1.4s}
        #ksp-stream{stroke-dasharray:7 6;animation:ksp-flow .5s linear infinite}
      `}</style>

      <svg viewBox="0 0 680 480" width="min(92vw, 760px)" height="auto" style={{ maxHeight: "84vh" }}>
        <defs>
          <radialGradient id="ksp-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f6d9a8" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#ecc79a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ecc79a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ksp-scan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7fb8b0" stopOpacity="0" />
            <stop offset="100%" stopColor="#7fb8b0" stopOpacity="0.95" />
          </linearGradient>
          <filter id="ksp-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="ksp-pot" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9bb89a" />
            <stop offset="55%" stopColor="#7fa07c" />
            <stop offset="100%" stopColor="#5f7e5d" />
          </linearGradient>
          <linearGradient id="ksp-cup" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f3ead9" />
            <stop offset="100%" stopColor="#e6d6bd" />
          </linearGradient>
          <linearGradient id="ksp-coffee" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c5a43" />
            <stop offset="100%" stopColor="#5a4030" />
          </linearGradient>
          <clipPath id="ksp-cupclip">
            <path d="M302,316 h68 a6,6 0 0 1 6,6 l-7,60 a14,14 0 0 1 -14,12 h-38 a14,14 0 0 1 -14,-12 l-7,-60 a6,6 0 0 1 6,-6 z" />
          </clipPath>
        </defs>

        {/* glød bag scenen */}
        <circle id="ksp-halo" ref={halo} cx="338" cy="320" r="180" fill="url(#ksp-bloom)" opacity="0" />

        {/* HUD-ring + scan-bue om koppen */}
        <g id="ksp-hud" ref={hud} opacity="0" />
        <g id="ksp-scanwrap" ref={scan} opacity="0" />

        {/* damp */}
        <g ref={steam} stroke="#c9b79c" strokeWidth="3" strokeLinecap="round" fill="none" opacity="1">
          <path className="ksp-s" d="M326,300 q-6,-12 0,-24 q6,-12 0,-24" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <path className="ksp-s ksp-s2" d="M340,300 q-6,-12 0,-24 q6,-12 0,-24" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <path className="ksp-s ksp-s3" d="M354,300 q-6,-12 0,-24 q6,-12 0,-24" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        </g>

        {/* faldende § ♥ kaffe (med bloom) */}
        <g ref={fx} />

        {/* strøm fra tuden (med bloom) */}
        <g ref={stream} opacity="0" filter="url(#ksp-glow)">
          <path id="ksp-stream" d="M360,214 q-6,52 -22,100" stroke="#6f4e37" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".85" />
        </g>

        {/* koppen */}
        <g>
          <path d="M302,316 h68 a6,6 0 0 1 6,6 l-7,60 a14,14 0 0 1 -14,12 h-38 a14,14 0 0 1 -14,-12 l-7,-60 a6,6 0 0 1 6,-6 z" fill="url(#ksp-cup)" stroke="#d8c6a8" strokeWidth="1.5" />
          <path d="M378,330 q26,2 24,26 q-2,20 -22,20" fill="none" stroke="#e0cfb0" strokeWidth="7" strokeLinecap="round" />
          <g clipPath="url(#ksp-cupclip)">
            <rect ref={fill} x="298" y="388" width="80" height="0" fill="url(#ksp-coffee)" />
            <g ref={ripples} />
          </g>
          <path d="M302,316 h68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        </g>

        {/* kaffekande (tipper) */}
        <g ref={pot} style={{ transformBox: "fill-box", transformOrigin: "385px 150px" }} transform="rotate(0)">
          <g transform="translate(330,70)">
            <path d="M40,30 h70 a14,14 0 0 1 14,14 l-6,52 a22,22 0 0 1 -22,20 h-42 a22,22 0 0 1 -22,-20 l-6,-52 a14,14 0 0 1 14,-14 z" fill="url(#ksp-pot)" stroke="#54724f" strokeWidth="2" />
            <path d="M44,30 h62 a8,8 0 0 0 -8,-12 h-46 a8,8 0 0 0 -8,12 z" fill="#6f8f6b" stroke="#54724f" strokeWidth="1.5" />
            <circle cx="75" cy="12" r="4.5" fill="#e2916f" />
            <path d="M40,52 q-26,-2 -34,30 q-2,8 6,8 q10,-22 28,-22 z" fill="url(#ksp-pot)" stroke="#54724f" strokeWidth="1.5" />
            <path d="M124,50 q26,4 22,34 q-3,18 -20,20" fill="none" stroke="#6f8f6b" strokeWidth="8" strokeLinecap="round" />
            <path d="M58,40 q-8,30 -2,58" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".35" />
          </g>
        </g>

        {/* varmt lysglimt */}
        <rect ref={flash} x="0" y="0" width="680" height="480" fill="#fff6e9" opacity="0" />
      </svg>

      {/* navn + decrypt-undertekst */}
      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 250, textAlign: "center" }}>
        <div ref={nameEl} style={{ fontFamily: "var(--font-script, cursive)", fontSize: 58, color: "#2d2a26", opacity: 0, transform: "translateY(10px)", transition: "all 1s cubic-bezier(.2,.8,.3,1)", lineHeight: 1, textShadow: "0 2px 18px rgba(226,145,111,.35)" }}>Astrid</div>
        <div ref={subEl} style={{ marginTop: 6, fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#c47a54", opacity: 0, transition: "opacity .8s ease", fontVariantNumeric: "tabular-nums" }}>System klar — dit rolige arbejdsrum</div>
      </div>
    </div>
  );
}
