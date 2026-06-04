"use client";

import { useEffect, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant"; content: string };

export default function KarlaLanding() {
  const [greeting, setGreeting] = useState("Hej kollega — godt at se dig.");
  const [timeLabel, setTimeLabel] = useState("Søndag eftermiddag");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pupilLRef = useRef<SVGEllipseElement>(null);
  const pupilRRef = useRef<SVGEllipseElement>(null);
  const smileRef = useRef<SVGPathElement>(null);
  const blobRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const now = new Date();
    const h = now.getHours();
    let part = "aften";
    let g = "Hej kollega — godt at se dig.";
    if (h < 10) { part = "morgen"; g = "Godmorgen, kollega — kaffen er varm."; }
    else if (h < 14) { part = "formiddag"; g = "God formiddag — hvordan starter dagen?"; }
    else if (h < 18) { part = "eftermiddag"; g = "God eftermiddag — træk lige vejret."; }
    else if (h < 22) { part = "aften"; g = "God aften — du har gjort nok i dag."; }
    else { part = "nat"; g = "Du er sent oppe, kollega."; }
    setTimeLabel(`${days[now.getDay()]} ${part}`);
    setGreeting(g);

    const handler = (e: MouseEvent) => {
      const blob = blobRef.current;
      if (!blob) return;
      const r = blob.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      const f = Math.min(6, d) / Math.max(1, d);
      const ox = dx * f * 0.16;
      const oy = dy * f * 0.16;
      if (pupilLRef.current) {
        pupilLRef.current.setAttribute("cx", String(88 + ox));
        pupilLRef.current.setAttribute("cy", String(80 + oy));
      }
      if (pupilRRef.current) {
        pupilRRef.current.setAttribute("cx", String(128 + ox));
        pupilRRef.current.setAttribute("cy", String(80 + oy));
      }
      if (smileRef.current) {
        if (d < 320) smileRef.current.setAttribute("d", "M82,128 Q108,158 134,128");
        else smileRef.current.setAttribute("d", "M85,130 Q108,150 131,130");
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;
    const history: ChatMsg[] = [...messages, { role: "user", content: t }];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(err || "Serverfejl");
      }
      if (!res.body) throw new Error("Tomt svar");

      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }
    } catch (e) {
      const msg =
        e instanceof Error && e.message && !e.message.includes("fetch")
          ? e.message
          : "Hov — jeg kunne ikke få forbindelse lige nu. Prøv igen om et øjeblik.";
      setMessages((m) => {
        const copy = [...m];
        if (copy.length > 0 && copy[copy.length - 1].role === "assistant" && copy[copy.length - 1].content === "") {
          copy[copy.length - 1] = { role: "assistant", content: msg };
          return copy;
        }
        return [...copy, { role: "assistant", content: msg }];
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const chatActive = messages.length > 0;

  return (
    <div ref={wrapRef} className="min-h-screen flex flex-col" style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)" }}>

      <nav className="flex justify-between items-center px-6 md:px-12 py-6 border-b" style={{ borderColor: "var(--kaerne-border)" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 16, letterSpacing: "0.5em", fontWeight: 300 }}>
          K Æ R N E
        </div>
        <div className="hidden md:flex gap-7 text-[13px]" style={{ color: "#7a7268" }}>
          <a href="#feltet" className="cursor-pointer hover:opacity-70 transition-opacity">Feltet</a>
          <a href="#manifest" className="cursor-pointer hover:opacity-70 transition-opacity">Manifest</a>
          <a href="/login" className="cursor-pointer hover:opacity-70 transition-opacity">Log ind</a>
        </div>
        <a href="/signup" className="text-[13px] px-5 py-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity" style={{ color: "var(--kaerne-sand)", background: "var(--kaerne-ink)" }}>
          Aktivér →
        </a>
      </nav>

      <main className="flex-1 px-6 md:px-12 py-12 md:py-16">
        <div className="grid md:grid-cols-[260px_1fr] gap-12 items-start max-w-6xl mx-auto">

          <div className="relative w-[240px] h-[280px] flex items-center justify-center mx-auto md:mx-0 md:sticky md:top-8">
            <div
              className="k-aura absolute w-[220px] h-[220px] rounded-full"
              style={{ background: "#fde4d4", zIndex: 1 }}
            />

            <svg className="k-bubble absolute" style={{ top: -8, right: -36, zIndex: 5 }} width="148" height="64" viewBox="0 0 140 60">
              <path
                d="M10,28 Q10,8 30,8 L118,8 Q132,8 132,22 L132,32 Q132,46 118,46 L42,46 L26,56 L30,46 Q10,46 10,32 Z"
                fill="#fff"
                stroke="var(--kaerne-border)"
                strokeWidth="0.5"
              />
              <text x="71" y="32" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="13" fill="var(--kaerne-ink)">
                {loading ? "Hmm, lad mig tænke..." : chatActive ? "Jeg lytter ♡" : "Hej, det er mig!"}
              </text>
            </svg>

            <div className="k-wave relative" style={{ zIndex: 2 }}>
              <svg ref={blobRef} className="k-blob-wrap" width="220" height="220" viewBox="0 0 220 220">
                <defs>
                  <radialGradient id="kgblob" cx="42%" cy="40%">
                    <stop offset="0%" stopColor="var(--kaerne-sage-light)" />
                    <stop offset="55%" stopColor="var(--kaerne-sage)" />
                    <stop offset="100%" stopColor="var(--kaerne-sage-deep)" />
                  </radialGradient>
                  <radialGradient id="kgcheek" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="var(--kaerne-peach)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="var(--kaerne-peach)" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path
                  d="M110,20 C156,22 192,52 198,98 C206,148 174,196 118,202 C66,206 22,178 16,124 C10,72 56,18 110,20 Z"
                  fill="url(#kgblob)"
                />
                <ellipse cx="68" cy="118" rx="22" ry="14" fill="url(#kgcheek)" />
                <ellipse cx="158" cy="118" rx="22" ry="14" fill="url(#kgcheek)" />
                <g>
                  <ellipse ref={pupilLRef} className="k-eye-l" cx="88" cy="80" rx="9" ry="13" fill="#3a4636" />
                  <ellipse cx="86" cy="74" rx="3" ry="4" fill="#fff" opacity="0.95" />
                </g>
                <g>
                  <ellipse ref={pupilRRef} className="k-eye-r" cx="128" cy="80" rx="9" ry="13" fill="#3a4636" />
                  <ellipse cx="126" cy="74" rx="3" ry="4" fill="#fff" opacity="0.95" />
                </g>
                <path
                  ref={smileRef}
                  d="M85,130 Q108,150 131,130"
                  stroke="#3a4636"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle className="k-sparkle" cx="38" cy="62" r="2.5" fill="var(--kaerne-terracotta)" style={{ animationDelay: "0s" }} />
                <circle className="k-sparkle" cx="182" cy="50" r="2" fill="var(--kaerne-terracotta)" style={{ animationDelay: "0.8s" }} />
                <circle className="k-sparkle" cx="40" cy="170" r="1.8" fill="var(--kaerne-sage)" style={{ animationDelay: "1.4s" }} />
                <circle className="k-sparkle" cx="186" cy="172" r="2.2" fill="var(--kaerne-terracotta)" style={{ animationDelay: "2.1s" }} />
              </svg>
            </div>

            <div className="absolute -bottom-1 left-0 right-0 text-center">
              <div style={{ fontFamily: "var(--font-script)", fontSize: 24, color: "var(--kaerne-ink)", lineHeight: 1 }}>Karla</div>
              <div className="mt-1" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--kaerne-muted)", textTransform: "uppercase" }}>
                din digitale kollega
              </div>
            </div>
          </div>

          <div>
            <div className="k-fade1 mb-3 text-[11px]" style={{ letterSpacing: "0.2em", color: "var(--kaerne-sage)", textTransform: "uppercase" }}>
              {timeLabel}
            </div>
            <h1 className="k-fade2 mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.015em", color: "var(--kaerne-ink)" }}>
              {greeting}
            </h1>
            {!chatActive && (
              <p className="k-fade3 mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, lineHeight: 1.55, color: "var(--kaerne-ink-soft)" }}>
                Hvordan har du det i dag? <br />Lad os tage tingene roligt, sammen.
              </p>
            )}

            {chatActive && (
              <div
                className="mb-5 max-h-[46vh] overflow-y-auto pr-1 flex flex-col gap-3"
                aria-live="polite"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-[16px] px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "self-end" : "self-start"
                    }`}
                    style={
                      m.role === "user"
                        ? { background: "var(--kaerne-ink)", color: "var(--kaerne-sand)" }
                        : { background: "#fff", border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink)" }
                    }
                  >
                    {m.role === "assistant" && (
                      <div className="mb-1" style={{ fontFamily: "var(--font-script)", fontSize: 14, color: "var(--kaerne-terracotta)" }}>
                        Karla
                      </div>
                    )}
                    {m.content || (
                      <span className="inline-flex gap-1 items-center" aria-label="Karla skriver">
                        <span className="k-dot" style={{ animationDelay: "0s" }}>·</span>
                        <span className="k-dot" style={{ animationDelay: "0.2s" }}>·</span>
                        <span className="k-dot" style={{ animationDelay: "0.4s" }}>·</span>
                      </span>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            <form
              className="k-fade4 relative"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-white rounded-[18px] py-[18px] pl-6 pr-16 text-[15px] focus:outline-none transition-colors"
                style={{ border: "0.5px solid var(--kaerne-border)" }}
                placeholder={chatActive ? "Skriv til Karla..." : "Skriv til mig — bare som du tænker..."}
                aria-label="Skriv til Karla"
                disabled={loading}
              />
              <button
                type="submit"
                aria-label="Send til Karla"
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: "var(--kaerne-terracotta)", color: "#fff" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            {!chatActive && (
              <div className="flex gap-2.5 mt-5 flex-wrap">
                <button onClick={() => send("Jeg tænker på en familie i en af mine sager — kan vi tale den igennem?")} className="k-chip cursor-pointer px-4 py-2.5 rounded-full text-[13px]">En familie jeg tænker på</button>
                <button onClick={() => send("Jeg leder efter en varm fagperson til en sag — hvordan finder jeg den rette?")} className="k-chip cursor-pointer px-4 py-2.5 rounded-full text-[13px]">Find en varm fagperson</button>
                <button onClick={() => send("Hvordan går mine sager?")} className="k-chip cursor-pointer px-4 py-2.5 rounded-full text-[13px]">Hvordan går mine sager?</button>
              </div>
            )}
          </div>
        </div>

        <div
          className="max-w-6xl mx-auto mt-16 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--kaerne-border), transparent)" }}
        />

        <div className="max-w-6xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.55, color: "var(--kaerne-ink-soft)", fontWeight: 300, maxWidth: 440 }}>
            <span style={{ color: "var(--kaerne-terracotta)", fontSize: 28, fontFamily: "Georgia, serif", lineHeight: 0 }}>&ldquo;</span>{" "}
            Ingen god sag bliver løst alene. Vi tager den sammen.{" "}
            <span style={{ color: "var(--kaerne-terracotta)", fontSize: 28, fontFamily: "Georgia, serif", lineHeight: 0 }}>&rdquo;</span>
            <div className="mt-2" style={{ fontSize: 11, color: "var(--kaerne-muted)", letterSpacing: "0.05em" }}>— Karla, hver morgen</div>
          </div>
          <div className="text-left md:text-right" style={{ fontSize: 11, color: "var(--kaerne-muted)" }}>
            <div className="mb-1">EU-hostet · GDPR · Barnets Lov</div>
            <div style={{ color: "var(--kaerne-terracotta)", fontFamily: "var(--font-script)", fontSize: 15 }}>
              Karla har holdt 247 i hånden i dag ♡
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 border-t text-center text-[11px]" style={{ borderColor: "var(--kaerne-border)", color: "var(--kaerne-muted)" }}>
        <span style={{ fontFamily: "var(--font-serif)" }}>K Æ R N E ApS</span> · CVR 0000-0000 · <a href="/manifest" className="hover:underline">Manifest</a> · <a href="/privacy" className="hover:underline">Privatlivspolitik</a>
      </footer>
    </div>
  );
}
