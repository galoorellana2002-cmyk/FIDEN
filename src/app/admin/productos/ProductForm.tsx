"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import { saveProduct, uploadImage } from "../actions";

export type AdminProduct = {
  id: number;
  name: string;
  category: string;
  image: string;
  price: number;
  compare_at: number | null;
  stock: number;
  popularity: number;
  tag: string | null;
  featured: boolean;
  active: boolean;
};

const lbl = "flex flex-col gap-1 text-[12px] font-medium text-muted";
const inp = "field py-2! text-sm!";

export default function ProductForm({ p, categories }: { p?: AdminProduct; categories: Category[] }) {
  const [image, setImage] = useState(p?.image ?? "");
  const [uploading, startUpload] = useTransition();
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(fd) =>
        startSave(async () => {
          await saveProduct(fd);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        })
      }
      className="grid grid-cols-[72px_1fr] gap-4 py-5 border-b border-line"
    >
      {p && <input type="hidden" name="id" value={p.id} />}
      <input type="hidden" name="image" value={image} />
      <label className="relative w-[72px] h-20 bg-card rounded-[2px] overflow-hidden cursor-pointer" title="Cambiar foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
        <span className="absolute inset-x-0 bottom-0 bg-green/70 text-ivory text-[10px] text-center py-0.5">
          {uploading ? "…" : "Foto"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            const fd = new FormData();
            fd.append("file", f);
            startUpload(async () => {
              const { url } = await uploadImage(fd);
              if (url) setImage(url);
            });
          }}
        />
      </label>

      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_90px_90px_80px_100px] gap-3 items-end">
        <label className={`${lbl} col-span-2 md:col-span-1`}>
          Nombre
          <input name="name" defaultValue={p?.name} required className={inp} />
        </label>
        <label className={lbl}>
          Categoría
          <select name="category" defaultValue={p?.category ?? categories[0]?.slug} className={inp}>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className={lbl}>
          Precio
          <input name="price" type="number" step="0.01" min="0" defaultValue={p?.price} required className={inp} />
        </label>
        <label className={lbl}>
          Antes
          <input name="compare_at" type="number" step="0.01" min="0" defaultValue={p?.compare_at ?? ""} className={inp} />
        </label>
        <label className={lbl}>
          Stock
          <input name="stock" type="number" min="0" defaultValue={p?.stock ?? 0} className={inp} />
        </label>
        <label className={lbl}>
          Etiqueta
          <select name="tag" defaultValue={p?.tag ?? ""} className={inp}>
            <option value="">—</option>
            <option>Nuevo</option>
            <option>Oferta</option>
          </select>
        </label>

        <div className="col-span-full flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible en la tienda
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={p?.featured} /> Destacado
          </label>
          <label className="flex items-center gap-2">
            Popularidad
            <input name="popularity" type="number" defaultValue={p?.popularity ?? 0} className={`${inp} w-20`} />
          </label>
          <button className="btn-g px-5! py-2! ml-auto" disabled={saving || uploading}>
            {saving ? "Guardando…" : saved ? "Guardado" : p ? "Guardar" : "Crear producto"}
          </button>
        </div>
      </div>
    </form>
  );
}
