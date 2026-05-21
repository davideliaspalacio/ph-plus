# Testing — PH PLUS

> Cómo escribimos y corremos tests. Convenciones, comandos, recetas.

---

## Stack

- **Vitest** 4 — runner unit / integración
- **@testing-library/react** 16 + **@testing-library/jest-dom** 6 — tests de componente
- **@testing-library/user-event** 14 — interacciones reales (preferir sobre `fireEvent`)
- **jsdom** 29 — entorno DOM
- **Playwright** (a instalar en Sprint 7) — E2E

---

## Comandos

```bash
pnpm test         # watch mode
pnpm test:run     # one-shot (CI)
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint
pnpm build        # Next build (también typechea)
```

---

## Estructura

- Tests **colocados** junto al archivo: `pricing.ts` ↔ `pricing.test.ts`.
- Tests del dominio (puros): no necesitan render, sólo `vitest`.
- Tests de stores Zustand: importan el store y operan sobre `useStore.getState()`.
- Tests de componente: `render(<X />)` + `screen.getByRole(...)` + `userEvent`.
- Setup global en `src/test/setup.ts`: mockea `next/navigation`, `next/image`, `next/link`; limpia `localStorage`/`sessionStorage` después de cada test.

---

## Convenciones

- `describe("FunctionName | ComponentName | Hook")` por archivo.
- `it("hace X cuando Y")` legible como spec.
- Una sola `expect` "principal" por test cuando se pueda (helpers internos si hace falta).
- Preferir `getByRole` / `getByLabelText` sobre `getByTestId`.
- `userEvent.setup()` al inicio de cada test que use eventos.
- No snapshots gigantes. Sí `toHaveTextContent`, `toBeInTheDocument`, `toHaveAccessibleName`.
- En tests de stores Zustand resetear con `useStore.getState().clear()` en `beforeEach`.

---

## Recetas

### Test puro de dominio

```ts
import { describe, expect, it } from "vitest";
import { buildCartSummary } from "./pricing";

describe("buildCartSummary", () => {
  it("aplica envío gratis al pasar el umbral", () => {
    const r = buildCartSummary([{ slug: "x", quantity: 1 }], () => ({
      slug: "x",
      priceValue: 120_000,
    }));
    expect(r.shipping).toBe(0);
  });
});
```

### Test de un store Zustand

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { useCart, CART_STORAGE_KEY } from "./useCart";

describe("useCart", () => {
  beforeEach(() => {
    useCart.getState().clear();
    localStorage.removeItem(CART_STORAGE_KEY);
  });

  it("addItem agrega línea nueva", () => {
    useCart.getState().addItem("agua-1l");
    expect(useCart.getState().items).toHaveLength(1);
  });
});
```

### Test de componente con userEvent

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";

it("agrega al carrito al hacer click", async () => {
  const user = userEvent.setup();
  render(<ProductCard product={fixture} />);
  await user.click(screen.getByRole("button", { name: /añadir/i }));
  // assertions...
});
```

---

## TDD: ciclo por feature

1. Spec funcional en `docs/FUNCTIONAL-SPEC.md`.
2. **Test rojo** del dominio (regla pura).
3. Implementación mínima hasta verde.
4. **Test rojo** del repo mock (cumple el puerto).
5. Implementación.
6. **Test rojo** del componente (UX esperada).
7. Implementación + estilos.
8. E2E happy path en Playwright (cuando aplique).
9. Refactor si hay olores. Tests siguen verdes.
10. Doc + PR.

---

## CI (próximo Sprint)

```yaml
# .github/workflows/ci.yml (referencia)
- run: pnpm install --frozen-lockfile
- run: pnpm lint
- run: pnpm typecheck
- run: pnpm test:run
- run: pnpm build
- run: pnpm exec playwright test  # cuando exista
```

---

## Estado actual

| Capa | Cobertura |
|---|---|
| `features/cart/domain/pricing` | ✅ 11 tests |
| `features/cart/store/useCart` | ✅ 8 tests |

Total: **19 tests verdes** (Sprint 0).
