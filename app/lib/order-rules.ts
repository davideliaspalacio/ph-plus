export const MIN_ORDER_VALUE = 50_000;

export function isMinimumOrderSubtotal(subtotal: number): boolean {
  return subtotal >= MIN_ORDER_VALUE;
}
