"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Bag, Search, User } from "./icons";
import { useStore } from "./StoreProvider";

const navBtn = "normal-case tracking-normal py-1.5 text-green border-b-2 border-transparent aria-[current=page]:border-green";

function SearchRow({ open }: { open: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const ref = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(params.get("q") ?? "");

  // Al volver al inicio se limpia la búsqueda
  useEffect(() => {
    if (!pathname.startsWith("/tienda")) setQ("");
  }, [pathname]);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  return (
    <div className="wrap pb-4" hidden={!open}>
      <input
        ref={ref}
        type="search"
        value={q}
        placeholder="Buscar productos en FIDEN"
        autoComplete="off"
        aria-label="Buscar productos"
        onChange={(e) => {
          setQ(e.target.value);
          const v = e.target.value;
          router.replace(v ? `/tienda?q=${encodeURIComponent(v)}` : "/tienda", { scroll: false });
        }}
        className="w-full bg-transparent border-0 border-b border-green py-2.5 outline-none text-base"
      />
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { totals, setCartOpen } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const inShop = pathname.startsWith("/tienda");

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 bg-bg border-b border-line">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[72px] md:h-[90px] px-[clamp(16px,5vw,74px)]">
        <nav className="track flex gap-[clamp(18px,3vw,40px)]" aria-label="Principal">
          <Link href="/tienda" className={navBtn} aria-current={inShop ? "page" : undefined}>
            Tienda
          </Link>
          <Link href="/#beneficios" className={`${navBtn} hidden md:inline`}>
            Nosotros
          </Link>
          <Link href="/#beneficios" className={`${navBtn} hidden md:inline`}>
            Ayuda
          </Link>
        </nav>

        <Link href="/" aria-label="FIDEN, inicio" className="text-center text-green leading-none">
          <b className="logo-type block text-[32px] md:text-[42px] tracking-[.01em]">FIDEN</b>
          <small className="block text-[10px] font-semibold tracking-[.42em] mt-1.5 pl-[.42em]">ECUADOR</small>
        </Link>

        <div className="flex justify-end items-center gap-[18px] md:gap-[26px] text-green">
          <button onClick={() => setSearchOpen((o) => !o)} aria-label="Buscar" aria-expanded={searchOpen}>
            <Search className="size-[22px] block" />
          </button>
          <Link href="/cuenta" aria-label="Mi cuenta" className="hidden md:block">
            <User className="size-[22px] block" />
          </Link>
          <button onClick={() => setCartOpen(true)} aria-label="Abrir bolsa" className="relative">
            <Bag className="size-[22px] block" />
            <i className="absolute -top-[9px] -right-2.5 not-italic text-[10px] font-semibold bg-green text-ivory size-[18px] rounded-full grid place-items-center">
              {totals.n}
            </i>
          </button>
        </div>
      </div>
      <Suspense>
        <SearchRow open={searchOpen} />
      </Suspense>
    </header>
  );
}
