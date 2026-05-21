import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { AccountShell, AddressesList, RequireAuth } from "@/src/features/account";

export const metadata = { title: "Direcciones · PH PLUS" };

export default function DireccionesPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <AccountShell
          title="Direcciones"
          description="Guardá tus direcciones de envío para comprar más rápido."
          active="/cuenta/direcciones"
        >
          <AddressesList />
        </AccountShell>
      </RequireAuth>
      <Footer />
    </>
  );
}
