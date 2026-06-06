import { Bell, BellOff } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/Button'
import type { WatchlistItem } from '@/types'

interface CommodityWatchlistProps {
  items: WatchlistItem[]
  onToggleAlert?: (id: string) => void
  compact?: boolean
}

export function CommodityWatchlist({ items, onToggleAlert, compact = false }: CommodityWatchlistProps) {
  if (compact) {
    return (
      <div className="space-y-1">
        {items.slice(0, 4).map((item) => (
          <div key={item.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface-hover">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{item.commodity}</p>
              <p className="text-[10px] text-text-secondary">Target: ${item.targetPrice}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold">${item.currentPrice}</span>
              <button onClick={() => onToggleAlert?.(item.id)} className="text-text-secondary hover:text-text-primary">
                {item.alertEnabled ? <Bell className="w-3.5 h-3.5 text-warning" /> : <BellOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <span className="text-xs text-text-secondary">{items.length} items</span>
      </CardHeader>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-surface-hover transition-colors">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">{item.commodity}</p>
              <p className="text-[10px] text-text-secondary">Target: ${item.targetPrice}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <p className="text-xs font-semibold">${item.currentPrice}</p>
                <p className="text-[10px] text-text-secondary">
                  {item.currentPrice > item.targetPrice ? 'Above' : 'Below'} target
                </p>
              </div>
              <IconButton size="sm" onClick={() => onToggleAlert?.(item.id)}>
                {item.alertEnabled ? <Bell className="w-3.5 h-3.5 text-warning" /> : <BellOff className="w-3.5 h-3.5" />}
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
