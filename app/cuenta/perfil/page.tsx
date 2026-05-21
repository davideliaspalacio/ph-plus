import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { AccountShell, ProfileForm, RequireAuth } from "@/src/features/account";

export const metadata = { title: "Mi perfil · PH PLUS" };

export default function PerfilPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <AccountShell
          title="Mi perfil"
          description="Datos básicos de tu cuenta."
          active="/cuenta/perfil"
        >
          <ProfileForm />
        </AccountShell>
      </RequireAuth>
      <Footer />
    </>
  );
}
