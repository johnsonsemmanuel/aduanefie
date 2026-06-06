import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import { Dashboard } from '@/pages/Dashboard'
import { Marketplace } from '@/pages/Marketplace'
import { TradeDesk } from '@/pages/TradeDesk'
import { Logistics } from '@/pages/Logistics'
import { Exports } from '@/pages/Exports'
import { Profile } from '@/pages/Profile'
import { NotFound } from '@/pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell title="Dashboard"><Dashboard /></Shell>} />
        <Route path="/marketplace" element={<Shell title="Marketplace"><Marketplace /></Shell>} />
        <Route path="/trade-desk" element={<Shell title="Trade Desk"><TradeDesk /></Shell>} />
        <Route path="/logistics" element={<Shell title="Logistics"><Logistics /></Shell>} />
        <Route path="/exports" element={<Shell title="Exports"><Exports /></Shell>} />
        <Route path="/profile" element={<Shell title="Profile"><Profile /></Shell>} />
        <Route path="/more" element={<Shell title="More"><Profile /></Shell>} />
        <Route path="*" element={<Shell title="Not Found"><NotFound /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
