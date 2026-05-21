#!/usr/bin/env node
/**
 * Genera screenshots/INDEX.md con tabla de contenidos y miniaturas de
 * todas las capturas. Pensado para mandar el folder zippeado al cliente.
 */

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = "screenshots";

function listImagesGroupedByBucket(viewport) {
  const dir = join(ROOT, viewport);
  let buckets;
  try {
    buckets = readdirSync(dir).filter((d) =>
      statSync(join(dir, d)).isDirectory(),
    );
  } catch {
    return [];
  }
  buckets.sort();
  return buckets.map((bucket) => {
    const bucketDir = join(dir, bucket);
    const files = readdirSync(bucketDir)
      .filter((f) => f.endsWith(".png"))
      .sort();
    return { bucket, files: files.map((f) => relative(ROOT, join(bucketDir, f))) };
  });
}

function bucketLabel(name) {
  return name.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fileLabel(filename) {
  return filename
    .replace(/\.png$/, "")
    .replace(/^\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderViewport(viewport, groups) {
  if (groups.length === 0) return "";
  const lines = [`## ${viewport === "desktop" ? "🖥️ Desktop" : "📱 Mobile"}`, ""];

  for (const { bucket, files } of groups) {
    lines.push(`### ${bucketLabel(bucket)}`, "");
    for (const f of files) {
      const label = fileLabel(f.split("/").pop() ?? "");
      lines.push(`#### ${label}`, "");
      lines.push(`![${label}](${f})`, "");
    }
  }
  return lines.join("\n");
}

const desktop = listImagesGroupedByBucket("desktop");
const mobile = listImagesGroupedByBucket("mobile");

const total =
  desktop.reduce((acc, g) => acc + g.files.length, 0) +
  mobile.reduce((acc, g) => acc + g.files.length, 0);

const md = `# PH PLUS — Screenshots de todos los flujos

Generado: ${new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" })}
Total: **${total} screenshots** (${desktop.reduce((a, g) => a + g.files.length, 0)} desktop + ${mobile.reduce((a, g) => a + g.files.length, 0)} mobile)

> Cada bucket corresponde a un área funcional del ecommerce. Las imágenes son full-page (excepto donde indica lo contrario) y vienen en dos resoluciones para que el cliente vea ambas experiencias.

${renderViewport("desktop", desktop)}

${renderViewport("mobile", mobile)}
`;

writeFileSync(join(ROOT, "INDEX.md"), md);
console.log(`✓ Generado ${ROOT}/INDEX.md con ${total} imágenes referenciadas.`);
