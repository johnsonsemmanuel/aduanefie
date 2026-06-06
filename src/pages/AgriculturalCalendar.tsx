import { useState } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, Sprout, Wheat,
  Truck, Wrench, Users, ShoppingBag, CloudSun, MapPin,
  Plus, List, Grid,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { calendarEvents } from '@/data/calendar'
import type { AgCalendarEvent, AgEventCategory } from '@/types'

const categoryConfig: Record<AgEventCategory, { icon: typeof Sprout; label: string; color: string }> = {
  planting: { icon: Sprout, label: 'Planting', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
  harvest: { icon: Wheat, label: 'Harvest', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  delivery: { icon: Truck, label: 'Delivery', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  maintenance: { icon: Wrench, label: 'Maintenance', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  meeting: { icon: Users, label: 'Meeting', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  market: { icon: ShoppingBag, label: 'Market', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  weather: { icon: CloudSun, label: 'Weather', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days: (number | null)[] = []
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null)
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i)
  return days
}

function getEventsForDate(events: AgCalendarEvent[], date: Date): AgCalendarEvent[] {
  const dateStr = date.toISOString().slice(0, 10)
  return events.filter(e => {
    if (e.date === dateStr) return true
    if (e.endDate && e.endDate >= dateStr && e.date <= dateStr) return true
    return false
  })
}

function CalendarGrid({
  year, month, events, onEventClick, onDateClick,
}: {
  year: number; month: number; events: AgCalendarEvent[]
  onEventClick: (e: AgCalendarEvent) => void
  onDateClick: (date: Date) => void
}) {
  const days = getMonthDays(year, month)
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  return (
    <div className="grid grid-cols-7 border-l border-t border-border">
      {dayNames.map(d => (
        <div key={d} className="border-r border-b border-border px-1.5 py-2 text-[10px] font-semibold text-text-secondary uppercase tracking-wider text-center">
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        if (day === null) return <div key={`empty-${i}`} className="border-r border-b border-border min-h-[80px] sm:min-h-[100px] bg-bg/30" />
        const date = new Date(year, month, day)
        const dateStr = date.toISOString().slice(0, 10)
        const isToday = dateStr === todayStr
        const dayEvents = getEventsForDate(events, date)
        const maxShow = 2

        return (
          <div
            key={i}
            onClick={() => onDateClick(date)}
            className={`border-r border-b border-border p-1 min-h-[80px] sm:min-h-[100px] cursor-pointer hover:bg-surface-hover transition-colors ${
              isToday ? 'bg-primary/[0.03]' : ''
            }`}
          >
            <div className={`text-[11px] font-semibold mb-1 ${isToday ? 'text-primary' : 'text-text-secondary'}`}>
              {day}
            </div>
            <div className="space-y-0.5">
              {dayEvents.slice(0, maxShow).map(e => {
                const cfg = categoryConfig[e.category]
                const Icon = cfg.icon
                return (
                  <button
                    key={e.id}
                    onClick={eve => { eve.stopPropagation(); onEventClick(e) }}
                    className={`w-full flex items-center gap-1 px-1 py-0.5 rounded text-[8px] font-medium truncate leading-tight ${cfg.color}`}
                  >
                    <Icon className="w-2.5 h-2.5 shrink-0" />
                    <span className="truncate">{e.title}</span>
                  </button>
                )
              })}
              {dayEvents.length > maxShow && (
                <span className="text-[8px] text-text-secondary font-medium pl-1">
                  +{dayEvents.length - maxShow} more
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EventList({
  events, filter, onEventClick,
}: {
  events: AgCalendarEvent[]; filter: AgEventCategory | 'all'; onEventClick: (e: AgCalendarEvent) => void
}) {
  const filtered = filter === 'all' ? events : events.filter(e => e.category === filter)
  const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CalendarDays className="w-8 h-8 text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary">No events in this category</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {sorted.map(e => {
        const cfg = categoryConfig[e.category]
        const Icon = cfg.icon
        return (
          <button
            key={e.id}
            onClick={() => onEventClick(e)}
            className="w-full text-left px-4 py-2.5 hover:bg-surface-hover transition-colors flex items-start gap-3"
          >
            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary">{e.title}</p>
              <p className="text-[10px] text-text-secondary mt-0.5 line-clamp-1">{e.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-text-secondary">
                  {e.endDate ? `${e.date} – ${e.endDate}` : e.date}
                </span>
                {e.commodity && (
                  <Pill className="text-[8px] border-border">{e.commodity}</Pill>
                )}
                {e.region && (
                  <span className="text-[9px] text-text-secondary flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {e.region}
                  </span>
                )}
              </div>
            </div>
            <Pill className={`text-[9px] shrink-0 ${cfg.color}`}>{cfg.label}</Pill>
          </button>
        )
      })}
    </div>
  )
}

const categoryFilters = [
  { id: 'all' as const, label: 'All', icon: CalendarDays },
  { id: 'planting' as const, label: 'Planting', icon: Sprout },
  { id: 'harvest' as const, label: 'Harvest', icon: Wheat },
  { id: 'delivery' as const, label: 'Deliveries', icon: Truck },
  { id: 'meeting' as const, label: 'Meetings', icon: Users },
  { id: 'market' as const, label: 'Markets', icon: ShoppingBag },
  { id: 'weather' as const, label: 'Weather', icon: CloudSun },
]

export function AgriculturalCalendar() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [filter, setFilter] = useState<AgEventCategory | 'all'>('all')
  const [selectedEvent, setSelectedEvent] = useState<AgCalendarEvent | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)

  if (loading) return <div className="p-4"><PageSkeleton type="list" /></div>

  const filteredEvents = filter === 'all'
    ? calendarEvents
    : calendarEvents.filter(e => e.category === filter)

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }
  const goToday = () => {
    const t = new Date(); setYear(t.getFullYear()); setMonth(t.getMonth())
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Agricultural Calendar</h1>
          <p className="text-xs text-text-secondary">Planting seasons, harvest windows, deliveries, and key agri events</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Event
          </button>
          <div className="flex rounded-full border border-border overflow-hidden">
            <button
              onClick={() => setView('calendar')}
              className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${view === 'calendar' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'}`}
            >
              <Grid className="w-3 h-3" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-2.5 py-1.5 text-[10px] font-medium transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'}`}
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
        {categoryFilters.map(cf => (
          <button
            key={cf.id}
            onClick={() => setFilter(cf.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
              filter === cf.id ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-hover'
            }`}
          >
            <cf.icon className="w-3 h-3" />
            {cf.label}
          </button>
        ))}
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <GlassCard padding="none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-sm font-semibold text-text-primary">{monthNames[month]} {year}</h2>
              <button onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button onClick={goToday} className="px-3 py-1 rounded-full border border-border text-[10px] font-medium text-text-secondary hover:bg-surface-hover transition-colors">
              Today
            </button>
          </div>
          <CalendarGrid year={year} month={month} events={filteredEvents} onEventClick={setSelectedEvent} onDateClick={() => {}} />
        </GlassCard>
      )}

      {/* List view */}
      {view === 'list' && (
        <GlassCard padding="none">
          <EventList events={filteredEvents} filter={filter} onEventClick={setSelectedEvent} />
        </GlassCard>
      )}

      {/* Event detail modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title || 'Event'} size="sm">
        {selectedEvent && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Pill className={categoryConfig[selectedEvent.category].color}>
                {categoryConfig[selectedEvent.category].label}
              </Pill>
              {selectedEvent.commodity && <Pill>{selectedEvent.commodity}</Pill>}
            </div>
            <p className="text-sm text-text-primary">{selectedEvent.description}</p>
            <div className="text-[11px] text-text-secondary space-y-1">
              <p className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                {selectedEvent.endDate
                  ? `${selectedEvent.date} – ${selectedEvent.endDate}`
                  : selectedEvent.date}
              </p>
              {selectedEvent.region && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {selectedEvent.region}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add event modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Event" size="sm">
        <form onSubmit={e => { e.preventDefault(); addToast('Event added to calendar', 'success'); setAddOpen(false) }} className="space-y-3">
          <input
            type="text" placeholder="Event title" required
            className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
          />
          <textarea
            placeholder="Description" rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500 resize-none"
          />
          <div className="flex items-center gap-2">
            <input type="date" className="flex-1 px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary focus:outline-none focus:border-neutral-500" />
            <input type="date" className="flex-1 px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary focus:outline-none focus:border-neutral-500" placeholder="End date" />
          </div>
          <div className="flex gap-2">
            {(['planting', 'harvest', 'delivery', 'meeting', 'market', 'weather', 'maintenance'] as const).map(cat => (
              <button
                key={cat}
                type="button"
                className={`px-2.5 py-1 rounded-full text-[10px] font-medium capitalize border transition-colors ${cat === 'planting' ? 'border-primary/30 bg-primary/5 text-primary' : 'border-border text-text-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-full border border-border text-text-secondary text-sm hover:bg-surface-hover transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Add Event</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
