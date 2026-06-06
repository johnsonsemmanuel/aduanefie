import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, CheckCheck, ShoppingBag, Wallet, Truck,
  Shield, TrendingUp, Users, FileCheck, ArrowRight, X,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Pill } from '@/components/ui/Pill'
import { useToast } from '@/context/ToastContext'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { notifications as allNotifications } from '@/data/notifications'
import { Button } from '@/components/ui/Button'
import { PageShell, type PageTab } from '@/components/layout/PageShell'
import type { Notification, NotificationCategory } from '@/types'

const typeIcons: Record<NotificationCategory, typeof Bell> = {
  trade: ShoppingBag,
  payment: Wallet,
  logistics: Truck,
  system: Shield,
  market: TrendingUp,
  social: Users,
  approval: FileCheck,
}

const typeColors: Record<NotificationCategory, string> = {
  trade: 'text-blue-400 bg-blue-500/10',
  payment: 'text-green-400 bg-green-500/10',
  logistics: 'text-amber-400 bg-amber-500/10',
  system: 'text-purple-400 bg-purple-500/10',
  market: 'text-rose-400 bg-rose-500/10',
  social: 'text-cyan-400 bg-cyan-500/10',
  approval: 'text-orange-400 bg-orange-500/10',
}

const typeLabels: Record<NotificationCategory, string> = {
  trade: 'Trade', payment: 'Payment', logistics: 'Logistics',
  system: 'System', market: 'Market Intel', social: 'Social', approval: 'Approval',
}

const pageTabs: PageTab[] = [
  { id: 'all', label: 'All', icon: Bell },
  { id: 'unread', label: 'Unread', icon: CheckCheck },
  { id: 'trade', label: 'Trade', icon: ShoppingBag },
  { id: 'payment', label: 'Payments', icon: Wallet },
  { id: 'logistics', label: 'Logistics', icon: Truck },
  { id: 'system', label: 'System', icon: Shield },
  { id: 'market', label: 'Market', icon: TrendingUp },
  { id: 'approval', label: 'Approvals', icon: FileCheck },
]

function formatNotificationDate(timestamp: string): string {
  const d = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function Notifications() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>(allNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationCategory>('all')
  const loading = useSimulatedLoading(400)

  if (loading) return <div className="p-4"><PageSkeleton type="list" /></div>

  const filtered = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    addToast('All notifications marked as read', 'success')
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearAll = () => {
    setNotifications([])
    addToast('Notifications cleared', 'info')
  }

  return (
    <PageShell tabs={pageTabs} activeTab={filter} onTabChange={(tab) => setFilter(tab as typeof filter)}>
      <div className="space-y-4 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Notifications</h1>
          <p className="text-xs text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'} · {notifications.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllRead} variant="secondary" size="sm">
              <CheckCheck className="w-3 h-3" /> Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={clearAll} variant="secondary" size="sm">
              <X className="w-3 h-3" /> Clear All
            </Button>
          )}
        </div>
      </div>


      {/* Notification list */}
      <GlassCard padding="none">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-10 h-10 text-text-secondary mb-3" />
            <p className="text-sm text-text-primary font-medium">No notifications</p>
            <p className="text-xs text-text-secondary mt-1">
              {filter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications in this category yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(n => {
              const Icon = typeIcons[n.type]
              const colorClass = typeColors[n.type]
              return (
                <div
                  key={n.id}
                  className={`px-4 py-3 transition-colors ${n.read ? '' : 'bg-primary/[0.02]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${n.read ? 'text-text-primary' : 'text-text-primary font-semibold'}`}>
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] text-text-secondary">{formatNotificationDate(n.timestamp)}</span>
                          {!n.read && <span className="size-2 rounded-full bg-primary" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-text-secondary mt-0.5">{n.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Pill className={`text-[9px] border ${n.read ? 'border-border text-text-secondary' : 'border-primary/20 text-primary bg-primary/5'}`}>
                          {typeLabels[n.type]}
                        </Pill>
                        {n.actionable && n.actionLabel && (
                          <Button
                            onClick={() => { markRead(n.id); if (n.actionPath) navigate(n.actionPath) }}
                            variant="ghost" size="sm"
                          >
                            {n.actionLabel} <ArrowRight className="w-2.5 h-2.5" />
                          </Button>
                        )}
                        {!n.read && !n.actionable && (
                          <Button
                            onClick={() => markRead(n.id)}
                            variant="ghost" size="sm"
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </GlassCard>
    </div>
    </PageShell>
  )
}
