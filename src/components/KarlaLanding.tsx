"use client";

import { useEffect, useRef, useState } from "react";
import AktorMatch from "@/components/AktorMatch";
import AstridFigur from "@/components/AstridFigur";
import SplashScreen from "@/components/SplashScreen";
import { FontControl, StreakChip, KaosKontrolBar, GuldkornPopup, LukSagButton, anonymiser, SLASH_COMMANDS } from "@/components/AstridUpgrades";
import AuthButton from "@/components/AuthButton";
import type { SlashCmd } from "@/components/AstridUpgrades";
import { FristBeregner, ParagrafOversaetter, Faq } from "@/components/Vaerktoejer";

type ChatMsg = { role: "user" | "assistant"; content: string };

const CPR_REGEX = /\b\d{6}[-\s]?\d{4}\b/;

function formatSvar(raw: string): string {
  const esc = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = esc.split("\n");
  const out: string[] = [];
  let listType: "ul" | "ol" | null = null;
  const closeList = () => {
    if (listType) {
      out.push(listType === "ul" ? "</ul>" : "</ol>");
      listType = null;
    }
  };
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/\*\*/g, "")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/((?:BL|SEL|LAB|FVL)\s)?(§§?\s?\d+[a-z]?(?:-\d+)?(?:,?\s?stk\.\s?\d+)?)/g, '<span class="k-par">$1$2</span>');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) {
      closeList();
      continue;
    }
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) {
      closeList();
      out.push("<hr/>");
      continue;
    }
    if (t.startsWith("|") && t.endsWith("|") && t.length > 2) {
      closeList();
      const rows: string[][] = [];
      let j = i;
      while (j < lines.length) {
        const r = lines[j].trim();
        if (!(r.startsWith("|") && r.endsWith("|") && r.length > 2)) break;
        if (!/^\|[\s:|-]+\|$/.test(r)) {
          rows.push(r.slice(1, -1).split("|").map((c) => c.trim()));
        }
        j++;
      }
      if (rows.length > 0) {
        const [head, ...body] = rows;
        let tbl = '<div class="k-tabelwrap"><table class="k-tabel"><thead><tr>';
        tbl += head.map((c) => `<th>${inline(c)}</th>`).join("");
        tbl += "</tr></thead><tbody>";
        for (const r of body) tbl += `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`;
        tbl += "</tbody></table></div>";
        out.push(tbl);
      }
      i = j - 1;
      continue;
    }
    const olM = t.match(/^(\d+)[.)]\s+(.*)$/);
    const ulM = t.match(/^[-•]\s+(.*)$/);
    const hM = t.match(/^#{1,4}\s+(.*)$/);
    if (olM) {
      if (listType !== "ol") {
        closeList();
        out.push("<ol>");
        listType = "ol";
      }
      out.push(`<li>${inline(olM[2])}</li>`);
    } else if (ulM) {
      if (listType !== "ul") {
        closeList();
        out.push("<ul>");
        listType = "ul";
      }
      out.push(`<li>${inline(ulM[1])}</li>`);
    } else if (hM) {
      closeList();
      out.push(`<p class="k-h">${inline(hM[1])}</p>`);
    } else {
      closeList();
      out.push(`<p>${inline(t)}</p>`);
    }
  }
  closeList();
  return out.join("");
}

const QUICK_REPLIES = ["Uddyb det", "Hvad er mit næste skridt?", "Formulér det som journalnotat", "Kortere, tak"];

