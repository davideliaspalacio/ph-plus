"use client";

import { createSupabaseBrowserClient } from "@/src/shared/supabase/client";

/**
 * Sube una foto de producto al bucket `product-images` y devuelve su URL
 * pública.
 *
 * El bucket ya existe (migración 20260520000004) con lectura pública y
 * escritura restringida por RLS a `is_admin()`: la subida usa la sesión del
 * admin logueado en el browser. En modo mock no hay Storage — el caller
 * muestra el error y la galería queda como estaba.
 */
export async function uploadProductImage(
  file: File,
  slug: string,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" no es una imagen.`);
  }
  // Límite alineado con el demo: fotos de catálogo, no originales de cámara.
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`"${file.name}" pesa más de 5MB. Comprimila antes de subir.`);
  }

  const supabase = createSupabaseBrowserClient();
  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const path = `${slug || "sin-slug"}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) {
    throw new Error(`No se pudo subir "${file.name}": ${error.message}`);
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
