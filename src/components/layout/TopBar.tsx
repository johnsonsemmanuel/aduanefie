import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <header className="h-14 border-b border-neutral-800 bg-black flex items-center gap-3 px-3 shrink-0">
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 text-neutral-400 shrink-0"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-bold text-neutral-50">Aduanefie</span>
        <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider hidden sm:inline">AgriOS</span>
      </div>

      <div className="flex-1 flex justify-center px-2">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search commodities, traders..."
            className="w-full h-8 rounded-lg border border-neutral-800 bg-black text-xs text-neutral-50 placeholder:text-neutral-400 pl-8 pr-3 focus:border-neutral-600 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => navigate('/notifications')} className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 text-neutral-400">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-50 shrink-0">
          {initials}
        </div>
      </div>
    </header>
  )
}
