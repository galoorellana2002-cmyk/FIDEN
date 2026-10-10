// Ajustes de la tienda
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? "593990000000";
export const FREE_SHIP = 50;
export const SHIP = 3.5;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const money = (n: number) => "$" + n.toFixed(2);

export const supabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const payphoneConfigured = () =>
  Boolean(process.env.PAYPHONE_TOKEN && process.env.PAYPHONE_STORE_ID);

export function shippingFor(subtotal: number) {
  return !subtotal || subtotal >= FREE_SHIP ? 0 : SHIP;
}
