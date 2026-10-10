import { money } from "@/lib/config";
import { supabaseServer } from "@/lib/supabase/server";
import { PAYMENT_LABELS, STATUS_LABELS, type OrderStatus, type PaymentMethod } from "@/lib/types";
import { setOrderStatus } from "./actions";

type Order = {
  id: string;
  number: number;
  name: string;
  phone: string;
  city: string;
  address: string;
  payment: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
  order_items: { name: string; price: number; qty: number }[];
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pendiente: "bg-gold/30 text-gold-ink",
  pendiente_pago: "bg-gold/30 text-gold-ink",
  pagado: "bg-green text-ivory",
  enviado: "bg-green/15 text-green",
  entregado: "bg-card text-muted",
  cancelado: "bg-[#9B2C2C]/10 text-[#9B2C2C]",
};

export default async function AdminPedidos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const sb = await supabaseServer();
  let query = sb
    .from("orders")
    .select("id,number,name,phone,city,address,payment,status,subtotal,shipping,total,created_at,order_items(name,price,qty)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (estado) query = query.eq("status", estado);
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <>
      <div className="flex flex-wrap gap-2.5 mb-6">
        {[["", "Todos"], ...Object.entries(STATUS_LABELS)].map(([k, l]) => (
          <a
            key={k}
            href={k ? `/admin?estado=${k}` : "/admin"}
            aria-current={(estado ?? "") === k ? "page" : undefined}
            className="border border-line rounded-full px-4 py-2 text-[13px] aria-[current=page]:bg-green aria-[current=page]:border-green aria-[current=page]:text-ivory"
          >
            {l}
          </a>
        ))}
      </div>

      {!orders.length && <p className="text-muted py-10">No hay pedidos todavía.</p>}

      <div className="flex flex-col border-t border-line">
        {orders.map((o) => (
          <details key={o.id} className="border-b border-line group">
            <summary className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_160px_120px_100px] gap-x-4 gap-y-1 items-center py-4 cursor-pointer list-none text-sm tabular-nums">
              <b className="font-semibold">#{o.number}</b>
              <span>
                {o.name} <span className="text-muted">· {o.city}</span>
              </span>
              <span className={`justify-self-end md:justify-self-start text-[11px] tracking-[.12em] uppercase font-semibold px-2 py-1 rounded-[2px] ${STATUS_COLOR[o.status]}`}>
                {STATUS_LABELS[o.status]}
              </span>
              <span className="text-muted hidden md:block">{new Date(o.created_at).toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" })}</span>
              <span className="font-semibold text-green md:text-right">{money(Number(o.total))}</span>
            </summary>
            <div className="grid md:grid-cols-2 gap-8 pb-6 pt-2 text-sm">
              <div>
                <ul className="flex flex-col gap-1.5 mb-3">
                  {o.order_items.map((i, n) => (
                    <li key={n} className="flex justify-between gap-4 tabular-nums">
                      <span>
                        {i.qty} × {i.name}
                      </span>
                      <span>{money(Number(i.price) * i.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-muted tabular-nums">
                  <span>Envío</span>
                  <span>{Number(o.shipping) ? money(Number(o.shipping)) : "Gratis"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span>
                  <b className="font-medium">Teléfono:</b>{" "}
                  <a className="underline" href={`https://wa.me/${o.phone.replace(/\D/g, "").replace(/^0/, "593")}`} target="_blank" rel="noopener">
                    {o.phone}
                  </a>
                </span>
                <span>
                  <b className="font-medium">Dirección:</b> {o.address}, {o.city}
                </span>
                <span>
                  <b className="font-medium">Pago:</b> {PAYMENT_LABELS[o.payment]}
                </span>
                <form action={setOrderStatus} className="flex gap-2 mt-3">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" defaultValue={o.status} className="field py-2!">
                    {Object.entries(STATUS_LABELS).map(([k, l]) => (
                      <option key={k} value={k}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <button className="btn-g px-5! py-2!">Guardar</button>
                </form>
              </div>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
