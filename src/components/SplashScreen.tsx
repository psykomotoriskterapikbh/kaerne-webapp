"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — high-tech men varm/biophilic.
 * Lyspartikler spiraler ind og danner en glødende orb omgivet af en
 * data-konstellation, navnet toner frem, "system klar"-glimt, og scenen
 * fader ud til appen. Vises én gang pr. session.
 */
export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);

  // refs til animerede dele
  const hud1 = useRef<SVGGElement>(null);
  const hud2 = useRef<SVGGElement>(null);
  const constG = useRef<SVGGElement>(null);
  const pwrap = useRef<SVGGElement>(null);
  const particles = useRef<SVGGElement>(null);
  const orbg = useRef<SVGGElement>(null);
  const core = useRef<SVGCircleElement>(null);
  const coreIn = useRef<SVGCircleElement>(null);
  const hi = useRef<SVGEllipseElement>(null);
  const rim = useRef<SVGPathElement>(null);
  const halo = useRef<SVGCircleElement>(null);
  const flower = useRef<SVGGElement>(null);
  const sweep = useRef<SVGRectElement>(null);
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
    const cx = 340, cy = 208;
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
        l.setAttribute("stroke", col); l.setAttribute("stroke-width", w); l.setAttribute("opacity", i % 4 === 0 ? ".55" : ".25");
        g.appendChild(l);
      }
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(cx)); c.setAttribute("cy", String(cy)); c.setAttribute("r", String(r));
      c.setAttribute("fill", "none"); c.setAttribute("stroke", col); c.setAttribute("stroke-width", "0.8"); c.setAttribute("opacity", ".3");
      g.appendChild(c);
    };

    const h1 = hud1.current!, h2 = hud2.current!, cg = constG.current!, pw = pwrap.current!, P = particles.current!;
    ticks(h1, 126, 48, 6, "#8aa885", "1");
    ticks(h2, 168, 30, 9, "#caa98c", "1");

    const N = 10; const pts: [number, number][] = [];
    for (let k = 0; k < N; k++) { const a = (k / N) * 6.283 - 1.4, r = 100 + (k % 3) * 9; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    for (let k = 0; k < N; k++) {
      const p = pts[k], q = pts[(k + 1) % N];
      const ln = document.createElementNS(NS, "line");
      ln.setAttribute("x1", String(p[0])); ln.setAttribute("y1", String(p[1])); ln.setAttribute("x2", String(q[0])); ln.setAttribute("y2", String(q[1]));
      ln.setAttribute("stroke", "#8aa885"); ln.setAttribute("stroke-width", "0.9"); ln.setAttribute("opacity", ".4");
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      ln.setAttribute("stroke-dasharray", String(len)); ln.setAttribute("stroke-dashoffset", String(len));
      ln.style.transition = `stroke-dashoffset 1.1s ease ${k * 0.05}s`;
      cg.appendChild(ln);
    }
    pts.forEach((p, idx) => { const nd = document.createElementNS(NS, "circle"); nd.setAttribute("cx", String(p[0])); nd.setAttribute("cy", String(p[1])); nd.setAttribute("r", "3.2"); nd.setAttribute("fill", idx % 2 ? "#e2916f" : "#7e9d78"); cg.appendChild(nd); });

    for (let i = 0; i < 42; i++) {
      const ang = Math.random() * 6.283, dist = 130 + Math.random() * 210;
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(cx + Math.cos(ang) * dist)); c.setAttribute("cy", String(cy + Math.sin(ang) * dist));
      c.setAttribute("r", (1.2 + Math.random() * 2.6).toFixed(1)); c.setAttribute("fill", cols[i % cols.length]); c.setAttribute("opacity", "0");
      c.style.transition = "cx 1.4s cubic-bezier(.35,.65,.25,1), cy 1.4s cubic-bezier(.35,.65,.25,1), opacity .7s ease";
      P.appendChild(c); dots.push(c);
    }

    T(() => { dots.forEach((d) => d.setAttribute("opacity", (0.5 + Math.random() * 0.5).toFixed(2))); h1.setAttribute("opacity", "1"); h2.setAttribute("opacity", "1"); h1.style.transition = h2.style.transition = "opacity 1s ease"; }, 300);
    T(() => { pw.style.transition = "transform 1.4s cubic-bezier(.35,.65,.25,1)"; pw.style.transform = "rotate(55deg)"; dots.forEach((d) => { d.setAttribute("cx", String(cx + (Math.random() * 14 - 7))); d.setAttribute("cy", String(cy + (Math.random() * 14 - 7))); }); }, 650);
    T(() => {
      const co = core.current!, ci = coreIn.current!, h = hi.current!;
      co.style.transition = "r .8s cubic-bezier(.2,1.25,.4,1)"; ci.style.transition = "r .8s ease"; h.style.transition = "rx .8s ease, ry .8s ease";
      co.setAttribute("r", "52"); ci.setAttribute("r", "40"); h.setAttribute("rx", "16"); h.setAttribute("ry", "11");
      rim.current!.setAttribute("d", "M300,176 A52,52 0 0 1 380,176"); halo.current!.setAttribute("opacity", "1");
      dots.forEach((d) => d.setAttribute("opacity", "0"));
    }, 1500);
    T(() => { orbg.current!.classList.add("asp-breath"); halo.current!.classList.add("asp-breath"); h1.classList.add("asp-spin"); h2.classList.add("asp-spinR"); }, 2250);
    T(() => { cg.setAttribute("opacity", "1"); cg.style.transition = "opacity .6s ease"; cg.querySelectorAll("line").forEach((l) => l.setAttribute("stroke-dashoffset", "0")); }, 1900);
    T(() => { cg.classList.add("asp-spin"); }, 3100);
    T(() => { flower.current!.style.transition = "opacity .7s ease"; flower.current!.setAttribute("opacity", "1"); }, 2150);
    T(() => { nameEl.current!.style.opacity = "1"; nameEl.current!.style.transform = "translateY(0)"; }, 2350);
    T(() => { subEl.current!.style.opacity = "1"; }, 3050);
    T(() => { sweep.current!.setAttribute("opacity", "1"); sweep.current!.style.transition = "transform 1.1s ease, opacity .3s ease"; sweep.current!.setAttribute("transform", "translate(900,0) skewX(-14)"); }, 2600);
    T(() => { sweep.current!.setAttribute("opacity", "0"); }, 3700);
    T(() => { flash.current!.style.transition = "opacity .16s ease"; flash.current!.setAttribute("opacity", ".6"); }, 3250);
    T(() => { flash.current!.setAttribute("opacity", "0"); }, 3450);
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 3700);
    T(() => { setGone(true); }, 4800);

    return () => { timers.forEach(clearTimeout); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 42%,#fef9f2 0%,#f6ecdd 52%,#ecdfcd 100%)", transition: "opacity 1.1s ease", overflow: "hidden" }}>
      {/* Glif-genereret kunstnerisk baggrund -- bloedt indtonet bag den levende SVG */}
      <div
        className="asp-bg"
        style={{
          position: "absolute",
          inset: "-4%",
          backgroundImage: "url('https://media.glif.app/i:r/c_limit,w_3840/f_auto/q_auto/fucn4fhdx5txpp7ddqre')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0,
          filter: "saturate(1.05)",
          WebkitMaskImage: "radial-gradient(circle at 50% 44%, #000 0%, #000 38%, rgba(0,0,0,.55) 64%, transparent 88%)",
          maskImage: "radial-gradient(circle at 50% 44%, #000 0%, #000 38%, rgba(0,0,0,.55) 64%, transparent 88%)",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes asp-bgin{0%{opacity:0;transform:scale(1.08)}100%{opacity:.62;transform:scale(1)}}
        .asp-bg{animation:asp-bgin 2.8s ease-out .15s forwards}
        @keyframes asp-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.055)}}
        @keyframes asp-haloB{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.14)}}
        @keyframes asp-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes asp-spinR{from{transform:rotate(0)}to{transform:rotate(-360deg)}}
        .asp-breath{transform-box:fill-box;transform-origin:340px 208px;animation:asp-breath 4s ease-in-out infinite}
        #asp-halo.asp-breath{transform-origin:center;animation:asp-haloB 4s ease-in-out infinite}
        #asp-hud1.asp-spin{transform-box:view-box;transform-origin:340px 208px;animation:asp-spin 30s linear infinite}
        #asp-hud2.asp-spinR{transform-box:view-box;transform-origin:340px 208px;animation:asp-spinR 22s linear infinite}
        #asp-const.asp-spin{transform-box:view-box;transform-origin:340px 208px;animation:asp-spin 40s linear infinite}
      `}</style>

      <svg viewBox="0 0 680 440" width="min(92vw, 760px)" height="auto" style={{ maxHeight: "82vh" }}>
        <defs>
          <radialGradient id="asp-sphere" cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#f1f8e9" /><stop offset="30%" stopColor="#cfe3c6" /><stop offset="64%" stopColor="#a7c69d" /><stop offset="100%" stopColor="#6f8f6a" />
          </radialGradient>
          <radialGradient id="asp-inner" cx="50%" cy="60%" r="60%">
            <stop offset="0%" stopColor="#f6c9ad" stopOpacity=".55" /><stop offset="100%" stopColor="#f6c9ad" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="asp-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2916f" stopOpacity=".5" /><stop offset="45%" stopColor="#e2916f" stopOpacity=".14" /><stop offset="100%" stopColor="#e2916f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="asp-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" /><stop offset="50%" stopColor="#fff" stopOpacity=".5" /><stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter id="asp-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="asp-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
        </defs>

        <g stroke="#caa98c" fill="none" opacity=".16"><circle cx="340" cy="208" r="150" /><circle cx="340" cy="208" r="186" /></g>
        <g id="asp-hud1" ref={hud1} opacity="0" />
        <g id="asp-hud2" ref={hud2} opacity="0" />
        <circle id="asp-halo" ref={halo} cx="340" cy="208" r="150" fill="url(#asp-bloom)" opacity="0" />
        <g id="asp-const" ref={constG} opacity="0" />
        <g ref={pwrap} style={{ transformBox: "view-box", transformOrigin: "340px 208px" }}><g ref={particles} filter="url(#asp-soft)" /></g>

        <g ref={orbg} filter="url(#asp-glow)">
          <circle ref={core} cx="340" cy="208" r="0" fill="url(#asp-sphere)" />
          <circle ref={coreIn} cx="340" cy="214" r="0" fill="url(#asp-inner)" />
          <ellipse ref={hi} cx="322" cy="190" rx="0" ry="0" fill="#ffffff" opacity=".6" />
          <path ref={rim} d="" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".35" />
        </g>
        <g ref={flower} transform="translate(340,208)" opacity="0">
          <circle cx="0" cy="-10" r="6.5" fill="#fdf2ec" /><circle cx="9.5" cy="-3.1" r="6.5" fill="#fdf2ec" />
          <circle cx="5.9" cy="8.1" r="6.5" fill="#fdf2ec" /><circle cx="-5.9" cy="8.1" r="6.5" fill="#fdf2ec" />
          <circle cx="-9.5" cy="-3.1" r="6.5" fill="#fdf2ec" /><circle cx="0" cy="0" r="4.6" fill="#e2916f" />
        </g>
        <rect ref={sweep} x="-260" y="0" width="220" height="440" fill="url(#asp-sweep)" opacity="0" transform="skewX(-14)" />
        <rect ref={flash} x="0" y="0" width="680" height="440" fill="#fffaf2" opacity="0" />
      </svg>

      <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", marginTop: 172, textAlign: "center" }}>
        <div ref={nameEl} style={{ fontFamily: "var(--font-script, cursive)", fontSize: 58, color: "#2d2a26", opacity: 0, transform: "translateY(10px)", transition: "all 1s cubic-bezier(.2,.8,.3,1)", lineHeight: 1, textShadow: "0 2px 18px rgba(226,145,111,.35)" }}>Astrid</div>
        <div ref={subEl} style={{ marginTop: 6, fontSize: 11.5, letterSpacing: ".3em", textTransform: "uppercase", color: "#c47a54", opacity: 0, transition: "opacity .8s ease" }}>System klar — dit rolige arbejdsrum</div>
      </div>
    </div>
  );
}
