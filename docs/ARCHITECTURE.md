# Arquitectura — PH PLUS Frontend

> Documento vivo. Cada decisión nueva se registra acá con fecha. Lo que está debajo es la versión 1.0 (2026-05-20).

---

## 1. Principios

1. **Feature-based / islas**: cada dominio funcional (catálogo, carrito, checkout, auth, admin/products, etc.) vive en su propia carpeta autocontenida.
2. **Dependencias dirigidas**: `app → features → shared`. Cross-feature siempre vía la API pública (`index.ts`) de la feature.
3. **Capas dentro de cada feature**: `domain` (puro, sin React) → `data` (repos detrás de un puerto) → `store` (Zustand) → `hooks` → `ui`.
4. **Adapters intercambiables**: hoy `mock+localStorage`, mañana `supabase`. La feature no se entera.
5. **Server Components por defecto**, `"use client"` sólo donde hay interactividad.
6. **TDD**: el primer commit de cada feature es un test rojo.

---

## 2. Árbol de carpetas (referencia)

```
ph-plus-frontend/
├── app/                     # Routing Next 16 (App Router)
│   ├── (storefront)/        # Layout y rutas del lado usuario
│   ├── (admin)/             # Layout y rutas del lado admin
│   ├── api/                 # Route handlers (REST mock; mañana Supabase)
│   ├── error.tsx · not-found.tsx · layout.tsx · globals.css
│
├── src/
│   ├── features/<feature>/
│   │   ├── domain/          # Tipos + reglas puras + tests
│   │   ├── data/            # ports.ts + mock.repo.ts + supabase.repo.ts + index.ts
│   │   ├── store/           # Zustand slices
│   │   ├── hooks/           # use<Feature>* (React Query opcional)
│   │   ├── ui/              # Componentes React de la feature
│   │   └── index.ts         # API pública (barrel)
│   │
│   ├── shared/
│   │   ├── ui/              # Design system base
│   │   ├── lib/             # format, storage, http, id, zod helpers
│   │   ├── hooks/           # useMediaQuery, useDebounce, useLocalStorage
│   │   └── design-system/   # tokens.css, theme.ts
│   │
│   ├── mocks/               # Seeds y fixtures
│   └── test/                # Setup global de Vitest
│
├── e2e/                     # Playwright (storefront/ + admin/)
├── docs/                    # Plan, arquitectura, spec funcional, etc.
└── public/                  # Assets estáticos
```

---

## 3. Reglas de imports (lint-enforced eventualmente)

| Origen | Puede importar de | NO puede importar de |
|---|---|---|
| `app/` | `features/*`, `shared/*` | otra ruta `app/` (excepto layouts) |
| `features/<a>/` | `features/<a>/*` (interno), `shared/*` | `features/<b>/*` salvo por `index.ts` |
| `features/*/domain/` | nada de la app (sólo libs puras) | React, Next, browser APIs |
| `features/*/ui/` | `domain`, `store`, `hooks`, `shared/ui`, `shared/lib` | `data/*.repo.ts` directo (siempre vía hook/store) |
| `shared/*` | `shared/*` | `features/*`, `app/*` |

ESLint rule sugerida: `import/no-restricted-paths` + boundaries por capa.

---

## 4. Anatomía de una feature

Ejemplo: `features/catalog/`.

### 4.1 `domain/`

Sólo TypeScript puro. **No importa React ni Next.**

```ts
// domain/product.ts
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().optional(),
  categoryId: z.string(),
  sizeMl: z.number().int().positive().nullable(),
  images: z.array(z.string().url()),
  stock: z.number().int().nonnegative(),
  isActive: z.boolean(),
  visualKey: z.enum(["kit", "garrafas", "recargas"]).optional(),
});
export type Product = z.infer<typeof ProductSchema>;
```

