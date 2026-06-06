import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md'
  hover?: boolean
  active?: boolean
}

export function Card({ children, padding = 'md', hover = false, active = false, className = '', ...props }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-4' }
  return (
    <div
      className={`rounded-lg border border-border bg-surface ${paddings[padding]} ${hover ? 'hover:bg-surface-hover hover:border-primary/20 transition-colors cursor-pointer' : ''} ${active ? 'border-primary/30 bg-surface-active' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between mb-3 ${className}`}>{children}</div>
}

export function CardTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-sm font-semibold text-text-primary ${className}`}>{children}</h3>
}

export function CardSubtitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs text-text-secondary ${className}`}>{children}</p>
}
