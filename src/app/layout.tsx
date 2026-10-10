import type { Metadata, Viewport } from "next";
import { Archivo, Figtree, Newsreader } from "next/font/google";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StoreProvider from "@/components/StoreProvider";
import { getCatalog } from "@/lib/catalog";
import { SITE_URL, payphoneConfigured } from "@/lib/config";
import "./globals.css";

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], axes: ["opsz"] });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "FIDEN Tienda", template: "%s · FIDEN" },
  description: "Tecnología, belleza, hogar y estilo de vida en un solo lugar. Envíos a todo Ecuador.",
  openGraph: { siteName: "FIDEN", locale: "es_EC", type: "website", images: ["/img/hero.jpg"] },
};

export const viewport: Viewport = { themeColor: "#F5F0E6", viewportFit: "cover" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();
  return (
    <html lang="es" className={`${figtree.variable} ${newsreader.variable} ${archivo.variable}`}>
      <body>
        <StoreProvider catalog={catalog} cardEnabled={payphoneConfigured()}>
          <Header />
          <main>{children}</main>
          <Footer categories={catalog.categories} />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
