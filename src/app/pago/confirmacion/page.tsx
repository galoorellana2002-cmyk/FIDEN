import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "@/components/ClearCart";
import { Arrow } from "@/components/icons";
import { WHATSAPP, money, payphoneConfigured, supabaseConfigured } from "@/lib/config";
import { confirmPayment } from "@/lib/payphone";
import { supabaseAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Pago", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ id?: string; clientTransactionId?: string; cancelado?: string }> };

type Result = { kind: "ok"; number: number; total: number } | { kind: "cancelled" } | { kind: "error" };

async function resolve({ id, clientTransactionId, cancelado }: Awaited<Props["searchParams"]>): Promise<Result> {
  if (!supabaseConfigured() || !payphoneConfigured()) return { kind: "error" };
  const db = supabaseAdmin();

  if (cancelado) {
    const { data: order } = await db.from("orders").select("status").eq("id", cancelado).maybeSingle();
    if (order?.status === "pendiente_pago") await db.rpc("cancel_order", { p_order: cancelado });
    return { kind: "cancelled" };
  }
  if (!id || !clientTransactionId) return { kind: "error" };

  const { data: order } = await db.from("orders").select("id,number,total,status").eq("id", clientTransactionId).maybeSingle();
  if (!order) return { kind: "error" };
  if (order.status === "pagado") return { kind: "ok", number: order.number, total: Number(order.total) };

  try {
    const pay = await confirmPayment(Number(id), clientTransactionId);
    const amountOk = pay.amount === Math.round(Number(order.total) * 100);
    if (pay.statusCode === 3 && pay.clientTransactionId === order.id && amountOk) {
      await db.from("orders").update({ status: "pagado", payment_ref: String(pay.transactionId) }).eq("id", order.id);
      return { kind: "ok", number: order.number, total: Number(order.total) };
    }
    if (pay.statusCode === 2 && order.status === "pendiente_pago") {
      await db.rpc("cancel_order", { p_order: order.id });
      return { kind: "cancelled" };
    }
  } catch (e) {
    console.error(e);
  }
  return { kind: "error" };
}

export default async function ConfirmacionPage({ searchParams }: Props) {
  const r = await resolve(await searchParams);

  const [eyebrow, title, text] =
    r.kind === "ok"
      ? ["Pago aprobado", `¡Gracias! Tu pedido #${r.number} está confirmado.`, `Recibimos tu pago de ${money(r.total)}. Te escribiremos por WhatsApp para coordinar la entrega.`]
      : r.kind === "cancelled"
        ? ["Pago cancelado", "No se realizó ningún cobro.", "Tus productos siguen en tu bolsa. Puedes intentar de nuevo o elegir otra forma de pago."]
        : ["Algo salió mal", "No pudimos confirmar tu pago.", "Si se realizó un cobro, escríbenos por WhatsApp y lo revisamos de inmediato."];

  return (
    <section className="wrap pt-16 pb-24 min-h-[55vh] flex flex-col items-start">
      {r.kind === "ok" && <ClearCart />}
      <span className="track text-gold-ink font-semibold">{eyebrow}</span>
      <h1 className="mt-[22px] mb-[18px] font-serif text-[clamp(32px,3.6vw,46px)] leading-[1.1] text-green max-w-[20ch] text-balance">{title}</h1>
      <p className="mb-[30px] text-lg text-ink max-w-[46ch]">{text}</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/tienda" className="btn-g">
          Seguir comprando <Arrow />
        </Link>
        {r.kind !== "ok" && (
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="btn-g bg-wa! hover:bg-wa!">
            WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
