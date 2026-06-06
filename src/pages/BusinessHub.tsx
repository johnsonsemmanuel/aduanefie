import { useState } from 'react'
import {
  Building2, Users, Target, ClipboardCheck, Receipt, TrendingUp,
  CheckCircle, Clock, AlertTriangle, Plus, UserPlus, ListTodo, Briefcase
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatusChip, Chip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { businessDashboard, contacts, deals, tasks, projects, invoices } from '@/data/business'
import type { Deal, Task, Project, Invoice, DealStage, TaskStatus } from '@/types'

const businessTabs = [
  { id: 'overview', label: 'Overview', icon: <Building2 className="w-3.5 h-3.5" /> },
  { id: 'crm', label: 'CRM', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'tasks', label: 'Tasks', icon: <ListTodo className="w-3.5 h-3.5" /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'accounting', label: 'Accounting', icon: <Receipt className="w-3.5 h-3.5" /> },
]

export function BusinessHub() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Business Hub</h1>
          <p className="text-xs text-text-secondary">CRM, projects, tasks, and accounting</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button size="sm" icon={<UserPlus className="w-3.5 h-3.5" />}>Add Contact</Button>
          <Button size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />}>New Deal</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-lg font-bold text-text-primary">${businessDashboard.monthlyRevenue.toLocaleString()}</p>
          <span className="text-[10px] text-success font-medium">+{businessDashboard.revenueChange}% vs last month</span>
        </div>
        {[
          { label: 'Active Deals', value: businessDashboard.activeDeals.toString(), icon: Target, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
          { label: 'Open Tasks', value: businessDashboard.openTasks.toString(), icon: ClipboardCheck, color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Active Projects', value: businessDashboard.activeProjects.toString(), icon: Briefcase, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
          { label: 'Overdue Invoices', value: businessDashboard.overdueInvoices.toString(), icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider truncate">{m.label}</span>
              <div className={`w-6 h-6 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`w-3 h-3 ${m.color}`} />
              </div>
            </div>
            <p className="text-lg font-bold text-text-primary">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs — desktop */}
      <div className="hidden lg:block">
        <Card padding="none">
          <div className="flex border-b border-border overflow-x-auto scrollbar-thin px-4">
            {businessTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id ? 'border-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <span className="w-3.5 h-3.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Tab content */}
      <div className="space-y-4 pb-14 lg:pb-0">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'crm' && <CRMTab />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'accounting' && <AccountingTab />}
      </div>

      {/* Mobile bottom tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-14">
          {businessTabs.map((tab) => (
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

function OverviewTab() {
  const totalPipeline = deals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won').reduce((s, d) => s + d.value, 0)

  return (
    <>
      {/* Pipeline summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Deal Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Pipeline</CardTitle>
            <span className="text-xs text-text-secondary">${totalPipeline.toLocaleString()} total pipeline value</span>
          </CardHeader>
          <div className="space-y-2">
            {businessDashboard.recentDeals.filter(d => d.stage !== 'closed_lost').map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <span className="text-xs text-text-secondary">{businessDashboard.openTasks} open</span>
          </CardHeader>
          <div className="divide-y divide-border">
            {businessDashboard.upcomingTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </Card>
      </div>

      {/* Invoicing Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Invoicing Summary</CardTitle>
          <span className="text-xs text-text-secondary">This month</span>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Invoiced', value: `$${businessDashboard.invoicingSummary.total.toLocaleString()}`, color: 'text-text-primary', bg: 'bg-border/50' },
            { label: 'Paid', value: `$${businessDashboard.invoicingSummary.paid.toLocaleString()}`, color: 'text-success', bg: 'bg-success/10' },
            { label: 'Sent', value: `$${businessDashboard.invoicingSummary.sent.toLocaleString()}`, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
            { label: 'Overdue', value: `$${businessDashboard.invoicingSummary.overdue.toLocaleString()}`, color: 'text-danger', bg: 'bg-danger/10' },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg p-3 ${s.bg}`}>
              <p className="text-[10px] text-text-secondary">{s.label}</p>
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function CRMTab() {
  const [dealFilter, setDealFilter] = useState<DealStage | 'all'>('all')
  const stageLabels: Record<string, string> = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost' }

  const filteredDeals = dealFilter === 'all' ? deals : deals.filter(d => d.stage === dealFilter)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <span className="text-xs text-text-secondary">{contacts.length} contacts</span>
        </CardHeader>
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 py-2 px-1 rounded-lg hover:bg-surface-hover transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                {c.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary truncate">{c.name}</p>
                <p className="text-[10px] text-text-secondary truncate">{c.company} · {c.role}</p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-xs font-semibold text-text-primary">${c.dealValue.toLocaleString()}</p>
                <p className="text-[10px] text-text-secondary">{new Date(c.lastContact).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deals Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Deals</CardTitle>
          <div className="flex gap-1">
            {['all', 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won'].map((s) => (
              <button
                key={s}
                onClick={() => setDealFilter(s as DealStage | 'all')}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${
                  dealFilter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {s === 'all' ? 'All' : stageLabels[s]}
              </button>
            ))}
          </div>
        </CardHeader>
        <div className="space-y-2">
          {filteredDeals.map((deal) => (
            <DealRow key={deal.id} deal={deal} />
          ))}
        </div>
      </Card>
    </div>
  )
}

function TasksTab() {
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'all'>('all')
  const taskStatusLabels: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' }

  const filtered = taskFilter === 'all' ? tasks : tasks.filter(t => t.status === taskFilter)

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Tasks</CardTitle>
        <div className="flex gap-1">
          {['all', 'todo', 'in_progress', 'review', 'done'].map((s) => (
            <button
              key={s}
              onClick={() => setTaskFilter(s as TaskStatus | 'all')}
              className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${
                taskFilter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {s === 'all' ? 'All' : taskStatusLabels[s]}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-border">
        {filtered.map((task) => (
          <TaskRow key={task.id} task={task} detailed />
        ))}
      </div>
    </Card>
  )
}

function ProjectsTab() {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

function AccountingTab() {
  const [invFilter, setInvFilter] = useState<'all' | 'paid' | 'sent' | 'overdue' | 'draft'>('all')
  const filtered = invFilter === 'all' ? invoices : invoices.filter(i => i.status === invFilter)

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>New Invoice</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total', value: invoices.reduce((s, i) => s + i.amount, 0), color: 'text-text-primary', bg: 'bg-border/50' },
          { label: 'Paid', value: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0), color: 'text-success', bg: 'bg-success/10' },
          { label: 'Outstanding', value: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0), color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Overdue', value: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0), color: 'text-danger', bg: 'bg-danger/10' },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg p-3 ${s.bg}`}>
            <p className="text-[10px] text-text-secondary">{s.label}</p>
            <p className={`text-sm font-bold ${s.color}`}>${s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <div className="flex gap-1">
            {['all', 'paid', 'sent', 'overdue', 'draft'].map((s) => (
              <button
                key={s}
                onClick={() => setInvFilter(s as typeof invFilter)}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${
                  invFilter === s ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <div className="divide-y divide-border">
          {filtered.map((inv) => (
            <InvoiceRow key={inv.id} inv={inv} />
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ---- Sub-components ---- */

function DealRow({ deal }: { deal: Deal }) {
  const stageColors: Record<string, string> = {
    lead: 'text-text-secondary', qualified: 'text-commodity-inputs', proposal: 'text-warning',
    negotiation: 'text-commodity-export', closed_won: 'text-success', closed_lost: 'text-danger',
  }
  return (
    <div className="flex items-center justify-between py-2 px-1 rounded-lg hover:bg-surface-hover transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate">{deal.title}</p>
        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary">
          <span>{deal.contactName}</span>
          <span>·</span>
          <span className={stageColors[deal.stage]}>{deal.stage.replace('_', ' ')}</span>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-xs font-semibold text-text-primary">${deal.value.toLocaleString()}</p>
        <div className="flex items-center gap-1 justify-end">
          <div className="w-12 h-1.5 bg-border/50 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${deal.probability}%` }} />
          </div>
          <span className="text-[10px] text-text-secondary">{deal.probability}%</span>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task, detailed = false }: { task: Task; detailed?: boolean }) {
  const priorityIcons = { low: Clock, medium: Clock, high: AlertTriangle, urgent: AlertTriangle }
  const priorityColors = { low: 'text-text-secondary', medium: 'text-commodity-inputs', high: 'text-warning', urgent: 'text-danger' }
  const PrioIcon = priorityIcons[task.priority]
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <div className="flex items-start gap-2.5 py-2.5 px-1 hover:bg-surface-hover transition-colors rounded-lg">
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
        task.status === 'done' ? 'bg-success border-success' : 'border-border'
      }`}>
        {task.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
            {task.title}
          </p>
          <Chip size="sm">{task.status.replace(/_/g, ' ')}</Chip>
        </div>
        {detailed && <p className="text-[10px] text-text-secondary mt-0.5">{task.description}</p>}
        <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
          <PrioIcon className={`w-3 h-3 ${priorityColors[task.priority]}`} />
          <span className={priorityColors[task.priority]}>{task.priority}</span>
          <span>·</span>
          <span className={isOverdue ? 'text-danger' : ''}>{new Date(task.dueDate).toLocaleDateString()}</span>
          {task.relatedTo && <><span>·</span><span>{task.relatedTo}</span></>}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const budgetUsed = project.budget > 0 ? (project.spent / project.budget) * 100 : 0
  const completed = project.milestones.filter(m => m.status === 'completed').length
  const total = project.milestones.length

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Briefcase className="w-4 h-4 text-commodity-export shrink-0" />
            <h3 className="text-sm font-semibold text-text-primary truncate">{project.name}</h3>
          </div>
          <p className="text-xs text-text-secondary">{project.description}</p>
        </div>
        <StatusChip status={project.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-text-secondary">Budget</p>
          <p className="text-xs font-semibold">${project.budget.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Spent</p>
          <p className="text-xs font-semibold">${project.spent.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Milestones</p>
          <p className="text-xs font-semibold">{completed}/{total}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary">Team</p>
          <p className="text-xs font-semibold truncate">{project.team.length} members</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-[10px] text-text-secondary mb-1">
          <span>Budget Usage</span>
          <span>{budgetUsed.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${budgetUsed > 80 ? 'bg-danger' : budgetUsed > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-text-secondary mt-3">
        <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
      </div>

      {/* Milestones */}
      <div className="border-t border-border mt-3 pt-3">
        <p className="text-[10px] font-medium text-text-secondary mb-2">Milestones</p>
        <div className="space-y-2">
          {project.milestones.map((ms) => (
            <div key={ms.id} className="flex items-center gap-2 text-[10px]">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                ms.status === 'completed' ? 'bg-success border-success' :
                ms.status === 'in_progress' ? 'border-warning border-2' : 'border-border'
              }`}>
                {ms.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <span className={`flex-1 ${ms.status === 'completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                {ms.title}
              </span>
              <span className={`shrink-0 ${new Date(ms.dueDate) < new Date() && ms.status !== 'completed' ? 'text-danger' : 'text-text-secondary'}`}>
                {new Date(ms.dueDate).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function InvoiceRow({ inv }: { inv: Invoice }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-1 hover:bg-surface-hover transition-colors rounded-lg">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        inv.status === 'paid' ? 'bg-success/10' : inv.status === 'overdue' ? 'bg-danger/10' :
        inv.status === 'sent' ? 'bg-warning/10' : 'bg-border/50'
      }`}>
        <Receipt className={`w-4 h-4 ${
          inv.status === 'paid' ? 'text-success' : inv.status === 'overdue' ? 'text-danger' :
          inv.status === 'sent' ? 'text-warning' : 'text-text-secondary'
        }`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-text-primary truncate">{inv.client}</p>
        <div className="flex items-center gap-2 text-[10px] text-text-secondary">
          <span className="font-mono">{inv.invoiceNumber}</span>
          <span>·</span>
          <span>Due {new Date(inv.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-semibold text-text-primary">${inv.amount.toLocaleString()}</p>
        <StatusChip status={inv.status} />
      </div>
    </div>
  )
}
