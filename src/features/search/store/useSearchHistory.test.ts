import { beforeEach, describe, expect, it } from "vitest";
import {
  useSearchHistory,
  SEARCH_HISTORY_STORAGE_KEY,
} from "./useSearchHistory";

const reset = () => {
  useSearchHistory.getState().clear();
  localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
};

describe("useSearchHistory store", () => {
  beforeEach(() => {
    reset();
  });

  it("arranca con items vacíos", () => {
    expect(useSearchHistory.getState().items).toEqual([]);
  });

  it("add agrega una búsqueda al inicio", () => {
    useSearchHistory.getState().add("agua");
    useSearchHistory.getState().add("botellon");
    expect(useSearchHistory.getState().items).toEqual(["botellon", "agua"]);
  });

  it("add dedupea (mueve al inicio si ya existía)", () => {
    useSearchHistory.getState().add("agua");
    useSearchHistory.getState().add("botellon");
    useSearchHistory.getState().add("kit");
    useSearchHistory.getState().add("agua");
    expect(useSearchHistory.getState().items).toEqual([
      "agua",
      "kit",
      "botellon",
    ]);
  });

  it("add respeta el máximo de 5", () => {
    const store = useSearchHistory.getState();
    store.add("a");
    store.add("b");
    store.add("c");
    store.add("d");
    store.add("e");
    store.add("f");
    const items = useSearchHistory.getState().items;
    expect(items).toHaveLength(5);
    expect(items[0]).toBe("f");
    expect(items).not.toContain("a");
  });

  it("add ignora queries vacías o sólo whitespace", () => {
    useSearchHistory.getState().add("");
    useSearchHistory.getState().add("   ");
    expect(useSearchHistory.getState().items).toEqual([]);
  });

  it("remove elimina una búsqueda específica", () => {
    useSearchHistory.getState().add("agua");
    useSearchHistory.getState().add("botellon");
    useSearchHistory.getState().remove("agua");
    expect(useSearchHistory.getState().items).toEqual(["botellon"]);
  });

  it("clear vacía el historial", () => {
    useSearchHistory.getState().add("agua");
    useSearchHistory.getState().add("kit");
    useSearchHistory.getState().clear();
    expect(useSearchHistory.getState().items).toEqual([]);
  });

  it("persiste en localStorage con la llave esperada", () => {
    useSearchHistory.getState().add("agua");
    const raw = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.items).toEqual(["agua"]);
  });
});
