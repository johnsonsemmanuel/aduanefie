import { useState } from 'react'
import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, Landmark,
  ShieldCheck, Clock, Plus, Send, FileText, DollarSign
} from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip, Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { financeDashboard, wallet, transactions, loans, insurancePolicies, tradeFinanceFacilities } from '@/data/finance'
import type { Transaction, Loan, InsurancePolicy, TradeFinanceFacility } from '@/types'

const financeTabs = [
  { id: 'overview', label: 'Overview', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: 'transactions', label: 'Transactions', icon: <ArrowUpRight className="w-3.5 h-3.5" /> },
  { id: 'loans', label: 'Loans', icon: <Landmark className="w-3.5 h-3.5" /> },
  { id: 'insurance', label: 'Insurance', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'trade-finance', label: 'Trade Finance', icon: <FileText className="w-3.5 h-3.5" /> },
]

export function FinanceHub() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showWallet, setShowWallet] = useState(false)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Finance Hub</h1>
          <p className="text-xs text-text-secondary">Digital wallet, payments, trade finance, loans & insurance</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Fund Wallet</Button>
          <Button size="sm" variant="secondary" icon={<Send className="w-3.5 h-3.5" />}>Send</Button>
        </div>
      </div>

      {/* Balance & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="rounded-lg border border-border bg-surface p-4 col-span-1 sm:col-span-2 lg:col-span-1">
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
            <Button size="sm" variant="secondary" icon={<Plus className="w-3 h-3" />} fullWidth>Top Up</Button>
            <Button size="sm" icon={<Send className="w-3 h-3" />} fullWidth>Send</Button>
          </div>
        </div>

        {[
          { label: 'Monthly Volume', value: `$${(financeDashboard.monthlyVolume / 1000).toFixed(0)}K`, change: '+23%', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Active Loans', value: `${financeDashboard.activeLoans.length}`, change: `${financeDashboard.loanUtilization}% utilized`, icon: Landmark, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
          { label: 'Insurance Cover', value: `$${insurancePolicies.reduce((s, p) => s + p.coverage, 0).toLocaleString()}`, change: `${insurancePolicies.filter(p => p.status === 'active').length} active`, icon: ShieldCheck, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">{m.label}</span>
              <div className={`w-7 h-7 rounded-lg ${m.bg} flex items-center justify-center`}>
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
            </div>
            <p className="text-lg font-bold text-text-primary">{m.value}</p>
            <p className="text-[10px] text-text-secondary mt-0.5">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Tab Nav — desktop: horizontal bar, mobile: bottom tabs */}
      <div className="hidden lg:block">
        <Card padding="none">
          <Tabs tabs={financeTabs} activeId={activeTab} onChange={setActiveTab} className="px-4" />
        </Card>
      </div>

      {/* Tab Content */}
      <div className="space-y-4 pb-14 lg:pb-0">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'loans' && <LoansTab />}
        {activeTab === 'insurance' && <InsuranceTab />}
        {activeTab === 'trade-finance' && <TradeFinanceTab />}
      </div>

      {/* Mobile bottom tab bar — only on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-14">
          {financeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              <span className="w-4 h-4">{tab.icon}</span>
              <span className="text-[10px] font-medium whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
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

function OverviewTab() {
  return (
    <>
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <span className="text-xs text-text-secondary">Last 30 days</span>
        </CardHeader>
        <div className="divide-y divide-border">
          {financeDashboard.recentTransactions.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Loans Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <span className="text-xs text-text-secondary">{financeDashboard.activeLoans.length} facilities</span>
          </CardHeader>
          {financeDashboard.activeLoans.length > 0 ? (
            <div className="divide-y divide-border">
              {financeDashboard.activeLoans.slice(0, 3).map((loan) => (
                <LoanRow key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-secondary py-4 text-center">No active loans</p>
          )}
        </Card>

        {/* Trade Finance */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Finance</CardTitle>
            <span className="text-xs text-text-secondary">{financeDashboard.tradeFacilities.length} facilities</span>
          </CardHeader>
          <div className="divide-y divide-border">
            {tradeFinanceFacilities.slice(0, 3).map((tf) => (
              <TradeFinanceRow key={tf.id} facility={tf} />
            ))}
          </div>
        </Card>
      </div>

      {/* Insurance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Coverage</CardTitle>
          <span className="text-xs text-text-secondary">${insurancePolicies.reduce((s, p) => s + p.coverage, 0).toLocaleString()} total cover</span>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {insurancePolicies.filter(p => p.status === 'active').slice(0, 3).map((policy) => (
            <PolicyCard key={policy.id} policy={policy} compact />
          ))}
        </div>
      </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <div className="flex gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                filter === f.key ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto scrollbar-thin">
        {filtered.map((tx) => (
          <TxRow key={tx.id} tx={tx} detailed />
        ))}
      </div>
    </Card>
  )
}

function LoansTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Apply for Loan</Button>
      </div>
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  )
}

function InsuranceTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New Policy</Button>
      </div>
      {insurancePolicies.map((policy) => (
        <PolicyCard key={policy.id} policy={policy} />
      ))}
    </div>
  )
}

function TradeFinanceTab() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New Facility</Button>
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
    <div className="flex items-start gap-3 py-2.5 px-1 hover:bg-surface-hover transition-colors rounded-lg">
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
          {detailed && <StatusChip status={tx.status} />}
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
    <div className="py-2.5 px-1 hover:bg-surface-hover transition-colors rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-text-primary capitalize">{loan.type.replace('_', ' ')}</span>
        <StatusChip status={loan.status} />
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
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Landmark className="w-4 h-4 text-commodity-export" />
            <h3 className="text-sm font-semibold text-text-primary capitalize">{loan.type.replace(/_/g, ' ')}</h3>
          </div>
          <p className="text-xs text-text-secondary">{loan.purpose}</p>
        </div>
        <StatusChip status={loan.status} />
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
    </Card>
  )
}

function PolicyCard({ policy, compact = false }: { policy: InsurancePolicy; compact?: boolean }) {
  return (
    <Card padding={compact ? 'sm' : 'md'}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-commodity-inputs shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text-primary capitalize truncate">{policy.type.replace(/_/g, ' ')} Insurance</p>
            <p className="text-[10px] text-text-secondary">{policy.policyNumber}</p>
          </div>
        </div>
        <StatusChip status={policy.status} />
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
    </Card>
  )
}

function TradeFinanceRow({ facility }: { facility: TradeFinanceFacility }) {
  return (
    <div className="py-2.5 px-1 hover:bg-surface-hover transition-colors rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-medium text-text-secondary">{facility.reference}</span>
          <Chip size="sm">{facility.type.replace(/_/g, ' ')}</Chip>
        </div>
        <StatusChip status={facility.status} />
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
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <FileText className="w-4 h-4 text-commodity-export" />
            <h3 className="text-sm font-semibold text-text-primary">{facility.type.replace(/_/g, ' ')}</h3>
            <span className="text-[10px] font-mono text-text-secondary">{facility.reference}</span>
          </div>
          <p className="text-xs text-text-secondary">{facility.applicant} → {facility.beneficiary}</p>
        </div>
        <StatusChip status={facility.status} />
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
    </Card>
  )
}
