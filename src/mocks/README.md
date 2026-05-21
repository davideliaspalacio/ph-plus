# `src/mocks/` — seeds compartidos

Datos planos en español usados por los repos mock de cada feature para
hidratar su namespace de `localStorage` la primera vez que arranca (o cuando
el namespace está vacío). Son la **fuente de verdad inicial** de la app
mientras no haya backend real.

## Qué hay aquí

| Archivo | Exporta | Para qué repo |
|---|---|---|
| `users.seed.ts` | `USERS_SEED`, `SEED_PRIMARY_CUSTOMER_ID`, `SeedUser` | `features/auth/data` |
| `orders.seed.ts` | `ORDERS_SEED` | `features/orders/data` |
| `reviews.seed.ts` | `REVIEWS_SEED`, `SeedReview`, `SeedReviewStatus` | `features/reviews/data` (cuando exista) |
| `settings.seed.ts` | `SETTINGS_SEED`, `SeedStoreSettings`, `SeedPaymentMethod` | `features/admin/settings/data` (cuando exista) |
| `content.seed.ts` | `CONTENT_SEED`, `SeedContent`, `SeedHomeHero`, `SeedBanner`, `SeedFaqEntry` | `features/admin/content/data` (cuando exista) |
| `index.ts` | barrel de los anteriores | — |

## Reglas

1. **Los seeds nunca importan de las features**, salvo para tipar (`import type`
   de un schema/tipo público). Si todavía no hay un tipo público (o el import
   causaría ciclo), se define un `Seed*` inline shape-compatible con un
   comentario `Aligns with <feature>/<Tipo>`.
2. **No hay lógica**: sólo datos. Sin `Date.now()`, sin RNG, sin lecturas de
   `process.env`. Todo es determinístico.
3. **Tipos sobre `any`**: cada export está tipado. Los tests viven con las
   features, no con los seeds.
4. **Slugs y refs cruzados** (órdenes ↔ productos, reviews ↔ productos,
   órdenes ↔ usuario) referencian valores reales que existen en
   `app/lib/products.ts` y en `users.seed.ts`.

## Cómo se usa desde un repo mock

```ts
// features/orders/data/mock.repo.ts
import { ORDERS_SEED } from "@/mocks";

const NAMESPACE = "phplus.db.orders.v1";

function seedIfEmpty(): void {
  if (typeof localStorage === "undefined") return;
  if (localStorage.getItem(NAMESPACE)) return;
  localStorage.setItem(NAMESPACE, JSON.stringify(ORDERS_SEED));
}
```

## Sobre los passwords del seed de usuarios

`USERS_SEED[*].passwordHash` usa el placeholder literal `"$seed$"`. Los repos
deciden qué hacer:

- El repo de `auth` puede re-hashear al primer login fallido (rehidratando con
  una password por defecto bien conocida en dev), o
- Un seeder específico de `auth` puede pasar cada `SeedUser` por
  `service.signup(...)` para que el hash quede generado con `crypto.subtle`.

Lo importante: **ningún consumidor debe asumir que `$seed$` es un hash
verificable**.
