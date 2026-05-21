import type { Address, NewAddressInput } from "../domain/address";

export interface AddressRepository {
  listByUser(userId: string): Promise<Address[]>;
  create(userId: string, input: NewAddressInput): Promise<Address>;
  update(id: string, patch: Partial<NewAddressInput>): Promise<Address>;
  remove(id: string): Promise<void>;
  setDefault(userId: string, addressId: string): Promise<void>;
}
