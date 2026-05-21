import Header from "../components/Header";
import Footer from "../components/Footer";
import { AccountOverview, AccountShell, RequireAuth } from "@/src/features/account";

export const metadata = {
  title: "Mi cuenta · PH PLUS",
};

export default function CuentaPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <AccountShell
          title="Resumen"
          description="Tu actividad reciente en PH PLUS."
          active="/cuenta"
        >
          <AccountOverview />
        </AccountShell>
      </RequireAuth>
      <Footer />
    </>
  );
}
