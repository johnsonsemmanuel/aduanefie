import { useState, useEffect, useMemo, useCallback } from 'react'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { ShoppingBag, TrendingUp, Users, Truck, RefreshCw, Plus } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { FilterBar } from '@/components/ui/FilterBar'
import { Button } from '@/components/ui/Button'
import { CreateOpportunityModal } from '@/components/trade/CreateOpportunityModal'
import { PlaceOrderModal } from '@/components/trade/PlaceOrderModal'
import { CommodityCard } from '@/components/trade/CommodityCard'
import { TradeOpportunityCard } from '@/components/trade/TradeOpportunityCard'
import { BuyerRequestCard } from '@/components/trade/BuyerRequestCard'
import { SupplierCard } from '@/components/trade/SupplierCard'
import { commodityApi, opportunityApi } from '@/lib/api'
import { buyerRequests, suppliers } from '@/data/mock'
import type { Commodity, TradeOpportunity, CommodityCategory, QualityGrade } from '@/types'
import type { CommodityDto, OpportunityDto } from '@/lib/api'

function toCommodity(dto: CommodityDto): Commodity {
  return {
    id: dto.id,
    name: dto.name,
    category: (dto.category || 'grains') as CommodityCategory,
    origin: dto.origin ?? '',
    grade: (dto.grade ?? 'Standard') as QualityGrade,
    price: dto.price ?? 0,
    unit: dto.unit,
    priceChange: dto.priceChange ?? 0,
    priceChangePercent: dto.priceChangePercent ?? 0,
    volume: dto.volume ?? 0,
    stock: dto.stock ?? 0,
    image: dto.image,
  }
}

function toOpportunity(dto: OpportunityDto): TradeOpportunity {
  return {
    id: dto.id,
    type: dto.type,
    commodity: toCommodity(dto.commodity),
    quantity: Number(dto.quantity),
    unit: dto.unit,
    price: Number(dto.price),
    totalValue: Number(dto.totalValue),
    location: dto.location,
    deliveryDate: dto.deliveryDate ?? '',
    status: dto.status as TradeOpportunity['status'],
    createdAt: dto.createdAt ?? new Date().toISOString(),
    trader: {
      id: dto.user.id,
      name: dto.user.name,
      type: (dto.user.type ?? 'trader') as TradeOpportunity['trader']['type'],
      location: dto.user.location ?? '',
      rating: dto.user.rating ?? 0,
      verified: dto.user.verified ?? false,
      avatar: dto.user.avatar,
    },
    quality: (dto.quality ?? 'Standard') as QualityGrade,
    description: dto.description ?? '',
  }
}

const tabs = [
  { id: 'commodities', icon: ShoppingBag, label: 'Commodities' },
  { id: 'opportunities', icon: TrendingUp, label: 'Trades' },
  { id: 'buyer-requests', icon: Users, label: 'Buyers' },
  { id: 'suppliers', icon: Truck, label: 'Suppliers' },
]

const categoryFilters = [
  { key: 'category', label: 'Category', options: [
    { value: 'Cocoa', label: 'Cocoa' }, { value: 'Grains', label: 'Grains' },
    { value: 'Legumes', label: 'Legumes' }, { value: 'Tubers', label: 'Tubers' },
    { value: 'Oil', label: 'Oil' }, { value: 'Nuts', label: 'Nuts' },
    { value: 'Coffee', label: 'Coffee' }, { value: 'Fruits', label: 'Fruits' },
    { value: 'Industrial', label: 'Industrial' }, { value: 'Other', label: 'Other' },
  ]},
  { key: 'grade', label: 'Grade', options: [
    { value: 'Premium', label: 'Premium' }, { value: 'A', label: 'Grade A' },
    { value: 'B', label: 'Grade B' }, { value: 'Standard', label: 'Standard' },
  ]},
  { key: 'sort', label: 'Sort By', options: [
    { value: 'price_asc', label: 'Price: Low' }, { value: 'price_desc', label: 'Price: High' },
    { value: 'change_desc', label: 'Price Change' }, { value: 'volume_desc', label: 'Volume' },
  ]},
]

