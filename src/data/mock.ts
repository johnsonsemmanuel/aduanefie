import type {
  Commodity, TradeOpportunity, BuyerRequest, Supplier,
  Warehouse, Logistics, ExportOpportunity, MarketPrice,
  Order, TradeMetric, Activity, MarketAlert, WatchlistItem,
  Trader
} from '@/types'

export const traders: Trader[] = [
  { id: 't1', name: 'Emmanuel Johnson', type: 'farmer', location: 'Kumasi, Ghana', rating: 4.8, verified: true },
  { id: 't2', name: 'Amara Okafor', type: 'aggregator', location: 'Nairobi, Kenya', rating: 4.6, verified: true },
  { id: 't3', name: 'Kwame Asante', type: 'processor', location: 'Accra, Ghana', rating: 4.9, verified: true },
  { id: 't4', name: 'Fatima Diallo', type: 'exporter', location: 'Lagos, Nigeria', rating: 4.7, verified: true },
  { id: 't5', name: 'James Mwangi', type: 'buyer', location: 'Mombasa, Kenya', rating: 4.5, verified: true },
  { id: 't6', name: 'Grace Okonkwo', type: 'supplier', location: 'Enugu, Nigeria', rating: 4.4, verified: true },
  { id: 't7', name: 'Ibrahim Sesay', type: 'logistics', location: 'Freetown, Sierra Leone', rating: 4.3, verified: false },
  { id: 't8', name: 'Ngozi Eze', type: 'exporter', location: 'Abidjan, Côte d\'Ivoire', rating: 4.8, verified: true },
]

export const commodities: Commodity[] = [
  { id: 'c1', name: 'Premium Cocoa Beans', category: 'export', origin: 'Kumasi, Ghana', grade: 'Premium', price: 2850, unit: 'tonne', priceChange: 120, priceChangePercent: 4.4, volume: 15000, stock: 500 },
  { id: 'c2', name: 'Fair Trade Coffee Arabica', category: 'export', origin: 'Jimma, Ethiopia', grade: 'A', price: 4200, unit: 'tonne', priceChange: -80, priceChangePercent: -1.9, volume: 8900, stock: 320 },
  { id: 'c3', name: 'Cassava (Fresh)', category: 'produce', origin: 'Benin City, Nigeria', grade: 'A', price: 450, unit: 'tonne', priceChange: 25, priceChangePercent: 5.9, volume: 42000, stock: 1200 },
  { id: 'c4', name: 'Maize (Yellow)', category: 'grains', origin: 'Nakuru, Kenya', grade: 'B', price: 280, unit: 'tonne', priceChange: -15, priceChangePercent: -5.1, volume: 68000, stock: 2500 },
  { id: 'c5', name: 'Sesame Seeds', category: 'export', origin: 'Khartoum, Sudan', grade: 'A', price: 1850, unit: 'tonne', priceChange: 90, priceChangePercent: 5.1, volume: 12000, stock: 800 },
  { id: 'c6', name: 'Palm Oil (Refined)', category: 'processed', origin: 'Port Harcourt, Nigeria', grade: 'Standard', price: 980, unit: 'tonne', priceChange: 45, priceChangePercent: 4.8, volume: 34000, stock: 1500 },
  { id: 'c7', name: 'Soya Beans', category: 'grains', origin: 'Lusaka, Zambia', grade: 'A', price: 520, unit: 'tonne', priceChange: 30, priceChangePercent: 6.1, volume: 28000, stock: 1800 },
  { id: 'c8', name: 'Organic Fertilizer NPK', category: 'inputs', origin: 'Dar es Salaam, Tanzania', grade: 'Standard', price: 320, unit: 'bag', priceChange: 10, priceChangePercent: 3.2, volume: 50000, stock: 5000 },
  { id: 'c9', name: 'Broiler Day-Old Chicks', category: 'livestock', origin: 'Ibadan, Nigeria', grade: 'Premium', price: 850, unit: 'box', priceChange: -20, priceChangePercent: -2.3, volume: 15000, stock: 2000 },
  { id: 'c10', name: 'Cashew Nuts (Raw)', category: 'export', origin: 'Bissau, Guinea-Bissau', grade: 'A', price: 2100, unit: 'tonne', priceChange: 150, priceChangePercent: 7.7, volume: 9500, stock: 600 },
  { id: 'c11', name: 'Shea Butter (Unrefined)', category: 'export', origin: 'Tamale, Ghana', grade: 'Standard', price: 1650, unit: 'tonne', priceChange: 85, priceChangePercent: 5.4, volume: 7200, stock: 400 },
  { id: 'c12', name: 'Fresh Ginger', category: 'produce', origin: 'Jos, Nigeria', grade: 'A', price: 680, unit: 'tonne', priceChange: 40, priceChangePercent: 6.3, volume: 11000, stock: 350 },
]

