import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { TrendingUp, CheckCircle, Clock, ShoppingCart } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill } from '@/components/ui/Pill'
import { Table } from '@/components/ui/Table'
import { TradeMetricsCard } from '@/components/trade/TradeMetricsCard'
import { OrderTimeline } from '@/components/trade/OrderTimeline'
import { orders, tradeMetrics, tradeOpportunities } from '@/data/mock'
import { PriceSparkline } from '@/components/trade/MarketPriceWidget'
import type { Order } from '@/types'
import { Button } from '@/components/ui/Button'

const orderColumns = [
  { key: 'orderNumber', header: 'Order', render: (o: Order) => <span className="text-xs font-mono font-medium">{o.orderNumber}</span> },
  { key: 'commodity', header: 'Commodity', render: (o: Order) => <span className="text-xs font-medium">{o.commodity}</span> },
  { key: 'quantity', header: 'Qty', render: (o: Order) => <span className="text-xs">{o.quantity} {o.unit}</span> },
  { key: 'total', header: 'Total', align: 'right' as const, render: (o: Order) => <span className="text-xs font-semibold">${o.total.toLocaleString()}</span> },
  { key: 'status', header: 'Status', render: (o: Order) => <StatusPill status={o.status} /> },
  { key: 'payment', header: 'Payment', render: (o: Order) => <StatusPill status={o.paymentStatus} /> },
  { key: 'delivery', header: 'Delivery', render: (o: Order) => <span className="text-xs text-text-secondary">{new Date(o.deliveryDate).toLocaleDateString()}</span> },
]

export function TradeDesk() {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'active', icon: Clock, label: 'Active' }, { id: 'all', icon: ShoppingCart, label: 'All' }, { id: 'completed', icon: CheckCircle, label: 'Completed' }, { id: 'opportunities', icon: TrendingUp, label: 'Trades' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  const filterOrders = (): Order[] => {
    switch (activeTab) {
      case 'active': return orders.filter(o => o.status !== 'delivered' && o.status !== 'completed')
      case 'completed': return orders.filter(o => o.status === 'delivered' || o.status === 'completed')
      default: return orders
    }
  }

  return (
    <PageShell
      tabs={[
        { id: 'active', icon: Clock, label: 'Active' },
        { id: 'all', icon: ShoppingCart, label: 'All' },
        { id: 'completed', icon: CheckCircle, label: 'Completed' },
        { id: 'opportunities', icon: TrendingUp, label: 'Trades' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="grid grid-cols-4 gap-2.5">
          <TradeMetricsCard metric={tradeMetrics[1]} />
          <TradeMetricsCard metric={tradeMetrics[2]} />
          <TradeMetricsCard metric={tradeMetrics[3]} />
          <TradeMetricsCard metric={tradeMetrics[0]} />
        </div>

        {activeTab !== 'opportunities' ? (
          <GlassCard padding="none">
            <GlassCardHeader className="px-4 pt-4">
              <GlassCardTitle>Trade Desk</GlassCardTitle>
            </GlassCardHeader>
            <div className="p-3">
              <Table
                columns={orderColumns}
                data={filterOrders()}
                onRowClick={setSelectedOrder}
                compact
              />
            </div>
          </GlassCard>
        ) : (
          <GlassCard padding="none">
            <GlassCardHeader className="px-4 pt-4">
              <GlassCardTitle>My Active Trades</GlassCardTitle>
            </GlassCardHeader>
            <div className="space-y-2 p-3 pt-0">
              {tradeOpportunities.filter(o => o.status === 'open' || o.status === 'negotiating').slice(0, 3).map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-semibold uppercase ${opp.type === 'buy' ? 'text-success' : 'text-commodity-inputs'}`}>
                        {opp.type}
                      </span>
                      <span className="text-xs font-medium truncate">{opp.commodity.name}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary">{opp.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold">${opp.price}</p>
                    <PriceSparkline change={opp.commodity.priceChange} changePercent={opp.commodity.priceChangePercent} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {selectedOrder && (
          <GlassCard padding="none">
            <GlassCardHeader className="px-4 pt-4">
              <GlassCardTitle>Order Timeline</GlassCardTitle>
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                Close
              </Button>
            </GlassCardHeader>
            <div className="px-4 pb-4">
              <div className="mb-3 pb-3 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-medium">{selectedOrder.orderNumber}</span>
                  <StatusPill status={selectedOrder.status} />
                </div>
                <p className="text-sm font-semibold">{selectedOrder.commodity}</p>
                <p className="text-xs text-text-secondary">{selectedOrder.quantity} {selectedOrder.unit} · ${selectedOrder.total.toLocaleString()}</p>
              </div>
              <OrderTimeline order={selectedOrder} />
            </div>
          </GlassCard>
        )}
      </div>
    </PageShell>
  )
}
