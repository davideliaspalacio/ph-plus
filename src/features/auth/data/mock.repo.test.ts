import { beforeEach, describe, expect, it } from "vitest";
import { MockUserRepo, USERS_STORAGE_PREFIX } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";

const tableStorage = makeNamespacedStorage(USERS_STORAGE_PREFIX);

describe("MockUserRepo", () => {
  beforeEach(() => {
    tableStorage.clear();
  });

  it("crea un usuario y lo encuentra por email (case-insensitive)", async () => {
    const repo = new MockUserRepo();
    const created = await repo.create({
      email: "Alice@Example.com",
      name: "Alice",
      passwordHash: "salt:hash",
    });
    expect(created.id).toBeTruthy();
    expect(created.email).toBe("alice@example.com");

    const found = await repo.findByEmail("ALICE@example.com");
    expect(found?.id).toBe(created.id);
  });

  it("encuentra un usuario por id", async () => {
    const repo = new MockUserRepo();
    const u = await repo.create({
      email: "b@example.com",
      name: "B",
      passwordHash: "x:y",
    });
    const found = await repo.findById(u.id);
    expect(found?.email).toBe("b@example.com");
  });

  it("devuelve null cuando no existe el email", async () => {
    const repo = new MockUserRepo();
    const found = await repo.findByEmail("nadie@example.com");
    expect(found).toBeNull();
  });

  it("tira EMAIL_TAKEN al crear con email duplicado (case-insensitive)", async () => {
    const repo = new MockUserRepo();
    await repo.create({
      email: "dup@example.com",
      name: "Dup",
      passwordHash: "x:y",
    });
    await expect(
      repo.create({
        email: "DUP@example.com",
        name: "Other",
        passwordHash: "a:b",
      }),
    ).rejects.toThrow("EMAIL_TAKEN");
  });

  it("actualiza un usuario existente", async () => {
    const repo = new MockUserRepo();
    const u = await repo.create({
      email: "c@example.com",
      name: "C",
      passwordHash: "x:y",
    });
    const updated = await repo.update(u.id, { name: "C Updated" });
    expect(updated.name).toBe("C Updated");
    const reread = await repo.findById(u.id);
    expect(reread?.name).toBe("C Updated");
  });
});
