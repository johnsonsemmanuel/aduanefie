import type { OSModule, SystemMetric, SystemEvent, SystemStatus, MarketTicker, CommodityDetail, WeatherZone, DemandData, MarketReport } from '@/types'

export const agriModules: OSModule[] = [
  { id: 'trade-engine', name: 'Trade Engine', description: 'Commodity trading, RFQs, contracts, bidding', icon: 'TrendingUp', color: '#2E7D32', path: '/marketplace', badge: 7, layer: 2, status: 'active' },
  { id: 'market-intel', name: 'Market Intel', description: 'Prices, trends, forecasts, weather intelligence', icon: 'BarChart3', color: '#2980B9', path: '/market-intel', badge: 3, layer: 6, status: 'active' },
  { id: 'logistics', name: 'Logistics Hub', description: 'Transport, fleet, delivery tracking', icon: 'Truck', color: '#F57C00', path: '/logistics', badge: 2, layer: 3, status: 'active' },
  { id: 'finance', name: 'Finance Hub', description: 'Wallets, payments, loans, trade finance', icon: 'Wallet', color: '#8E44AD', path: '/finance', layer: 5, status: 'active' },
  { id: 'storage', name: 'Storage Hub', description: 'Warehouses, cold rooms, inventory', icon: 'Warehouse', color: '#D4A853', path: '/logistics', layer: 4, status: 'active' },
  { id: 'cooperative', name: 'Cooperative Hub', description: 'Groups, shared resources, collective trading', icon: 'Users', color: '#C0392B', path: '/cooperative', layer: 1, status: 'beta' },
  { id: 'export', name: 'Export Hub', description: 'Export docs, compliance, international trade', icon: 'Globe', color: '#27AE60', path: '/exports', badge: 4, layer: 2, status: 'active' },
  { id: 'ai', name: 'AI Hub', description: 'Trade assistant, farm advisor, analytics', icon: 'Brain', color: '#3B2A1E', path: '/ai', layer: 9, status: 'beta' },
  { id: 'procurement', name: 'Procurement Hub', description: 'Sourcing, vendor management, contracts', icon: 'ClipboardCheck', color: '#5A4231', path: '/procurement', layer: 2, status: 'active' },
  { id: 'business', name: 'Business Hub', description: 'CRM, projects, tasks, accounting', icon: 'Building2', color: '#2E7D32', path: '/business', layer: 7, status: 'active' },
  { id: 'developer', name: 'Developer Hub', description: 'APIs, webhooks, plugins, SDKs', icon: 'Code2', color: '#2980B9', path: '/developer', layer: 8, status: 'beta' },
  { id: 'admin', name: 'Administration', description: 'Users, permissions, system config', icon: 'Shield', color: '#D32F2F', path: '/admin', layer: 1, status: 'active' },
]

export const systemStatuses: SystemStatus[] = [
  { id: 'ss1', label: 'System Status', status: 'online', value: 'All Systems Operational' },
  { id: 'ss2', label: 'Database', status: 'online', value: 'Connected' },
  { id: 'ss3', label: 'Sync Status', status: 'sync', value: 'Last synced 2m ago' },
  { id: 'ss4', label: 'API Gateway', status: 'online', value: '99.9% uptime' },
]

export const systemMetrics: SystemMetric[] = [
  { id: 'sm1', label: 'Platform Trade Volume', value: '$4.2M', secondary: '+12.5% vs last week', trend: 'up', color: 'text-success' },
  { id: 'sm2', label: 'Active Orders', value: '23', secondary: '7 awaiting action', trend: 'up', color: 'text-commodity-export' },
  { id: 'sm3', label: 'Active Users', value: '1,847', secondary: '142 online now', trend: 'up', color: 'text-commodity-inputs' },
  { id: 'sm4', label: 'Avg Response Time', value: '2.4m', secondary: '12% faster this week', trend: 'down', color: 'text-success' },
  { id: 'sm5', label: 'System Uptime', value: '99.97%', secondary: '24d 7h 32m', trend: 'up', color: 'text-success' },
  { id: 'sm6', label: 'Transactions Today', value: '847', secondary: 'Est. $1.2M volume', trend: 'up', color: 'text-commodity-export' },
]