export const marketPrices: MarketPrice[] = [
  { id: 'mp1', commodity: 'Cocoa Beans', current: 2850, open: 2730, high: 2890, low: 2710, change: 120, changePercent: 4.4, volume: 15000, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'up' },
  { id: 'mp2', commodity: 'Coffee Arabica', current: 4200, open: 4280, high: 4320, low: 4180, change: -80, changePercent: -1.9, volume: 8900, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'down' },
  { id: 'mp3', commodity: 'Maize', current: 280, open: 295, high: 300, low: 275, change: -15, changePercent: -5.1, volume: 68000, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'down' },
  { id: 'mp4', commodity: 'Soya Beans', current: 520, open: 490, high: 530, low: 485, change: 30, changePercent: 6.1, volume: 28000, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'up' },
  { id: 'mp5', commodity: 'Palm Oil', current: 980, open: 935, high: 995, low: 930, change: 45, changePercent: 4.8, volume: 34000, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'up' },
  { id: 'mp6', commodity: 'Cashew Nuts', current: 2100, open: 1950, high: 2150, low: 1930, change: 150, changePercent: 7.7, volume: 9500, unit: 'tonne', updatedAt: '2026-06-06T10:30:00Z', trend: 'up' },
]

export const tradeOpportunities: TradeOpportunity[] = [
  { id: 'to1', type: 'sell', commodity: commodities[0], quantity: 50, unit: 'tonne', price: 2900, totalValue: 145000, location: 'Kumasi, Ghana', deliveryDate: '2026-07-15', status: 'open', createdAt: '2026-06-01', trader: traders[0], quality: 'Premium', description: 'Premium Ghanaian cocoa beans, fermented and dried. Suitable for fine chocolate production.' },
  { id: 'to2', type: 'sell', commodity: commodities[2], quantity: 100, unit: 'tonne', price: 470, totalValue: 47000, location: 'Benin City, Nigeria', deliveryDate: '2026-06-30', status: 'open', createdAt: '2026-06-02', trader: traders[1], quality: 'A', description: 'Fresh cassava from trusted growers. Harvested within the week.' },
  { id: 'to3', type: 'buy', commodity: commodities[3], quantity: 500, unit: 'tonne', price: 265, totalValue: 132500, location: 'Nairobi, Kenya', deliveryDate: '2026-07-10', status: 'negotiating', createdAt: '2026-06-03', trader: traders[4], quality: 'B', description: 'Looking for yellow maize for processing. Need consistent supply.' },
  { id: 'to4', type: 'sell', commodity: commodities[4], quantity: 30, unit: 'tonne', price: 1920, totalValue: 57600, location: 'Khartoum, Sudan', deliveryDate: '2026-07-20', status: 'open', createdAt: '2026-06-04', trader: traders[5], quality: 'A', description: 'High-grade Sudanese sesame seeds, mechanically cleaned.' },
  { id: 'to5', type: 'buy', commodity: commodities[7], quantity: 2000, unit: 'bags', price: 300, totalValue: 600000, location: 'Dar es Salaam, Tanzania', deliveryDate: '2026-07-05', status: 'confirmed', createdAt: '2026-05-28', trader: traders[2], quality: 'Standard', description: 'Bulk NPK fertilizer for cooperative. Prefer blended 15:15:15.' },
  { id: 'to6', type: 'sell', commodity: commodities[9], quantity: 20, unit: 'tonne', price: 2250, totalValue: 45000, location: 'Bissau, Guinea-Bissau', deliveryDate: '2026-08-01', status: 'open', createdAt: '2026-06-05', trader: traders[8], quality: 'A', description: 'Raw cashew nuts from Guinea-Bissau. High outturn percentage.' },
  { id: 'to7', type: 'buy', commodity: commodities[6], quantity: 300, unit: 'tonne', price: 500, totalValue: 150000, location: 'Lusaka, Zambia', deliveryDate: '2026-07-25', status: 'open', createdAt: '2026-06-06', trader: traders[3], quality: 'A', description: 'Need GMO-free soya beans for export to EU market.' },
]

