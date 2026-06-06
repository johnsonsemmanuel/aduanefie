import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Landmark,
  ShieldCheck, Clock, Plus, Send, FileText, List,
  BarChart3
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill, Pill } from '@/components/ui/Pill'
import { financeDashboard, wallet, transactions, loans, insurancePolicies, tradeFinanceFacilities } from '@/data/finance'
import type { Transaction, Loan, InsurancePolicy, TradeFinanceFacility } from '@/types'

export function FinanceHub() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showWallet, setShowWallet] = useState(false)
  const [modalOpen, setModalOpen] = useState<'fund' | 'send' | 'loan' | 'policy' | 'facility' | null>(null)
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'overview', icon: BarChart3, label: 'Overview' }, { id: 'transactions', icon: List, label: 'Transactions' }, { id: 'loans', icon: Landmark, label: 'Loans' }, { id: 'insurance', icon: ShieldCheck, label: 'Insurance' }, { id: 'trade-finance', icon: FileText, label: 'Trade Finance' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'overview', icon: BarChart3, label: 'Overview' },
        { id: 'transactions', icon: List, label: 'Transactions' },
        { id: 'loans', icon: Landmark, label: 'Loans' },
        { id: 'insurance', icon: ShieldCheck, label: 'Insurance' },
        { id: 'trade-finance', icon: FileText, label: 'Trade Finance' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Finance Hub</h1>
            <p className="text-xs text-text-secondary">Digital wallet, payments, trade finance, loans & insurance</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={() => setModalOpen('fund')} className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
              <Plus className="w-3 h-3" /> Fund Wallet
            </button>
            <button onClick={() => setModalOpen('send')} className="px-3 py-1.5 rounded-full border border-border text-text-secondary text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-surface-hover transition-colors">
              <Send className="w-3 h-3" /> Send
            </button>
          </div>
        </div>

        {/* Balance & Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <GlassCard className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-xs text-text-secondary font-medium">Wallet Balance</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-primary">
                {showWallet ? `$${wallet.balance.toLocaleString()}` : '••••••'}
              </span>
              <button onClick={() => setShowWallet(!showWallet)} className="text-text-secondary hover:text-text-primary">
                {showWallet ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-text-secondary">
              <span>Available: ${wallet.availableBalance.toLocaleString()}</span>
              <span>Reserved: ${wallet.reservedBalance.toLocaleString()}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-border flex gap-2">
              <button onClick={() => setModalOpen('fund')} className="flex-1 px-3 py-1.5 rounded-full border border-border text-text-secondary text-[10px] font-semibold inline-flex items-center justify-center gap-1 hover:bg-surface-hover transition-colors">
                <Plus className="w-3 h-3" /> Top Up
              </button>
              <button onClick={() => setModalOpen('send')} className="flex-1 px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center justify-center gap-1 hover:bg-primary/90 transition-colors">
                <Send className="w-3 h-3" /> Send
              </button>
            </div>
          </GlassCard>

          {[
            { label: 'Monthly Volume', value: `$${(financeDashboard.monthlyVolume / 1000).toFixed(0)}K`, change: '+23%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Active Loans', value: `${financeDashboard.activeLoans.length}`, change: `${financeDashboard.loanUtilization}% utilized`, icon: Landmark, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
            { label: 'Insurance Cover', value: `$${insurancePolicies.reduce((s, p) => s + p.coverage, 0).toLocaleString()}`, change: `${insurancePolicies.filter(p => p.status === 'active').length} active`, icon: ShieldCheck, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
          ].map((m) => (
            <GlassCard key={m.label}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{m.label}</span>
                <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-text-primary">{m.value}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{m.change}</p>
            </GlassCard>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'loans' && <LoansTab onApply={() => setModalOpen('loan')} />}
        {activeTab === 'insurance' && <InsuranceTab onNewPolicy={() => setModalOpen('policy')} />}
        {activeTab === 'trade-finance' && <TradeFinanceTab onNewFacility={() => setModalOpen('facility')} />}

        <Modal open={modalOpen === 'fund'} onClose={() => setModalOpen(null)} title="Fund Wallet" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Wallet funded successfully', 'success'); setModalOpen(null); }} className="space-y-3">
            <input type="number" placeholder="Amount" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Confirm</button>
          </form>
        </Modal>

        <Modal open={modalOpen === 'send'} onClose={() => setModalOpen(null)} title="Send Money" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Payment sent successfully', 'success'); setModalOpen(null); }} className="space-y-3">
            <input type="text" placeholder="Recipient" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="number" placeholder="Amount" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Send</button>
          </form>
        </Modal>

        <Modal open={modalOpen === 'loan'} onClose={() => setModalOpen(null)} title="Apply for Loan" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Loan application submitted', 'success'); setModalOpen(null); }} className="space-y-3">
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select type</option>
              <option>Equipment</option>
              <option>Working Capital</option>
              <option>Harvest</option>
            </select>
            <input type="number" placeholder="Amount" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="text" placeholder="Purpose" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Submit Application</button>
          </form>
        </Modal>

        <Modal open={modalOpen === 'policy'} onClose={() => setModalOpen(null)} title="New Insurance Policy" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Insurance policy created', 'success'); setModalOpen(null); }} className="space-y-3">
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select policy type</option>
              <option>Crop</option>
              <option>Livestock</option>
              <option>Equipment</option>
              <option>Transport</option>
            </select>
            <input type="number" placeholder="Coverage Amount" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="text" placeholder="Description" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Create Policy</button>
          </form>
        </Modal>

        <Modal open={modalOpen === 'facility'} onClose={() => setModalOpen(null)} title="New Trade Finance Facility" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Trade finance facility created', 'success'); setModalOpen(null); }} className="space-y-3">
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select facility type</option>
              <option>Letter of Credit</option>
              <option>Invoice Financing</option>
              <option>Supply Chain Finance</option>
            </select>
            <input type="number" placeholder="Amount" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="text" placeholder="Commodity" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <button type="submit" className="w-full px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold">Create Facility</button>
          </form>
        </Modal>
      </div>
    </PageShell>
  )
}

function Eye({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}
function EyeOff({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <GlassCardHeader>
      <GlassCardTitle>{title}</GlassCardTitle>
      {subtitle && <span className="text-xs text-text-secondary">{subtitle}</span>}
    </GlassCardHeader>
  )
}

function OverviewTab() {
  return (
    <>
      <GlassCard padding="none">
        <SectionHeader title="Recent Transactions" subtitle="Last 30 days" />
        <div className="divide-y divide-border">
          {financeDashboard.recentTransactions.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard padding="none">
          <SectionHeader
            title="Active Loans"
            subtitle={`${financeDashboard.activeLoans.length} facilities`}
          />
          {financeDashboard.activeLoans.length > 0 ? (
            <div className="divide-y divide-border">
              {financeDashboard.activeLoans.slice(0, 3).map((loan) => (
                <LoanRow key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary py-4 text-center">No active loans</p>
          )}
        </GlassCard>

        <GlassCard padding="none">
          <SectionHeader
            title="Trade Finance"
            subtitle={`${financeDashboard.tradeFacilities.length} facilities`}
          />
          <div className="divide-y divide-border">
            {tradeFinanceFacilities.slice(0, 3).map((tf) => (
              <TradeFinanceRow key={tf.id} facility={tf} />
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard padding="none">
        <SectionHeader
          title="Insurance Coverage"
          subtitle={`$${insurancePolicies.reduce((s, p) => s + p.coverage, 0).toLocaleString()} total cover`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {insurancePolicies.filter(p => p.status === 'active').slice(0, 3).map((policy) => (
            <PolicyCard key={policy.id} policy={policy} compact />
          ))}
        </div>
      </GlassCard>
    </>
  )
}

function TransactionsTab() {
  const [filter, setFilter] = useState<'all' | 'trade' | 'loan' | 'insurance' | 'deposit'>('all')

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.category === filter)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'trade', label: 'Trade' },
    { key: 'loan', label: 'Loan' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'deposit', label: 'Deposits' },
  ]

  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <GlassCardTitle>All Transactions</GlassCardTitle>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                filter === f.key ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
        {filtered.map((tx) => (
          <TxRow key={tx.id} tx={tx} detailed />
        ))}
      </div>
    </GlassCard>
  )
}

function LoansTab({ onApply }: { onApply?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={onApply} className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Apply for Loan
        </button>
      </div>
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  )
}

function InsuranceTab({ onNewPolicy }: { onNewPolicy?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={onNewPolicy} className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Policy
        </button>
      </div>
      {insurancePolicies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  )
}

function TradeFinanceTab({ onNewFacility }: { onNewFacility?: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={onNewFacility} className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Facility
        </button>
      </div>
      {tradeFinanceFacilities.map((tf) => (
        <TradeFinanceCard key={tf.id} facility={tf} />
      ))}
    </div>
  )
}

/* ---- Row Components ---- */

function TxRow({ tx, detailed = false }: { tx: Transaction; detailed?: boolean }) {
  const isInflow = ['payment', 'deposit', 'loan_disbursement', 'insurance_payout'].includes(tx.type)
  const isOutflow = ['withdrawal', 'fee', 'loan_repayment'].includes(tx.type)

  const Icon = isInflow ? ArrowDownLeft : isOutflow ? ArrowUpRight : Clock

  return (
    <div className="flex items-start gap-3 py-2.5 px-4 hover:bg-surface-hover transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        isInflow ? 'bg-success/10' : isOutflow ? 'bg-danger/10' : 'bg-warning/10'
      }`}>
        <Icon className={`w-4 h-4 ${isInflow ? 'text-success' : isOutflow ? 'text-danger' : 'text-warning'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary">{tx.description}</p>
        <div className="flex items-center gap-2 text-[10px] text-text-secondary">
          <span>{tx.counterparty}</span>
          <span>·</span>
          <span>{tx.reference}</span>
          {detailed && <StatusPill status={tx.status} />}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs font-semibold ${isInflow ? 'text-success' : 'text-danger'}`}>
          {isInflow ? '+' : '-'}${tx.amount.toLocaleString()}
        </p>
        <p className="text-[10px] text-text-secondary">{new Date(tx.date).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

function LoanRow({ loan }: { loan: Loan }) {
  const progress = loan.amount > 0 ? ((loan.repaidAmount / loan.amount) * 100) : 0
  return (
    <div className="py-2.5 px-4 hover:bg-surface-hover transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-text-primary capitalize">{loan.type.replace('_', ' ')}</span>
        <StatusPill status={loan.status} />
      </div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-bold">${loan.remainingAmount.toLocaleString()}</span>
        <span className="text-[10px] text-text-secondary">{loan.interestRate}% APR · {loan.term} {loan.termUnit}</span>
      </div>
      <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden mb-1">
        <div className={`h-full rounded-full ${progress > 60 ? 'bg-success' : progress > 30 ? 'bg-warning' : 'bg-commodity-inputs'}`} style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-text-secondary">
        <span>{progress.toFixed(0)}% repaid (${loan.repaidAmount.toLocaleString()})</span>
        {loan.nextPayment && <span>Next: ${loan.nextPaymentAmount.toLocaleString()} due {new Date(loan.nextPayment).toLocaleDateString()}</span>}
      </div>
    </div>
  )
}

function LoanCard({ loan }: { loan: Loan }) {
  const progress = loan.amount > 0 ? ((loan.repaidAmount / loan.amount) * 100) : 0
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Landmark className="w-4 h-4 text-commodity-export" />
            <h3 className="text-sm font-semibold text-text-primary capitalize">{loan.type.replace(/_/g, ' ')}</h3>
          </div>
          <p className="text-xs text-text-secondary">{loan.purpose}</p>
        </div>
        <StatusPill status={loan.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {[
          { label: 'Amount', value: `$${loan.amount.toLocaleString()}` },
          { label: 'Interest', value: `${loan.interestRate}% APR` },
          { label: 'Term', value: `${loan.term} ${loan.termUnit}` },
          { label: 'Lender', value: loan.lender },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-[10px] text-text-secondary">{s.label}</p>
            <p className="text-xs font-medium">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-[10px] text-text-secondary mb-1">
          <span>Repayment Progress</span>
          <span>${loan.repaidAmount.toLocaleString()} / ${loan.amount.toLocaleString()}</span>
        </div>
        <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${progress > 60 ? 'bg-success' : progress > 30 ? 'bg-warning' : 'bg-commodity-inputs'}`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-text-secondary">
        <span>Remaining: <strong className="text-text-primary">${loan.remainingAmount.toLocaleString()}</strong></span>
        {loan.nextPayment && <span>Next payment: ${loan.nextPaymentAmount.toLocaleString()} on {new Date(loan.nextPayment).toLocaleDateString()}</span>}
      </div>

      {loan.collateral && (
        <div className="mt-2 pt-2 border-t border-border text-[10px] text-text-secondary">
          Collateral: {loan.collateral}
        </div>
      )}
    </GlassCard>
  )
}

function PolicyCard({ policy, compact = false }: { policy: InsurancePolicy; compact?: boolean }) {
  return (
    <GlassCard padding={compact ? 'sm' : 'md'}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-commodity-inputs shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary capitalize truncate">{policy.type.replace(/_/g, ' ')} Insurance</p>
            <p className="text-[10px] text-text-secondary">{policy.policyNumber}</p>
          </div>
        </div>
        <StatusPill status={policy.status} />
      </div>

      {!compact && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-[10px] text-text-secondary">Coverage</p>
              <p className="text-xs font-semibold">${policy.coverage.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-secondary">Premium</p>
              <p className="text-xs font-semibold">${policy.premium.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-text-secondary mb-2">
            <span>Period: {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}</span>
          </div>

          {policy.claims.length > 0 && (
            <div className="border-t border-border pt-2 mt-2">
              <p className="text-[10px] font-medium text-text-secondary mb-1">Claims ({policy.claims.length})</p>
              {policy.claims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between text-[10px] py-1">
                  <span className="text-text-primary">{claim.description}</span>
                  <span className={`font-medium ${claim.status === 'paid' ? 'text-success' : claim.status === 'processing' ? 'text-warning' : 'text-text-secondary'}`}>
                    ${claim.amount.toLocaleString()} · {claim.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {compact && (
        <div className="flex items-center justify-between text-[10px] text-text-secondary">
          <span>Cover: ${policy.coverage.toLocaleString()}</span>
          <span>Premium: ${policy.premium.toLocaleString()}/yr</span>
        </div>
      )}
    </GlassCard>
  )
}

function TradeFinanceRow({ facility }: { facility: TradeFinanceFacility }) {
  return (
    <div className="py-2.5 px-4 hover:bg-surface-hover transition-colors">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-medium text-text-secondary">{facility.reference}</span>
          <Pill>{facility.type.replace(/_/g, ' ')}</Pill>
        </div>
        <StatusPill status={facility.status} />
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold">${facility.amount.toLocaleString()}</span>
        <span className="text-[10px] text-text-secondary">{facility.commodity} · {facility.quantity}t</span>
      </div>
      <div className="flex justify-between text-[10px] text-text-secondary mt-0.5">
        <span>{facility.applicant} → {facility.beneficiary}</span>
        <span>Exp: {new Date(facility.expiryDate).toLocaleDateString()}</span>
      </div>
    </div>
  )
}

function TradeFinanceCard({ facility }: { facility: TradeFinanceFacility }) {
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <FileText className="w-4 h-4 text-commodity-export" />
            <h3 className="text-sm font-semibold text-text-primary">{facility.type.replace(/_/g, ' ')}</h3>
            <span className="text-[10px] font-mono text-text-secondary">{facility.reference}</span>
          </div>
          <p className="text-xs text-text-secondary">{facility.applicant} → {facility.beneficiary}</p>
        </div>
        <StatusPill status={facility.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-text-secondary">Amount</p>
          <p className="text-sm font-bold">${facility.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Commodity</p>
          <p className="text-xs font-medium">{facility.commodity}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Quantity</p>
          <p className="text-xs font-medium">{facility.quantity} tonnes</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Fees</p>
          <p className="text-xs font-medium">${facility.fees.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-text-secondary">
        <span>Issued: {new Date(facility.issuingDate).toLocaleDateString()}</span>
        <span>Expires: {new Date(facility.expiryDate).toLocaleDateString()}</span>
        <span className="text-primary font-medium">{facility.documents.length} documents →</span>
      </div>
    </GlassCard>
  )
}
