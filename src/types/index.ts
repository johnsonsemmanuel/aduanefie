export type TradeStatus = 'open' | 'negotiating' | 'confirmed' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'completed'
export type LogisticsStatus = 'pending' | 'dispatched' | 'in_transit' | 'arrived' | 'delivered'
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'overdue'
export type QualityGrade = 'A' | 'B' | 'C' | 'Premium' | 'Standard'
export type CommodityCategory = 'grains' | 'livestock' | 'produce' | 'inputs' | 'processed' | 'export'

export interface Commodity {
  id: string
  name: string
  category: CommodityCategory
  origin: string
  grade: QualityGrade
  price: number
  unit: string
  priceChange: number
  priceChangePercent: number
  volume: number
  moisture?: number
  purity?: number
  stock: number
  image?: string
}

export interface TradeOpportunity {
  id: string
  type: 'buy' | 'sell'
  commodity: Commodity
  quantity: number
  unit: string
  price: number
  totalValue: number
  location: string
  deliveryDate: string
  status: TradeStatus
  createdAt: string
  trader: Trader
  quality: QualityGrade
  description: string
}

export interface BuyerRequest {
  id: string
  commodity: string
  quantity: number
  unit: string
  targetPrice: number
  maxPrice: number
  location: string
  deadline: string
  status: 'active' | 'filled' | 'expired'
  responses: number
  createdAt: string
  buyer: Trader
}

export interface Supplier {
  id: string
  name: string
  location: string
  rating: number
  totalDeals: number
  verified: boolean
  commodities: string[]
  minOrder: number
  responseTime: string
  joinedDate: string
  avatar?: string
}

export interface Trader {
  id: string
  name: string
  type: 'farmer' | 'aggregator' | 'processor' | 'exporter' | 'buyer' | 'supplier' | 'logistics'
  location: string
  rating: number
  verified: boolean
  avatar?: string
}

export interface Warehouse {
  id: string
  name: string
  location: string
  capacity: number
  used: number
  available: number
  type: 'dry' | 'cold' | 'general'
  commodities: string[]
  dailyRate: number
  rating: number
  certifications: string[]
}

export interface Logistics {
  id: string
  provider: string
  type: 'truck' | 'train' | 'ship' | 'storage'
  origin: string
  destination: string
  departureDate: string
  arrivalDate: string
  capacity: number
  usedCapacity: number
  rate: number
  status: LogisticsStatus
  trackingId: string
}

export interface ExportOpportunity {
  id: string
  commodity: string
  quantity: number
  unit: string
  price: number
  totalValue: number
  origin: string
  destination: string
  incoterm: string
  quality: QualityGrade
  certification: string[]
  deadline: string
  status: TradeStatus
  buyer: Trader
}

export interface MarketPrice {
  id: string
  commodity: string
  current: number
  open: number
  high: number
  low: number
  change: number
  changePercent: number
  volume: number
  unit: string
  updatedAt: string
  trend: 'up' | 'down' | 'stable'
}

export interface Order {
  id: string
  orderNumber: string
  commodity: string
  quantity: number
  unit: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  supplier: string
  buyer: string
  createdAt: string
  updatedAt: string
  deliveryDate: string
  tracking: string[]
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  commodity: string
  quantity: number
  unit: string
  price: number
  total: number
}

export interface TradeMetric {
  label: string
  value: string
  change: number
  changePercent: number
  trend: 'up' | 'down'
}

export interface Activity {
  id: string
  type: 'trade' | 'order' | 'logistics' | 'payment' | 'alert' | 'message'
  message: string
  timestamp: string
  status?: string
  userId?: string
}

export interface MarketAlert {
  id: string
  commodity: string
  type: 'price_drop' | 'price_surge' | 'target_met' | 'volume_spike' | 'weather_alert'
  message: string
  severity: 'info' | 'warning' | 'critical'
  timestamp: string
  read: boolean
}

export interface WatchlistItem {
  id: string
  commodity: string
  targetPrice: number
  currentPrice: number
  alertEnabled: boolean
}
