"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, userRepo } from "@/src/features/auth";
import { orderRepo, type Order } from "@/src/features/orders";
import { useWishlist } from "@/src/features/wishlist";
import { formatCOP } from "@/src/shared/lib/format";

export function AccountOverview() {
  const session = useSession((s) => s.session);
  const wishlistCount = useWishlist((s) => s.count());
  const [name, setName] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.userId) return;
      const [user, list] = await Promise.all([
        userRepo.findById(session.userId),
        orderRepo.byUser(session.userId),
      ]);
      if (cancelled) return;
      if (user) setName(user.name);
      setOrders(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.userId]);

  const totalSpent = orders.reduce((acc, o) => acc + o.totals.total, 0);
  const activeOrders = orders.filter((o) =>
    ["pending_payment", "paid", "preparing", "shipped"].includes(o.status),
  ).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white">
        <p className="text-[13px] opacity-80">Hola</p>
        <h3 className="mt-1 text-[26px] font-extrabold">{name || "👋"}</h3>
        <p className="mt-1 text-[13px] opacity-80">
          {orders.length === 0
            ? "Bienvenido a PH PLUS"
            : `Has hecho ${orders.length} pedido${orders.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Pedidos activos" value={String(activeOrders)} href="/cuenta/pedidos" />
        <Stat label="Total gastado" value={formatCOP(totalSpent)} />
        <Stat label="Favoritos" value={String(wishlistCount)} href="/cuenta/favoritos" />
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <div className="flex flex-col rounded-3xl border border-card-border bg-white px-5 py-4 transition-shadow hover:shadow-md">
      <span className="text-[12px] uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      <strong className="mt-1 text-[22px] font-extrabold text-brand">
        {value}
      </strong>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
