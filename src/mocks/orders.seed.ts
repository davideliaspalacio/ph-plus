/**
 * Seed inicial de órdenes para el repo mock de `features/orders`.
 *
 * Cubre los estados clave del flujo (`pending_payment`, `paid`, `preparing`,
 * `shipped`, `delivered`, `cancelled`) para que las pantallas admin y de
 * cuenta tengan algo coherente que mostrar al abrirse por primera vez.
 *
 * Todas las líneas referencian `slug`s reales de `app/lib/products.ts` y los
 * `totals` están calculados a mano (subtotal = sum(lineTotal); total =
 * subtotal - discount + shipping).
 *
 * Se asocian al `userId` del primer customer en `users.seed.ts`.
 */

import type { Order } from "@/src/features/orders/domain/order";
import { SEED_PRIMARY_CUSTOMER_ID } from "./users.seed";

const PRIMARY_CONTACT: Order["contact"] = {
  name: "María Gómez",
  email: "maria.gomez@example.com",
  phone: "+57 310 555 0101",
};

const PRIMARY_SHIPPING: Order["shipping"] = {
  address: "Cra. 13 #93-45, Apto 502",
  city: "Bogotá",
  department: "Cundinamarca",
  postalCode: "110221",
  notes: "Dejar en portería si nadie atiende.",
};

