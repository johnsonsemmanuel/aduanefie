import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import {
  Building2, Users, Target, ClipboardCheck, Receipt, TrendingUp,
  CheckCircle, Clock, AlertTriangle, Plus, UserPlus, ListTodo, Briefcase
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { StatusPill, Pill } from '@/components/ui/Pill'
import { businessDashboard, contacts, deals, tasks, projects, invoices } from '@/data/business'
import type { Deal, Task, Project, Invoice, DealStage, TaskStatus } from '@/types'

export function BusinessHub() {
  const [activeTab, setActiveTab] = useState('overview')
  const [modalOpen, setModalOpen] = useState<'deal' | 'task' | null>(null)
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'overview', icon: Building2, label: 'Overview' }, { id: 'crm', icon: Users, label: 'CRM' }, { id: 'tasks', icon: ListTodo, label: 'Tasks' }, { id: 'projects', icon: Briefcase, label: 'Projects' }, { id: 'accounting', icon: Receipt, label: 'Accounting' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="dashboard" /></PageShell>

  return (
    <PageShell
      tabs={[
        { id: 'overview', icon: Building2, label: 'Overview' },
        { id: 'crm', icon: Users, label: 'CRM' },
        { id: 'tasks', icon: ListTodo, label: 'Tasks' },
        { id: 'projects', icon: Briefcase, label: 'Projects' },
        { id: 'accounting', icon: Receipt, label: 'Accounting' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Business Hub</h1>
            <p className="text-xs text-text-secondary">CRM, projects, tasks, and accounting</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="primary" size="sm">
              <UserPlus className="w-3.5 h-3.5" /> Add Contact
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen('deal')}>
              <Plus className="w-3.5 h-3.5" /> New Deal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <GlassCard className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider">Revenue</span>
            </div>
            <p className="text-lg font-bold text-text-primary">${businessDashboard.monthlyRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-success font-medium">+{businessDashboard.revenueChange}% vs last month</span>
          </GlassCard>
          {[
            { label: 'Active Deals', value: businessDashboard.activeDeals.toString(), icon: Target, color: 'text-commodity-export', bg: 'bg-commodity-export/10' },
            { label: 'Open Tasks', value: businessDashboard.openTasks.toString(), icon: ClipboardCheck, color: 'text-warning', bg: 'bg-warning/10' },
            { label: 'Active Projects', value: businessDashboard.activeProjects.toString(), icon: Briefcase, color: 'text-commodity-inputs', bg: 'bg-commodity-inputs/10' },
            { label: 'Overdue Invoices', value: businessDashboard.overdueInvoices.toString(), icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10' },
          ].map((m) => (
            <GlassCard key={m.label} className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider truncate">{m.label}</span>
                <div className={`w-6 h-6 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                  <m.icon className={`w-3 h-3 ${m.color}`} />
                </div>
              </div>
              <p className="text-lg font-bold text-text-primary">{m.value}</p>
            </GlassCard>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'crm' && <CRMTab />}
        {activeTab === 'tasks' && <TasksTab onNewTask={() => setModalOpen('task')} />}
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'accounting' && <AccountingTab />}

        <Modal open={modalOpen === 'deal'} onClose={() => setModalOpen(null)} title="New Deal" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Deal created successfully', 'success'); setModalOpen(null); }} className="space-y-3">
            <input type="text" placeholder="Deal Title" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="text" placeholder="Contact Name" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="number" placeholder="Value" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select stage</option>
              <option>Lead</option>
              <option>Qualified</option>
              <option>Proposal</option>
              <option>Negotiation</option>
            </select>
            <Button type="submit" variant="primary" size="sm" fullWidth>Create Deal</Button>
          </form>
        </Modal>

        <Modal open={modalOpen === 'task'} onClose={() => setModalOpen(null)} title="New Task" size="sm">
          <form onSubmit={(e) => { e.preventDefault(); addToast('Task created successfully', 'success'); setModalOpen(null); }} className="space-y-3">
            <input type="text" placeholder="Task Title" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <input type="text" placeholder="Description" className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm placeholder:text-text-secondary focus:outline-none focus:border-neutral-500" />
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-text-primary text-sm focus:outline-none focus:border-neutral-500">
              <option>Select priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
            <Button type="submit" variant="primary" size="sm" fullWidth>Create Task</Button>
          </form>
        </Modal>
      </div>
    </PageShell>
  )
}

function OverviewTab() {
  const totalPipeline = deals.filter(d => d.stage !== 'closed_lost' && d.stage !== 'closed_won').reduce((s, d) => s + d.value, 0)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GlassCard padding="none">
          <GlassCardHeader className="px-4 pt-4">
            <GlassCardTitle>Deal Pipeline</GlassCardTitle>
            <span className="text-xs text-text-secondary">${totalPipeline.toLocaleString()} total pipeline value</span>
          </GlassCardHeader>
          <div className="px-4 pb-4 space-y-2">
            {businessDashboard.recentDeals.filter(d => d.stage !== 'closed_lost').map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </div>
        </GlassCard>

        <GlassCard padding="none">
          <GlassCardHeader className="px-4 pt-4">
            <GlassCardTitle>Upcoming Tasks</GlassCardTitle>
            <span className="text-xs text-text-secondary">{businessDashboard.openTasks} open</span>
          </GlassCardHeader>
          <div className="divide-y divide-border">
            {businessDashboard.upcomingTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Invoicing Summary</GlassCardTitle>
          <span className="text-xs text-text-secondary">This month</span>
        </GlassCardHeader>
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
      </GlassCard>
    </>
  )
}

function CRMTab() {
  const [dealFilter, setDealFilter] = useState<DealStage | 'all'>('all')
  const stageLabels: Record<string, string> = { lead: 'Lead', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Won', closed_lost: 'Lost' }
  const filteredDeals = dealFilter === 'all' ? deals : deals.filter(d => d.stage === dealFilter)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <GlassCard padding="none">
        <GlassCardHeader className="px-4 pt-4">
          <GlassCardTitle>Contacts</GlassCardTitle>
          <span className="text-xs text-text-secondary">{contacts.length} contacts</span>
        </GlassCardHeader>
        <div className="px-4 pb-4 space-y-2">
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
      </GlassCard>

      <GlassCard padding="none">
        <GlassCardHeader className="px-4 pt-4">
          <GlassCardTitle>Deals</GlassCardTitle>
          <div className="flex gap-1">
            {['all', 'lead', 'qualified', 'proposal', 'negotiation', 'closed_won'].map((s) => (
            <Button
              key={s}
              variant={dealFilter === s ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setDealFilter(s as DealStage | 'all')}
            >
              {s === 'all' ? 'All' : stageLabels[s]}
            </Button>
            ))}
          </div>
        </GlassCardHeader>
        <div className="px-4 pb-4 space-y-2">
          {filteredDeals.map((deal) => (
            <DealRow key={deal.id} deal={deal} />
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function TasksTab({ onNewTask }: { onNewTask?: () => void }) {
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'all'>('all')
  const taskStatusLabels: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', review: 'Review', done: 'Done' }
  const filtered = taskFilter === 'all' ? tasks : tasks.filter(t => t.status === taskFilter)

  return (
    <GlassCard padding="none">
      <GlassCardHeader className="px-4 pt-4">
        <div className="flex items-center justify-between w-full">
          <GlassCardTitle>All Tasks</GlassCardTitle>
          <Button onClick={onNewTask} variant="primary" size="sm">
            <Plus className="w-3.5 h-3.5" /> New Task
          </Button>
        </div>
        <div className="flex gap-1">
          {['all', 'todo', 'in_progress', 'review', 'done'].map((s) => (
            <Button
              key={s}
              variant={taskFilter === s ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTaskFilter(s as TaskStatus | 'all')}
            >
              {s === 'all' ? 'All' : taskStatusLabels[s]}
            </Button>
          ))}
        </div>
      </GlassCardHeader>
      <div className="divide-y divide-border">
        {filtered.map((task) => (
          <TaskRow key={task.id} task={task} detailed />
        ))}
      </div>
    </GlassCard>
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
        <Button variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" /> New Invoice
        </Button>
      </div>

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

      <GlassCard padding="none">
        <GlassCardHeader className="px-4 pt-4">
          <GlassCardTitle>Invoices</GlassCardTitle>
          <div className="flex gap-1">
            {['all', 'paid', 'sent', 'overdue', 'draft'].map((s) => (
            <Button
              key={s}
              variant={invFilter === s ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setInvFilter(s as typeof invFilter)}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
            ))}
          </div>
        </GlassCardHeader>
        <div className="divide-y divide-border">
          {filtered.map((inv) => (
            <InvoiceRow key={inv.id} inv={inv} />
          ))}
        </div>
      </GlassCard>
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
    <div className="flex items-start gap-2.5 py-2.5 px-4 hover:bg-surface-hover">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
        task.status === 'done' ? 'bg-success border-success' : 'border-border'
      }`}>
        {task.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
            {task.title}
          </p>
          <Pill>{task.status.replace(/_/g, ' ')}</Pill>
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
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Briefcase className="w-4 h-4 text-commodity-export shrink-0" />
            <h3 className="text-sm font-semibold text-text-primary truncate">{project.name}</h3>
          </div>
          <p className="text-xs text-text-secondary">{project.description}</p>
        </div>
        <StatusPill status={project.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div><p className="text-[10px] text-text-secondary">Budget</p><p className="text-xs font-semibold">${project.budget.toLocaleString()}</p></div>
        <div><p className="text-[10px] text-text-secondary">Spent</p><p className="text-xs font-semibold">${project.spent.toLocaleString()}</p></div>
        <div><p className="text-[10px] text-text-secondary">Milestones</p><p className="text-xs font-semibold">{completed}/{total}</p></div>
        <div><p className="text-[10px] text-text-secondary">Team</p><p className="text-xs font-semibold truncate">{project.team.length} members</p></div>
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

      <div className="flex items-center justify-between text-[10px] text-text-secondary">
        <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
      </div>

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
    </GlassCard>
  )
}

function InvoiceRow({ inv }: { inv: Invoice }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 hover:bg-surface-hover">
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
        <StatusPill status={inv.status} />
      </div>
    </div>
  )
}
