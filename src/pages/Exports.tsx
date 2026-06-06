import { Globe, Award, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { StatusChip } from '@/components/ui/Chip'
import { ExportOpportunityCard } from '@/components/trade/ExportOpportunityCard'
import { TradeMetricsCard } from '@/components/trade/TradeMetricsCard'
import { Table } from '@/components/ui/Table'
import { exportOpportunities, tradeMetrics } from '@/data/mock'
import type { ExportOpportunity } from '@/types'

const exportTabs = [
  { id: 'opportunities', label: 'Opportunities', count: exportOpportunities.length },
  { id: 'active', label: 'Active Exports', count: exportOpportunities.filter(e => e.status === 'confirmed' || e.status === 'negotiating').length },
  { id: 'completed', label: 'Completed' },
]

const exportColumns = [
  { key: 'commodity', header: 'Commodity', render: (e: ExportOpportunity) => (
    <span className="text-xs font-medium">{e.commodity}</span>
  )},
  { key: 'destination', header: 'Destination', render: (e: ExportOpportunity) => (
    <span className="text-xs">{e.destination}</span>
  )},
  { key: 'quantity', header: 'Qty', align: 'right' as const, render: (e: ExportOpportunity) => (
    <span className="text-xs">{e.quantity}t</span>
  )},
  { key: 'price', header: 'Price', align: 'right' as const, render: (e: ExportOpportunity) => (
    <span className="text-xs font-semibold">${e.price}</span>
  )},
  { key: 'total', header: 'Total', align: 'right' as const, render: (e: ExportOpportunity) => (
    <span className="text-xs font-semibold">${e.totalValue.toLocaleString()}</span>
  )},
  { key: 'incoterm', header: 'Incoterm', render: (e: ExportOpportunity) => (
    <span className="text-xs font-mono">{e.incoterm}</span>
  )},
  { key: 'status', header: 'Status', render: (e: ExportOpportunity) => <StatusChip status={e.status} />},
]

export function Exports() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <TradeMetricsCard metric={tradeMetrics[4]} />
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-commodity-export/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-commodity-export" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Export Value</p>
              <p className="text-sm font-bold">${exportOpportunities.reduce((s, e) => s + e.totalValue, 0).toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Award className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Certifications</p>
              <p className="text-sm font-bold">12</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Active RFQs</p>
              <p className="text-sm font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Opportunities</CardTitle>
        </CardHeader>
        <Tabs tabs={exportTabs} className="px-4" />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {exportOpportunities.map((eo) => (
          <ExportOpportunityCard key={eo.id} opportunity={eo} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Export Orders</CardTitle>
        </CardHeader>
        <div className="p-3">
          <Table columns={exportColumns} data={exportOpportunities} compact />
        </div>
      </Card>
    </div>
  )
}