export const ORDERS_SEED: Order[] = [
  // 1) pending_payment
  {
    id: "ORD-1001",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "pending_payment",
    lines: [
      {
        slug: "recarga-19lts-individual",
        title: "Recarga individual 19 lts",
        quantity: 1,
        unitPrice: 36000,
        lineTotal: 36000,
      },
    ],
    totals: { subtotal: 36000, discount: 0, shipping: 6000, total: 42000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "pse" },
    notes: [],
    createdAt: "2026-05-18T13:42:00.000Z",
    updatedAt: "2026-05-18T13:42:00.000Z",
  },
  // 2) pending_payment
  {
    id: "ORD-1002",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "pending_payment",
    lines: [
      {
        slug: "garrafa-1l-pack6",
        title: "Pack 6 garrafas de 1 litro",
        quantity: 2,
        unitPrice: 24000,
        lineTotal: 48000,
      },
    ],
    totals: { subtotal: 48000, discount: 0, shipping: 8000, total: 56000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "nequi" },
    notes: [],
    createdAt: "2026-05-19T09:05:00.000Z",
    updatedAt: "2026-05-19T09:05:00.000Z",
  },
  // 3) paid
  {
    id: "ORD-1003",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "paid",
    lines: [
      {
        slug: "kit-inicial-botellon-19lts",
        title: "Kit inicial de botellón 19 lts",
        quantity: 1,
        unitPrice: 85000,
        lineTotal: 85000,
      },
    ],
    totals: { subtotal: 85000, discount: 5000, shipping: 0, total: 80000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "credit_card", last4: "4242" },
    couponCode: "BIENVENIDA5",
    notes: [
      {
        id: "note_1003_1",
        author: "Andrés Ramírez",
        text: "Pago confirmado por pasarela. Pendiente alistar para mañana.",
        createdAt: "2026-05-17T10:15:00.000Z",
      },
    ],
    createdAt: "2026-05-17T08:30:00.000Z",
    updatedAt: "2026-05-17T10:15:00.000Z",
  },
  // 4) paid
  {
    id: "ORD-1004",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "paid",
    lines: [
      {
        slug: "recargas-19lts",
        title: "2 recargas de botellón 19 lts",
        quantity: 1,
        unitPrice: 69000,
        lineTotal: 69000,
      },
      {
        slug: "botellon-5l",
        title: "Botellón 5 litros",
        quantity: 2,
        unitPrice: 12000,
        lineTotal: 24000,
      },
    ],
    totals: { subtotal: 93000, discount: 0, shipping: 7000, total: 100000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "credit_card", last4: "1881" },
    notes: [],
    createdAt: "2026-05-16T17:50:00.000Z",
    updatedAt: "2026-05-16T18:02:00.000Z",
  },
  // 5) preparing
  {
    id: "ORD-1005",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "preparing",
    lines: [
      {
        slug: "promocion-garrafas",
        title: "Promoción Garrafas — ¡Pague 3, lleve 5!",
        quantity: 1,
        unitPrice: 73470,
        lineTotal: 73470,
      },
    ],
    totals: { subtotal: 73470, discount: 0, shipping: 6000, total: 79470 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "pse" },
    notes: [
      {
        id: "note_1005_1",
        author: "Andrés Ramírez",
        text: "Alistando pedido. Sale en ruta hoy a las 3 pm.",
        createdAt: "2026-05-15T14:00:00.000Z",
      },
    ],
    createdAt: "2026-05-15T11:20:00.000Z",
    updatedAt: "2026-05-15T14:00:00.000Z",
  },
  // 6) shipped
  {
    id: "ORD-1006",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "shipped",
    lines: [
      {
        slug: "garrafa-1-5l-pack6",
        title: "Pack 6 garrafas de 1,5 litros",
        quantity: 1,
        unitPrice: 32000,
        lineTotal: 32000,
      },
      {
        slug: "dispensador-manual",
        title: "Dispensador manual para botellón",
        quantity: 1,
        unitPrice: 35000,
        lineTotal: 35000,
      },
    ],
    totals: { subtotal: 67000, discount: 0, shipping: 8000, total: 75000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "credit_card", last4: "4242" },
    trackingNumber: "PHP-TRK-77821",
    notes: [
      {
        id: "note_1006_1",
        author: "Andrés Ramírez",
        text: "Despachado con mensajería interna. Entrega estimada en 24 h.",
        createdAt: "2026-05-14T09:30:00.000Z",
      },
    ],
    createdAt: "2026-05-13T16:00:00.000Z",
    updatedAt: "2026-05-14T09:30:00.000Z",
  },
  // 7) delivered
  {
    id: "ORD-1007",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "delivered",
    lines: [
      {
        slug: "suscripcion-mensual-4-botellones",
        title: "Suscripción mensual — 4 botellones de 19 L",
        quantity: 1,
        unitPrice: 148000,
        lineTotal: 148000,
      },
    ],
    totals: { subtotal: 148000, discount: 10000, shipping: 0, total: 138000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "credit_card", last4: "4242" },
    couponCode: "SUSCRIPCION10",
    trackingNumber: "PHP-TRK-77654",
    notes: [
      {
        id: "note_1007_1",
        author: "Andrés Ramírez",
        text: "Entregado y firmado por la clienta. Recogimos 4 botellones vacíos.",
        createdAt: "2026-05-09T12:48:00.000Z",
      },
    ],
    createdAt: "2026-05-08T08:00:00.000Z",
    updatedAt: "2026-05-09T12:48:00.000Z",
  },
  // 8) cancelled
  {
    id: "ORD-1008",
    userId: SEED_PRIMARY_CUSTOMER_ID,
    status: "cancelled",
    lines: [
      {
        slug: "botellon-19lts",
        title: "Botellón 19 lts (solo envase + agua)",
        quantity: 1,
        unitPrice: 42000,
        lineTotal: 42000,
      },
    ],
    totals: { subtotal: 42000, discount: 0, shipping: 6000, total: 48000 },
    contact: PRIMARY_CONTACT,
    shipping: PRIMARY_SHIPPING,
    payment: { method: "cash_on_delivery" },
    notes: [
      {
        id: "note_1008_1",
        author: "Laura Torres",
        text: "Cliente canceló por WhatsApp: ya consiguió botellón con un vecino.",
        createdAt: "2026-05-05T19:10:00.000Z",
      },
    ],
    createdAt: "2026-05-05T15:32:00.000Z",
    updatedAt: "2026-05-05T19:10:00.000Z",
  },
];
