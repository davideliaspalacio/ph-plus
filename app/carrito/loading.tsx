import {
  BreadcrumbSkeleton,
  CartLineSkeleton,
  FooterShell,
  HeaderShell,
} from "../components/Skeletons";

export default function CartLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Cargando carrito...</span>
        <BreadcrumbSkeleton />

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton mt-2 h-4 w-72 rounded" />

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <CartLineSkeleton key={i} />
              ))}
            </div>
            <div className="skeleton h-80 rounded-2xl" />
          </div>
        </section>
      </main>
      <FooterShell />
    </>
  );
}
