import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { AccountShell, WishlistList, RequireAuth } from "@/src/features/account";

export const metadata = { title: "Favoritos · PH PLUS" };

export default function FavoritosPage() {
  return (
    <>
      <Header />
      <RequireAuth>
        <AccountShell
          title="Favoritos"
          description="Productos guardados para más tarde."
          active="/cuenta/favoritos"
        >
          <WishlistList />
        </AccountShell>
      </RequireAuth>
      <Footer />
    </>
  );
}
