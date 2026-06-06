import { Thermometer, Package, Warehouse as WarehouseIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { Warehouse } from '@/types'

interface WarehouseCardProps {
  warehouse: Warehouse
  onBook?: (id: string) => void
}

const typeIcons = {
  dry: Package,
  cold: Thermometer,
  general: WarehouseIcon,
}

export function WarehouseCard({ warehouse, onBook }: WarehouseCardProps) {
  const { name, location, capacity, used, available, type, dailyRate, certifications } = warehouse
  const utilization = (used / capacity) * 100
  const TypeIcon = typeIcons[type]

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            type === 'cold' ? 'bg-commodity-inputs/10' : 'bg-primary/5'
          }`}>
            <TypeIcon className={`w-5 h-5 ${type === 'cold' ? 'text-commodity-inputs' : 'text-primary'}`} />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{name}</CardTitle>
            <CardSubtitle>{location}</CardSubtitle>
          </div>
        </div>
        <Chip variant={type === 'cold' ? 'info' : 'default'}>{type}</Chip>
      </CardHeader>

      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-text-secondary">Capacity</span>
          <span className="font-medium">{used.toLocaleString()} / {capacity.toLocaleString()} t</span>
        </div>
        <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              utilization > 85 ? 'bg-danger' : utilization > 70 ? 'bg-warning' : 'bg-success'
            }`}
            style={{ width: `${utilization}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <p className="text-[10px] text-text-secondary">Available</p>
          <p className="text-xs font-medium">{available.toLocaleString()} t</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Daily Rate</p>
          <p className="text-xs font-medium">${dailyRate}/t</p>
        </div>
      </div>

      {certifications.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {certifications.map((cert) => (
            <Chip key={cert} variant="success">{cert}</Chip>
          ))}
        </div>
      )}

      <Button size="sm" fullWidth variant="secondary" onClick={() => onBook?.(warehouse.id)}>
        Book Space
      </Button>
    </Card>
  )
}
