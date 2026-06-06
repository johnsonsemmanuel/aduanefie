import { ArrowUp, ArrowDown } from 'lucide-react'
import type { MarketTicker } from '@/types'

interface TickerTapeProps {
  tickers: MarketTicker[]
}

export function TickerTape({ tickers }: TickerTapeProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex overflow-x-auto scrollbar-thin py-1.5 px-1 gap-1">
        {tickers.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg shrink-0"
          >
            <span className="text-xs font-medium text-text-primary whitespace-nowrap">{t.commodity}</span>
            <span className="text-xs font-semibold text-text-primary font-mono">${t.price.toLocaleString()}</span>
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${t.trend === 'up' ? 'text-success' : 'text-danger'}`}>
              {t.trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
              {Math.abs(t.changePercent).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TopMoversBar({ movers }: { movers: { commodity: string; changePercent: number; trend: 'up' | 'down' }[] }) {
  const sorted = [...movers].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {sorted.slice(0, 4).map((m) => (
        <div key={m.commodity} className="rounded-lg border border-border bg-surface p-2.5 flex items-center justify-between">
          <span className="text-xs font-medium text-text-primary truncate">{m.commodity}</span>
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${m.trend === 'up' ? 'text-success' : 'text-danger'}`}>
            {m.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(m.changePercent).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  )
}
