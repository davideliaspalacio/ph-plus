# PH PLUS — Plan Maestro para Terminar el Ecommerce

> **Versión:** 1.0
> **Fecha:** 2026-05-20
> **Autor:** Equipo + Claude
> **Stack actual:** Next.js 16.2.6 (App Router) · React 19.2 · Tailwind v4 · TypeScript 5 · sin tests · datos mock estáticos
> **Stack objetivo (corto plazo):** mismo stack + Vitest + RTL + Playwright + Zustand + Zod + arquitectura feature-based con persistencia en `localStorage`
> **Stack objetivo (mediano plazo):** Supabase (Auth + Postgres + Storage + Edge Functions) reemplazando los adapters mock

---

## 0. TL;DR — ¿Es viable terminar este ecommerce?

**Sí, es totalmente viable.** Lo que existe hoy es un **prototipo funcional de calidad** (homepage, catálogo, PDP, carrito, checkout multi-paso, página de éxito, envíos) con buena identidad visual y mobile-first, pero **le falta ~60% del scope** de un ecommerce completo: cuentas de usuario, búsqueda real, wishlist, reviews escribibles, historial de pedidos, **todo el panel administrativo**, cupones, suscripciones reales, manejo de inventario, devoluciones y la capa de datos remota.

La estrategia que propone este plan:

1. **Fundación primero**: instalar testing (Vitest + RTL + Playwright), reorganizar el código en **arquitectura feature-based** (islas), establecer un **data layer abstracto** con un adapter `mock+localStorage` que mañana se reemplaza por `supabase` sin tocar UI.
2. **TDD estricto** por feature: test rojo → implementación verde → refactor. Tests primero para dominio (cart, pricing, validación), luego para componentes (RTL), y E2E críticos con Playwright.
3. **Iterar por features** (no por páginas) cubriendo **flujo usuario + flujo admin** de cada dominio. Cada feature entrega: tipos, dominio, store, UI mobile + desktop, tests, documentación.
4. **Migrar a Supabase al final**: cuando el sistema esté completo con `localStorage`, se sustituye el adapter de datos. Estimación: 1 sprint puro de migración.

**Esfuerzo estimado:** 10–14 sprints de 1 semana (≈ 3 meses). Incluye TDD, dos vistas (mobile + desktop) y un admin completo.

---

## 1. Estado actual (auditoría)

### 1.1 Lo que funciona

| Ruta | Estado | Notas |
|---|---|---|
| `/` (Home) | ✅ | Hero, productos destacados, value props, testimonios, CTA. Sticky header + WhatsApp. |
| `/productos` | ✅ | Grid de 12 productos, filtros (categoría, tamaño, promos), búsqueda substring, sort. Filter sidebar responsive. |
| `/productos/[slug]` | ✅ | Gallery, specs (pH, origen, certificaciones), features, instrucciones de uso, reviews mock, relacionados, breadcrumb. |
| `/carrito` | ✅ | Items con qty controls, subtotal, envío (flat $8K o gratis >$120K). Doble salida: checkout o WhatsApp. |
| `/checkout` | ✅ | 4 pasos: contacto → dirección → pago → revisión. Validación visual, pero **ningún gateway real**. |
| `/checkout/exito` | ✅ | Order ID generado en cliente, recap, persistido en `sessionStorage`. |
| `/envios` | ✅ | 4 zonas, FAQ acordeón, horarios, fallback WhatsApp. |

### 1.2 Lo que NO existe

#### Lado usuario
- ❌ **Autenticación** (login, signup, recuperar password, sesión persistente).
- ❌ **Cuenta** (perfil, direcciones guardadas, métodos de pago, preferencias).
- ❌ **Historial de pedidos** y tracking.
- ❌ **Wishlist / favoritos**.
- ❌ **Reviews escribibles** (sólo lectura mock hoy).
- ❌ **Buscador avanzado** (autocomplete, sugerencias, tolerancia a typos).
- ❌ **Filtros avanzados** (precio range, rating, disponibilidad).
- ❌ **Cupones / códigos de descuento**.
- ❌ **Suscripciones** reales (producto existe en catálogo, no hay billing recurrente).
- ❌ **Pasarela de pago real** (todo es UI placeholder).
- ❌ **Validación de dirección** y costo de envío dinámico por zona.
- ❌ **Emails transaccionales** (confirmación, tracking, password reset).
- ❌ **Devoluciones / RMA**.
- ❌ **Notificaciones** (in-app y push).
- ❌ **Estados de carga globales** (skeletons existen pero no hay error boundaries).
- ❌ **404/500 personalizados** globales (sólo en `[slug]`).

