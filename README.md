# FIDEN · Tienda online

Next.js (React) + TypeScript + Tailwind CSS + Supabase + Payphone, lista para Vercel.

## Correr en tu computadora

```bash
npm install
cp .env.example .env.local   # completa los valores (opcional al inicio)
npm run dev                  # http://localhost:3000
```

Sin las variables de Supabase la tienda funciona en **modo demo**: catálogo local (`src/lib/seed.ts`) y pedidos por WhatsApp.

## 1. Supabase (productos, stock, pedidos, clientes, inicio de sesión)

1. Crea un proyecto en https://supabase.com.
2. En **SQL Editor** ejecuta `supabase/migrations/0001_init.sql` y luego `supabase/seed.sql`.
3. Copia en `.env.local` la URL, la `anon key` y la `service_role key` (Project Settings → API).
4. En **Authentication → URL Configuration** agrega `http://localhost:3000/auth/callback` y `https://fiden.ec/auth/callback`.
5. Para hacerte administrador: entra en `/cuenta` con tu correo y luego ejecuta en SQL Editor:
   ```sql
   insert into admins (user_id) select id from auth.users where email = 'tu@correo.com';
   ```
   Ya puedes usar el panel en `/admin` (pedidos, estados, productos, precios, stock y fotos).

El stock se descuenta al crear un pedido y se devuelve si el pedido se cancela.

## 2. Payphone (tarjetas)

1. Crea una aplicación tipo **Web** en https://appdeveloper.payphonetodoesposible.com.
2. Configura como URL de respuesta `https://fiden.ec/pago/confirmacion`.
3. Copia el **Token** y el **StoreId** en `PAYPHONE_TOKEN` y `PAYPHONE_STORE_ID`.

Mientras estén vacíos, la opción de tarjeta no aparece. Efectivo, transferencia y Deuna siguen por WhatsApp.
Los precios se envían con impuestos incluidos; si facturas IVA aparte, ajusta `src/lib/payphone.ts`.

## 3. Vercel (hosting)

1. Sube el proyecto a GitHub e impórtalo en https://vercel.com.
2. Agrega las mismas variables de `.env.local` (con `NEXT_PUBLIC_SITE_URL=https://fiden.ec`).
3. En **Settings → Domains** conecta `fiden.ec` o tu `.com`.

## Estructura

```
src/app/            páginas: inicio, /tienda, /tienda/[categoria], /cuenta, /admin, /pago/confirmacion
src/components/     header, footer, tarjeta de producto, bolsa y checkout
src/lib/            catálogo, Supabase, Payphone, configuración
supabase/           esquema de base de datos y datos iniciales
_original/          el HTML original de referencia
```
