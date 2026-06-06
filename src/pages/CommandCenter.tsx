import { useNavigate } from 'react-router-dom'
import { agriModules, systemMetrics, marketTicker, systemEvents } from '@/data/agrios'
import type { OSModule, MarketTicker, SystemEvent } from '@/types'

import {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
  ArrowUp, ArrowDown, Activity, Bell, Zap,
  Database, Cloud, RefreshCw
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
}

function ModuleIcon({ mod, size = 'w-5 h-5' }: { mod: OSModule; size?: string }) {
  const Icon = iconMap[mod.icon]
  if (!Icon) return <div className={`${size} rounded bg-primary/10`} />
  return <div style={{ color: mod.color }}><Icon className={size} /></div>
}

export function CommandCenter() {
  const navigate = useNavigate()

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  })()

  return (
    <div className="space-y-4 max-w-[1440px] mx-auto">

      {/* System Status Bar */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-xs">
        <div className="flex items-center gap-1.5 text-success shrink-0">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-success animate-ping opacity-75" />
            <span className="absolute inset-0 rounded-full bg-success" />
          </span>
          <span className="font-medium">All Systems Operational</span>
        </div>
        <span className="text-border">|</span>
        <div className="flex items-center gap-3 text-text-secondary overflow-x-auto scrollbar-thin">
          <span className="flex items-center gap-1 shrink-0">
            <Database className="w-3 h-3 text-success" /> DB Connected
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Cloud className="w-3 h-3 text-success" /> API 99.9%
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <RefreshCw className="w-3 h-3 text-commodity-inputs" /> Synced 2m ago
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Activity className="w-3 h-3 text-commodity-export" /> 142 Online
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">{greeting}, Emmanuel</h1>
          <p className="text-xs text-text-secondary">AgriOS v2.4.1 · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-secondary bg-surface border border-border rounded px-2 py-1">Uptime: 24d 7h 32m</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {systemMetrics.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-surface p-3">
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-base font-bold text-text-primary">{m.value}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {m.trend === 'up' ? (
                <ArrowUp className="w-3 h-3 text-success" />
              ) : m.trend === 'down' && m.label === 'Avg Response Time' ? (
                <ArrowUp className="w-3 h-3 text-success" />
              ) : m.trend === 'down' ? (
                <ArrowDown className="w-3 h-3 text-danger" />
              ) : (
                <Zap className="w-3 h-3 text-text-secondary" />
              )}
              <span className="text-[10px] text-text-secondary truncate">{m.secondary}</span>
            </div>
          </div>
        ))}
      </div>

      {/* OS Module Grid */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">AgriOS Modules</h2>
          <span className="text-[10px] text-text-secondary">{agriModules.filter(m => m.status === 'active').length} active · {agriModules.filter(m => m.status === 'beta').length} beta</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {agriModules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => mod.status !== 'coming-soon' && navigate(mod.path)}
              className="group relative flex flex-col items-start gap-2 p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover active:bg-surface-active transition-all text-left"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${mod.color}12` }}>
                <ModuleIcon mod={mod} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-text-primary truncate">{mod.name}</p>
                  {mod.badge && (
                    <span className="text-[9px] font-mono bg-primary/10 text-primary rounded px-1 font-medium">{mod.badge}</span>
                  )}
                </div>
                <p className="text-[10px] text-text-secondary truncate">{mod.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-medium ${
                  mod.status === 'active' ? 'text-success' :
                  mod.status === 'beta' ? 'text-warning' :
                  mod.status === 'maintenance' ? 'text-danger' : 'text-text-secondary'
                }`}>
                  {mod.status === 'active' ? 'Live' : mod.status === 'beta' ? 'Beta' : mod.status === 'maintenance' ? 'Down' : 'Soon'}
                </span>
                <span className="text-[9px] text-text-secondary">L{mod.layer}</span>
              </div>
              {mod.badge && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center">
                  {mod.badge}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom: Activity + Market Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Events */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">System Events</h2>
            <Bell className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div className="divide-y divide-border">
            {systemEvents.slice(0, 6).map((event) => (
              <EventRow key={event.id} event={event} onClick={() => {}} />
            ))}
          </div>
        </div>

        {/* Market Ticker */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
            <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Live Market Ticker</h2>
            <BarChart3 className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div className="divide-y divide-border">
            {marketTicker.map((t) => (
              <TickerRow key={t.id} ticker={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EventRow({ event, onClick }: { event: SystemEvent; onClick: () => void }) {
  const severityStyles = {
    success: 'bg-success/10 text-success',
    info: 'bg-commodity-inputs/10 text-commodity-inputs',
    warning: 'bg-warning/10 text-warning',
    critical: 'bg-danger/10 text-danger',
  }

  const module = agriModules.find(m => m.id === event.module)
  const Icon = module ? iconMap[module.icon] : null

  const timeAgo = getTimeAgo(event.timestamp)

  return (
    <div className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-surface-hover transition-colors cursor-pointer" onClick={onClick}>
      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 ${severityStyles[event.severity]}`}>
        {Icon && <div><Icon className="w-3.5 h-3.5" /></div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-primary">{event.message}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-text-secondary">{timeAgo}</span>
          {event.actionLabel && (
            <span className="text-[10px] font-medium text-primary">{event.actionLabel} →</span>
          )}
        </div>
      </div>
    </div>
  )
}

function TickerRow({ ticker }: { ticker: MarketTicker }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 hover:bg-surface-hover transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate">{ticker.commodity}</p>
        <p className="text-[10px] text-text-secondary">{ticker.unit}</p>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-xs font-semibold text-text-primary">${ticker.price.toLocaleString()}</p>
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${ticker.trend === 'up' ? 'text-success' : 'text-danger'}`}>
          {ticker.trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
          {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
