import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-light active:bg-primary-dark',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-hover active:bg-surface-active',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover active:bg-surface-active',
  danger: 'bg-danger text-white hover:opacity-90 active:opacity-80',
  success: 'bg-success text-white hover:opacity-90 active:opacity-80',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1',
  md: 'text-sm px-3 py-2 gap-1.5',
  lg: 'text-sm px-4 py-2.5 gap-2',
}

export function Button({
  children, variant = 'primary', size = 'md', loading = false,
  icon, fullWidth = false, disabled, className = '', ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg border border-transparent transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${variant === 'secondary' ? 'border-border' : ''} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="w-4 h-4 shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

export function IconButton({
  children, variant = 'ghost', size = 'md', className = '', ...props
}: Omit<ButtonProps, 'icon' | 'loading' | 'fullWidth'>) {
  const sizeMap = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-9 h-9' }
  return (
    <Button
      variant={variant}
      size="sm"
      className={`!p-0 ${sizeMap[size]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  )
}
