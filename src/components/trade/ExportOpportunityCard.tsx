import { Globe, MapPin, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { StatusChip, GradeChip, Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { ExportOpportunity } from '@/types'

interface ExportOpportunityCardProps {
  opportunity: ExportOpportunity
  onBid?: (id: string) => void
}

export function ExportOpportunityCard({ opportunity, onBid }: ExportOpportunityCardProps) {
  const { commodity, quantity, unit, price, totalValue, origin, destination, incoterm, quality, certification, buyer } = opportunity

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-commodity-export/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-commodity-export" />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate">{commodity}</CardTitle>
            <CardSubtitle>{buyer.name} · {incoterm}</CardSubtitle>
          </div>
        </div>
        <StatusChip status={opportunity.status} />
      </CardHeader>

      <div className="flex items-baseline justify-between mb-3">
        <div>
          <span className="text-base font-bold">${price}</span>
          <span className="text-xs text-text-secondary ml-1">/{unit}</span>
        </div>
        <span className="text-xs text-text-secondary">{quantity.toLocaleString()} {unit}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3">
        <div className="text-center">
          <p className="text-[10px] text-text-secondary">Origin</p>
          <p className="text-xs font-medium">{origin}</p>
        </div>
        <div className="flex items-center gap-1 text-text-secondary">
          <div className="w-6 h-px bg-border" />
          <MapPin className="w-3 h-3" />
          <div className="w-6 h-px bg-border" />
        </div>
        <div className="text-center">
          <p className="text-[10px] text-text-secondary">Destination</p>
          <p className="text-xs font-medium">{destination}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <GradeChip grade={quality} />
        <Chip variant="info">{incoterm}</Chip>
      </div>

      {certification.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {certification.map((cert) => (
            <Chip key={cert} variant="success" icon={<Award className="w-3 h-3" />}>
              {cert}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-primary">Total: ${totalValue.toLocaleString()}</span>
        <Button size="sm" onClick={() => onBid?.(opportunity.id)}>Submit Bid</Button>
      </div>
    </Card>
  )
}
