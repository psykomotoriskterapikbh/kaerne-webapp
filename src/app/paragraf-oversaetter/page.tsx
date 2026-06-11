import type { Metadata } from "next";
import Link from "next/link";
import { ParagrafOversaetter } from "@/components/Vaerktoejer";

export const metadata: Metadata = {
  title: "Paragraf-oversætter til Barnets Lov & Serviceloven | Astrid",
  description: "Slå paragraffer op i Barnets Lov og Serviceloven og få dem forklaret i klart sprog. Gratis værktøj fra Astrid, din digitale kollega i socialforvaltningen.",
  alternates: { canonical: "/paragraf-oversaetter" },
};

export default function Page() {
  return (
    <main style={{ background: "var(--kaerne-sand)", color: "var(--kaerne-ink)", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-6 py-14 md:py-20">
        <Link href="/" style={{ fontFamily: "var(--font-script)", fontSize: 24, color: "var(--kaerne-ink)", textDecoration: "none" }}>Astrid</Link>
        <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kaerne-sage)", margin: "28px 0 8px" }}>Værktøj · paragraffer</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px,4vw,40px)", fontWeight: 300, lineHeight: 1.12, color: "var(--kaerne-ink)", margin: "0 0 14px" }}>Paragraf-oversætter til Barnets Lov & Serviceloven</h1>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: "var(--kaerne-ink-soft)", margin: "0 0 28px", maxWidth: 640 }}>Slå en paragraf op og få den forklaret i klart, praktisk sprog. Find hurtigt frem til, hvad bestemmelsen betyder for din sag.</p>

        <ParagrafOversaetter />

        <div style={{ marginTop: 40, fontSize: 15, lineHeight: 1.7, color: "var(--kaerne-ink-soft)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--kaerne-ink)", margin: "0 0 10px" }}>Fra paragraf til praksis</h2>
          <p style={{ margin: "0 0 14px" }}>Lovteksten er præcis, men ikke altid let at omsætte til en konkret sag. Paragraf-oversætteren giver dig en klar forklaring af bestemmelsen og dens formål, så du hurtigere kan vurdere, om den er den rette hjemmel.</p>
          <p style={{ margin: 0 }}>Forklaringen er en støtte, ikke en juridisk afgørelse. Citér altid den gældende lovtekst på retsinformation.dk, og lad det socialfaglige skøn og myndighedsansvaret ligge hos dig og din kommune.</p>
        </div>

        <div style={{ marginTop: 36 }}>
          <Link href="/" style={{ display: "inline-block", padding: "13px 28px", borderRadius: 999, background: "linear-gradient(135deg,#ef9355,#d96637)", color: "#fff", fontWeight: 600, fontSize: 15.5, textDecoration: "none", boxShadow: "0 5px 16px rgba(217,102,55,.34)" }}>Prøv hele Astrid →</Link>
        </div>
      </div>
    </main>
  );
}
