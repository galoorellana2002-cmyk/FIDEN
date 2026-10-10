import type { Metadata } from "next";
import { Suspense } from "react";
import Listing from "@/components/Listing";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Tecnología, belleza, hogar y estilo de vida en un solo lugar.",
};

export default function TiendaPage() {
  return (
    <Suspense>
      <Listing category={null} />
    </Suspense>
  );
}
