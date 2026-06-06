import { AlertTriangle, Info, AlertCircle, X } from 'lucide-react'
import type { MarketAlert as MarketAlertType } from '@/types'

interface MarketAlertProps {
  alert: MarketAlertType
  onDismiss?: (id: string) => void
}

const severityConfig = {
  critical: { icon: AlertCircle, bg: 'bg-danger/5', border: 'border-danger/20', text: 'text-danger' },
  warning: { icon: AlertTriangle, bg: 'bg-warning/5', border: 'border-warning/20', text: 'text-warning' },
  info: { icon: Info, bg: 'bg-commodity-inputs/5', border: 'border-commodity-inputs/20', text: 'text-commodity-inputs' },
}

export function MarketAlert({ alert, onDismiss }: MarketAlertProps) {
  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${config.bg} ${config.border} ${!alert.read ? 'ring-1 ring-primary/5' : ''}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.text}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-xs font-semibold text-text-primary">{alert.commodity}</span>
          <span className={`text-[10px] font-medium ${config.text}`}>
            {alert.type.replace(/_/g, ' ')}
          </span>
        </div>
        <p className="text-xs text-text-secondary">{alert.message}</p>
        <p className="text-[10px] text-text-secondary mt-1">
          {new Date(alert.timestamp).toLocaleString()}
        </p>
      </div>
      {onDismiss && (
        <button onClick={() => onDismiss(alert.id)} className="text-text-secondary hover:text-text-primary shrink-0 mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
