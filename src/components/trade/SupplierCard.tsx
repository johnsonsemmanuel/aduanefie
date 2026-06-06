import { Star, ShieldCheck, Package } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import type { Supplier } from '@/types'

interface SupplierCardProps {
  supplier: Supplier
  onContact?: (id: string) => void
}

export function SupplierCard({ supplier, onContact }: SupplierCardProps) {
  const { name, location, rating, totalDeals, verified, commodities, minOrder, responseTime } = supplier

  return (
    <Card hover>
      <CardHeader>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <CardTitle className="truncate">{name}</CardTitle>
              {verified && <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />}
            </div>
            <CardSubtitle>{location}</CardSubtitle>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Star className="w-3 h-3 text-warning fill-warning" />
          <span className="text-xs font-medium">{rating}</span>
        </div>
      </CardHeader>

      <div className="flex flex-wrap gap-1 mb-2">
        {commodities.slice(0, 3).map((c) => (
          <Chip key={c} size="sm">{c}</Chip>
        ))}
        {commodities.length > 3 && (
          <Chip size="sm">+{commodities.length - 3}</Chip>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-[10px] text-text-secondary">Deals</p>
          <p className="text-xs font-medium">{totalDeals}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Min Order</p>
          <p className="text-xs font-medium">{minOrder}t</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Response</p>
          <p className="text-xs font-medium">{responseTime}</p>
        </div>
      </div>

      <Button size="sm" fullWidth variant="secondary" onClick={() => onContact?.(supplier.id)}>
        Contact Supplier
      </Button>
    </Card>
  )
}
