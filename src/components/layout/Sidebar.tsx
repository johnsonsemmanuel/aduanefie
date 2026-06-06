import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Command, ShoppingBag, BarChart3, Building2, ClipboardCheck,
  Truck, Wallet, Globe, Users, Brain, Code2, Shield, User, Mail, CalendarDays,
  LogOut, Search as SearchIcon, ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getAllowedModules, type OSModuleId } from '@/config/permissions'

/* ======================= Types ======================= */

interface NavItem {
  to: string
  label: string
  icon: typeof Command
  moduleId: OSModuleId
}

interface ModuleContent {
  title: string
  sections: string[]
}

/* ======================= Module Content Map ======================= */

function getModuleContent(moduleId: string): ModuleContent {
  const map: Record<string, ModuleContent> = {
    dashboard: {
      title: 'Command Center',
      sections: ['System Overview', 'Key Metrics', 'Module Grid', 'System Events', 'Market Ticker'],
    },
    'trade-engine': {
      title: 'Trade Engine',
      sections: ['Active Orders', 'Market Summary', 'Trade History', 'Performance'],
    },
    'market-intel': {
      title: 'Market Intel',
      sections: ['Price Trends', 'Regional Data', 'Forecasts', 'Weather Intel', 'Demand Analytics'],
    },
    business: {
      title: 'Business Hub',
      sections: ['CRM', 'Deal Pipeline', 'Tasks', 'Projects', 'Invoices'],
    },
    procurement: {
      title: 'Procurement',
      sections: ['Vendors', 'RFQs', 'Purchase Orders', 'Contracts', 'Deliveries'],
    },
    logistics: {
      title: 'Logistics Hub',
      sections: ['Shipments', 'Warehouses', 'Tracking', 'Route Planning'],
    },
    finance: {
      title: 'Finance Hub',
      sections: ['Wallet', 'Transactions', 'Loans', 'Insurance', 'Trade Finance'],
    },
    export: {
      title: 'Export Hub',
      sections: ['Export Opportunities', 'Documentation', 'Compliance', 'Shipping'],
    },
    cooperative: {
      title: 'Cooperative Hub',
      sections: ['Cooperatives', 'Members', 'Governance', 'Shared Resources'],
    },
    ai: {
      title: 'AI Hub',
      sections: ['Trade Assistant', 'Recommendations', 'Predictions', 'Analytics'],
    },
    developer: {
      title: 'Developer Hub',
      sections: ['API Endpoints', 'API Keys', 'Applications', 'Documentation'],
    },
    admin: {
      title: 'Administration',
      sections: ['User Management', 'Roles', 'System Settings', 'Audit Log'],
    },
    messaging: {
      title: 'Messages',
      sections: ['Inbox', 'Sent', 'Trade Negotiations', 'Support Tickets', 'Archive'],
    },
    calendar: {
      title: 'Calendar',
      sections: ['Monthly View', 'Planting Season', 'Harvest Windows', 'Deliveries', 'Events'],
    },
    profile: {
      title: 'Profile',
      sections: ['Personal Info', 'Account', 'Notifications', 'Security'],
    },
  }
  return map[moduleId] || map.dashboard
}

/* ======================= SVG Logo ======================= */