```ts
// domain/filters.ts
export type Sort = "popular" | "price-asc" | "price-desc" | "newest";
export interface ProductFilters {
  q?: string;
  category?: string;
  size?: "small" | "medium" | "large" | "xl";
  promo?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: Sort;
}
export function applyFilters(list: Product[], f: ProductFilters): Product[] { /* puro */ }
```

Tests en `domain/filters.test.ts` cubren cada rama.

### 4.2 `data/`

Puerto + implementaciones.

```ts
// data/ports.ts
export interface ProductRepository {
  list(f?: ProductFilters): Promise<Product[]>;
  bySlug(slug: string): Promise<Product | null>;
  create(input: NewProduct): Promise<Product>;
  update(id: string, patch: Partial<Product>): Promise<Product>;
  archive(id: string): Promise<void>;
}
```

```ts
// data/mock.repo.ts
import { storage } from "@/shared/lib/storage";
import { sleep } from "@/shared/lib/async";
import { productsSeed } from "@/mocks/products.seed";

export class MockProductRepo implements ProductRepository {
  private key = "phplus.db.products.v1";

  private read(): Product[] {
    return storage.get(this.key) ?? storage.set(this.key, productsSeed);
  }
  async list(f?: ProductFilters) {
    await sleep(rand(150, 400));
    return applyFilters(this.read(), f ?? {});
  }
  // ...
}
```

```ts
// data/index.ts
import { MockProductRepo } from "./mock.repo";
// import { SupabaseProductRepo } from "./supabase.repo";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";
export const productRepo: ProductRepository =
  backend === "supabase"
    ? /* new SupabaseProductRepo() */ new MockProductRepo()
    : new MockProductRepo();
```

### 4.3 `store/`

Zustand con persistencia donde aplique.

```ts
// store/useCatalogStore.ts
export const useCatalogStore = create<CatalogState>((set, get) => ({
  filters: {},
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  reset: () => set({ filters: {} }),
}));
```

### 4.4 `hooks/`

```ts
// hooks/useProducts.ts
export function useProducts() {
  const filters = useCatalogStore((s) => s.filters);
  const [data, setData] = useState<Product[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let cancelled = false;
    productRepo.list(filters)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e));
    return () => { cancelled = true; };
  }, [filters]);
  return { data, error, isLoading: data === null && !error };
}
```

> **Nota:** podemos sumar TanStack Query cuando esto crezca; por ahora `useEffect` simple alcanza.

### 4.5 `ui/`

Componentes React de la feature. Mobile + desktop coexisten:

- `ProductFilters.tsx` (responsive, branchea por `useMediaQuery`).
- O bien `ProductFilters.desktop.tsx` + `ProductFilters.mobile.tsx` cuando el árbol JSX es muy distinto.

### 4.6 `index.ts` (API pública)

```ts
export { ProductCard } from "./ui/ProductCard";
export { ProductList } from "./ui/ProductList";
export { ProductDetail } from "./ui/ProductDetail";
export { productRepo } from "./data";
export type { Product, ProductFilters } from "./domain/product";
```

**Sólo se importa la feature por su `index.ts`** desde fuera.

---

## 5. Patrón de páginas en `app/`

Las rutas son lo más finitas posible. Componen islas.

```tsx
// app/(storefront)/productos/page.tsx
import { ProductList } from "@/features/catalog";

export default function ProductosPage() {
  return <ProductList />;
}
```

Server Components hacen `await repo.list()` cuando se puede (mejora SEO).

```tsx
// app/(storefront)/productos/[slug]/page.tsx
import { productRepo, ProductDetail } from "@/features/catalog";
import { notFound } from "next/navigation";

export default async function PDP({ params }: { params: { slug: string } }) {
  const product = await productRepo.bySlug(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
```

---

## 6. Estado global vs local

