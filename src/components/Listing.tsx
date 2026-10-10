"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { useStore } from "./StoreProvider";

const chip =
  "border border-line rounded-full px-4 py-2 text-[13px] aria-[current=page]:bg-green aria-[current=page]:border-green aria-[current=page]:text-ivory";

export default function Listing({ category }: { category: string | null }) {
  const { catalog } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim().toLowerCase();
  const sort = params.get("orden") ?? "pop";

  const c = catalog.categories.find((x) => x.slug === category);
  const catName = (slug: string) => catalog.categories.find((x) => x.slug === slug)?.name ?? "";

  const list = catalog.products
    .filter((p) => (!category || p.category === category) && (!q || `${p.name} ${catName(p.category)}`.toLowerCase().includes(q)))
    .sort((a, b) => (sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : b.popularity - a.popularity));

  const title = q ? `Resultados para “${rawQ.trim()}”` : c ? c.name : "Toda la tienda";
  const lead = q ? `${list.length} productos` : c ? c.subtitle : "Tecnología, belleza, hogar y estilo de vida en un solo lugar.";

  const withParams = (path: string, patch: Record<string, string | null> = {}) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    const s = sp.toString();
    return s ? `${path}?${s}` : path;
  };
  const here = category ? `/tienda/${category}` : "/tienda";

  return (
    <section className="wrap pt-10 pb-20">
      <div className="text-[13px] text-muted mb-2.5">
        <Link href="/">Inicio</Link> / {c ? c.name : "Tienda"}
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(32px,3.6vw,46px)] text-ink">{title}</h1>
      <p className="mb-[26px] text-muted">{lead}</p>

      <div className="flex flex-wrap gap-2.5 items-center pb-[22px] mb-[30px] border-b border-line">
        <Link href={withParams("/tienda")} className={chip} aria-current={!category ? "page" : undefined} scroll={false}>
          Todo
        </Link>
        {catalog.categories.map((k) => (
          <Link key={k.slug} href={withParams(`/tienda/${k.slug}`)} className={chip} aria-current={category === k.slug ? "page" : undefined} scroll={false}>
            {k.name}
          </Link>
        ))}
        <select
          aria-label="Ordenar"
          value={sort}
          onChange={(e) => router.replace(withParams(here, { orden: e.target.value === "pop" ? null : e.target.value }), { scroll: false })}
          className="ml-auto bg-transparent border border-line rounded-[2px] px-2.5 py-2 text-[13px]"
        >
          <option value="pop">Más vendidos</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 md:gap-x-5 md:gap-y-9">
        {list.length ? (
          list.map((p) => <ProductCard key={p.id} p={p} />)
        ) : (
          <p className="col-span-full text-muted py-10">No encontramos productos con esa búsqueda. Prueba con otra palabra.</p>
        )}
      </div>
    </section>
  );
}
