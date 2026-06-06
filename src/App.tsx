import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { CommandCenter } from '@/pages/CommandCenter'
import { MarketIntel } from '@/pages/MarketIntel'
import { FinanceHub } from '@/pages/FinanceHub'
import { BusinessHub } from '@/pages/BusinessHub'
import { Marketplace } from '@/pages/Marketplace'
import { TradeDesk } from '@/pages/TradeDesk'
import { Logistics } from '@/pages/Logistics'
import { Exports } from '@/pages/Exports'
import { Profile } from '@/pages/Profile'
import { NotFound } from '@/pages/NotFound'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-3">
        <span className="text-lg font-bold text-primary">{title[0]}</span>
      </div>
      <h2 className="text-sm font-bold text-text-primary mb-1">{title}</h2>
      <p className="text-xs text-text-secondary max-w-xs">This module is being built. Check back soon.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell><CommandCenter /></Shell>} />
        <Route path="/marketplace" element={<Shell><Marketplace /></Shell>} />
        <Route path="/trade-desk" element={<Shell><TradeDesk /></Shell>} />
        <Route path="/logistics" element={<Shell><Logistics /></Shell>} />
        <Route path="/exports" element={<Shell><Exports /></Shell>} />
        <Route path="/profile" element={<Shell><Profile /></Shell>} />
        <Route path="/more" element={<Shell><Profile /></Shell>} />
        <Route path="/market-intel" element={<Shell><MarketIntel /></Shell>} />
        <Route path="/finance" element={<Shell><FinanceHub /></Shell>} />
        <Route path="/cooperative" element={<Shell><Placeholder title="Cooperative Hub" /></Shell>} />
        <Route path="/ai" element={<Shell><Placeholder title="AI Hub" /></Shell>} />
        <Route path="/procurement" element={<Shell><Placeholder title="Procurement Hub" /></Shell>} />
        <Route path="/business" element={<Shell><BusinessHub /></Shell>} />
        <Route path="/developer" element={<Shell><Placeholder title="Developer Hub" /></Shell>} />
        <Route path="/admin" element={<Shell><Placeholder title="Administration" /></Shell>} />
        <Route path="*" element={<Shell><NotFound /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