#### Lado admin (cero implementado)
- ❌ **Login admin** con roles (super-admin / staff / read-only).
- ❌ **Dashboard** (KPIs: ventas, pedidos, conversión, top productos).
- ❌ **CRUD productos** (crear, editar, archivar, variantes, imágenes, stock, precios).
- ❌ **Gestión de pedidos** (listar, ver detalle, cambiar estado, notas internas, reembolsos).
- ❌ **Inventario** (stock, movimientos, alertas low-stock).
- ❌ **Clientes** (lista, ficha 360°, segmentos).
- ❌ **Cupones y promociones** (CRUD, reglas, vigencia).
- ❌ **Zonas y tarifas de envío** (CRUD, reglas de free shipping).
- ❌ **Reviews moderation** (aprobar, rechazar, responder).
- ❌ **Contenido** (banners home, FAQ, páginas estáticas).
- ❌ **Reportes** (ventas por período, productos más vendidos, abandono de carrito).
- ❌ **Configuración de tienda** (info de negocio, métodos de pago activos, impuestos).

### 1.3 Deuda técnica

- **Sin tests** (0 cobertura). Hay que instalar y empezar TDD desde el primer feature.
- **Components en `app/components/`** (acoplados a páginas, no a features).
- **Datos en `app/lib/products.ts`** (551 líneas hardcoded, sin schema, sin separación dominio/data).
- **CartProvider** funciona pero el store no está testado, no tipa `Cart` ni totals; cálculo de envío vive en `lib/cart-summary.ts` sin tests.
- **Sin Zod** ni validación de runtime.
- **Sin error boundary** ni `error.tsx` por ruta.
- **`force-dynamic`** en PDP sin razón clara — revisar para SEO/ISR.
- **Sin Storybook** (opcional, recomendado para design system).
- **Sin CI** (lint, typecheck, test, build).

### 1.4 Diseño actual (lo que se debe respetar)

- **Tailwind v4** con tokens custom en `globals.css`.
- Paleta: `#1b22a6` (primary), `#7fc7df` (accent), `#25d366` (whatsapp), `#2a2a2a` (ink), `#6b6b6b` (muted), `#e6e7ec` (border).
- Tipografía: Montserrat 400–900, fallback system.
- Spacing máximo 1440px, padding 20/32/48 (mobile/tablet/desktop).
- Bordes `rounded-2xl` y `rounded-full`; transiciones 0.3s; animaciones `shimmer`, `floatUp`, `cartBounce`.
- Imágenes vía `next/image` con sizes responsivos.
- **No dark mode** (light-only hoy; queda como mejora futura).

---

## 2. Investigación: qué hacen los ecommerce que convierten

Síntesis de fuentes (Baymard, DigitalApplied, BTNG.studio, Shopify, Shopaccino, Orbix, 2026):

### 2.1 Checkout (la zona crítica)

- **Guest checkout obligatorio.** Forzar registro = 24% de abandono; mover el "crear cuenta" a *después* del éxito del pedido.
- **One-page checkout** reduce abandono ~20% vs multi-step en mobile. Si se mantiene multi-step (como hoy), que **todo el resumen esté visible** y el progreso sea no-modal.
- **Ideal: 12–14 campos**. Hoy nuestro checkout tiene ~15 campos visibles → revisar para reducir.
- **Apple Pay / Google Pay arriba de todo** (express checkout) sube conversión 12–15%. Mockear ya el botón aunque no funcione.
- **CTA sticky abajo** en mobile (+5–12% conversión).
- **Trust signals** (badges SSL, política, garantía) al lado del botón de pago = +18% completion.
- **Costos totales visibles desde el carrito** (envío, impuestos, descuentos). Nada de sorpresas en el último paso.
- **`inputMode` correcto** por campo (numeric, email, tel) para mobile.
- **Validación en blur**, no en cada tecla. Errores debajo del campo, no en toast.

### 2.2 Catálogo y PDP

