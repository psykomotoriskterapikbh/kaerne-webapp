"use client";

import { useEffect, useRef, useState } from "react";
import AktorMatch from "@/components/AktorMatch";

type ChatMsg = { role: "user" | "assistant"; content: string };

const CPR_REGEX = /\b\d{6}[-\s]?\d{4}\b/;

const CHIPS = [
  { label: "Sagssparring", prompt: "Jeg vil gerne sparre om en sag (anonymiseret). Hjælp mig med at strukturere den — hvad vil du vide?" },
  { label: "§ Paragraf-hjælp", prompt: "Jeg har brug for hjælp til at finde den rette paragraf i Barnets Lov eller Serviceloven. Hvor starter vi?" },
  { label: "Notat-hjælp", prompt: "Hjælp mig med at omsætte mine løse noter til et professionelt journalnotat." },
  { label: "Forbered et møde", prompt: "Jeg skal forberede et svært møde i en sag. Hjælp mig med dagsorden, de svære spørgsmål og borgerens perspektiv." },
  { label: "Find den rette indsats", prompt: "Jeg skal finde den rette type indsats og aktør til en sag. Hvad skal jeg overveje?" },
];

const FEATURES = [
  { titel: "Sagssparring", tekst: "Tænk højt med en kollega der altid har tid. Karla strukturerer sagen, finder oversete vinkler og holder borgerens perspektiv op." },
  { titel: "§ Paragraf-hjælp", tekst: "Fra gammel SEL til Barnets Lov på sekunder — §52 blev til §32, §76 til §§114-116. Karla kender begge regelsæt og forklarer i klart sprog." },
  { titel: "Notat- og udkasthjælp", tekst: "Tal eller skriv løst — Karla former det til journalnotat, mødereferat eller udkast til undersøgelse. Objektivt, og med observation adskilt fra vurdering." },
  { titel: "Aktør-match", tekst: "Filtrér aktører på paragraf, målgruppe og geografi — og få Karlas tjekliste til, hvad du skal afklare før valget." },
  { titel: "Kvalitetstjek — på vej", tekst: "Tjek dit afgørelsesudkast mod officialprincippet og Ankestyrelsens praksis, før det sendes." },
  { titel: "Frist-hjælper — på vej", tekst: "4-måneders fristen på den børnefaglige undersøgelse, opfølgninger og handleplaner — Karla holder styr på dem med dig." },
];

