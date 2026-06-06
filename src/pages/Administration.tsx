import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import {
  Shield, Users, Settings, Activity, UserPlus,
  Lock, Bell, Globe, Server
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill, Pill } from '@/components/ui/Pill'
import { adminUsers, systemSettings } from '@/data/admin'

const tabs = [
  { id: 'overview', icon: Shield, label: 'Overview' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function Administration() {
  const [activeTab, setActiveTab] = useState('overview')
  const [modalOpen, setModalOpen] = useState<'invite' | null>(null)
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  return (
    <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Administration</h1>
            <p className="text-xs text-text-secondary">User management, permissions, and system configuration</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => setModalOpen('invite')} className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
              <UserPlus className="w-3.5 h-3.5" /> Invite User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: 'Total Users', value: adminUsers.length.toString(), icon: Users, color: 'text-text-primary', bg: 'bg-border/50' },
            { label: 'Active', value: adminUsers.filter(u => u.status === 'active').length.toString(), icon: Activity, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Suspended', value: adminUsers.filter(u => u.status === 'suspended').length.toString(), icon: Shield, color: 'text-danger', bg: 'bg-danger/10' },
            { label: 'Pending', value: adminUsers.filter(u => u.status === 'pending').length.toString(), icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
          ].map((m) => (
            <GlassCard key={m.label} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider truncate">{m.label}</span>
                <div className={`w-6 h-6 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <m.icon className={`w-3 h-3 ${m.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-text-primary">{m.value}</p>
            </GlassCard>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard padding="none">
                <GlassCardHeader className="px-4 pt-4">
                  <GlassCardTitle>Recent Activity</GlassCardTitle>
                </GlassCardHeader>
                <div className="divide-y divide-border">
                  {adminUsers.filter(u => u.lastActive !== '2026-06-01T00:00:00Z').slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center gap-2.5 py-2 px-4">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-success' : u.status === 'suspended' ? 'bg-danger' : 'bg-warning'}`} />
                      <p className="text-xs text-text-primary min-w-0 flex-1 truncate">{u.name} — {u.email}</p>
                      <span className="text-[10px] text-text-secondary shrink-0">{new Date(u.lastActive).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle>System Overview</GlassCardTitle>
                </GlassCardHeader>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-text-secondary">Platform</span>
                    <span className="text-xs font-medium text-text-primary">Aduanefie AgriOS v2.4.1</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-text-secondary">Module Count</span>
                    <span className="text-xs font-medium text-text-primary">12 modules</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-text-secondary">User Roles</span>
                    <span className="text-xs font-medium text-text-primary">Admin · Supervisor · Trader · Viewer</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-text-secondary">Security</span>
                    <span className="text-xs font-medium text-success">MFA Enabled</span>
                  </div>
                </div>
              </GlassCard>
            </div>
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Configuration Summary</GlassCardTitle>
              </GlassCardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {['general', 'security', 'trading', 'notifications', 'integrations'].map((cat) => (
                  <div key={cat} className="rounded-lg border border-border bg-bg p-3">
                    <p className="text-[10px] font-medium text-text-secondary capitalize mb-1">{cat}</p>
                    <p className="text-xs font-bold text-text-primary">{systemSettings.filter(s => s.category === cat).length} settings</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </>
        )}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'settings' && <SettingsTab />}

        <Modal open={modalOpen === 'invite'} onClose={() => setModalOpen(null)} title="Invite User" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('User invited successfully', 'success'); setModalOpen(null); }} className="space-y-3">
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select role</option>
              <option>Admin</option>
              <option>Supervisor</option>
              <option>Trader</option>
              <option>Viewer</option>
            </select>
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Invite User</button>
          </form>
        </Modal>
      </div>
    </PageShell>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  )
}

function UsersTab() {
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const filtered = roleFilter === 'all' ? adminUsers : adminUsers.filter(u => u.role === roleFilter)
  const roleBadges: Record<string, string> = {
    admin: 'bg-danger/10 text-danger', supervisor: 'bg-warning/10 text-warning',
    trader: 'bg-commodity-inputs/10 text-commodity-inputs', viewer: 'bg-border/50 text-text-secondary',
  }

  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>All Users</GlassCardTitle>
        <div className="flex gap-1">
          {['all', 'admin', 'supervisor', 'trader', 'viewer'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${roleFilter === r ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
            >{r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((u) => (
          <div key={u.id} className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-text-primary truncate">{u.name}</p>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${roleBadges[u.role]}`}>{u.role}</span>
              </div>
              <p className="text-[10px] text-text-secondary">{u.email}</p>
              <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5 flex-wrap">
                {u.modules.slice(0, 4).map((m) => (
                  <span key={m} className="text-[9px] bg-border/40 rounded-full px-1.5">{m}</span>
                ))}
                {u.modules.length > 4 && <span className="text-[9px]">+{u.modules.length - 4}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusPill status={u.status} />
              <p className="text-[9px] text-text-secondary mt-0.5">{new Date(u.lastActive).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function SettingsTab() {
  const [catFilter, setCatFilter] = useState<string>('all')
  const categories = ['all', 'general', 'security', 'trading', 'notifications', 'integrations']
  const filtered = catFilter === 'all' ? systemSettings : systemSettings.filter(s => s.category === catFilter)
  const catIcons: Record<string, typeof Settings> = { general: Globe, security: Lock, trading: Activity, notifications: Bell, integrations: Server }

  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>System Settings</GlassCardTitle>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
            >{c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((s) => {
          const Icon = catIcons[s.category] || Settings
          return (
            <div key={s.id} className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
              <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <code className="text-[10px] font-mono font-medium text-text-primary">{s.key}</code>
                  <Pill>{s.category}</Pill>
                </div>
                <p className="text-[10px] text-text-secondary">{s.description}</p>
              </div>
              <code className="text-xs font-mono font-semibold text-text-primary shrink-0">{s.value}</code>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
