"use client";

import { useEffect, useRef } from "react";

type Mood = "glad" | "begejstret" | "rolig" | "taenksom" | "soevnig";

// Korte inspark — få ord ad gangen
const IDLE = [
  "§20: 4 mdr. ⏳",
  "Barnet i midten.",
  "Ikke skrevet = ikke sket 📝",
  "Belys også modargumentet.",
  "Efterværn = ungestøtte nu.",
  "Partshøring før afgørelse.",
  "Anonymisér først 👀",
  "Barnets stemme tæller.",
  "Samvær er barnets ret.",
  "Underret hellere for tidligt.",
  "Skriv notatet nu.",
  "Koffein + paragraffer ☕",
  "Jeg holder hovedet koldt.",
  "Elsker en god deadline.",
  "Tjek tilsynsrapporten 👀",
];
const TYPING = ["Mmm…", "Jeg lytter…", "Fortæl…", "Spændende!", "Okay…", "Skriv løs ☕"];
const THINKING = ["Lad mig lige tænke…", "Et øjeblik…", "Tygger på det…", "Slår det op…"];
const ANSWER = ["Sådan!", "Værsgo ✨", "Her!", "Klar!"];

const FACES: Record<Mood, { gl: string; smile: string | null; mouth: number; sy: number; sc: number; cheek: number; lookUp?: number }> = {
  glad: { gl: "rgba(226,145,111,.42)", smile: "M129,193 Q150,211 171,193", mouth: 0, sy: 1, sc: 1, cheek: 0.65 },
  begejstret: { gl: "rgba(236,120,160,.5)", smile: null, mouth: 1, sy: 1, sc: 1.15, cheek: 0.85 },
  rolig: { gl: "rgba(150,200,150,.4)", smile: "M133,194 Q150,203 167,194", mouth: 0, sy: 1, sc: 1, cheek: 0.5 },
  taenksom: { gl: "rgba(127,160,200,.45)", smile: "M135,195 Q150,199 165,195", mouth: 0, sy: 1, sc: 1, cheek: 0.45, lookUp: 1 },
  soevnig: { gl: "rgba(150,150,170,.32)", smile: "M137,196 Q150,201 163,196", mouth: 0, sy: 0.35, sc: 1, cheek: 0.4 },
};

const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

