"use client";

import { useEffect, useState } from "react";
import { AstridProfile, TOM_PROFIL, loadProfile, saveProfile, clearProfile, hasProfile } from "@/lib/profile";
import { KOMMUNER } from "@/data/kommuner";

const ROLLER = ["Socialrådgiver", "Sagsbehandler", "Myndighed", "Indkøber", "Leder", "Andet"];
const OMRAADER = ["Børn & unge", "Familie", "Voksne", "Beskæftigelse", "Blandet"];

const field: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 11,
  border: "0.5px solid var(--kaerne-border,#d8c6a8)", background: "#fff",
  fontSize: 14, color: "var(--kaerne-ink,#2c2824)", outline: "none",
};
const label: React.CSSProperties = { fontSize: 12.5, color: "var(--kaerne-ink-soft,#5f5648)", margin: "0 0 5px", display: "block" };

export default function ProfilePanel() {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<AstridProfile>(TOM_PROFIL);
  const [aktiv, setAktiv] = useState(false);

  useEffect(() => {
    const sync = () => { const lp = loadProfile(); setAktiv(hasProfile(lp)); };
    sync();
    window.addEventListener("astrid-profile-changed", sync);
    return () => window.removeEventListener("astrid-profile-changed", sync);
  }, []);

  const openPanel = () => { setP(loadProfile() ?? TOM_PROFIL); setOpen(true); };
  const gem = () => { saveProfile(p); setOpen(false); };
  const ryd = () => { clearProfile(); setP(TOM_PROFIL); setOpen(false); };

  return (
    <>
      <button
        type="button"
        onClick={openPanel}
        className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11.5px] hover:opacity-75 transition-opacity"
        style={{
          border: "0.5px solid var(--kaerne-border)",
          color: aktiv ? "#fff" : "var(--kaerne-ink-soft)",
          background: aktiv ? "var(--kaerne-sage-deep,#5ea36f)" : "#fff",
        }}
        title="Fortæl Astrid lidt om dig, så hun tilpasser sig, gemmes kun i din browser"
      >
        ☺ Min profil
      </button>

      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(44,40,36,.34)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(2px)" }}
        >
          <div style={{ width: "100%", maxWidth: 400, background: "var(--kaerne-sand,#fbf6ec)", border: "0.5px solid var(--kaerne-border,#d8c6a8)", borderRadius: 20, padding: "26px 24px", boxShadow: "0 18px 50px rgba(120,92,67,.22)" }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 21, fontWeight: 400, color: "var(--kaerne-ink,#2c2824)", margin: "0 0 4px" }}>Min profil</h2>
            <p style={{ fontSize: 12.5, color: "var(--kaerne-muted,#8a7a66)", margin: "0 0 18px", lineHeight: 1.5 }}>
              Hjælper Astrid med at ramme dig fagligt og i tonen. Gemmes kun i din browser, aldrig på en server, aldrig delt. Skriv ikke borgeroplysninger her.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <div>
                <label style={label}>Dit fornavn</label>
                <input style={field} value={p.navn} maxLength={40} onChange={(e) => setP({ ...p, navn: e.target.value })} placeholder="Fx Mette" />
              </div>
              <div>
                <label style={label}>Rolle</label>
                <select style={field} value={p.rolle} onChange={(e) => setP({ ...p, rolle: e.target.value })}>
                  <option value="">Vælg…</option>
                  {ROLLER.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Fagområde</label>
                <select style={field} value={p.omraade} onChange={(e) => setP({ ...p, omraade: e.target.value })}>
                  <option value="">Vælg…</option>
                  {OMRAADER.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Kommune</label>
                <select style={field} value={p.region} onChange={(e) => setP({ ...p, region: e.target.value })}>
                  <option value="">Vælg…</option>
                  {KOMMUNER.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Hvordan vil du have svar?</label>
                <select style={field} value={p.stil} onChange={(e) => setP({ ...p, stil: e.target.value })}>
                  <option value="">Lad Astrid vurdere</option>
                  <option value="kort">Kort og præcist</option>
                  <option value="uddybende">Uddybende og grundigt</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center" }}>
              <button type="button" onClick={gem} style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: "var(--kaerne-terracotta,#e3794d)", color: "#fff", fontSize: 14, fontWeight: 600 }}>
                Gem
              </button>
              <button type="button" onClick={ryd} style={{ padding: "11px 14px", borderRadius: 12, border: "0.5px solid var(--kaerne-border,#d8c6a8)", cursor: "pointer", background: "#fff", color: "var(--kaerne-ink-soft,#5f5648)", fontSize: 13 }} title="Slet din lokale profil helt">
                Ryd profil
              </button>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ marginTop: 12, width: "100%", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "var(--kaerne-muted,#8a7a66)", textDecoration: "underline" }}>
              Luk
            </button>
          </div>
        </div>
      )}
    </>
  );
}
