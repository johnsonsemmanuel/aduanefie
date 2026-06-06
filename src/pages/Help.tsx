import { useState } from 'react'
import {
  HelpCircle, Search, ChevronDown, FileText, MessageSquare,
  Mail, Phone, ExternalLink, Rocket, ShoppingBag, Wallet,
  Truck, User, Code2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageShell, type PageTab } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { Pill } from '@/components/ui/Pill'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { helpArticles, faqItems } from '@/data/help'
import type { HelpArticle } from '@/data/help'

const categoryIcons: Record<string, typeof Rocket> = {
  'getting-started': Rocket, trading: ShoppingBag, payments: Wallet,
  logistics: Truck, account: User, api: Code2,
}

const tabs: PageTab[] = [
  { id: 'faq', icon: HelpCircle, label: 'FAQ' },
  { id: 'articles', icon: FileText, label: 'Knowledge Base' },
  { id: 'contact', icon: MessageSquare, label: 'Contact Support' },
]

export function Help() {
  const [activeTab, setActiveTab] = useState<'faq' | 'articles' | 'contact'>('faq')
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const { addToast } = useToast()
  const loading = useSimulatedLoading(500)

  if (loading) return <div className="p-4"><PageSkeleton type="form" /></div>

  const filteredArticles = helpArticles.filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase())
  )
  const filteredFaq = faqItems.filter(f =>
    !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  )

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('Support ticket submitted. We will respond within 24 hours.', 'success')
    setTicketOpen(false)
    setTicketSubject('')
    setTicketMessage('')
  }

  return (
    <PageShell tabs={tabs} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as 'faq' | 'articles' | 'contact')}>
      <div className="space-y-4 min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-lg font-bold text-text-primary">Help & Support</h1>
          <p className="text-xs text-text-secondary">FAQs, documentation, and how to reach us</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search help articles, FAQs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
          />
        </div>

        {/* FAQ tab */}
        {activeTab === 'faq' && (
          <GlassCard padding="none">
            {filteredFaq.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <HelpCircle className="w-8 h-8 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary">No FAQs match your search</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredFaq.map(faq => {
                  const isOpen = expandedFaq === faq.id
                  return (
                    <div key={faq.id}>
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                        className="!justify-start !px-4 !py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">{faq.question}</p>
                          <Pill className="mt-1 text-[9px] border-border capitalize">{faq.category}</Pill>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-text-secondary shrink-0 mt-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </Button>
                      {isOpen && (
                        <div className="px-4 pb-3 pt-0">
                          <p className="text-xs text-text-secondary leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>
        )}

        {/* Knowledge Base tab */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-8 h-8 text-text-secondary mb-2" />
                <p className="text-sm text-text-secondary">No articles match your search</p>
              </div>
            ) : (
              filteredArticles.map(article => {
                const CatIcon = categoryIcons[article.category] || FileText
                return (
                  <Button
                    key={article.id}
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => setSelectedArticle(article)}
                    className="!flex-col !items-start !p-4 text-left group h-auto"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CatIcon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <Pill className="text-[9px] border-border">{article.category}</Pill>
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-xs text-text-secondary line-clamp-2">{article.summary}</p>
                  </Button>
                )
              })
            )}
          </div>
        )}

        {/* Contact Support tab */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Get in Touch</GlassCardTitle>
              </GlassCardHeader>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Email</p>
                    <p className="text-xs text-text-secondary">support@aduanefie.com</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">We respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Phone</p>
                    <p className="text-xs text-text-secondary">+233 30 212 3456</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Mon-Fri, 8:00 AM - 6:00 PM GMT</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Live Chat</p>
                    <p className="text-xs text-text-secondary">Available during business hours</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Open a Support Ticket</GlassCardTitle>
              </GlassCardHeader>
              <p className="text-xs text-text-secondary mb-3">
                Can't find what you need? Submit a ticket and our team will help.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setTicketOpen(true)}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Open Ticket
              </Button>
            </GlassCard>
          </div>
        )}

        {/* Article detail modal */}
        <Modal open={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={selectedArticle?.title || ''} size="md">
          {selectedArticle && (
            <div className="space-y-3">
              <Pill className="text-[10px] border-border capitalize">{selectedArticle.category}</Pill>
              <p className="text-sm text-text-primary leading-relaxed">{selectedArticle.content}</p>
              <div className="flex justify-end pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { addToast('Opening related articles...', 'info') }}
                  className="!text-primary"
                >
                  More articles <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Ticket modal */}
        <Modal open={ticketOpen} onClose={() => setTicketOpen(false)} title="Submit Support Ticket" size="md">
          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <input
              type="text" placeholder="Subject" value={ticketSubject} onChange={e => setTicketSubject(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
            />
            <select className="w-full px-4 py-2.5 rounded-full border border-border bg-bg text-sm text-text-primary focus:outline-none focus:border-neutral-500">
              <option value="">Select category</option>
              <option value="trading">Trading Issue</option>
              <option value="payment">Payment Issue</option>
              <option value="account">Account Issue</option>
              <option value="technical">Technical Issue</option>
              <option value="other">Other</option>
            </select>
            <textarea
              placeholder="Describe your issue in detail..." value={ticketMessage} onChange={e => setTicketMessage(e.target.value)} required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={() => setTicketOpen(false)}>Cancel</Button>
              <Button variant="primary" size="sm" type="submit">Submit Ticket</Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageShell>
  )
}
