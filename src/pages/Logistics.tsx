import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { MapPin, Package, Truck, Warehouse } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { LogisticsCard } from '@/components/trade/LogisticsCard'
import { WarehouseCard } from '@/components/trade/WarehouseCard'
import { logistics, warehouses } from '@/data/mock'

export function Logistics() {
  const [activeTab, setActiveTab] = useState('shipments')
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'shipments', icon: Package, label: 'Shipments' }, { id: 'warehouses', icon: Warehouse, label: 'Warehouses' }, { id: 'tracking', icon: MapPin, label: 'Tracking' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="grid" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'shipments', icon: Package, label: 'Shipments' },
        { id: 'warehouses', icon: Warehouse, label: 'Warehouses' },
        { id: 'tracking', icon: MapPin, label: 'Tracking' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Package className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">In Transit</p>
                <p className="text-sm font-bold">{logistics.filter(l => l.status === 'in_transit' || l.status === 'dispatched').length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Truck className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Pending</p>
                <p className="text-sm font-bold">{logistics.filter(l => l.status === 'pending').length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard padding="sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-commodity-inputs/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-commodity-inputs" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Warehouses</p>
                <p className="text-sm font-bold">{warehouses.length}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {activeTab === 'shipments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {logistics.map((l) => (
              <LogisticsCard key={l.id} logistics={l} />
            ))}
          </div>
        )}

        {activeTab === 'warehouses' && (
          <>
            <h2 className="text-sm font-semibold text-text-primary pt-2">Warehouse Storage</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {warehouses.map((w) => (
                <WarehouseCard key={w.id} warehouse={w} />
              ))}
            </div>
          </>
        )}

        {activeTab === 'tracking' && (
          <GlassCard>
            <p className="text-sm text-text-secondary">Live tracking map coming soon.</p>
          </GlassCard>
        )}
      </div>
    </PageShell>
  )
}
