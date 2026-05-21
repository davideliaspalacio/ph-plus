# Migración a Supabase — guía paso a paso

> Este documento te lleva desde "tengo el código local con mock data" a
> "tengo un proyecto Supabase corriendo en producción con la misma app".
>
> Tiempo estimado: **40 minutos** desde cero.

---

## 0. Pre-requisitos

- Cuenta en [supabase.com](https://supabase.com) (free)
- Cuenta en [vercel.com](https://vercel.com) (free) — opcional pero recomendado
- Supabase CLI:
  ```bash
  brew install supabase/tap/supabase   # macOS
  # o: npm i -g supabase
  supabase --version                   # ≥ 1.200
  ```
- Node 22 + pnpm 10 (ya los tenés en el repo)

---

## 1. Crear el proyecto Supabase

1. Entrá a [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project**.
2. Nombre: `ph-plus`.
3. Región: **South America (São Paulo)** — la más cerca de Colombia (≈ 80ms vs 180ms a US-East).
4. Plan: **Free**.
5. Generá un password para la DB y guardalo en tu password manager.
6. Esperá 2-3 minutos a que el proyecto pase a `ACTIVE_HEALTHY`.

Del dashboard → **Settings → API**, anotá:

- **Project URL** → `https://<project-ref>.supabase.co`
- **anon / public key** → empieza con `eyJ...` (es seguro exponerla, va al cliente)
- **service_role key** → es **SECRETA**: bypassea RLS. Sólo en server.

---

## 2. Conectar el repo local

```bash
# Login en Supabase CLI (abre el browser)
supabase login

# Linkear este repo al proyecto remoto. El project-ref está en la URL del
# dashboard: https://supabase.com/dashboard/project/<aquí>
supabase link --project-ref <project-ref>
```

---

## 3. Aplicar las migraciones

Las migraciones ya están versionadas en `supabase/migrations/`. Push:

```bash
supabase db push
```

Esto aplica en orden:

| Archivo | Qué hace |
|---|---|
| `20260520000001_initial_schema.sql` | Tablas, enums, indexes, trigger `set_updated_at`. |
| `20260520000002_functions_and_triggers.sql` | Auto-create profile en signup, validador de transición de estado de pedido, recompute rating al moderar reviews, RPC `apply_stock_movement`, generador de IDs de pedido. |
| `20260520000003_rls_policies.sql` | RLS habilitada en todas las tablas + policies por rol (`customer`/`read_only`/`staff`/`super_admin`/`anon`). |
| `20260520000004_storage_buckets.sql` | Buckets `product-images` y `review-photos` con políticas. |

Verificá: dashboard → **Table Editor** → deberías ver 14 tablas en `public`.

---

## 4. Sembrar la data demo

```bash
supabase db reset            # CUIDADO: borra TODO y aplica migraciones + seed
# o, sin reset (conservando data):
psql "$(supabase status --output json | jq -r '.DB_URL')" < supabase/seed.sql
```

Después de esto:

- 11 productos
- 4 zonas de envío
- 3 cupones (`BIENVENIDA10`, `ENVIOGRATIS`, `PHPLUS5K`)
- 11 SKUs de inventario inicial
- 1 documento `content` (hero + featured + banners + FAQ)
- 1 documento `settings`

---

## 5. Crear los usuarios de prueba

Los usuarios viven en `auth.users` (gestionados por Supabase Auth), no en una
tabla pública. Cuando se registran, el trigger `handle_new_user` crea la fila
en `public.profiles` con rol `customer`. Para los admins, lo cambiamos a mano.

### Opción A — desde el dashboard (recomendado para 5 usuarios)

1. Dashboard → **Authentication → Users → Add user → Create new user**.
2. Para cada uno, marcá *"Auto Confirm User"* para saltarte el email.
3. Email/password sugeridos:

   | Email | Password | Rol futuro |
   |---|---|---|
   | `admin@ph-plus.co` | `Admin1234!` | `super_admin` |
   | `staff@ph-plus.co` | `Staff1234!` | `staff` |
   | `reader@ph-plus.co` | `Reader1234!` | `read_only` |
   | `ada@ph-plus.co` | `Ada12345!` | `customer` (default) |
   | `linus@ph-plus.co` | `Linus12345!` | `customer` (default) |

4. Una vez creados, dashboard → **SQL Editor**, correr:

   ```sql
   update public.profiles set role = 'super_admin', name = 'Administradora PH PLUS'
     where email = 'admin@ph-plus.co';
   update public.profiles set role = 'staff', name = 'Staff Demo'
     where email = 'staff@ph-plus.co';
   update public.profiles set role = 'read_only', name = 'Lectora'
     where email = 'reader@ph-plus.co';
   update public.profiles set name = 'Ada Lovelace'
     where email = 'ada@ph-plus.co';
   update public.profiles set name = 'Linus Torvalds'
     where email = 'linus@ph-plus.co';
   ```

### Opción B — desde un script (si los vas a regenerar seguido)

```bash
# scripts/seed-users.sh (ya incluido en el repo, requiere SERVICE_ROLE_KEY)
bash scripts/seed-users.sh
```

---

## 6. Configurar variables de entorno

### En local

```bash
cp .env.example .env.local
```

Editá `.env.local` con los valores REALES de tu proyecto. **Activá Supabase**:

```bash
NEXT_PUBLIC_DATA_BACKEND=supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Probá:

```bash
pnpm dev
# Abrí http://localhost:3000 y andá a /login → ingresá con ada@ph-plus.co
# Andá a /productos — los productos vienen de Supabase ahora.
```

### En Vercel (producción)

1. Vercel → import del repo de GitHub `davideliaspalacio/ph-plus`.
2. Framework preset: Next.js (autodetectado).
3. Root directory: `ph-plus-frontend`.
4. **Settings → Environment Variables**, agregá:

   | Variable | Valor | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_DATA_BACKEND` | `supabase` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_URL` | (project URL) | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon key) | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | (service role) | **Sólo Production** ⚠ |
   | `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.com` | Production |

5. Deploy.
6. En Supabase: **Auth → URL Configuration** → agregá la URL de Vercel a
   *Site URL* y *Redirect URLs* (`https://tu-dominio.com/**`).

---

## 7. Configurar el keep-alive

Free tier pausa el proyecto a los 7 días sin actividad de DB. El workflow
`.github/workflows/supabase-keepalive.yml` lo evita pinguéandolo cada 3 días.

GitHub → **Settings → Secrets and variables → Actions → New repository
secret**, agregá:

- `SUPABASE_URL` → mismo valor que `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` → mismo valor que `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Después podés correrlo manualmente la primera vez:
**Actions → Supabase Keep-Alive → Run workflow** para confirmar que pinguea OK.

---

## 8. Verificación final

Checklist post-migración:

- [ ] `supabase db push` sin errores
- [ ] Dashboard → Table Editor → 14 tablas + 2 buckets
- [ ] `select count(*) from public.products` → **11**
- [ ] `select count(*) from public.shipping_zones` → **4**
- [ ] `select count(*) from public.coupons` → **3**
- [ ] 5 usuarios en Authentication → Users
- [ ] `select email, role from public.profiles` → roles asignados correctamente
- [ ] `.env.local` con `NEXT_PUBLIC_DATA_BACKEND=supabase` y keys reales
- [ ] `pnpm dev` arranca sin errores
- [ ] Login con `ada@ph-plus.co` funciona
- [ ] `/productos` muestra los 11 productos desde Supabase
- [ ] Login con `admin@ph-plus.co` → puedo entrar a `/admin`
- [ ] Crear/editar producto desde `/admin/productos` persiste en Supabase
- [ ] Crear pedido desde `/checkout` aparece en `/admin/pedidos` y en
      `/cuenta/pedidos` del usuario
- [ ] Vercel deploy en verde
- [ ] GitHub Action keep-alive corrió una vez OK

---

## 9. Rollback rápido

Si algo sale mal en producción, podés volver al backend mock sin re-deploy:

1. Vercel → Settings → Environment Variables → editá `NEXT_PUBLIC_DATA_BACKEND`
   y poné `mock`.
2. Redeploy (1 click).

La data en Supabase queda intacta — sólo dejás de leerla.

---

## 10. Próximos pasos (cuando crezcas)

| Cuándo | Qué hacer |
|---|---|
| **> 500MB de DB** | Upgrade a Pro ($25/mes) — sin downtime |
| **> 1GB de storage** | Mover imágenes a Cloudflare R2 (10GB free) |
| **> 3.000 emails/mes** | Resend Pro ($20/mes) o AWS SES |
| **Necesitás pagos reales** | Integrar Wompi (Colombia) o Mercado Pago |
| **Tráfico real > 1k DAU** | Considerar Supabase Read Replicas + Vercel Pro |
| **Multi-tenant** | Particionar por `tenant_id` o multi-schema |

---

## Anexo — Estructura de archivos

```
ph-plus-frontend/
├── supabase/
│   ├── config.toml                     # Config local Supabase CLI
│   ├── migrations/
│   │   ├── 20260520000001_initial_schema.sql
│   │   ├── 20260520000002_functions_and_triggers.sql
│   │   ├── 20260520000003_rls_policies.sql
│   │   └── 20260520000004_storage_buckets.sql
│   └── seed.sql                        # Data demo idempotente
│
├── src/shared/supabase/
│   ├── client.ts                       # createSupabaseBrowserClient()
│   ├── server.ts                       # createSupabaseServerClient() + service
│   ├── middleware.ts                   # refresh de sesión en cada request
│   ├── types.ts                        # tipos Database (regenerable)
│   └── index.ts                        # API pública del módulo
│
├── src/features/*/data/
│   ├── ports.ts                        # interface del repo (no cambia)
│   ├── mock.repo.ts                    # implementación mock (no cambia)
│   ├── supabase.repo.ts                # nueva: implementación Supabase
│   └── index.ts                        # factory: switch por NEXT_PUBLIC_DATA_BACKEND
│
├── middleware.ts                       # Next.js middleware: refresh sesión
│
├── .env.example                        # Template (commiteado)
├── .env.local                          # Valores reales (ignorado)
│
└── .github/workflows/
    ├── ci.yml                          # lint + typecheck + test + build
    └── supabase-keepalive.yml          # ping cada 3 días
```
