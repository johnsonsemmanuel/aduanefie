import { useState } from 'react'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import {
  Brain, MessageCircle, Lightbulb, TrendingUp, Cloud,
  AlertTriangle, Send, Sparkles, Target, BarChart3
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { Pill } from '@/components/ui/Pill'
import { aiRecommendations, aiChatMessages } from '@/data/ai'

export function AIHub() {
  const [activeTab, setActiveTab] = useState('assistant')
  const [messages, setMessages] = useState(aiChatMessages)
  const [input, setInput] = useState('')
  const loading = useSimulatedLoading(500)
  if (loading) return <PageShell tabs={[{ id: 'assistant', icon: MessageCircle, label: 'Assistant' }, { id: 'insights', icon: Lightbulb, label: 'Insights' }]} activeTab={activeTab} onTabChange={setActiveTab}><PageSkeleton type="list" /></PageShell>

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { id: `msg-${Date.now()}`, role: 'user' as const, content: input, timestamp: new Date().toISOString() }
    const botMsg = { id: `msg-${Date.now() + 1}`, role: 'assistant' as const, content: `I'm analyzing the latest market data related to "${input}". Based on current trends, I recommend monitoring cocoa and maize prices closely this week. Would you like me to prepare a detailed analysis?`, timestamp: new Date().toISOString() }
    setMessages([...messages, userMsg, botMsg])
    setInput('')
  }

  return (
    <PageShell
      tabs={[
        { id: 'assistant', icon: MessageCircle, label: 'Assistant' },
        { id: 'insights', icon: Lightbulb, label: 'Insights' },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">AI Hub</h1>
            <p className="text-xs text-text-secondary">Trade assistant, farm advisor, and predictive analytics</p>
          </div>
          <Pill variant="premium">
            <Sparkles className="w-3 h-3" /> Powered by AgriBrain
          </Pill>
        </div>

        {activeTab === 'assistant' && (
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>AI Trade Assistant</GlassCardTitle>
              <span className="text-xs text-text-secondary">Ask anything about markets, prices, logistics</span>
            </GlassCardHeader>
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin space-y-3 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Brain className="w-4 h-4 text-primary" /></div>}
                  <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-bg border border-border'}`}>
                    <p className="text-xs">{msg.content}</p>
                    <p className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-text-secondary'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about markets, prices, or farming advice..."
                className="flex-1 bg-bg border border-border rounded-full px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary outline-none focus:border-primary transition-colors"
              />
              <button onClick={handleSend} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </GlassCard>
        )}

        {activeTab === 'insights' && <InsightsTab />}
      </div>
    </PageShell>
  )
}

function InsightsTab() {
  const [catFilter, setCatFilter] = useState<string>('all')
  const categories = ['all', 'trade', 'pricing', 'weather', 'planting', 'risk']
  const filtered = catFilter === 'all' ? aiRecommendations : aiRecommendations.filter(r => r.category === catFilter)
  const catIcons: Record<string, typeof Brain> = { trade: TrendingUp, pricing: BarChart3, weather: Cloud, planting: Target, risk: AlertTriangle }

  return (
    <>
      <div className="flex gap-1 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-surface-active text-text-secondary hover:bg-surface-hover'}`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((rec) => {
          const CatIcon = catIcons[rec.category] || Brain
          return (
            <div key={rec.id} className="rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <CatIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-medium text-text-secondary uppercase">{rec.category}</span>
                </div>
                <Pill variant={rec.impact === 'high' ? 'danger' : rec.impact === 'medium' ? 'warning' : 'default'}>
                  {rec.impact}
                </Pill>
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-1">{rec.title}</h3>
              <p className="text-[10px] text-text-secondary mb-3">{rec.description}</p>
              <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border pt-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-warning" /> {rec.confidence}% confidence
                </span>
                <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
