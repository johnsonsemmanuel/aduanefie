import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md'
  hover?: boolean
}

export function GlassCard({ children, className = '', padding = 'md', hover = false }: GlassCardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4' }
  return (
    <div
      className={`rounded-lg border border-border bg-surface ${paddings[padding]} ${
        hover ? 'hover:bg-surface-hover transition-colors cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function GlassCardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-3 ${className}`}>{children}</div>
}

export function GlassCardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-semibold text-text-primary ${className}`}>{children}</h3>
}