| Estado | Dónde vive | Persistencia |
|---|---|---|
| Carrito | `features/cart/store` (Zustand) | `localStorage` (`phplus.cart.v1`) |
| Wishlist | `features/wishlist/store` | `localStorage` |
| Sesión | `features/auth/store` | `localStorage` (sólo `userId`+`role`+`exp`) |
| Filtros catálogo | `features/catalog/store` | sólo memoria (URL params para shareable) |
| Notificaciones (toasts) | `features/notifications/store` | memoria |
| Draft de checkout | `features/checkout/store` | `localStorage` |
| Admin UI (sidebar collapsed, etc.) | `features/admin/store` | `localStorage` |

**No** uses Context para nada de esto. Zustand más simple y testeable.

---

## 7. Convenciones de naming

- Archivos: `kebab-case.ts` para utils, `PascalCase.tsx` para componentes.
- Hooks: `useX`.
- Stores: `useXStore`.
- Repos: `xRepo` (singleton exportado desde `data/index.ts`).
- Tipos: `PascalCase`; schemas Zod: `XSchema` (mismo nombre + Schema sufijo).
- Tests: junto al archivo, `*.test.ts(x)`.
- Constantes: `UPPER_SNAKE` sólo cuando son verdaderamente constantes; en general `camelCase`.

---

## 8. Server Components vs Client Components

- `app/**/page.tsx`, `app/**/layout.tsx`: por defecto Server. Pueden hacer `await repo.list()`.
- `features/**/ui/*.tsx`: si tiene `useState`, `useEffect`, `onClick`, handlers → `"use client"` en la primera línea.
- Mezcla: la página (server) hace data fetch y le pasa props serializables al componente cliente.

**Regla**: una página server NO importa nada de un store Zustand. Si necesita estado interactivo, lo delega en una isla cliente.

---

## 9. Manejo de errores y loading

- `app/**/loading.tsx`: skeleton de página (ya hay varios).
- `app/**/error.tsx`: error boundary por ruta.
- `app/error.tsx` y `app/not-found.tsx`: global.
- Dentro de features: estados `loading | empty | error | ready` explícitos en cada lista.

---

## 10. Estilos y design system

- Tokens en `src/shared/design-system/tokens.css` (CSS variables) consumidos por Tailwind via `@theme inline` (v4).
- Componentes base en `src/shared/ui/`. Cada uno con su test.
- Storybook **opcional** post-Sprint 12 si crece la base.
- Mobile-first: nunca escribir `desktop-first`. Empieza por la pantalla angosta.

---

## 11. Testing

Ver `docs/TESTING.md` (a crear). Resumen:

- `vitest` + `happy-dom` + `@testing-library/react`.
- `setup.ts` mockea `next/navigation`, `next/image` y polyfills.
- Render helper con providers (cart, auth, toast).
- E2E con Playwright: `projects: [chromium-desktop, mobile-iphone-13]`.
- CI: `pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm e2e:smoke`.

---

## 12. Migración a Supabase (resumen)

1. Crear proyecto Supabase, ENV vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
2. Migraciones SQL alineadas con los Zod schemas del dominio.
3. Generar tipos TS (`supabase gen types`) y casear con los del dominio (preferimos zod schemas como fuente de verdad y derivar/validar al borde).
4. Implementar `<feature>/data/supabase.repo.ts` cumpliendo el mismo `ports.ts`.
5. RLS por tabla (ver `SUPABASE-MIGRATION.md`).
6. Reemplazar mock auth por Supabase Auth en `features/auth`.
7. Flag `NEXT_PUBLIC_DATA_BACKEND` para hacer rollout gradual feature por feature.

---

## 13. Decisiones registradas (ADR-lite)

- **2026-05-20** — Elegimos Zustand sobre Context: testabilidad, persistencia con `zustand/middleware/persist`, sin re-renders innecesarios.
- **2026-05-20** — Repository Pattern detrás de un puerto: el día de Supabase no tocamos UI.
- **2026-05-20** — Tailwind v4 + CSS variables en lugar de styled-components o CSS Modules.
- **2026-05-20** — Vitest sobre Jest: mejor compat con ESM/Vite, watch más rápido.
- **2026-05-20** — Playwright sobre Cypress: cross-browser, mejor mobile emulation, traces.
