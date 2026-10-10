"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { placeOrder, type OrderResult } from "@/app/actions";
import { FREE_SHIP, WHATSAPP, money } from "@/lib/config";
import { PAYMENT_LABELS, type PaymentMethod } from "@/lib/types";
import { useStore } from "./StoreProvider";

type View = "cart" | "co" | "done";

const row = "flex justify-between text-sm tabular-nums";
const rowTotal = "flex justify-between tabular-nums font-semibold text-[17px] text-green";
const label = "flex flex-col gap-1.5 text-[13px] font-medium";

function buildMessage(o: Extract<OrderResult, { ok: true }>, d: Record<string, string>) {
  const lines = o.lines.map((l) => `• ${l.qty} × ${l.name} — ${money(l.amount)}`);
  return [
    `Hola FIDEN, quiero hacer este pedido${o.number ? ` (#${o.number})` : ""}:`,
    "",
    ...lines,
    "",
    `Subtotal: ${money(o.subtotal)}`,
    `Envío: ${o.shipping ? money(o.shipping) : "Gratis"}`,
    `Total: ${money(o.total)}`,
    "",
    `Nombre: ${d.name}`,
    `Teléfono: ${d.phone}`,
    `Ciudad: ${d.city}`,
    `Dirección: ${d.address}`,
    `Pago: ${d.payment}`,
  ].join("\n");
}

export default function CartDrawer() {
  const { cart, byId, categoryName, inc, dec, clear, totals: t, cartOpen, setCartOpen, toast, cardEnabled } = useStore();
  const [view, setView] = useState<View>("cart");
  const [orderMsg, setOrderMsg] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const msgRef = useRef<HTMLDivElement>(null);
  const ids = Object.keys(cart);

  useEffect(() => {
    if (cartOpen && view !== "done") setView("cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  if (!cartOpen) return null;

  const methods: PaymentMethod[] = cardEnabled
    ? ["efectivo", "transferencia", "deuna", "tarjeta"]
    : ["efectivo", "transferencia", "deuna"];

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = Object.fromEntries(f) as Record<string, string>;
    const payment = d.payment as PaymentMethod;
    setError("");
    start(async () => {
      const res = await placeOrder({
        items: ids.map((id) => ({ id: Number(id), qty: cart[id] })),
        name: d.name,
        phone: d.phone,
        city: d.city,
        address: d.address,
        payment,
      });
      if (!res.ok) return setError(res.error);
      if (res.redirect) {
        window.location.href = res.redirect;
        return;
      }
      setOrderMsg(buildMessage(res, { ...d, payment: PAYMENT_LABELS[payment] }));
      clear();
      setView("done");
    });
  }

  const title = view === "cart" ? `Tu bolsa (${t.n})` : view === "co" ? "Datos de entrega" : "Pedido listo";

  return (
    <>
      <div className="fixed inset-0 bg-green/32 z-30" onClick={() => setCartOpen(false)} />
      <aside
        aria-label="Bolsa"
        role="dialog"
        aria-modal="true"
        className="fixed inset-y-0 right-0 w-[min(440px,100%)] bg-bg z-31 flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] shadow-[-20px_0_60px_rgba(25,57,46,.15)]"
      >
        <div className="flex justify-between items-center p-6 border-b border-line">
          <h2 className="font-serif text-2xl">{title}</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Cerrar" className="size-[34px] text-xl text-green">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          {view === "cart" &&
            (ids.length ? (
              ids.map((id) => {
                const p = byId(id)!;
                return (
                  <div key={id} className="grid grid-cols-[72px_1fr_auto] gap-4 py-[18px] border-b border-line">
                    <Image src={p.image} alt="" width={72} height={80} className="w-[72px] h-20 object-cover rounded-[2px] bg-card" />
                    <div>
                      <h4 className="font-medium text-sm">{p.name}</h4>
                      <div className="text-[11px] tracking-[.14em] uppercase text-muted mt-0.5">{categoryName(p.category)}</div>
                      <div className="inline-flex items-center border border-line rounded-[2px] mt-2.5">
                        <button onClick={() => dec(id)} aria-label="Quitar uno" className="w-[30px] h-7">
                          −
                        </button>
                        <span className="min-w-6 text-center text-[13px] tabular-nums">{cart[id]}</span>
                        <button onClick={() => inc(id)} aria-label="Agregar uno" className="w-[30px] h-7">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="font-semibold text-sm text-green tabular-nums">{money(p.price * cart[id])}</div>
                  </div>
                );
              })
            ) : (
              <p className="py-10 text-muted">Tu bolsa está vacía. Agrega productos desde la tienda.</p>
            ))}

          {view === "co" && (
            <form id="coForm" onSubmit={submit} className="flex flex-col gap-4 py-[22px]">
              <label className={label}>
                Nombre completo
                <input name="name" required placeholder="María López" autoComplete="name" className="field" />
              </label>
              <label className={label}>
                Teléfono
                <input name="phone" required inputMode="tel" placeholder="09 9123 4567" autoComplete="tel" className="field" />
              </label>
              <label className={label}>
                Ciudad
                <input name="city" required placeholder="Quito" autoComplete="address-level2" className="field" />
              </label>
              <label className={label}>
                Dirección
                <textarea name="address" rows={2} required placeholder="Calle, número y referencia" autoComplete="street-address" className="field" />
              </label>
              <label className={label}>
                Forma de pago
                <select name="payment" className="field">
                  {methods.map((m) => (
                    <option key={m} value={m}>
                      {PAYMENT_LABELS[m]}
                    </option>
                  ))}
                </select>
              </label>
              {error && <p className="text-[13px] text-[#9B2C2C]">{error}</p>}
            </form>
          )}

          {view === "done" && (
            <>
              <div ref={msgRef} className="whitespace-pre-wrap bg-white border border-dashed border-line p-3.5 text-[13px] mt-[22px] mb-2.5 select-all">
                {orderMsg}
              </div>
              <p className="text-[12.5px] text-gold-ink">Envía este mensaje por WhatsApp para confirmar tu pedido.</p>
            </>
          )}
        </div>

        <div className="px-6 py-5 border-t border-line flex flex-col gap-2">
          {view === "cart" && (
            <>
              <div className={row}>
                <span>Subtotal</span>
                <span>{money(t.sub)}</span>
              </div>
              <div className={row}>
                <span>Envío</span>
                <span>{!t.sub ? "—" : t.ship ? money(t.ship) : "Gratis"}</span>
              </div>
              <div className="text-[12.5px] text-gold-ink">
                {t.sub && t.sub < FREE_SHIP
                  ? `Te faltan ${money(FREE_SHIP - t.sub)} para envío gratis`
                  : t.sub
                    ? "Tu pedido tiene envío gratis"
                    : ""}
              </div>
              <div className={rowTotal}>
                <span>Total</span>
                <span>{money(t.tot)}</span>
              </div>
              <button className="btn" disabled={!ids.length} onClick={() => setView("co")}>
                Continuar
              </button>
            </>
          )}
          {view === "co" && (
            <>
              <div className={rowTotal}>
                <span>Total</span>
                <span>{money(t.tot)}</span>
              </div>
              <button className="btn" type="submit" form="coForm" disabled={pending}>
                {pending ? "Procesando…" : "Generar pedido"}
              </button>
              <button className="btn btn-out" onClick={() => setView("cart")} disabled={pending}>
                Volver
              </button>
            </>
          )}
          {view === "done" && (
            <>
              <a
                className="btn bg-wa! border-wa! text-white!"
                target="_blank"
                rel="noopener"
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(orderMsg)}`}
              >
                Enviar por WhatsApp
              </a>
              <button
                className="btn btn-out"
                onClick={() =>
                  navigator.clipboard?.writeText(orderMsg).then(
                    () => toast("Mensaje copiado"),
                    () => {
                      if (msgRef.current) getSelection()?.selectAllChildren(msgRef.current);
                      toast("Selecciona y copia el texto");
                    },
                  )
                }
              >
                Copiar mensaje
              </button>
              <button
                className="btn btn-out"
                onClick={() => {
                  setView("cart");
                  setCartOpen(false);
                }}
              >
                Nuevo pedido
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
