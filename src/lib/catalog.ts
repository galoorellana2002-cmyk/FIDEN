import "server-only";
import { cache } from "react";
import { supabaseConfigured } from "./config";
import { SEED } from "./seed";
import { supabasePublic } from "./supabase/server";
import type { Catalog, Product } from "./types";

type ProductRow = {
  id: number;
  slug: string;
  category: string;
  name: string;
  image: string;
  price: number | string;
  compare_at: number | string | null;
  tag: Product["tag"];
  popularity: number;
  stock: number;
  featured: boolean;
};

export const toProduct = (r: ProductRow): Product => ({
  id: r.id,
  slug: r.slug,
  category: r.category,
  name: r.name,
  image: r.image,
  price: Number(r.price),
  compareAt: r.compare_at == null ? null : Number(r.compare_at),
  tag: r.tag,
  popularity: r.popularity,
  stock: r.stock,
  featured: r.featured,
});

export const getCatalog = cache(async (): Promise<Catalog> => {
  if (!supabaseConfigured()) return SEED;
  const sb = supabasePublic();
  const [cats, prods] = await Promise.all([
    sb.from("categories").select("slug,name,subtitle,image").order("position"),
    sb
      .from("products")
      .select("id,slug,category,name,image,price,compare_at,tag,popularity,stock,featured")
      .eq("active", true)
      .order("id"),
  ]);
  if (cats.error || prods.error) {
    console.error("Error leyendo el catálogo", cats.error ?? prods.error);
    return SEED;
  }
  return { categories: cats.data, products: (prods.data as ProductRow[]).map(toProduct) };
});
