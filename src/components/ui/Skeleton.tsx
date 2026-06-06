import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export function Skeleton({ width, height, rounded = true, className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-border ${rounded ? 'rounded-lg' : 'rounded-none'} ${className}`}
      style={{ width, height }}
      {...props}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
      <Skeleton height={16} width="60%" />
      <Skeleton height={12} width="80%" />
      <Skeleton height={12} width="40%" />
      <div className="flex gap-2 pt-2">
        <Skeleton height={28} width={60} rounded />
        <Skeleton height={28} width={80} rounded />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 pb-2">
        {[40, 30, 20, 15, 15].map((w, i) => (
          <Skeleton key={i} height={14} width={`${w}%`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {[40, 30, 20, 15, 15].map((w, j) => (
            <Skeleton key={j} height={14} width={`${w}%`} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function MetricSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-surface p-3 space-y-2">
      <Skeleton height={11} width="50%" />
      <Skeleton height={22} width="70%" />
      <Skeleton height={10} width="30%" />
    </div>
  )
}
