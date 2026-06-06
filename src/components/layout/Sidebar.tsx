import { NavLink } from 'react-router-dom'
import {
  ShoppingBag, Truck, Globe, User,
  BarChart3, Wallet, Command, Building2,
  ClipboardCheck, Users, Brain, Code2, Shield, LogOut
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getAllowedModules, type OSModuleId } from '@/config/permissions'

interface NavItem {
  to: string
  label: string
  icon: typeof Command
  moduleId: OSModuleId
  layer?: number
  badge?: number
}

const allNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Command Center', icon: Command, moduleId: 'dashboard', badge: 6 },
  { to: '/marketplace', label: 'Trade Engine', icon: ShoppingBag, moduleId: 'trade-engine', layer: 2, badge: 7 },
  { to: '/market-intel', label: 'Market Intel', icon: BarChart3, moduleId: 'market-intel', layer: 6 },
  { to: '/business', label: 'Business Hub', icon: Building2, moduleId: 'business', layer: 7 },
  { to: '/procurement', label: 'Procurement', icon: ClipboardCheck, moduleId: 'procurement', layer: 2 },
  { to: '/logistics', label: 'Logistics Hub', icon: Truck, moduleId: 'logistics', layer: 3, badge: 2 },
  { to: '/finance', label: 'Finance Hub', icon: Wallet, moduleId: 'finance', layer: 5 },
  { to: '/exports', label: 'Export Hub', icon: Globe, moduleId: 'export', layer: 2, badge: 4 },
  { to: '/cooperative', label: 'Cooperative', icon: Users, moduleId: 'cooperative', layer: 1 },
  { to: '/ai', label: 'AI Hub', icon: Brain, moduleId: 'ai', layer: 9 },
  { to: '/developer', label: 'Developer', icon: Code2, moduleId: 'developer', layer: 8 },
  { to: '/admin', label: 'Admin', icon: Shield, moduleId: 'admin', layer: 1 },
  { to: '/profile', label: 'Profile', icon: User, moduleId: 'profile' },
]

const roleLabels: Record<string, string> = {
  admin: 'Administrator', farmer: 'Farmer', buyer: 'Buyer',
  supplier: 'Supplier', logistics: 'Logistics', viewer: 'Viewer',
  supervisor: 'Supervisor', trader: 'Trader',
}

interface SidebarProps {
  onNav?: () => void
  className?: string
}

export function Sidebar({ onNav, className = '' }: SidebarProps) {
  const { user, logout } = useAuth()

  const allowedModules = user ? getAllowedModules(user.role) : new Set<OSModuleId>()
  const navItems = allNavItems.filter(item => allowedModules.has(item.moduleId))

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

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
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-text-primary truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-text-secondary truncate capitalize">{roleLabels[user?.role || ''] || user?.role}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-md text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors shrink-0" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