- **Búsqueda con autocomplete** (sugiere productos + categorías + búsquedas recientes).
- **Filtros chip** en desktop a la izquierda, **bottom-sheet** en mobile.
- **Sort + filter** siempre visibles en sticky bar.
- **PDP**: above-the-fold debe tener imagen + nombre + precio + qty + CTA add to cart; reviews y specs abajo en tabs.
- **Sticky add-to-cart** en mobile cuando se scrollea PDP.
- **Cross-sell** ("comprados juntos") y **upsell** ("clientes prefieren") en PDP y carrito.
- **Out-of-stock** visible con "notifícame cuando llegue".

### 2.3 Cart drawer (no sólo página)

- **Mini-cart sidebar** desde el ícono del header (no navegar a /carrito). Hoy tenemos el badge bouncing pero no abre drawer.
- En el drawer: upsell "¿te falta X para envío gratis?".

### 2.4 Admin dashboard (referencias 2026)

- **Visión 360 del pedido**: línea de tiempo (creado → pagado → en preparación → enviado → entregado → cerrado) + acciones contextuales (cancelar, reembolsar, agregar nota).
- **Product CRUD con bulk actions** (publicar/despublicar/duplicar/exportar CSV).
- **Inventario en tiempo real**: stock por SKU, umbrales low-stock, alertas.
- **Roles**: super-admin (todo), operations (pedidos+stock), marketing (cupones+contenido), read-only.
- **Reportes con date-range picker** y comparativa contra período anterior.
- **Search global** en admin (productos, pedidos, clientes).

---

## 3. Arquitectura objetivo (feature-based / islas)

### 3.1 Estructura de carpetas

```
ph-plus-frontend/
├── app/                          # Sólo enrutado y composición de islas
│   ├── (storefront)/             # Grupo del lado usuario
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Compone <HomeHero/>, <FeaturedProducts/>...
│   │   ├── productos/
│   │   │   ├── page.tsx          # Compone <ProductList/>
│   │   │   └── [slug]/page.tsx   # Compone <ProductDetail/>
│   │   ├── carrito/page.tsx
│   │   ├── checkout/...
│   │   ├── cuenta/...            # NUEVO
│   │   └── envios/page.tsx
│   ├── (admin)/                  # Grupo admin con su propio layout
│   │   ├── layout.tsx            # AdminShell (sidebar, topbar, auth gate)
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard KPIs
│   │   │   ├── productos/...
│   │   │   ├── pedidos/...
│   │   │   ├── inventario/...
│   │   │   ├── clientes/...
│   │   │   ├── cupones/...
│   │   │   ├── envios/...
│   │   │   ├── reviews/...
│   │   │   ├── contenido/...
│   │   │   └── ajustes/...
│   │   └── login/page.tsx
│   ├── api/                      # Route handlers (mock REST hoy, Supabase fns mañana)
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── layout.tsx
│
├── src/
│   ├── features/                 # ⭐ La isla por feature
│   │   ├── catalog/
│   │   │   ├── domain/           # Tipos, reglas puras, sin React
│   │   │   │   ├── product.ts
│   │   │   │   ├── filters.ts
│   │   │   │   └── product.test.ts
│   │   │   ├── data/             # Adapter (mock|supabase)
│   │   │   │   ├── ports.ts      # Interface ProductRepository
│   │   │   │   ├── mock.repo.ts  # In-memory + localStorage seed
│   │   │   │   ├── supabase.repo.ts   # (futuro)
│   │   │   │   └── index.ts      # Factory según ENV
│   │   │   ├── store/            # Estado UI (Zustand)
│   │   │   │   └── useCatalogStore.ts
│   │   │   ├── ui/               # Componentes React de la feature
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductCard.test.tsx
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductFilters.tsx
│   │   │   │   └── ProductFilters.mobile.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProducts.ts
│   │   │   └── index.ts          # Barrel: API pública de la feature
│   │   │
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── auth/                 # NUEVO
│   │   ├── account/              # NUEVO
│   │   ├── wishlist/             # NUEVO
│   │   ├── reviews/              # NUEVO
│   │   ├── search/               # NUEVO
│   │   ├── coupons/              # NUEVO
│   │   ├── orders/               # NUEVO
│   │   ├── shipping/
│   │   ├── notifications/        # NUEVO (toasts + email queue mock)
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       ├── inventory/
│   │       ├── customers/
│   │       ├── coupons/
│   │       ├── shipping-zones/
│   │       ├── reviews-mod/
│   │       ├── content/
│   │       └── settings/
│   │
│   ├── shared/                   # Reutilizable entre features
│   │   ├── ui/                   # Design system base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── DataTable.tsx
│   │   ├── lib/
│   │   │   ├── format.ts         # COP, fechas, etc.
│   │   │   ├── storage.ts        # localStorage wrapper tipado
│   │   │   ├── id.ts             # nanoid
│   │   │   ├── zod-helpers.ts
│   │   │   └── http.ts           # fetcher con error handling
│   │   ├── hooks/
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useLocalStorage.ts
│   │   └── design-system/
│   │       ├── tokens.css        # CSS variables
│   │       └── theme.ts
│   │
│   ├── mocks/                    # Fixtures + seed
│   │   ├── products.seed.ts
│   │   ├── users.seed.ts
│   │   ├── orders.seed.ts
│   │   ├── coupons.seed.ts
│   │   └── reviews.seed.ts
│   │
│   └── test/                     # Setup global de tests
│       ├── setup.ts
│       ├── render.tsx            # custom render con providers
│       └── fixtures/
│
├── e2e/                          # Playwright
│   ├── storefront/
│   │   ├── home.spec.ts
│   │   ├── catalog.spec.ts
│   │   ├── pdp.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   └── admin/
│       ├── login.spec.ts
│       ├── products-crud.spec.ts
│       └── orders.spec.ts
│
├── docs/
│   ├── PLAN.md                   # Este archivo
│   ├── ARCHITECTURE.md
│   ├── FUNCTIONAL-SPEC.md
│   ├── DESIGN-SYSTEM.md
│   ├── TESTING.md
│   └── SUPABASE-MIGRATION.md
│
├── public/
├── vitest.config.ts
├── playwright.config.ts
├── ...
```

