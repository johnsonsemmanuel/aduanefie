import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
  Menu, X, Command
} from 'lucide-react'
import { agriModules } from '@/data/agrios'
import { Button } from '@/components/ui/Button'
import type { OSModule } from '@/types'
import { useState } from 'react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
}

function ModuleIcon({ mod, size = 'w-5 h-5' }: { mod: OSModule; size?: string }) {
  const Icon = iconMap[mod.icon]
  if (!Icon) return <div className={`${size} rounded bg-primary/10`} />
  return <div style={{ color: mod.color }}><Icon className={size} /></div>
}

const layers = [
  { num: 1, name: 'Foundation', modules: 'Cooperative Hub, Administration' },
  { num: 2, name: 'Trade & Sourcing', modules: 'Trade Engine, Export Hub, Procurement Hub' },
  { num: 3, name: 'Logistics', modules: 'Logistics Hub' },
  { num: 4, name: 'Storage', modules: 'Storage Hub' },
  { num: 5, name: 'Finance', modules: 'Finance Hub' },
  { num: 6, name: 'Intelligence', modules: 'Market Intel' },
  { num: 7, name: 'Operations', modules: 'Business Hub' },
  { num: 8, name: 'Development', modules: 'Developer Hub' },
  { num: 9, name: 'AI & Automation', modules: 'AI Hub' },
]

const stakeholders = [
  {
    title: 'For Farmers & Producers',
    description: 'Access real-time market prices, sell directly to buyers, join cooperatives for collective bargaining, and get AI-powered planting and harvest recommendations.',
    modules: ['Market Intel', 'Cooperative Hub', 'Trade Engine', 'AI Hub'],
    color: '#2E7D32',
  },
  {
    title: 'For Buyers & Processors',
    description: 'Source commodities directly from verified producers, manage RFQs and purchase orders, track logistics in real time, and access trade finance for bulk purchases.',
    modules: ['Trade Engine', 'Procurement Hub', 'Logistics Hub', 'Finance Hub'],
    color: '#2980B9',
  },
  {
    title: 'For Suppliers & Input Providers',
    description: 'List agricultural inputs, manage vendor contracts, receive RFQs from farmers and cooperatives, and track delivery and payments.',
    modules: ['Procurement Hub', 'Business Hub', 'Finance Hub'],
    color: '#8E44AD',
  },
  {
    title: 'For Logistics & Storage',
    description: 'Manage fleet operations, track shipments in transit, optimize warehouse capacity, and integrate with the trade engine for seamless delivery coordination.',
    modules: ['Logistics Hub', 'Storage Hub', 'Business Hub'],
    color: '#F57C00',
  },
]

export function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-bg">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-bg/95 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Command className="w-4 h-4 text-cream" />
            </div>
            <span className="text-sm font-bold text-text-primary">AgriOS</span>
            <span className="hidden sm:inline text-[10px] text-text-secondary font-medium uppercase tracking-wider ml-1">Aduanefie</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#modules" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Modules</a>
            <a href="#stakeholders" className="text-xs text-text-secondary hover:text-text-primary transition-colors">For You</a>
            <a href="#layers" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Architecture</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors">
              Log In
            </button>
            <Button size="sm" onClick={() => navigate('/login')}>
              Get Started
            </Button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden ml-1 p-1.5 text-text-secondary">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-2">
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-text-secondary py-1.5">Modules</a>
            <a href="#stakeholders" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-text-secondary py-1.5">For You</a>
            <a href="#layers" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-text-secondary py-1.5">Architecture</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-surface text-[10px] font-medium text-text-secondary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Operating System for African Agriculture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-4 text-balance">
            Welcome to AgriOS
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary font-medium mb-2">
            Aduanefie Trade Engine
          </p>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto mb-8 text-balance">
            A unified platform connecting farmers, buyers, suppliers, logistics providers, and financial institutions across Africa. Trade smarter with real-time market intelligence, digital trade finance, and end-to-end logistics.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate('/login')}>
              Get Started
            </Button>
            <Button variant="secondary" onClick={() => navigate('/login')}>
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Platform Trade Volume', value: '$4.2M' },
              { label: 'Active Users', value: '1,847' },
              { label: 'Live Markets', value: '28' },
              { label: 'Modules', value: '12' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-secondary">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is AgriOS */}
      <section className="border-b border-border" id="layers">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Built in 9 Layers</h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Every aspect of agricultural trade is covered — from cooperative organization at the foundation to AI-powered intelligence at the top.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {layers.map((layer) => (
              <div key={layer.num} className="rounded-lg border border-border bg-surface p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">L{layer.num}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{layer.name}</p>
                  <p className="text-[10px] text-text-secondary">{layer.modules}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="border-b border-border" id="modules">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">All Modules</h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Twelve integrated modules that work together as a single operating system for your agricultural business.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {agriModules.map((mod) => (
              <div key={mod.id} className="rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: `${mod.color}12` }}>
                  <ModuleIcon mod={mod} />
                </div>
                <p className="text-xs font-semibold text-text-primary mb-0.5">{mod.name}</p>
                <p className="text-[10px] text-text-secondary leading-snug">{mod.description}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                    mod.status === 'active' ? 'bg-success/10 text-success' :
                    mod.status === 'beta' ? 'bg-warning/10 text-warning' : 'bg-border/50 text-text-secondary'
                  }`}>
                    {mod.status === 'active' ? 'Live' : mod.status === 'beta' ? 'Beta' : 'Soon'}
                  </span>
                  <span className="text-[9px] text-text-secondary font-mono">L{mod.layer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Stakeholders */}
      <section className="border-b border-border" id="stakeholders">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Built for Every Stakeholder</h2>
            <p className="text-sm text-text-secondary max-w-xl mx-auto">
              Whether you grow, buy, sell, transport, or finance agricultural products — AgriOS has a workspace for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stakeholders.map((s) => (
              <div key={s.title} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <h3 className="text-sm font-semibold text-text-primary">{s.title}</h3>
                </div>
                <p className="text-xs text-text-secondary mb-3 leading-relaxed">{s.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {s.modules.map((m) => (
                    <span key={m} className="text-[9px] bg-border/50 text-text-secondary rounded px-1.5 py-0.5 font-medium">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-cream mb-3">Ready to transform your agricultural trade?</h2>
          <p className="text-sm text-cream/80 max-w-lg mx-auto mb-6">
            Join 1,800+ farmers, buyers, and traders already using AgriOS to connect, trade, and grow.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/login')} className="bg-cream text-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-cream/90 transition-colors">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} className="border border-cream/30 text-cream text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
                <Command className="w-3 h-3 text-cream" />
              </div>
              <span className="text-xs font-bold text-text-primary">AgriOS</span>
              <span className="text-[10px] text-text-secondary">Aduanefie Trade Engine</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-text-secondary">
              <span>&copy; 2026 Aduanefie</span>
              <span>·</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
