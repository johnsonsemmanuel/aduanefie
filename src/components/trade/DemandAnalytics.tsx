import type { DemandData } from '@/types'

interface DemandAnalyticsProps {
  data: DemandData[]
}

export function DemandAnalytics({ data }: DemandAnalyticsProps) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.commodity} className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-text-primary">{d.commodity}</h3>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              d.urgency === 'high' ? 'bg-danger/10 text-danger' :
              d.urgency === 'medium' ? 'bg-warning/10 text-warning' :
              'bg-border/50 text-text-secondary'
            }`}>
              {d.urgency === 'high' ? 'Urgent' : d.urgency === 'medium' ? 'Moderate' : 'Standard'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <p className="text-[10px] text-text-secondary">Buyers</p>
              <p className="text-xs font-semibold">{d.buyerCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Demand</p>
              <p className="text-xs font-semibold">{d.totalDemand.toLocaleString()} {d.unit}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Fill Rate</p>
              <p className="text-xs font-semibold">{d.fillRate}%</p>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-[10px] text-text-secondary mb-1">
              <span>Supply Gap</span>
              <span>{100 - d.fillRate}% unfilled</span>
            </div>
            <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${d.fillRate > 80 ? 'bg-success' : d.fillRate > 50 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${d.fillRate}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] text-text-secondary mb-1">Top Buyers</p>
            <div className="space-y-1">
              {d.topBuyers.map((buyer) => (
                <div key={buyer.name} className="flex items-center justify-between text-[10px]">
                  <span className="text-text-primary truncate">{buyer.name}</span>
                  <span className="text-text-secondary font-mono">{buyer.volume.toLocaleString()} {d.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
