# PH PLUS — Workflows funcionales

> Cómo cada flujo principal del e-commerce viaja desde el click del usuario
> hasta la persistencia en Supabase, qué eventos dispara, qué emails se
> generan y dónde lo ve el admin.

---

## Índice

**Usuario final**
1. [Compra como invitado](#1-compra-como-invitado-guest-checkout)
2. [Registro + primera compra logueado](#2-registro--primera-compra-logueado)
3. [Recuperar contraseña](#3-recuperar-contraseña)
4. [Wishlist y favoritos](#4-wishlist-y-favoritos)
5. [Escribir una reseña](#5-escribir-una-reseña)
6. [Aplicar cupón](#6-aplicar-cupón)

**Admin**
7. [Procesar un pedido (de pendiente a entregado)](#7-procesar-un-pedido)
8. [Crear / editar un producto](#8-crear--editar-un-producto)
9. [Ajustar inventario](#9-ajustar-inventario)
10. [Moderar reseñas](#10-moderar-reseñas)
11. [Editar contenido del home](#11-editar-contenido-del-home)

**Sistema**
12. [Keep-alive (mantener Supabase activo)](#12-keep-alive-supabase)
13. [Migraciones de schema](#13-migraciones-de-schema)

---

## 1. Compra como invitado (guest checkout)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant H as Header (SearchBar+Cart)
  participant P as /productos/[slug]
  participant C as /carrito
  participant CH as /checkout
  participant S as Supabase (orders+order_lines)
  participant E as Outbox (notifications)

  U->>H: busca "botellón 19L"
  H->>U: muestra dropdown con resultados
  U->>P: click en producto
  P->>U: PDP con add to cart
  U->>C: click "Comprar"
  C->>CH: "Proceder al pago"
  Note over CH: Form sin sesión<br/>(guest checkout)
  CH->>S: POST /rest/v1/orders { user_id: null }
  S->>CH: order_id + totals + status="pending_payment"
  CH->>E: enqueue email order_confirmation
  CH->>U: redirige a /checkout/exito
```

**Reglas clave**

- `user_id` es `null` → RLS permite SELECT al admin y al cliente que tenga el `order_id` (ver `orders_owner_or_guest_select`).
- El email se encola en `notifications_outbox` con status `queued`. Una edge function (futura) lo manda real vía Resend.
- En `/checkout/exito` se ofrece "crea tu cuenta con un click" usando el email del pedido como prellenado.

**Tests**
- E2E screenshot: `02-checkout/04-pedido-confirmado.png`
- Unit: `features/checkout/domain/totals.test.ts` (submitOrder)

---

## 2. Registro + primera compra logueado

```mermaid
sequenceDiagram
  actor U as Usuario
  participant R as /registro
  participant A as Supabase Auth
  participant T as Trigger handle_new_user
  participant P as profiles
  participant Z as useSession (Zustand)
  participant CH as /checkout
  participant S as Supabase (orders)

  U->>R: completa form (name/email/password)
  R->>A: supabase.auth.signUp(...)
  A->>T: insert auth.users
  T->>P: insert profiles (role="customer")
  A->>R: { user, session }
  R->>Z: setSession({ userId, role, expiresAt })
  R->>U: redirect /cuenta

  Note over U: agrega productos al carrito
  U->>CH: /checkout
  CH->>S: POST orders { user_id: <uid> }
  S->>CH: order created
  Note over S: trigger orders_set_updated_at corre
```

**Reglas clave**

- El trigger `handle_new_user` en `auth.users` auto-crea la profile.
- El JWT de Supabase tiene `auth.uid()` → RLS permite leer/escribir sus propios `orders`, `addresses`, `reviews`.
- Si el browser se cierra, la cookie de sesión persiste hasta `expiresAt` (7 días default).

**Archivos**
- `app/registro/page.tsx`
- `src/features/auth/service.supabase.ts:signup`
- `supabase/migrations/20260520000002_functions_and_triggers.sql:handle_new_user`

---

## 3. Recuperar contraseña

```mermaid
sequenceDiagram
  actor U as Usuario
  participant L as /login (link "olvidé")
  participant A as Supabase Auth
  participant M as Mailbox
  participant R as /reset-password (futuro)

  U->>L: click "olvidé mi contraseña"
  L->>U: form pidiendo email
  U->>L: submit
  L->>A: supabase.auth.resetPasswordForEmail(email, { redirectTo })
  A->>M: email con link (template Supabase)
  Note over L: SIEMPRE muestra "te enviamos un email"<br/>(evita user enumeration)
  M->>R: usuario hace click → /reset-password?token=...
  R->>A: supabase.auth.updateUser({ password })
  A->>R: OK
  R->>U: redirect /login
```

**Notas de seguridad**

- La función SIEMPRE devuelve `{ sent: true }` aunque el email no exista (evita
  que un atacante descubra emails registrados).
- El link en el email caduca en 1h (config en Supabase Auth).

---

## 4. Wishlist y favoritos

```mermaid
flowchart LR
  A[Click ♡ en ProductCard] --> B[useWishlist.toggle slug]
  B --> C{Estaba ya?}
  C -- no --> D[add con addedAt = now]
  C -- sí --> E[remove]
  D --> F[Zustand persist → localStorage]
  E --> F
  F --> G[Header badge se actualiza]
  G --> H[/cuenta/favoritos lista con ProductCard]
```

**Por qué localStorage (no Supabase)**

- Permite usar wishlist como invitado.
- El día que querramos sync server-side, hacemos un `useEffect` que sube al
  endpoint `POST /rest/v1/wishlist_items` cuando hay sesión y mergea al login.

---

## 5. Escribir una reseña

```mermaid
sequenceDiagram
  actor U as Usuario logueado
  participant P as /productos/[slug] (tab Reseñas)
  participant S as Supabase reviews
  participant T as trigger reviews_recompute_rating
  participant PR as products
  participant A as Admin /admin/resenas
  participant E as Outbox

  U->>P: form (rating, title, text)
  P->>S: insert reviews { status: "pending", user_id: auth.uid() }
  Note over S: RLS chequea<br/>auth.uid() = user_id<br/>y status = 'pending'
  S->>T: trigger after insert
  T->>PR: recompute rating_avg/count<br/>(pero como status=pending, no afecta)

  Note over A: admin entra
  A->>S: select * from reviews where status='pending'
  A->>S: update reviews set status='approved'
  S->>T: trigger after update
  T->>PR: recompute con la nueva review aprobada
  T->>E: (futuro) enqueue email "tu reseña fue aprobada"
```

**Reglas clave**

- Sólo usuarios logueados pueden insertar (RLS).
- El status SIEMPRE arranca en `pending`; el cliente no puede setearlo a
  `approved`.
- `products.rating_average` y `rating_count` se mantienen en sync con un
  trigger — no hay que reconcilirlos manualmente.

---

## 6. Aplicar cupón

```mermaid
sequenceDiagram
  actor U as Usuario
  participant CH as Checkout o Carrito
  participant CR as coupons (Supabase)
  participant D as domain/apply (puro)

  U->>CH: ingresa código "BIENVENIDA10"
  CH->>CR: select * where code=upper('BIENVENIDA10')
  CR->>CH: Coupon
  CH->>D: validateCoupon(coupon, { subtotal, now })
  D->>CH: { ok: true } o { ok: false, reason }
  alt válido
    CH->>D: computeDiscount(coupon, subtotal)
    D->>CH: { discountSubtotal, freeShipping }
    CH->>U: muestra total con descuento
  else inválido
    CH->>U: mensaje en español ("Cupón vencido", etc)
  end
```

**Reasons posibles**

- `NOT_STARTED` — starts_at futuro
- `EXPIRED` — ends_at pasado
- `INACTIVE` — is_active=false
- `MIN_SUBTOTAL_NOT_REACHED` — subtotal < min_subtotal
- `MAX_USES_REACHED` — used_count >= max_uses

---

## 7. Procesar un pedido

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending_payment: crear pedido
  draft --> cancelled
  pending_payment --> paid: confirmar pago
  pending_payment --> cancelled
  paid --> preparing: ir a preparación
  paid --> cancelled
  paid --> refunded
  preparing --> shipped: enviar (pide tracking)
  preparing --> cancelled
  preparing --> refunded
  shipped --> delivered: confirmar entrega
  shipped --> refunded
  delivered --> closed
  delivered --> refunded
  closed --> [*]
  cancelled --> [*]
  refunded --> [*]
```

**Cómo lo hace el admin**

1. `/admin/pedidos` → ve la lista filtrable por estado / fecha / monto.
2. Click en una fila → `OrderDetail` con la línea de tiempo.
3. Click "Marcar como enviado" → modal pide tracking number.
4. Admin confirma → `update orders set status='shipped', tracking_number='...'`
5. **Trigger DB valida la transición** (`enforce_order_status_transition`).
   Si tratás de saltar de `pending_payment` a `delivered` directo, error 23514.
6. Email "tu pedido fue enviado" se encola en outbox.
7. Cliente lo ve en `/cuenta/pedidos`.

---

## 8. Crear / editar un producto

```mermaid
flowchart LR
  A[Admin /admin/productos] --> B[Click + Crear producto]
  B --> C[ProductForm Modal con 5 tabs]
  C --> D[Validación Zod en submit]
  D --> E[Insert en public.products]
  E --> F[RLS: solo si is_admin]
  F --> G[Trigger updated_at]
  G --> H[Refresh lista]
  
  A2[Click row Editar] --> C2[ProductForm prellenado]
  C2 --> D2[Validación Zod]
  D2 --> E2[Update products where slug]
```

**Tabs del form**

- **General**: slug (auto-kebab), title, shortTitle, tagline, description, category, size, visualKey, isActive
- **Precio**: priceValue, prevPriceValue (validado > priceValue), popularity 0-100
- **Imágenes**: uploader a bucket `product-images` (futuro)
- **Stock**: stock current + low threshold (escribe en `stock_items`)
- **SEO**: meta_title, meta_description

---

## 9. Ajustar inventario

```mermaid
sequenceDiagram
  actor A as Admin
  participant I as /admin/inventario
  participant R as Supabase RPC apply_stock_movement
  participant S as stock_items
  participant M as stock_movements

  A->>I: click "Ajustar" en SKU-BOTELLON-19LTS
  I->>A: Modal { tipo, cantidad, motivo, nota }
  A->>I: submit (type=in, qty=20, reason=purchase)
  I->>R: rpc('apply_stock_movement', { p_sku, p_type, p_quantity, ... })
  Note over R: dentro de la función:<br/>1. SELECT current FOR UPDATE<br/>2. calcula next_qty<br/>3. si <0 → INSUFFICIENT_STOCK<br/>4. INSERT en stock_movements<br/>5. UPDATE stock_items
  R->>S: current = current + 20
  R->>M: nueva fila movement
  R->>I: stock_item actualizado
  I->>A: refresh tabla
```

**Por qué RPC en vez de UPDATE directo**

- Atomicidad: lock row → calcular → escribir, todo en una transacción.
- Validación server-side: imposible bypassear `INSUFFICIENT_STOCK` desde el
  cliente.
- Auditoría: cada cambio queda registrado en `stock_movements`.

---

## 10. Moderar reseñas

```mermaid
sequenceDiagram
  actor A as Admin
  participant R as /admin/resenas
  participant S as Supabase reviews
  participant T as trigger recompute_rating
  participant P as products

  R->>S: select * from reviews where status='pending'
  S->>R: lista de reviews
  A->>R: aprobar #123
  R->>S: update reviews set status='approved' where id=123
  S->>T: after update
  T->>P: recompute average + count para el product_slug
```

Igual para rechazar (con motivo) y responder (escribe `admin_response`).

---

## 11. Editar contenido del home

`/admin/contenido` → 4 secciones editables:

| Sección | Schema en `public.content` |
|---|---|
| Hero (title, subtitle, CTA) | `home_hero jsonb` |
| Productos destacados | `featured_slugs jsonb` (array de slugs) |
| Banners | `banners jsonb` (array) |
| FAQ | `faq jsonb` (array) |

El home (`app/page.tsx` componente `Hero`) lee de `contentRepo.get()` en el
server. Cualquier cambio en admin se refleja en el próximo render (ISR cuando
lo activemos).

---

## 12. Keep-alive Supabase

```mermaid
flowchart LR
  A[GitHub Actions cron<br/>cada 3 días @ 09:00 UTC] --> B[curl POST keep_alive]
  B --> C[Supabase Postgres]
  C --> D[Reset del timer<br/>de 7 días de inactividad]
  
  E[Trigger manual] -.-> A
```

**Por qué**

- Free tier pausa proyectos a los 7 días sin actividad de DB.
- Con tráfico real >10 visits/día NO se pausa porque cada page-load lee algo.
- Pero si vienen 5 días sin tráfico (vacaciones, feriado largo), se pausa.
- El cron lo previene 100%: cuesta $0, corre solo, alertas si falla.

Configuración: `.github/workflows/supabase-keepalive.yml` + 2 secrets
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

---

## 13. Migraciones de schema

```mermaid
flowchart LR
  A[Dev escribe SQL en supabase/migrations] --> B[Commit + push a feat branch]
  B --> C[PR → main]
  C --> D[CI: typecheck + tests + build]
  D --> E[Merge a main]
  E --> F[Manualmente: supabase db push]
  F --> G[Supabase aplica la migración]
  G --> H[supabase gen types > types.ts]
  H --> I[Commit types nuevos]
```

**Reglas**

- Nombre del archivo: `<YYYYMMDDHHMMSS>_<snake_case_name>.sql`.
- Siempre forward-only (no rollbacks); si se equivocó, nueva migración que
  revierte.
- Idempotente cuando se pueda (`create table if not exists`, `on conflict do
  nothing`).
- Testear localmente con `supabase db reset` antes del push remoto.

---

## Referencias cruzadas

- Schema completo: [`supabase/migrations/20260520000001_initial_schema.sql`](../supabase/migrations/20260520000001_initial_schema.sql)
- RLS por tabla: [`supabase/migrations/20260520000003_rls_policies.sql`](../supabase/migrations/20260520000003_rls_policies.sql)
- Estado de pedido (TS): [`src/features/orders/domain/status.ts`](../src/features/orders/domain/status.ts)
- Estado de pedido (SQL): [`supabase/migrations/20260520000002_functions_and_triggers.sql`](../supabase/migrations/20260520000002_functions_and_triggers.sql) → `is_valid_order_transition`