export default function KarlaLanding() {
  const [greeting, setGreeting] = useState("Hej kollega — godt at se dig.");
  const [timeLabel, setTimeLabel] = useState("Velkommen");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [gdprWarning, setGdprWarning] = useState(false);
  const pupilLRef = useRef<SVGEllipseElement>(null);
  const pupilRRef = useRef<SVGEllipseElement>(null);
  const smileRef = useRef<SVGPathElement>(null);
  const blobRef = useRef<SVGSVGElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const days = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
    const now = new Date();
    const h = now.getHours();
    let part = "aften";
    let g = "Hej kollega — godt at se dig.";
    if (h < 10) { part = "morgen"; g = "Godmorgen — skal vi tage dagens sager sammen?"; }
    else if (h < 14) { part = "formiddag"; g = "God formiddag — hvad arbejder du med?"; }
    else if (h < 18) { part = "eftermiddag"; g = "God eftermiddag — træk lige vejret."; }
    else if (h < 22) { part = "aften"; g = "God aften — lang dag i felten?"; }
    else { part = "nat"; g = "Sent oppe med en sag, kollega?"; }
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

    if (CPR_REGEX.test(t)) {
      setGdprWarning(true);
      return;
    }
    setGdprWarning(false);

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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)" }}>

      <nav className="flex justify-between items-center px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--kaerne-border)", background: "rgba(252,245,236,0.85)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: "var(--font-script)", fontSize: 28, lineHeight: 1 }}>Karla</span>
          <span className="hidden sm:inline" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--kaerne-muted)", textTransform: "uppercase" }}>
            din digitale kollega
          </span>
        </div>
        <div className="hidden md:flex gap-7 text-[13px]" style={{ color: "#7a7268" }}>
          <a href="#funktioner" className="cursor-pointer hover:opacity-70 transition-opacity">Funktioner</a>
          <a href="#aktoer" className="cursor-pointer hover:opacity-70 transition-opacity">Find aktør</a>
          <a href="#sikkerhed" className="cursor-pointer hover:opacity-70 transition-opacity">Sikkerhed</a>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); inputRef.current?.focus(); }} className="text-[13px] px-5 py-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity" style={{ color: "var(--kaerne-sand)", background: "var(--kaerne-ink)" }}>
          Tal med Karla →
        </a>
      </nav>

      <main className="flex-1 px-6 md:px-12 py-10 md:py-14">
        <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-start max-w-5xl mx-auto">

          <div className="relative w-[250px] h-[300px] flex items-center justify-center mx-auto md:mx-0 md:sticky md:top-28">
            <div
              className="k-aura absolute w-[230px] h-[230px] rounded-full"
              style={{ background: "radial-gradient(circle at 45% 40%, #fde9db 0%, #fde4d4 55%, rgba(253,228,212,0) 75%)", zIndex: 1 }}
            />

            <svg className="k-bubble absolute" style={{ top: -10, right: -34, zIndex: 5 }} width="150" height="64" viewBox="0 0 140 60">
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

            <div className="k-float relative" style={{ zIndex: 2 }}>
              <svg ref={blobRef} className="k-breathe" width="230" height="230" viewBox="0 0 220 220" style={{ filter: "drop-shadow(0 18px 22px rgba(90,80,72,0.18))" }}>
                <defs>
                  <radialGradient id="kgblob" cx="40%" cy="34%">
                    <stop offset="0%" stopColor="#d9ecc9" />
                    <stop offset="38%" stopColor="var(--kaerne-sage-light)" />
                    <stop offset="72%" stopColor="var(--kaerne-sage)" />
                    <stop offset="100%" stopColor="var(--kaerne-sage-deep)" />
                  </radialGradient>
                  <radialGradient id="kgcheek" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="var(--kaerne-peach)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="var(--kaerne-peach)" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="kgsheen" x1="0%" y1="0%" x2="60%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
                    <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="kgunder" cx="50%" cy="92%" r="65%">
                    <stop offset="0%" stopColor="#5d7050" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#5d7050" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <path
                  d="M110,20 C156,22 192,52 198,98 C206,148 174,196 118,202 C66,206 22,178 16,124 C10,72 56,18 110,20 Z"
                  fill="url(#kgblob)"
                />
                <path
                  d="M110,20 C156,22 192,52 198,98 C206,148 174,196 118,202 C66,206 22,178 16,124 C10,72 56,18 110,20 Z"
                  fill="url(#kgunder)"
                />
                <ellipse cx="76" cy="52" rx="42" ry="26" fill="url(#kgsheen)" transform="rotate(-18 76 52)" />
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
              <div className="k-shadow" />
            </div>

            <div className="absolute -bottom-2 left-0 right-0 text-center">
              <div style={{ fontFamily: "var(--font-script)", fontSize: 26, color: "var(--kaerne-ink)", lineHeight: 1 }}>Karla</div>
              <div className="mt-1" style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--kaerne-muted)", textTransform: "uppercase" }}>
                din digitale kollega
              </div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="k-fade1 mb-3 text-[11px]" style={{ letterSpacing: "0.2em", color: "var(--kaerne-sage)", textTransform: "uppercase" }}>
              {timeLabel}
            </div>
            <h1 className="k-fade2 mb-4" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 300, lineHeight: 1.12, letterSpacing: "-0.015em", color: "var(--kaerne-ink)" }}>
              {greeting}
            </h1>
            {!chatActive && (
              <p className="k-fade3 mb-7" style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: "var(--kaerne-ink-soft)" }}>
                Jeg er din faglige kollega i socialforvaltningen. Jeg kender Barnets Lov og
                Serviceloven, skriver udkast til notater og undersøgelser, tænker med i svære
                sager — og hjælper dig med at finde den rette indsats og aktør, når sagen
                kræver det. <br />Hvad arbejder du med i dag?
              </p>
            )}

            {chatActive && (
              <div
                className="mb-5 max-h-[48vh] overflow-y-auto pr-2 flex flex-col gap-3.5"
                aria-live="polite"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`k-msg max-w-[86%] rounded-[18px] px-5 py-3.5 text-[15px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "self-end" : "self-start"
                    }`}
                    style={
                      m.role === "user"
                        ? { background: "var(--kaerne-ink)", color: "var(--kaerne-sand)", boxShadow: "0 2px 10px rgba(45,42,38,0.18)" }
                        : { background: "#fff", border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink)", boxShadow: "0 2px 12px rgba(90,80,72,0.07)" }
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
                    {m.role === "assistant" && m.content && !loading && (
                      <button
                        onClick={() => navigator.clipboard?.writeText(m.content)}
                        className="block mt-2 cursor-pointer text-[11px] hover:opacity-70 transition-opacity"
                        style={{ color: "var(--kaerne-muted)" }}
                        aria-label="Kopiér Karlas svar"
                      >
                        ⧉ Kopiér
                      </button>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {gdprWarning && (
              <div className="mb-4 rounded-[14px] px-5 py-3.5 text-[14px] leading-relaxed" style={{ background: "#fdf0e7", border: "0.5px solid #ecc9ae", color: "#864b35" }}>
                <strong>Stop lige —</strong> det ligner et CPR-nummer. Karla arbejder kun med anonymiserede
                oplysninger (GDPR). Fjern personnumre og navne, og prøv igen.
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
                onChange={(e) => { setInput(e.target.value); if (gdprWarning) setGdprWarning(false); }}
                className="w-full bg-white rounded-[20px] py-[19px] pl-6 pr-16 text-[15px] focus:outline-none transition-shadow focus:shadow-[0_4px_20px_rgba(90,80,72,0.12)]"
                style={{ border: "0.5px solid var(--kaerne-border)", boxShadow: "0 2px 14px rgba(90,80,72,0.06)" }}
                placeholder={chatActive ? "Skriv til Karla..." : "Skriv til mig — bare som du tænker..."}
                aria-label="Skriv til Karla"
                disabled={loading}
              />
              <button
                type="submit"
                aria-label="Send til Karla"
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                style={{ background: "var(--kaerne-terracotta)", color: "#fff", boxShadow: "0 3px 10px rgba(226,145,111,0.45)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            <p className="mt-2.5 text-[11.5px]" style={{ color: "var(--kaerne-muted)", lineHeight: 1.5 }}>
              Karla støtter din faglighed — afgørelser er altid dine. Del aldrig CPR-numre eller navne.
            </p>

            {!chatActive && (
              <div className="flex gap-2.5 mt-5 flex-wrap">
                {CHIPS.map((c) => (
                  <button key={c.label} onClick={() => send(c.prompt)} className="k-chip cursor-pointer px-4 py-2.5 rounded-full text-[13px]">
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <section id="funktioner" className="max-w-5xl mx-auto mt-16">
          <div className="text-center mb-2 text-[11px]" style={{ letterSpacing: "0.2em", color: "var(--kaerne-sage)", textTransform: "uppercase" }}>
            Det kan Karla
          </div>
          <h2 className="text-center mb-7" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 300, color: "var(--kaerne-ink)" }}>
            Mindre skærm. Mere socialfaglighed.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.titel} className="rounded-[18px] p-5 transition-transform hover:-translate-y-0.5" style={{ background: "#fff", border: "0.5px solid var(--kaerne-border)", boxShadow: "0 3px 16px rgba(90,80,72,0.06)" }}>
                <div className="mb-1.5" style={{ fontFamily: "var(--font-serif)", fontSize: 16.5, color: "var(--kaerne-ink)" }}>{f.titel}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--kaerne-ink-soft)" }}>{f.tekst}</div>
              </div>
            ))}
          </div>
        </section>

        <AktorMatch
          onAsk={(t) => {
            send(t);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        <div
          className="max-w-5xl mx-auto mt-16 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--kaerne-border), transparent)" }}
        />

        <div id="sikkerhed" className="max-w-5xl mx-auto mt-9 flex flex-wrap justify-center gap-2.5">
          {["EU-hostet", "GDPR", "Barnets Lov & Serviceloven", "Støtte — ikke skøn"].map((b) => (
            <span key={b} className="px-4 py-2 rounded-full text-[12px]" style={{ background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink-soft)", letterSpacing: "0.04em" }}>
              {b}
            </span>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.55, color: "var(--kaerne-ink-soft)", fontWeight: 300, maxWidth: 440 }}>
            <span style={{ color: "var(--kaerne-terracotta)", fontSize: 28, fontFamily: "Georgia, serif", lineHeight: 0 }}>&ldquo;</span>{" "}
            Ingen god sag bliver løst alene. Vi tager den sammen.{" "}
            <span style={{ color: "var(--kaerne-terracotta)", fontSize: 28, fontFamily: "Georgia, serif", lineHeight: 0 }}>&rdquo;</span>
            <div className="mt-2" style={{ fontSize: 11, color: "var(--kaerne-muted)", letterSpacing: "0.05em" }}>— Karla, hver morgen</div>
          </div>
          <div className="text-left md:text-right" style={{ fontSize: 11, color: "var(--kaerne-muted)" }}>
            <div className="mb-1">Bygget til socialrådgivere, sagsbehandlere og indkøbere</div>
            <div style={{ color: "var(--kaerne-terracotta)", fontFamily: "var(--font-script)", fontSize: 15 }}>
              Karla tænker med — du bestemmer ♡
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 border-t text-center text-[11px]" style={{ borderColor: "var(--kaerne-border)", color: "var(--kaerne-muted)" }}>
        <span style={{ fontFamily: "var(--font-script)", fontSize: 14 }}>Karla</span> · Din digitale kollega i socialforvaltningen · EU-hostet · <a href="/privacy" className="hover:underline">Privatlivspolitik</a>
      </footer>
  
