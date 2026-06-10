"use client";

import { useEffect, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Samtale = { id: string; title: string; date: string; messages: Msg[] };

const KEY = "astrid_samtaler_v1";

function load(): Samtale[] {
  if (typeof window === "undefined") return [];
  try {
    const r = window.localStorage.getItem(KEY);
    return r ? (JSON.parse(r) as Samtale[]) : [];
  } catch {
    return [];
  }
}
function persist(list: Samtale[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // ignorér
  }
}

type Props = { messages: Msg[]; onOpen: (m: Msg[]) => void };

/* Mine samtaler, gemmes KUN lokalt i browseren (localStorage). Ingen server. */
export default function SamtalerPanel({ messages, onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Samtale[]>([]);
  const [gemt, setGemt] = useState(false);

  useEffect(() => {
    if (open) setList(load());
  }, [open]);

  const hasChat = messages.some((m) => m.content.trim());

  const gem = () => {
    const msgs = messages.filter((m) => m.content.trim());
    if (!msgs.length) return;
    const first = msgs.find((m) => m.role === "user");
    const title = (first?.content || "Samtale").replace(/\s+/g, " ").slice(0, 50);
    const s: Samtale = {
      id: String(Date.now()),
      title,
      date: new Date().toLocaleDateString("da-DK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      messages: msgs,
    };
    const next = [s, ...load()];
    persist(next);
    setList(next);
    setGemt(true);
    setTimeout(() => setGemt(false), 1600);
  };

  const genaaben = (s: Samtale) => {
    onOpen(s.messages);
    setOpen(false);
  };
  const slet = (id: string) => {
    const next = load().filter((s) => s.id !== id);
    persist(next);
    setList(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity"
        style={{ border: "0.5px solid var(--kaerne-border)", color: "var(--kaerne-ink-soft)", background: "#fff" }}
        title="Gem og genåbn dine samtaler, gemmes kun i din browser"
      >
        🗂 Mine samtaler
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,40,36,.34)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(2px)" }}
        >
          <div style={{ width: "100%", maxWidth: 440, maxHeight: "82vh", overflow: "auto", background: "var(--kaerne-sand,#fbf6ec)", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 20, padding: "24px 22px", boxShadow: "0 18px 50px rgba(120,92,67,.22)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink,#2c2824)", margin: "0 0 4px" }}>Mine samtaler</h2>
            <p style={{ fontSize: 12.5, color: "var(--kaerne-muted,#8a7a66)", margin: "0 0 16px", lineHeight: 1.5 }}>
              Gemmes kun i din browser, aldrig på en server. Husk at samtaler bør være anonyme.
            </p>

            <button
              type="button"
              onClick={gem}
              disabled={!hasChat}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 12, border: "none", cursor: hasChat ? "pointer" : "default", background: hasChat ? "var(--kaerne-terracotta,#e3794d)" : "#e6dccb", color: "#fff", fontSize: 14, fontWeight: 600, opacity: hasChat ? 1 : 0.7 }}
            >
              {gemt ? "Gemt ✓" : "Gem nuværende samtale"}
            </button>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 9 }}>
              {list.length === 0 && (
                <p style={{ fontSize: 13.5, color: "var(--kaerne-muted,#8a7a66)", textAlign: "center", padding: "14px 0" }}>Ingen gemte samtaler endnu.</p>
              )}
              {list.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 12, padding: "10px 12px" }}>
                  <button type="button" onClick={() => genaaben(s)} style={{ flex: 1, textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ fontSize: 13.5, color: "var(--kaerne-ink,#2c2824)", lineHeight: 1.35, marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--kaerne-muted,#8a7a66)" }}>{s.date} · {s.messages.length} beskeder</div>
                  </button>
                  <button type="button" onClick={() => slet(s.id)} title="Slet" style={{ background: "none", border: "none", cursor: "pointer", color: "#a14b32", fontSize: 16, padding: "2px 6px" }}>×</button>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setOpen(false)} style={{ marginTop: 16, width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "var(--kaerne-muted,#8a7a66)", textDecoration: "underline" }}>
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
