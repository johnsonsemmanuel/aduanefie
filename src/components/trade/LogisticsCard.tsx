import { MapPin, Truck, Ship, Train, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { Logistics } from '@/types'

interface LogisticsCardProps {
  logistics: Logistics
  onTrack?: (id: string) => void
}

const typeIcons = {
  truck: Truck,
  train: Train,
  ship: Ship,
  storage: Package,
}

export function LogisticsCard({ logistics, onTrack }: LogisticsCardProps) {
  const { provider, type, origin, destination, departureDate, arrivalDate, capacity, usedCapacity, rate, status, trackingId } = logistics
  const TypeIcon = typeIcons[type]
  const fill = usedCapacity / capacity

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-commodity-inputs/10 flex items-center justify-center shrink-0">
            <TypeIcon className="w-5 h-5 text-commodity-inputs" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <CardTitle className="truncate">{provider}</CardTitle>
              <span className="text-[10px] text-text-secondary font-mono">{trackingId}</span>
            </div>
            <p className="text-[10px] text-text-secondary uppercase font-medium">{type}</p>
          </div>
        </div>
        <StatusChip status={status} />
      </CardHeader>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{origin}</p>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <div className="w-8 h-px bg-border" />
          <MapPin className="w-3 h-3" />
          <div className="w-8 h-px bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
        <div className="min-w-0 text-right">
          <p className="text-xs font-medium truncate">{destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <p className="text-[10px] text-text-secondary">Departure</p>
          <p className="text-[11px] font-medium">{new Date(departureDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Arrival</p>
          <p className="text-[11px] font-medium">{new Date(arrivalDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Rate</p>
          <p className="text-[11px] font-medium">${rate.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-text-secondary mb-1">
          <span>Capacity</span>
          <span>{usedCapacity}/{capacity} t ({Math.round(fill * 100)}%)</span>
        </div>
        <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-commodity-inputs" style={{ width: `${fill * 100}%` }} />
        </div>
      </div>

      <Button size="sm" fullWidth variant="secondary" onClick={() => onTrack?.(logistics.id)}>
        Track Shipment
      </Button>
    </Card>
  )
}