### 3.2 Reglas de la arquitectura

1. **Una feature = una isla autocontenida**. `domain/` no importa React. `ui/` no importa repos directos: usa hooks que adentro instancian el adapter.
2. **Dependencias dirigidas**: `app → features → shared`. **Nunca** `features → app`. Cross-feature sólo vía `shared/`.
3. **Cada feature expone su API por `index.ts`**. Si necesitás algo de `catalog` desde `cart`, importás `@/features/catalog` (no `@/features/catalog/data/mock.repo`).
4. **Adapters intercambiables**: el factory en `data/index.ts` decide `mock` vs `supabase` por `process.env.NEXT_PUBLIC_DATA_BACKEND`.
5. **Store por feature** con Zustand (no Context global). Carrito, sesión, wishlist son slices independientes.
6. **Persistencia**: `localStorage` para carrito, wishlist, sesión simulada, draft del checkout, last order. **Nada de PII en localStorage** (sólo IDs y referencias).
7. **Server Components por defecto** en `app/`, sólo marcamos `"use client"` en `features/*/ui/*` cuando hay interactividad.
8. **`app/api/*`** son route handlers que llaman al adapter (no a la DB). El día de Supabase, el handler queda igual y sólo cambia el repo. Esto simula la red y permite SSR/RSC.

### 3.3 Capa de datos: el "Repository Pattern"

```ts
// src/features/catalog/data/ports.ts
export interface ProductRepository {
  list(filters?: ProductFilters): Promise<Product[]>;
  bySlug(slug: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, patch: UpdateProductInput): Promise<Product>;
  archive(id: string): Promise<void>;
  search(q: string): Promise<Product[]>;
}
```

Implementaciones:
- `mock.repo.ts` lee de `mocks/products.seed.ts`, escribe en `localStorage` (key `phplus.db.products.v1`). Simula latencia con `await sleep(300)`.
- `supabase.repo.ts` (futuro) usa cliente Supabase con RLS.

**El día de la migración: sólo cambia el factory.**

### 3.4 Diagrama de dependencias

```
                  ┌──────────────────────────┐
                  │   app/  (Next.js routes) │
                  └─────────────┬────────────┘
                                │ usa
                  ┌─────────────▼────────────┐
                  │    features/*  (islas)   │
                  │  ┌────────────────────┐  │
                  │  │ ui/ ── hooks/ ──── │  │
                  │  │           │        │  │
                  │  │       store/       │  │
                  │  │           │        │  │
                  │  │  data/repo ←─ ports│  │
                  │  │           │        │  │
                  │  │      domain/       │  │
                  │  └────────────────────┘  │
                  └─────────────┬────────────┘
                                │ usa
                  ┌─────────────▼────────────┐
                  │    shared/ (UI + libs)   │
                  └──────────────────────────┘
```

