"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — fin-pudset GLAS-ORB.
 * Lyspartikler spiraler ind og samles til en glødende glas-orb omgivet af
 * roterende HUD-ringe og en data-konstellation; et blødt lyssweep stryger forbi,
 * og "VELKOMMEN TIL ASTRID AI" toner frem. Ingen blomst. Varm, rolig, high-tech.
 * Vises én gang pr. session. Ingen lyd.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);

  const hud1 = useRef<SVGGElement>(null);
  const hud2 = useRef<SVGGElement>(null);
  const constG = useRef<SVGGElement>(null);
  const pwrap = useRef<SVGGElement>(null);
  const orbg = useRef<SVGGElement>(null);
  const core = useRef<SVGCircleElement>(null);
  const coreIn = useRef<SVGCircleElement>(null);
  const hi = useRef<SVGEllipseElement>(null);
  const rim = useRef<SVGPathElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const sweep = useRef<SVGRectElement>(null);
  const flash = useRef<SVGRectElement>(null);
  const pre = useRef<HTMLDivElement>(null);
  const nameEl = useRef<HTMLDivElement>(null);
  const subEl = useRef<HTMLDivElement>(null);

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
    const NS = "http://www.w3.org/2000/svg";
    const cx = 340, cy = 196;
    const cols = ["#8aa885", "#a7c69d", "#b9d0b0", "#e2916f", "#ec9a86", "#caa98c"];
    const dots: SVGCircleElement[] = [];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const T = (f: () => void, ms: number) => timers.push(setTimeout(f, ms));

    const ticks = (g: SVGGElement, r: number, n: number, len: number, col: string, w: string) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * 6.283;
        const l = document.createElementNS(NS, "line");
        l.setAttribute("x1", String(cx + Math.cos(a) * r)); l.setAttribute("y1", String(cy + Math.sin(a) * r));
        l.setAttribute("x2", String(cx + Math.cos(a) * (r + len))); l.setAttribute("y2", String(cy + Math.sin(a) * (r + len)));
        l.setAttribute("stroke", col); l.setAttribute("stroke-width", w); l.setAttribute("opacity", i % 4 === 0 ? ".55" : ".22");
        g.appendChild(l);
      }
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(cx)); c.setAttribute("cy", String(cy)); c.setAttribute("r", String(r + len + 3));
      c.setAttribute("fill", "none"); c.setAttribute("stroke", col); c.setAttribute("stroke-width", "0.6"); c.setAttribute("opacity", ".28");
      g.appendChild(c);
    };
    if (hud1.current) ticks(hud1.current, 96, 48, 7, "#b9a888", "1");
    if (hud2.current) ticks(hud2.current, 132, 30, 12, "#caa98c", "0.8");

    // konstellation
    if (constG.current) {
      const pts: [number, number][] = [];
      for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283 + 0.3; const r = 150 + (i % 3) * 18; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i]; const [x2, y2] = pts[(i + 1) % pts.length];
        const ln = document.createElementNS(NS, "line");
        ln.setAttribute("x1", String(x1)); ln.setAttribute("y1", String(y1)); ln.setAttribute("x2", String(x2)); ln.setAttribute("y2", String(y2));
        ln.setAttribute("stroke", "#8aa885"); ln.setAttribute("stroke-width", "0.9"); ln.setAttribute("opacity", ".4");
        const len = Math.hypot(x2 - x1, y2 - y1);
        ln.setAttribute("stroke-dasharray", String(len)); ln.setAttribute("stroke-dashoffset", String(len));
        ln.style.transition = "stroke-dashoffset 1.1s ease";
        constG.current.appendChild(ln);
        const d = document.createElementNS(NS, "circle");
        d.setAttribute("cx", String(x1)); d.setAttribute("cy", String(y1)); d.setAttribute("r", "2.2"); d.setAttribute("fill", "#e2916f"); d.setAttribute("opacity", ".55");
        constG.current.appendChild(d);
      }
    }

    // partikler der spiraler ind
    const pw = pwrap.current!;
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * 6.283; const r = 150 + Math.random() * 60;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(cx + Math.cos(a) * r)); c.setAttribute("cy", String(cy + Math.sin(a) * r));
      c.setAttribute("r", (1.2 + Math.random() * 2.6).toFixed(1)); c.setAttribute("fill", cols[i % cols.length]); c.setAttribute("opacity", "0");
      c.style.transition = "cx 1.4s cubic-bezier(.35,.65,.25,1), cy 1.4s cubic-bezier(.35,.65,.25,1), opacity .7s ease";
      pw.appendChild(c); dots.push(c);
    }

    const h1 = hud1.current!, h2 = hud2.current!, cg = constG.current!;

    T(() => { dots.forEach((d) => d.setAttribute("opacity", (0.5 + Math.random() * 0.5).toFixed(2))); h1.setAttribute("opacity", "1"); h2.setAttribute("opacity", "1"); h1.style.transition = h2.style.transition = "opacity 1s ease"; }, 300);
    T(() => { pw.style.transition = "transform 1.4s cubic-bezier(.35,.65,.25,1)"; pw.style.transform = "rotate(55deg)"; dots.forEach((d) => { d.setAttribute("cx", String(cx + (Math.random() * 14 - 7))); d.setAttribute("cy", String(cy + (Math.random() * 14 - 7))); }); }, 650);
    T(() => {
      const co = core.current!, ci = coreIn.current!, h = hi.current!;
      co.style.transition = "r .8s cubic-bezier(.2,1.25,.4,1)"; ci.style.transition = "r .8s ease"; h.style.transition = "rx .8s ease, ry .8s ease";
      co.setAttribute("r", "52"); ci.setAttribute("r", "40"); h.setAttribute("rx", "16"); h.setAttribute("ry", "11");
      rim.current!.setAttribute("d", "M300,164 A52,52 0 0 1 380,164"); halo.current!.setAttribute("opacity", "1");
      dots.forEach((d) => d.setAttribute("opacity", "0"));
    }, 1500);
    T(() => { orbg.current!.classList.add("asp-breath"); halo.current!.classList.add("asp-breath"); h1.classList.add("asp-spin"); h2.classList.add("asp-spinR"); }, 2200);
    T(() => { cg.setAttribute("opacity", "1"); cg.style.transition = "opacity .6s ease"; cg.querySelectorAll("line").forEach((l) => l.setAttribute("stroke-dashoffset", "0")); }, 1900);
    T(() => { cg.classList.add("asp-spin"); }, 3100);
    T(() => { if (pre.current) { pre.current.style.opacity = "1"; pre.current.style.transform = "translateY(0)"; } }, 2300);
    T(() => { if (nameEl.current) { nameEl.current.style.opacity = "1"; nameEl.current.style.transform = "translateY(0) scale(1)"; } }, 2600);
    T(() => { if (subEl.current) subEl.current.style.opacity = "1"; }, 3300);
    T(() => { sweep.current!.setAttribute("opacity", "1"); sweep.current!.style.transition = "transform 1.1s ease, opacity .3s ease"; sweep.current!.setAttribute("transform", "translate(900,0) skewX(-14)"); }, 2700);
    T(() => { sweep.current!.setAttribute("opacity", "0"); }, 3800);
    T(() => { flash.current!.style.transition = "opacity .18s ease"; flash.current!.setAttribute("opacity", ".4"); }, 3350);
    T(() => { flash.current!.setAttribute("opacity", "0"); }, 3560);
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 5400);
    T(() => { setGone(true); }, 6800);

    return () => { timers.forEach(clearTimeout); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%,#fef9f2 0%,#f6ecdd 52%,#ecdfcd 100%)", transition: "opacity 1.3s ease", overflow: "hidden" }}>
      <style>{`
        @keyframes asp-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes asp-haloB{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.88;transform:scale(1.13)}}
        @keyframes asp-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes asp-spinR{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
        .asp-breath{transform-box:fill-box;transform-origin:340px 196px;animation:asp-breath 4s ease-in-out infinite}
        #asp-halo.asp-breath{transform-origin:center;animation:asp-haloB 4s ease-in-out infinite}
        #asp-hud1.asp-spin{transform-box:view-box;transform-origin:340px 196px;animation:asp-spin 30s linear infinite}
        #asp-hud2.asp-spinR{transform-box:view-box;transform-origin:340px 196px;animation:asp-spinR 22s linear infinite}
        #asp-const.asp-spin{transform-box:view-box;transform-origin:340px 196px;animation:asp-spin 44s linear infinite}
      `}</style>

      <svg viewBox="0 0 680 420" width="min(92vw, 720px)" height="auto" style={{ maxHeight: "70vh" }}>
        <defs>
          <radialGradient id="asp-sphere" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#cfe3c6" /><stop offset="42%" stopColor="#9cbf95" /><stop offset="100%" stopColor="#6f8f6b" />
          </radialGradient>
          <radialGradient id="asp-inner" cx="50%" cy="58%" r="60%">
            <stop offset="0%" stopColor="#f3ddc4" stopOpacity="0.85" /><stop offset="100%" stopColor="#e2916f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="asp-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4cfa3" stopOpacity="0.6" /><stop offset="55%" stopColor="#e8b98e" stopOpacity="0.22" /><stop offset="100%" stopColor="#e8b98e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="asp-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" /><stop offset="50%" stopColor="#fff" stopOpacity="0.5" /><stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle id="asp-halo" ref={halo} cx="340" cy="196" r="120" fill="url(#asp-bloom)" opacity="0" />
        <g id="asp-hud1" ref={hud1} opacity="0" />
        <g id="asp-hud2" ref={hud2} opacity="0" />
        <g id="asp-const" ref={constG} opacity="0" />
        <g ref={pwrap} style={{ transformBox: "view-box", transformOrigin: "340px 196px" }} />

        <g ref={orbg}>
          <circle ref={core} cx="340" cy="196" r="0" fill="url(#asp-sphere)" />
          <circle ref={coreIn} cx="340" cy="196" r="0" fill="url(#asp-inner)" />
          <ellipse ref={hi} cx="322" cy="178" rx="0" ry="0" fill="#ffffff" opacity=".6" />
          <path ref={rim} d="" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".35" />
        </g>

        <rect ref={sweep} x="-260" y="0" width="220" height="420" fill="url(#asp-sweep)" opacity="0" transform="skewX(-14)" />
        <rect ref={flash} x="0" y="0" width="680" height="420" fill="#fffaf2" opacity="0" />
      </svg>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 250, textAlign: "center", padding: "0 24px" }}>
        <div ref={pre} style={{ fontSize: "clamp(11px,2.4vw,14px)", letterSpacing: ".4em", textTransform: "uppercase", fontWeight: 600, color: "#b06a45", opacity: 0, transform: "translateY(10px)", transition: "all .7s cubic-bezier(.2,.8,.3,1)" }}>Velkommen til</div>
        <div ref={nameEl} style={{ marginTop: 8, fontSize: "clamp(40px,8.5vw,82px)", fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1, color: "#2d2a26", textTransform: "uppercase", opacity: 0, transform: "translateY(10px) scale(.85)", transition: "all .8s cubic-bezier(.2,1.4,.35,1)", textShadow: "0 4px 30px rgba(226,145,111,.34)" }}>Astrid AI</div>
        <div ref={subEl} style={{ marginTop: 12, fontSize: "clamp(10.5px,2.1vw,12px)", letterSpacing: ".3em", textTransform: "uppercase", color: "#9a6a47", opacity: 0, transition: "opacity .8s ease" }}>Din digitale kollega</div>
      </div>
    </div>
  );
}
