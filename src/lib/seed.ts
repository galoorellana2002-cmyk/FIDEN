import type { Catalog } from "./types";

// Catálogo de respaldo: se usa solo mientras Supabase no esté configurado.
// Debe coincidir con supabase/seed.sql.
export const SEED: Catalog = {
  categories: [
    { slug: "beauty", name: "Beauty", subtitle: "Belleza y cuidado personal", image: "/img/cat-beauty.jpg" },
    { slug: "tech", name: "Tech", subtitle: "Tecnología y accesorios", image: "/img/cat-tech.jpg" },
    { slug: "home", name: "Home", subtitle: "Detalles para tu espacio", image: "/img/cat-home.jpg" },
    { slug: "lifestyle", name: "Lifestyle", subtitle: "Accesorios para tu día a día", image: "/img/cat-life.jpg" },
  ],
  products: (
    [
      [1, "tech", "Smartphone 128 GB", "p-phone", 289, null, "Nuevo", 10, true],
      [2, "beauty", "Crema hidratante facial", "p-serum", 12.5, null, null, 9, true],
      [3, "tech", "Audífonos inalámbricos", "p-buds", 24.9, 32, "Oferta", 9, true],
      [4, "home", "Lámpara de mesa cerámica", "p-booklamp", 34, null, null, 8, true],
      [5, "tech", "Smartwatch deportivo", "p-watch", 45, null, null, 8, true],
      [6, "beauty", "Labial nude satinado", "p-lipstick", 8.99, null, null, 7, false],
      [7, "beauty", "Paleta de sombras 12 tonos", "p-palette", 14.5, null, null, 7, false],
      [8, "beauty", "Set de maquillaje y brochas", "p-brushes", 18.9, 24, "Oferta", 6, false],
      [9, "beauty", "Lip serum hidratante", "p-lotion", 9.5, null, "Nuevo", 6, false],
      [10, "tech", "Audífonos de diadema", "p-headphones", 39.9, null, null, 7, false],
      [11, "tech", "Audífonos over-ear Pro", "p-headphones2", 59.9, null, null, 6, false],
      [12, "tech", "Fundas de silicona", "p-cases", 8.5, null, null, 8, false],
      [13, "home", "Lámpara de pie", "p-lamp", 49, null, null, 5, false],
      [14, "home", "Taza de cerámica", "p-mug", 6.5, null, null, 6, false],
      [15, "home", "Vela aromática ámbar", "p-candle", 11, null, "Nuevo", 7, false],
      [16, "home", "Cojín de lino", "p-pillow", 14, null, null, 5, false],
      [17, "lifestyle", "Tote bag de yute", "p-tote", 9.9, null, null, 6, false],
      [18, "lifestyle", "Mochila urbana", "p-backpack", 29.9, null, null, 7, false],
    ] as const
  ).map(([id, category, name, img, price, compareAt, tag, popularity, featured]) => ({
    id,
    slug: String(id),
    category,
    name,
    image: `/img/${img}.jpg`,
    price,
    compareAt,
    tag,
    popularity,
    stock: 99,
    featured,
  })),
};