export const marketTicker: MarketTicker[] = [
  { id: 'mt1', commodity: 'Cocoa Beans', price: 2850, change: 120, changePercent: 4.4, unit: 'tonne', trend: 'up' },
  { id: 'mt2', commodity: 'Coffee Arabica', price: 4200, change: -80, changePercent: -1.9, unit: 'tonne', trend: 'down' },
  { id: 'mt3', commodity: 'Maize', price: 280, change: -15, changePercent: -5.1, unit: 'tonne', trend: 'down' },
  { id: 'mt4', commodity: 'Soya Beans', price: 520, change: 30, changePercent: 6.1, unit: 'tonne', trend: 'up' },
  { id: 'mt5', commodity: 'Palm Oil', price: 980, change: 45, changePercent: 4.8, unit: 'tonne', trend: 'up' },
  { id: 'mt6', commodity: 'Cashew Nuts', price: 2100, change: 150, changePercent: 7.7, unit: 'tonne', trend: 'up' },
  { id: 'mt7', commodity: 'Cassava', price: 450, change: 25, changePercent: 5.9, unit: 'tonne', trend: 'up' },
  { id: 'mt8', commodity: 'Sesame Seeds', price: 1850, change: 90, changePercent: 5.1, unit: 'tonne', trend: 'up' },
]

export const systemEvents: SystemEvent[] = [
  { id: 'se1', module: 'trade-engine', message: 'New trade executed: 50t Cocoa Beans at $2,900/t', timestamp: '2026-06-06T10:32:00Z', severity: 'success', actionLabel: 'View Order' },
  { id: 'se2', module: 'finance', message: 'Payment of $145,000 confirmed for ORD-2026-002', timestamp: '2026-06-06T10:15:00Z', severity: 'success' },
  { id: 'se3', module: 'logistics', message: 'Truck TAF-2026-001 arrived at Tema Port', timestamp: '2026-06-06T09:45:00Z', severity: 'info', actionLabel: 'Track' },
  { id: 'se4', module: 'market-intel', message: 'Weather alert: Heavy rainfall expected in Zambia region', timestamp: '2026-06-06T08:30:00Z', severity: 'warning', actionLabel: 'View Intel' },
  { id: 'se5', module: 'trade-engine', message: 'Buyer request #BR-004 received 3 new supplier responses', timestamp: '2026-06-06T08:00:00Z', severity: 'info', actionLabel: 'Review' },
  { id: 'se6', module: 'storage', message: 'Warehouse W-001 at 85% capacity - Kumasi Central', timestamp: '2026-06-06T07:30:00Z', severity: 'warning', actionLabel: 'View Warehouse' },
  { id: 'se7', module: 'export', message: 'Export docs approved for EO-2026-003 to Rotterdam', timestamp: '2026-06-06T06:45:00Z', severity: 'success', actionLabel: 'View Docs' },
  { id: 'se8', module: 'ai', message: 'AI Trade Assistant: 3 new recommendations available', timestamp: '2026-06-06T06:00:00Z', severity: 'info', actionLabel: 'View Insights' },
]

function priceData(base: number, days: number, variance: number): { date: string; price: number; volume: number }[] {
  const data: { date: string; price: number; volume: number }[] = []
  let p = base
  for (let i = days; i >= 0; i--) {
    const d = new Date('2026-06-06')
    d.setDate(d.getDate() - i)
    const change = (Math.random() - 0.48) * variance
    p = Math.max(p + change, base * 0.6)
    data.push({
      date: d.toISOString().slice(0, 10),
      price: Math.round(p * 100) / 100,
      volume: Math.round(5000 + Math.random() * 30000),
    })
  }
  return data
}

