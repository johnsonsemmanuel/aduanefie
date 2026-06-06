import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { Globe, Award, TrendingUp, Package, CheckCircle } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatusPill } from '@/components/ui/Pill'
import { ExportOpportunityCard } from '@/components/trade/ExportOpportunityCard'
import { TradeMetricsCard } from '@/components/trade/TradeMetricsCard'
import { Table } from '@/components/ui/Table'
import { exportOpportunities, tradeMetrics } from '@/data/mock'
import type { ExportOpportunity } from '@/types'

const exportColumns = [
  { key: 'commodity', header: 'Commodity', render: (e: ExportOpportunity) => <span className="text-xs font-medium">{e.commodity}</span> },
  { key: 'destination', header: 'Destination', render: (e: ExportOpportunity) => <span className="text-xs">{e.destination}</span> },
  { key: 'quantity', header: 'Qty', align: 'right' as const, render: (e: ExportOpportunity) => <span className="text-xs">{e.quantity}t</span> },
  { key: 'price', header: 'Price', align: 'right' as const, render: (e: ExportOpportunity) => <span className="text-xs font-semibold">${e.price}</span> },
  { key: 'total', header: 'Total', align: 'right' as const, render: (e: ExportOpportunity) => <span className="text-xs font-semibold">${e.totalValue.toLocaleString()}</span> },
  { key: 'incoterm', header: 'Incoterm', render: (e: ExportOpportunity) => <span className="text-xs font-mono">{e.incoterm}</span> },
  { key: 'status', header: 'Status', render: (e: ExportOpportunity) => <StatusPill status={e.status} /> },
]

export function Exports() {
  const [activeTab, setActiveTab] = useState('opportunities')
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'opportunities', icon: Globe, label: 'Opportunities' }, { id: 'active', icon: Package, label: 'Active' }, { id: 'completed', icon: CheckCircle, label: 'Completed' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="grid" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'opportunities', icon: Globe, label: 'Opportunities' },
        { id: 'active', icon: Package, label: 'Active' },
        { id: 'completed', icon: CheckCircle, label: 'Completed' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <TradeMetricsCard metric={tradeMetrics[4]} />
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-commodity-export/10 flex items-center justify-center">
                <Globe className="w-4 h-4 text-commodity-export" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">Export Value</p>
                <p className="text-sm font-bold">${exportOpportunities.reduce((s, e) => s + e.totalValue, 0).toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Award className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">Certifications</p>
                <p className="text-sm font-bold">12</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">Active RFQs</p>
                <p className="text-sm font-bold">5</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {activeTab !== 'completed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {exportOpportunities
              .filter(e => activeTab === 'active' ? (e.status === 'confirmed' || e.status === 'negotiating') : true)
              .map((eo) => (
                <ExportOpportunityCard key={eo.id} opportunity={eo} />
              ))}
          </div>
        )}

        <GlassCard padding="none">
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-text-primary">All Export Orders</h3>
          </div>
          <div className="p-3">
            <Table columns={exportColumns} data={exportOpportunities} compact />
          </div>
        </GlassCard>
      </div>
    </PageShell>
  )
}
