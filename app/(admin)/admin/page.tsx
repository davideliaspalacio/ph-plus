import { DashboardOverview } from "@/src/features/admin/dashboard";

export const metadata = {
  title: "Dashboard · PH PLUS Admin",
};

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-extrabold text-brand">Dashboard</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Resumen de ventas, pedidos y productos más vendidos.
        </p>
      </header>
      <DashboardOverview />
    </div>
  );
}
