export type Category = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
};

export type Product = {
  id: number;
  slug: string;
  category: string;
  name: string;
  image: string;
  price: number;
  compareAt: number | null;
  tag: "Nuevo" | "Oferta" | null;
  popularity: number;
  stock: number;
  featured: boolean;
};

export type Catalog = {
  categories: Category[];
  products: Product[];
};

export type PaymentMethod = "efectivo" | "transferencia" | "deuna" | "tarjeta";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  efectivo: "Efectivo contra entrega",
  transferencia: "Transferencia",
  deuna: "Deuna",
  tarjeta: "Tarjeta de crédito o débito",
};

export type OrderStatus = "pendiente" | "pendiente_pago" | "pagado" | "enviado" | "entregado" | "cancelado";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente: "Pendiente",
  pendiente_pago: "Esperando pago",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};
