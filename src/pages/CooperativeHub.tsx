import { useState } from 'react'
import {
  Users, MapPin, Award, TrendingUp, Plus
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip, Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { cooperatives, cooperativeMembers } from '@/data/cooperative'
import type { Cooperative, CooperativeMember } from '@/types'

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'cooperatives', label: 'Cooperatives', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'members', label: 'Members', icon: <Users className="w-3.5 h-3.5" /> },
]

export function CooperativeHub() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Cooperative Hub</h1>
          <p className="text-xs text-text-secondary">Farmer groups, collective trading, and shared resources</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New Cooperative</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-lg border border-border bg-surface p-3 col-span-1 sm:col-span-2">
          <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Total Members</span>
          <p className="text-lg font-bold text-text-primary">{cooperatives.reduce((s, c) => s + c.memberCount, 0).toLocaleString()}</p>
          <p className="text-[10px] text-text-secondary">Across {cooperatives.length} cooperatives</p>
        </div>
        {[
          { label: 'Active Co-ops', value: cooperatives.filter(c => c.status === 'active').length.toString(), icon: Award, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Total Output', value: `${cooperatives.reduce((s, c) => s + c.totalProduce, 0).toLocaleString()}t`, icon: TrendingUp, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
          { label: 'Commodities', value: [...new Set(cooperatives.flatMap(c => c.commodities))].length.toString(), icon: MapPin, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
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
              <CardHeader><CardTitle>Cooperatives</CardTitle><span className="text-xs text-text-secondary">{cooperatives.length} registered</span></CardHeader>
              <div className="divide-y divide-border">
                {cooperatives.map((c) => (<CoopRow key={c.id} coop={c} />))}
              </div>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Contributors</CardTitle></CardHeader>
              <div className="divide-y divide-border">
                {cooperativeMembers.sort((a, b) => b.contribution - a.contribution).slice(0, 5).map((m) => (<MemberRow key={m.id} member={m} />))}
              </div>
            </Card>
          </>
        )}
        {activeTab === 'cooperatives' && <CooperativesTab />}
        {activeTab === 'members' && <MembersTab />}
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

function CooperativesTab() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {cooperatives.map((c) => (
        <Card key={c.id}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <h3 className="text-sm font-semibold text-text-primary">{c.name}</h3>
              </div>
              <p className="text-xs text-text-secondary flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {c.location}
              </p>
            </div>
            <StatusChip status={c.status} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><p className="text-[10px] text-text-secondary">Members</p><p className="text-sm font-bold">{c.memberCount}</p></div>
            <div><p className="text-[10px] text-text-secondary">Annual Output</p><p className="text-sm font-bold">{c.totalProduce}t</p></div>
            <div><p className="text-[10px] text-text-secondary">Founded</p><p className="text-sm font-bold">{new Date(c.foundedDate).getFullYear()}</p></div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {c.commodities.map((cm) => (<Chip key={cm} size="sm">{cm}</Chip>))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function MembersTab() {
  const [selectedCoop, setSelectedCoop] = useState<string>('all')
  const filtered = selectedCoop === 'all' ? cooperativeMembers : cooperativeMembers

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cooperative Members</CardTitle>
        <div className="flex gap-1">
          <button onClick={() => setSelectedCoop('all')}
            className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${selectedCoop === 'all' ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary'}`}
          >All</button>
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((m) => (<MemberRow key={m.id} member={m} detailed />))}
      </div>
    </Card>
  )
}

function CoopRow({ coop }: { coop: Cooperative }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Users className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate">{coop.name}</p>
        <p className="text-[10px] text-text-secondary">{coop.location} · {coop.memberCount} members · {coop.totalProduce}t output</p>
        <div className="flex gap-1 mt-0.5">
          {coop.commodities.map((c) => (<Chip key={c} size="sm">{c}</Chip>))}
        </div>
      </div>
      <StatusChip status={coop.status} />
    </div>
  )
}

function MemberRow({ member, detailed = false }: { member: CooperativeMember; detailed?: boolean }) {
  const roleColors: Record<string, string> = { chairman: 'bg-primary/10 text-primary', secretary: 'bg-commodity-inputs/10 text-commodity-inputs', treasurer: 'bg-commodity-export/10 text-commodity-export', member: 'bg-border/50 text-text-secondary' }
  return (
    <div className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
        {member.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{member.name}</p>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${roleColors[member.role]}`}>{member.role}</span>
        </div>
        {detailed && (
          <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
            <span>Joined {new Date(member.joinedDate).getFullYear()}</span>
            <span>·</span>
            <span>${member.contribution.toLocaleString()} contributed</span>
            <span>·</span>
            <span>{member.produceVolume}t produce</span>
          </div>
        )}
      </div>
      {!detailed && (
        <div className="text-right text-[10px] text-text-secondary shrink-0">
          <p>${member.contribution.toLocaleString()}</p>
          <p>{member.produceVolume}t</p>
        </div>
      )}
    </div>
  )
}
