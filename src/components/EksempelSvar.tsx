/* Statisk eksempel paa et Astrid-svar — vises uden login, saa besoegende ser produktet. */

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
      <h2 style={h2}>Et eksempel paa, hvad Astrid svarer</h2>
      <p style={lead}>Rigtigt format, rigtig faglighed. Dette er et opdigtet, anonymt eksempel.</p>

      <div style={chat}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <div style={{ maxWidth: "82%", background: "var(--kaerne-cream)", border: "0.5px solid var(--kaerne-border-soft)", color: "var(--kaerne-ink)", borderRadius: 18, padding: "10px 15px", fontSize: 14.5, lineHeight: 1.55 }}>
            En mor til en dreng paa 9 fortaeller om begyndende skolevaegring og uro derhjemme. Hun beder om hjaelp. Hvor starter jeg?
          </div>
        </div>

        <div style={{ display: "flex", gap: 13 }}>
          <div aria-hidden="true" style={{ flex: "0 0 auto", width: 32, height: 32, borderRadius: "50%", background: "var(--kaerne-sage)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-script)", fontSize: 16 }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--kaerne-muted)", marginBottom: 8 }}>Astrid</div>
            <div style={{ fontSize: 15, lineHeight: 1.7, color: "var(--kaerne-ink)" }}>
              <p style={{ margin: "0 0 12px" }}>Godt du tager fat tidligt. Skolevaegring er ofte et symptom, ikke kernen, saa foerste skridt er at faa barnets trivsel belyst bredt, foer I beslutter en indsats.</p>
              <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Det juridiske afsaet</p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
                <li style={{ marginBottom: 4 }}>Overvej en <span className="k-par">BL §20</span> boernefaglig undersoegelse, hvis bekymringen er mere end forbigaaende.</li>
                <li style={{ marginBottom: 4 }}>Hold barnets perspektiv centralt — boernesamtale <span className="k-par">BL §5</span> foer afgoerelse.</li>
                <li>Tidlig, let indsats kan ivaerksaettes parallelt (foreraeldrevejledning, skolesamarbejde).</li>
              </ul>
              <p style={{ margin: "0 0 6px", fontWeight: 600 }}>Naeste skridt</p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
                <li style={{ marginBottom: 4 }}>Inviter mor (og barnet) til en afdaekkende samtale — jeg kan lave en spoergeguide.</li>
                <li style={{ marginBottom: 4 }}>Indhent samtykke til at tale med skole og evt. PPR.</li>
                <li>Notér det hele objektivt — jeg kan omsaette dine stikord til et journalnotat.</li>
              </ul>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--kaerne-ink-soft)", fontStyle: "italic" }}>Proportionalitet: vaelg den mindst indgribende indsats, der reelt hjaelper. Skoennet er dit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