export const commodityDetails: CommodityDetail[] = [
  { id: 'cd1', name: 'Premium Cocoa Beans', category: 'export', currentPrice: 2850, open: 2730, high: 2890, low: 2710, change: 120, changePercent: 4.4, volume: 15000, unit: 'tonne', priceHistory: priceData(2750, 30, 80), rsi: 62, ma50: 2720, ma200: 2580, support: 2710, resistance: 2890, trend: 'up', volatility: 'medium' },
  { id: 'cd2', name: 'Maize (Yellow)', category: 'grains', currentPrice: 280, open: 295, high: 300, low: 275, change: -15, changePercent: -5.1, volume: 68000, unit: 'tonne', priceHistory: priceData(300, 30, 15), rsi: 35, ma50: 290, ma200: 285, support: 275, resistance: 300, trend: 'down', volatility: 'low' },
  { id: 'cd3', name: 'Soya Beans', category: 'grains', currentPrice: 520, open: 490, high: 530, low: 485, change: 30, changePercent: 6.1, volume: 28000, unit: 'tonne', priceHistory: priceData(490, 30, 25), rsi: 68, ma50: 500, ma200: 480, support: 485, resistance: 530, trend: 'up', volatility: 'medium' },
  { id: 'cd4', name: 'Cashew Nuts', category: 'export', currentPrice: 2100, open: 1950, high: 2150, low: 1930, change: 150, changePercent: 7.7, volume: 9500, unit: 'tonne', priceHistory: priceData(1950, 30, 100), rsi: 72, ma50: 2000, ma200: 1900, support: 1930, resistance: 2150, trend: 'up', volatility: 'high' },
  { id: 'cd5', name: 'Coffee Arabica', category: 'export', currentPrice: 4200, open: 4280, high: 4320, low: 4180, change: -80, changePercent: -1.9, volume: 8900, unit: 'tonne', priceHistory: priceData(4300, 30, 60), rsi: 42, ma50: 4250, ma200: 4150, support: 4180, resistance: 4320, trend: 'down', volatility: 'low' },
  { id: 'cd6', name: 'Palm Oil', category: 'processed', currentPrice: 980, open: 935, high: 995, low: 930, change: 45, changePercent: 4.8, volume: 34000, unit: 'tonne', priceHistory: priceData(940, 30, 30), rsi: 65, ma50: 950, ma200: 920, support: 930, resistance: 995, trend: 'up', volatility: 'medium' },
]

