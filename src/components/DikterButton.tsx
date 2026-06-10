"use client";

import { useRef, useState } from "react";

type Props = { onText: (t: string) => void };

/* Diktering via browserens indbyggede tale-til-tekst (gratis, ingen nøgle).
   Virker i Chrome/Edge. Tonen er dansk. Brugeren skal selv anonymisere før afsendelse. */
export default function DikterButton({ onText }: Props) {
  const [active, setActive] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  const supported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  if (!supported) return null;

  const toggle = () => {
    if (active) {
      recRef.current?.stop();
      setActive(false);
      return;
    }
    type SRType = new () => {
      lang: string; continuous: boolean; interimResults: boolean;
      onresult: (e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void;
      onend: () => void; onerror: () => void; start: () => void; stop: () => void;
    };
    const w = window as unknown as { webkitSpeechRecognition?: SRType; SpeechRecognition?: SRType };
    const SR = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "da-DK";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let s = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) s += e.results[i][0].transcript;
      }
      // interimResults er slået til for hurtigere respons; kun færdige (isFinal) segmenter sendes videre
      if (s) onText(s.trim());
    };
    r.onend = () => setActive(false);
    r.onerror = () => setActive(false);
    recRef.current = r;
    try { r.start(); setActive(true); } catch { setActive(false); }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity"
      style={{
        border: "0.5px solid var(--kaerne-border)",
        color: active ? "#fff" : "var(--kaerne-ink-soft)",
        background: active ? "var(--kaerne-terracotta)" : "#fff",
      }}
      title="Diktér med din stemme. Bruger browserens tale-tjeneste, så diktér kun anonym tekst (ingen navne eller CPR)."
    >
      {active ? "● Lytter…" : "🎙 Diktér"}
    </button>
  );
}
