import Link from "next/link";
import { WHATSAPP } from "@/lib/config";
import type { Category } from "@/lib/types";

const col = "flex flex-col gap-2.5 text-sm text-ivory/85";

export default function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="bg-green text-ivory">
      <div className="wrap grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] gap-7 pt-[60px] pb-11">
        <div className="col-span-full lg:col-span-1">
          <b className="logo-type text-[34px]">FIDEN</b>
          <p className="mt-3.5 text-ivory/75 max-w-[30ch] text-sm">
            Productos seleccionados para tu día a día. Descubre. Elige. Confía.
          </p>
        </div>
        <div>
          <h5 className="track mt-1 mb-4 text-gold">Tienda</h5>
          <ul className={col}>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/tienda/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="track mt-1 mb-4 text-gold">Ayuda</h5>
          <ul className={col}>
            <li>Cómo comprar</li>
            <li>Envíos</li>
            <li>Cambios y devoluciones</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
        <div>
          <h5 className="track mt-1 mb-4 text-gold">FIDEN</h5>
          <ul className={col}>
            <li>Nosotros</li>
            <li>Ventas por mayor</li>
            <li>Trabaja con nosotros</li>
          </ul>
        </div>
        <div>
          <h5 className="track mt-1 mb-4 text-gold">Síguenos</h5>
          <ul className={col}>
            <li>Instagram</li>
            <li>TikTok</li>
            <li>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap flex justify-between flex-wrap gap-3 pt-5 pb-[26px] border-t border-ivory/16 text-[12.5px] text-ivory/65">
        <span>© 2026 FIDEN · Ecuador</span>
        <span>Términos · Privacidad · Productos y precios de ejemplo</span>
      </div>
    </footer>
  );
}
