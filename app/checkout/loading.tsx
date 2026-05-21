import {
  BreadcrumbSkeleton,
  FooterShell,
  HeaderShell,
} from "../components/Skeletons";

export default function CheckoutLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Cargando checkout...</span>
        <BreadcrumbSkeleton />

        <section className="mx-auto max-w-page px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="skeleton h-8 w-56 rounded" />

          <div className="mt-6 flex items-center gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-1 items-center gap-2">
                <div className="skeleton h-7 w-7 rounded-full sm:h-8 sm:w-8" />
                <div className="skeleton hidden h-3 w-16 rounded sm:block" />
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-2xl border border-card-border bg-white p-5 sm:p-6">
              <div className="skeleton h-5 w-44 rounded" />
              <div className="mt-5 space-y-4">
                <div className="skeleton h-11 w-full rounded-lg" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="skeleton h-11 w-full rounded-lg" />
                  <div className="skeleton h-11 w-full rounded-lg" />
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <div className="skeleton h-9 w-24 rounded-full" />
                <div className="skeleton h-9 w-32 rounded-full" />
              </div>
            </div>
            <div className="skeleton h-72 rounded-2xl" />
          </div>
        </section>
      </main>
      <FooterShell />
    </>
  );
}
