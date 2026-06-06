import { MapPin, Package, Truck } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { LogisticsCard } from '@/components/trade/LogisticsCard'
import { WarehouseCard } from '@/components/trade/WarehouseCard'
import { logistics, warehouses } from '@/data/mock'

const logisticsTabs = [
  { id: 'shipments', label: 'Shipments', count: logistics.length },
  { id: 'warehouses', label: 'Warehouses', count: warehouses.length },
  { id: 'tracking', label: 'Tracking' },
]

export function Logistics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">In Transit</p>
              <p className="text-sm font-bold">{logistics.filter(l => l.status === 'in_transit' || l.status === 'dispatched').length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Truck className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Pending</p>
              <p className="text-sm font-bold">{logistics.filter(l => l.status === 'pending').length}</p>
            </div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-commodity-inputs/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-commodity-inputs" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Warehouses</p>
              <p className="text-sm font-bold">{warehouses.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logistics & Storage</CardTitle>
        </CardHeader>
        <Tabs tabs={logisticsTabs} className="px-4" />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {logistics.map((l) => (
          <LogisticsCard key={l.id} logistics={l} />
        ))}
      </div>

      <h2 className="text-sm font-semibold text-text-primary pt-2">Warehouse Storage</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {warehouses.map((w) => (
          <WarehouseCard key={w.id} warehouse={w} />
        ))}
      </div>
    </div>
  )
}
