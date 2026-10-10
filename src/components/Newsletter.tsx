"use client";

import { useState, useTransition } from "react";
import { subscribe } from "@/app/actions";
import { useStore } from "./StoreProvider";

export default function Newsletter() {
  const { toast } = useStore();
  const [email, setEmail] = useState("");
  const [pending, start] = useTransition();

  return (
    <section className="mt-[84px] py-14 bg-card">
      <div className="wrap grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-[clamp(24px,2.4vw,32px)] mb-2 text-ink">Una marca. Muchas posibilidades.</h2>
          <p className="text-muted max-w-[46ch]">
            Suscríbete y recibe primero los productos nuevos, ofertas privadas y descuentos para clientes FIDEN.
          </p>
        </div>
        <form
          className="flex flex-col sm:flex-row gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.trim()) return;
            start(async () => {
              const r = await subscribe(email);
              if (r.ok) {
                setEmail("");
                toast("Listo, te escribiremos pronto");
              } else toast("Revisa tu correo electrónico");
            });
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            aria-label="Correo electrónico"
            className="flex-1 min-w-0 bg-bg border border-line rounded-[2px] px-4 py-3.5 outline-none focus:border-green"
          />
          <button className="btn-g justify-center" type="submit" disabled={pending}>
            Suscribirme
          </button>
        </form>
      </div>
    </section>
  );
}
