import Image from "next/image";
import Link from "next/link";
import { Arrow, Cash, Chat, Swap, Truck } from "@/components/icons";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import { getCatalog } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export const revalidate = 60;

const PERKS = [
  [Truck, "Envíos a todo Ecuador", "Gratis desde $50 de compra"],
  [Cash, "Paga al recibir", "Efectivo, transferencia o Deuna"],
  [Swap, "Cambios en 7 días", "Si no es lo que esperabas"],
  [Chat, "Atención por WhatsApp", "Te respondemos en minutos"],
] as const;

// 5 columnas en escritorio, 3 en tablet y 4 (2×2) en celular
const visibility = (i: number) => (i === 3 ? "md:max-lg:hidden" : i === 4 ? "max-lg:hidden" : "");

function Grid5({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-6 md:gap-5">
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} className={visibility(i)} />
      ))}
    </div>
  );
}

function SecHead({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 mb-[26px]">
      <h2 className="font-serif text-[clamp(24px,2.2vw,30px)] text-ink">{title}</h2>
      <Link href="/tienda" className="inline-flex items-center gap-2.5 text-sm text-ink">
        Ver todos <Arrow className="size-[18px]" />
      </Link>
    </div>
  );
}

export default async function Home() {
  const { categories, products } = await getCatalog();
  const featured = products.filter((p) => p.featured).slice(0, 5);
  const best = products
    .filter((p) => !p.featured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden bg-hero md:bg-[#EFE2D3] md:min-h-[clamp(340px,26vw,440px)] md:flex md:items-center">
        <Image
          src="/img/hero.jpg"
          alt="Audífonos sobre una superficie beige"
          width={1600}
          height={900}
          priority
          sizes="(min-width:861px) 68vw, 100vw"
          className="relative w-full h-60 object-cover object-[50%_55%] md:absolute md:right-0 md:top-0 md:h-full md:w-[68%]"
        />
        <div className="hidden md:block absolute inset-0 z-[1] bg-[linear-gradient(90deg,#EFE6D9_0%,#EFE6D9_34%,rgba(239,230,217,.85)_44%,rgba(239,230,217,0)_62%)]" />
        <div className="wrap relative z-[2] w-full">
          <div className="max-w-[520px] flex flex-col items-start pt-7 pb-9 md:py-12">
            <span className="track text-gold-ink font-semibold">Todo lo que te inspira</span>
            <h1 className="mt-[22px] mb-[18px] font-normal text-[clamp(36px,4.2vw,54px)] leading-[1.08] tracking-[-.015em] text-green text-balance">
              Descubre tu próximo favorito.
            </h1>
            <p className="mb-[30px] text-lg leading-normal text-ink max-w-[30ch]">
              Tecnología, belleza, hogar y estilo de vida en un solo lugar.
            </p>
            <Link href="/tienda" className="btn-g">
              Explorar colección <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-[22px] pt-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/tienda/${c.slug}`}
              className="group relative block w-full overflow-hidden rounded-[3px] aspect-[320/262] bg-card text-left"
            >
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(min-width:861px) 25vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[ease] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-[1fr_auto] items-end gap-x-3 gap-y-1 px-3.5 py-3 md:px-5 md:pt-4 md:pb-[18px] bg-[rgba(226,219,207,.86)] backdrop-blur-[10px]">
                <h3 className="col-start-1 font-normal text-[17px] md:text-xl text-ink">{c.name}</h3>
                <span className="col-start-1 text-xs md:text-[13px] text-ink">{c.subtitle}</span>
                <Arrow className="col-start-2 row-span-2 row-start-1 size-5 self-center text-ink" />
              </div>
            </Link>
          ))}
        </section>

        <section className="pt-[68px]">
          <SecHead title="Productos destacados para ti" />
          <Grid5 items={featured} />
        </section>

        <section
          id="beneficios"
          className="scroll-mt-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-[72px] py-[34px] border-y border-line"
        >
          {PERKS.map(([Icon, title, sub]) => (
            <div key={title} className="flex gap-4 items-start">
              <Icon className="flex-none size-[30px] text-green" />
              <div>
                <b className="block font-semibold text-[15px] text-ink">{title}</b>
                <span className="text-[13.5px] text-muted">{sub}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="grid md:grid-cols-[1.15fr_1fr] mt-[72px] rounded-[3px] overflow-hidden bg-green">
          <Image
            src="/img/cat-home.jpg"
            alt="Sala de estar en tonos claros"
            width={1200}
            height={800}
            sizes="(min-width:861px) 55vw, 100vw"
            className="w-full h-full object-cover min-h-[220px] max-h-[260px] md:min-h-[340px] md:max-h-none"
          />
          <div className="p-[clamp(28px,5vw,64px)] flex flex-col justify-center items-start text-ivory">
            <span className="track text-gold font-semibold">Colección Home</span>
            <h2 className="mt-[18px] mb-3.5 font-serif text-[clamp(28px,3vw,42px)] leading-[1.12] text-balance">
              Detalles que hacen de tu casa un hogar.
            </h2>
            <p className="mb-7 text-ivory/82 max-w-[40ch] text-base">
              Lámparas, velas, cojines y piezas de cerámica elegidas para espacios cálidos y tranquilos.
            </p>
            <Link href="/tienda/home" className="btn-l">
              Ver Home <Arrow />
            </Link>
          </div>
        </section>

        <section className="pt-[68px]">
          <SecHead title="Lo más vendido" />
          <Grid5 items={best} />
        </section>
      </div>

      <Newsletter />
    </>
  );
}
