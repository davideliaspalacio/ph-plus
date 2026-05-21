import Header from "./Header";
import Footer from "./Footer";

export function HeaderShell() {
  return <Header />;
}

export function FooterShell() {
  return <Footer />;
}

export function BreadcrumbSkeleton() {
  return (
    <div className="mx-auto max-w-page px-5 pt-6 sm:px-8 lg:px-12">
      <div className="skeleton h-3 w-40 rounded" />
    </div>
  );
}

export function HeadingSkeleton({
  width = "w-64",
  height = "h-8",
}: {
  width?: string;
  height?: string;
}) {
  return <div className={`skeleton rounded ${width} ${height}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-white">
      <div className="skeleton h-44 w-full sm:h-52" />
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex gap-2">
          <div className="skeleton h-4 w-16 rounded-full" />
          <div className="skeleton h-4 w-12 rounded-full" />
        </div>
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="mt-auto flex flex-col gap-2">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="skeleton h-9 w-full rounded-full" />
          <div className="skeleton mx-auto h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CartLineSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="skeleton h-24 w-24 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton mt-2 h-8 w-32 rounded-full" />
      </div>
      <div className="skeleton h-6 w-24 rounded sm:min-w-[100px]" />
    </div>
  );
}
