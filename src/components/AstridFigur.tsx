"use client";

import { useEffect, useRef } from "react";

type Mood = "glad" | "begejstret" | "rolig" | "taenksom" | "soevnig" | "stolt" | "nysgerrig" | "kaerlig" | "fokuseret" | "fjollet";

// Korte inspark — mange forskellige, få ord ad gangen
const IDLE = [
  "§20: 4 mdr. ⏳", "Barnet i midten.", "Ikke skrevet = ikke sket 📝",
  "Belys også modargumentet.", "Efterværn = ungestøtte nu.", "Partshøring før afgørelse.",
  "Anonymisér først 👀", "Barnets stemme tæller.", "Samvær er barnets ret.",
  "Underret hellere for tidligt.", "Skriv notatet nu.", "Koffein + paragraffer ☕",
  "Jeg holder hovedet koldt.", "Elsker en god deadline.", "Tjek tilsynsrapporten 👀",
  "ICS: barnet i centrum.", "§32 — min yndlings.", "Børnesamtalen før afgørelsen.",
  "Officialprincippet, husk det.", "Notatpligt er din ven.", "En klar handleplan letter alt.",
  "GDPR ser alt 👀", "Hvad siger Ankestyrelsen?", "Tag den svære samtale tidligt.",
  "Genbehandlingsfrist i kalenderen.", "Skal vi tjekke en frist?", "Jeg er på din side ♡",
  "Dokumentation redder sager.", "Du bestemmer — jeg støtter.", "Kaffepause? God idé ☕",
];
const TYPING = ["Mmm, jeg lytter…", "Fortæl…", "Spændende!", "Okay…", "Skriv løs ☕", "Jeg er klar.", "Interessant…", "Ja, fortsæt…", "Jeg noterer…", "Mhm…"];
const THINKING = ["Lad mig lige tænke…", "Et øjeblik…", "Tygger på det…", "Slår det op…", "Hmm…", "Regner på det…", "Lige et sek…", "Tænker med…"];
const ANSWER = ["Sådan!", "Værsgo ✨", "Her!", "Klar!", "Tjek det her.", "Håber det hjælper!", "Sådan ja!", "Færdig ✨"];
const MOOD_QUIP: Record<string, string[]> = {
  stolt: ["Det klarede vi flot!", "Stolt af os to.", "Godt arbejde!"],
  nysgerrig: ["Hov, hvad er det?", "Spændende sag…", "Fortæl mig mere!"],
  kaerlig: ["Pas på dig selv ♡", "Du gør det godt.", "Jeg er her for dig ♡"],
  fjollet: ["Wheee!", "Kaffe-dans! ☕", "Hehe…"],
  fokuseret: ["Nu er jeg skarp.", "Fokus på.", "Lad os løse det."],
  rolig: ["Helt roligt.", "Vi tager den med ro.", "Træk vejret ☕"],
};

const FACES: Record<Mood, { gl: string; smile: string | null; mouth: number; sy: number; sc: number; cheek: number; lookUp?: number }> = {
  glad: { gl: "rgba(226,145,111,.45)", smile: "M129,193 Q150,212 171,193", mouth: 0, sy: 1, sc: 1, cheek: 0.65 },
  begejstret: { gl: "rgba(236,120,160,.55)", smile: null, mouth: 1, sy: 1, sc: 1.18, cheek: 0.9 },
  rolig: { gl: "rgba(150,200,150,.42)", smile: "M133,194 Q150,203 167,194", mouth: 0, sy: 1, sc: 1, cheek: 0.5 },
  taenksom: { gl: "rgba(127,160,200,.5)", smile: "M135,195 Q150,199 165,195", mouth: 0, sy: 1, sc: 1, cheek: 0.45, lookUp: 1 },
  soevnig: { gl: "rgba(150,150,170,.34)", smile: "M137,196 Q150,201 163,196", mouth: 0, sy: 0.32, sc: 1, cheek: 0.4 },
  stolt: { gl: "rgba(236,192,106,.5)", smile: "M129,192 Q150,210 171,192", mouth: 0, sy: 1, sc: 1.05, cheek: 0.6, lookUp: 1 },
  nysgerrig: { gl: "rgba(93,200,180,.48)", smile: "M134,193 Q150,205 167,193", mouth: 0, sy: 1, sc: 1.12, cheek: 0.55 },
  kaerlig: { gl: "rgba(236,120,160,.5)", smile: "M130,193 Q150,209 170,193", mouth: 0, sy: 1, sc: 1, cheek: 0.92 },
  fokuseret: { gl: "rgba(110,170,160,.46)", smile: "M134,195 Q150,200 166,195", mouth: 0, sy: 0.78, sc: 1, cheek: 0.42 },
  fjollet: { gl: "rgba(244,180,90,.55)", smile: null, mouth: 1, sy: 1, sc: 1.14, cheek: 0.85 },
};

