import { supabaseServer } from "@/lib/supabase/server";
import ProductForm, { type AdminProduct } from "./ProductForm";

export default async function AdminProductos() {
  const sb = await supabaseServer();
  const [{ data: products }, { data: categories }] = await Promise.all([
    sb.from("products").select("id,name,category,image,price,compare_at,stock,popularity,tag,featured,active").order("id"),
    sb.from("categories").select("slug,name,subtitle,image").order("position"),
  ]);
  const cats = categories ?? [];
  const low = (products ?? []).filter((p) => p.active && p.stock <= 3).length;

  return (
    <>
      {low > 0 && (
        <p className="mb-6 text-[13px] text-gold-ink">
          {low} {low === 1 ? "producto tiene" : "productos tienen"} 3 unidades o menos.
        </p>
      )}
      <details className="mb-8 bg-card rounded-[3px] px-5">
        <summary className="py-4 cursor-pointer font-medium">+ Nuevo producto</summary>
        <ProductForm categories={cats} />
      </details>
      <div className="border-t border-line">
        {(products as AdminProduct[] | null)?.map((p) => (
          <ProductForm key={p.id} p={{ ...p, price: Number(p.price), compare_at: p.compare_at == null ? null : Number(p.compare_at) }} categories={cats} />
        ))}
      </div>
    </>
  );
}
