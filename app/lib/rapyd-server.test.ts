import { describe, expect, it } from "vitest";

import {
  buildRapydRequestSignature,
  buildRapydWebhookSignature,
  hashWebhookBody,
  sanitizeRapydReference,
} from "./rapyd-server";

describe("Rapyd helpers", () => {
  it("genera la firma de un request firmado (method + path relativo)", () => {
    expect(
      buildRapydRequestSignature({
        method: "post",
        urlPath: "/v1/checkout",
        salt: "abc123salt",
        timestamp: 1700000000,
        accessKey: "rak_test123",
        secretKey: "rsk_test456",
        bodyString: '{"amount":100}',
      }),
    ).toBe(
      "ZjYzYzU0NTlhNWM5MDQ0NTYyYjk2OGY0YjdiNTBmNTNmMDI4NmY3MzdlZTk3YzNlN2ZhMjQ1YTIxMzQ2ZGQ2Mw==",
    );
  });

  it("genera la firma de un webhook (sin method, URL absoluta)", () => {
    expect(
      buildRapydWebhookSignature({
        absoluteUrl: "https://example.com/webhook",
        salt: "saltXYZ",
        timestamp: "1700000000",
        accessKey: "rak_test123",
        secretKey: "rsk_test456",
        bodyString: '{"type":"PAYMENT_COMPLETED"}',
      }),
    ).toBe(
      "NTAzZjRhNDM4MTMyZDY4NGM5MGYwZGRhM2NhNjUyZTk3Y2UwMTBhNDVmZGFhOWU0ZWUzNGI2YTNiMDNhN2RhNQ==",
    );
  });

  it("una firma de request y una de webhook con los mismos datos NO coinciden", () => {
    // Guardrail explícito: la diferencia (method incluido/excluido, path vs
    // URL absoluta) es la fuente de bugs más común en integraciones Rapyd.
    const req = buildRapydRequestSignature({
      method: "post",
      urlPath: "/webhook",
      salt: "s",
      timestamp: 1,
      accessKey: "a",
      secretKey: "k",
      bodyString: "",
    });
    const webhook = buildRapydWebhookSignature({
      absoluteUrl: "/webhook",
      salt: "s",
      timestamp: "1",
      accessKey: "a",
      secretKey: "k",
      bodyString: "",
    });
    expect(req).not.toBe(webhook);
  });

  it("limpia caracteres especiales y trunca a 45 en la referencia", () => {
    expect(sanitizeRapydReference("ORD-ABC_123")).toBe("ORD-ABC123");
    expect(sanitizeRapydReference("x".repeat(60)).length).toBe(45);
  });

  it("hashWebhookBody es determinístico", () => {
    const a = hashWebhookBody('{"a":1}');
    const b = hashWebhookBody('{"a":1}');
    const c = hashWebhookBody('{"a":2}');
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });
});