const AMBIENT: Mood[] = ["nysgerrig", "stolt", "kaerlig", "rolig", "fjollet", "fokuseret"];
const CLICK_SKILLS = ["backflip", "frontflip", "spin", "hop", "bigjump", "dance", "shake", "nod", "wiggle"];
const MINI_SKILLS = ["minihop", "wiggle", "nod"];
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

  const ctrl = useRef<{ setMood: (m: Mood) => void; say: (t: string, ms?: number) => void; doSkill: (s: string) => void; mood: Mood; busy: boolean } | null>(null);
  const typingRef = useRef(typing);
  const loadingRef = useRef(loading);
  typingRef.current = typing;
  loadingRef.current = loading;

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
      eyeL.style.transform = t; eyeR.style.transform = t;
    };
    const setMood = (m: Mood) => {
      state.mood = m; const f = FACES[m];
      glow.style.setProperty("--gl", f.gl);
      smile.style.opacity = f.mouth ? "0" : "1";
      if (f.smile) smile.setAttribute("d", f.smile);
      mouth.setAttribute("opacity", f.mouth ? "1" : "0");
      cheekL.setAttribute("opacity", String(f.cheek)); cheekR.setAttribute("opacity", String(f.cheek));
      state.look = { x: 0, y: f.lookUp ? -3 : 0 }; applyEyes(f.sy, f.sc);
      think.setAttribute("opacity", m === "taenksom" ? "1" : "0");
    };
    const say = (txt: string, ms = 2400) => {
      bubble.textContent = txt; bubble.style.opacity = "1"; bubble.style.transform = "translateY(0) scale(1)";
      clearTimeout(sayTimer);
      sayTimer = setTimeout(() => { bubble.style.opacity = "0"; bubble.style.transform = "translateY(6px) scale(.92)"; }, ms);
    };
    const blink = () => { svg.classList.add("af-blink"); setTimeout(() => svg.classList.remove("af-blink"), 150); };
    const anim = (name: string, dur: number) => {
      flip.style.animation = "none"; void flip.offsetWidth;
      flip.style.animation = `${name} ${dur}ms cubic-bezier(.3,1.05,.4,1)`;
      state.busy = true;
      setTimeout(() => { flip.style.animation = "none"; state.busy = false; }, dur);
    };
    const sparkles = (n: number) => {
      const cols = ["#e2916f", "#ecc06a", "#ec78a0", "#9bccac", "#f4b45a"];
      for (let i = 0; i < n; i++) {
        const s = document.createElement("div");
        s.style.cssText = "position:absolute;z-index:8;width:13px;height:13px;left:50%;top:42%;pointer-events:none;";
        s.innerHTML = `<svg viewBox="0 0 12 12" width="13" height="13"><path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="${cols[i % 5]}"/></svg>`;
        const a = Math.random() * 6.28, d = 60 + Math.random() * 78;
        s.style.setProperty("--dx", `${(Math.cos(a) * d).toFixed(0)}px`);
        s.style.setProperty("--dy", `${(Math.sin(a) * d - 18).toFixed(0)}px`);
        stage.appendChild(s);
        s.style.animation = `af-spark ${(820 + Math.random() * 520).toFixed(0)}ms ease-out forwards`;
        setTimeout(() => s.remove(), 1400);
      }
    };
    const SKILL_ANIM: Record<string, [string, number]> = {
      backflip: ["af-backflip", 1050], frontflip: ["af-frontflip", 1050], spin: ["af-spin", 900],
      hop: ["af-hop", 950], bigjump: ["af-bigjump", 1050], dance: ["af-dance", 1300],
      shake: ["af-shake", 700], nod: ["af-nod", 700], wiggle: ["af-wiggle", 800], minihop: ["af-minihop", 600],
    };
    const SKILL_SAY: Record<string, string[]> = {
      backflip: ["Wheee!", "Salto!", "Se her!"], frontflip: ["Forlæns!", "Hop-la!"], spin: ["Snurr!", "Rundt!"],
      hop: ["Hop!", "Bsh!"], bigjump: ["Højt!", "Yeehaa!"], dance: ["Kaffe-dans! ☕", "La-la-la~"],
      shake: ["Nej nej…", "Niks."], nod: ["Ja!", "Nemlig."], wiggle: ["Hihi~", "Kilder!"], minihop: ["Hop!", "Pjut!"],
    };
    const doSkill = (sk: string) => {
      if (state.busy) return;
      const a = SKILL_ANIM[sk]; if (!a) return;
      if (SKILL_SAY[sk]) say(pick(SKILL_SAY[sk]), 1200);
      if (sk === "dance" || sk === "bigjump" || sk === "frontflip") sparkles(sk === "dance" ? 14 : 10);
      anim(a[0], a[1]);
    };

    ctrl.current = { setMood, say, doSkill, get mood() { return state.mood; }, get busy() { return state.busy; } } as never;

    // blink loop (varieret)
    let blinkT: ReturnType<typeof setTimeout>;
    const loopBlink = () => {
      if (state.mood !== "soevnig") { blink(); if (Math.random() < 0.35) setTimeout(blink, 280); }
      blinkT = setTimeout(loopBlink, 2000 + Math.random() * 2600);
    };
    blinkT = setTimeout(loopBlink, 1200);
    const steamT = setTimeout(() => { steam.style.opacity = "1"; }, 300);

    // livlig idle-loop: skifter mellem quip, lille bevægelse, og ambient-humør
    const idleT = setInterval(() => {
      if (state.busy || typingRef.current || loadingRef.current) return;
      const r = Math.random();
      if (r < 0.34) {
        say(pick(IDLE), 3400);
      } else if (r < 0.62) {
        doSkill(pick(MINI_SKILLS));
      } else {
        const m = pick(AMBIENT) as Mood;
        setMood(m);
        if (MOOD_QUIP[m]) say(pick(MOOD_QUIP[m]), 3000);
        if (m === "fjollet") sparkles(8);
        setTimeout(() => { if (!state.busy && !typingRef.current && !loadingRef.current) setMood("glad"); }, 3200);
      }
    }, 5200);

    const onMove = (e: MouseEvent) => {
      const b = svg.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height * 0.58;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const ang = Math.atan2(dy, dx), dist = Math.min(3.5, Math.hypot(dx, dy) / 45);
      if (state.mood !== "taenksom") {
        state.look = { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist };
        const f = FACES[state.mood]; applyEyes(f.sy, f.sc);
      }
      if (!state.busy) {
        const ry = Math.max(-14, Math.min(14, (dx / b.width) * 22));
        const rx = 6 + Math.max(-12, Math.min(12, (-dy / b.height) * 20));
        tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    const onClick = () => {
      if (state.busy) return;
      doSkill(pick(CLICK_SKILLS));
      if (Math.random() < 0.5) {
        const m = pick(["begejstret", "fjollet", "stolt"]) as Mood;
        setMood(m);
        setTimeout(() => setMood("glad"), 1600);
      }
    };
    svg.addEventListener("click", onClick);

    setMood("glad");
    setTimeout(() => say("Hej! Jeg er Astrid.", 2600), 600);

    return () => {
      clearTimeout(blinkT); clearTimeout(steamT); clearInterval(idleT); clearTimeout(sayTimer);
      window.removeEventListener("mousemove", onMove); svg.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevLoading = useRef(false);
  useEffect(() => {
    const c = ctrl.current; if (!c) return;
    if (loading) { c.setMood("taenksom"); c.say(pick(THINKING), 2600); }
    else if (prevLoading.current) {
      const m = pick(["begejstret", "stolt"]) as Mood;
      c.setMood(m); c.say(pick(ANSWER), 1500); c.doSkill(pick(["hop", "nod", "bigjump"]));
      setTimeout(() => c.setMood("glad"), 1900);
    }
    prevLoading.current = loading;
  }, [loading]);

  const sayCool = useRef(false);
  useEffect(() => {
    const c = ctrl.current; if (!c || loading) return;
    if (typing) {
      if (c.mood !== "taenksom") c.setMood(Math.random() < 0.5 ? "nysgerrig" : "rolig");
      if (!sayCool.current) { c.say(pick(TYPING), 1800); sayCool.current = true; setTimeout(() => (sayCool.current = false), 2200); }
    }
  }, [typing, loading]);

  return (
    <div ref={stageRef} style={{ perspective: 1100, width: 250, height: 290, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <style>{`
        @keyframes af-floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes af-breatheS{0%,100%{transform:scale(1)}50%{transform:scale(1.024)}}
        @keyframes af-glowP{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.9;transform:scale(1.06)}}
        @keyframes af-steamR{0%{opacity:0;transform:translateY(7px)}30%{opacity:.6}100%{opacity:0;transform:translateY(-12px)}}
        @keyframes af-backflip{0%{transform:rotateX(0) translateY(0) translateZ(0)}28%{transform:rotateX(-130deg) translateY(-44px) translateZ(28px)}55%{transform:rotateX(-228deg) translateY(-50px) translateZ(28px)}100%{transform:rotateX(-360deg) translateY(0) translateZ(0)}}
        @keyframes af-frontflip{0%{transform:rotateX(0) translateY(0)}28%{transform:rotateX(130deg) translateY(-44px)}55%{transform:rotateX(228deg) translateY(-50px)}100%{transform:rotateX(360deg) translateY(0)}}
        @keyframes af-hop{0%,100%{transform:translateY(0)}25%{transform:translateY(-36px)}45%{transform:translateY(0)}62%{transform:translateY(-16px)}82%{transform:translateY(0)}}
        @keyframes af-minihop{0%,100%{transform:translateY(0)}40%{transform:translateY(-16px)}70%{transform:translateY(0)}}
        @keyframes af-bigjump{0%,100%{transform:translateY(0) scale(1,1)}15%{transform:translateY(0) scale(1.12,.85)}45%{transform:translateY(-62px) scale(.92,1.12)}75%{transform:translateY(0) scale(1.08,.9)}90%{transform:translateY(0) scale(1,1)}}
        @keyframes af-spin{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}
        @keyframes af-dance{0%,100%{transform:rotate(0) translateY(0)}20%{transform:rotate(-11deg) translateY(-8px)}40%{transform:rotate(9deg) translateY(0)}60%{transform:rotate(-8deg) translateY(-8px)}80%{transform:rotate(7deg) translateY(0)}}
        @keyframes af-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-12px) rotate(-4deg)}40%{transform:translateX(11px) rotate(4deg)}60%{transform:translateX(-8px) rotate(-3deg)}80%{transform:translateX(6px) rotate(2deg)}}
        @keyframes af-nod{0%,100%{transform:rotateX(0)}30%{transform:rotateX(26deg)}60%{transform:rotateX(-6deg)}}
        @keyframes af-wiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg)}50%{transform:rotate(9deg)}75%{transform:rotate(-5deg)}}
        @keyframes af-spark{0%{opacity:0;transform:translate(0,0) scale(.3)}30%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.1)}}
        @keyframes af-glint{0%,72%,100%{opacity:0;transform:scale(.6)}80%{opacity:.95;transform:scale(1.1)}88%{opacity:0;transform:scale(.6)}}
        #af-float{animation:af-floatY 4.6s ease-in-out infinite}
        #af-breathe{animation:af-breatheS 3.7s ease-in-out infinite}
        #af-tilt{transform:rotateX(6deg)}
        .af-eye{transition:transform .12s ease}
        .af-blink .af-eye{transform:scaleY(.1)!important}
        .af-s1{animation:af-steamR 3s ease-in-out infinite}
        .af-s2{animation:af-steamR 3s ease-in-out .55s infinite}
        .af-s3{animation:af-steamR 3s ease-in-out 1.1s infinite}
        .af-glint{animation:af-glint 6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
      `}</style>

      <div ref={glowRef} style={{ position: "absolute", inset: "16% 12%", borderRadius: "50%", background: "radial-gradient(circle, var(--gl,rgba(226,145,111,.45)) 0%, transparent 65%)", transition: "background .5s ease", zIndex: 0, animation: "af-glowP 4.8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "12%", left: "50%", width: 140, height: 20, transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(70,55,42,.26) 0%, transparent 70%)", zIndex: 1 }} />

      <div ref={bubbleRef} className="k-talebobl" style={{ position: "absolute", zIndex: 9, top: -14, right: -36, maxWidth: 150, opacity: 0, transform: "translateY(6px) scale(.92)", transition: "all .26s cubic-bezier(.2,1.4,.4,1)", pointerEvents: "none" }}>Hej!</div>

      <div id="af-float" style={{ zIndex: 2, position: "relative" }}>
        <div id="af-breathe">
          <div ref={flipRef} style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            <div ref={tiltRef} id="af-tilt" style={{ width: 230, height: 230, transition: "transform .16s ease-out", transformStyle: "preserve-3d", willChange: "transform" }}>
              <svg ref={svgRef} viewBox="0 0 300 300" width="230" height="230" style={{ display: "block", overflow: "visible", cursor: "pointer" }} role="img" aria-label="Astrid">
                <defs>
                  <linearGradient id="af-cup" x1="0.12" y1="0" x2="0.9" y2="1">
                    <stop offset="0%" stopColor="#dcebd6" /><stop offset="20%" stopColor="#cfe3c6" /><stop offset="52%" stopColor="#a6c39d" /><stop offset="80%" stopColor="#84a37d" /><stop offset="100%" stopColor="#5f7d5a" />
                  </linearGradient>
                  <radialGradient id="af-coffee" cx="40%" cy="28%" r="78%">
                    <stop offset="0%" stopColor="#9a6645" /><stop offset="60%" stopColor="#6d4126" /><stop offset="100%" stopColor="#3f2417" />
                  </radialGradient>
                  <radialGradient id="af-hi" cx="30%" cy="20%" r="60%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity=".7" /><stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="af-handle" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a6c2a0" /><stop offset="100%" stopColor="#5f7d5a" />
                  </linearGradient>
                  <linearGradient id="af-shineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0" /><stop offset="50%" stopColor="#ffffff" stopOpacity=".85" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="af-cupclip">
                    <path d="M72,112 C72,104 78,100 86,100 L214,100 C222,100 228,104 228,112 L218,214 C216,233 197,243 150,243 C103,243 84,233 82,214 Z" />
                  </clipPath>
                </defs>

                <g ref={steamRef} fill="none" stroke="#e6d6c2" strokeWidth="6" strokeLinecap="round" opacity="0">
                  <path className="af-s1" d="M126,86 C118,72 134,64 126,50 C120,39 132,32 128,20" />
                  <path className="af-s2" d="M150,88 C142,74 158,66 150,52 C144,41 156,34 152,22" />
                  <path className="af-s3" d="M174,86 C166,72 182,64 174,50 C168,39 180,32 176,20" />
                </g>

                <path d="M214,140 C260,136 262,200 218,202" fill="none" stroke="#5f7d5a" strokeWidth="20" strokeLinecap="round" />
                <path d="M214,140 C260,136 262,200 218,202" fill="none" stroke="url(#af-handle)" strokeWidth="12" strokeLinecap="round" />
                <path d="M216,146 C250,143 252,190 220,194" fill="none" stroke="#cfe3c6" strokeWidth="3.5" strokeLinecap="round" opacity=".7" />

                <ellipse cx="150" cy="108" rx="80" ry="17" fill="#5f7d5a" />
                <path d="M72,112 C72,104 78,100 86,100 L214,100 C222,100 228,104 228,112 L218,214 C216,233 197,243 150,243 C103,243 84,233 82,214 Z" fill="url(#af-cup)" />

                <g clipPath="url(#af-cupclip)">
                  <path d="M72,112 C72,104 78,100 86,100 L214,100 C222,100 228,104 228,112 L218,214 C216,233 197,243 150,243 C103,243 84,233 82,214 Z" fill="url(#af-hi)" />
                  <path d="M88,114 C84,110 90,106 96,107 C89,150 95,206 109,238 C98,234 89,224 87,212 Z" fill="#ffffff" opacity=".34" />
                  <ellipse cx="104" cy="135" rx="11" ry="30" fill="#ffffff" opacity=".22" transform="rotate(-18 104 135)" />
                  <polygon points="70,86 96,86 76,264 50,264" fill="url(#af-shineGrad)" opacity=".55">
                    <animateTransform attributeName="transform" type="translate" values="-150,0; 215,0; 215,0" keyTimes="0;0.17;1" dur="4.8s" repeatCount="indefinite" />
                  </polygon>
                </g>
                <path d="M210,114 C214,150 212,200 206,232" fill="none" stroke="#4f6b4a" strokeWidth="5" strokeLinecap="round" opacity=".4" />

                <ellipse cx="150" cy="108" rx="68" ry="13" fill="#3f2417" />
                <ellipse cx="150" cy="106" rx="64" ry="11" fill="url(#af-coffee)" />
                <ellipse cx="134" cy="101" rx="26" ry="4.5" fill="#c69a72" opacity=".6" />
                <ellipse cx="128" cy="101" rx="9" ry="2" fill="#ffffff" opacity=".5" />

                <g>
                  <ellipse ref={cheekLRef} cx="116" cy="184" rx="13" ry="8" fill="#ef9f88" opacity=".6" />
                  <ellipse ref={cheekRRef} cx="184" cy="184" rx="13" ry="8" fill="#ef9f88" opacity=".6" />
                  <g fill="#d97f63" opacity=".7">
                    <circle cx="110" cy="182" r="1.4" /><circle cx="117" cy="180" r="1.4" /><circle cx="120" cy="186" r="1.4" />
                    <circle cx="180" cy="182" r="1.4" /><circle cx="187" cy="180" r="1.4" /><circle cx="184" cy="186" r="1.4" />
                  </g>
                  <g ref={eyeLRef} className="af-eye" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <ellipse cx="128" cy="168" rx="9" ry="13.5" fill="#3a2820" /><circle cx="124.5" cy="162.5" r="3.2" fill="#fff" /><circle cx="130" cy="171" r="1.5" fill="#fff" opacity=".75" />
                  </g>
                  <g ref={eyeRRef} className="af-eye" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <ellipse cx="172" cy="168" rx="9" ry="13.5" fill="#3a2820" /><circle cx="168.5" cy="162.5" r="3.2" fill="#fff" /><circle cx="174" cy="171" r="1.5" fill="#fff" opacity=".75" />
                  </g>
                  <path ref={smileRef} d="M129,193 Q150,212 171,193" fill="none" stroke="#3a2820" strokeWidth="5.5" strokeLinecap="round" />
                  <ellipse ref={mouthRef} cx="150" cy="198" rx="11" ry="8" fill="#3a2820" opacity="0" />
                </g>

                <path className="af-glint" d="M214,118 l2.2,5 l5,2.2 l-5,2.2 l-2.2,5 l-2.2,-5 l-5,-2.2 l5,-2.2 Z" fill="#ffffff" />

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
