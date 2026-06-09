"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const pill: React.CSSProperties = {
  fontSize: 13, padding: "8px 16px", borderRadius: 9999, cursor: "pointer",
  border: "0.5px solid var(--kaerne-border,#d8c6a8)", color: "var(--kaerne-ink-soft,#5f5648)",
  background: "#fff", textDecoration: "none", whiteSpace: "nowrap",
};

export default function AuthButton() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let sb;
    try { sb = createClient(); } catch { return; }
    setReady(true);
    sb.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null)).catch(() => {});
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  if (email) {
    const signOut = async () => {
      try { await createClient().auth.signOut(); } catch {}
      setEmail(null);
    };
    return (
      <button onClick={signOut} style={pill} title={email}>Log ud</button>
    );
  }
  return <a href="/login" style={pill}>Log ind</a>;
}
