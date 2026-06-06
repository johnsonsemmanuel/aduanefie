import { useState } from 'react'
import {
  Code2, Key, Globe, BookOpen, Terminal, Plus
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { apiEndpoints, apiKeys, developerApps } from '@/data/developer'
import type { APIEndpoint, APIKey, DeveloperApp } from '@/types'

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'endpoints', label: 'API', icon: <Terminal className="w-3.5 h-3.5" /> },
  { id: 'keys', label: 'API Keys', icon: <Key className="w-3.5 h-3.5" /> },
  { id: 'apps', label: 'Apps', icon: <Globe className="w-3.5 h-3.5" /> },
]

export function DeveloperHub() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Developer Hub</h1>
          <p className="text-xs text-text-secondary">API documentation, keys, webhooks, and app management</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New API Key</Button>
          <Button size="sm" variant="secondary" icon={<BookOpen className="w-3.5 h-3.5" />}>Docs</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {[
          { label: 'API Endpoints', value: apiEndpoints.length.toString(), icon: Terminal, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
          { label: 'Active Keys', value: apiKeys.filter(k => k.status === 'active').length.toString(), icon: Key, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Registered Apps', value: developerApps.filter(a => a.status === 'active').length.toString(), icon: Globe, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
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
            <Card>
              <CardHeader><CardTitle>Your Apps</CardTitle></CardHeader>
              <div className="divide-y divide-border">
                {developerApps.map((app) => (<AppRow key={app.id} app={app} />))}
              </div>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle>Recent API Keys</CardTitle></CardHeader>
                <div className="divide-y divide-border">
                  {apiKeys.slice(0, 3).map((k) => (<KeyRow key={k.id} k={k} />))}
                </div>
              </Card>
              <Card>
                <CardHeader><CardTitle>Core API Endpoints</CardTitle></CardHeader>
                <div className="divide-y divide-border">
                  {apiEndpoints.filter(e => e.path.includes('/commodities') || e.path.includes('/market')).slice(0, 4).map((ep) => (<EndpointRow key={ep.path} ep={ep} />))}
                </div>
              </Card>
            </div>
          </>
        )}
        {activeTab === 'endpoints' && <EndpointsTab />}
        {activeTab === 'keys' && <KeysTab />}
        {activeTab === 'apps' && <AppsTab />}
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

function EndpointsTab() {
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const filtered = methodFilter === 'all' ? apiEndpoints : apiEndpoints.filter(e => e.method === methodFilter)
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Endpoints</CardTitle>
        <div className="flex gap-1">
          {['all', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
            <button key={m} onClick={() => setMethodFilter(m)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-medium transition-colors ${methodFilter === m ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{m}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((ep) => (<EndpointRow key={ep.path} ep={ep} detailed />))}
      </div>
    </Card>
  )
}

function KeysTab() {
  return (
    <Card>
      <CardHeader><CardTitle>API Keys</CardTitle></CardHeader>
      <div className="divide-y divide-border">
        {apiKeys.map((k) => (<KeyRow key={k.id} k={k} detailed />))}
      </div>
    </Card>
  )
}

function AppsTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
      <div className="divide-y divide-border">
        {developerApps.map((app) => (<AppRow key={app.id} app={app} detailed />))}
      </div>
    </Card>
  )
}

function EndpointRow({ ep, detailed = false }: { ep: APIEndpoint; detailed?: boolean }) {
  const methodColors: Record<string, string> = { GET: 'text-success', POST: 'text-commodity-inputs', PUT: 'text-warning', DELETE: 'text-danger' }
  return (
    <div className="flex items-start gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
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
    <div className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
        <Key className={`w-4 h-4 ${k.status === 'active' ? 'text-success' : 'text-text-secondary'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{k.name}</p>
          <StatusChip status={k.status} />
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
    <div className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-commodity-inputs/10 flex items-center justify-center shrink-0">
        <Globe className="w-4 h-4 text-commodity-inputs" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{app.name}</p>
          <StatusChip status={app.status} />
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