---

## 4. Stack técnico que se agrega

| Paquete | Para qué | Notas |
|---|---|---|
| `vitest` | Test runner | Compat con Next 16 + Vite ecosystem |
| `@testing-library/react` | Tests de componente | `screen`, `userEvent` |
| `@testing-library/jest-dom` | matchers | `toBeInTheDocument`, etc. |
| `happy-dom` | DOM env | Más rápido que jsdom |
| `@vitejs/plugin-react` | JSX en tests | |
| `@playwright/test` | E2E | Trazas, mobile/desktop projects |
| `zustand` | Stores por feature | Reemplaza el CartProvider hecho a mano |
| `zod` | Schemas runtime + validación forms | Compartido entre UI y dominio |
| `nanoid` | IDs | Pedidos, mock entities |
| `clsx` + `tailwind-merge` | classNames | utilitarios |
| `lucide-react` | Iconos | reemplaza SVGs sueltos donde aplique |
| `@hookform/resolvers` + `react-hook-form` | Formularios | checkout, admin |
| `date-fns` | Fechas | dashboard, pedidos |
| `recharts` | Gráficos del dashboard admin | |
| `msw` (opcional) | Mock service worker | si queremos pruebas de red verdaderas |

CI con GitHub Actions: `lint` → `typecheck` → `test` → `build` → `e2e` (smoke).

---

## 5. TDD: cómo trabajamos

### 5.1 Pirámide

```
        ╱  E2E Playwright (10–15 specs críticas)
       ╱───
      ╱ Componente (RTL) — alta cobertura en flows
     ╱──────
    ╱ Dominio (vitest puro) — 100% en reglas de negocio
   ╱────────────
```

### 5.2 Ciclo por feature

1. **Spec funcional** en `docs/FUNCTIONAL-SPEC.md` (o ticket).
2. **Domain tests primero**: reglas puras (cálculo de envío, validación de cupón, aplicación de descuento, transición de estado de pedido).
3. **Repository tests**: el mock repo cumple el contrato (CRUD, búsqueda, persistencia).
4. **Component tests (RTL)**: render, interacciones, estados (loading, empty, error).
5. **Integración**: hook + store + repo juntos (vitest con happy-dom).
6. **E2E** del happy path crítico (Playwright).
7. **Docs**: actualizar `FUNCTIONAL-SPEC.md` con lo que quedó.

### 5.3 Convenciones

- Test colocado al lado del archivo: `Foo.tsx` ↔ `Foo.test.tsx`.
- `describe` por archivo, `it("should ...")` legible como spec.
- Sin snapshots gigantes — `toHaveTextContent`, `getByRole`, `findByRole`.
- Stores se testean con `act()` y verificando estado, no DOM.
- Mocks de `next/navigation` y `next/image` en `src/test/setup.ts`.
- E2E: cada spec arranca con DB mock reseteada (helper `resetMockDb()` expuesto en `window` en dev).

---

## 6. Plan por fases (sprints de 1 semana)

> Cada sprint cierra con: tests verdes, build verde, demo mobile + desktop, docs actualizadas.

### Sprint 0 — Cimiento (1 semana)

**Objetivo:** dejar la base lista, sin romper lo que hay.

- [ ] Crear `src/` y mover paulatinamente.
- [ ] Instalar Vitest + RTL + Playwright. `vitest.config.ts`, `playwright.config.ts`, `src/test/setup.ts`.
- [ ] Smoke E2E: home carga, /productos lista, agregar al carrito, /checkout/exito.
- [ ] Reescribir `lib/cart-summary.ts` con tests primero (caso baseline TDD del equipo).
- [ ] Migrar `CartProvider` a un store Zustand `useCart` con persistencia tipada y tests.
- [ ] Configurar GitHub Actions (lint, typecheck, vitest, build).
- [ ] Docs: `ARCHITECTURE.md`, `TESTING.md`, `DESIGN-SYSTEM.md` (tokens).

**Entregable:** mismas pantallas que hoy + tests + arquitectura lista para crecer.

### Sprint 1 — Design System base + Header/Footer reusables

