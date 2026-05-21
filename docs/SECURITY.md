# PH PLUS — Seguridad

> Cómo manejamos auth, autorización, secrets, RLS y qué exponemos al cliente.

---

## 1. Modelo de auth

- **Quién autentica**: Supabase Auth (email + password, opcional OAuth).
- **Token**: JWT firmado por Supabase con `sub = user_id` y `aud = "authenticated"`.
- **Cookie**: HTTP-only, SameSite=Lax, persiste hasta `expiresAt` (default
  7 días). Se refresca via middleware en cada request.
- **Storage del lado cliente**: SÓLO el flag de "is hydrated" + el id/role
  para evitar flash. La cookie HTTP-only es la fuente de verdad.

---

## 2. Roles y permisos

| Rol | Storefront | Lee admin | Escribe admin | Reembolsos | Settings |
|---|---|---|---|---|---|
| `anon` | ✅ catálogo público | ❌ | ❌ | ❌ | ❌ |
| `customer` | ✅ + cuenta propia | ❌ | ❌ | ❌ | ❌ |
| `read_only` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `staff` | ✅ | ✅ | ✅ (excepto borrar/settings) | ✅ | ❌ |
| `super_admin` | ✅ | ✅ | ✅ | ✅ | ✅ |

El rol se guarda en `public.profiles.role`. Sólo `super_admin` puede cambiar
el rol de otro usuario (enforced via RLS en `profiles` UPDATE).

---

## 3. Row Level Security (RLS)

**Toda tabla del esquema `public` tiene RLS habilitada.** Sin sesión válida,
las queries devuelven `[]` aunque tengas la anon key. Esto es defensa en
profundidad: si el frontend bug intenta acceder a algo que no debe, Postgres
lo bloquea.

Helpers SQL (security definer para evitar recursión):

```sql
public.current_role()     -- devuelve el role del usuario actual
public.is_admin()          -- staff | super_admin
public.is_staff_or_ro()    -- staff | super_admin | read_only
```

Detalle por tabla:

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | self + staff/ro | trigger only | self (rol no editable) o admin | — |
| `addresses` | owner + admin | owner | owner | owner |
| `products` | público (si is_active) + admin | admin | admin | admin |
| `coupons` | público (si is_active) + admin | admin | admin | admin |
| `shipping_zones` | público (si is_active) + admin | admin | admin | admin |
| `orders` | propio + admin (guest también por id) | propio o guest | admin | admin |
| `order_lines` | via order | via order | admin | admin |
| `order_notes` | staff/ro | admin | admin | admin |
| `reviews` | público si approved, propio, staff/ro | logueado (status=pending forzado) | admin | admin |
| `stock_items` | staff/ro | admin | admin | admin |
| `stock_movements` | staff/ro | admin | admin | admin |
| `content` | público | admin | admin | admin |
| `settings` | público | admin | admin | admin |
| `notifications_outbox` | staff/ro | admin | admin | admin |
| `keep_alive` | público | público (cron) | — | — |

Ver el detalle exacto en
[`supabase/migrations/20260520000003_rls_policies.sql`](../supabase/migrations/20260520000003_rls_policies.sql).

---

## 4. Manejo de keys y secrets

### Variables expuestas al browser (`NEXT_PUBLIC_*`)

- `NEXT_PUBLIC_DATA_BACKEND` — texto, no secret
- `NEXT_PUBLIC_SUPABASE_URL` — público por diseño (es la URL de tu proyecto)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — diseñada para ser pública. **Sólo
  funciona si RLS está activa**. Sin RLS sería un desastre; con RLS, es
  como dar la URL de tu API: cualquiera puede llamarla pero sólo ve lo
  permitido por las policies.
- `NEXT_PUBLIC_SITE_URL` — público

### Variables NUNCA expuestas al browser

| Variable | Dónde se usa | Riesgo si se filtra |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server actions, route handlers, edge functions | **Crítico**: bypassea TODAS las RLS. Equivale a `psql --superuser`. |
| `RESEND_API_KEY` | Server (edge function de mails) | Atacante puede enviar emails desde tu dominio |
| `WOMPI_PRIVATE_KEY` / similar | Server | Atacante puede generar cobros |
| `MERCADOPAGO_ACCESS_TOKEN` | Server | Idem |

**Reglas:**
1. Nunca prefijar estos con `NEXT_PUBLIC_`.
2. En Vercel, marcalas como "Sensitive" en Environment Variables.
3. En CI/Actions, usar `secrets.NAME`.
4. **Nunca commitear `.env.local`** (está en `.gitignore`).
5. **`.env.example`** es el template público — sólo placeholders.

### ¿Cómo confirmar que el bundle del browser no las contiene?

```bash
pnpm build
grep -r "SUPABASE_SERVICE_ROLE" .next/static/ || echo "✓ no encontrado"
grep -r "RESEND_API_KEY" .next/static/ || echo "✓ no encontrado"
```

---

## 5. Auditoría con `supabase get_advisors`

Después de cada cambio de schema, correr:

```bash
supabase inspect db security-advisors
# o desde el dashboard: Project Settings → Database → Security Advisor
```

Esto detecta:
- Tablas sin RLS
- Funciones sin `set search_path` (riesgo de hijacking)
- Buckets de Storage sin policies
- Columnas sensibles sin encriptar

---

## 6. Errores comunes y cómo prevenirlos

| Error | Cómo prevenir |
|---|---|
| Exponer service role al cliente | El check del bundle (sección 4) + naming convention `NEXT_PUBLIC_` |
| Olvidar RLS en una tabla nueva | El advisor lo detecta. Además: convención de que toda migración nueva incluye `alter table X enable row level security` |
| Trigger insegura (`security definer` sin `set search_path`) | Plantilla en las funciones existentes |
| User enumeration en recover password | Siempre devolver `{ sent: true }` — `service.supabase.ts` lo hace |
| Subir imagen pesada a Storage | Límite en `supabase/config.toml` (50MiB) + validar en cliente |
| SQL injection en queries dinámicas | Nunca concatenamos SQL — usamos parámetros del client de Supabase y `rpc()` |

---

## 7. Política de revisión

- Toda PR que toca `supabase/migrations/` requiere review explícito
- Toda PR que toca `src/shared/supabase/server.ts` (donde vive el service
  client) requiere review explícito
- Cualquier cambio a `policies` se prueba contra los 4 roles antes de
  mergear (ver `docs/SUPABASE-MIGRATION.md` → checklist)

---

## 8. Reportar vulnerabilidades

Si encontrás algo, abrí un issue privado o mandá un email a
`seguridad@ph-plus.co` con el detalle. NO publiques exploit en issues
públicos.
