# PH PLUS — E-commerce

> Tienda online de agua alcalina PH PLUS. Next.js 16 + Supabase + feature-based
> architecture + TDD estricto.

[![CI](https://github.com/davideliaspalacio/ph-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/davideliaspalacio/ph-plus/actions/workflows/ci.yml)

---

## ⚡ Quick start

```bash
# 1. Clonar e instalar
git clone git@github.com:davideliaspalacio/ph-plus.git
cd ph-plus/ph-plus-frontend
pnpm install

# 2. Copiar variables (por default arranca en modo mock — sin Supabase)
cp .env.example .env.local

# 3. Levantar el dev server
pnpm dev
# → http://localhost:3000
```

En modo mock (default) podés registrarte con cualquier email y password ≥ 8
caracteres con al menos un dígito. La data persiste en `localStorage`.

Para activar **Supabase con data real**, ver
[`docs/SUPABASE-MIGRATION.md`](docs/SUPABASE-MIGRATION.md) — toma ~40 minutos.

---

## 🏗️ Arquitectura

Feature-based con **repository pattern** y **adapter intercambiable mock/Supabase**.

```
ph-plus-frontend/
├── app/                            # Rutas Next.js 16 (App Router)
│   ├── (storefront)/*              # 14 rutas usuario
│   └── (admin)/admin/*             # 11 rutas admin
│
├── src/
│   ├── features/                   # 17 features autocontenidas
│   │   └── <feature>/
│   │       ├── domain/             # Reglas puras + Zod schemas
│   │       ├── data/
│   │       │   ├── ports.ts        # Interface del repository
│   │       │   ├── mock.repo.ts    # Impl. localStorage (dev/demo)
│   │       │   ├── supabase.repo.ts# Impl. Supabase (prod)
│   │       │   └── index.ts        # Factory: switch por env
│   │       ├── store/              # Zustand stores
│   │       ├── ui/                 # React components
│   │       └── index.ts            # API pública
│   │
│   ├── shared/
│   │   ├── ui/                     # Design system base (11 componentes)
│   │   ├── lib/                    # storage, format, cn, id, async
│   │   └── supabase/               # Clients server / browser / proxy
│   │
│   ├── mocks/                      # Seeds compartidos (dev)
│   └── test/                       # Vitest setup
│
├── supabase/
│   ├── migrations/                 # SQL versionado (4 archivos)
│   ├── seed.sql                    # Data demo idempotente
│   └── config.toml                 # Config local CLI
│
├── e2e/                            # Playwright (76 screenshots de entrega)
├── docs/                           # PLAN, ARCHITECTURE, WORKFLOWS, SECURITY...
└── proxy.ts                        # Next 16: refresh sesión Supabase
```

### Las 17 features

| Storefront | Admin |
|---|---|
| `account` (perfil, direcciones, wishlist UI, orders UI) | `admin/shell` (layout + login + role guard) |
| `auth` (login/signup/recover, Supabase Auth + mock) | `admin/dashboard` (KPIs, últimos pedidos, top productos) |
| `cart` (pricing, MiniCart drawer, checkout-pricing) | `admin/products` (CRUD tabla + form 5 tabs) |
| `catalog` (filtros, sort, PDP, gallery, related) | `admin/orders-ui` (lista, timeline accionable, notas) |
| `checkout` (Zod form, cupón, live totals) | `admin/inventory` (stock, movements, ajustes) |
| `coupons` (validate, apply, repo) | `admin/customers` (lista, 360 file, LTV, VIP) |
| `notifications` (outbox, templates, send service) | `admin/coupons-ui` (CRUD UI) |
| `orders` (state machine, repo, notas) | `admin/shipping-zones-ui` (CRUD UI) |
| `reviews` (schema, aggregate, moderación) | `admin/reviews-ui` (cola de moderación) |
| `search` (ranking, history, autocomplete) | `admin/content` (hero, banners, FAQ) |
| `shipping` (zonas, matchZone, calcShipping) | `admin/settings` (config + email outbox) |
| `wishlist` (toggle, persistent store) | |

---

## 🧪 Tests

| Suite | Estado |
|---|---|
| Unitarios (Vitest + RTL) | **597 tests / 96 archivos** ✅ |
| E2E screenshots (Playwright) | **76 capturas** (38 desktop + 38 mobile) |
| Typecheck (`tsc --noEmit`) | ✅ |
| Build (`next build`) | ✅ 25 rutas |

```bash
pnpm test           # watch
pnpm test:run       # one-shot (CI)
pnpm typecheck
pnpm build
pnpm screenshots    # Playwright + INDEX.md
```

---

## 🔄 Cambiar de mock a Supabase

Una sola variable de entorno cambia todo:

```bash
# .env.local
NEXT_PUBLIC_DATA_BACKEND=supabase   # antes: mock
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # SECRETA, sólo en server
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

El detalle paso a paso (crear el proyecto Supabase, aplicar migraciones,
sembrar la DB, crear usuarios admin, configurar Vercel, etc.):
[`docs/SUPABASE-MIGRATION.md`](docs/SUPABASE-MIGRATION.md).

---

## 🚀 Deploy en producción

### Vercel + Supabase = **$0/mes** para tráfico bajo

| Servicio | Plan | $/mes |
|---|---|---|
| Vercel | Hobby | $0 |
| Supabase | Free (con keep-alive workflow) | $0 |
| Resend | Free 3k emails/mes | $0 |
| GitHub Actions | gratis | $0 |
| **Total** | | **$0** |

1. Import repo en Vercel.
2. Root directory: `ph-plus-frontend`.
3. Settings → Environment Variables: las 5 vars de `.env.example`.
4. Deploy. Listo.
5. (Si vas a Supabase) configurar el workflow `supabase-keepalive.yml`
   para evitar la pausa de 7 días del free tier.

Detalle: [`docs/SUPABASE-MIGRATION.md`](docs/SUPABASE-MIGRATION.md) sección 6.

---

## 📚 Documentación

| Doc | Para qué |
|---|---|
| [`docs/PLAN.md`](docs/PLAN.md) | Roadmap completo, feasibility, sprints 0–14 |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Reglas de capas, repository pattern, ADRs |
| [`docs/FUNCTIONAL-SPEC.md`](docs/FUNCTIONAL-SPEC.md) | 25 features con estados, máquina, eventos |
| [`docs/SUPABASE-MIGRATION.md`](docs/SUPABASE-MIGRATION.md) | Setup Supabase paso a paso |
| [`docs/WORKFLOWS.md`](docs/WORKFLOWS.md) | Flujos usuario + admin con diagramas |
| [`docs/SECURITY.md`](docs/SECURITY.md) | RLS, roles, manejo de keys, qué exponer |
| [`docs/TESTING.md`](docs/TESTING.md) | Convenciones TDD, recetas |

---

## 📦 Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime**: React 19
- **Lenguaje**: TypeScript 5 strict
- **Estilos**: Tailwind v4 + tokens custom (`globals.css`)
- **Estado**: Zustand con persist middleware
- **Validación**: Zod (schemas compartidos UI + DB)
- **DB**: PostgreSQL via Supabase (con RLS por rol)
- **Auth**: Supabase Auth (email + password, OAuth opcional)
- **Storage**: Supabase Storage (product-images + review-photos)
- **Tests**: Vitest + RTL + jest-dom + Playwright
- **Deploy**: Vercel + Supabase
- **CI**: GitHub Actions (lint + typecheck + test + build)

---

## 📄 Licencia

Propietario — © 2026 PH PLUS. Todos los derechos reservados.