- [ ] `shared/ui/` con `Button`, `Input`, `Select`, `Modal`, `Drawer`, `Toast`, `Badge`, `EmptyState`, `Tabs`, `Tooltip`, `Skeleton`, `Dialog`, `Pagination`, `DataTable`. Cada uno con tests RTL.
- [ ] Tokens (`tokens.css`): colores, spacing, radius, shadows, motion.
- [ ] Refactor `Header` para usar `Drawer` (menú mobile) y abrir mini-cart.
- [ ] Refactor `Footer`.
- [ ] **Mini-cart drawer** (desde el ícono carrito en header).

### Sprint 2 — Catálogo robusto

- [ ] `features/catalog/domain/` (Product, Category, Filters, Sort).
- [ ] `ProductRepository` con mock + localStorage seed.
- [ ] `ProductList` con filtros chip (desktop) y bottom-sheet (mobile).
- [ ] Sort sticky bar.
- [ ] Paginación (12/24/48 por página) o "load more".
- [ ] Estados vacío / error / loading.
- [ ] Tests de dominio, repo y UI.

### Sprint 3 — Búsqueda

- [ ] `features/search/` con índice in-memory (Fuse.js o implementación simple) sobre catálogo.
- [ ] **Search bar global** en header con autocomplete (productos, categorías, "ver todos").
- [ ] Página `/buscar?q=` con resultados y filtros.
- [ ] Búsquedas recientes en `localStorage`.
- [ ] Tests: relevancia, autocomplete, historial.

### Sprint 4 — PDP profesional

- [ ] Refactor `productos/[slug]` como `features/catalog/ui/ProductDetail`.
- [ ] Gallery con zoom y swipe móvil.
- [ ] Sticky add-to-cart en mobile.
- [ ] Tabs (descripción / specs / reviews / envío) accesibles (ARIA).
- [ ] Cross-sell ("comprados juntos") y "relacionados".
- [ ] **Notify when in stock** (placeholder con email mock).
- [ ] Tests + E2E happy path.

### Sprint 5 — Carrito completo

- [ ] Página `/carrito` rediseñada usando `features/cart`.
- [ ] Cupón input (validado contra `features/coupons`).
- [ ] Cálculo de envío visible y dinámico según ciudad (input de zip/ciudad → estimación).
- [ ] Upsell "te falta X para envío gratis".
- [ ] Save for later (link a wishlist).
- [ ] Tests + E2E.

### Sprint 6 — Auth (mock con localStorage) + Cuenta

- [ ] `features/auth`: login, signup, recuperar password (todo simulado con `users` en localStorage).
- [ ] Hash de password con `crypto.subtle` (que parezca real).
- [ ] `useSession` hook + guard `<RequireAuth/>`.
- [ ] `features/account`: perfil, cambiar password, direcciones (CRUD), métodos de pago (mock).
- [ ] Pre-fill de checkout con datos guardados.
- [ ] Tests + E2E.

### Sprint 7 — Checkout pro

- [ ] Reducir a 12–14 campos. Guest checkout por defecto.
- [ ] Express checkout placeholders (Apple Pay / Google Pay / Mercado Pago / PSE) — botones arriba.
- [ ] Single-page accordion (mobile) o 2-col con resumen sticky (desktop).
- [ ] Validación con Zod + react-hook-form.
- [ ] CTA sticky bottom en mobile.
- [ ] Trust signals junto al botón de pagar.
- [ ] "Crear cuenta después de comprar" prompt en `/checkout/exito`.
- [ ] Tests + E2E.

### Sprint 8 — Wishlist + Reviews escribibles

- [ ] `features/wishlist`: agregar/quitar, página `/cuenta/favoritos`, badge en header.
- [ ] `features/reviews`: usuario logueado puede dejar review (rating + texto + foto opcional). Queda en estado `pending` para moderar.
- [ ] Tests + E2E.

### Sprint 9 — Historial de pedidos + Tracking

- [ ] `features/orders` (lado usuario): lista de pedidos del usuario logueado, detalle, "comprar de nuevo".
- [ ] Línea de tiempo de estado (pendiente → pagado → preparando → enviado → entregado).
- [ ] Cancelar pedido (si estado lo permite).
- [ ] Solicitar devolución (queda como ticket).
- [ ] Tests + E2E.

### Sprint 10 — Admin: login + dashboard + productos

