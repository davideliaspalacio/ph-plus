import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-page flex-1 flex-col items-center justify-center px-5 py-24 text-center sm:px-8 lg:px-12">
        <p className="text-[14px] font-semibold uppercase tracking-wider text-brand">
          404
        </p>
        <h1 className="mt-3 text-[28px] font-extrabold text-brand sm:text-[34px]">
          Producto no encontrado
        </h1>
        <p className="mt-3 max-w-md text-[14px] text-ink-muted">
          El producto que buscas ya no está disponible o el enlace cambió.
        </p>
        <Link
          href="/#productos"
          className="mt-8 inline-flex items-center rounded-full bg-brand px-6 py-3 text-[14px] font-semibold text-white transition-transform hover:scale-[1.03] hover:bg-brand-dark"
        >
          Ver todos los productos
        </Link>
      </main>
      <Footer />
    </>
  );
}
