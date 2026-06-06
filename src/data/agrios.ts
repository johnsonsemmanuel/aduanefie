import type { OSModule, SystemMetric, SystemEvent, SystemStatus, MarketTicker } from '@/types'

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
