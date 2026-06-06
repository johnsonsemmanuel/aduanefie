import { useState, useRef, useEffect } from 'react'
import {
  Mail, MessageSquare, Send, Search, Paperclip,
  ArrowLeft, CheckCheck,
  ShoppingBag, FileText, Users, HelpCircle, AlertTriangle,
  MoreHorizontal,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { messageThreads, threadMessages } from '@/data/messages'
import type { MessageThread, MessageCategory } from '@/types'

const categoryIcons: Record<MessageCategory, typeof ShoppingBag> = {
  trade: ShoppingBag,
  contract: FileText,
  support: HelpCircle,
  cooperative: Users,
  general: AlertTriangle,
}

const categoryLabels: Record<MessageCategory, string> = {
  trade: 'Trade',
  contract: 'Contract',
  support: 'Support',
  cooperative: 'Co-op',
  general: 'Alert',
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(timestamp: string): string {
  const d = new Date(timestamp)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return formatTime(timestamp)
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function ThreadAvatar({ name, className = '' }: { name: string; className?: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const colors = ['bg-blue-500/20 text-blue-400', 'bg-green-500/20 text-green-400', 'bg-amber-500/20 text-amber-400', 'bg-purple-500/20 text-purple-400', 'bg-rose-500/20 text-rose-400']
  const color = colors[name.length % colors.length]
  return (
    <div className={`size-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color} ${className}`}>
      {initials}
    </div>
  )
}

function ThreadList({
  threads,
  activeId,
  onSelect,
  filter,
  search,
}: {
  threads: MessageThread[]
  activeId: string | null
  onSelect: (id: string) => void
  filter: MessageCategory | 'all'
  search: string
}) {
  const filtered = threads.filter(t => {
    if (filter !== 'all' && t.category !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return t.subject.toLowerCase().includes(q) || t.participants.some(p => p.name.toLowerCase().includes(q))
    }
    return true
  })

  const totalUnread = threads.reduce((s, t) => s + t.unreadCount, 0)

  return (
    <div className="flex flex-col h-full">
      {filter === 'all' && search === '' && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border shrink-0">
          <Pill className="bg-primary/10 text-primary border-primary/20">
            {totalUnread} unread
          </Pill>
          <Pill className="border-border">{threads.length} threads</Pill>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
        {filtered.map(thread => {
          const isActive = thread.id === activeId
          const CatIcon = categoryIcons[thread.category]
          return (
            <button
              key={thread.id}
              onClick={() => onSelect(thread.id)}
              className={`w-full text-left px-4 py-3 transition-colors hover:bg-surface-hover ${
                isActive ? 'bg-surface-active' : ''
              } ${thread.unreadCount > 0 ? 'bg-primary/[0.02]' : ''}`}
            >
              <div className="flex items-start gap-3">
                <ThreadAvatar name={thread.participants[0]?.name || '?'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>
                      {thread.participants.map(p => p.name).join(', ')}
                    </p>
                    <span className="text-[10px] text-text-secondary shrink-0">{formatDate(thread.lastMessage.timestamp)}</span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${thread.unreadCount > 0 ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                    {thread.subject}
                  </p>
                  <p className="text-[11px] text-text-secondary truncate mt-0.5">
                    {thread.lastMessage.content}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`flex items-center gap-0.5 text-[10px] ${thread.unreadCount > 0 ? 'text-primary' : 'text-text-secondary'}`}>
                      <CatIcon className="size-3" />
                      <span>{categoryLabels[thread.category]}</span>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="size-4 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                    {thread.relatedTo && (
                      <span className="text-[9px] text-text-secondary truncate">{thread.relatedTo.label}</span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="w-8 h-8 text-text-secondary mb-2" />
            <p className="text-sm text-text-secondary">No messages found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatView({
  thread,
  onBack,
  onSend,
}: {
  thread: MessageThread
  onBack: () => void
  onSend: (content: string) => void
}) {
  const messages = threadMessages[thread.id] || []
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  const formatDateDivider = (timestamp: string) => {
    const d = new Date(timestamp)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return 'Today'
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  let lastDate = ''
  const messagesWithDividers = messages.flatMap(m => {
    const date = formatDateDivider(m.timestamp)
    const showDivider = date !== lastDate
    lastDate = date
    return showDivider ? [{ type: 'divider' as const, date } as const, { type: 'message' as const, message: m } as const] : [{ type: 'message' as const, message: m } as const]
  })

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <button onClick={onBack} className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary -ml-1">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <ThreadAvatar name={thread.participants[0]?.name || '?'} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary truncate">{thread.subject}</p>
          <p className="text-[11px] text-text-secondary truncate">
            {thread.participants.map(p => p.name).join(', ')}
          </p>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-hover text-text-secondary">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {messagesWithDividers.map((item, i) =>
          item.type === 'divider' ? (
            <div key={`d-${i}`} className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-text-secondary font-medium">{item.date}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          ) : (
            <div key={item.message.id} className={`flex ${item.message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] ${item.message.sender === 'You' ? 'order-1' : 'order-1'}`}>
                {item.message.sender !== 'You' && (
                  <p className="text-[10px] text-text-secondary mb-1 ml-1">{item.message.sender} · {item.message.senderRole}</p>
                )}
                <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  item.message.sender === 'You'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-surface border border-border rounded-tl-sm'
                }`}>
                  <p className={item.message.sender === 'You' ? 'text-white' : 'text-text-primary'}>{item.message.content}</p>
                  {item.message.attachments && item.message.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.message.attachments.map((att, ai) => (
                        <div key={ai} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-[10px]">
                          <Paperclip className="w-3 h-3" />
                          <span>{att.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 ${item.message.sender === 'You' ? 'justify-end mr-1' : 'ml-1'}`}>
                  <span className="text-[9px] text-text-secondary">{formatTime(item.message.timestamp)}</span>
                  {item.message.sender === 'You' && <CheckCheck className="w-3 h-3 text-text-secondary" />}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-hover text-text-secondary">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

const filterTabs = [
  { id: 'all' as const, label: 'All', icon: Mail },
  { id: 'trade' as const, label: 'Trade', icon: ShoppingBag },
  { id: 'contract' as const, label: 'Contracts', icon: FileText },
  { id: 'cooperative' as const, label: 'Co-op', icon: Users },
  { id: 'support' as const, label: 'Support', icon: HelpCircle },
]

export function Messages() {
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [filter, setFilter] = useState<MessageCategory | 'all'>('all')
  const [search, setSearch] = useState('')
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)

  const activeThreadData = activeThread ? messageThreads.find(t => t.id === activeThread) || null : null

  if (loading) return <div className="p-4"><PageSkeleton type="list" /></div>

  const handleSend = (_content: string) => {
    addToast('Message sent', 'success')
  }

  const handleCompose = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('Message sent successfully', 'success')
    setComposeOpen(false)
    setComposeTo('')
    setComposeSubject('')
    setComposeBody('')
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Messages</h1>
            <p className="text-xs text-text-secondary">{messageThreads.reduce((s, t) => s + t.unreadCount, 0)} unread · {messageThreads.length} threads</p>
          </div>
          <button
            onClick={() => setComposeOpen(true)}
            className="px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-semibold inline-flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-3 h-3" /> Compose
          </button>
        </div>

        {/* Desktop: two-column layout */}
        <div className="flex-1 flex gap-0 min-h-0">
          {/* Thread list panel */}
          <div className={`flex flex-col rounded-xl border border-border bg-surface overflow-hidden ${
            activeThreadData ? 'hidden lg:flex lg:w-96' : 'flex-1 lg:w-96'
          } lg:min-w-0`}>
            {/* Search + filter bar */}
            <div className="shrink-0 border-b border-border">
              <div className="p-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-full border border-border bg-bg text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
                  />
                </div>
              </div>
              <div className="flex gap-1 px-2 pb-2 overflow-x-auto scrollbar-thin">
                {filterTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                      filter === tab.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <ThreadList threads={messageThreads} activeId={activeThread} onSelect={setActiveThread} filter={filter} search={search} />
          </div>

          {/* Chat panel */}
          <div className={`flex-1 flex flex-col min-w-0 ${
            activeThreadData ? 'flex lg:ml-3' : 'hidden lg:flex lg:ml-3'
          }`}>
            {activeThreadData ? (
              <GlassCard padding="none" className="flex-1 flex flex-col overflow-hidden">
                <ChatView thread={activeThreadData} onBack={() => setActiveThread(null)} onSend={handleSend} />
              </GlassCard>
            ) : (
              <div className="flex-1 flex items-center justify-center rounded-xl border border-border bg-surface">
                <div className="text-center">
                  <Mail className="w-10 h-10 text-text-secondary mx-auto mb-3" />
                  <p className="text-sm text-text-primary font-medium">Select a conversation</p>
                  <p className="text-xs text-text-secondary mt-1">Choose a thread from the left panel to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="New Message" size="md">
        <form onSubmit={handleCompose} className="space-y-3">
          <input
            type="text"
            placeholder="To (name or email)"
            value={composeTo}
            onChange={e => setComposeTo(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
          />
          <input
            type="text"
            placeholder="Subject"
            value={composeSubject}
            onChange={e => setComposeSubject(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
          />
          <textarea
            placeholder="Message"
            value={composeBody}
            onChange={e => setComposeBody(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setComposeOpen(false)} className="px-4 py-2 rounded-full border border-border text-text-secondary text-sm hover:bg-surface-hover transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Send className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Send Message
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
