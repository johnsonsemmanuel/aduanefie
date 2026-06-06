import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, TrendingUp, Truck, Globe } from 'lucide-react'

const mobileNavItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/marketplace', label: 'Market', icon: ShoppingBag },
  { to: '/trade-desk', label: 'Trade', icon: TrendingUp },
  { to: '/logistics', label: 'Ship', icon: Truck },
  { to: '/more', label: 'More', icon: Globe },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
      <div className="flex items-center justify-around h-14">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
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