export const weatherZones: WeatherZone[] = [
  { id: 'wz1', region: 'West Africa', country: 'Ghana, Côte d\'Ivoire, Nigeria', temperature: 31, condition: 'rainy', humidity: 82, rainfall: 120, forecast: [
    { day: 'Mon', condition: 'rainy', temp: 30, rainfall: 45 },
    { day: 'Tue', condition: 'cloudy', temp: 31, rainfall: 20 },
    { day: 'Wed', condition: 'rainy', temp: 29, rainfall: 55 },
    { day: 'Thu', condition: 'sunny', temp: 33, rainfall: 5 },
    { day: 'Fri', condition: 'sunny', temp: 34, rainfall: 0 },
  ], alert: { type: 'Heavy Rainfall', message: 'Above-average rainfall expected in cocoa-growing regions. Monitor for flooding.', severity: 'warning' }, impact: 'positive' },
  { id: 'wz2', region: 'East Africa', country: 'Kenya, Tanzania, Uganda', temperature: 28, condition: 'sunny', humidity: 55, rainfall: 15, forecast: [
    { day: 'Mon', condition: 'sunny', temp: 29, rainfall: 0 },
    { day: 'Tue', condition: 'sunny', temp: 30, rainfall: 0 },
    { day: 'Wed', condition: 'cloudy', temp: 28, rainfall: 5 },
    { day: 'Thu', condition: 'sunny', temp: 31, rainfall: 0 },
    { day: 'Fri', condition: 'sunny', temp: 32, rainfall: 0 },
  ], impact: 'neutral' },
  { id: 'wz3', region: 'Southern Africa', country: 'Zambia, Zimbabwe, South Africa', temperature: 25, condition: 'rainy', humidity: 75, rainfall: 80, forecast: [
    { day: 'Mon', condition: 'rainy', temp: 24, rainfall: 35 },
    { day: 'Tue', condition: 'rainy', temp: 23, rainfall: 45 },
    { day: 'Wed', condition: 'stormy', temp: 22, rainfall: 70 },
    { day: 'Thu', condition: 'rainy', temp: 24, rainfall: 30 },
    { day: 'Fri', condition: 'cloudy', temp: 26, rainfall: 10 },
  ], alert: { type: 'Storm Warning', message: 'Heavy storms expected in Zambian maize regions. Possible supply disruption.', severity: 'critical' }, impact: 'negative' },
  { id: 'wz4', region: 'West Africa Sahel', country: 'Sudan, Mali, Burkina Faso', temperature: 38, condition: 'dry', humidity: 25, rainfall: 2, forecast: [
    { day: 'Mon', condition: 'dry', temp: 39, rainfall: 0 },
    { day: 'Tue', condition: 'dry', temp: 40, rainfall: 0 },
    { day: 'Wed', condition: 'dry', temp: 38, rainfall: 0 },
    { day: 'Thu', condition: 'dry', temp: 37, rainfall: 1 },
    { day: 'Fri', condition: 'dry', temp: 36, rainfall: 0 },
  ], impact: 'negative' },
  { id: 'wz5', region: 'Central Africa', country: 'Cameroon, DRC, Gabon', temperature: 27, condition: 'cloudy', humidity: 70, rainfall: 40, forecast: [
    { day: 'Mon', condition: 'cloudy', temp: 28, rainfall: 10 },
    { day: 'Tue', condition: 'rainy', temp: 26, rainfall: 30 },
    { day: 'Wed', condition: 'cloudy', temp: 27, rainfall: 15 },
    { day: 'Thu', condition: 'sunny', temp: 29, rainfall: 5 },
    { day: 'Fri', condition: 'cloudy', temp: 28, rainfall: 8 },
  ], impact: 'neutral' },
]

export const demandData: DemandData[] = [
  { commodity: 'Premium Cocoa Beans', buyerCount: 24, totalDemand: 3200, unit: 'tonne', fillRate: 68, urgency: 'high', topBuyers: [
    { name: 'European Chocolate Co', volume: 800 }, { name: 'Swiss Cocoa Traders', volume: 600 }, { name: 'Lagos Processing Ltd', volume: 450 },
  ]},
  { commodity: 'Maize (Yellow)', buyerCount: 18, totalDemand: 15000, unit: 'tonne', fillRate: 45, urgency: 'high', topBuyers: [
    { name: 'East Africa Millers', volume: 4000 }, { name: 'Livestock Feed Corp', volume: 3500 }, { name: 'Johannesburg Agri', volume: 2500 },
  ]},
  { commodity: 'Cashew Nuts', buyerCount: 12, totalDemand: 850, unit: 'tonne', fillRate: 72, urgency: 'medium', topBuyers: [
    { name: 'Mumbai Cashew Traders', volume: 300 }, { name: 'Vietnam Import Co', volume: 250 },
  ]},
  { commodity: 'Soya Beans', buyerCount: 15, totalDemand: 6800, unit: 'tonne', fillRate: 55, urgency: 'medium', topBuyers: [
    { name: 'China Feed Importers', volume: 2500 }, { name: 'European Protein Ltd', volume: 1800 },
  ]},
  { commodity: 'Palm Oil', buyerCount: 20, totalDemand: 12000, unit: 'tonne', fillRate: 62, urgency: 'low', topBuyers: [
    { name: 'West African Foods', volume: 3000 }, { name: 'Indian Oil Corp', volume: 2800 },
  ]},
]

