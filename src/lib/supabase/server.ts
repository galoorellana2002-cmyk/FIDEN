import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Cliente con la sesión del usuario (respeta RLS). */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(URL(), ANON(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el middleware refresca la sesión.
        }
      },
    },
  });
}

/** Cliente público sin cookies para leer el catálogo (cacheable). */
export function supabasePublic() {
  return createClient(URL(), ANON(), {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60, tags: ["catalog"] } }),
    },
  });
}

/** Cliente con service role: solo en el servidor, salta RLS. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY");
  return createClient(URL(), key, {
    auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
