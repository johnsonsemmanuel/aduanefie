import { useState } from 'react'

export interface PageTab {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

interface PageShellProps {
  tabs: PageTab[]
  activeTab: string
  onTabChange: (tab: string) => void
  children: React.ReactNode
}

export function PageShell({ tabs, activeTab, onTabChange, children }: PageShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex gap-0 h-full">
      {/* Page sub-nav rail */}
      <aside className={`flex flex-col gap-1 shrink-0 transition-all duration-300 ${collapsed ? 'w-14' : 'w-14'}`}>
        <nav className="flex flex-col gap-1 items-center pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center justify-center rounded-lg size-10 transition-colors ${
                  isActive
                    ? 'bg-neutral-800 text-neutral-50'
                    : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50'
                }`}
                title={tab.label}
              >
                <Icon className="size-4" />
              </button>
            )
          })}
        </nav>
        <div className="flex-1" />
        <button
          onClick={() => setCollapsed(s => !s)}
          className="flex items-center justify-center rounded-lg size-10 transition-colors text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg className={`size-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>

      {/* Content panel */}
      <div className="flex-1 min-w-0 pl-4">
        {children}
      </div>
    </div>
  )
}
