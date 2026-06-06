import type { ReactNode } from 'react'

type ChipVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium'
type ChipSize = 'sm' | 'md'

interface ChipProps {
  children: ReactNode
  variant?: ChipVariant
  size?: ChipSize
  icon?: ReactNode
  className?: string
}

const variantStyles: Record<ChipVariant, string> = {
  default: 'bg-border/50 text-text-primary border-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-commodity-inputs/10 text-commodity-inputs border-commodity-inputs/20',
  premium: 'bg-commodity-export/10 text-commodity-export border-commodity-export/20',
}

const sizeStyles: Record<ChipSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-1',
}

export function Chip({ children, variant = 'default', size = 'sm', icon, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  )
}

export function GradeChip({ grade }: { grade: string }) {
  const variant = grade === 'Premium' ? 'premium' : grade === 'A' ? 'success' : grade === 'B' ? 'warning' : 'default'
  return <Chip variant={variant}>{grade}</Chip>
}

export function StatusChip({ status }: { status: string }) {
  const variantMap: Record<string, ChipVariant> = {
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
    <Chip variant={variantMap[status] || 'default'} size="sm">
      {status.replace(/_/g, ' ')}
    </Chip>
  )
}
