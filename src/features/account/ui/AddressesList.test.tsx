import { afterEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddressesList } from "./AddressesList";
import { useSession } from "@/src/features/auth";
import { ADDRESSES_STORAGE_PREFIX } from "@/src/features/account";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";

afterEach(() => {
  useSession.getState().clearSession();
  makeNamespacedStorage(ADDRESSES_STORAGE_PREFIX).clear();
});

const login = (userId = "u1") =>
  useSession.getState().setSession({
    userId,
    role: "customer",
    expiresAt: Date.now() + 60_000,
  });

describe("AddressesList", () => {
  it("muestra empty state cuando no hay direcciones", async () => {
    login();
    render(<AddressesList />);
    expect(
      await screen.findByText(/no tenés direcciones/i),
    ).toBeInTheDocument();
  });

  it("permite agregar una dirección y la muestra en la lista", async () => {
    login();
    const user = userEvent.setup();
    render(<AddressesList />);
    await user.click(await screen.findByRole("button", { name: /agregar/i }));
    await user.type(
      screen.getByLabelText(/nombre del destinatario/i),
      "Ada Lovelace",
    );
    await user.type(screen.getByLabelText(/^dirección/i), "Calle 123");
    await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");
    await user.type(screen.getByLabelText(/departamento/i), "Cundinamarca");
    await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    await waitFor(() =>
      expect(screen.getByText("Ada Lovelace")).toBeInTheDocument(),
    );
  });
});
