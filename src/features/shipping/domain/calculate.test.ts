import { describe, expect, it } from "vitest";
import { calculateShipping, matchZone, normalizeCity } from "./calculate";
import type { ShippingZone } from "./zone";

const z = (overrides: Partial<ShippingZone> = {}): ShippingZone => ({
  id: "z",
  name: "Zona",
  regions: ["Bogotá"],
  cost: 8000,
  leadTimeDaysMin: 1,
  leadTimeDaysMax: 2,
  isActive: true,
  ...overrides,
});

const ZONES: ShippingZone[] = [
  z({
    id: "bog",
    name: "Bogotá D.C.",
    regions: ["Bogotá", "Soacha"],
    cost: 8000,
    leadTimeDaysMin: 1,
    leadTimeDaysMax: 2,
    freeShippingThreshold: 120000,
  }),
  z({
    id: "cun",
    name: "Cundinamarca cercana",
    regions: ["Chía", "Cota", "Funza", "Mosquera"],
    cost: 12000,
    leadTimeDaysMin: 2,
    leadTimeDaysMax: 3,
  }),
  z({
    id: "main",
    name: "Ciudades principales",
    regions: ["Medellín", "Cali", "Barranquilla", "Bucaramanga"],
    cost: 18000,
    leadTimeDaysMin: 3,
    leadTimeDaysMax: 5,
  }),
  z({
    id: "off",
    name: "Zona inactiva",
    regions: ["Leticia"],
    cost: 50000,
    leadTimeDaysMin: 7,
    leadTimeDaysMax: 10,
    isActive: false,
  }),
];

describe("normalizeCity", () => {
  it("quita acentos y baja a minúsculas", () => {
    expect(normalizeCity("Bogotá")).toBe("bogota");
    expect(normalizeCity("Medellín")).toBe("medellin");
  });

  it("trimea y colapsa espacios", () => {
    expect(normalizeCity("  Chía  ")).toBe("chia");
    expect(normalizeCity("San   Andrés")).toBe("san andres");
  });
});

describe("matchZone", () => {
  it("encuentra match exacto", () => {
    expect(matchZone(ZONES, "Bogotá")?.id).toBe("bog");
  });

  it("matchea sin importar acentos ni casing", () => {
    expect(matchZone(ZONES, "medellin")?.id).toBe("main");
    expect(matchZone(ZONES, "  CHIA ")?.id).toBe("cun");
  });

  it("devuelve null si no hay match", () => {
    expect(matchZone(ZONES, "Manizales")).toBeNull();
  });

  it("ignora zonas inactivas aunque tengan la región", () => {
    expect(matchZone(ZONES, "Leticia")).toBeNull();
  });

  it("devuelve la primera zona activa cuando varias matchean", () => {
    const dup: ShippingZone[] = [
      z({ id: "a", regions: ["Cali"], cost: 100 }),
      z({ id: "b", regions: ["Cali"], cost: 200 }),
    ];
    expect(matchZone(dup, "Cali")?.id).toBe("a");
  });
});

describe("calculateShipping", () => {
  it("devuelve cost y leadTime cuando la zona matchea y no aplica free", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Cali",
      subtotal: 50000,
    });
    expect(r.zone?.id).toBe("main");
    expect(r.cost).toBe(18000);
    expect(r.freeApplied).toBe(false);
    expect(r.leadTime).toEqual({ min: 3, max: 5 });
  });

  it("aplica envío gratis cuando el subtotal alcanza el umbral", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Bogotá",
      subtotal: 120000,
    });
    expect(r.zone?.id).toBe("bog");
    expect(r.cost).toBe(0);
    expect(r.freeApplied).toBe(true);
  });

  it("aplica envío gratis cuando el subtotal supera el umbral", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Bogotá",
      subtotal: 250000,
    });
    expect(r.cost).toBe(0);
    expect(r.freeApplied).toBe(true);
  });

  it("no aplica envío gratis si subtotal < umbral", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Bogotá",
      subtotal: 100000,
    });
    expect(r.cost).toBe(8000);
    expect(r.freeApplied).toBe(false);
  });

  it("no aplica envío gratis cuando la zona no tiene umbral configurado", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Medellín",
      subtotal: 1_000_000,
    });
    expect(r.cost).toBe(18000);
    expect(r.freeApplied).toBe(false);
  });

  it("normaliza la ciudad antes de calcular", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "  bogota ",
      subtotal: 1000,
    });
    expect(r.zone?.id).toBe("bog");
    expect(r.cost).toBe(8000);
  });

  it("devuelve zone:null cuando no hay match", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Pasto",
      subtotal: 50000,
    });
    expect(r.zone).toBeNull();
    expect(r.cost).toBeNull();
    expect(r.freeApplied).toBe(false);
    expect(r.leadTime).toBeNull();
  });

  it("ignora zonas inactivas en el cálculo completo", () => {
    const r = calculateShipping({
      zones: ZONES,
      city: "Leticia",
      subtotal: 500000,
    });
    expect(r.zone).toBeNull();
  });
});
