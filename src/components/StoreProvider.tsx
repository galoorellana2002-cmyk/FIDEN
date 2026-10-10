"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { shippingFor } from "@/lib/config";
import type { Catalog, Product } from "@/lib/types";

type Cart = Record<string, number>;

type Store = {
  catalog: Catalog;
  byId: (id: number | string) => Product | undefined;
  categoryName: (slug: string) => string;
  cart: Cart;
  add: (id: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  totals: { sub: number; ship: number; tot: number; n: number };
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toast: (msg: string) => void;
  cardEnabled: boolean;
};

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore fuera de StoreProvider");
  return s;
};

const KEY = "fiden-cart";

export default function StoreProvider({
  catalog,
  cardEnabled,
  children,
}: {
  catalog: Catalog;
  cardEnabled: boolean;
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart>({});
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const byId = useCallback((id: number | string) => catalog.products.find((p) => p.id == id), [catalog]);
  const categoryName = useCallback(
    (slug: string) => catalog.categories.find((c) => c.slug === slug)?.name ?? slug,
    [catalog],
  );

  // Carga la bolsa guardada y descarta productos que ya no existen
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}") as Cart;
      setCart(Object.fromEntries(Object.entries(saved ?? {}).filter(([id, q]) => byId(id) && q > 0)));
    } catch {}
    setLoaded(true);
  }, [byId]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastMsg(null), 1700);
  }, []);

  const store = useMemo<Store>(() => {
    const sub = Object.entries(cart).reduce((s, [id, q]) => s + (byId(id)?.price ?? 0) * q, 0);
    const ship = shippingFor(sub);
    return {
      catalog,
      byId,
      categoryName,
      cart,
      add: (id) => {
        const p = byId(id);
        if (!p) return;
        if ((cart[id] ?? 0) >= p.stock) return toast("No hay más unidades disponibles");
        setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
        toast("Agregado a tu bolsa");
      },
      inc: (id) => {
        const p = byId(id);
        if (p && (cart[id] ?? 0) >= p.stock) return toast("No hay más unidades disponibles");
        setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
      },
      dec: (id) =>
        setCart((c) => {
          const next = { ...c };
          if (--next[id] <= 0) delete next[id];
          return next;
        }),
      clear: () => setCart({}),
      totals: { sub, ship, tot: sub + ship, n: Object.values(cart).reduce((a, b) => a + b, 0) },
      cartOpen,
      setCartOpen,
      toast,
      cardEnabled,
    };
  }, [cart, catalog, byId, categoryName, cartOpen, toast, cardEnabled]);

  return (
    <Ctx.Provider value={store}>
      {children}
      {toastMsg && (
        <div
          role="status"
          className="fixed left-1/2 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] -translate-x-1/2 z-40 bg-green text-ivory px-5 py-3 rounded-[2px] text-sm"
        >
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  );
}
