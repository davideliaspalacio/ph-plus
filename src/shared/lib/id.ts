import { nanoid } from "nanoid";

/** ID corto y URL-safe. */
export const newId = (size = 12): string => nanoid(size);

/** ID de pedido con prefijo legible. */
export const newOrderId = (): string =>
  `ORD-${nanoid(8).toUpperCase().replace(/[_-]/g, "0")}`;
