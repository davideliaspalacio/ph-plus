import { describe, expect, it } from "vitest";
import { addRecent } from "./recent";

describe("addRecent", () => {
  it("agrega un término a una lista vacía", () => {
    expect(addRecent([], "agua")).toEqual(["agua"]);
  });

  it("agrega al inicio (lo más reciente primero)", () => {
    expect(addRecent(["agua"], "botellon")).toEqual(["botellon", "agua"]);
  });

  it("dedupea: si ya existía lo mueve al inicio (no duplica)", () => {
    const out = addRecent(["botellon", "agua", "kit"], "agua");
    expect(out).toEqual(["agua", "botellon", "kit"]);
  });

  it("respeta el cap (default 5)", () => {
    const list = ["e", "d", "c", "b", "a"];
    const out = addRecent(list, "f");
    expect(out).toHaveLength(5);
    expect(out[0]).toBe("f");
    expect(out).toEqual(["f", "e", "d", "c", "b"]);
  });

  it("respeta un max custom", () => {
    const out = addRecent(["c", "b", "a"], "d", 2);
    expect(out).toEqual(["d", "c"]);
  });

  it("trimea espacios y normaliza vacíos: ignora si la query es vacía", () => {
    const list = ["agua"];
    expect(addRecent(list, "")).toBe(list);
    expect(addRecent(list, "   ")).toBe(list);
  });

  it("no muta la lista original (devuelve nueva referencia)", () => {
    const list = ["agua"];
    const out = addRecent(list, "kit");
    expect(out).not.toBe(list);
    expect(list).toEqual(["agua"]);
  });

  it("dedupe es case-insensitive: 'Agua' y 'agua' se consideran el mismo", () => {
    const out = addRecent(["botellon", "agua"], "Agua");
    expect(out).toEqual(["Agua", "botellon"]);
  });
});
