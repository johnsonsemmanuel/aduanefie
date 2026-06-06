import { Skeleton, CardSkeleton, TableSkeleton, MetricSkeleton } from './Skeleton'

export function PageSkeleton({ type = 'dashboard' }: { type?: 'dashboard' | 'list' | 'grid' | 'table' | 'form' }) {
  if (type === 'table') return <TableSkeleton rows={8} />
  if (type === 'form') return <FormSkeleton />
  if (type === 'grid') return <GridSkeleton />
  if (type === 'list') return <ListSkeleton />

  return <DashboardSkeleton />
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 min-w-0 animate-pulse">
      <div className="space-y-2">
        <Skeleton height={24} width="40%" />
        <Skeleton height={14} width="60%" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="space-y-4 min-w-0 animate-pulse">
      <Skeleton height={24} width="30%" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function ListSkeleton() {
  return (
    <div className="space-y-4 min-w-0 animate-pulse">
      <Skeleton height={24} width="25%" />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="space-y-4 min-w-0 animate-pulse">
      <Skeleton height={24} width="20%" />
      <div className="rounded-lg border border-border bg-surface p-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton height={12} width="15%" />
            <Skeleton height={36} width="100%" />
          </div>
        ))}
        <Skeleton height={36} width={120} rounded />
      </div>
    </div>
  )
}
