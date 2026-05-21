import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./service";
import { MockOutboxRepo, OUTBOX_NAMESPACE } from "./data/mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import type { EmailMessage } from "./domain/email";
import * as templates from "./domain/templates";

/**
 * Tests del servicio sendEmail. Inyectamos un repo limpio y un `random`
 * determinista para hacer reproducibles las ramas éxito / falla.
 */

const ns = makeNamespacedStorage<EmailMessage>(OUTBOX_NAMESPACE);

beforeEach(() => {
  localStorage.clear();
  ns.clear();
  vi.restoreAllMocks();
});

describe("sendEmail", () => {
  it("encola y marca como sent cuando random() devuelve 0.5 (éxito)", async () => {
    const repo = new MockOutboxRepo();
    const msg = await sendEmail(
      {
        to: "cliente@example.com",
        template: "order_confirmation",
        payload: { orderId: "ORD-1", total: 50000 },
      },
      { repo, random: () => 0.5 },
    );

    expect(msg.status).toBe("sent");
    expect(msg.sentAt).toBeTruthy();
    expect(msg.subject).toBe("Pedido ORD-1 confirmado");

    const inOutbox = await repo.list();
    expect(inOutbox).toHaveLength(1);
    expect(inOutbox[0].status).toBe("sent");
  });

  it("marca como failed cuando random() devuelve 0.99 (falla)", async () => {
    const repo = new MockOutboxRepo();
    const msg = await sendEmail(
      {
        to: "cliente@example.com",
        template: "welcome",
        payload: { name: "Mariana" },
      },
      { repo, random: () => 0.99 },
    );

    expect(msg.status).toBe("failed");
    expect(msg.error).toBeTruthy();

    const failed = await repo.list("failed");
    expect(failed).toHaveLength(1);
  });

  it("tira si el email es inválido (no llega a encolar)", async () => {
    const repo = new MockOutboxRepo();
    await expect(
      sendEmail(
        {
          to: "no-es-email",
          template: "welcome",
          payload: { name: "X" },
        },
        { repo, random: () => 0.5 },
      ),
    ).rejects.toThrow();

    const list = await repo.list();
    expect(list).toHaveLength(0);
  });

  it("tira si el template no es válido (no llega a encolar)", async () => {
    const repo = new MockOutboxRepo();
    await expect(
      sendEmail(
        {
          to: "cliente@example.com",
          // @ts-expect-error: probando template inválido en runtime
          template: "no_existe",
          payload: {},
        },
        { repo, random: () => 0.5 },
      ),
    ).rejects.toThrow();

    const list = await repo.list();
    expect(list).toHaveLength(0);
  });

  it("invoca renderTemplate con el template y el payload provistos", async () => {
    const repo = new MockOutboxRepo();
    const spy = vi.spyOn(templates, "renderTemplate");

    await sendEmail(
      {
        to: "cliente@example.com",
        template: "order_shipped",
        payload: { orderId: "ORD-9", tracking: "TRK-XYZ" },
      },
      { repo, random: () => 0.5 },
    );

    expect(spy).toHaveBeenCalledWith("order_shipped", {
      orderId: "ORD-9",
      tracking: "TRK-XYZ",
    });
  });

  it("respeta un failureRate=0 (siempre éxito) independientemente del random", async () => {
    const repo = new MockOutboxRepo();
    const msg = await sendEmail(
      {
        to: "cliente@example.com",
        template: "welcome",
        payload: { name: "Z" },
      },
      { repo, random: () => 0.999999, failureRate: 0 },
    );
    expect(msg.status).toBe("sent");
  });
});
