"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return state === "sent" ? (
    <p className="text-ink">
      Te enviamos un enlace a <b>{email}</b>. Ábrelo desde este dispositivo para entrar.
    </p>
  ) : (
    <form
      className="flex flex-col gap-4 max-w-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const { error } = await supabaseBrowser().auth.signInWithOtp({
          email: email.trim(),
          options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
        });
        setState(error ? "error" : "sent");
      }}
    >
      <label className="flex flex-col gap-1.5 text-[13px] font-medium">
        Correo electrónico
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="field" />
      </label>
      {state === "error" && <p className="text-[13px] text-[#9B2C2C]">No pudimos enviar el enlace. Intenta de nuevo.</p>}
      <button className="btn" disabled={state === "sending"}>
        {state === "sending" ? "Enviando…" : "Recibir enlace de acceso"}
      </button>
    </form>
  );
}
