import { MockAddressRepo, ADDRESSES_STORAGE_PREFIX } from "./mock.repo";
import type { AddressRepository } from "./ports";

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";
export const addressRepo: AddressRepository =
  backend === "supabase" ? new MockAddressRepo() : new MockAddressRepo();

export { ADDRESSES_STORAGE_PREFIX };
