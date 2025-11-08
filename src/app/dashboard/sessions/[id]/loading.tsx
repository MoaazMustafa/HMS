import { Skeleton } from '@/components/ui/skeleton';

export default function SessionDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );
}
