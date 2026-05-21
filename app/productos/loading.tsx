import {
  BreadcrumbSkeleton,
  FooterShell,
  HeaderShell,
  ProductCardSkeleton,
} from "../components/Skeletons";

export default function ProductsListingLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Cargando productos...</span>
        <BreadcrumbSkeleton />

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="skeleton h-8 w-72 rounded" />
              <div className="skeleton h-4 w-60 rounded" />
            </div>
            <div className="skeleton h-4 w-32 rounded" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="skeleton h-11 flex-1 rounded-full" />
            <div className="flex items-center gap-2">
              <div className="skeleton h-11 w-24 rounded-full lg:hidden" />
              <div className="skeleton h-11 w-48 rounded-full" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
            <aside className="hidden lg:block">
              <div className="skeleton h-[380px] rounded-2xl" />
            </aside>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <FooterShell />
    </>
  );
}
