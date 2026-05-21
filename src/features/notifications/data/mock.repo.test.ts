import { beforeEach, describe, expect, it } from "vitest";
import { MockOutboxRepo, OUTBOX_NAMESPACE } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import type { EmailMessage } from "../domain/email";

/**
 * Tests del repo mock del outbox: enqueue, list, filtrado por status,
 * markSent / markFailed, clear.
 */

const ns = makeNamespacedStorage<EmailMessage>(OUTBOX_NAMESPACE);

beforeEach(() => {
  localStorage.clear();
  ns.clear();
});

describe("MockOutboxRepo", () => {
  it("enqueue renderiza el template y deja status=queued con createdAt", async () => {
    const repo = new MockOutboxRepo();
    const msg = await repo.enqueue({
      to: "cliente@example.com",
      template: "order_confirmation",
      payload: { orderId: "ORD-1", total: 50000 },
    });
    expect(msg.status).toBe("queued");
    expect(msg.subject).toBe("Pedido ORD-1 confirmado");
    expect(msg.html).toContain("ORD-1");
    expect(msg.createdAt).toBeTruthy();
    expect(msg.id).toBeTruthy();
  });

  it("list devuelve los emails encolados (orden desc por createdAt)", async () => {
    const repo = new MockOutboxRepo();
    const a = await repo.enqueue({
      to: "a@example.com",
      template: "welcome",
      payload: { name: "A" },
    });
    // Garantizamos un createdAt posterior
    await new Promise((r) => setTimeout(r, 5));
    const b = await repo.enqueue({
      to: "b@example.com",
      template: "welcome",
      payload: { name: "B" },
    });
    const list = await repo.list();
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe(b.id);
    expect(list[1].id).toBe(a.id);
  });

  it("list(status) filtra por status", async () => {
    const repo = new MockOutboxRepo();
    const a = await repo.enqueue({
      to: "a@example.com",
      template: "welcome",
      payload: { name: "A" },
    });
    await repo.enqueue({
      to: "b@example.com",
      template: "welcome",
      payload: { name: "B" },
    });
    await repo.markSent(a.id);

    const sent = await repo.list("sent");
    const queued = await repo.list("queued");
    expect(sent).toHaveLength(1);
    expect(sent[0].id).toBe(a.id);
    expect(queued).toHaveLength(1);
  });

  it("markSent setea status=sent y sentAt; markFailed setea status=failed y error", async () => {
    const repo = new MockOutboxRepo();
    const a = await repo.enqueue({
      to: "a@example.com",
      template: "welcome",
      payload: { name: "A" },
    });
    const b = await repo.enqueue({
      to: "b@example.com",
      template: "welcome",
      payload: { name: "B" },
    });

    const sent = await repo.markSent(a.id);
    expect(sent.status).toBe("sent");
    expect(sent.sentAt).toBeTruthy();

    const failed = await repo.markFailed(b.id, "smtp timeout");
    expect(failed.status).toBe("failed");
    expect(failed.error).toBe("smtp timeout");
  });

  it("markSent / markFailed sobre id inexistente tira", async () => {
    const repo = new MockOutboxRepo();
    await expect(repo.markSent("missing")).rejects.toThrow(/not found/);
    await expect(repo.markFailed("missing", "x")).rejects.toThrow(/not found/);
  });

  it("clear vacía el outbox", async () => {
    const repo = new MockOutboxRepo();
    await repo.enqueue({
      to: "a@example.com",
      template: "welcome",
      payload: { name: "A" },
    });
    expect(await repo.list()).toHaveLength(1);
    await repo.clear();
    expect(await repo.list()).toHaveLength(0);
  });
});
