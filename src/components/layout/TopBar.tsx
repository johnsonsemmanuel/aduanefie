import { Bell, Search, TrendingUp } from 'lucide-react'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center gap-3 px-3 shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-cream" />
        </div>
        <span className="text-sm font-bold text-text-primary hidden sm:inline">Aduanefie</span>
      </div>

      <div className="flex-1 flex justify-center px-2">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="search"
            placeholder="Search commodities, traders..."
            className="w-full h-8 rounded-lg border border-border bg-bg text-xs text-text-primary pl-8 pr-3 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
        </button>

        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
          EJ
        </div>
      </div>
    </header>
  )
}
