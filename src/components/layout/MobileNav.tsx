import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, TrendingUp, Truck, Globe } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getAllowedModules, type OSModuleId } from '@/config/permissions'

interface MobileNavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  moduleId: OSModuleId
}

const allMobileNavItems: MobileNavItem[] = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard, moduleId: 'dashboard' },
  { to: '/marketplace', label: 'Market', icon: ShoppingBag, moduleId: 'trade-engine' },
  { to: '/trade-desk', label: 'Trade', icon: TrendingUp, moduleId: 'trade-engine' },
  { to: '/logistics', label: 'Ship', icon: Truck, moduleId: 'logistics' },
  { to: '/more', label: 'More', icon: Globe, moduleId: 'profile' },
]

export function MobileNav() {
  const { user } = useAuth()
  const allowedModules = user ? getAllowedModules(user.role) : new Set<OSModuleId>()
  const visibleItems = allMobileNavItems.filter(item => allowedModules.has(item.moduleId))

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe lg:hidden">
      <div className="flex items-center justify-around h-14">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                isActive ? 'text-primary' : 'text-text-secondary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
