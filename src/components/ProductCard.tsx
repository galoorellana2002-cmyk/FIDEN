"use client";

import Image from "next/image";
import { money } from "@/lib/config";
import type { Product } from "@/lib/types";
import { Plus } from "./icons";
import { useStore } from "./StoreProvider";

export default function ProductCard({ p, className = "" }: { p: Product; className?: string }) {
  const { add, categoryName } = useStore();
  const soldOut = p.stock <= 0;
  const badge = soldOut ? "Agotado" : p.tag;

  return (
    <article className={`group min-w-0 flex flex-col ${className}`}>
      <div className="relative aspect-[1/1.12] max-w-full bg-card overflow-hidden rounded-[2px]">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(min-width:1101px) 20vw, (min-width:861px) 33vw, 50vw"
          className="object-cover transition-transform duration-[600ms] ease-[ease] group-hover:scale-[1.04]"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 text-[9.5px] font-semibold tracking-[.14em] uppercase px-[7px] py-1 rounded-[2px] ${
              badge === "Oferta" ? "bg-green text-ivory" : "bg-white text-ink"
            }`}
          >
            {badge}
          </span>
        )}
        <button
          onClick={() => add(p.id)}
          disabled={soldOut}
          aria-label={`Agregar ${p.name} a la bolsa`}
          className="absolute right-3 bottom-3 size-10 rounded-full bg-green text-ivory grid place-items-center transition-all duration-[250ms] md:opacity-0 md:translate-y-1.5 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:focus-visible:opacity-100 md:focus-visible:translate-y-0 disabled:hidden"
        >
          <Plus className="size-[18px]" />
        </button>
      </div>
      <div className="pt-3.5 flex flex-col gap-[3px]">
        <span className="text-[11px] tracking-[.16em] uppercase text-muted">{categoryName(p.category)}</span>
        <h4 className="font-medium text-[15px] leading-[1.35] text-ink">{p.name}</h4>
        <span className="text-[15px] font-semibold text-green tabular-nums">
          {money(p.price)}
          {p.compareAt && <s className="font-normal text-muted ml-2 text-[13px]">{money(p.compareAt)}</s>}
        </span>
      </div>
    </article>
  );
}
