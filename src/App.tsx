import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'
import { Toaster } from '@/components/ui/Toast'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Preloader } from '@/components/ui/Preloader'
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
import { Messages } from '@/pages/Messages'
import { Notifications } from '@/pages/Notifications'
import { Settings } from '@/pages/Settings'
import { AgriculturalCalendar } from '@/pages/AgriculturalCalendar'
import { Help } from '@/pages/Help'
import { ProcurementHub } from '@/pages/ProcurementHub'
import { CooperativeHub } from '@/pages/CooperativeHub'
import { AIHub } from '@/pages/AIHub'
import { DeveloperHub } from '@/pages/DeveloperHub'
import { Administration } from '@/pages/Administration'
import { SignInPage } from '@/pages/SignInPage'
import { SignUpPage } from '@/pages/SignUpPage'
import { NotFound } from '@/pages/NotFound'

function ProtectedShell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <Shell>{children}</Shell>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}

function EntryPoint() {
  const navigate = useNavigate()
  return <Preloader onComplete={() => navigate('/login', { replace: true })} words={['Welcome to Aduanefie']} holdDuration={2600} />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Toaster />
        <Routes>
          <Route path="/" element={<EntryPoint />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProtectedShell><CommandCenter /></ProtectedShell>} />
          <Route path="/marketplace" element={<ProtectedShell><Marketplace /></ProtectedShell>} />
          <Route path="/trade-desk" element={<ProtectedShell><TradeDesk /></ProtectedShell>} />
          <Route path="/logistics" element={<ProtectedShell><Logistics /></ProtectedShell>} />
          <Route path="/exports" element={<ProtectedShell><Exports /></ProtectedShell>} />
          <Route path="/profile" element={<ProtectedShell><Profile /></ProtectedShell>} />
          <Route path="/messages" element={<ProtectedShell><Messages /></ProtectedShell>} />
          <Route path="/notifications" element={<ProtectedShell><Notifications /></ProtectedShell>} />
          <Route path="/settings" element={<ProtectedShell><Settings /></ProtectedShell>} />
          <Route path="/calendar" element={<ProtectedShell><AgriculturalCalendar /></ProtectedShell>} />
          <Route path="/help" element={<ProtectedShell><Help /></ProtectedShell>} />
          <Route path="/market-intel" element={<ProtectedShell><MarketIntel /></ProtectedShell>} />
          <Route path="/finance" element={<ProtectedShell><FinanceHub /></ProtectedShell>} />
          <Route path="/cooperative" element={<ProtectedShell><CooperativeHub /></ProtectedShell>} />
          <Route path="/ai" element={<ProtectedShell><AIHub /></ProtectedShell>} />
          <Route path="/procurement" element={<ProtectedShell><ProcurementHub /></ProtectedShell>} />
          <Route path="/business" element={<ProtectedShell><BusinessHub /></ProtectedShell>} />
          <Route path="/developer" element={<ProtectedShell><DeveloperHub /></ProtectedShell>} />
          <Route path="/admin" element={<ProtectedShell><Administration /></ProtectedShell>} />
          <Route path="*" element={<ProtectedShell><NotFound /></ProtectedShell>} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
