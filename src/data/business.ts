import type { Contact, Deal, Task, Project, Invoice, BusinessDashboard } from '@/types'

export const contacts: Contact[] = [
  { id: 'c1', name: 'Kwame Asante', company: 'Asante Farms Ltd', role: 'CEO', email: 'kwame@asantefarms.com', phone: '+233 50 123 4567', type: 'buyer', dealValue: 45000, lastContact: '2026-06-04' },
  { id: 'c2', name: 'Ama Serwaa', company: 'Serwaa Agro-Processors', role: 'Procurement Manager', email: 'ama@serwaaagro.com', phone: '+233 54 234 5678', type: 'buyer', dealValue: 28000, lastContact: '2026-06-03' },
  { id: 'c3', name: 'Yaw Mensah', company: 'Mensah Logistics', role: 'Operations Director', email: 'yaw@mensahlogistics.com', phone: '+233 20 345 6789', type: 'logistics', dealValue: 15000, lastContact: '2026-06-02' },
  { id: 'c4', name: 'Esi Afriyie', company: 'Afriyie Exports', role: 'Export Manager', email: 'esi@afriyieexports.com', phone: '+233 55 456 7890', type: 'partner', dealValue: 62000, lastContact: '2026-06-01' },
  { id: 'c5', name: 'Kofi Boateng', company: 'Boateng Farmers Co-op', role: 'Chairman', email: 'kofi@boatengcoop.com', phone: '+233 24 567 8901', type: 'farmer', dealValue: 8500, lastContact: '2026-05-30' },
  { id: 'c6', name: 'Nana Osei', company: 'Osei Commodities', role: 'Trader', email: 'nana@oseicommodities.com', phone: '+233 50 678 9012', type: 'supplier', dealValue: 33500, lastContact: '2026-05-28' },
]

export const deals: Deal[] = [
  { id: 'd1', title: 'Cocoa Bean Supply Q3', value: 45000, stage: 'negotiation', contactId: 'c1', contactName: 'Kwame Asante', probability: 65, expectedClose: '2026-07-15', createdAt: '2026-05-20' },
  { id: 'd2', title: 'Maize Processing Contract', value: 28000, stage: 'proposal', contactId: 'c2', contactName: 'Ama Serwaa', probability: 45, expectedClose: '2026-07-30', createdAt: '2026-05-22' },
  { id: 'd3', title: 'Cold Storage Partnership', value: 15000, stage: 'qualified', contactId: 'c3', contactName: 'Yaw Mensah', probability: 30, expectedClose: '2026-08-15', createdAt: '2026-06-01' },
  { id: 'd4', title: 'Export Distribution Deal', value: 62000, stage: 'lead', contactId: 'c4', contactName: 'Esi Afriyie', probability: 20, expectedClose: '2026-09-01', createdAt: '2026-06-02' },
  { id: 'd5', title: 'Input Supply Agreement', value: 8500, stage: 'closed_won', contactId: 'c5', contactName: 'Kofi Boateng', probability: 100, expectedClose: '2026-06-10', createdAt: '2026-05-10' },
  { id: 'd6', title: 'Cashew Bulk Purchase', value: 33500, stage: 'negotiation', contactId: 'c6', contactName: 'Nana Osei', probability: 55, expectedClose: '2026-07-20', createdAt: '2026-05-25' },
]

export const tasks: Task[] = [
  { id: 't1', title: 'Review cocoa quality report', description: 'Inspect lab results for batch #C-2024-089', status: 'in_progress', priority: 'high', assignee: 'Emmanuel', dueDate: '2026-06-08', projectId: 'p1', relatedTo: 'Contract' },
  { id: 't2', title: 'Send maize samples to Serwaa Agro', description: 'Prepare 5kg samples from latest harvest for quality assessment', status: 'todo', priority: 'high', assignee: 'Emmanuel', dueDate: '2026-06-07', projectId: 'p1', relatedTo: 'Deal' },
  { id: 't3', title: 'Negotiate logistics rates', description: 'Follow up with Mensah Logistics on contract renewal pricing', status: 'todo', priority: 'medium', assignee: 'Emmanuel', dueDate: '2026-06-12', relatedTo: 'Logistics' },
  { id: 't4', title: 'Update Q3 budget forecast', description: 'Revise projections based on current deal pipeline', status: 'in_progress', priority: 'medium', assignee: 'Emmanuel', dueDate: '2026-06-15', relatedTo: 'Finance' },
  { id: 't5', title: 'Prepare export documentation', description: 'Compile certificates of origin and phytosanitary docs for shipment EX-2024-033', status: 'review', priority: 'urgent', assignee: 'Emmanuel', dueDate: '2026-06-06', projectId: 'p2', relatedTo: 'Export' },
  { id: 't6', title: 'Onboard new cooperative members', description: 'Process 12 new farmer applications for Boateng Co-op', status: 'done', priority: 'low', assignee: 'Emmanuel', dueDate: '2026-06-04', relatedTo: 'Cooperative' },
  { id: 't7', title: 'Invoice reconciliation', description: 'Match Q2 invoices against delivery confirmations', status: 'todo', priority: 'high', assignee: 'Emmanuel', dueDate: '2026-06-14', relatedTo: 'Accounting' },
]

