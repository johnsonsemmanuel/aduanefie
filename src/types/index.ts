export type TradeStatus = 'open' | 'negotiating' | 'confirmed' | 'in_transit' | 'delivered' | 'completed' | 'cancelled'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'completed'
export type LogisticsStatus = 'pending' | 'dispatched' | 'in_transit' | 'arrived' | 'delivered'
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'overdue'
export type QualityGrade = 'A' | 'B' | 'C' | 'Premium' | 'Standard'
export type CommodityCategory = string

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
  commodity: { id: string; name: string; category?: string; image?: string }
  quantity: number
  unit: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  supplier: { id: string; name: string }
  buyer: { id: string; name: string }
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

// AgriOS-specific types
export type OSModuleId =
  | 'trade-engine' | 'market-intel' | 'logistics' | 'finance'
  | 'cooperative' | 'export' | 'ai' | 'admin'
  | 'procurement' | 'business' | 'developer' | 'dashboard' | 'messaging' | 'calendar'

export interface OSModule {
  id: OSModuleId
  name: string
  description: string
  icon: string
  color: string
  path: string
  badge?: number
  layer: number
  status: 'active' | 'beta' | 'maintenance' | 'coming-soon'
}

export interface SystemMetric {
  id: string
  label: string
  value: string
  secondary: string
  trend: 'up' | 'down' | 'stable'
  color: string
}

export interface SystemEvent {
  id: string
  module: OSModuleId
  message: string
  timestamp: string
  severity: 'info' | 'success' | 'warning' | 'critical'
  actionLabel?: string
}

export interface SystemStatus {
  id: string
  label: string
  status: 'online' | 'offline' | 'sync' | 'error'
  value: string
}

export interface MarketTicker {
  id: string
  commodity: string
  price: number
  change: number
  changePercent: number
  unit: string
  trend: 'up' | 'down'
}

export interface CommandCenterData {
  status: SystemStatus[]
  modules: OSModule[]
  metrics: SystemMetric[]
  ticker: MarketTicker[]
  events: SystemEvent[]
  systemUptime: string
  activeUsers: number
  lastSync: string
}

// Market Intelligence types
export interface PriceHistory {
  date: string
  price: number
  volume: number
}

export interface CommodityDetail {
  id: string
  name: string
  category: string
  currentPrice: number
  open: number
  high: number
  low: number
  change: number
  changePercent: number
  volume: number
  unit: string
  priceHistory: PriceHistory[]
  rsi: number
  ma50: number
  ma200: number
  support: number
  resistance: number
  trend: 'up' | 'down' | 'sideways'
  volatility: 'low' | 'medium' | 'high'
}

export interface WeatherZone {
  id: string
  region: string
  country: string
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'dry'
  humidity: number
  rainfall: number
  forecast: { day: string; condition: string; temp: number; rainfall: number }[]
  alert?: { type: string; message: string; severity: 'info' | 'warning' | 'critical' }
  impact: 'positive' | 'negative' | 'neutral'
}

export interface DemandData {
  commodity: string
  buyerCount: number
  totalDemand: number
  unit: string
  fillRate: number
  urgency: 'low' | 'medium' | 'high'
  topBuyers: { name: string; volume: number }[]
}

export interface MarketReport {
  id: string
  title: string
  summary: string
  category: 'price-analysis' | 'weather' | 'trade-flow' | 'policy' | 'seasonal'
  date: string
  readTime: string
  author: string
  keyPoints: string[]
  impact: 'positive' | 'negative' | 'neutral'
}

export interface MarketIntelData {
  commodities: CommodityDetail[]
  weather: WeatherZone[]
  demand: DemandData[]
  reports: MarketReport[]
  topMovers: { commodity: string; change: number; changePercent: number; trend: 'up' | 'down' }[]
  marketOverview: { label: string; value: string; change: string; trend: 'up' | 'down' }[]
}

