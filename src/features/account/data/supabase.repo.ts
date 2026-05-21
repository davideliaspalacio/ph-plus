import {
  AddressSchema,
  NewAddressInputSchema,
  type Address,
  type NewAddressInput,
} from "../domain/address";
import type { AddressRepository } from "./ports";

/**
 * Repo de direcciones contra Supabase.
 *
 * La tabla `public.addresses` usa snake_case (user_id, postal_code, is_default,
 * created_at, updated_at) mientras que el `Address` de dominio (camelCase) es
 * lo que consume la UI. `mapRow` traduce ida; `mapInputToInsert`/`mapPatch`
 * traducen vuelta.
 *
 * Nota sobre `setDefault`: existe el unique partial index
 * `addresses_one_default_per_user_idx` sobre `(user_id) where is_default`. Para
 * evitar el conflicto hacemos un solo UPDATE que setea `is_default = (id = $1)`
 * en una sola sentencia — Postgres evalúa todas las filas en la misma
 * transacción y no choca con el índice.
 */

interface AddressDbRow {
  id: string;
  user_id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  department: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface AddressDbInsert {
  user_id: string;
  label: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  department: string;
  postal_code: string;
  phone: string;
  is_default: boolean;
}

interface AddressDbUpdate {
  label?: string;
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  department?: string;
  postal_code?: string;
  phone?: string;
  is_default?: boolean;
}

function mapRow(row: AddressDbRow): Address {
  return AddressSchema.parse({
    id: row.id,
    userId: row.user_id,
    label: row.label,
    name: row.name,
    line1: row.line1,
    line2: row.line2 ?? "",
    city: row.city,
    department: row.department,
    postalCode: row.postal_code ?? "",
    phone: row.phone,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

function mapInputToInsert(
  userId: string,
  input: NewAddressInput,
): AddressDbInsert {
  return {
    user_id: userId,
    label: input.label ?? "Casa",
    name: input.name,
    line1: input.line1,
    line2: input.line2 ?? "",
    city: input.city,
    department: input.department,
    postal_code: input.postalCode ?? "",
    phone: input.phone,
    is_default: input.isDefault ?? false,
  };
}

function mapPatch(patch: Partial<NewAddressInput>): AddressDbUpdate {
  const out: AddressDbUpdate = {};
  if (patch.label !== undefined) out.label = patch.label;
  if (patch.name !== undefined) out.name = patch.name;
  if (patch.line1 !== undefined) out.line1 = patch.line1;
  if (patch.line2 !== undefined) out.line2 = patch.line2;
  if (patch.city !== undefined) out.city = patch.city;
  if (patch.department !== undefined) out.department = patch.department;
  if (patch.postalCode !== undefined) out.postal_code = patch.postalCode;
  if (patch.phone !== undefined) out.phone = patch.phone;
  if (patch.isDefault !== undefined) out.is_default = patch.isDefault;
  return out;
}

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

export class SupabaseAddressRepo implements AddressRepository {
  async listByUser(userId: string): Promise<Address[]> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`SupabaseAddressRepo.listByUser: ${error.message}`);
    }
    const rows = (data ?? []) as unknown as AddressDbRow[];
    return rows.map(mapRow);
  }

  async create(userId: string, input: NewAddressInput): Promise<Address> {
    const parsed = NewAddressInputSchema.parse(input);
    const supabase = await getClient();
    const insertRow = mapInputToInsert(userId, parsed);

    // Si va a ser default, primero limpiamos cualquier default existente para
    // evitar el conflicto con el unique partial index.
    if (insertRow.is_default) {
      const { error: clearErr } = await supabase
        .from("addresses")
        .update({ is_default: false } as unknown as never)
        .eq("user_id", userId)
        .eq("is_default", true);
      if (clearErr) {
        throw new Error(
          `SupabaseAddressRepo.create (clear default): ${clearErr.message}`,
        );
      }
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert(insertRow as unknown as never)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(
        `SupabaseAddressRepo.create: ${error?.message ?? "no data"}`,
      );
    }
    return mapRow(data as unknown as AddressDbRow);
  }

  async update(id: string, patch: Partial<NewAddressInput>): Promise<Address> {
    const supabase = await getClient();
    const patchRow = mapPatch(patch);

    // Si el patch quiere marcar como default, limpiamos antes los demás para
    // evitar el conflicto con el unique partial index.
    if (patchRow.is_default === true) {
      // Necesitamos saber el user_id de esta dirección.
      const { data: existing, error: getErr } = await supabase
        .from("addresses")
        .select("user_id")
        .eq("id", id)
        .maybeSingle();
      if (getErr) {
        throw new Error(
          `SupabaseAddressRepo.update (lookup): ${getErr.message}`,
        );
      }
      if (!existing) throw new Error("NOT_FOUND");
      const userId = (existing as unknown as { user_id: string }).user_id;

      const { error: clearErr } = await supabase
        .from("addresses")
        .update({ is_default: false } as unknown as never)
        .eq("user_id", userId)
        .eq("is_default", true)
        .neq("id", id);
      if (clearErr) {
        throw new Error(
          `SupabaseAddressRepo.update (clear default): ${clearErr.message}`,
        );
      }
    }

    const { data, error } = await supabase
      .from("addresses")
      .update(patchRow as unknown as never)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseAddressRepo.update: ${error.message}`);
    }
    if (!data) throw new Error("NOT_FOUND");
    return mapRow(data as unknown as AddressDbRow);
  }

  async remove(id: string): Promise<void> {
    const supabase = await getClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      throw new Error(`SupabaseAddressRepo.remove: ${error.message}`);
    }
  }

  async setDefault(userId: string, addressId: string): Promise<void> {
    const supabase = await getClient();

    // Paso 1: limpiar el default actual (si existe) — evita el conflicto con
    // el unique partial index al promover otra fila.
    const { error: clearErr } = await supabase
      .from("addresses")
      .update({ is_default: false } as unknown as never)
      .eq("user_id", userId)
      .eq("is_default", true)
      .neq("id", addressId);
    if (clearErr) {
      throw new Error(
        `SupabaseAddressRepo.setDefault (clear): ${clearErr.message}`,
      );
    }

    // Paso 2: marcar la dirección elegida como default.
    const { error: setErr } = await supabase
      .from("addresses")
      .update({ is_default: true } as unknown as never)
      .eq("user_id", userId)
      .eq("id", addressId);
    if (setErr) {
      throw new Error(
        `SupabaseAddressRepo.setDefault (set): ${setErr.message}`,
      );
    }
  }
}
