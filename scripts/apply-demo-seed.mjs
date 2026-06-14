#!/usr/bin/env node
/**
 * Aplica supabase/seed.demo.sql conectándose directo a Postgres con pg.
 *
 * Requiere SUPABASE_DB_URL en .env.local (Dashboard → Settings → Database →
 * Connection String → URI; reemplazá [YOUR-PASSWORD] por el password real).
 *
 * Uso:
 *   node scripts/apply-demo-seed.mjs
 *
 * Idempotente — el SQL ya usa `on conflict do nothing`.
 */

import { config } from "dotenv";
import { readFileSync } from "node:fs";
import pg from "pg";

config({ path: ".env.local" });

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error(`
❌ Falta SUPABASE_DB_URL en .env.local

   Conseguilo en:
   https://supabase.com/dashboard/project/zmhvsjciuzlzzxujkxej/settings/database

   Buscá "Connection string" → "URI" y reemplazá [YOUR-PASSWORD] por el
   password de la DB. Después agregalo a tu .env.local:

   SUPABASE_DB_URL="postgresql://postgres.zmhvsjciuzlzzxujkxej:<TU_PASSWORD>@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
`);
  process.exit(1);
}

const sqlPath = "supabase/seed.demo.sql";
const sql = readFileSync(sqlPath, "utf8");

console.log(`→ Aplicando ${sqlPath} (${sql.length} chars)...`);

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log("✓ Conectado a Postgres");
  const start = Date.now();
  await client.query(sql);
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`✓ Seed aplicado en ${elapsed}s`);
} catch (err) {
  console.error(`❌ Falló:`, err.message);
  process.exit(1);
} finally {
  await client.end();
}