- [ ] `(admin)` route group con layout propio (sidebar colapsable, topbar con search global, user menu).
- [ ] **Auth admin** con rol (`super_admin`, `staff`, `read_only`). Guard de ruta + UI.
- [ ] **Dashboard**: KPIs (ventas hoy/semana/mes, pedidos por estado, productos top, conversión mock, abandono carrito mock), gráficas con Recharts, date-range picker.
- [ ] **Productos**: lista con DataTable (sort, filter, bulk actions: publicar/despublicar/archivar/duplicar/export CSV), crear/editar con tabs (general, precio, imágenes, stock, SEO).
- [ ] Tests + E2E.

### Sprint 11 — Admin: pedidos + inventario + clientes

- [ ] **Pedidos**: lista con filtros (estado, fecha, monto, cliente), detalle con timeline accionable (marcar enviado con tracking number, reembolsar, agregar nota interna, contactar cliente vía WA).
- [ ] **Inventario**: lista por SKU, ajuste manual (entrada/salida con motivo), histórico de movimientos, alertas low-stock.
- [ ] **Clientes**: lista, ficha 360° (datos, pedidos, valor de vida, direcciones, notas).
- [ ] Tests + E2E.

### Sprint 12 — Admin: cupones + envíos + reviews + contenido + ajustes

- [ ] **Cupones**: CRUD (código, tipo: %/monto/envío gratis, vigencia, mínimo de compra, uso por cliente, total).
- [ ] **Zonas de envío**: CRUD (zona, costo, tiempo estimado, regla free-shipping).
- [ ] **Reviews moderation**: cola, aprobar/rechazar/responder.
- [ ] **Contenido**: banners del home, FAQ, páginas estáticas.
- [ ] **Ajustes**: info del negocio, métodos de pago activos, impuestos, política de devolución.
- [ ] Tests + E2E.

### Sprint 13 — Notificaciones + 404/500/error UX + a11y + performance

- [ ] `features/notifications`: toasts globales (success/error/info), simulación de emails enviados (panel admin "outbox").
- [ ] `app/error.tsx`, `app/not-found.tsx`, error boundary por feature.
- [ ] Auditoría a11y (axe-core + tests RTL con role queries).
- [ ] Auditoría Lighthouse mobile (target ≥90 perf, ≥95 a11y).
- [ ] Image optimization revisión.
- [ ] Bundle analysis (route-level).

### Sprint 14 — Hardening + Migración Supabase (opcional en este ciclo)

- [ ] Schema Supabase a partir de los tipos de dominio.
- [ ] Implementar `supabase.repo.ts` para cada feature.
- [ ] RLS por rol (user / admin) y tablas (products, orders, etc.).
- [ ] Migrar `features/auth` a Supabase Auth (sin cambiar la UI).
- [ ] Storage para imágenes de productos.
- [ ] Edge function para emails transaccionales (mock SMTP en dev).
- [ ] Flag de feature: backend `mock | supabase` por ENV. Pruebas en paralelo.
- [ ] Smoke E2E completo en ambos backends.

---

## 7. Mobile + desktop: estrategia