// Finance Hub types
export type TransactionType = 'payment' | 'deposit' | 'withdrawal' | 'refund' | 'fee' | 'loan_disbursement' | 'loan_repayment' | 'insurance_payout' | 'trade_finance'
export type TransactionStatus = 'completed' | 'pending' | 'processing' | 'failed' | 'cancelled'
export type LoanStatus = 'active' | 'pending' | 'approved' | 'rejected' | 'completed' | 'defaulted'
export type InsuranceStatus = 'active' | 'expired' | 'pending' | 'claimed' | 'cancelled'
export type TradeFinanceType = 'letter_of_credit' | 'invoice_factoring' | 'supply_chain_finance' | 'purchase_order_finance'
export type TradeFinanceStatus = 'active' | 'pending' | 'completed' | 'defaulted'

export interface Wallet {
  id: string
  balance: number
  currency: string
  pendingBalance: number
  reservedBalance: number
  availableBalance: number
  accountNumber: string
  bankName: string
  linkedBankAccount: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: string
  status: TransactionStatus
  description: string
  counterparty: string
  reference: string
  date: string
  fee?: number
  category: 'trade' | 'loan' | 'insurance' | 'fee' | 'deposit' | 'withdrawal'
}

export interface Loan {
  id: string
  type: 'crop_loan' | 'equipment_loan' | 'input_loan' | 'trade_finance' | 'emergency'
  amount: number
  currency: string
  interestRate: number
  term: number
  termUnit: 'months' | 'years'
  status: LoanStatus
  disbursedDate: string
  dueDate: string
  repaidAmount: number
  remainingAmount: number
  nextPayment: string
  nextPaymentAmount: number
  purpose: string
  collateral: string
  lender: string
}

export interface InsurancePolicy {
  id: string
  type: 'crop' | 'livestock' | 'equipment' | 'transport' | 'weather_index'
  policyNumber: string
  insurer: string
  premium: number
  coverage: number
  currency: string
  status: InsuranceStatus
  startDate: string
  endDate: string
  commodity?: string
  area?: string
  deductible: number
  claims: InsuranceClaim[]
}

export interface InsuranceClaim {
  id: string
  policyId: string
  date: string
  amount: number
  status: 'submitted' | 'processing' | 'approved' | 'rejected' | 'paid'
  description: string
  documents: string[]
}

export interface TradeFinanceFacility {
  id: string
  type: TradeFinanceType
  reference: string
  amount: number
  currency: string
  status: TradeFinanceStatus
  applicant: string
  beneficiary: string
  issuingDate: string
  expiryDate: string
  commodity: string
  quantity: number
  documents: string[]
  fees: number
}

export interface FinanceDashboard {
  wallet: Wallet
  recentTransactions: Transaction[]
  pendingPayments: Transaction[]
  activeLoans: Loan[]
  activePolicies: InsurancePolicy[]
  tradeFacilities: TradeFinanceFacility[]
  monthlyVolume: number
  monthlyVolumeChange: number
  activeFacilitiesCount: number
  loanUtilization: number
}

// Business Hub types
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface Contact {
  id: string
  name: string
  company: string
  role: string
  email: string
  phone: string
  type: 'buyer' | 'supplier' | 'partner' | 'farmer' | 'logistics' | 'other'
  dealValue: number
  lastContact: string
  avatar?: string
}

export interface Deal {
  id: string
  title: string
  value: number
  stage: DealStage
  contactId: string
  contactName: string
  probability: number
  expectedClose: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  dueDate: string
  projectId?: string
  relatedTo?: string
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  budget: number
  spent: number
  startDate: string
  endDate: string
  milestones: Milestone[]
  team: string[]
}

export interface Invoice {
  id: string
  invoiceNumber: string
  client: string
  amount: number
  status: InvoiceStatus
  dueDate: string
  issuedDate: string
  items: { description: string; quantity: number; rate: number; total: number }[]
}

export interface BusinessDashboard {
  monthlyRevenue: number
  revenueChange: number
  activeDeals: number
  openTasks: number
  activeProjects: number
  overdueInvoices: number
  recentDeals: Deal[]
  upcomingTasks: Task[]
  invoicingSummary: { sent: number; paid: number; overdue: number; total: number }
}

