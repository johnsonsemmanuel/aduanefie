import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllowedModules, type OSModuleId } from '@/config/permissions'
import {
  Command, ShoppingBag, BarChart3, Building2, ClipboardCheck,
  Truck, Wallet, Globe, Users, Brain, Code2, Shield, Mail, CalendarDays, User,
} from 'lucide-react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Dock } from '@/components/ui/Dock'
import { NetworkBanner } from '@/components/ui/StatusIndicator'
import { Preloader } from '@/components/ui/Preloader'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface DockItem {
  id: string
  name: string
  icon: React.ReactNode
  to: string
}

const allDockItems: DockItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: <Command />, to: '/dashboard' },
  { id: 'marketplace', name: 'Market', icon: <ShoppingBag />, to: '/marketplace' },
  { id: 'market-intel', name: 'Intel', icon: <BarChart3 />, to: '/market-intel' },
  { id: 'business', name: 'Business', icon: <Building2 />, to: '/business' },
  { id: 'procurement', name: 'Procure', icon: <ClipboardCheck />, to: '/procurement' },
  { id: 'logistics', name: 'Logistics', icon: <Truck />, to: '/logistics' },
  { id: 'finance', name: 'Finance', icon: <Wallet />, to: '/finance' },
  { id: 'exports', name: 'Export', icon: <Globe />, to: '/exports' },
  { id: 'cooperative', name: 'Co-op', icon: <Users />, to: '/cooperative' },
  { id: 'ai', name: 'AI', icon: <Brain />, to: '/ai' },
  { id: 'developer', name: 'Dev', icon: <Code2 />, to: '/developer' },
  { id: 'admin', name: 'Admin', icon: <Shield />, to: '/admin' },
  { id: 'messages', name: 'Messages', icon: <Mail />, to: '/messages' },
  { id: 'calendar', name: 'Calendar', icon: <CalendarDays />, to: '/calendar' },
  { id: 'profile', name: 'Profile', icon: <User />, to: '/profile' },
]

interface ShellProps {
  children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
  const { user } = useAuth()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)
  const isOnline = useNetworkStatus()

  const allowedModules = user ? getAllowedModules(user.role) : new Set<OSModuleId>()
  const visibleDockItems = allDockItems.filter(item => {
    const moduleIdMap: Record<string, OSModuleId> = {
      dashboard: 'dashboard', marketplace: 'trade-engine', 'market-intel': 'market-intel',
      business: 'business', procurement: 'procurement', logistics: 'logistics',
      finance: 'finance', exports: 'export', cooperative: 'cooperative',
      ai: 'ai', developer: 'developer', admin: 'admin',
      messages: 'messaging', calendar: 'calendar', profile: 'profile',
    }
    return allowedModules.has(moduleIdMap[item.id])
  })

  if (showPreloader) {
    return <Preloader onComplete={() => setShowPreloader(false)} />
  }

  return (
    <div className="flex min-h-dvh bg-bg">
      <NetworkBanner isOnline={isOnline} />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 animate-in slide-in-from-left">
            <Sidebar onNav={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 lg:p-5 pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom Dock — visible on all screens */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
        <Dock items={visibleDockItems} />
      </div>
    </div>
  )
}