export const buyerRequests: BuyerRequest[] = [
  { id: 'br1', commodity: 'Premium Cocoa Beans', quantity: 100, unit: 'tonne', targetPrice: 2750, maxPrice: 2950, location: 'Amsterdam, Netherlands', deadline: '2026-07-01', status: 'active', responses: 8, createdAt: '2026-06-01', buyer: traders[4] },
  { id: 'br2', commodity: 'Organic Shea Butter', quantity: 25, unit: 'tonne', targetPrice: 1500, maxPrice: 1700, location: 'Lagos, Nigeria', deadline: '2026-06-25', status: 'active', responses: 4, createdAt: '2026-06-02', buyer: traders[3] },
  { id: 'br3', commodity: 'Fresh Ginger', quantity: 40, unit: 'tonne', targetPrice: 620, maxPrice: 700, location: 'London, UK', deadline: '2026-07-15', status: 'active', responses: 12, createdAt: '2026-06-03', buyer: traders[5] },
  { id: 'br4', commodity: 'Maize (Yellow)', quantity: 1000, unit: 'tonne', targetPrice: 250, maxPrice: 290, location: 'Johannesburg, SA', deadline: '2026-07-10', status: 'active', responses: 6, createdAt: '2026-06-04', buyer: traders[4] },
  { id: 'br5', commodity: 'Cashew Nuts', quantity: 50, unit: 'tonne', targetPrice: 2000, maxPrice: 2200, location: 'Mumbai, India', deadline: '2026-07-20', status: 'filled', responses: 15, createdAt: '2026-05-15', buyer: traders[3] },
]

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Ghana Cocoa Board Coop', location: 'Kumasi, Ghana', rating: 4.8, totalDeals: 342, verified: true, commodities: ['Cocoa Beans', 'Shea Butter'], minOrder: 10, responseTime: '< 2hrs', joinedDate: '2023-01' },
  { id: 's2', name: 'East Africa Grains Ltd', location: 'Nairobi, Kenya', rating: 4.6, totalDeals: 218, verified: true, commodities: ['Maize', 'Soya Beans', 'Wheat'], minOrder: 50, responseTime: '< 1hr', joinedDate: '2023-03' },
  { id: 's3', name: 'West African Produce Co', location: 'Lagos, Nigeria', rating: 4.7, totalDeals: 156, verified: true, commodities: ['Cassava', 'Palm Oil', 'Ginger'], minOrder: 20, responseTime: '< 3hrs', joinedDate: '2024-02' },
  { id: 's4', name: 'Sahel Commodities Export', location: 'Khartoum, Sudan', rating: 4.5, totalDeals: 89, verified: true, commodities: ['Sesame Seeds', 'Gum Arabic'], minOrder: 15, responseTime: '< 4hrs', joinedDate: '2024-06' },
  { id: 's5', name: 'Guinea Bissau Cashew Coop', location: 'Bissau, Guinea-Bissau', rating: 4.4, totalDeals: 67, verified: false, commodities: ['Cashew Nuts'], minOrder: 10, responseTime: '< 6hrs', joinedDate: '2024-09' },
]

