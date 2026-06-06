import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, TrendingUp, Truck, Globe, User,
  Bell
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { to: '/trade-desk', label: 'Trade Desk', icon: TrendingUp },
  { to: '/logistics', label: 'Logistics', icon: Truck },
  { to: '/exports', label: 'Exports', icon: Globe },
  { to: '/profile', label: 'Profile', icon: User },
]

interface SidebarProps {
  onNav?: () => void
  className?: string
}

export function Sidebar({ onNav, className = '' }: SidebarProps) {
  return (
    <aside className={`w-56 border-r border-border bg-surface flex flex-col shrink-0 ${className}`}>
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-cream" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-text-primary leading-tight">Aduanefie</p>
          <p className="text-[9px] text-text-secondary font-medium uppercase tracking-wider">Trade Engine</p>
        </div>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNav}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
            EJ
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">Emmanuel</p>
            <p className="text-[10px] text-text-secondary truncate">Kumasi, Ghana</p>
          </div>
          <Bell className="w-4 h-4 text-text-secondary shrink-0 ml-auto" />
        </div>
      </div>
    </aside>
  )
}
