import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
  hint?: string
}

export function Input({ label, error, icon, hint, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-text-secondary">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary">
            {icon}
          </span>
        )}
        <input
          className={`w-full h-9 rounded-lg border bg-surface text-sm text-text-primary placeholder:text-text-secondary/50 px-3 transition-colors focus:border-primary focus:outline-none ${icon ? 'pl-8' : ''} ${error ? 'border-danger' : 'border-border'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
    </div>
  )
}

interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ label, error, options, placeholder, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-text-secondary">{label}</label>}
      <select
        className={`w-full h-9 rounded-lg border border-border bg-surface text-sm text-text-primary px-3 transition-colors focus:border-primary focus:outline-none ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export function SearchInput({ onClear, className = '', ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        className={`w-full h-9 rounded-lg border border-border bg-surface text-sm text-text-primary pl-8 pr-8 transition-colors focus:border-primary focus:outline-none ${className}`}
        {...props}
      />
      {props.value && onClear && (
        <button onClick={onClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