export function Marketplace() {
  const [activeTab, setActiveTab] = useState('commodities')
  const [commodities, setCommodities] = useState<Commodity[]>([])
  const [opportunities, setOpportunities] = useState<TradeOpportunity[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [orderTarget, setOrderTarget] = useState<TradeOpportunity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [commodityRes, opportunityRes] = await Promise.all([
        commodityApi.list(),
        opportunityApi.list(),
      ])
      setCommodities(commodityRes.map(toCommodity))
      setOpportunities(opportunityRes.map(toOpportunity))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load marketplace data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredCommodities = useMemo(() => {
    let result = commodities
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) || c.origin.toLowerCase().includes(q)
      )
    }
    if (activeFilters.category) {
      result = result.filter(c => c.category === activeFilters.category)
    }
    if (activeFilters.grade) {
      result = result.filter(c => c.grade === activeFilters.grade)
    }
    if (activeFilters.sort) {
      result = [...result].sort((a, b) => {
        switch (activeFilters.sort) {
          case 'price_asc': return a.price - b.price
          case 'price_desc': return b.price - a.price
          case 'change_desc': return b.priceChangePercent - a.priceChangePercent
          case 'volume_desc': return b.volume - a.volume
          default: return 0
        }
      })
    }
    return result
  }, [commodities, searchQuery, activeFilters])

  const filteredOpportunities = useMemo(() => {
    let result = opportunities
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(o =>
        o.commodity.name.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      )
    }
    return result
  }, [opportunities, searchQuery])

  const handleSearch = useCallback((q: string) => setSearchQuery(q), [])
  const handleFilterChange = useCallback((key: string, value: string) => {
    setActiveFilters(prev => {
      const next = { ...prev }
      if (!value || value === 'all') delete next[key]
      else next[key] = value
      return next
    })
  }, [])
  const handleClear = useCallback(() => {
    setSearchQuery('')
    setActiveFilters({})
  }, [])

  if (loading) {
    return (
      <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <PageSkeleton type="grid" />
      </PageShell>
    )
  }

  if (error) {
    return (
      <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <p className="text-danger text-sm font-medium mb-1">Failed to load marketplace data</p>
            <p className="text-text-secondary text-xs mb-4">{error}</p>
            <Button size="sm" onClick={fetchData}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Retry
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'commodities':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredCommodities.map((c) => <CommodityCard key={c.id} commodity={c} />)}
          </div>
        )
      case 'opportunities':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">{filteredOpportunities.length} listing{filteredOpportunities.length !== 1 ? 's' : ''}</span>
              <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create Listing
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredOpportunities.map((opp) => <TradeOpportunityCard key={opp.id} opportunity={opp} onRespond={(id) => setOrderTarget(opportunities.find(o => o.id === id) || null)} />)}
            </div>
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-text-secondary">No listings found</p>
              </div>
            )}
          </div>
        )
      case 'buyer-requests':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {buyerRequests.map((req) => <BuyerRequestCard key={req.id} request={req} />)}
          </div>
        )
      case 'suppliers':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suppliers.map((sup) => <SupplierCard key={sup.id} supplier={sup} />)}
          </div>
        )
      default: return null
    }
  }

  return (
    <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-4 min-w-0">
        <GlassCard padding="none">
          <GlassCardHeader className="px-4 pt-4">
            <GlassCardTitle>Marketplace</GlassCardTitle>
          </GlassCardHeader>
          <div className="p-4">
            <FilterBar
              filters={categoryFilters}
              searchPlaceholder="Search commodities..."
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              onClear={handleClear}
            />
          </div>
        </GlassCard>
        <div className="pt-1">{renderContent()}</div>
      </div>
      <CreateOpportunityModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchData}
      />
      <PlaceOrderModal
        open={!!orderTarget}
        opportunity={orderTarget}
        onClose={() => setOrderTarget(null)}
        onOrderPlaced={fetchData}
      />
    </PageShell>
  )
}