export const warehouses: Warehouse[] = [
  { id: 'w1', name: 'Kumasi Central Storage', location: 'Kumasi, Ghana', capacity: 5000, used: 3200, available: 1800, type: 'dry', commodities: ['Cocoa', 'Shea', 'Grains'], dailyRate: 0.50, rating: 4.7, certifications: ['ISO 22000', 'GLOBALG.A.P.'] },
  { id: 'w2', name: 'Mombasa Cold Storage', location: 'Mombasa, Kenya', capacity: 2000, used: 1500, available: 500, type: 'cold', commodities: ['Produce', 'Dairy', 'Meat'], dailyRate: 1.20, rating: 4.8, certifications: ['HACCP', 'ISO 22000'] },
  { id: 'w3', name: 'Lagos Port Warehouse', location: 'Apapa, Lagos, Nigeria', capacity: 10000, used: 7800, available: 2200, type: 'dry', commodities: ['Grains', 'Export', 'Inputs'], dailyRate: 0.35, rating: 4.5, certifications: ['ISO 9001'] },
  { id: 'w4', name: 'Nakuru Grain Silos', location: 'Nakuru, Kenya', capacity: 8000, used: 6000, available: 2000, type: 'dry', commodities: ['Maize', 'Wheat', 'Soya'], dailyRate: 0.30, rating: 4.6, certifications: [] },
  { id: 'w5', name: 'Dar es Salaam Fertilizer Hub', location: 'Dar es Salaam, Tanzania', capacity: 3000, used: 500, available: 2500, type: 'dry', commodities: ['Fertilizer', 'Inputs'], dailyRate: 0.40, rating: 4.4, certifications: ['ISO 9001'] },
]

export const logistics: Logistics[] = [
  { id: 'l1', provider: 'TransAfrica Logistics', type: 'truck', origin: 'Kumasi, Ghana', destination: 'Tema Port, Ghana', departureDate: '2026-06-10', arrivalDate: '2026-06-12', capacity: 30, usedCapacity: 25, rate: 1200, status: 'dispatched', trackingId: 'TAF-2026-001' },
  { id: 'l2', provider: 'East Africa Express', type: 'train', origin: 'Nairobi, Kenya', destination: 'Mombasa Port, Kenya', departureDate: '2026-06-08', arrivalDate: '2026-06-09', capacity: 500, usedCapacity: 380, rate: 8500, status: 'in_transit', trackingId: 'EAX-2026-045' },
  { id: 'l3', provider: 'West African Shipping', type: 'ship', origin: 'Tema Port, Ghana', destination: 'Rotterdam, Netherlands', departureDate: '2026-06-15', arrivalDate: '2026-07-05', capacity: 2000, usedCapacity: 1500, rate: 45000, status: 'pending', trackingId: 'WAS-2026-112' },
  { id: 'l4', provider: 'Nigeria Haulage Co', type: 'truck', origin: 'Benin City, Nigeria', destination: 'Apapa Port, Nigeria', departureDate: '2026-06-09', arrivalDate: '2026-06-10', capacity: 28, usedCapacity: 28, rate: 950, status: 'in_transit', trackingId: 'NHC-2026-078' },
  { id: 'l5', provider: 'Sudan Logistics Corp', type: 'truck', origin: 'Khartoum, Sudan', destination: 'Port Sudan, Sudan', departureDate: '2026-06-12', arrivalDate: '2026-06-14', capacity: 25, usedCapacity: 15, rate: 1800, status: 'pending', trackingId: 'SLC-2026-034' },
]

