import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { money, supabaseConfigured } from "@/lib/config";
import { supabaseServer } from "@/lib/supabase/server";
import { STATUS_LABELS, type OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };

async function signOut() {
  "use server";
  await (await supabaseServer()).auth.signOut();
  redirect("/cuenta");
}

export default async function CuentaPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next = "/cuenta" } = await searchParams;

  if (!supabaseConfigured()) {
    return (
      <section className="wrap pt-10 pb-20 min-h-[50vh]">
        <h1 className="mb-1.5 font-serif text-[clamp(32px,3.6vw,46px)]">Mi cuenta</h1>
        <p className="text-muted">El inicio de sesión estará disponible cuando se conecte Supabase.</p>
      </section>
    );
  }

  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  const user = auth.user;

  if (!user) {
    return (
      <section className="wrap pt-10 pb-20 min-h-[50vh]">
        <div className="text-[13px] text-muted mb-2.5">
          <Link href="/">Inicio</Link> / Mi cuenta
        </div>
        <h1 className="mb-1.5 font-serif text-[clamp(32px,3.6vw,46px)]">Mi cuenta</h1>
        <p className="mb-[26px] text-muted">Ingresa tu correo y te enviaremos un enlace para entrar, sin contraseña.</p>
        <LoginForm next={next} />
      </section>
    );
  }

  const [{ data: orders }, { data: isAdmin }] = await Promise.all([
    sb.from("orders").select("id,number,status,total,created_at").order("created_at", { ascending: false }),
    sb.rpc("is_admin"),
  ]);

  return (
    <section className="wrap pt-10 pb-20 min-h-[50vh]">
      <div className="text-[13px] text-muted mb-2.5">
        <Link href="/">Inicio</Link> / Mi cuenta
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(32px,3.6vw,46px)]">Mi cuenta</h1>
      <p className="mb-[26px] text-muted">{user.email}</p>

      <div className="flex flex-wrap gap-2.5 mb-10">
        {isAdmin && (
          <Link href="/admin" className="btn-g">
            Panel de la tienda
          </Link>
        )}
        <form action={signOut}>
          <button className="btn btn-out mt-0! px-8 py-4">Cerrar sesión</button>
        </form>
      </div>

      <h2 className="font-serif text-[clamp(24px,2.2vw,30px)] mb-4">Mis pedidos</h2>
      {orders?.length ? (
        <ul className="border-t border-line">
          {orders.map((o) => (
            <li key={o.id} className="flex justify-between gap-4 py-4 border-b border-line text-sm tabular-nums">
              <span className="font-medium">#{o.number}</span>
              <span className="text-muted">{new Date(o.created_at).toLocaleDateString("es-EC")}</span>
              <span>{STATUS_LABELS[o.status as OrderStatus]}</span>
              <span className="font-semibold text-green">{money(Number(o.total))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">Aún no tienes pedidos. Los pedidos que hagas con tu sesión iniciada aparecerán aquí.</p>
      )}
    </section>
  );
}
