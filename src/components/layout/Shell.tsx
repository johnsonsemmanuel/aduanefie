import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { TopBar } from './TopBar'
import { NetworkBanner } from '@/components/ui/StatusIndicator'
import { Preloader } from '@/components/ui/Preloader'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

interface ShellProps {
  children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)
  const isOnline = useNetworkStatus()

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

        <main className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 lg:p-5 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <MobileNav />
    </div>
  )
}
