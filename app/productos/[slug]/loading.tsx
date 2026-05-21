import {
  BreadcrumbSkeleton,
  FooterShell,
  HeaderShell,
  ProductCardSkeleton,
} from "../../components/Skeletons";

export default function ProductDetailLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Cargando producto...</span>
        <BreadcrumbSkeleton />

        <section className="mx-auto max-w-page px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="skeleton h-80 w-full rounded-3xl sm:h-96 lg:h-[420px]" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-20 w-20 rounded-xl" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="skeleton h-5 w-24 rounded-full" />
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
              <div className="skeleton h-9 w-40 rounded" />
              <div className="space-y-2 pt-3">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-11/12 rounded" />
                <div className="skeleton h-3 w-9/12 rounded" />
              </div>
              <div className="space-y-2 pt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="skeleton h-5 w-5 rounded-full" />
                    <div className="skeleton h-3 flex-1 rounded" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-4">
                <div className="skeleton h-11 w-44 rounded-full" />
                <div className="skeleton h-11 w-52 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-card-border bg-[#fafbfd] py-12 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
            <div className="skeleton mx-auto h-6 w-48 rounded" />
            <div className="mx-auto mt-8 grid max-w-[880px] grid-cols-1 gap-5 sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
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
