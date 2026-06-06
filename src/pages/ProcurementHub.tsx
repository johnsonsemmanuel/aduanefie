import { useState } from 'react'
import {
  ClipboardCheck, Users, FileText, ShoppingCart, Plus,
  Star, Building2
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { vendors, rfqs, purchaseOrders, contracts } from '@/data/procurement'
import type { RFQ, PurchaseOrder } from '@/types'

const tabs = [
  { id: 'overview', label: 'Overview', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'vendors', label: 'Vendors', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'rfqs', label: 'RFQs', icon: <FileText className="w-3.5 h-3.5" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
]

export function ProcurementHub() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Procurement Hub</h1>
          <p className="text-xs text-text-secondary">Sourcing, vendor management, RFQs, and purchase orders</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New RFQ</Button>
          <Button size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />}>Add Vendor</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Active Vendors', value: vendors.filter(v => v.status === 'active').length.toString(), icon: Users, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Open RFQs', value: rfqs.filter(r => r.status === 'open').length.toString(), icon: FileText, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
          { label: 'Pending Orders', value: purchaseOrders.filter(p => p.status !== 'delivered' && p.status !== 'cancelled').length.toString(), icon: ShoppingCart, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Active Contracts', value: contracts.filter(c => c.status === 'active').length.toString(), icon: ClipboardCheck, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
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
              >
                <span className="w-3.5 h-3.5">{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4 pb-14 lg:pb-0">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'vendors' && <VendorsTab />}
        {activeTab === 'rfqs' && <RFQsTab />}
        {activeTab === 'orders' && <OrdersTab />}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
          <span className="text-xs text-text-secondary">{contracts.filter(c => c.status === 'active').length} active</span>
        </CardHeader>
        <div className="divide-y divide-border">
          {contracts.filter(c => c.status === 'active').map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2.5 px-1 rounded-lg hover:bg-surface-hover">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary truncate">{c.title}</p>
                <p className="text-[10px] text-text-secondary">{c.vendor} · {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-xs font-semibold">${c.value.toLocaleString()}</p>
                <StatusChip status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <div className="divide-y divide-border">
            {purchaseOrders.slice(0, 3).map((po) => (<PORow key={po.id} po={po} />))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open RFQs</CardTitle>
          </CardHeader>
          <div className="divide-y divide-border">
            {rfqs.filter(r => r.status === 'open').map((r) => (
              <RFQRow key={r.id} rfq={r} />
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

function VendorsTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? vendors : vendors.filter(v => v.status === filter)
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Vendors</CardTitle>
        <div className="flex gap-1">
          {['all', 'active', 'inactive', 'pending'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((v) => (
          <div key={v.id} className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">{v.name[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">{v.name}</p>
              <p className="text-[10px] text-text-secondary">{v.category} · {v.location} · {v.totalOrders} orders</p>
              <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5">
                <Star className="w-3 h-3 text-warning" />{v.rating} · {v.commodities.slice(0, 2).join(', ')}
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusChip status={v.status} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function RFQsTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? rfqs : rfqs.filter(r => r.status === filter)
  return (
    <Card>
      <CardHeader>
        <CardTitle>RFQs</CardTitle>
        <div className="flex gap-1">
          {['all', 'open', 'under_review', 'awarded', 'draft'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((r) => (<RFQRow key={r.id} rfq={r} detailed />))}
      </div>
    </Card>
  )
}

function OrdersTab() {
  const [filter, setFilter] = useState<string>('all')
  const filtered = filter === 'all' ? purchaseOrders : purchaseOrders.filter(p => p.status === filter)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
        <div className="flex gap-1">
          {['all', 'draft', 'sent', 'confirmed', 'in_transit', 'delivered'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
            >{s === 'all' ? 'All' : s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}</button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((po) => (<PORow key={po.id} po={po} detailed />))}
      </div>
    </Card>
  )
}

function RFQRow({ rfq, detailed = false }: { rfq: RFQ; detailed?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <FileText className="w-4 h-4 text-primary mt-1 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{rfq.title}</p>
          <StatusChip status={rfq.status} />
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
    <div className="flex items-start gap-3 py-2.5 px-1 hover:bg-surface-hover rounded-lg">
      <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center shrink-0">
        <ShoppingCart className="w-4 h-4 text-text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-text-primary truncate">{po.commodity}</p>
          <StatusChip status={po.status} />
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
