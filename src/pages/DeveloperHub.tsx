import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import {
  Code2, Key, Globe, BookOpen, Terminal, Plus
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill } from '@/components/ui/Pill'
import { apiEndpoints, apiKeys, developerApps } from '@/data/developer'
import type { APIEndpoint, APIKey, DeveloperApp } from '@/types'
import { Button } from '@/components/ui/Button'

export function DeveloperHub() {
  const [activeTab, setActiveTab] = useState('overview')
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'overview', icon: Code2, label: 'Overview' }, { id: 'endpoints', icon: Terminal, label: 'API' }, { id: 'keys', icon: Key, label: 'API Keys' }, { id: 'apps', icon: Globe, label: 'Apps' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'overview', icon: Code2, label: 'Overview' },
        { id: 'endpoints', icon: Terminal, label: 'API' },
        { id: 'keys', icon: Key, label: 'API Keys' },
        { id: 'apps', icon: Globe, label: 'Apps' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Developer Hub</h1>
            <p className="text-xs text-text-secondary">API documentation, keys, webhooks, and app management</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="primary" size="sm" className="rounded-full">
              <Plus className="w-3.5 h-3.5" /> New API Key
            </Button>
            <Button variant="secondary" size="sm" className="rounded-full">
              <BookOpen className="w-3.5 h-3.5" /> Docs
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { label: 'API Endpoints', value: apiEndpoints.length.toString(), icon: Terminal, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
            { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), icon: Key, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Registered Apps', value: developerApps.filter(a => a.status === 'active').length.toString(), icon: Globe, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
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
            <GlassCard padding="none">
              <GlassCardHeader className="px-4 pt-4">
                <GlassCardTitle>Your Apps</GlassCardTitle>
              </GlassCardHeader>
              <div className="divide-y divide-border">
                {developerApps.map((app) => (<AppRow key={app.id} app={app} />))}
              </div>
            </GlassCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard padding="none">
                <GlassCardHeader className="px-4 pt-4">
                  <GlassCardTitle>Recent API Keys</GlassCardTitle>
                </GlassCardHeader>
                <div className="divide-y divide-border">
                  {apiKeys.slice(0, 3).map((k) => (<KeyRow key={k.id} k={k} />))}
                </div>
              </GlassCard>
              <GlassCard padding="none">
                <GlassCardHeader className="px-4 pt-4">
                  <GlassCardTitle>Core API Endpoints</GlassCardTitle>
                </GlassCardHeader>
                <div className="divide-y divide-border">
                  {apiEndpoints.filter(e => e.path.includes('/commodities') || e.path.includes('/market')).slice(0, 4).map((ep) => (<EndpointRow key={ep.path} ep={ep} />))}
                </div>
              </GlassCard>
            </div>
          </>
        )}
        {activeTab === 'endpoints' && <EndpointsTab />}
        {activeTab === 'keys' && <KeysTab />}
        {activeTab === 'apps' && <AppsTab />}
      </div>
    </PageShell>
  )
}

function EndpointsTab() {
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const filtered = methodFilter === 'all' ? apiEndpoints : apiEndpoints.filter(e => e.method === methodFilter)
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>API Endpoints</GlassCardTitle>
        <div className="flex gap-1">
          {['all', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <Button
              key={m}
              variant={methodFilter === m ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setMethodFilter(m)}
              className="rounded-full font-mono"
            >{m}</Button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((ep) => (<EndpointRow key={ep.path} ep={ep} detailed />))}
      </div>
    </GlassCard>
  )
}

function KeysTab() {
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>API Keys</GlassCardTitle>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {apiKeys.map((k) => (<KeyRow key={k.id} k={k} detailed />))}
      </div>
    </GlassCard>
  )
}

function AppsTab() {
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>Applications</GlassCardTitle>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {developerApps.map((app) => (<AppRow key={app.id} app={app} detailed />))}
      </div>
    </GlassCard>
  )
}

function EndpointRow({ ep, detailed = false }: { ep: APIEndpoint; detailed?: boolean }) {
  const methodColors: Record<string, string> = { GET: 'text-success', POST: 'text-commodity-inputs', PUT: 'text-warning', DELETE: 'text-danger' }
  return (
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <code className={`text-[10px] font-bold font-mono w-12 shrink-0 mt-0.5 ${methodColors[ep.method]}`}>{ep.method}</code>
      <div className="min-w-0 flex-1">
        <code className="text-[10px] font-mono text-text-primary">{ep.path}</code>
        <p className="text-[10px] text-text-secondary">{ep.description}</p>
        {detailed && <div className="flex items-center gap-2 text-[9px] text-text-secondary mt-0.5">
          <span>Auth: {ep.auth ? 'Required' : 'Public'}</span>
          <span>·</span>
          <span>Rate: {ep.rateLimit}</span>
        </div>}
      </div>
    </div>
  )
}

function KeyRow({ k, detailed = false }: { k: APIKey; detailed?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
        <Key className={`w-4 h-4 ${k.status === 'active' ? 'text-success' : 'text-text-secondary'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{k.name}</p>
          <StatusPill status={k.status} />
        </div>
        <code className="text-[10px] font-mono text-text-secondary">{k.key.slice(0, 20)}...</code>
        {detailed && <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
          <span>Created: {new Date(k.created).toLocaleDateString()}</span>
          <span>·</span>
          <span>Last used: {new Date(k.lastUsed).toLocaleDateString()}</span>
        </div>}
      </div>
    </div>
  )
}

function AppRow({ app, detailed = false }: { app: DeveloperApp; detailed?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <div className="w-8 h-8 rounded-lg bg-commodity-inputs/10 flex items-center justify-center shrink-0">
        <Globe className="w-4 h-4 text-commodity-inputs" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{app.name}</p>
          <StatusPill status={app.status} />
        </div>
        <p className="text-[10px] text-text-secondary">{app.description}</p>
        {detailed && <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
          <span>{app.apiKeys} API key{app.apiKeys > 1 ? 's' : ''}</span>
          <span>·</span>
          <span>Active: {new Date(app.lastActive).toLocaleDateString()}</span>
        </div>}
      </div>
    </div>
  )
}
