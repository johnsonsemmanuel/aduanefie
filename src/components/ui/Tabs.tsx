import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  count?: number
  icon?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  activeId?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeId, onChange, className = '' }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id)
  const active = activeId ?? internalActive

  const handleChange = (id: string) => {
    setInternalActive(id)
    onChange?.(id)
  }

  return (
    <div className={`flex border-b border-border overflow-x-auto scrollbar-thin ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
            active === tab.id
              ? 'border-primary text-text-primary'
              : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
          }`}
        >
          {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className="text-[10px] bg-border/50 rounded px-1">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