// Procurement Hub types
export type RFQStatus = 'draft' | 'open' | 'under_review' | 'awarded' | 'cancelled'
export type VendorStatus = 'active' | 'inactive' | 'blacklisted' | 'pending'
export type PurchaseOrderStatus = 'draft' | 'sent' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled'

export interface Vendor {
  id: string
  name: string
  contactPerson: string
  email: string
  phone: string
  category: string
  rating: number
  totalOrders: number
  status: VendorStatus
  location: string
  joinedDate: string
  commodities: string[]
}

export interface RFQ {
  id: string
  title: string
  description: string
  status: RFQStatus
  issueDate: string
  closeDate: string
  responses: number
  budget: number
  category: string
}

export interface PurchaseOrder {
  id: string
  poNumber: string
  vendor: string
  commodity: string
  quantity: number
  unit: string
  total: number
  status: PurchaseOrderStatus
  orderDate: string
  deliveryDate: string
}

export interface Contract {
  id: string
  title: string
  vendor: string
  value: number
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'terminated' | 'pending'
}

// Cooperative Hub types
export type CooperativeRole = 'chairman' | 'secretary' | 'treasurer' | 'member'

export interface Cooperative {
  id: string
  name: string
  location: string
  memberCount: number
  totalProduce: number
  commodities: string[]
  foundedDate: string
  status: 'active' | 'inactive'
}

export interface CooperativeMember {
  id: string
  name: string
  role: CooperativeRole
  joinedDate: string
  contribution: number
  produceVolume: number
}

// AI Hub types
export interface AIRecommendation {
  id: string
  category: 'trade' | 'planting' | 'harvest' | 'pricing' | 'weather' | 'risk'
  title: string
  description: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timestamp: string
}

export interface AIChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Developer Hub types
export interface APIEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  description: string
  auth: boolean
  rateLimit: string
}

export interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  created: string
  lastUsed: string
  status: 'active' | 'revoked'
}

export interface DeveloperApp {
  id: string
  name: string
  description: string
  apiKeys: number
  lastActive: string
  status: 'active' | 'inactive'
}

// Agricultural Calendar types
export type AgEventCategory = 'planting' | 'harvest' | 'delivery' | 'maintenance' | 'meeting' | 'market' | 'weather'

export interface AgCalendarEvent {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  category: AgEventCategory
  commodity?: string
  region?: string
  allDay?: boolean
}

// Notification types
export type NotificationCategory = 'trade' | 'payment' | 'logistics' | 'system' | 'market' | 'social' | 'approval'

export interface Notification {
  id: string
  type: NotificationCategory
  title: string
  message: string
  timestamp: string
  read: boolean
  actionable?: boolean
  actionLabel?: string
  actionPath?: string
  relatedId?: string
}

// Messaging types
export interface MessageAttachment {
  name: string
  url: string
  size: string
}

export interface Message {
  id: string
  threadId: string
  sender: string
  senderRole: string
  content: string
  timestamp: string
  attachments?: MessageAttachment[]
}

export type MessageCategory = 'trade' | 'contract' | 'support' | 'cooperative' | 'general'

export interface MessageThread {
  id: string
  subject: string
  participants: { name: string; role: string; avatar?: string }[]
  lastMessage: Message
  unreadCount: number
  category: MessageCategory
  relatedTo?: { type: string; id: string; label: string }
}

// Auth types
export type AppUserRole = 'admin' | 'supervisor' | 'trader' | 'viewer' | 'farmer' | 'buyer' | 'supplier' | 'logistics'

// Admin types
export type UserRole = 'admin' | 'supervisor' | 'trader' | 'viewer'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'suspended' | 'pending'
  lastActive: string
  modules: string[]
}

export interface SystemSetting {
  id: string
  key: string
  value: string
  category: 'general' | 'security' | 'trading' | 'notifications' | 'integrations'
  description: string
}
