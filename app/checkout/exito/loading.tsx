import { FooterShell, HeaderShell } from "../../components/Skeletons";

export default function CheckoutSuccessLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Procesando confirmación...</span>
        <section className="mx-auto max-w-[820px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-col items-center">
            <div className="skeleton h-20 w-20 rounded-full" />
            <div className="skeleton mt-6 h-8 w-72 rounded" />
            <div className="skeleton mt-3 h-4 w-96 max-w-full rounded" />
            <div className="skeleton mt-4 h-7 w-44 rounded-full" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-40 rounded-2xl" />
          </div>
        </section>
      </main>
      <FooterShell />
    </>
  );
}
