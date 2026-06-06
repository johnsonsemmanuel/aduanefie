import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { FilterBar } from '@/components/ui/FilterBar'
import { CommodityCard } from '@/components/trade/CommodityCard'
import { TradeOpportunityCard } from '@/components/trade/TradeOpportunityCard'
import { BuyerRequestCard } from '@/components/trade/BuyerRequestCard'
import { SupplierCard } from '@/components/trade/SupplierCard'
import { commodities, tradeOpportunities, buyerRequests, suppliers } from '@/data/mock'

const marketplaceTabs = [
  { id: 'commodities', label: 'Commodities', count: commodities.length },
  { id: 'opportunities', label: 'Trade Opportunities', count: tradeOpportunities.length },
  { id: 'buyer-requests', label: 'Buyer Requests', count: buyerRequests.length },
  { id: 'suppliers', label: 'Suppliers', count: suppliers.length },
]

const categoryFilters = [
  { key: 'category', label: 'Category', options: [
    { value: 'grains', label: 'Grains' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'produce', label: 'Produce' },
    { value: 'inputs', label: 'Inputs' },
    { value: 'processed', label: 'Processed' },
    { value: 'export', label: 'Export' },
  ]},
  { key: 'grade', label: 'Grade', options: [
    { value: 'Premium', label: 'Premium' },
    { value: 'A', label: 'Grade A' },
    { value: 'B', label: 'Grade B' },
    { value: 'Standard', label: 'Standard' },
  ]},
  { key: 'sort', label: 'Sort By', options: [
    { value: 'price_asc', label: 'Price: Low' },
    { value: 'price_desc', label: 'Price: High' },
    { value: 'change_desc', label: 'Price Change' },
    { value: 'volume_desc', label: 'Volume' },
  ]},
]

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('commodities')

  const renderContent = () => {
    switch (activeTab) {
      case 'commodities':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {commodities.map((c) => (
              <CommodityCard key={c.id} commodity={c} />
            ))}
          </div>
        )
      case 'opportunities':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tradeOpportunities.map((opp) => (
              <TradeOpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )
      case 'buyer-requests':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyerRequests.map((req) => (
              <BuyerRequestCard key={req.id} request={req} />
            ))}
          </div>
        )
      case 'suppliers':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suppliers.map((sup) => (
              <SupplierCard key={sup.id} supplier={sup} />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
        </CardHeader>
        <Tabs tabs={marketplaceTabs} activeId={activeTab} onChange={setActiveTab} className="px-4" />
        <div className="p-4">
          <FilterBar
            filters={categoryFilters}
            searchPlaceholder="Search commodities..."
          />
        </div>
      </Card>

      <div className="pt-1">
        {renderContent()}
      </div>
    </div>
  )
}
