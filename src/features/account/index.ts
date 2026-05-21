export {
  AddressSchema,
  NewAddressInputSchema,
  type Address,
  type NewAddressInput,
} from "./domain/address";

export { addressRepo, ADDRESSES_STORAGE_PREFIX } from "./data";
export type { AddressRepository } from "./data/ports";

export { AccountShell } from "./ui/AccountShell";
export { RequireAuth } from "./ui/RequireAuth";
export { ProfileForm } from "./ui/ProfileForm";
export { AddressesList } from "./ui/AddressesList";
export { WishlistList } from "./ui/WishlistList";
export { OrdersList } from "./ui/OrdersList";
export { WishlistButton } from "./ui/WishlistButton";
export { AccountOverview } from "./ui/AccountOverview";
