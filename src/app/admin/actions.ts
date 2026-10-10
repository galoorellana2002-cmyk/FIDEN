"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/types";

export async function requireAdmin() {
  const sb = await supabaseServer();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) throw new Error("No autorizado");
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) throw new Error("No autorizado");
  return sb;
}

const STATUSES: OrderStatus[] = ["pendiente", "pendiente_pago", "pagado", "enviado", "entregado", "cancelado"];

export async function setOrderStatus(form: FormData) {
  const sb = await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status")) as OrderStatus;
  if (!STATUSES.includes(status)) return;
  if (status === "cancelado") {
    // Devuelve el stock al cancelar
    await supabaseAdmin().rpc("cancel_order", { p_order: id });
  } else {
    await sb.from("orders").update({ status }).eq("id", id);
  }
  revalidatePath("/admin");
  revalidateTag("catalog");
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function productFields(form: FormData) {
  const num = (k: string) => (form.get(k) === "" || form.get(k) == null ? null : Number(form.get(k)));
  const tag = String(form.get("tag") ?? "");
  return {
    name: String(form.get("name") ?? "").trim(),
    category: String(form.get("category") ?? ""),
    image: String(form.get("image") ?? "").trim(),
    price: num("price") ?? 0,
    compare_at: num("compare_at"),
    stock: Math.max(0, Math.trunc(num("stock") ?? 0)),
    popularity: Math.trunc(num("popularity") ?? 0),
    tag: tag === "Nuevo" || tag === "Oferta" ? tag : null,
    featured: form.get("featured") === "on",
    active: form.get("active") === "on",
  };
}

export async function saveProduct(form: FormData) {
  const sb = await requireAdmin();
  const id = form.get("id");
  const fields = productFields(form);
  if (!fields.name) return;
  if (id) {
    await sb.from("products").update(fields).eq("id", Number(id));
  } else {
    await sb.from("products").insert({ ...fields, slug: `${slugify(fields.name)}-${Date.now().toString(36)}` });
  }
  revalidatePath("/admin/productos");
  revalidateTag("catalog");
}

/** Sube una foto al bucket "productos" de Supabase Storage y devuelve su URL pública. */
export async function uploadImage(form: FormData) {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return { url: null };
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now().toString(36)}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const storage = supabaseAdmin().storage.from("productos");
  const { error } = await storage.upload(path, file, { contentType: file.type });
  if (error) return { url: null };
  return { url: storage.getPublicUrl(path).data.publicUrl };
}
