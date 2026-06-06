import type { Wallet, Transaction, Loan, InsurancePolicy, TradeFinanceFacility, FinanceDashboard } from '@/types'

export const wallet: Wallet = {
  id: 'w1',
  balance: 284750.00,
  currency: 'USD',
  pendingBalance: 12500.00,
  reservedBalance: 45000.00,
  availableBalance: 227250.00,
  accountNumber: 'ADF-1004582-GH',
  bankName: 'Ecobank Ghana',
  linkedBankAccount: 'ECOBANK-1002345678',
}

export const transactions: Transaction[] = [
  { id: 'tx1', type: 'payment', amount: 145000, currency: 'USD', status: 'completed', description: 'Cocoa beans sale - 50t to European Chocolate Co', counterparty: 'European Chocolate Co', reference: 'ORD-2026-002', date: '2026-06-06T10:32:00Z', fee: 290, category: 'trade' },
  { id: 'tx2', type: 'deposit', amount: 50000, currency: 'USD', status: 'completed', description: 'Wallet top-up - Bank transfer', counterparty: 'Ecobank Ghana', reference: 'DEP-2026-045', date: '2026-06-05T14:00:00Z', category: 'deposit' },
  { id: 'tx3', type: 'payment', amount: 600000, currency: 'USD', status: 'processing', description: 'Bulk NPK fertilizer order', counterparty: 'Dar Agro Inputs', reference: 'ORD-2026-001', date: '2026-06-05T09:15:00Z', fee: 1200, category: 'trade' },
  { id: 'tx4', type: 'loan_disbursement', amount: 75000, currency: 'USD', status: 'completed', description: 'Crop loan disbursement - Cocoa season', counterparty: 'AgriFinance Bank', reference: 'LN-2026-003', date: '2026-06-04T11:00:00Z', category: 'loan' },
  { id: 'tx5', type: 'loan_repayment', amount: 4200, currency: 'USD', status: 'completed', description: 'Monthly loan repayment - Equipment loan', counterparty: 'AgriFinance Bank', reference: 'REP-2026-012', date: '2026-06-03T08:00:00Z', category: 'loan' },
  { id: 'tx6', type: 'payment', amount: 37600, currency: 'USD', status: 'completed', description: 'Cassava delivery payment', counterparty: 'Lagos Food Processors', reference: 'ORD-2026-003', date: '2026-06-02T16:30:00Z', fee: 75, category: 'trade' },
  { id: 'tx7', type: 'insurance_payout', amount: 25000, currency: 'USD', status: 'completed', description: 'Weather index insurance payout - Drought claim', counterparty: 'AgriInsure Ltd', reference: 'CLM-2026-001', date: '2026-06-01T10:00:00Z', category: 'insurance' },
  { id: 'tx8', type: 'payment', amount: 12500, currency: 'USD', status: 'pending', description: 'Transport fees - TransAfrica Logistics', counterparty: 'TransAfrica Logistics', reference: 'TAF-2026-001', date: '2026-06-06T12:00:00Z', category: 'trade' },
  { id: 'tx9', type: 'withdrawal', amount: 10000, currency: 'USD', status: 'completed', description: 'Bank withdrawal to Ecobank', counterparty: 'Self - Ecobank Ghana', reference: 'WTH-2026-008', date: '2026-06-01T09:00:00Z', fee: 25, category: 'withdrawal' },
  { id: 'tx10', type: 'payment', amount: 45000, currency: 'USD', status: 'pending', description: 'Warehouse storage fees - Q3 prepayment', counterparty: 'Kumasi Central Storage', reference: 'INV-2026-089', date: '2026-06-07T00:00:00Z', category: 'trade' },
]

