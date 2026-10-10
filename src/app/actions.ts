"use server";

import { getCatalog } from "@/lib/catalog";
import { SITE_URL, payphoneConfigured, shippingFor, supabaseConfigured } from "@/lib/config";
import { preparePayment } from "@/lib/payphone";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types";

export type OrderInput = {
  items: { id: number; qty: number }[];
  name: string;
  phone: string;
  city: string;
  address: string;
  payment: PaymentMethod;
};

export type OrderLine = { name: string; qty: number; amount: number };

export type OrderResult =
  | { ok: true; number: number | null; lines: OrderLine[]; subtotal: number; shipping: number; total: number; redirect?: string }
  | { ok: false; error: string };

const METHODS: PaymentMethod[] = ["efectivo", "transferencia", "deuna", "tarjeta"];

export async function placeOrder(input: OrderInput): Promise<OrderResult> {
  const name = input.name?.trim(), phone = input.phone?.trim(), city = input.city?.trim(), address = input.address?.trim();
  const items = (input.items ?? []).filter((i) => Number.isInteger(i.id) && Number.isInteger(i.qty) && i.qty > 0);
  if (!name || !phone || !city || !address) return { ok: false, error: "Completa todos los datos de entrega." };
  if (!items.length) return { ok: false, error: "Tu bolsa está vacía." };
  if (!METHODS.includes(input.payment)) return { ok: false, error: "Forma de pago no válida." };
  if (input.payment === "tarjeta" && !payphoneConfigured()) return { ok: false, error: "El pago con tarjeta no está disponible." };

  // Sin Supabase: calcula el pedido con el catálogo local (modo demo)
  if (!supabaseConfigured()) {
    const { products } = await getCatalog();
    const lines = items.flatMap((i) => {
      const p = products.find((x) => x.id === i.id);
      return p ? [{ name: p.name, qty: i.qty, amount: p.price * i.qty }] : [];
    });
    const subtotal = lines.reduce((s, l) => s + l.amount, 0);
    const shipping = shippingFor(subtotal);
    return { ok: true, number: null, lines, subtotal, shipping, total: subtotal + shipping };
  }

  let userId: string | null = null, email: string | null = null;
  try {
    const { data } = await (await supabaseServer()).auth.getUser();
    userId = data.user?.id ?? null;
    email = data.user?.email ?? null;
  } catch {}

  const db = supabaseAdmin();
  const { data: order, error } = await db.rpc("create_order", {
    p_items: items,
    p_name: name,
    p_phone: phone,
    p_city: city,
    p_address: address,
    p_payment: input.payment,
    p_user_id: userId,
    p_email: email,
  });
  if (error || !order) {
    const m = error?.message ?? "";
    if (m.startsWith("NO_STOCK:")) return { ok: false, error: `No hay stock suficiente de ${m.slice(9)}.` };
    if (m.startsWith("NOT_FOUND")) return { ok: false, error: "Un producto de tu bolsa ya no está disponible." };
    console.error("create_order", error);
    return { ok: false, error: "No pudimos registrar tu pedido. Intenta de nuevo." };
  }

  const { data: rows } = await db.from("order_items").select("name,price,qty").eq("order_id", order.id);
  const lines = (rows ?? []).map((r) => ({ name: r.name, qty: r.qty, amount: Number(r.price) * r.qty }));
  const result = {
    ok: true as const,
    number: order.number as number,
    lines,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    total: Number(order.total),
  };

  if (input.payment === "tarjeta") {
    try {
      const redirect = await preparePayment({
        orderId: order.id,
        orderNumber: order.number,
        total: result.total,
        responseUrl: `${SITE_URL}/pago/confirmacion`,
        cancellationUrl: `${SITE_URL}/pago/confirmacion?cancelado=${order.id}`,
      });
      return { ...result, redirect };
    } catch (e) {
      console.error(e);
      await db.rpc("cancel_order", { p_order: order.id });
      return { ok: false, error: "No pudimos conectar con la pasarela de pago. Prueba otra forma de pago." };
    }
  }
  return result;
}

export async function subscribe(email: string) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!ok) return { ok: false };
  if (supabaseConfigured()) {
    await supabaseAdmin().from("subscribers").upsert({ email: email.trim().toLowerCase() }, { onConflict: "email" });
  }
  return { ok: true };
}
