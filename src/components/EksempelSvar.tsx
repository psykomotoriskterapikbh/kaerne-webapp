/* Statisk eksempel på et Astrid-svar — vises uden login, så besøgende ser produktet. */

const wrap: React.CSSProperties = { maxWidth: 760, margin: "0 auto" };
const chat: React.CSSProperties = {
  background: "#fff", border: "0.5px solid var(--kaerne-border)", borderRadius: 20,
  padding: "26px 26px", boxShadow: "0 8px 30px rgba(90,80,72,0.08)",
};
const h2: React.CSSProperties = { fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, color: "var(--kaerne-ink)", textAlign: "center", margin: "0 0 4px" };
const lead: React.CSSProperties = { fontSize: 14, color: "var(--kaerne-muted)", textAlign: "center", margin: "0 0 22px" };

export default function EksempelSvar() {
  return (
    <section style={wrap} className="mt-20 px-6 md:px-0">
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--kaerne-sage)" }}>Se det uden login</span>
      </div>
      <h2 style={h2}>Et eksempel på, hvad Astrid svarer</h2>
      <p style={lead}>Rigtigt format, rigtig faglighed. Dette er et opdigtet, anonymt eksempel.</p>

      <div style={chat}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <div style={{ maxWidth: "82%", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink)", borderRadius: 18, padding: "10px 15px", fontSize: 14.5, lineHeight: 1.55 }}>
            En mor til en dreng på 9 fortæller om begyndende skolevægring og uro derhjemme. Hun beder om hjælp. Hvor starter jeg?
          </div>
        </div>

        <div style={{ display: "flex", gap: 13 }}>
          <div aria-hidden="true" style={{ flex: "0 0 auto", width: 32, height: 32, borderRadius: "50%", background: "var(--kaerne-sage)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-script)", fontSize: 16 }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--kaerne-muted)", marginBottom: 8 }}>Astrid</div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--kaerne-ink)" }}>
              <p style={{ margin: "0 0 12px" }}>Godt du tager fat tidligt. Skolevægring er ofte et symptom, ikke kernen, så første skridt er at få barnets trivsel belyst bredt, før I beslutter en indsats.</p>
              <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Det juridiske afsæt</p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
                <li style={{ marginBottom: 4 }}>Overvej en <span className="k-par">BL §20</span> børnefaglig undersøgelse, hvis bekymringen er mere end forbigående.</li>
                <li style={{ marginBottom: 4 }}>Hold barnets perspektiv centralt — børnesamtale <span className="k-par">BL §5</span> før afgørelse.</li>
                <li>Tidlig, let indsats kan iværksættes parallelt (forældrevejledning, skolesamarbejde).</li>
              </ul>
              <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Næste skridt</p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
                <li style={{ marginBottom: 4 }}>Inviter mor (og barnet) til en afdækkende samtale — jeg kan lave en spørgeguide.</li>
                <li style={{ marginBottom: 4 }}>Indhent samtykke til at tale med skole og evt. PPR.</li>
                <li>Notér det hele objektivt — jeg kan omsætte dine stikord til et journalnotat.</li>
              </ul>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--kaerne-ink-soft)", fontStyle: "italic" }}>Proportionalitet: vælg den mindst indgribende indsats, der reelt hjælper. Skønnet er dit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
