import { beforeEach, describe, expect, it } from "vitest";
import {
  MockShippingZoneRepo,
  SHIPPING_ZONES_SEED,
  SHIPPING_ZONES_STORAGE_PREFIX,
} from "./mock.repo";

function clearNamespace() {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SHIPPING_ZONES_STORAGE_PREFIX + ":")) {
      toRemove.push(key);
    }
  }
  for (const k of toRemove) localStorage.removeItem(k);
}

describe("MockShippingZoneRepo", () => {
  beforeEach(() => {
    clearNamespace();
  });

  it("siembra las zonas iniciales cuando el namespace está vacío", async () => {
    const repo = new MockShippingZoneRepo();
    const list = await repo.list();
    expect(list).toHaveLength(SHIPPING_ZONES_SEED.length);
    const ids = list.map((z) => z.id).sort();
    const expected = SHIPPING_ZONES_SEED.map((z) => z.id).sort();
    expect(ids).toEqual(expected);
  });

  it("crea, lee por id y actualiza zonas", async () => {
    const repo = new MockShippingZoneRepo();
    await repo.list(); // dispara seed

    const created = await repo.create({
      name: "Llanos Orientales",
      regions: ["Yopal", "Villavicencio"],
      cost: 25_000,
      leadTimeDaysMin: 4,
      leadTimeDaysMax: 6,
      isActive: true,
    });
    expect(created.id).toBeTruthy();
    expect(created.cost).toBe(25_000);

    const fetched = await repo.byId(created.id);
    expect(fetched?.name).toBe("Llanos Orientales");

    const updated = await repo.update(created.id, { cost: 27_000 });
    expect(updated.cost).toBe(27_000);
    expect(updated.id).toBe(created.id);
  });

  it("archive marca la zona como inactiva sin borrarla", async () => {
    const repo = new MockShippingZoneRepo();
    await repo.list();
    const target = SHIPPING_ZONES_SEED[0].id;

    await repo.archive(target);
    const after = await repo.byId(target);
    expect(after).not.toBeNull();
    expect(after?.isActive).toBe(false);
  });

  it("update tira si la zona no existe", async () => {
    const repo = new MockShippingZoneRepo();
    await repo.list();
    await expect(
      repo.update("zona-fantasma", { cost: 1 }),
    ).rejects.toThrow(/not found/i);
  });
});
