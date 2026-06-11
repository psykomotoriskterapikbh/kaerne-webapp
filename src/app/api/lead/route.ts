import { NextResponse } from "next/server";

const SUPABASE_URL = "https://aaffwzthatvilcwwgcbq.supabase.co";
const SUPABASE_KEY = "sb_publishable_8dcg491ccBHJA_kxA-MFRQ_v8IrBn6L";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String((body && body.email) || "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "ugyldig" }, { status: 400 });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "ugyldig e-mail" }, { status: 400 });
  }
  try {
    const r = await fetch(SUPABASE_URL + "/rest/v1/leads", {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email: email, kilde: "paragraf20-skabelon" }),
    });
    // Hvis leads-tabellen ikke findes endnu, fejler vi blidt, saa download stadig virker.
    return NextResponse.json({ ok: true, stored: r.ok });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
