import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, BarChart3, Building2, ClipboardCheck,
  Truck, Wallet, Globe, Users, Brain, Code2, Shield, User, Grid,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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
  { to: '/trade-desk', label: 'Trade', icon: BarChart3, moduleId: 'trade-engine' },
  { to: '/market-intel', label: 'Intel', icon: BarChart3, moduleId: 'market-intel' },
  { to: '/business', label: 'Business', icon: Building2, moduleId: 'business' },
  { to: '/procurement', label: 'Procure', icon: ClipboardCheck, moduleId: 'procurement' },
  { to: '/logistics', label: 'Ship', icon: Truck, moduleId: 'logistics' },
  { to: '/finance', label: 'Finance', icon: Wallet, moduleId: 'finance' },
  { to: '/exports', label: 'Export', icon: Globe, moduleId: 'export' },
  { to: '/cooperative', label: 'Co-op', icon: Users, moduleId: 'cooperative' },
  { to: '/ai', label: 'AI', icon: Brain, moduleId: 'ai' },
  { to: '/developer', label: 'Dev', icon: Code2, moduleId: 'developer' },
  { to: '/admin', label: 'Admin', icon: Shield, moduleId: 'admin' },
  { to: '/profile', label: 'Profile', icon: User, moduleId: 'profile' },
]

function MobileNavGrid({ items, onClose }: { items: MobileNavItem[]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm flex flex-col"
    >
      <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
        <span className="text-sm font-semibold text-text-primary">All Modules</span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-colors ${
                  isActive
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-border bg-surface text-text-secondary hover:border-neutral-600'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export function MobileNav() {
  const { user } = useAuth()
  const [showGrid, setShowGrid] = useState(false)
  const allowedModules = user ? getAllowedModules(user.role) : new Set<OSModuleId>()
  const visibleItems = allMobileNavItems.filter(item => allowedModules.has(item.moduleId))

  const primaryItems = visibleItems.slice(0, 4)
  const hasMore = visibleItems.length > 4

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe lg:hidden">
        <div className="flex items-center justify-around h-14 px-1">
          {primaryItems.map((item) => (
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
          {hasMore && (
            <button
              onClick={() => setShowGrid(true)}
              className="flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg text-text-secondary"
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {showGrid && (
          <MobileNavGrid items={visibleItems} onClose={() => setShowGrid(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
