import type { ReactNode } from 'react'

type PillVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium'

interface PillProps {
  children: ReactNode
  variant?: PillVariant
  className?: string
}

const variantStyles: Record<PillVariant, string> = {
  default: 'bg-surface-hover text-text-secondary border-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-commodity-inputs/10 text-commodity-inputs border-commodity-inputs/20',
  premium: 'bg-commodity-export/10 text-commodity-export border-commodity-export/20',
}

export function Pill({ children, variant = 'default', className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function StatusPill({ status }: { status: string }) {
  const variantMap: Record<string, PillVariant> = {
    open: 'success',
    active: 'success',
    completed: 'success',
    delivered: 'success',
    confirmed: 'info',
    negotiating: 'warning',
    processing: 'warning',
    pending: 'default',
    in_transit: 'info',
    cancelled: 'danger',
    expired: 'danger',
    filled: 'info',
    dispatched: 'info',
  }
  return (
    <Pill variant={variantMap[status] || 'default'}>
      {status.replace(/_/g, ' ')}
    </Pill>
  )
}
