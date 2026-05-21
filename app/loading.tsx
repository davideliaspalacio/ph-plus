function HeaderSkeleton() {
  return (
    <header className="w-full bg-brand">
      <div className="mx-auto flex h-[64px] max-w-page items-center gap-4 px-4 sm:h-[70px] sm:px-6 lg:gap-10 lg:px-10">
        <div className="skeleton h-8 w-32 rounded sm:h-10 sm:w-40" />
        <div className="hidden gap-6 lg:flex">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-3 w-20 rounded bg-white/30" />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <div className="skeleton h-6 w-7 rounded bg-white/30" />
          <div className="skeleton h-10 w-10 rounded-full sm:h-11 sm:w-11" />
        </div>
      </div>
    </header>
  );
}

function HeroSkeleton() {
  return (
    <section className="w-full bg-brand">
      <div className="mx-auto max-w-page">
        <div className="relative h-[440px] w-full overflow-hidden sm:h-[500px] lg:h-[560px]">
          <div className="skeleton absolute inset-0 opacity-60" />
          <div className="absolute inset-0 flex items-center px-5 sm:px-8 lg:px-12">
            <div className="flex w-full max-w-[600px] flex-col gap-4">
              <div className="skeleton h-7 w-3/4 rounded bg-white/40" />
              <div className="skeleton h-7 w-2/3 rounded bg-white/40" />
              <div className="mt-4 flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-3 w-2/3 rounded bg-white/30"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-dark">
          <div className="mx-auto grid max-w-page grid-cols-1 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 px-4 py-6 sm:flex-row sm:py-8"
              >
                <div className="skeleton h-8 w-16 rounded bg-white/25" />
                <div className="skeleton h-4 w-40 rounded bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitleSkeleton() {
  return <div className="skeleton mx-auto h-7 w-64 rounded" />;
}

function WhySkeleton() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <SectionTitleSkeleton />
        <div className="mx-auto mt-10 grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-card-border p-4"
            >
              <div className="skeleton h-12 w-12 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSkeleton() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <SectionTitleSkeleton />
        <div className="mx-auto mt-3 h-4 w-56 rounded skeleton" />

        <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className="skeleton h-48 w-32 rounded-2xl sm:h-52" />
              <div className="skeleton h-6 w-24 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton mt-2 h-10 w-36 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSkeleton() {
  return (
    <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-page px-5 sm:px-8 lg:px-12">
        <SectionTitleSkeleton />
        <div className="mx-auto mt-10 flex max-w-[980px] flex-col items-center gap-6 lg:flex-row">
          <div className="skeleton h-56 w-44 rounded-[40%] sm:h-64 lg:h-72" />
          <div className="skeleton h-44 w-full flex-1 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

function FooterSkeleton() {
  return (
    <footer className="w-full bg-brand">
      <div className="mx-auto grid max-w-page grid-cols-1 gap-10 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((__, j) => (
              <div
                key={j}
                className="skeleton h-3 rounded bg-white/30"
                style={{ width: `${60 + ((j * 17) % 40)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando...</span>
      <HeaderSkeleton />
      <main className="flex-1">
        <HeroSkeleton />
        <WhySkeleton />
        <ProductsSkeleton />
        <TestimonialSkeleton />
      </main>
      <FooterSkeleton />
    </div>
  );
}