export default function AstridFigur({
  loading = false,
  typing = false,
  chatActive = false,
}: {
  loading?: boolean;
  typing?: boolean;
  chatActive?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<SVGGElement>(null);
  const eyeRRef = useRef<SVGGElement>(null);
  const smileRef = useRef<SVGPathElement>(null);
  const mouthRef = useRef<SVGEllipseElement>(null);
  const cheekLRef = useRef<SVGEllipseElement>(null);
  const cheekRRef = useRef<SVGEllipseElement>(null);
  const steamRef = useRef<SVGGElement>(null);
  const thinkRef = useRef<SVGGElement>(null);

  const ctrl = useRef<{
    setMood: (m: Mood) => void;
    say: (t: string, ms?: number) => void;
    doSkill: (s: string) => void;
    mood: Mood;
    busy: boolean;
  } | null>(null);

  // Setup (mount)
  useEffect(() => {
    const svg = svgRef.current, flip = flipRef.current, tilt = tiltRef.current, glow = glowRef.current,
      bubble = bubbleRef.current, eyeL = eyeLRef.current, eyeR = eyeRRef.current, smile = smileRef.current,
      mouth = mouthRef.current, cheekL = cheekLRef.current, cheekR = cheekRRef.current, steam = steamRef.current,
      think = thinkRef.current, stage = stageRef.current;
    if (!svg || !flip || !tilt || !glow || !bubble || !eyeL || !eyeR || !smile || !mouth || !cheekL || !cheekR || !steam || !think || !stage) return;

    const state = { look: { x: 0, y: 0 }, busy: false, mood: "glad" as Mood };
    let sayTimer: ReturnType<typeof setTimeout>;

    const applyEyes = (sy: number, sc: number) => {
      const t = `translate(${state.look.x.toFixed(1)}px,${state.look.y.toFixed(1)}px) scale(${sc},${sc * sy})`;
      eyeL.style.transform = t;
      eyeR.style.transform = t;
    };
    const setMood = (m: Mood) => {
      state.mood = m;
      const f = FACES[m];
      glow.style.setProperty("--gl", f.gl);
      smile.style.opacity = f.mouth ? "0" : "1";
      if (f.smile) smile.setAttribute("d", f.smile);
      mouth.setAttribute("opacity", f.mouth ? "1" : "0");
      cheekL.setAttribute("opacity", String(f.cheek));
      cheekR.setAttribute("opacity", String(f.cheek));
      state.look = { x: 0, y: f.lookUp ? -3 : 0 };
      applyEyes(f.sy, f.sc);
      think.setAttribute("opacity", m === "taenksom" ? "1" : "0");
    };
    const say = (txt: string, ms = 2400) => {
      bubble.textContent = txt;
      bubble.style.opacity = "1";
      bubble.style.transform = "translateY(0) scale(1)";
      clearTimeout(sayTimer);
      sayTimer = setTimeout(() => {
        bubble.style.opacity = "0";
        bubble.style.transform = "translateY(6px) scale(.92)";
      }, ms);
    };
    const blink = () => {
      svg.classList.add("af-blink");
      setTimeout(() => svg.classList.remove("af-blink"), 150);
    };
    const anim = (name: string, dur: number) => {
      flip.style.animation = "none";
      void flip.offsetWidth;
      flip.style.animation = `${name} ${dur}ms cubic-bezier(.3,1.05,.4,1)`;
      state.busy = true;
      setTimeout(() => {
        flip.style.animation = "none";
        state.busy = false;
      }, dur);
    };
    const sparkles = (n: number) => {
      const cols = ["#e2916f", "#ecc06a", "#ec78a0", "#9bccac"];
      for (let i = 0; i < n; i++) {
        const s = document.createElement("div");
        s.style.cssText = "position:absolute;z-index:8;width:13px;height:13px;left:50%;top:42%;pointer-events:none;";
        s.innerHTML = `<svg viewBox="0 0 12 12" width="13" height="13"><path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="${cols[i % 4]}"/></svg>`;
        const a = Math.random() * 6.28, d = 60 + Math.random() * 70;
        s.style.setProperty("--dx", `${(Math.cos(a) * d).toFixed(0)}px`);
        s.style.setProperty("--dy", `${(Math.sin(a) * d - 18).toFixed(0)}px`);
        stage.appendChild(s);
        s.style.animation = `af-spark ${(820 + Math.random() * 480).toFixed(0)}ms ease-out forwards`;
        setTimeout(() => s.remove(), 1400);
      }
    };
    const doSkill = (sk: string) => {
      if (state.busy) return;
      if (sk === "flip") { say(pick(["Wheee!", "Salto!", "Se her!"]), 1200); anim("af-backflip", 1050); }
      else if (sk === "hop") { say("Hop!", 1100); anim("af-hop", 1000); }
      else if (sk === "spin") { say("Snurr!", 1100); anim("af-spin", 900); }
      else if (sk === "celebrate") {
        const o = state.mood; say("Hurra!", 1700); setMood("begejstret"); sparkles(18); anim("af-hop", 1100);
        setTimeout(() => setMood(o), 2000);
      }
    };

    ctrl.current = { setMood, say, doSkill, get mood() { return state.mood; }, get busy() { return state.busy; } } as never;

    // loops
    let blinkT: ReturnType<typeof setTimeout>;
    const loopBlink = () => {
      if (state.mood !== "soevnig") { blink(); if (Math.random() < 0.3) setTimeout(blink, 300); }
      blinkT = setTimeout(loopBlink, 2400 + Math.random() * 2600);
    };
    blinkT = setTimeout(loopBlink, 1400);
    const steamT = setTimeout(() => { steam.style.opacity = "1"; }, 300);

    const idleT = setInterval(() => {
      if (!state.busy && !typingRef.current && !loadingRef.current && state.mood !== "taenksom") say(pick(IDLE), 3600);
    }, 9000);

    const onMove = (e: MouseEvent) => {
      const b = svg.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height * 0.6;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const ang = Math.atan2(dy, dx), dist = Math.min(3.5, Math.hypot(dx, dy) / 45);
      if (state.mood !== "taenksom") {
        state.look = { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist };
        const f = FACES[state.mood];
        applyEyes(f.sy, f.sc);
      }
      if (!state.busy) {
        const ry = Math.max(-13, Math.min(13, (dx / b.width) * 20));
        const rx = 6 + Math.max(-11, Math.min(11, (-dy / b.height) * 18));
        tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    const onClick = () => { if (!state.busy) doSkill(["flip", "hop", "spin", "celebrate"][Math.floor(Math.random() * 4)]); };
    svg.addEventListener("click", onClick);

    setMood("glad");
    setTimeout(() => say("Hej! Jeg er Astrid.", 2600), 600);

    return () => {
      clearTimeout(blinkT); clearTimeout(steamT); clearInterval(idleT); clearTimeout(sayTimer);
      window.removeEventListener("mousemove", onMove);
      svg.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep latest prop values for loops
  const typingRef = useRef(typing);
  const loadingRef = useRef(loading);
  typingRef.current = typing;
  loadingRef.current = loading;

  // react to loading
  const prevLoading = useRef(false);
  useEffect(() => {
    const c = ctrl.current;
    if (!c) return;
    if (loading) { c.setMood("taenksom"); c.say(pick(THINKING), 2600); }
    else if (prevLoading.current) {
      c.setMood("begejstret"); c.say(pick(ANSWER), 1500); c.doSkill("hop");
      setTimeout(() => c.setMood(chatActive ? "glad" : "glad"), 1800);
    }
    prevLoading.current = loading;
  }, [loading, chatActive]);

  // react to typing
  const sayCool = useRef(false);
  useEffect(() => {
    const c = ctrl.current;
    if (!c || loading) return;
    if (typing) {
      if (c.mood !== "taenksom") c.setMood("rolig");
      if (!sayCool.current) {
        c.say(pick(TYPING), 1800);
        sayCool.current = true;
        setTimeout(() => (sayCool.current = false), 2400);
      }
    }
  }, [typing, loading]);

  return (
    <div ref={stageRef} style={{ perspective: 1100, width: 250, height: 290, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <style>{`
        @keyframes af-floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes af-breatheS{0%,100%{transform:scale(1)}50%{transform:scale(1.022)}}
        @keyframes af-glowP{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.85;transform:scale(1.05)}}
        @keyframes af-steamR{0%{opacity:0;transform:translateY(7px)}30%{opacity:.6}100%{opacity:0;transform:translateY(-12px)}}
        @keyframes af-backflip{0%{transform:rotateX(0) translateY(0) translateZ(0)}28%{transform:rotateX(-130deg) translateY(-42px) translateZ(28px)}55%{transform:rotateX(-228deg) translateY(-48px) translateZ(28px)}100%{transform:rotateX(-360deg) translateY(0) translateZ(0)}}
        @keyframes af-hop{0%,100%{transform:translateY(0)}25%{transform:translateY(-34px)}45%{transform:translateY(0)}62%{transform:translateY(-15px)}82%{transform:translateY(0)}}
        @keyframes af-spin{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}
        @keyframes af-spark{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.1)}}
        .af-float{animation:af-floatY 4.6s ease-in-out infinite}
        .af-breathe{animation:af-breatheS 3.7s ease-in-out infinite}
        .af-tilt{transform:rotateX(6deg)}
        .af-eye{transition:transform .12s ease}
        .af-blink .af-eye{transform:scaleY(.12)!important}
        .af-s1{animation:af-steamR 3s ease-in-out infinite}
        .af-s2{animation:af-steamR 3s ease-in-out .55s infinite}
        .af-s3{animation:af-steamR 3s ease-in-out 1.1s infinite}
      `}</style>

      <div ref={glowRef} style={{ position: "absolute", inset: "16% 12%", borderRadius: "50%", background: "radial-gradient(circle, var(--gl,rgba(226,145,111,.4)) 0%, transparent 65%)", transition: "background .5s ease", zIndex: 0, animation: "af-glowP 4.8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "12%", left: "50%", width: 140, height: 20, transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(70,55,42,.26) 0%, transparent 70%)", zIndex: 1 }} />

      <div ref={bubbleRef} className="k-talebobl" style={{ position: "absolute", zIndex: 9, top: -14, right: -36, maxWidth: 150, opacity: 0, transform: "translateY(6px) scale(.92)", transition: "all .26s cubic-bezier(.2,1.4,.4,1)", pointerEvents: "none" }}>
        Hej!
      </div>

      <div className="af-float" style={{ zIndex: 2, position: "relative" }}>
        <div className="af-breathe">
          <div ref={flipRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            <div ref={tiltRef} className="af-tilt" style={{ width: 230, height: 230, transition: "transform .16s ease-out", transformStyle: "preserve-3d", willChange: "transform" }}>
              <svg ref={svgRef} viewBox="0 0 300 300" width="230" height="230" style={{ display: "block", overflow: "visible", cursor: "pointer" }} role="img" aria-label="Astrid">
                <defs>
                  <linearGradient id="af-cup" x1="0.15" y1="0" x2="0.85" y2="1">
                    <stop offset="0%" stopColor="#d2e2cb" /><stop offset="38%" stopColor="#aec9a6" /><stop offset="72%" stopColor="#8aa983" /><stop offset="100%" stopColor="#6c8a67" />
                  </linearGradient>
                  <radialGradient id="af-coffee" cx="40%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#945f41" /><stop offset="100%" stopColor="#492b1d" />
                  </radialGradient>
                  <radialGradient id="af-hi" cx="32%" cy="24%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity=".55" /><stop offset="46%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="af-handle" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#9cb897" /><stop offset="100%" stopColor="#6c8a67" />
                  </linearGradient>
                </defs>

                <g ref={steamRef} fill="none" stroke="#e6d6c2" strokeWidth="6" strokeLinecap="round" opacity="0">
                  <path className="af-s1" d="M126,86 C118,72 134,64 126,50 C120,39 132,32 128,20" />
                  <path className="af-s2" d="M150,88 C142,74 158,66 150,52 C144,41 156,34 152,22" />
                  <path className="af-s3" d="M174,86 C166,72 182,64 174,50 C168,39 180,32 176,20" />
                </g>

                <path d="M214,140 C260,136 262,200 218,202" fill="none" stroke="#5f7d5a" strokeWidth="20" strokeLinecap="round" />
                <path d="M214,140 C260,136 262,200 218,202" fill="none" stroke="url(#af-handle)" strokeWidth="12" strokeLinecap="round" />
                <path d="M216,146 C250,143 252,190 220,194" fill="none" stroke="#bcd4b6" strokeWidth="3.5" strokeLinecap="round" opacity=".6" />

                <ellipse cx="150" cy="108" rx="80" ry="17" fill="#5f7d5a" />
                <path d="M72,112 C72,104 78,100 86,100 L214,100 C222,100 228,104 228,112 L218,214 C216,233 197,243 150,243 C103,243 84,233 82,214 Z" fill="url(#af-cup)" />
                <path d="M72,112 C72,104 78,100 86,100 L214,100 C222,100 228,104 228,112 L218,214 C216,233 197,243 150,243 C103,243 84,233 82,214 Z" fill="url(#af-hi)" />
                <path d="M88,116 C85,112 90,107 95,108 C89,150 94,205 107,236 C97,232 89,223 87,212 Z" fill="#ffffff" opacity=".25" />
                <path d="M210,112 C214,150 212,200 206,232" fill="none" stroke="#54724f" strokeWidth="5" strokeLinecap="round" opacity=".4" />

                <ellipse cx="150" cy="108" rx="68" ry="13" fill="#3f2618" />
                <ellipse cx="150" cy="106" rx="64" ry="11" fill="url(#af-coffee)" />
                <ellipse cx="133" cy="102" rx="24" ry="4" fill="#a87a55" opacity=".55" />

                <g>
                  <ellipse ref={cheekLRef} cx="116" cy="184" rx="13" ry="8" fill="#ef9f88" opacity=".6" />
                  <ellipse ref={cheekRRef} cx="184" cy="184" rx="13" ry="8" fill="#ef9f88" opacity=".6" />
                  <g fill="#d97f63" opacity=".7">
                    <circle cx="110" cy="182" r="1.4" /><circle cx="117" cy="180" r="1.4" /><circle cx="120" cy="186" r="1.4" />
                    <circle cx="180" cy="182" r="1.4" /><circle cx="187" cy="180" r="1.4" /><circle cx="184" cy="186" r="1.4" />
                  </g>
                  <g ref={eyeLRef} className="af-eye" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <ellipse cx="128" cy="168" rx="9" ry="13.5" fill="#3a2820" /><circle cx="124.5" cy="162.5" r="3" fill="#fff" /><circle cx="130" cy="171" r="1.4" fill="#fff" opacity=".7" />
                  </g>
                  <g ref={eyeRRef} className="af-eye" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <ellipse cx="172" cy="168" rx="9" ry="13.5" fill="#3a2820" /><circle cx="168.5" cy="162.5" r="3" fill="#fff" /><circle cx="174" cy="171" r="1.4" fill="#fff" opacity=".7" />
                  </g>
                  <path ref={smileRef} d="M131,194 Q150,212 169,194" fill="none" stroke="#3a2820" strokeWidth="5.5" strokeLinecap="round" />
                  <ellipse ref={mouthRef} cx="150" cy="198" rx="11" ry="8" fill="#3a2820" opacity="0" />
                </g>

                <g ref={thinkRef} opacity="0">
                  <circle cx="234" cy="92" r="5" fill="#7fa0c8" /><circle cx="249" cy="80" r="6.5" fill="#9db8d8" /><circle cx="266" cy="66" r="8.5" fill="#c2d4ea" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
