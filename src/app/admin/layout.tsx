import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/config";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };
export const dynamic = "force-dynamic";

const tab = "py-1.5 text-green border-b-2 border-transparent hover:border-green";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured()) redirect("/cuenta");
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/cuenta?next=/admin");
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) redirect("/cuenta");

  return (
    <section className="wrap pt-10 pb-20 min-h-[60vh]">
      <div className="text-[13px] text-muted mb-2.5">
        <Link href="/">Inicio</Link> / Panel
      </div>
      <h1 className="mb-6 font-serif text-[clamp(32px,3.6vw,46px)]">Panel de la tienda</h1>
      <nav className="track flex gap-8 mb-8 border-b border-line pb-3">
        <Link href="/admin" className={tab}>
          Pedidos
        </Link>
        <Link href="/admin/productos" className={tab}>
          Productos y stock
        </Link>
      </nav>
      {children}
    </section>
  );
}
