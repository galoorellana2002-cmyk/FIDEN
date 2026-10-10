import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Listing from "@/components/Listing";
import { getCatalog } from "@/lib/catalog";

export const revalidate = 60;

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  const { categories } = await getCatalog();
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const c = (await getCatalog()).categories.find((x) => x.slug === categoria);
  return c ? { title: c.name, description: c.subtitle, openGraph: { images: [c.image] } } : {};
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const { categories } = await getCatalog();
  if (!categories.some((c) => c.slug === categoria)) notFound();
  return (
    <Suspense>
      <Listing category={categoria} />
    </Suspense>
  );
}
