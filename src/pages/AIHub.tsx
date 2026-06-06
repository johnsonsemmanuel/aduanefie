import { useState } from 'react'
import {
  Brain, MessageCircle, Lightbulb, TrendingUp, Cloud,
  AlertTriangle, Send, Sparkles, Target, BarChart3
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { aiRecommendations, aiChatMessages } from '@/data/ai'

const tabs = [
  { id: 'assistant', label: 'Assistant', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-3.5 h-3.5" /> },
]

export function AIHub() {
  const [activeTab, setActiveTab] = useState('assistant')
  const [messages, setMessages] = useState(aiChatMessages)
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: typeof messages[0] = { id: `msg-${Date.now()}`, role: 'user', content: input, timestamp: new Date().toISOString() }
    const botMsg: typeof messages[0] = { id: `msg-${Date.now() + 1}`, role: 'assistant', content: `I'm analyzing the latest market data related to "${input}". Based on current trends, I recommend monitoring cocoa and maize prices closely this week. Would you like me to prepare a detailed analysis?`, timestamp: new Date().toISOString() }
    setMessages([...messages, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">AI Hub</h1>
          <p className="text-xs text-text-secondary">Trade assistant, farm advisor, and predictive analytics</p>
        </div>
        <Chip icon={<Sparkles className="w-3 h-3" />} variant="premium">Powered by AgriBrain</Chip>
      </div>

      <div className="hidden lg:block">
        <Card padding="none">
          <div className="flex border-b border-border overflow-x-auto scrollbar-thin px-4">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id ? 'border-primary text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              ><span className="w-3.5 h-3.5">{tab.icon}</span>{tab.label}</button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4 pb-14 lg:pb-0">
        {activeTab === 'assistant' && (
          <Card>
            <CardHeader>
              <CardTitle>AI Trade Assistant</CardTitle>
              <span className="text-xs text-text-secondary">Ask anything about markets, prices, logistics</span>
            </CardHeader>
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
                className="flex-1 bg-bg border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-secondary outline-none focus:border-primary transition-colors"
              />
              <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </Card>
        )}
        {activeTab === 'insights' && <InsightsTab />}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border pb-safe">
        <div className="flex items-center justify-around h-14">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 min-w-0 px-2 py-1 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-text-secondary'
              }`}
            ><span className="w-4 h-4">{tab.icon}</span><span className="text-[10px] font-medium">{tab.label}</span></button>
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightsTab() {
  const [catFilter, setCatFilter] = useState<string>('all')
  const categories = ['all', 'trade', 'pricing', 'weather', 'planting', 'risk']
  const filtered = catFilter === 'all' ? aiRecommendations : aiRecommendations.filter(r => r.category === catFilter)

  const catIcons: Record<string, typeof Brain> = { trade: TrendingUp, pricing: BarChart3, weather: Cloud, planting: Target, risk: AlertTriangle }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <div className="flex gap-1 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${catFilter === c ? 'bg-primary text-white' : 'bg-border/50 text-text-secondary hover:bg-surface-hover'}`}
              >{c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}</button>
            ))}
          </div>
        </CardHeader>
      </Card>
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
                <Chip variant={rec.impact === 'high' ? 'danger' : rec.impact === 'medium' ? 'warning' : 'default'} size="sm">
                  {rec.impact}
                </Chip>
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-1">{rec.title}</h3>
              <p className="text-[10px] text-text-secondary mb-3">{rec.description}</p>
              <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border pt-2">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-warning" />
                  {rec.confidence}% confidence
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