export const marketReports: MarketReport[] = [
  { id: 'mr1', title: 'Q3 Cocoa Outlook: Supply Deficit Expected', summary: 'West African cocoa production faces headwinds from irregular rainfall. Prices projected to remain elevated through Q3.', category: 'price-analysis', date: '2026-06-05', readTime: '4 min', author: 'Market Analysis Team', keyPoints: ['Cocoa production down 8% YoY', 'Ivory Coast reports delayed harvest', 'Global demand remains strong at +3%'], impact: 'positive' },
  { id: 'mr2', title: 'East Africa Maize: Harvest Projections', summary: 'Early harvest data from Kenya and Tanzania suggests above-average yields. Could pressure prices in coming weeks.', category: 'seasonal', date: '2026-06-04', readTime: '3 min', author: 'Agri Analytics', keyPoints: ['Kenyan maize output up 12%', 'Tanzania reports favorable growing season', 'Regional prices expected to soften'], impact: 'negative' },
  { id: 'mr3', title: 'Weather Impact: Southern Africa Storm System', summary: 'Tropical depression forming off Mozambique coast expected to affect Zambian and Zimbabwean agricultural zones.', category: 'weather', date: '2026-06-06', readTime: '2 min', author: 'Weather Intel', keyPoints: ['Storm expected to make landfall in 48hrs', 'Maize and soya regions at risk', 'Transport routes may be affected'], impact: 'negative' },
  { id: 'mr4', title: 'Cashew Market: India Demand Surge', summary: 'Indian processors increasing import volumes ahead of Diwali season. Prices up 15% in last month.', category: 'trade-flow', date: '2026-06-03', readTime: '3 min', author: 'Trade Analytics', keyPoints: ['India imports up 22% MoM', 'Vietnam also competing for supply', 'West African cashew benefiting'], impact: 'positive' },
  { id: 'mr5', title: 'New Export Regulations: EUDR Compliance', summary: 'EU Deforestation Regulation enforcement dates confirmed. African exporters must prepare compliance documentation.', category: 'policy', date: '2026-06-02', readTime: '5 min', author: 'Compliance Team', keyPoints: ['Enforcement begins January 2027', 'Traceability systems required', 'Cocoa, coffee, palm oil affected'], impact: 'neutral' },
]

export const topMovers = [
  { commodity: 'Cashew Nuts', change: 150, changePercent: 7.7, trend: 'up' as const },
  { commodity: 'Soya Beans', change: 30, changePercent: 6.1, trend: 'up' as const },
  { commodity: 'Cassava', change: 25, changePercent: 5.9, trend: 'up' as const },
  { commodity: 'Shea Butter', change: 85, changePercent: 5.4, trend: 'up' as const },
  { commodity: 'Palm Oil', change: 45, changePercent: 4.8, trend: 'up' as const },
  { commodity: 'Cocoa Beans', change: 120, changePercent: 4.4, trend: 'up' as const },
  { commodity: 'Coffee Arabica', change: -80, changePercent: -1.9, trend: 'down' as const },
  { commodity: 'Maize', change: -15, changePercent: -5.1, trend: 'down' as const },
]

export const marketOverviewData = [
  { label: 'Agri Commodity Index', value: '1,847.32', change: '+2.4%', trend: 'up' as const },
  { label: '24h Volume', value: '$124.7M', change: '+8.3%', trend: 'up' as const },
  { label: 'Advancers', value: '12', change: '+4', trend: 'up' as const },
  { label: 'Decliners', value: '3', change: '-2', trend: 'down' as const },
  { label: 'Unchanged', value: '2', change: '0', trend: 'stable' as const },
]