export const projects: Project[] = [
  {
    id: 'p1', name: 'Q3 Cocoa & Maize Supply Program', description: 'Supply 150 tonnes of cocoa beans and 200 tonnes of maize to processors across Western and Ashanti regions.', status: 'active', budget: 120000, spent: 48000, startDate: '2026-05-01', endDate: '2026-09-30',
    milestones: [
      { id: 'm1', title: 'Quality assessment complete', dueDate: '2026-06-10', status: 'in_progress' },
      { id: 'm2', title: 'Contracts signed with all buyers', dueDate: '2026-07-01', status: 'pending' },
      { id: 'm3', title: 'First delivery batch dispatched', dueDate: '2026-07-15', status: 'pending' },
      { id: 'm4', title: 'Final delivery and reconciliation', dueDate: '2026-09-20', status: 'pending' },
    ],
    team: ['Emmanuel', 'Kwame Asante', 'Ama Serwaa'],
  },
  {
    id: 'p2', name: 'Export Certification Overhaul', description: 'Revise all export documentation workflows to meet new EUDR compliance requirements.', status: 'active', budget: 35000, spent: 12000, startDate: '2026-04-15', endDate: '2026-07-30',
    milestones: [
      { id: 'm5', title: 'Gap analysis complete', dueDate: '2026-05-15', status: 'completed' },
      { id: 'm6', title: 'New documentation templates ready', dueDate: '2026-06-15', status: 'in_progress' },
      { id: 'm7', title: 'Staff training on new procedures', dueDate: '2026-07-01', status: 'pending' },
    ],
    team: ['Emmanuel', 'Esi Afriyie'],
  },
  {
    id: 'p3', name: 'Cold Storage Facility Setup', description: 'Develop a 500-tonne capacity cold storage facility in Kumasi for perishable produce.', status: 'planning', budget: 250000, spent: 15000, startDate: '2026-08-01', endDate: '2027-03-31',
    milestones: [
      { id: 'm8', title: 'Feasibility study & site selection', dueDate: '2026-08-30', status: 'pending' },
      { id: 'm9', title: 'Construction permits secured', dueDate: '2026-10-01', status: 'pending' },
    ],
    team: ['Emmanuel', 'Yaw Mensah'],
  },
]

export const invoices: Invoice[] = [
  {
    id: 'i1', invoiceNumber: 'INV-2026-001', client: 'Asante Farms Ltd', amount: 18000, status: 'paid', dueDate: '2026-05-15', issuedDate: '2026-04-15',
    items: [{ description: 'Premium Cocoa Beans (Grade A)', quantity: 15, rate: 800, total: 12000 }, { description: 'Transport & Handling', quantity: 1, rate: 6000, total: 6000 }],
  },
  {
    id: 'i2', invoiceNumber: 'INV-2026-002', client: 'Serwaa Agro-Processors', amount: 12000, status: 'sent', dueDate: '2026-06-30', issuedDate: '2026-06-01',
    items: [{ description: 'Yellow Maize (Non-GMO)', quantity: 40, rate: 250, total: 10000 }, { description: 'Quality Certification Fee', quantity: 1, rate: 2000, total: 2000 }],
  },
  {
    id: 'i3', invoiceNumber: 'INV-2026-003', client: 'Mensah Logistics', amount: 7500, status: 'overdue', dueDate: '2026-05-25', issuedDate: '2026-04-25',
    items: [{ description: 'Warehousing Services (April)', quantity: 1, rate: 5000, total: 5000 }, { description: 'Inventory Management', quantity: 1, rate: 2500, total: 2500 }],
  },
  {
    id: 'i4', invoiceNumber: 'INV-2026-004', client: 'Afriyie Exports', amount: 22000, status: 'draft', dueDate: '2026-07-15', issuedDate: '2026-06-15',
    items: [{ description: 'Cashew Nuts (W320 Grade)', quantity: 20, rate: 950, total: 19000 }, { description: 'Export Documentation Fee', quantity: 1, rate: 3000, total: 3000 }],
  },
  {
    id: 'i5', invoiceNumber: 'INV-2026-005', client: 'Boateng Farmers Co-op', amount: 4200, status: 'paid', dueDate: '2026-05-10', issuedDate: '2026-04-10',
    items: [{ description: 'Fertilizer Bundle (NPK 15-15-15)', quantity: 100, rate: 35, total: 3500 }, { description: 'Delivery to Co-op', quantity: 1, rate: 700, total: 700 }],
  },
  {
    id: 'i6', invoiceNumber: 'INV-2026-006', client: 'Osei Commodities', amount: 9500, status: 'sent', dueDate: '2026-07-01', issuedDate: '2026-06-05',
    items: [{ description: 'Shea Butter (Organic Grade)', quantity: 5, rate: 1500, total: 7500 }, { description: 'Storage (2 weeks)', quantity: 1, rate: 2000, total: 2000 }],
  },
]

export const businessDashboard: BusinessDashboard = {
  monthlyRevenue: 73500,
  revenueChange: 12.5,
  activeDeals: deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length,
  openTasks: tasks.filter(t => t.status !== 'done').length,
  activeProjects: projects.filter(p => p.status === 'active').length,
  overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
  recentDeals: deals.filter(d => d.stage !== 'closed_lost').slice(0, 4),
  upcomingTasks: tasks.filter(t => t.status !== 'done').slice(0, 5),
  invoicingSummary: { sent: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0), paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0), overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0), total: invoices.reduce((s, i) => s + i.amount, 0) },
}