export const exportOpportunities: ExportOpportunity[] = [
  { id: 'eo1', commodity: 'Premium Cocoa Beans', quantity: 100, unit: 'tonne', price: 2950, totalValue: 295000, origin: 'Tema, Ghana', destination: 'Rotterdam, Netherlands', incoterm: 'CIF', quality: 'Premium', certification: ['Fair Trade', 'Organic', 'Rainforest Alliance'], deadline: '2026-07-20', status: 'open', buyer: traders[4] },
  { id: 'eo2', commodity: 'Coffee Arabica', quantity: 45, unit: 'tonne', price: 4350, totalValue: 195750, origin: 'Mombasa, Kenya', destination: 'Hamburg, Germany', incoterm: 'FOB', quality: 'A', certification: ['Fair Trade', 'Organic'], deadline: '2026-08-01', status: 'negotiating', buyer: traders[8] },
  { id: 'eo3', commodity: 'Cashew Nuts', quantity: 50, unit: 'tonne', price: 2250, totalValue: 112500, origin: 'Bissau, Guinea-Bissau', destination: 'Mumbai, India', incoterm: 'CIF', quality: 'A', certification: ['GLOBALG.A.P.'], deadline: '2026-07-30', status: 'open', buyer: traders[3] },
  { id: 'eo4', commodity: 'Sesame Seeds', quantity: 30, unit: 'tonne', price: 1980, totalValue: 59400, origin: 'Port Sudan, Sudan', destination: 'Shanghai, China', incoterm: 'FOB', quality: 'A', certification: ['HACCP'], deadline: '2026-07-15', status: 'confirmed', buyer: traders[5] },
  { id: 'eo5', commodity: 'Shea Butter', quantity: 20, unit: 'tonne', price: 1750, totalValue: 35000, origin: 'Tema, Ghana', destination: 'New York, USA', incoterm: 'CIF', quality: 'Standard', certification: ['Organic'], deadline: '2026-08-10', status: 'open', buyer: traders[8] },
]

export const orders: Order[] = [
  { id: 'o1', orderNumber: 'ORD-2026-001', commodity: 'NPK Fertilizer', quantity: 2000, unit: 'bags', total: 600000, status: 'in_transit', paymentStatus: 'completed', supplier: 'Dar Agro Inputs', buyer: 'Midwest Farmers Coop', createdAt: '2026-05-28', updatedAt: '2026-06-05', deliveryDate: '2026-07-05', tracking: ['Dispatched from Dar', 'Arrived at Mwanza Hub', 'In transit to buyer'], items: [{ id: 'oi1', commodity: 'NPK 15:15:15', quantity: 2000, unit: 'bags', price: 300, total: 600000 }] },
  { id: 'o2', orderNumber: 'ORD-2026-002', commodity: 'Premium Cocoa Beans', quantity: 25, unit: 'tonne', total: 72500, status: 'processing', paymentStatus: 'partial', supplier: 'Ghana Cocoa Board Coop', buyer: 'European Chocolate Co', createdAt: '2026-06-01', updatedAt: '2026-06-04', deliveryDate: '2026-07-15', tracking: ['Order confirmed', 'Quality inspection pending'], items: [{ id: 'oi2', commodity: 'Premium Cocoa Beans', quantity: 25, unit: 'tonne', price: 2900, total: 72500 }] },
  { id: 'o3', orderNumber: 'ORD-2026-003', commodity: 'Cassava', quantity: 80, unit: 'tonne', total: 37600, status: 'delivered', paymentStatus: 'completed', supplier: 'West African Produce Co', buyer: 'Lagos Food Processors', createdAt: '2026-05-20', updatedAt: '2026-06-02', deliveryDate: '2026-06-01', tracking: ['Order placed', 'Harvested', 'In transit', 'Delivered'], items: [{ id: 'oi3', commodity: 'Fresh Cassava', quantity: 80, unit: 'tonne', price: 470, total: 37600 }] },
  { id: 'o4', orderNumber: 'ORD-2026-004', commodity: 'Soya Beans', quantity: 150, unit: 'tonne', total: 78000, status: 'pending', paymentStatus: 'pending', supplier: 'East Africa Grains Ltd', buyer: 'Livestock Feed Corp', createdAt: '2026-06-05', updatedAt: '2026-06-05', deliveryDate: '2026-07-01', tracking: ['Awaiting confirmation'], items: [{ id: 'oi4', commodity: 'Soya Beans', quantity: 150, unit: 'tonne', price: 520, total: 78000 }] },
]