function AduanefieLogo() {
  return (
    <div className="size-7 flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="none" className="size-full">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#FAFAFA" strokeWidth="1.5" />
        <path d="M7 12h10M12 7v10" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ======================= Components ======================= */

function IconNavButton({ children, isActive = false }: { children: React.ReactNode; isActive?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg size-10 min-w-10 transition-colors duration-300 ${
        isActive ? 'bg-neutral-800 text-neutral-50' : 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300'
      }`}
    >
      {children}
    </div>
  )
}

function AvatarCircle({ initials }: { initials: string }) {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-neutral-700 flex items-center justify-center">
      <span className="text-xs font-semibold text-neutral-50">{initials}</span>
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-neutral-600 pointer-events-none" />
    </div>
  )
}

const roleLabels: Record<string, string> = {
  admin: 'Administrator', farmer: 'Farmer', buyer: 'Buyer',
  supplier: 'Supplier', logistics: 'Logistics', viewer: 'Viewer',
  supervisor: 'Supervisor', trader: 'Trader',
}

/* ======================= Main Sidebar ======================= */

const allNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Command Center', icon: Command, moduleId: 'dashboard' },
  { to: '/marketplace', label: 'Trade Engine', icon: ShoppingBag, moduleId: 'trade-engine' },
  { to: '/market-intel', label: 'Market Intel', icon: BarChart3, moduleId: 'market-intel' },
  { to: '/business', label: 'Business Hub', icon: Building2, moduleId: 'business' },
  { to: '/procurement', label: 'Procurement', icon: ClipboardCheck, moduleId: 'procurement' },
  { to: '/logistics', label: 'Logistics Hub', icon: Truck, moduleId: 'logistics' },
  { to: '/finance', label: 'Finance Hub', icon: Wallet, moduleId: 'finance' },
  { to: '/exports', label: 'Export Hub', icon: Globe, moduleId: 'export' },
  { to: '/cooperative', label: 'Cooperative', icon: Users, moduleId: 'cooperative' },
  { to: '/ai', label: 'AI Hub', icon: Brain, moduleId: 'ai' },
  { to: '/developer', label: 'Developer', icon: Code2, moduleId: 'developer' },
  { to: '/admin', label: 'Admin', icon: Shield, moduleId: 'admin' },
  { to: '/messages', label: 'Messages', icon: Mail, moduleId: 'messaging' },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays, moduleId: 'calendar' },
  { to: '/profile', label: 'Profile', icon: User, moduleId: 'profile' },
]

interface SidebarProps {
  onNav?: () => void
  className?: string
}

export function Sidebar({ onNav, className = '' }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const allowedModules = user ? getAllowedModules(user.role) : new Set<OSModuleId>()
  const navItems = allNavItems.filter(item => allowedModules.has(item.moduleId))

  const currentModuleId = navItems.find(
    item => location.pathname === item.to || location.pathname.startsWith(item.to + '/')
  )?.moduleId || navItems[0]?.moduleId || 'dashboard'

  const [isCollapsed, setIsCollapsed] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  const content = getModuleContent(currentModuleId)

  return (
    <div className={`flex shrink-0 ${className}`}>
      {/* Left icon nav rail */}
      <aside className="bg-black flex flex-col gap-2 items-center py-4 w-16 border-r border-neutral-800 shrink-0">
        <div className="mb-2 size-10 flex items-center justify-center">
          <AduanefieLogo />
        </div>
        <nav className="flex flex-col gap-2 w-full items-center overflow-y-auto flex-1 scrollbar-thin">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'} onClick={onNav}>
              {({ isActive }) => (
                <IconNavButton isActive={isActive}>
                  <item.icon className="size-4" />
                </IconNavButton>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-2 w-full items-center mt-auto">
          <button onClick={logout} className="flex items-center justify-center rounded-lg size-10 transition-colors hover:bg-neutral-800 text-neutral-400 hover:text-neutral-300" title="Sign out">
            <LogOut className="size-4" />
          </button>
          <AvatarCircle initials={initials} />
        </div>
      </aside>

      {/* Right detail panel */}
      <aside className={`bg-black flex flex-col items-start py-4 transition-all duration-300 overflow-hidden ${isCollapsed ? 'w-16 px-0' : 'w-72'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-3 mb-2 w-full">
            <AduanefieLogo />
            <div>
              <div className="text-sm font-semibold text-neutral-50 leading-tight">Aduanefie</div>
              <div className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">AgriOS</div>
            </div>
          </div>
        )}

        {/* Title row */}
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center h-10 px-2">
              <span className="text-lg font-semibold text-neutral-50">{!isCollapsed ? content.title : ''}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCollapsed(s => !s)}
              className="flex items-center justify-center rounded-lg size-10 transition-colors hover:bg-neutral-800 text-neutral-400"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronDown className={`size-4 transition-transform ${isCollapsed ? 'rotate-180' : '-rotate-90'}`} />
            </button>
          </div>
        </div>

        {isCollapsed ? null : (
          <>
            {/* Search */}
            <div className="relative w-full px-3 mb-2">
              <div className="bg-black h-9 relative rounded-lg flex items-center border border-neutral-800">
                <div className="flex items-center justify-center shrink-0 px-2">
                  <SearchIcon className="size-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-transparent border-none outline-none text-sm text-neutral-50 placeholder:text-neutral-400 leading-5 pr-2"
                />
              </div>
            </div>

            {/* Feature sections */}
            <div className="flex flex-col w-full overflow-y-auto flex-1 scrollbar-thin gap-1">
              {content.sections.map((section, index) => (
                <div key={`${currentModuleId}-${index}`} className="flex flex-col w-full">
                  <div className="flex items-center h-8 px-3">
                    <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{section}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* User footer */}
            <div className="w-full mt-auto pt-3 px-3 border-t border-neutral-800">
              <div className="flex items-center gap-2 py-2">
                <AvatarCircle initials={initials} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-neutral-50 truncate">{user?.name || 'User'}</div>
                  <div className="text-[10px] text-neutral-400 truncate capitalize">{roleLabels[user?.role || ''] || user?.role}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
