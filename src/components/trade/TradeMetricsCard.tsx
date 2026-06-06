import { ArrowUp, ArrowDown } from 'lucide-react'
import type { TradeMetric } from '@/types'

interface TradeMetricsCardProps {
  metric: TradeMetric
}

export function TradeMetricsCard({ metric }: TradeMetricsCardProps) {
  const { label, value, change, trend } = metric

  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-[11px] text-text-secondary mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-text-primary">{value}</span>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  )
}
