import { MapPin, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { BuyerRequest } from '@/types'

interface BuyerRequestCardProps {
  request: BuyerRequest
  onRespond?: (id: string) => void
}

export function BuyerRequestCard({ request, onRespond }: BuyerRequestCardProps) {
  const { commodity, quantity, unit, targetPrice, maxPrice, location, deadline, status, responses, buyer } = request

  return (
    <Card hover>
      <CardHeader>
        <div>
          <CardTitle>{commodity}</CardTitle>
          <CardSubtitle>{buyer.name}</CardSubtitle>
        </div>
        <StatusChip status={status} />
      </CardHeader>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-text-secondary">Quantity</p>
          <p className="text-xs font-semibold">{quantity.toLocaleString()} {unit}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Target Price</p>
          <p className="text-xs font-semibold">${targetPrice}/{unit}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Max Price</p>
          <p className="text-xs font-semibold">${maxPrice}/{unit}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Responses</p>
          <p className="text-xs font-semibold">{responses}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-text-secondary mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(deadline).toLocaleDateString()}
        </span>
      </div>

      <Button size="sm" fullWidth variant="success" onClick={() => onRespond?.(request.id)}>
        Make Offer
      </Button>
    </Card>
  )
}
