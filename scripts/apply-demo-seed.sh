#!/bin/bash
# Aplica los archivos SQL de supabase/seeds-demo/ al proyecto Supabase.
#
# Estrategia: concatena todos los archivos en supabase/seed.demo.sql y
# muestra el URL del SQL Editor del dashboard con el SQL precargado.
# Es la forma más robusta de ejecutar SQL multi-statement sin necesitar
# psql / libpq instalado localmente.
#
# Uso:
#   bash scripts/apply-demo-seed.sh
#
# El SQL es idempotente (on conflict do nothing) — re-ejecutarlo no duplica.

set -euo pipefail

if [ -f ".env.local" ]; then
  # shellcheck disable=SC1091
  set -a; source .env.local; set +a
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Falta NEXT_PUBLIC_SUPABASE_URL en .env.local"
  exit 1
fi

PROJECT_REF="${SUPABASE_URL#https://}"
PROJECT_REF="${PROJECT_REF%%.*}"

OUTPUT="supabase/seed.demo.sql"
SEEDS_DIR="supabase/seeds-demo"

if [ ! -d "$SEEDS_DIR" ]; then
  echo "❌ No existe $SEEDS_DIR"
  exit 1
fi

# Concatenar todos los archivos en orden alfabético
{
  echo "-- =========================================================="
  echo "-- PH PLUS — Demo seed (auto-generado)"
  echo "-- Generado: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "-- Origen:    supabase/seeds-demo/*.sql concatenados"
  echo "-- Idempotente: re-correr es seguro (on conflict do nothing)"
  echo "-- =========================================================="
  echo ""
  for f in "$SEEDS_DIR"/*.sql; do
    echo ""
    echo "-- ────────────────────────────────────────────────────────"
    echo "-- $(basename "$f")"
    echo "-- ────────────────────────────────────────────────────────"
    cat "$f"
    echo ""
  done
} > "$OUTPUT"

LINES=$(wc -l < "$OUTPUT" | tr -d ' ')
SIZE=$(wc -c < "$OUTPUT" | tr -d ' ')

echo "✓ Concatenado todo en $OUTPUT"
echo "  $LINES líneas, $SIZE bytes"
echo ""
echo "Próximos pasos para aplicarlo:"
echo ""
echo "OPCIÓN A — Pegar en el SQL Editor del Dashboard (recomendado):"
echo "  1. Abrí esta URL:"
echo "     https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "  2. Pegá el contenido completo de:"
echo "     $OUTPUT"
echo "  3. Click 'Run' (Cmd+Enter)"
echo ""
echo "OPCIÓN B — Con psql si lo tenés (más rápido para repeticiones):"
echo "  1. brew install libpq && brew link --force libpq    # si no tenés psql"
echo "  2. Conseguí el connection string en:"
echo "     https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
echo "  3. Exportá: export SUPABASE_DB_URL='postgresql://postgres.$PROJECT_REF:[PWD]@aws-0-...pooler.supabase.com:6543/postgres'"
echo "  4. psql \"\$SUPABASE_DB_URL\" -f $OUTPUT"
