import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import {
  AddressSchema,
  NewAddressInputSchema,
  type Address,
  type NewAddressInput,
} from "../domain/address";
import type { AddressRepository } from "./ports";

export const ADDRESSES_STORAGE_PREFIX = "phplus.db.addresses.v1";

export class MockAddressRepo implements AddressRepository {
  private store = makeNamespacedStorage<Address>(ADDRESSES_STORAGE_PREFIX);

  async listByUser(userId: string): Promise<Address[]> {
    return this.store.list().filter((a) => a.userId === userId);
  }

  async create(userId: string, input: NewAddressInput): Promise<Address> {
    const parsed = NewAddressInputSchema.parse(input);
    const now = new Date().toISOString();
    const address: Address = AddressSchema.parse({
      id: newId(),
      userId,
      label: parsed.label ?? "Casa",
      name: parsed.name,
      line1: parsed.line1,
      line2: parsed.line2 ?? "",
      city: parsed.city,
      department: parsed.department,
      postalCode: parsed.postalCode ?? "",
      phone: parsed.phone,
      isDefault: parsed.isDefault ?? false,
      createdAt: now,
      updatedAt: now,
    });
    this.store.set(address.id, address);
    if (address.isDefault) await this.setDefault(userId, address.id);
    return address;
  }

  async update(id: string, patch: Partial<NewAddressInput>): Promise<Address> {
    const current = this.store.get(id);
    if (!current) throw new Error("NOT_FOUND");
    const merged: Address = AddressSchema.parse({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    this.store.set(id, merged);
    return merged;
  }

  async remove(id: string): Promise<void> {
    this.store.remove(id);
  }

  async setDefault(userId: string, addressId: string): Promise<void> {
    const all = await this.listByUser(userId);
    for (const a of all) {
      const next = { ...a, isDefault: a.id === addressId, updatedAt: new Date().toISOString() };
      this.store.set(a.id, AddressSchema.parse(next));
    }
  }
}
