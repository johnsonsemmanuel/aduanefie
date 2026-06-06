import { CheckCircle, Package, Truck, ClipboardCheck } from 'lucide-react'
import type { Order } from '@/types'

interface OrderTimelineProps {
  order: Order
}

const steps = [
  { key: 'pending', label: 'Order Placed', icon: ClipboardCheck },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

const statusIndex: Record<string, number> = {
  pending: 0,
  processing: 1,
  shipped: 2,
  in_transit: 3,
  delivered: 4,
  completed: 4,
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentIdx = statusIndex[order.status] ?? 0

  return (
    <div className="space-y-1">
      {steps.slice(0, currentIdx + 1).map((step, idx) => {
        const Icon = step.icon
        const isActive = idx === currentIdx
        const isComplete = idx < currentIdx

        return (
          <div key={step.key} className="flex items-start gap-2.5">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                isComplete ? 'bg-success/10 text-success' :
                isActive ? 'bg-primary/10 text-primary' : 'bg-border/50 text-text-secondary'
              }`}>
                {isComplete ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-px h-5 ${isComplete ? 'bg-success/30' : 'bg-border'}`} />
              )}
            </div>
            <div className="pb-3">
              <p className={`text-xs font-medium ${
                isActive ? 'text-text-primary' : isComplete ? 'text-text-secondary' : 'text-text-secondary/50'
              }`}>
                {step.label}
              </p>
              {isActive && order.tracking.length > 0 && (
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {order.tracking[currentIdx]}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
