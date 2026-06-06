import { MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { StatusChip, GradeChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { TradeOpportunity } from '@/types'

interface TradeOpportunityCardProps {
  opportunity: TradeOpportunity
  onRespond?: (id: string) => void
  compact?: boolean
}

export function TradeOpportunityCard({ opportunity, onRespond, compact = false }: TradeOpportunityCardProps) {
  const { type, commodity, quantity, unit, price, totalValue, location, deliveryDate, status, trader, quality } = opportunity

  if (compact) {
    return (
      <Card padding="sm" hover>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className={`text-[10px] font-semibold uppercase ${type === 'buy' ? 'text-success' : 'text-commodity-inputs'}`}>
                {type === 'buy' ? 'Buying' : 'Selling'}
              </span>
              <span className="text-xs font-medium truncate">{commodity.name}</span>
            </div>
            <p className="text-[10px] text-text-secondary truncate">{trader.name} · {location}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold">${price}/{unit}</p>
            <p className="text-[10px] text-text-secondary">{quantity} {unit}</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${type === 'buy' ? 'bg-success/10' : 'bg-commodity-inputs/10'}`}>
            <TrendingUp className={`w-5 h-5 ${type === 'buy' ? 'text-success' : 'text-commodity-inputs'}`} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold uppercase ${type === 'buy' ? 'text-success' : 'text-commodity-inputs'}`}>
                {type === 'buy' ? 'BUY' : 'SELL'}
              </span>
              <CardTitle>{commodity.name}</CardTitle>
            </div>
            <CardSubtitle>{trader.name}</CardSubtitle>
          </div>
        </div>
        <StatusChip status={status} />
      </CardHeader>

      <div className="flex items-baseline justify-between mb-2">
        <div>
          <span className="text-base font-bold">${price}</span>
          <span className="text-xs text-text-secondary ml-1">/{unit}</span>
        </div>
        <span className="text-xs font-medium text-text-primary">{quantity.toLocaleString()} {unit}</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary mb-2">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(deliveryDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <GradeChip grade={quality} />
        <span className="text-xs text-text-secondary">Total: ${totalValue.toLocaleString()}</span>
      </div>

      <Button size="sm" fullWidth variant={opportunity.type === 'sell' ? 'primary' : 'success'} onClick={() => onRespond?.(opportunity.id)}>
        {opportunity.type === 'sell' ? 'Make Offer' : 'Respond'}
      </Button>
    </Card>
  )
}
