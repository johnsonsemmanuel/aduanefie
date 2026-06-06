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
import { ProcurementHub } from '@/pages/ProcurementHub'
import { CooperativeHub } from '@/pages/CooperativeHub'
import { AIHub } from '@/pages/AIHub'
import { DeveloperHub } from '@/pages/DeveloperHub'
import { Administration } from '@/pages/Administration'
import { NotFound } from '@/pages/NotFound'

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
        <Route path="/cooperative" element={<Shell><CooperativeHub /></Shell>} />
        <Route path="/ai" element={<Shell><AIHub /></Shell>} />
        <Route path="/procurement" element={<Shell><ProcurementHub /></Shell>} />
        <Route path="/business" element={<Shell><BusinessHub /></Shell>} />
        <Route path="/developer" element={<Shell><DeveloperHub /></Shell>} />
        <Route path="/admin" element={<Shell><Administration /></Shell>} />
        <Route path="*" element={<Shell><NotFound /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
