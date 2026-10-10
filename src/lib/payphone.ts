import "server-only";

// Payphone · Botón de pagos (https://docs.payphone.app)
const API = "https://pay.payphonetodoesposible.com/api/button";

const headers = () => ({
  Authorization: `Bearer ${process.env.PAYPHONE_TOKEN}`,
  "Content-Type": "application/json",
});

const cents = (n: number) => Math.round(n * 100);

/** Prepara un pago y devuelve la URL a la que se redirige al cliente. */
export async function preparePayment(opts: {
  orderId: string;
  orderNumber: number;
  total: number;
  responseUrl: string;
  cancellationUrl: string;
}) {
  // Los precios de FIDEN incluyen impuestos: todo el monto va como "sin impuesto".
  // Si facturas IVA por separado, divide entre amountWithTax y tax.
  const amount = cents(opts.total);
  const res = await fetch(`${API}/Prepare`, {
    method: "POST",
    headers: headers(),
    cache: "no-store",
    body: JSON.stringify({
      amount,
      amountWithoutTax: amount,
      amountWithTax: 0,
      tax: 0,
      service: 0,
      tip: 0,
      currency: "USD",
      clientTransactionId: opts.orderId,
      storeId: process.env.PAYPHONE_STORE_ID,
      reference: `Pedido FIDEN #${opts.orderNumber}`,
      responseUrl: opts.responseUrl,
      cancellationUrl: opts.cancellationUrl,
    }),
  });
  if (!res.ok) throw new Error(`Payphone Prepare ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { paymentId: string; payWithCard: string; payWithPayPhone: string };
  return data.payWithCard;
}

export type PayphoneConfirmation = {
  statusCode: number; // 3 aprobado · 2 cancelado
  transactionStatus: string;
  transactionId: number;
  clientTransactionId: string;
  amount: number;
};

/** Confirma el resultado del pago. Se debe llamar al volver de Payphone. */
export async function confirmPayment(id: number, clientTxId: string) {
  const res = await fetch(`${API}/V2/Confirm`, {
    method: "POST",
    headers: headers(),
    cache: "no-store",
    body: JSON.stringify({ id, clientTxId }),
  });
  if (!res.ok) throw new Error(`Payphone Confirm ${res.status}: ${await res.text()}`);
  return (await res.json()) as PayphoneConfirmation;
}
