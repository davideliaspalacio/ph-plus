import { beforeEach, describe, expect, it } from "vitest";
import { MockSettingsRepo, SETTINGS_STORAGE_KEY } from "./mock.repo";
import { SETTINGS_SEED } from "@/src/mocks/settings.seed";

beforeEach(() => {
  localStorage.clear();
});

describe("MockSettingsRepo", () => {
  it("get() inicializa con SETTINGS_SEED si la storage está vacía", async () => {
    const repo = new MockSettingsRepo();
    const s = await repo.get();
    expect(s.businessName).toBe(SETTINGS_SEED.businessName);
    expect(s.nit).toBe(SETTINGS_SEED.nit);
    expect(s.paymentMethods).toEqual(SETTINGS_SEED.paymentMethods);
    expect(localStorage.getItem(SETTINGS_STORAGE_KEY)).not.toBeNull();
  });

  it("update() persiste el patch y lo devuelve mergeado", async () => {
    const repo = new MockSettingsRepo();
    await repo.get();
    const next = await repo.update({
      businessName: "PH PLUS 2",
      taxRate: 0.19,
      policies: { shipping: "/envios-nuevos", returns: "/devoluciones" },
    });
    expect(next.businessName).toBe("PH PLUS 2");
    expect(next.taxRate).toBe(0.19);
    expect(next.policies.shipping).toBe("/envios-nuevos");
    // Reload: persistido.
    const repo2 = new MockSettingsRepo();
    const reloaded = await repo2.get();
    expect(reloaded.businessName).toBe("PH PLUS 2");
    expect(reloaded.taxRate).toBe(0.19);
  });

  it("update() mergea policies parcialmente sin perder claves existentes", async () => {
    const repo = new MockSettingsRepo();
    await repo.get();
    const next = await repo.update({
      policies: { shipping: "/x", returns: "/y" },
    });
    expect(next.policies.shipping).toBe("/x");
    expect(next.policies.returns).toBe("/y");
  });
});
