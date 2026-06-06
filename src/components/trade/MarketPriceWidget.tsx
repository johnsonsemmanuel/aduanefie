import { ArrowUp, ArrowDown, TrendingUp, Minus } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import type { MarketPrice } from '@/types'

interface MarketPriceWidgetProps {
  prices: MarketPrice[]
  compact?: boolean
}

function TrendIcon({ trend }: { trend: MarketPrice['trend'] }) {
  if (trend === 'up') return <ArrowUp className="w-3 h-3 text-success" />
  if (trend === 'down') return <ArrowDown className="w-3 h-3 text-danger" />
  return <Minus className="w-3 h-3 text-text-secondary" />
}

export function MarketPriceWidget({ prices, compact = false }: MarketPriceWidgetProps) {
  if (compact) {
    return (
      <div className="space-y-1">
        {prices.slice(0, 4).map((p) => (
          <div key={p.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface-hover">
            <div className="flex items-center gap-2 min-w-0">
              <TrendIcon trend={p.trend} />
              <span className="text-xs font-medium truncate">{p.commodity}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold">${p.current}</span>
              <span className={`text-[10px] ${p.change >= 0 ? 'text-success' : 'text-danger'}`}>
                {p.changePercent.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Prices</CardTitle>
        <TrendingUp className="w-4 h-4 text-success" />
      </CardHeader>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left font-medium text-text-secondary py-2 pr-2">Commodity</th>
              <th className="text-right font-medium text-text-secondary py-2 px-2">Price</th>
              <th className="text-right font-medium text-text-secondary py-2 px-2">Chg</th>
              <th className="text-right font-medium text-text-secondary py-2 px-2">%</th>
              <th className="text-right font-medium text-text-secondary py-2 pl-2">High</th>
              <th className="text-right font-medium text-text-secondary py-2 pl-2">Low</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-surface-hover transition-colors">
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={p.trend} />
                    <span className="font-medium truncate max-w-[120px]">{p.commodity}</span>
                  </div>
                </td>
                <td className="py-2 px-2 text-right font-semibold">${p.current}</td>
                <td className={`py-2 px-2 text-right ${p.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {p.change >= 0 ? '+' : ''}${p.change}
                </td>
                <td className={`py-2 px-2 text-right ${p.change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {p.changePercent >= 0 ? '+' : ''}{p.changePercent.toFixed(1)}%
                </td>
                <td className="py-2 pl-2 text-right">${p.high}</td>
                <td className="py-2 pl-2 text-right">${p.low}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function PriceSparkline({ change, changePercent }: { change: number; changePercent: number }) {
  const isUp = change >= 0
  return (
    <div className="flex items-center gap-1">
      {isUp ? (
        <ArrowUp className="w-3 h-3 text-success" />
      ) : (
        <ArrowDown className="w-3 h-3 text-danger" />
      )}
      <span className={`text-xs font-medium ${isUp ? 'text-success' : 'text-danger'}`}>
        {isUp ? '+' : ''}{changePercent.toFixed(1)}%
      </span>
    </div>
  )
}
