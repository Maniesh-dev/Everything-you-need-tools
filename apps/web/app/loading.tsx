import { Skeleton } from "@workspace/ui/components/skeleton";
import { Separator } from "@workspace/ui/components/separator";

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-6 w-48 rounded-full" />
          </div>
          <Skeleton className="mx-auto h-12 w-3/4 rounded-lg" />
          <Skeleton className="mx-auto mt-4 h-12 w-1/2 rounded-lg" />
          <Skeleton className="mx-auto mt-6 h-5 w-2/3 rounded" />
          <Skeleton className="mx-auto mt-2 h-5 w-1/2 rounded" />
          <div className="mx-auto mt-10 max-w-xl">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <div className="mx-auto mt-10 flex justify-center gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Category grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto h-8 w-64 rounded" />
          <Skeleton className="mx-auto mt-3 h-4 w-80 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-5">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="size-10 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
