import { beforeEach, describe, expect, it } from "vitest";
import { MockCouponRepo, COUPONS_NAMESPACE } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";

/**
 * Tests del repo mock: seeds, CRUD básico, findByCode case-insensitive, incrementUsage.
 */

const ns = makeNamespacedStorage(COUPONS_NAMESPACE);

beforeEach(() => {
  localStorage.clear();
  ns.clear();
});

describe("MockCouponRepo", () => {
  it("siembra 3 cupones iniciales cuando el namespace está vacío", async () => {
    const repo = new MockCouponRepo();
    const list = await repo.list();
    expect(list).toHaveLength(3);
    const codes = list.map((c) => c.code).sort();
    expect(codes).toEqual(["BIENVENIDA10", "ENVIOGRATIS", "PHPLUS5K"]);
  });

  it("findByCode es case-insensitive y trimea", async () => {
    const repo = new MockCouponRepo();
    await repo.list(); // fuerza seed
    const found = await repo.findByCode("  bienvenida10  ");
    expect(found).not.toBeNull();
    expect(found?.code).toBe("BIENVENIDA10");
    const miss = await repo.findByCode("NO_EXISTE");
    expect(miss).toBeNull();
  });

  it("create y update modifican la tabla", async () => {
    const repo = new MockCouponRepo();
    await repo.list();
    const created = await repo.create({
      code: "nuevo20",
      type: "percent",
      value: 20,
      startsAt: "2026-01-01T00:00:00.000Z",
      endsAt: "2026-12-31T23:59:59.000Z",
      minSubtotal: 0,
      maxUses: 50,
      maxUsesPerCustomer: 1,
      isActive: true,
    });
    expect(created.code).toBe("NUEVO20");
    const updated = await repo.update(created.id, { value: 25 });
    expect(updated.value).toBe(25);
    const all = await repo.list();
    expect(all.find((c) => c.id === created.id)?.value).toBe(25);
  });

  it("archive desactiva el cupón (isActive=false)", async () => {
    const repo = new MockCouponRepo();
    const [first] = await repo.list();
    await repo.archive(first.id);
    const found = await repo.findByCode(first.code);
    expect(found?.isActive).toBe(false);
  });

  it("incrementUsage sube el usedCount en 1", async () => {
    const repo = new MockCouponRepo();
    const [first] = await repo.list();
    const before = first.usedCount;
    const updated = await repo.incrementUsage(first.id);
    expect(updated.usedCount).toBe(before + 1);
    const re = await repo.findByCode(first.code);
    expect(re?.usedCount).toBe(before + 1);
  });
});
