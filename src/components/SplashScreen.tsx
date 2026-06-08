"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Astrid opstarts-splash — foto-hero.
 * Det detaljerede Glif-kaffebillede er omdrejningspunktet: det toner blødt
 * ind og zoomer ganske langsomt (cinematisk), mens en slank "brygge"-progressbar
 * fyldes, et diskret lyssweep stryger forbi, og "System klar" dekrypteres frem.
 * Rent, præcist, professionelt. Vises én gang pr. session. Ingen lyd.
 */
const SPLASH_BG =
  "https://media.glif.app/i:r/c_limit,w_3840/f_auto/q_auto/abzcrlgaoishv9ypz0uu";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  const ovRef = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const motes = useRef<HTMLDivElement>(null);
  const nameEl = useRef<HTMLDivElement>(null);
  const loadLbl = useRef<HTMLDivElement>(null);
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
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const T = (f: () => void, ms: number) => timers.push(setTimeout(f, ms));

    // billede toner ind
    T(() => { if (img.current) img.current.style.opacity = "0.96"; }, 60);

    // sparsomme §-fnug stiger op (diskret detalje)
    T(() => {
      if (!motes.current) return;
      let n = 0;
      const iv = setInterval(() => {
        if (!motes.current || n >= 7) { clearInterval(iv); return; }
        n++;
        const s = document.createElement("div");
        s.textContent = "§";
        const size = 13 + Math.random() * 9;
        s.style.cssText = `position:absolute;left:${42 + Math.random() * 16}%;bottom:46%;font-size:${size}px;color:#6b513c;opacity:0;transform:translateY(0);transition:transform 3.4s cubic-bezier(.4,0,.5,1),opacity 3.4s ease;pointer-events:none;text-shadow:0 1px 6px rgba(255,247,235,.5)`;
        motes.current.appendChild(s);
        requestAnimationFrame(() => { s.style.opacity = "0.28"; s.style.transform = `translateY(-${120 + Math.random() * 70}px) rotate(${Math.random() * 24 - 12}deg)`; });
        timers.push(setTimeout(() => { s.style.opacity = "0"; }, 2600));
        timers.push(setTimeout(() => s.remove(), 3500));
      }, 520);
      intervals.push(iv);
    }, 1900);

    // progressbar "brygger"
    T(() => { if (bar.current) bar.current.style.width = "100%"; }, 900);

    // wordmark
    T(() => { if (nameEl.current) { nameEl.current.style.opacity = "1"; nameEl.current.style.transform = "translateY(0)"; } }, 2000);

    // lyssweep ét enkelt strøg
    T(() => { if (sweep.current) { sweep.current.style.transition = "transform 1.25s cubic-bezier(.4,0,.2,1), opacity .3s ease"; sweep.current.style.opacity = "1"; sweep.current.style.transform = "translateX(160%) skewX(-18deg)"; } }, 5200);
    T(() => { if (sweep.current) sweep.current.style.opacity = "0"; }, 6450);

    // progress færdig → label dekrypteres til "System klar"
    const decrypt = (el: HTMLDivElement, finalText: string, done?: () => void) => {
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ§◊0123456789";
      let frame = 0;
      const iv = setInterval(() => {
        frame++;
        const revealed = Math.floor(frame / 1.5);
        let out = "";
        for (let i = 0; i < finalText.length; i++) {
          const c = finalText[i];
          if (c === " " || c === "—") { out += c; continue; }
          out += i < revealed ? c : charset[Math.floor(Math.random() * charset.length)];
        }
        el.textContent = out;
        if (revealed >= finalText.length) { clearInterval(iv); el.textContent = finalText; done && done(); }
      }, 45);
      intervals.push(iv);
    };

    T(() => {
      if (loadLbl.current) { loadLbl.current.style.color = "#9a6a47"; decrypt(loadLbl.current, "System klar"); }
    }, 5600);
    T(() => { if (subEl.current) { subEl.current.style.opacity = "1"; decrypt(subEl.current, "Dit rolige arbejdsrum"); } }, 5900);

    // fade ud + væk
    T(() => { if (ovRef.current) ovRef.current.style.opacity = "0"; }, 8200);
    T(() => { setGone(true); }, 9800);

    return () => { timers.forEach(clearTimeout); intervals.forEach(clearInterval); };
  }, [show]);

  if (gone || !show) return null;

  return (
    <div ref={ovRef} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 40%,#fbf3e7 0%,#f3e7d4 55%,#e7d8bf 100%)", transition: "opacity 1.4s ease", overflow: "hidden" }}>
      <style>{`
        @keyframes asp-zoom{0%{transform:scale(1.075)}100%{transform:scale(1)}}
        .asp-hero{animation:asp-zoom 9.8s cubic-bezier(.22,.61,.36,1) forwards}
      `}</style>

      {/* foto-hero: detaljeret Glif-billede */}
      <div
        ref={img}
        className="asp-hero"
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `url('${SPLASH_BG}')`,
          backgroundSize: "cover", backgroundPosition: "center 42%",
          opacity: 0, transition: "opacity 1.4s ease",
          WebkitMaskImage: "radial-gradient(120% 110% at 50% 44%, #000 0%, #000 58%, rgba(0,0,0,.7) 78%, transparent 100%)",
          maskImage: "radial-gradient(120% 110% at 50% 44%, #000 0%, #000 58%, rgba(0,0,0,.7) 78%, transparent 100%)",
        }}
      />

      {/* blød bund-scrim så teksten er læsbar */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(247,240,228,0) 42%, rgba(247,240,228,.55) 74%, rgba(244,236,221,.9) 100%)", pointerEvents: "none" }} />

      {/* §-fnug der stiger op */}
      <div ref={motes} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* lyssweep */}
      <div ref={sweep} style={{ position: "absolute", top: 0, bottom: 0, left: "-30%", width: "32%", opacity: 0, transform: "translateX(-60%) skewX(-18deg)", background: "linear-gradient(90deg, transparent, rgba(255,251,242,.5), transparent)", pointerEvents: "none" }} />

      {/* indhold nederst-centreret */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "20%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 24px" }}>
        <div ref={nameEl} style={{ fontFamily: "var(--font-script, cursive)", fontSize: 64, color: "#2c2824", opacity: 0, transform: "translateY(12px)", transition: "all 1.1s cubic-bezier(.2,.8,.3,1)", lineHeight: 1, textShadow: "0 2px 22px rgba(226,145,111,.3)" }}>Astrid</div>

        <div ref={subEl} style={{ marginTop: 10, fontSize: 11, letterSpacing: ".34em", textTransform: "uppercase", color: "#b07a55", opacity: 0, transition: "opacity .8s ease", fontVariantNumeric: "tabular-nums", minHeight: 14 }}>Dit rolige arbejdsrum</div>

        {/* slank brygge-progressbar */}
        <div style={{ marginTop: 26, width: 168, display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
          <div style={{ width: "100%", height: 2, background: "rgba(120,92,67,.18)", borderRadius: 2, overflow: "hidden" }}>
            <div ref={bar} style={{ width: 0, height: "100%", background: "linear-gradient(90deg,#caa07a,#b06a45)", borderRadius: 2, transition: "width 4.6s cubic-bezier(.45,.05,.25,1)" }} />
          </div>
          <div ref={loadLbl} style={{ fontSize: 9.5, letterSpacing: ".26em", textTransform: "uppercase", color: "#a98a6e", fontVariantNumeric: "tabular-nums" }}>Brygger dit arbejdsrum</div>
        </div>
      </div>
    </div>
  );
}
