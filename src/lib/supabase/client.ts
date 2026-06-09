import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://aaffwzthatvilcwwgcbq.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_8dcg491ccBHJA_kxA-MFRQ_v8IrBn6L"
  );
}
