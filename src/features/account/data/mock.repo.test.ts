import { beforeEach, describe, expect, it } from "vitest";
import { MockAddressRepo, ADDRESSES_STORAGE_PREFIX } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";

beforeEach(() => {
  makeNamespacedStorage(ADDRESSES_STORAGE_PREFIX).clear();
});

const baseInput = {
  name: "Ada",
  line1: "Calle 1",
  city: "Bogotá",
  department: "Cundinamarca",
  phone: "3001234567",
};

describe("MockAddressRepo", () => {
  it("crea y lista direcciones de un usuario", async () => {
    const repo = new MockAddressRepo();
    await repo.create("u1", baseInput);
    await repo.create("u1", { ...baseInput, name: "Casa 2" });
    const list = await repo.listByUser("u1");
    expect(list).toHaveLength(2);
  });

  it("aisla direcciones por usuario", async () => {
    const repo = new MockAddressRepo();
    await repo.create("u1", baseInput);
    await repo.create("u2", { ...baseInput, name: "Linus" });
    expect((await repo.listByUser("u1")).map((a) => a.name)).toEqual(["Ada"]);
    expect((await repo.listByUser("u2")).map((a) => a.name)).toEqual(["Linus"]);
  });

  it("update aplica patch y refresca updatedAt", async () => {
    const repo = new MockAddressRepo();
    const created = await repo.create("u1", baseInput);
    await new Promise((r) => setTimeout(r, 2));
    const updated = await repo.update(created.id, { city: "Medellín" });
    expect(updated.city).toBe("Medellín");
    expect(
      new Date(updated.updatedAt).getTime(),
    ).toBeGreaterThanOrEqual(new Date(created.updatedAt).getTime());
  });

  it("remove elimina por id", async () => {
    const repo = new MockAddressRepo();
    const a = await repo.create("u1", baseInput);
    await repo.remove(a.id);
    expect(await repo.listByUser("u1")).toEqual([]);
  });

  it("setDefault marca uno como default y desmarca los demás", async () => {
    const repo = new MockAddressRepo();
    const a1 = await repo.create("u1", baseInput);
    const a2 = await repo.create("u1", { ...baseInput, name: "Trabajo" });
    await repo.setDefault("u1", a2.id);
    const list = await repo.listByUser("u1");
    const byId = (id: string) => list.find((x) => x.id === id)!;
    expect(byId(a1.id).isDefault).toBe(false);
    expect(byId(a2.id).isDefault).toBe(true);
  });
});
