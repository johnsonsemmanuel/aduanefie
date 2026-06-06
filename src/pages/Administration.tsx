import { useState } from 'react'
import {
  Shield, Users, Settings, Activity, UserPlus,
  Lock, Bell, Globe, Server
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip, Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { adminUsers, systemSettings } from '@/data/admin'

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 'users', label: 'Users', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> },
]

export function Administration() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Administration</h1>
          <p className="text-xs text-text-secondary">User management, permissions, and system configuration</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<UserPlus className="w-3.5 h-3.5" />}>Invite User</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Total Users', value: adminUsers.length.toString(), icon: Users, color: 'text-text-primary', bg: 'bg-border/50' },
          { label: 'Active', value: adminUsers.filter(u => u.status === 'active').length.toString(), icon: Activity, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Suspended', value: adminUsers.filter(u => u.status === 'suspended').length.toString(), icon: Shield, color: 'text-danger', bg: 'bg-danger/10' },
          { label: 'Pending', value: adminUsers.filter(u => u.status === 'pending').length.toString(), icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider truncate">{m.label}</span>
              <div className={`w-6 h-6 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`w-3 h-3 ${m.color}`} />
              </div>
            </div>
            <p className="text-lg font-bold text-text-primary">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <Card padding="none">
          <div className="flex border-b border-border overflow-x-auto scrollbar-thin px-4">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id ? 'border-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              ><span className="w-3.5 h-3.5">{tab.icon}</span>{tab.label}</button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4 pb-14 lg:pb-0">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <div className="divide-y divide-border">
                  {adminUsers.filter(u => u.lastActive !== '2026-06-01T00:00:00Z').slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center gap-2.5 py-2 px-1">
                      <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-success' : u.status === 'suspended' ? 'bg-danger' : 'bg-warning'}`} />
                      <p className="text-xs text-text-primary min-w-0 flex-1 truncate">{u.name} — {u.email}</p>
                      <span className="text-[10px] text-text-secondary shrink-0">{new Date(u.lastActive).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <CardHeader><CardTitle>System Overview</CardTitle></CardHeader>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1 px-1">
                    <span className="text-xs text-text-secondary">Platform</span>
                    <span className="text-xs font-medium text-text-primary">Aduanefie AgriOS v2.4.1</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1">
                    <span className="text-xs text-text-secondary">Module Count</span>
                    <span className="text-xs font-medium text-text-primary">12 modules</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1">
                    <span className="text-xs text-text-secondary">User Roles</span>
                    <span className="text-xs font-medium text-text-primary">Admin · Supervisor · Trader · Viewer</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-1">
                    <span className="text-xs text-text-secondary">Security</span>
                    <span className="text-xs font-medium text-success">MFA Enabled</span>
                  </div>
                </div>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle>Configuration Summary</CardTitle></CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {['general', 'security', 'trading', 'notifications', 'integrations'].map((cat) => (
                  <div key={cat} className="rounded-lg border border-border bg-bg p-3">
                    <p className="text-[10px] font-medium text-text-secondary capitalize mb-1">{cat}</p>
                    <p className="text-xs font-bold text-text-primary">{systemSettings.filter(s => s.category === cat).length} settings</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-text-secondary'
              }`}
            ><span className="w-4 h-4">{tab.icon}</span><span className="text-[10px] font-medium">{tab.label}</span></button>
          ))}
        </div>
      </div>
    </div>
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

  const roleBadges: Record<string, string> = { admin: 'bg-danger/10 text-danger', supervisor: 'bg-warning/10 text-warning', trader: 'bg-commodity-inputs/10 text-commodity-inputs', viewer: 'bg-border/50 text-text-secondary' }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <div className="flex gap-1">
          {['all', 'admin', 'supervisor', 'trader', 'viewer'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${roleFilter === r ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((u) => (
          <div key={u.id} className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {u.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-text-primary truncate">{u.name}</p>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${roleBadges[u.role]}`}>{u.role}</span>
              </div>
              <p className="text-[10px] text-text-secondary">{u.email}</p>
              <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5 flex-wrap">
                {u.modules.slice(0, 4).map((m) => (
                  <span key={m} className="text-[9px] bg-border/40 rounded px-1">{m}</span>
                ))}
                {u.modules.length > 4 && <span className="text-[9px]">+{u.modules.length - 4}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusChip status={u.status} />
              <p className="text-[9px] text-text-secondary mt-0.5">{new Date(u.lastActive).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function SettingsTab() {
  const [catFilter, setCatFilter] = useState<string>('all')
  const categories = ['all', 'general', 'security', 'trading', 'notifications', 'integrations']
  const filtered = catFilter === 'all' ? systemSettings : systemSettings.filter(s => s.category === catFilter)

  const catIcons: Record<string, typeof Settings> = { general: Globe, security: Lock, trading: Activity, notifications: Bell, integrations: Server }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((s) => {
          const Icon = catIcons[s.category] || Settings
          return (
            <div key={s.id} className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-text-secondary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <code className="text-[10px] font-mono font-medium text-text-primary">{s.key}</code>
                  <Chip size="sm">{s.category}</Chip>
                </div>
                <p className="text-[10px] text-text-secondary">{s.description}</p>
              </div>
              <code className="text-xs font-mono font-semibold text-text-primary shrink-0">{s.value}</code>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
