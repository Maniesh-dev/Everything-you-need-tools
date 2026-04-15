import { Skeleton } from "@workspace/ui/components/skeleton";
import { Separator } from "@workspace/ui/components/separator";

export default function ToolLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        {/* Main content skeleton */}
        <div>
          <div className="mb-8 flex items-start gap-4">
            <Skeleton className="size-12 rounded" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-2 h-4 w-full max-w-md" />
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Tool area skeleton */}
          <div className="rounded-lg border border-border p-8">
            <div className="flex flex-col items-center gap-4 py-16">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div>
          <Skeleton className="h-4 w-28 mb-4" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
