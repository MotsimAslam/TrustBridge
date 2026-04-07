import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <LoadingSkeleton />
    </div>
  );
}
