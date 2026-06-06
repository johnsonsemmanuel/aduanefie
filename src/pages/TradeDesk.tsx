import { useState } from 'react'
import { Package, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { StatusChip } from '@/components/ui/Chip'
import { Table } from '@/components/ui/Table'
import { TradeMetricsCard } from '@/components/trade/TradeMetricsCard'
import { OrderTimeline } from '@/components/trade/OrderTimeline'
import { Button } from '@/components/ui/Button'
import { orders, tradeMetrics, tradeOpportunities } from '@/data/mock'
import { PriceSparkline } from '@/components/trade/MarketPriceWidget'
import type { Order } from '@/types'

const deskTabs = [
  { id: 'active', label: 'Active Orders', count: orders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length, icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'all', label: 'All Orders', count: orders.length, icon: <Package className="w-3.5 h-3.5" /> },
  { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length, icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { id: 'opportunities', label: 'My Trades', count: tradeOpportunities.filter(o => o.status === 'open').length, icon: <TrendingUp className="w-3.5 h-3.5" /> },
]

const orderColumns = [
  { key: 'orderNumber', header: 'Order', render: (o: Order) => <span className="text-xs font-mono font-medium">{o.orderNumber}</span> },
  { key: 'commodity', header: 'Commodity', render: (o: Order) => <span className="text-xs font-medium">{o.commodity}</span> },
  { key: 'quantity', header: 'Qty', render: (o: Order) => <span className="text-xs">{o.quantity} {o.unit}</span> },
  { key: 'total', header: 'Total', align: 'right' as const, render: (o: Order) => <span className="text-xs font-semibold">${o.total.toLocaleString()}</span> },
  { key: 'status', header: 'Status', render: (o: Order) => <StatusChip status={o.status} /> },
  { key: 'payment', header: 'Payment', render: (o: Order) => <StatusChip status={o.paymentStatus} /> },
  { key: 'delivery', header: 'Delivery', render: (o: Order) => <span className="text-xs text-text-secondary">{new Date(o.deliveryDate).toLocaleDateString()}</span> },
]

export function TradeDesk() {
  const [activeTab, setActiveTab] = useState('active')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filterOrders = (): Order[] => {
    switch (activeTab) {
      case 'active': return orders.filter(o => o.status !== 'delivered' && o.status !== 'completed')
      case 'completed': return orders.filter(o => o.status === 'delivered' || o.status === 'completed')
      default: return orders
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2.5">
        <TradeMetricsCard metric={tradeMetrics[1]} />
        <TradeMetricsCard metric={tradeMetrics[2]} />
        <TradeMetricsCard metric={tradeMetrics[3]} />
        <TradeMetricsCard metric={tradeMetrics[0]} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trade Desk</CardTitle>
        </CardHeader>
        <Tabs tabs={deskTabs} activeId={activeTab} onChange={setActiveTab} className="px-4" />
        <div className="p-3">
          <Table
            columns={orderColumns}
            data={filterOrders()}
            onRowClick={setSelectedOrder}
            compact
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>My Active Trades</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {tradeOpportunities.filter(o => o.status === 'open' || o.status === 'negotiating').slice(0, 3).map((opp) => (
              <div key={opp.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-hover transition-colors">
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
        </Card>

        {selectedOrder && (
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </CardHeader>
            <div className="px-1">
              <div className="mb-3 pb-3 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-medium">{selectedOrder.orderNumber}</span>
                  <StatusChip status={selectedOrder.status} />
                </div>
                <p className="text-sm font-semibold">{selectedOrder.commodity}</p>
                <p className="text-xs text-text-secondary">{selectedOrder.quantity} {selectedOrder.unit} · ${selectedOrder.total.toLocaleString()}</p>
              </div>
              <OrderTimeline order={selectedOrder} />
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
