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
        <Route path="/" element={<Shell><Dashboard /></Shell>} />
        <Route path="/marketplace" element={<Shell><Marketplace /></Shell>} />
        <Route path="/trade-desk" element={<Shell><TradeDesk /></Shell>} />
        <Route path="/logistics" element={<Shell><Logistics /></Shell>} />
        <Route path="/exports" element={<Shell><Exports /></Shell>} />
        <Route path="/profile" element={<Shell><Profile /></Shell>} />
        <Route path="/more" element={<Shell><Profile /></Shell>} />
        <Route path="*" element={<Shell><NotFound /></Shell>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
