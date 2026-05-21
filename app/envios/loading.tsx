import {
  BreadcrumbSkeleton,
  FooterShell,
  HeaderShell,
} from "../components/Skeletons";

export default function EnviosLoading() {
  return (
    <>
      <HeaderShell />
      <main aria-busy="true" className="flex-1 bg-white">
        <span className="sr-only">Cargando información de envíos...</span>
        <BreadcrumbSkeleton />

        <section className="w-full bg-brand py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
            <div className="skeleton h-7 w-44 rounded-full bg-white/30" />
            <div className="skeleton mt-4 h-10 w-3/4 max-w-2xl rounded bg-white/30" />
            <div className="skeleton mt-3 h-4 w-2/3 max-w-xl rounded bg-white/30" />
          </div>
        </section>

        <section className="mx-auto max-w-page px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <div className="skeleton h-7 w-56 rounded" />
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        </section>

        <section className="border-t border-card-border bg-[#fafbfd] py-12 sm:py-14">
          <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="skeleton h-72 rounded-2xl" />
              <div className="skeleton h-72 rounded-2xl" />
            </div>
          </div>
        </section>
      </main>
      <FooterShell />
    </>
  );
}
