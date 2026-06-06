import { ArrowUp, ArrowDown, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { GradeChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { Commodity } from '@/types'

interface CommodityCardProps {
  commodity: Commodity
  onTrade?: (id: string) => void
  compact?: boolean
}

export function CommodityCard({ commodity, onTrade, compact = false }: CommodityCardProps) {
  const TrendIcon = commodity.priceChange >= 0 ? ArrowUp : ArrowDown
  const trendColor = commodity.priceChange >= 0 ? 'text-success' : 'text-danger'

  if (compact) {
    return (
      <Card padding="sm" hover>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{commodity.name}</p>
              <p className="text-[10px] text-text-secondary truncate">{commodity.origin}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold">${commodity.price}</p>
            <span className={`inline-flex items-center gap-0.5 text-[10px] ${trendColor}`}>
              <TrendIcon className="w-2.5 h-2.5" />
              {commodity.priceChangePercent}%
            </span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{commodity.name}</CardTitle>
            <CardSubtitle>{commodity.origin}</CardSubtitle>
          </div>
        </div>
        <GradeChip grade={commodity.grade} />
      </CardHeader>
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-lg font-bold text-text-primary">${commodity.price}</span>
          <span className="text-xs text-text-secondary ml-1">/{commodity.unit}</span>
        </div>
        <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          {commodity.priceChangePercent}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-text-secondary">Volume</p>
          <p className="text-xs font-medium">{commodity.volume.toLocaleString()} {commodity.unit}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Stock</p>
          <p className="text-xs font-medium">{commodity.stock.toLocaleString()} {commodity.unit}</p>
        </div>
      </div>
      <Button size="sm" fullWidth onClick={() => onTrade?.(commodity.id)}>
        Trade Now
      </Button>
    </Card>
  )
}
