import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://aaffwzthatvilcwwgcbq.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_8dcg491ccBHJA_kxA-MFRQ_v8IrBn6L",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context - cookies can't be set here, middleware handles it
          }
        },
      },
    }
  );
}
