// Lille, selvstændig konfetti-effekt — ingen eksterne pakker.
// Bruger Web Animations API og rydder op efter sig selv. Respekterer reduced-motion.

function playConfettiSound() {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const c = new AC();
    if (c.state === "suspended") c.resume();
    const now = c.currentTime;
    const master = c.createGain(); master.gain.value = 0.5; master.connect(c.destination);
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      const t0 = now + i * 0.05;
      const o = c.createOscillator(); o.type = "triangle"; o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
      o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + 0.45);
    });
    setTimeout(() => { try { c.close(); } catch {} }, 1100);
  } catch {
    // lyd kan vaere blokeret
  }
}

export function fireConfetti(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch {
    // fortsæt
  }

  playConfettiSound();

  const colors = ["#e3794d", "#86bd8f", "#f7baa0", "#f0c33c", "#5ea36f", "#8f4327"];
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden";

  const N = 40;
  for (let i = 0; i < N; i++) {
    const p = document.createElement("div");
    const size = 6 + Math.random() * 8;
    const left = Math.random() * 100;
    const color = colors[(Math.random() * colors.length) | 0];
    const dur = 1100 + Math.random() * 1000;
    const delay = Math.random() * 250;
    const rot = (Math.random() * 720 - 360) | 0;
    const drift = (Math.random() * 160 - 80) | 0;
    p.style.cssText =
      "position:absolute;top:-24px;left:" + left + "vw;width:" + size + "px;height:" +
      size * 0.6 + "px;background:" + color + ";border-radius:2px;will-change:transform,opacity";
    p.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + drift + "px, 100vh) rotate(" + rot + "deg)", opacity: 1, offset: 0.85 },
        { transform: "translate(" + drift + "px, 106vh) rotate(" + rot + "deg)", opacity: 0 },
      ],
      { duration: dur, delay, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" }
    );
    container.appendChild(p);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 2400);
}