- **Mobile-first** en todo Tailwind. Cada componente parte de `flex flex-col`, luego `md:flex-row`.
- **Breakpoints**: usamos los defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`). Container max 1440.
- **Patrones por superficie**:
  - **Header**: logo + search + cart + menú (hamburguer < lg). Drawer side para nav.
  - **Filtros catálogo**: sidebar `lg+`, bottom-sheet `<lg`.
  - **PDP**: 1 columna `<lg`, 2 columnas `lg+`. Sticky CTA en mobile.
  - **Checkout**: single column `<lg` con resumen colapsable arriba; 2 col `lg+` con resumen sticky derecho.
  - **Admin**: sidebar colapsable a íconos en `<xl`; drawer en `<lg`. Tablas con scroll horizontal y columnas prioritarias en mobile.
- **Touch targets** ≥ 44×44px. `inputMode` correcto en todos los inputs numéricos.
- **Detect mobile vía `useMediaQuery`** sólo cuando sea necesario (preferimos CSS).
- **Playwright projects**: `chromium-desktop` (1280×800) y `mobile-iphone-13` para E2E.

---

## 8. Persistencia con localStorage (hoy) y migración (mañana)

### 8.1 Reglas

- Wrapper tipado `shared/lib/storage.ts` con namespace `phplus.` y versión de schema (`.v1`).
- **Nada de PII en localStorage**: passwords son hashes, datos sensibles van a la "DB mock" (`phplus.db.*`) separada de "session" (`phplus.session`).
- Mock DB se inicializa desde `mocks/*.seed.ts` la primera vez y de ahí en más se respeta lo persistido.
- Operaciones CRUD del repo mock devuelven `Promise<T>` con `sleep` aleatorio (150–500ms) para simular red.

### 8.2 Llaves

```
phplus.session              { userId, role, expiresAt }
phplus.cart.v1              [{ slug, qty }]
phplus.wishlist.v1          [slug]
phplus.checkout.draft.v1    { contact, shipping, payment }
phplus.last-order.v1        { orderId, total, items }
phplus.db.products.v1
phplus.db.users.v1
phplus.db.orders.v1
phplus.db.reviews.v1
phplus.db.coupons.v1
phplus.db.shipping-zones.v1
phplus.db.notifications.v1
phplus.db.content.v1
phplus.db.settings.v1
phplus.search.recent.v1     [q]
```

### 8.3 Migración a Supabase (Sprint 14)

1. Generar tipos TS desde Supabase (`generate_typescript_types`).
2. Crear tablas con migraciones (`apply_migration`).
3. Implementar repos `supabase.repo.ts` por feature **uno por uno**, manteniendo tests.
4. Flag `NEXT_PUBLIC_DATA_BACKEND=mock|supabase`.
5. Seed real desde `mocks/*.seed.ts`.
6. RLS:
   - `products`: read público, write sólo `staff+`.
   - `orders`: read del propio cliente, write con check, full access `staff+`.
   - `reviews`: read público de approved, write usuario logueado.
   - admin tablas: sólo `staff+`.
7. Reemplazar mock auth por Supabase Auth (email/password + OAuth opcional).
8. Storage bucket `product-images` con políticas.

---

## 9. Métricas de éxito

- ✅ **Cobertura de tests**: dominio 100%, componentes ≥ 80% líneas, E2E happy paths cubiertos (catalog, pdp, cart, checkout, account, admin login + crud).
- ✅ **Lighthouse mobile**: Performance ≥ 90, A11y ≥ 95, Best Practices ≥ 95, SEO ≥ 95 en home, /productos, PDP, /carrito.
- ✅ **Bundle**: rutas storefront < 200KB JS inicial; admin puede ser más pesado.
- ✅ **CI verde**: lint, typecheck, unit, build, E2E smoke.
- ✅ **Cero `any`** en código de features (sólo en interop puntual con libs).
- ✅ **Toda feature documentada** en `FUNCTIONAL-SPEC.md`.

---

## 10. Riesgos y cómo mitigamos

| Riesgo | Mitigación |
|---|---|
| Next 16 breaking changes vs entrenamiento de modelos | Leer `node_modules/next/dist/docs/` antes de cada feature compleja. RSC vs Client claro. |
| El mock se vuelve "real" y nadie quiere migrar | Mantener `ports.ts` minimal y contratos explícitos. Tests del repo contra interface, no contra impl. |
| TDD frena el ritmo al principio | Sprint 0 establece patrones; a partir del 2 se acelera. |
| Admin se subestima | Tiene 3 sprints dedicados (10–12) y reusa el DataTable + design system de Sprint 1. |
| Diseño se desvía | `DESIGN-SYSTEM.md` con tokens; cualquier componente nuevo nace en `shared/ui/` antes que en una feature. |
| `localStorage` se llena | Cap por tabla (e.g. 500 pedidos mock), purge en init si supera tamaño. |

---

## 11. Documentos hermanos

- **`docs/ARCHITECTURE.md`** — detalle de carpetas, capas, reglas de imports, ejemplos de feature.
- **`docs/FUNCTIONAL-SPEC.md`** — qué hace cada feature, estados, reglas de negocio.
- **`docs/DESIGN-SYSTEM.md`** — tokens, componentes, patrones mobile/desktop.
- **`docs/TESTING.md`** — convenciones, ejemplos, comandos.
- **`docs/SUPABASE-MIGRATION.md`** — schema, RLS, pasos.

---

## 12. Próximo paso concreto (lunes que viene)

1. Crear branch `feat/foundation`.
2. Instalar dependencias del Sprint 0.
3. Configurar Vitest + RTL + Playwright.
4. Mover `lib/cart-summary.ts` a `features/cart/domain/pricing.ts`, escribir tests **rojos** primero, refactor.
5. Migrar `CartProvider` → `useCart` (Zustand).
6. Abrir PR con CI verde.

Cuando estés listo, decimos *"empezamos sprint 0"* y arranco con los tests de pricing como primer commit TDD.
