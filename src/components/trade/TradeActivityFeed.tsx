import { ShoppingCart, Package, Truck, CreditCard, AlertTriangle, MessageSquare } from 'lucide-react'
import type { Activity } from '@/types'

interface TradeActivityFeedProps {
  activities: Activity[]
  compact?: boolean
}

const activityIcons = {
  trade: ShoppingCart,
  order: Package,
  logistics: Truck,
  payment: CreditCard,
  alert: AlertTriangle,
  message: MessageSquare,
}

const activityColors = {
  trade: 'text-commodity-export',
  order: 'text-primary',
  logistics: 'text-commodity-inputs',
  payment: 'text-success',
  alert: 'text-warning',
  message: 'text-commodity-export',
}

export function TradeActivityFeed({ activities, compact = false }: TradeActivityFeedProps) {
  const items = compact ? activities.slice(0, 5) : activities

  return (
    <div className="space-y-1">
      {items.map((activity) => {
        const Icon = activityIcons[activity.type]
        const color = activityColors[activity.type]
        const timeAgo = getTimeAgo(activity.timestamp)

        return (
          <div key={activity.id} className="flex items-start gap-2.5 py-2.5 px-2 rounded-lg hover:bg-surface-hover transition-colors">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-surface border border-border ${color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-primary">{activity.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-text-secondary">{timeAgo}</span>
                {activity.status && (
                  <span className={`text-[10px] font-medium ${
                    activity.status === 'completed' || activity.status === 'info' ? 'text-success' :
                    activity.status === 'warning' ? 'text-warning' : 'text-text-secondary'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getTimeAgo(timestamp: string): string {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
