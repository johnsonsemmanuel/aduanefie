import { useState } from 'react'
import {
  Users, MapPin, Award, TrendingUp, Plus, BarChart3
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill, Pill } from '@/components/ui/Pill'
import { cooperatives, cooperativeMembers } from '@/data/cooperative'
import type { Cooperative, CooperativeMember } from '@/types'

export function CooperativeHub() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <PageShell
      tabs={[
        { id: 'overview', icon: BarChart3, label: 'Overview' },
        { id: 'cooperatives', icon: Award, label: 'Co-ops' },
        { id: 'members', icon: Users, label: 'Members' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Cooperative Hub</h1>
            <p className="text-xs text-text-secondary">Farmer groups, collective trading, and shared resources</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> New Cooperative
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <GlassCard className="col-span-1 sm:col-span-2">
            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Total Members</span>
            <p className="text-lg font-bold text-text-primary">{cooperatives.reduce((s, c) => s + c.memberCount, 0).toLocaleString()}</p>
            <p className="text-[10px] text-text-secondary">Across {cooperatives.length} cooperatives</p>
          </GlassCard>
          {[
            { label: 'Active Co-ops', value: cooperatives.filter(c => c.status === 'active').length.toString(), icon: Award, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Total Output', value: `${cooperatives.reduce((s, c) => s + c.totalProduce, 0).toLocaleString()}t`, icon: TrendingUp, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
            { label: 'Commodities', value: [...new Set(cooperatives.flatMap(c => c.commodities))].length.toString(), icon: MapPin, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
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
                <GlassCardTitle>Cooperatives</GlassCardTitle>
                <span className="text-xs text-text-secondary">{cooperatives.length} registered</span>
              </GlassCardHeader>
              <div className="divide-y divide-border">
                {cooperatives.map((c) => (<CoopRow key={c.id} coop={c} />))}
              </div>
            </GlassCard>
            <GlassCard padding="none">
              <GlassCardHeader className="px-4 pt-4">
                <GlassCardTitle>Top Contributors</GlassCardTitle>
              </GlassCardHeader>
              <div className="divide-y divide-border">
                {cooperativeMembers.sort((a, b) => b.contribution - a.contribution).slice(0, 5).map((m) => (<MemberRow key={m.id} member={m} />))}
              </div>
            </GlassCard>
          </>
        )}

        {activeTab === 'cooperatives' && <CooperativesTab />}
        {activeTab === 'members' && <MembersTab />}
      </div>
    </PageShell>
  )
}

function CooperativesTab() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {cooperatives.map((c) => (
        <GlassCard key={c.id}>
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
            <StatusPill status={c.status} />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><p className="text-[10px] text-text-secondary">Members</p><p className="text-sm font-bold">{c.memberCount}</p></div>
            <div><p className="text-[10px] text-text-secondary">Annual Output</p><p className="text-sm font-bold">{c.totalProduce}t</p></div>
            <div><p className="text-[10px] text-text-secondary">Founded</p><p className="text-sm font-bold">{new Date(c.foundedDate).getFullYear()}</p></div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {c.commodities.map((cm) => (<Pill key={cm}>{cm}</Pill>))}
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

function MembersTab() {
  const [selectedCoop, setSelectedCoop] = useState<string>('all')
  const filtered = selectedCoop === 'all' ? cooperativeMembers : cooperativeMembers

  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>Cooperative Members</GlassCardTitle>
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedCoop('all')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${selectedCoop === 'all' ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary'}`}
          >All</button>
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((m) => (<MemberRow key={m.id} member={m} detailed />))}
      </div>
    </GlassCard>
  )
}

function CoopRow({ coop }: { coop: Cooperative }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Users className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate">{coop.name}</p>
        <p className="text-[10px] text-text-secondary">{coop.location} · {coop.memberCount} members · {coop.totalProduce}t output</p>
        <div className="flex gap-1 mt-0.5">
          {coop.commodities.map((c) => (<Pill key={c}>{c}</Pill>))}
        </div>
      </div>
      <StatusPill status={coop.status} />
    </div>
  )
}

function MemberRow({ member, detailed = false }: { member: CooperativeMember; detailed?: boolean }) {
  const roleColors: Record<string, string> = {
    chairman: 'bg-primary/10 text-primary', secretary: 'bg-commodity-inputs/10 text-commodity-inputs',
    treasurer: 'bg-commodity-export/10 text-commodity-export', member: 'bg-border/50 text-text-secondary',
  }
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
        {member.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{member.name}</p>
          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[member.role]}`}>{member.role}</span>
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
