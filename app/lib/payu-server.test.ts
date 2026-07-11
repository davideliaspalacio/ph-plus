import { describe, expect, it } from "vitest";

import {
  createPayuCheckoutSignature,
  createPayuConfirmationSignature,
  formatPayuAmount,
  formatPayuConfirmationValue,
  sanitizePayuReference,
} from "./payu-server";

describe("PayU helpers", () => {
  it("genera la firma MD5 del formulario de pago con el formato de PayU", () => {
    expect(
      createPayuCheckoutSignature({
        apiKey: "payu-fixture-api-key",
        merchantId: "123456",
        referenceCode: "TestPayU",
        amount: "20000",
        currency: "COP",
      }),
    ).toBe("ec32fe2810e793605957bc9c3f4b540b");
  });

  it("formatea montos de checkout con dos decimales", () => {
    expect(formatPayuAmount(73470)).toBe("73470.00");
  });

  it("limpia caracteres especiales en referenceCode", () => {
    expect(sanitizePayuReference("ORD-ABC_123")).toBe("ORDABC123");
  });

  it("aplica la regla de valor para firma de confirmación", () => {
    expect(formatPayuConfirmationValue("150.00")).toBe("150.0");
    expect(formatPayuConfirmationValue("150.25")).toBe("150.25");
    expect(formatPayuConfirmationValue("150")).toBe("150.0");
  });

  it("genera firma de confirmación con value normalizado", () => {
    const a = createPayuConfirmationSignature({
      apiKey: "api-key",
      merchantId: "123",
      referenceSale: "PHPLUS1",
      value: "150.00",
      currency: "COP",
      statePol: "4",
    });
    const b = createPayuConfirmationSignature({
      apiKey: "api-key",
      merchantId: "123",
      referenceSale: "PHPLUS1",
      value: "150.0",
      currency: "COP",
      statePol: "4",
    });
    expect(a).toBe(b);
  });
});
