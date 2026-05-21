import { beforeEach, describe, expect, it, vi } from "vitest";
import { storage, makeNamespacedStorage } from "./storage";

beforeEach(() => {
  localStorage.clear();
});

describe("storage", () => {
  it("get devuelve null cuando la llave no existe", () => {
    expect(storage.get("phplus.missing")).toBeNull();
  });

  it("set persiste y get devuelve el mismo valor", () => {
    storage.set("phplus.foo", { a: 1, b: [2, 3] });
    expect(storage.get("phplus.foo")).toEqual({ a: 1, b: [2, 3] });
  });

  it("set devuelve el valor escrito (chainable)", () => {
    const value = storage.set("phplus.bar", "hello");
    expect(value).toBe("hello");
  });

  it("remove borra la llave", () => {
    storage.set("phplus.x", 42);
    storage.remove("phplus.x");
    expect(storage.get("phplus.x")).toBeNull();
  });

  it("get devuelve null si el JSON está corrupto en vez de tirar", () => {
    localStorage.setItem("phplus.corrupto", "{not json}");
    expect(storage.get("phplus.corrupto")).toBeNull();
  });

  it("set no tira cuando localStorage no está disponible (SSR-safe)", () => {
    const original = globalThis.localStorage;
    // @ts-expect-error simulate SSR
    delete globalThis.localStorage;
    expect(() => storage.set("phplus.ssr", { a: 1 })).not.toThrow();
    expect(storage.get("phplus.ssr")).toBeNull();
    globalThis.localStorage = original;
  });

  it("withDefault devuelve el default si la llave no existe", () => {
    expect(storage.withDefault("phplus.miss", { a: 1 })).toEqual({ a: 1 });
  });

  it("withDefault devuelve el valor guardado si existe", () => {
    storage.set("phplus.have", { a: 9 });
    expect(storage.withDefault("phplus.have", { a: 1 })).toEqual({ a: 9 });
  });
});

describe("makeNamespacedStorage", () => {
  it("prefija todas las llaves con el namespace", () => {
    const ns = makeNamespacedStorage("phplus.db.test.v1");
    ns.set("user-1", { name: "Ada" });
    expect(localStorage.getItem("phplus.db.test.v1:user-1")).toBeTruthy();
    expect(ns.get<{ name: string }>("user-1")).toEqual({ name: "Ada" });
  });

  it("list devuelve todos los items del namespace", () => {
    const ns = makeNamespacedStorage<{ id: string; name: string }>(
      "phplus.db.users.v1",
    );
    ns.set("u1", { id: "u1", name: "Ada" });
    ns.set("u2", { id: "u2", name: "Linus" });
    const items = ns.list();
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.name).sort()).toEqual(["Ada", "Linus"]);
  });

  it("list devuelve [] cuando no hay items", () => {
    const ns = makeNamespacedStorage("phplus.db.empty.v1");
    expect(ns.list()).toEqual([]);
  });

  it("clear elimina todas las llaves del namespace", () => {
    const ns = makeNamespacedStorage("phplus.db.x.v1");
    ns.set("a", 1);
    ns.set("b", 2);
    ns.clear();
    expect(ns.list()).toEqual([]);
  });
});