export const tradeMetrics: TradeMetric[] = [
  { label: 'Total Trade Volume', value: '₵2.4M', change: 12.5, changePercent: 12.5, trend: 'up' },
  { label: 'Active Orders', value: '18', change: 3, changePercent: 20, trend: 'up' },
  { label: 'Supplier Response Rate', value: '94%', change: 2.1, changePercent: 2.1, trend: 'up' },
  { label: 'Avg. Deal Size', value: '₵45,200', change: -5.3, changePercent: -5.3, trend: 'down' },
  { label: 'Export Orders', value: '7', change: 2, changePercent: 40, trend: 'up' },
  { label: 'Warehouse Utilization', value: '72%', change: 8, changePercent: 8, trend: 'up' },
]

export const activities: Activity[] = [
  { id: 'a1', type: 'trade', message: 'New buy request for Cocoa Beans from European Chocolate Co', timestamp: '2026-06-06T09:30:00Z', status: 'open' },
  { id: 'a2', type: 'order', message: 'Order ORD-2026-001 marked as in transit', timestamp: '2026-06-06T08:15:00Z', status: 'in_transit' },
  { id: 'a3', type: 'logistics', message: 'Truck TAF-2026-001 departed Kumasi to Tema Port', timestamp: '2026-06-06T07:00:00Z', status: 'dispatched' },
  { id: 'a4', type: 'payment', message: 'Payment of ₵78,000 received for ORD-2026-003', timestamp: '2026-06-05T16:45:00Z', status: 'completed' },
  { id: 'a5', type: 'alert', message: 'Price surge: Cashew nuts up 7.7% in 24hrs', timestamp: '2026-06-05T14:30:00Z', status: 'warning' },
  { id: 'a6', type: 'trade', message: 'New supplier joined: Sahel Commodities Export', timestamp: '2026-06-05T11:00:00Z', status: 'info' },
  { id: 'a7', type: 'logistics', message: 'Ship WAS-2026-112 scheduled for Rotterdam departure', timestamp: '2026-06-04T10:00:00Z', status: 'pending' },
  { id: 'a8', type: 'message', message: 'Negotiation started on Cocoa Beans trade #to1', timestamp: '2026-06-04T09:20:00Z' },
]

export const marketAlerts: MarketAlert[] = [
  { id: 'ma1', commodity: 'Cashew Nuts', type: 'price_surge', message: 'Cashew nuts up 7.7% - now at $2,100/tonne', severity: 'warning', timestamp: '2026-06-05T14:30:00Z', read: false },
  { id: 'ma2', commodity: 'Maize', type: 'price_drop', message: 'Maize down 5.1% - now at $280/tonne', severity: 'info', timestamp: '2026-06-05T10:15:00Z', read: false },
  { id: 'ma3', commodity: 'Premium Cocoa Beans', type: 'target_met', message: 'Cocoa hit your target price of $2,850/tonne', severity: 'info', timestamp: '2026-06-04T16:00:00Z', read: true },
  { id: 'ma4', commodity: 'Shea Butter', type: 'volume_spike', message: 'Trading volume for Shea Butter up 200% this week', severity: 'info', timestamp: '2026-06-04T11:30:00Z', read: true },
  { id: 'ma5', commodity: 'Soya Beans', type: 'weather_alert', message: 'Heavy rains expected in Zambia - possible supply disruption', severity: 'critical', timestamp: '2026-06-06T06:00:00Z', read: false },
]

export const watchlist: WatchlistItem[] = [
  { id: 'wl1', commodity: 'Premium Cocoa Beans', targetPrice: 3000, currentPrice: 2850, alertEnabled: true },
  { id: 'wl2', commodity: 'Cashew Nuts', targetPrice: 2000, currentPrice: 2100, alertEnabled: true },
  { id: 'wl3', commodity: 'Maize', targetPrice: 250, currentPrice: 280, alertEnabled: false },
  { id: 'wl4', commodity: 'Soya Beans', targetPrice: 550, currentPrice: 520, alertEnabled: true },
  { id: 'wl5', commodity: 'Coffee Arabica', targetPrice: 4000, currentPrice: 4200, alertEnabled: false },
]

export const currentUser: Trader = {
  id: 't1',
  name: 'Emmanuel Johnson',
  type: 'farmer',
  location: 'Kumasi, Ghana',
  rating: 4.8,
  verified: true,
}
