// components/ui/Skeleton.tsx
import { cx } from '@/utils';

interface SkeletonProps { className?: string; }

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cx('skeleton', className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-40" />
        </div>
        <Skeleton className="h-12 w-12 rounded-2xl" />
      </div>
      {/* Status card */}
      <Skeleton className="h-28 w-full rounded-3xl" />
      {/* Check-in button */}
      <Skeleton className="h-16 w-full rounded-2xl" />
      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="relative w-full h-full animate-fade-in">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-x-4 bottom-8 space-y-3">
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-14 rounded-2xl" />
      </div>
    </div>
  );
}
