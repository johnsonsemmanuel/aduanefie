import { Plus, ShoppingCart, Truck, Globe, Warehouse, TrendingUp } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: typeof Plus
  color: string
  bgColor: string
  description: string
}

const actions: QuickAction[] = [
  { id: 'sell', label: 'Sell Commodity', icon: TrendingUp, color: 'text-success', bgColor: 'bg-success/10', description: 'List what you have' },
  { id: 'buy', label: 'Buy Request', icon: ShoppingCart, color: 'text-commodity-export', bgColor: 'bg-commodity-export/10', description: 'Find what you need' },
  { id: 'logistics', label: 'Book Transport', icon: Truck, color: 'text-commodity-inputs', bgColor: 'bg-commodity-inputs/10', description: 'Move your goods' },
  { id: 'export', label: 'Export Opportunity', icon: Globe, color: 'text-danger', bgColor: 'bg-danger/10', description: 'Go global' },
  { id: 'warehouse', label: 'Rent Storage', icon: Warehouse, color: 'text-warning', bgColor: 'bg-warning/10', description: 'Store safely' },
]

interface QuickActionPanelProps {
  onAction?: (id: string) => void
}

export function QuickActionPanel({ onAction }: QuickActionPanelProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={() => onAction?.(action.id)}
            className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover active:bg-surface-active transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg ${action.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${action.color}`} />
            </div>
            <span className="text-[10px] font-medium text-text-primary text-center leading-tight">{action.label}</span>
          </button>
        )
      })}
    </div>
  )
}
