import { NavLink } from 'react-router-dom'
import {
  ShoppingBag, Truck, Globe, User,
  Bell, BarChart3, Wallet, Command, Building2,
  ClipboardCheck, Users, Brain, Code2, Shield
} from 'lucide-react'

interface NavItem {
  to: string
  label: string
  icon: typeof Command
  layer?: number
  badge?: number
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Command Center', icon: Command, badge: 6 },
  { to: '/marketplace', label: 'Trade Engine', icon: ShoppingBag, layer: 2, badge: 7 },
  { to: '/market-intel', label: 'Market Intel', icon: BarChart3, layer: 6 },
  { to: '/business', label: 'Business Hub', icon: Building2, layer: 7 },
  { to: '/procurement', label: 'Procurement', icon: ClipboardCheck, layer: 2 },
  { to: '/logistics', label: 'Logistics Hub', icon: Truck, layer: 3, badge: 2 },
  { to: '/finance', label: 'Finance Hub', icon: Wallet, layer: 5 },
  { to: '/exports', label: 'Export Hub', icon: Globe, layer: 2, badge: 4 },
  { to: '/cooperative', label: 'Cooperative', icon: Users, layer: 1 },
  { to: '/ai', label: 'AI Hub', icon: Brain, layer: 9 },
  { to: '/developer', label: 'Developer', icon: Code2, layer: 8 },
  { to: '/admin', label: 'Admin', icon: Shield, layer: 1 },
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
          <Command className="w-4 h-4 text-cream" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-text-primary leading-tight">Aduanefie</p>
          <p className="text-[9px] text-text-secondary font-medium uppercase tracking-wider">AgriOS</p>
        </div>
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
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
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="text-[9px] font-mono bg-primary/10 text-primary rounded px-1 font-medium shrink-0"> {item.badge}</span>
            )}
            {item.layer && (
              <span className="text-[9px] text-text-secondary font-mono shrink-0">L{item.layer}</span>
            )}
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
            <p className="text-[10px] text-text-secondary truncate">Farmer · Kumasi, GH</p>
          </div>
          <Bell className="w-4 h-4 text-text-secondary shrink-0 ml-auto" />
        </div>
      </div>
    </aside>
  )
}
