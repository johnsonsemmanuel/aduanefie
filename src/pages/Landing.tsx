import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
  Menu, X
} from 'lucide-react'
import { agriModules } from '@/data/agrios'
import type { OSModule } from '@/types'
import { motion } from 'framer-motion'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp, BarChart3, Truck, Wallet, Warehouse, Users,
  Globe, Brain, ClipboardCheck, Building2, Code2, Shield,
}

function ModuleIcon({ mod, size = 'w-5 h-5' }: { mod: OSModule; size?: string }) {
  const Icon = iconMap[mod.icon]
  if (!Icon) return <div className={`${size} rounded bg-white/10`} />
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
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 200} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  return (
    <div className="min-h-dvh bg-black text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-black/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" />
              <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-bold text-white">AgriOS</span>
            <span className="hidden sm:inline text-[10px] text-white/40 font-medium uppercase tracking-wider ml-1">Aduanefie</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#modules" className="text-xs text-white/50 hover:text-white transition-colors">Modules</a>
            <a href="#stakeholders" className="text-xs text-white/50 hover:text-white transition-colors">For You</a>
            <a href="#layers" className="text-xs text-white/50 hover:text-white transition-colors">Architecture</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/login')} className="text-xs font-medium text-white/50 hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-colors">
              Log In
            </button>
            <button onClick={() => navigate('/signup')} className="text-xs font-semibold text-black bg-white rounded-full px-4 py-2 hover:bg-white/90 transition-colors">
              Sign Up
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden ml-1 p-1.5 text-white/50">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black px-4 py-3 space-y-2">
            <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-white/50 py-1.5">Modules</a>
            <a href="#stakeholders" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-white/50 py-1.5">For You</a>
            <a href="#layers" onClick={() => setMobileMenuOpen(false)} className="block text-xs text-white/50 py-1.5">Architecture</a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {dimension.width > 0 && (
          <svg className="absolute top-0 w-full h-[calc(100%+200px)] -z-10" preserveAspectRatio="none">
            <motion.path
              initial={{ d: initialPath }}
              animate={{ d: targetPath }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
              fill="#070b13"
            />
          </svg>
        )}
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-[10px] font-medium text-white/50 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Operating System for African Agriculture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 text-balance">
            Welcome to AgriOS
          </h1>
          <p className="text-lg sm:text-xl text-white/70 font-medium mb-2">
            Aduanefie Trade Engine
          </p>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto mb-8 text-balance">
            A unified platform connecting farmers, buyers, suppliers, logistics providers, and financial institutions across Africa. Trade smarter with real-time market intelligence, digital trade finance, and end-to-end logistics.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/signup')} className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
              Get Started
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-full border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors backdrop-blur-[2px]">
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Platform Trade Volume', value: '$4.2M' },
              { label: 'Active Users', value: '1,847' },
              { label: 'Live Markets', value: '28' },
              { label: 'Modules', value: '12' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is AgriOS */}
      <section className="border-t border-white/10" id="layers">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Built in 9 Layers</h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto">
              Every aspect of agricultural trade is covered — from cooperative organization at the foundation to AI-powered intelligence at the top.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {layers.map((layer) => (
              <div key={layer.num} className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-start gap-3 backdrop-blur-[2px]">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">L{layer.num}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{layer.name}</p>
                  <p className="text-[10px] text-white/40">{layer.modules}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module Showcase */}
      <section className="border-t border-white/10" id="modules">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">All Modules</h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto">
              Twelve integrated modules that work together as a single operating system for your agricultural business.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {agriModules.map((mod) => (
              <div key={mod.id} className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors backdrop-blur-[2px]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: `${mod.color}20` }}>
                  <ModuleIcon mod={mod} />
                </div>
                <p className="text-xs font-semibold text-white mb-0.5">{mod.name}</p>
                <p className="text-[10px] text-white/40 leading-snug">{mod.description}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                    mod.status === 'active' ? 'bg-green-500/10 text-green-400' :
                    mod.status === 'beta' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-white/10 text-white/40'
                  }`}>
                    {mod.status === 'active' ? 'Live' : mod.status === 'beta' ? 'Beta' : 'Soon'}
                  </span>
                  <span className="text-[9px] text-white/30 font-mono">L{mod.layer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Stakeholders */}
      <section className="border-t border-white/10" id="stakeholders">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Built for Every Stakeholder</h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto">
              Whether you grow, buy, sell, transport, or finance agricultural products — AgriOS has a workspace for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stakeholders.map((s) => (
              <div key={s.title} className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-white/50 mb-3 leading-relaxed">{s.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {s.modules.map((m) => (
                    <span key={m} className="text-[9px] bg-white/10 text-white/40 rounded px-1.5 py-0.5 font-medium">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to transform your agricultural trade?</h2>
          <p className="text-sm text-white/40 max-w-lg mx-auto mb-6">
            Join 1,800+ farmers, buyers, and traders already using AgriOS to connect, trade, and grow.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/signup')} className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-full border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="white" strokeWidth="1.5" />
                <path d="M7 12h10M12 7v10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-bold text-white">AgriOS</span>
              <span className="text-[10px] text-white/40">Aduanefie Trade Engine</span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-white/40">
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
