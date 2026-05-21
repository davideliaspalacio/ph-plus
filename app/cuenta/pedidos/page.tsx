import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { AccountShell, OrdersList, RequireAuth } from "@/src/features/account";

export const metadata = { title: "Mis pedidos · PH PLUS" };

export default function PedidosPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <AccountShell
          title="Mis pedidos"
          description="Histórico de compras y estado de envío."
          active="/cuenta/pedidos"
        >
          <OrdersList />
        </AccountShell>
      </RequireAuth>
      <Footer />
    </>
  );
}
