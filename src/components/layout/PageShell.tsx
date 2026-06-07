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
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-0.5 border-b border-neutral-800 pb-0 mb-4 overflow-x-auto scrollbar-none shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-neutral-50 text-neutral-50'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
