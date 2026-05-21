#!/bin/bash
# Crea los 5 usuarios de prueba en Supabase Auth y les asigna rol en profiles.
#
# Requiere:
#   - SUPABASE_URL en el environment (o cargar desde .env.local)
#   - SUPABASE_SERVICE_ROLE_KEY (bypassea RLS, sólo server-side)
#
# Uso:
#   bash scripts/seed-users.sh
#
# Idempotente: si el usuario ya existe, sólo actualiza el rol del profile.

set -euo pipefail

if [ -f ".env.local" ]; then
  # shellcheck disable=SC1091
  set -a; source .env.local; set +a
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-${SUPABASE_URL:-}}"
SERVICE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}"

if [ -z "$SUPABASE_URL" ] || [ -z "$SERVICE_KEY" ]; then
  echo "❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  echo "   Revisá tu .env.local — ver .env.example"
  exit 1
fi

# email|password|role|name
USERS=(
  "admin@ph-plus.co|Admin1234!|super_admin|Administradora PH PLUS"
  "staff@ph-plus.co|Staff1234!|staff|Staff Demo"
  "reader@ph-plus.co|Reader1234!|read_only|Lectora"
  "ada@ph-plus.co|Ada12345!|customer|Ada Lovelace"
  "linus@ph-plus.co|Linus12345!|customer|Linus Torvalds"
)

for entry in "${USERS[@]}"; do
  IFS='|' read -r email password role name <<< "$entry"

  echo "→ $email ($role)"

  # 1) Crear usuario en auth.users (idempotente: si ya existe devuelve 422)
  response=$(curl -sS -X POST "$SUPABASE_URL/auth/v1/admin/users" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"$password\",
      \"email_confirm\": true,
      \"user_metadata\": { \"name\": \"$name\" }
    }" || true)

  if echo "$response" | grep -q '"id"'; then
    echo "  ✓ creado"
  elif echo "$response" | grep -qi 'already'; then
    echo "  ✓ ya existía"
  else
    echo "  ⚠ respuesta: $response"
  fi

  # 2) Actualizar el rol y nombre en public.profiles
  curl -sS -X PATCH "$SUPABASE_URL/rest/v1/profiles?email=eq.$(printf '%s' "$email" | sed 's/@/%40/')" \
    -H "apikey: $SERVICE_KEY" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{ \"role\": \"$role\", \"name\": \"$name\" }" \
    > /dev/null

  echo "  ✓ profile actualizado a role=$role"
done

echo ""
echo "✅ Seed de usuarios completo. Test login: ada@ph-plus.co / Ada12345!"