const CHIPS = [
  { label: "Sagssparring", prompt: "Jeg vil gerne sparre om en sag (anonymiseret). Hjælp mig med at strukturere den — hvad vil du vide?" },
  { label: "§ Paragraf-hjælp", prompt: "Jeg har brug for hjælp til at finde den rette paragraf i Barnets Lov eller Serviceloven. Hvor starter vi?" },
  { label: "Notat-hjælp", prompt: "Hjælp mig med at omsætte mine løse noter til et professionelt journalnotat." },
  { label: "Forbered et møde", prompt: "Jeg skal forberede et svært møde i en sag. Hjælp mig med dagsorden, de svære spørgsmål og borgerens perspektiv." },
  { label: "Find den rette indsats", prompt: "Jeg skal finde den rette type indsats og aktør til en sag. Hvad skal jeg overveje?" },
  { label: "Mødereferat", prompt: "Jeg skal lave et mødereferat. Bed mig om at indsætte mine anonymiserede noter eller transskription, og lav så et struktureret referat med beslutninger, aftaler, ansvarlige og frister." },
];

const PANELS = [
  { id: "frister", label: "⏱ Frist-beregner" },
  { id: "paragraf", label: "§ Paragraf-oversætter" },
  { id: "aktoer", label: "⌂ Find aktør" },
  { id: "faq", label: "✦ Spørgsmål & svar" },
] as const;

type PanelId = (typeof PANELS)[number]["id"];

