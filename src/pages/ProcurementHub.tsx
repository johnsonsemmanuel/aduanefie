import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import {
  ClipboardCheck, Users, FileText, ShoppingCart, Plus,
  Star, BarChart3,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill } from '@/components/ui/Pill'
import { vendors, rfqs, purchaseOrders, contracts } from '@/data/procurement'
import type { RFQ, PurchaseOrder } from '@/types'

export function ProcurementHub() {
  const [activeTab, setActiveTab] = useState('overview')
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'overview', icon: BarChart3, label: 'Overview' }, { id: 'vendors', icon: Users, label: 'Vendors' }, { id: 'rfqs', icon: FileText, label: 'RFQs' }, { id: 'orders', icon: ShoppingCart, label: 'Orders' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'overview', icon: BarChart3, label: 'Overview' },
        { id: 'vendors', icon: Users, label: 'Vendors' },
        { id: 'rfqs', icon: FileText, label: 'RFQs' },
        { id: 'orders', icon: ShoppingCart, label: 'Orders' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Procurement Hub</h1>
            <p className="text-xs text-text-secondary">Sourcing, vendor management, RFQs, and purchase orders</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
              <Plus className="w-3.5 h-3.5" /> New RFQ
            </button>
            <button className="px-3 py-1.5 rounded-full border border-border text-text-secondary text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-surface-hover transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Vendor
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: 'Active Vendors', value: vendors.filter(v => v.status === 'active').length.toString(), icon: Users, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Open RFQs', value: rfqs.filter(r => r.status === 'open').length.toString(), icon: FileText, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
            { label: 'Pending Orders', value: purchaseOrders.filter(p => p.status !== 'delivered' && p.status !== 'cancelled').length.toString(), icon: ShoppingCart, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Active Contracts', value: contracts.filter(c => c.status === 'active').length.toString(), icon: ClipboardCheck, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
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

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'rfqs' && <RFQsTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </div>
    </PageShell>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <GlassCardHeader>
      <GlassCardTitle>{title}</GlassCardTitle>
      {subtitle && <span className="text-xs text-text-secondary">{subtitle}</span>}
    </GlassCardHeader>
  )
}

function OverviewTab() {
  return (
    <>
      <GlassCard padding="none">
        <SectionHeader
          title="Active Contracts"
          subtitle={`${contracts.filter(c => c.status === 'active').length} active`}
        />
        <div className="divide-y divide-border">
          {contracts.filter(c => c.status === 'active').map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2.5 px-4 hover:bg-surface-hover">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary truncate">{c.title}</p>
                <p className="text-[10px] text-text-secondary">{c.vendor} · {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-xs font-semibold">${c.value.toLocaleString()}</p>
                <StatusPill status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard padding="none">
          <SectionHeader title="Recent Purchase Orders" />
          <div className="divide-y divide-border">
            {purchaseOrders.slice(0, 3).map((po) => (<PORow key={po.id} po={po} />))}
          </div>
        </GlassCard>

        <GlassCard padding="none">
          <SectionHeader title="Open RFQs" />
          <div className="divide-y divide-border">
            {rfqs.filter(r => r.status === 'open').map((r) => (
              <RFQRow key={r.id} rfq={r} />
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}

function VendorsTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? vendors : vendors.filter(v => v.status === filter)
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>All Vendors</GlassCardTitle>
        <div className="flex gap-1">
          {['all', 'active', 'inactive', 'pending'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((v) => (
          <div key={v.id} className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">{v.name[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">{v.name}</p>
              <p className="text-[10px] text-text-secondary">{v.category} · {v.location} · {v.totalOrders} orders</p>
              <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5">
                <Star className="w-3 h-3 text-warning" />{v.rating} · {v.commodities.slice(0, 2).join(', ')}
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusPill status={v.status} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function RFQsTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? rfqs : rfqs.filter(r => r.status === filter)
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>RFQs</GlassCardTitle>
        <div className="flex gap-1">
          {['all', 'open', 'under_review', 'awarded', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
            >
              {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
            </button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((r) => (<RFQRow key={r.id} rfq={r} detailed />))}
      </div>
    </GlassCard>
  )
}

function OrdersTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? purchaseOrders : purchaseOrders.filter(p => p.status === filter)
  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>Purchase Orders</GlassCardTitle>
        <div className="flex gap-1">
          {['all', 'draft', 'sent', 'confirmed', 'in_transit', 'delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
            </button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((po) => (<PORow key={po.id} po={po} detailed />))}
      </div>
    </GlassCard>
  )
}

function RFQRow({ rfq, detailed = false }: { rfq: RFQ; detailed?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <FileText className="w-4 h-4 text-primary mt-1 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{rfq.title}</p>
          <StatusPill status={rfq.status} />
        </div>
        {detailed && <p className="text-[10px] text-text-secondary mt-0.5">{rfq.description}</p>}
        <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
          <span>Budget: ${rfq.budget.toLocaleString()}</span>
          <span>·</span>
          <span>{rfq.category}</span>
          <span>·</span>
          <span>{rfq.responses} responses</span>
        </div>
      </div>
      <div className="text-right text-[10px] text-text-secondary shrink-0">
        <p>Close: {new Date(rfq.closeDate).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

function PORow({ po, detailed = false }: { po: PurchaseOrder; detailed?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-surface-hover">
      <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
        <ShoppingCart className="w-4 h-4 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{po.commodity}</p>
          <StatusPill status={po.status} />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-secondary">
          <span className="font-mono">{po.poNumber}</span>
          <span>·</span>
          <span>{po.vendor}</span>
        </div>
        {detailed && <div className="flex items-center gap-3 text-[10px] text-text-secondary mt-0.5">
          <span>Qty: {po.quantity} {po.unit}</span>
          <span>·</span>
          <span>Del: {new Date(po.deliveryDate).toLocaleDateString()}</span>
        </div>}
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-semibold">${po.total.toLocaleString()}</p>
      </div>
    </div>
  )
}
