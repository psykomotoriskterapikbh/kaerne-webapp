import type { Metadata } from "next";
import Link from "next/link";
import { FristBeregner } from "@/components/Vaerktoejer";

export const metadata: Metadata = {
  title: "Frist-beregner til Barnets Lov & Serviceloven | Astrid",
  description: "Beregn lovbestemte frister i børne- og familiesager: børnefaglig undersøgelse, genbehandling og opfølgning. Gratis værktøj fra Astrid, din digitale kollega i socialforvaltningen.",
  alternates: { canonical: "/frist-beregner" },
};

export default function Page() {
  return (
    <main style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <Link href="/" style={{ fontFamily: "var(--font-script)", fontSize: 24, color: "var(--kaerne-ink)", textDecoration: "none" }}>Astrid</Link>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kaerne-sage)", margin: "28px 0 8px" }}>Værktøj · frister</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, lineHeight: 1.12, color: "var(--kaerne-ink)", margin: "0 0 14px" }}>Frist-beregner til børne- og familiesager</h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: "var(--kaerne-ink-soft)", margin: "0 0 28px", maxWidth: 640 }}>Hold styr på de lovbestemte frister i børnesager. Vælg sagstype, sæt en startdato, og se hvornår fristen udløber, så intet skrider.</p>

        <FristBeregner />

        <div style={{ marginTop: 40, fontSize: 15, lineHeight: 1.7, color: "var(--kaerne-ink-soft)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 10px" }}>Hvorfor frister er afgørende</h2>
          <p style={{ margin: "0 0 14px" }}>I kommunalt socialarbejde er frister ikke kun gode vaner, de er retssikkerhed. En børnefaglig undersøgelse skal afsluttes inden for den lovbestemte frist, og overholdte frister beskytter både barnet og myndigheden. En overskreden frist kan svække en afgørelse og barnets tillid.</p>
          <p style={{ margin: 0 }}>Frist-beregneren er et hurtigt overblik, ikke en juridisk afgørelse. Den konkrete vurdering og ansvaret ligger altid hos dig og din kommune.</p>
        </div>

        <div style={{ marginTop: 36 }}>
          <Link href="/" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15.5, textDecoration: "none", boxShadow: "0 5px 16px rgba(217,102,55,.34)" }}>Prøv hele Astrid →</Link>
        </div>
      </div>
    </main>
  );
}
