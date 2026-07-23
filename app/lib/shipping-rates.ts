export type ShippingCostRow = {
  text: string;
  cost: number;
  emphasis?: boolean;
  noBullet?: boolean;
};

export type ShippingDestination = {
  value: string;
  label: string;
  department: string;
  cost: number;
  aliases?: string[];
};

export type ShippingDestinationGroup = {
  label: string;
  destinations: ShippingDestination[];
};

export const SHIPPING_PRIMARY_COST = 11_000;
export const SHIPPING_SECONDARY_COST = 15_000;

export const SHIPPING_COST_ROWS: ShippingCostRow[] = [
  {
    text: "Envío Bogotá - Medellín - Barranquilla - Cartagena",
    cost: SHIPPING_PRIMARY_COST,
    emphasis: true,
  },
  {
    text: "Envío Alrededores Bogotá: Cajica, Tenjo, Tabio, Cota, Chía, Tocancipa, Funza",
    cost: SHIPPING_SECONDARY_COST,
  },
  {
    text: "Envío Alrededores Medellín",
    cost: SHIPPING_SECONDARY_COST,
  },
  {
    text: "Bello, Sabaneta, Envigado, Itagui",
    cost: SHIPPING_SECONDARY_COST,
    noBullet: true,
  },
  {
    text: "Envío Alrededores Barranquilla: Villacampestre",
    cost: SHIPPING_SECONDARY_COST,
  },
  {
    text: "Envío Alrededores Cartagena: Manzanillo",
    cost: SHIPPING_SECONDARY_COST,
  },
  {
    text: "Cali",
    cost: SHIPPING_SECONDARY_COST,
  },
];

export const SHIPPING_DESTINATION_GROUPS: ShippingDestinationGroup[] = [
  {
    label: "Ciudades principales",
    destinations: [
      {
        value: "bogota",
        label: "Bogotá",
        department: "Bogotá D.C.",
        cost: SHIPPING_PRIMARY_COST,
        aliases: ["Bogota", "Bogotá D.C."],
      },
      {
        value: "medellin",
        label: "Medellín",
        department: "Antioquia",
        cost: SHIPPING_PRIMARY_COST,
        aliases: ["Medellin"],
      },
      {
        value: "barranquilla",
        label: "Barranquilla",
        department: "Atlántico",
        cost: SHIPPING_PRIMARY_COST,
      },
      {
        value: "cartagena",
        label: "Cartagena",
        department: "Bolívar",
        cost: SHIPPING_PRIMARY_COST,
      },
    ],
  },
  {
    label: "Alrededores Bogotá",
    destinations: [
      {
        value: "cajica",
        label: "Cajicá",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
        aliases: ["Cajica"],
      },
      {
        value: "tenjo",
        label: "Tenjo",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "tabio",
        label: "Tabio",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "cota",
        label: "Cota",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "chia",
        label: "Chía",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
        aliases: ["Chia"],
      },
      {
        value: "tocancipa",
        label: "Tocancipá",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
        aliases: ["Tocancipa"],
      },
      {
        value: "funza",
        label: "Funza",
        department: "Cundinamarca",
        cost: SHIPPING_SECONDARY_COST,
      },
    ],
  },
  {
    label: "Alrededores Medellín",
    destinations: [
      {
        value: "bello",
        label: "Bello",
        department: "Antioquia",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "sabaneta",
        label: "Sabaneta",
        department: "Antioquia",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "envigado",
        label: "Envigado",
        department: "Antioquia",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "itagui",
        label: "Itagüí",
        department: "Antioquia",
        cost: SHIPPING_SECONDARY_COST,
        aliases: ["Itagui"],
      },
    ],
  },
  {
    label: "Otras zonas disponibles",
    destinations: [
      {
        value: "villacampestre",
        label: "Villacampestre",
        department: "Atlántico",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "manzanillo",
        label: "Manzanillo",
        department: "Bolívar",
        cost: SHIPPING_SECONDARY_COST,
      },
      {
        value: "cali",
        label: "Cali",
        department: "Valle del Cauca",
        cost: SHIPPING_SECONDARY_COST,
      },
    ],
  },
];

export const SHIPPING_DESTINATIONS: ShippingDestination[] =
  SHIPPING_DESTINATION_GROUPS.flatMap((group) => group.destinations);

export function normalizeShippingCity(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getShippingDestination(
  city: string,
): ShippingDestination | undefined {
  const target = normalizeShippingCity(city);
  if (!target) return undefined;

  return SHIPPING_DESTINATIONS.find((destination) => {
    const candidates = [
      destination.value,
      destination.label,
      ...(destination.aliases ?? []),
    ];
    return candidates.some((candidate) => normalizeShippingCity(candidate) === target);
  });
}

export function isSupportedShippingCity(city: string): boolean {
  return Boolean(getShippingDestination(city));
}