export const loans: Loan[] = [
  { id: 'ln1', type: 'crop_loan', amount: 75000, currency: 'USD', interestRate: 8.5, term: 12, termUnit: 'months', status: 'active', disbursedDate: '2026-03-01', dueDate: '2027-03-01', repaidAmount: 12500, remainingAmount: 62500, nextPayment: '2026-07-01', nextPaymentAmount: 6500, purpose: 'Cocoa season input financing - fertilizers, pesticides, labor', collateral: '5-acre cocoa farm', lender: 'AgriFinance Bank' },
  { id: 'ln2', type: 'equipment_loan', amount: 50000, currency: 'USD', interestRate: 10.0, term: 24, termUnit: 'months', status: 'active', disbursedDate: '2025-11-15', dueDate: '2027-11-15', repaidAmount: 15000, remainingAmount: 35000, nextPayment: '2026-07-01', nextPaymentAmount: 2200, purpose: 'Tractor and harvesting equipment purchase', collateral: 'Equipment', lender: 'AgriFinance Bank' },
  { id: 'ln3', type: 'input_loan', amount: 15000, currency: 'USD', interestRate: 6.5, term: 6, termUnit: 'months', status: 'completed', disbursedDate: '2025-12-01', dueDate: '2026-06-01', repaidAmount: 15000, remainingAmount: 0, nextPayment: '', nextPaymentAmount: 0, purpose: 'NPK fertilizer and improved seeds', collateral: 'None (unsecured)', lender: 'FarmerCoop Finance' },
  { id: 'ln4', type: 'emergency', amount: 10000, currency: 'USD', interestRate: 5.0, term: 3, termUnit: 'months', status: 'pending', disbursedDate: '', dueDate: '', repaidAmount: 0, remainingAmount: 10000, nextPayment: '', nextPaymentAmount: 0, purpose: 'Emergency irrigation system repair', collateral: '', lender: 'AgriFinance Bank' },
]

export const insurancePolicies: InsurancePolicy[] = [
  { id: 'ip1', type: 'weather_index', policyNumber: 'WI-2026-0042', insurer: 'AgriInsure Ltd', premium: 3200, coverage: 80000, currency: 'USD', status: 'active', startDate: '2026-03-01', endDate: '2026-09-30', commodity: 'Cocoa Beans', area: 'Kumasi, Ghana', deductible: 5000, claims: [
    { id: 'cl1', policyId: 'ip1', date: '2026-05-15', amount: 25000, status: 'paid', description: 'Drought period exceeding 30 consecutive days trigger', documents: ['weather_report.pdf', 'satellite_imagery.pdf'] },
  ]},
  { id: 'ip2', type: 'crop', policyNumber: 'CP-2026-0018', insurer: 'National Agric Insurance', premium: 4800, coverage: 120000, currency: 'USD', status: 'active', startDate: '2026-04-01', endDate: '2026-10-31', commodity: 'Maize (Yellow)', area: 'Nakuru, Kenya', deductible: 8000, claims: [] },
  { id: 'ip3', type: 'transport', policyNumber: 'TP-2026-0091', insurer: 'TransRisk Ltd', premium: 1800, coverage: 95000, currency: 'USD', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', deductible: 3000, claims: [] },
]

export const tradeFinanceFacilities: TradeFinanceFacility[] = [
  { id: 'tf1', type: 'letter_of_credit', reference: 'LC-2026-0047', amount: 295000, currency: 'USD', status: 'active', applicant: 'Emmanuel Johnson', beneficiary: 'European Chocolate Co', issuingDate: '2026-05-20', expiryDate: '2026-08-20', commodity: 'Premium Cocoa Beans', quantity: 100, documents: ['bill_of_lading.pdf', 'cert_of_origin.pdf', 'quality_cert.pdf'], fees: 2950 },
  { id: 'tf2', type: 'invoice_factoring', reference: 'IF-2026-0012', amount: 72500, currency: 'USD', status: 'pending', applicant: 'Emmanuel Johnson', beneficiary: 'European Chocolate Co', issuingDate: '2026-06-01', expiryDate: '2026-07-15', commodity: 'Premium Cocoa Beans', quantity: 25, documents: ['invoice.pdf', 'contract.pdf'], fees: 1450 },
  { id: 'tf3', type: 'supply_chain_finance', reference: 'SCF-2026-0005', amount: 600000, currency: 'USD', status: 'completed', applicant: 'Midwest Farmers Coop', beneficiary: 'Dar Agro Inputs', issuingDate: '2026-05-10', expiryDate: '2026-07-05', commodity: 'NPK Fertilizer', quantity: 2000, documents: ['purchase_order.pdf', 'contract.pdf'], fees: 6000 },
]

export const financeDashboard: FinanceDashboard = {
  wallet,
  recentTransactions: transactions.filter(t => t.status === 'completed').slice(0, 6),
  pendingPayments: transactions.filter(t => t.status === 'pending' || t.status === 'processing'),
  activeLoans: loans.filter(l => l.status === 'active'),
  activePolicies: insurancePolicies.filter(p => p.status === 'active'),
  tradeFacilities: tradeFinanceFacilities,
  monthlyVolume: 847000,
  monthlyVolumeChange: 23,
  activeFacilitiesCount: 2,
  loanUtilization: 58,
}