export default function KarlaLanding() {
  const [greeting, setGreeting] = useState("Hej kollega — godt at se dig.");
  const [timeLabel, setTimeLabel] = useState("Velkommen");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [gdprWarning, setGdprWarning] = useState(false);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [slash, setSlash] = useState(false);
  const [inlineSel, setInlineSel] = useState<{ text: string; x: number; y: number } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const nm = f.name.toLowerCase();
    let raw = "";
    try {
      if (nm.endsWith(".pdf") || nm.endsWith(".docx")) {
        const fd = new FormData();
        fd.append("file", f);
        const r = await fetch("/api/extract", { method: "POST", body: fd });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.text) { setGdprWarning(true); return; }
        raw = j.text as string;
      } else {
        raw = await f.text();
      }
    } catch {
      setGdprWarning(true);
      return;
    }
    const t = anonymiser(raw).slice(0, 6000);
    if (CPR_REGEX.test(t)) {
      setGdprWarning(true);
      return;
    }
    send(
      `Her er en anonymiseret sagsbeskrivelse (fil: ${f.name}). Giv mig et fagligt oplæg: 1) centrale temaer, 2) mulige paragraffer i Barnets Lov/Serviceloven, 3) hvad der mangler at blive belyst (officialprincippet), 4) forslag til næste skridt. Beslutningen er min.\n\n---\n${t}`
    );
  };

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
    setSlash(false);
    setTyping(false);
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    const setLast = (content: string) =>
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content };
        return copy;
      });

    let full = "";
    let revealed = 0;
    let streamDone = false;
    let failed = false;

    // Skriv svaret gradvist frem — i et roligt, læsbart tempo (som en der taler)
    const reveal = () =>
      new Promise<void>((resolve) => {
        const tick = () => {
          if (revealed < full.length) {
            const ch = full[revealed];
            revealed += 1;
            setLast(full.slice(0, revealed));
            // Roligt, menneskeligt tempo — med små pauser ved tegnsætning
            let delay = 46;
            if (ch === " ") delay = 75;
            if (ch === "," || ch === ";" || ch === ":") delay = 300;
            if (ch === "." || ch === "!" || ch === "?") delay = 480;
            if (ch === "\n") delay = 340;
            // Hvis hun er kommet meget bagud (langt svar), holder hun stadig et roligt tempo
            if (full.length - revealed > 700) delay = Math.min(delay, 30);
            setTimeout(tick, delay);
          } else if (streamDone) {
            resolve();
          } else {
            setTimeout(tick, 70);
          }
        };
        tick();
      });

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

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      // Astrid tænker lidt længere, før hun begynder at svare
      await new Promise((r) => setTimeout(r, 2400));

      const readLoop = (async () => {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
        }
        streamDone = true;
      })();

      await Promise.all([readLoop, reveal()]);
    } catch (e) {
      failed = true;
      const msg =
        e instanceof Error && e.message && !e.message.includes("fetch")
          ? e.message
          : "Hov — jeg kunne ikke få forbindelse lige nu. Prøv igen om et øjeblik.";
      setLast(msg);
    } finally {
      if (!failed) setLast(full);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const chooseSlash = (cmd: SlashCmd) => {
    setSlash(false);
    if (cmd.panel) { setPanel(cmd.panel); setInput(""); document.getElementById("paneler")?.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else if (cmd.prompt) { setInput(cmd.prompt); inputRef.current?.focus(); }
  };
  const onMsgMouseUp = () => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (text && text.length > 1 && sel) { const r = sel.getRangeAt(0).getBoundingClientRect(); setInlineSel({ text, x: Math.max(80, Math.min(r.left + r.width / 2, window.innerWidth - 110)), y: Math.max(48, r.top - 6) }); }
    else setInlineSel(null);
  };
  const inlineAction = (instr: string) => { if (!inlineSel) return; send(`${instr}:\n\n"${inlineSel.text}"`); setInlineSel(null); };

  const chatActive = messages.length > 0;

  const askFromPanel = (t: string) => {
    setPanel(null);
    send(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)" }}>
      <style>{`.k-caret{display:inline-block;width:7px;height:1.02em;background:var(--kaerne-terracotta);margin-left:3px;vertical-align:-2px;border-radius:1px;animation:k-caretb 1s steps(1) infinite}@keyframes k-caretb{50%{opacity:0}}`}</style>
      <SplashScreen />
      <GuldkornPopup />
      {inlineSel && (
        <div className="k-inline" style={{ left: inlineSel.x, top: inlineSel.y, transform: "translate(-50%,-100%)" }}>
          <button type="button" onClick={() => inlineAction("Gør denne tekst mere professionel")}>Gør professionel</button>
          <button type="button" onClick={() => inlineAction("Forkort denne tekst")}>Forkort</button>
          <button type="button" onClick={() => inlineAction("Uddyb denne tekst fagligt")}>Uddyb</button>
        </div>
      )}

      <nav className="flex justify-between items-center px-6 md:px-12 py-5 border-b" style={{ borderColor: "var(--kaerne-border)", background: "rgba(252,245,236,0.85)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: "var(--font-script)", fontSize: 28, lineHeight: 1 }}>Astrid</span>
          <span className="hidden sm:inline" style={{ fontSize: 10, letterSpacing: "0.22em", color: "var(--kaerne-muted)", textTransform: "uppercase" }}>
            din digitale kollega
          </span>
        </div>
        <div className="hidden md:flex gap-2 items-center">
          {PANELS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPanel(panel === p.id ? null : p.id); document.getElementById("paneler")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              className={`k-tab cursor-pointer px-3.5 py-2 rounded-full text-[12.5px] ${panel === p.id ? "k-tab-active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <span className="hidden sm:inline-flex"><StreakChip /></span>
          <span className="hidden sm:inline-flex"><FontControl /></span>
          <a href="#" onClick={(e) => { e.preventDefault(); inputRef.current?.focus(); }} className="text-[13px] px-5 py-2.5 rounded-full cursor-pointer hover:opacity-90 transition-opacity" style={{ color: "var(--kaerne-sand)", background: "var(--kaerne-ink)" }}>
            Tal med Astrid →
          </a>
        </div>
      </nav>

      <main className="flex-1 px-6 md:px-12 py-8 md:py-12">
        <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-start max-w-5xl mx-auto">

          <div className="relative w-[250px] h-[300px] flex items-center justify-center mx-auto md:mx-0 md:sticky md:top-28">
            <AstridFigur loading={loading} typing={typing} chatActive={chatActive} />

            <div className="absolute -bottom-2 left-0 right-0 text-center">
              <div style={{ fontFamily: "var(--font-script)", fontSize: 26, color: "var(--kaerne-ink)", lineHeight: 1 }}>Astrid</div>
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
              <p className="k-fade3 mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: 17.5, fontWeight: 300, lineHeight: 1.6, color: "var(--kaerne-ink-soft)" }}>
                Sagssparring, Barnets Lov og Serviceloven, journalnotater, frister og det
                rette match af indsats og aktør — alt sammen lige her i chatten.
                <br />Hvad ligger der på dit bord i dag?
              </p>
            )}

            {chatActive && <KaosKontrolBar />}

            {chatActive && (
              <div
                className="mb-5 max-h-[58vh] overflow-y-auto pr-1 flex flex-col gap-6"
                aria-live="polite"
                onMouseUp={onMsgMouseUp}
              >
                {messages.map((m, i) =>
                  m.role === "user" ? (
                    <div
                      key={i}
                      className="self-end max-w-[80%] rounded-[18px] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap"
                      style={{ background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink)" }}
                    >
                      {m.content}
                    </div>
                  ) : (
                    <div key={i} className="self-stretch flex gap-3">
                      <div
                        style={{ flex: "0 0 auto", width: 30, height: 30, borderRadius: "50%", background: "var(--kaerne-sage)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-script)", fontSize: 15, marginTop: 2 }}
                        aria-hidden="true"
                      >
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-1.5" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--kaerne-muted)" }}>
                          Astrid
                        </div>
                        {m.content ? (
                          <div className="k-svar text-[15.5px]" style={{ lineHeight: 1.75 }}>
                            <span dangerouslySetInnerHTML={{ __html: formatSvar(m.content) }} />
                            {loading && i === messages.length - 1 && <span className="k-caret" aria-hidden="true" />}
                          </div>
                        ) : (
                          <div className="k-skel" aria-label="Astrid skriver">
                            <span style={{ width: "92%" }} /><span style={{ width: "78%" }} /><span style={{ width: "85%" }} />
                          </div>
                        )}
                        {m.content && !(loading && i === messages.length - 1) && (
                          <button
                            onClick={() => navigator.clipboard?.writeText(m.content)}
                            className="block mt-2 cursor-pointer text-[11px] hover:opacity-70 transition-opacity"
                            style={{ color: "var(--kaerne-muted)" }}
                            aria-label="Kopiér Astrids svar"
                          >
                            ⧉ Kopiér
                          </button>
                        )}
                      </div>
                    </div>
                  )
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {chatActive && !loading && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1].content && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="k-quick cursor-pointer px-3.5 py-2 rounded-full text-[12.5px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {gdprWarning && (
              <div className="mb-4 rounded-[14px] px-5 py-3.5 text-[14px] leading-relaxed" style={{ background: "#fdf0e7", border: "0.5px solid #ecc9ae", color: "#864b35" }}>
                <strong>Stop lige —</strong> det ligner et CPR-nummer. Astrid arbejder kun med anonymiserede
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
              {slash && (
                <div className="k-slash">
                  {SLASH_COMMANDS.filter((cm) => cm.cmd.startsWith(input.split(" ")[0].toLowerCase())).map((cm) => (
                    <button type="button" key={cm.cmd} onClick={() => chooseSlash(cm)}>
                      <span className="cmd">{cm.cmd}</span><span className="desc">{cm.desc}</span>
                    </button>
                  ))}
                </div>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSlash(e.target.value.startsWith("/"));
                  if (gdprWarning) setGdprWarning(false);
                  setTyping(true);
                  if (typingTimer.current) clearTimeout(typingTimer.current);
                  typingTimer.current = setTimeout(() => setTyping(false), 1400);
                }}
                className="w-full bg-white rounded-[20px] py-[19px] pl-6 pr-16 text-[15px] focus:outline-none transition-shadow focus:shadow-[0_4px_20px_rgba(90,80,72,0.12)]"
                style={{ border: "0.5px solid var(--kaerne-border)", boxShadow: "0 2px 14px rgba(90,80,72,0.06)" }}
                placeholder={chatActive ? "Skriv til Astrid..." : "Skriv til mig — bare som du tænker..."}
                aria-label="Skriv til Astrid"
                disabled={loading}
              />
              <button
                type="submit"
                aria-label="Send til Astrid"
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

            <div className="mt-2.5 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[11.5px]" style={{ color: "var(--kaerne-muted)", lineHeight: 1.5 }}>
                Astrid støtter din faglighed — afgørelser er altid dine. Del aldrig CPR-numre eller navne.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={loading}
                  className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity disabled:opacity-50"
                  style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)", background: "#fff" }}
                >
                  ⎙ Upload sag (.txt)
                </button>
                <button
                  type="button"
                  onClick={() => { const a = anonymiser(input); if (a !== input) setInput(a); }}
                  disabled={loading || !input.trim()}
                  className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity disabled:opacity-50"
                  style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)", background: "#fff" }}
                  title="Fjern CPR, navne, adresser m.m. fra teksten i feltet"
                >
                  ⦸ Anonymisér
                </button>
                {chatActive && <LukSagButton />}
                {chatActive && (
                  <button
                    type="button"
                    onClick={() => {
                      const txt = messages.map((m) => `${m.role === "user" ? "Mig" : "Astrid"}:\n${m.content}`).join("\n\n---\n\n");
                      const blob = new Blob([`Samtale med Astrid — ${new Date().toLocaleDateString("da-DK")}\n\n${txt}`], { type: "text/plain;charset=utf-8" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = "astrid-samtale.txt";
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity"
                    style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)", background: "#fff" }}
                  >
                    ↓ Gem samtale
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".txt,.md,.pdf,.docx" onChange={handleFile} className="hidden" aria-label="Upload anonymiseret sagsbeskrivelse" />
            </div>

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

        <div id="paneler" className="max-w-5xl mx-auto mt-12">
          <div className="flex flex-wrap justify-center gap-2.5">
            {PANELS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPanel(panel === p.id ? null : p.id)}
                className={`k-tab cursor-pointer px-5 py-2.5 rounded-full text-[13.5px] ${panel === p.id ? "k-tab-active" : ""}`}
                aria-expanded={panel === p.id}
              >
                {p.label}
              </button>
            ))}
          </div>

          {panel && (
            <div className="k-panel mt-7">
              {panel === "frister" && (
                <div className="max-w-xl mx-auto">
                  <FristBeregner />
                </div>
              )}
              {panel === "paragraf" && (
                <div className="max-w-xl mx-auto">
                  <ParagrafOversaetter />
                </div>
              )}
              {panel === "aktoer" && <AktorMatch onAsk={askFromPanel} />}
              {panel === "faq" && <Faq />}
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto mt-12 flex flex-wrap justify-center gap-2.5">
          {["Ingen samtaler gemmes", "Automatisk CPR-blokering", "Bygget på Barnets Lov 2024", "Støtte — ikke skøn", "Gratis at prøve"].map((b) => (
            <span key={b} className="px-4 py-2 rounded-full text-[12px]" style={{ background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink-soft)", letterSpacing: "0.04em" }}>
              {b}
            </span>
          ))}
        </div>
      </main>

      <footer className="px-6 md:px-12 py-6 border-t text-center text-[11px]" style={{ borderColor: "var(--kaerne-border)", color: "var(--kaerne-muted)" }}>
        <span style={{ fontFamily: "var(--font-script)", fontSize: 14 }}>Astrid</span> · Din digitale kollega i socialforvaltningen · Støtte, ikke skøn ·{" "}
        <span style={{ color: "var(--kaerne-terracotta)", fontFamily: "var(--font-script)", fontSize: 13 }}>Astrid tænker med — du bestemmer ♡</span>
      </footer>
    </div>
  );
}
