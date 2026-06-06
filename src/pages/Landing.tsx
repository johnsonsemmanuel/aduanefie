import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Preloader } from '@/components/ui/Preloader'

export function Landing() {
  const [showPreloader, setShowPreloader] = useState(
    () => !sessionStorage.getItem('agrios_preloader_shown')
  )
  const navigate = useNavigate()

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('agrios_preloader_shown', 'true')
    setShowPreloader(false)
  }

  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} words={['Welcome to AgriOS — Aduanefie Trade Engine']} holdDuration={2500} />
  }

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-4 py-20 sm:py-28 text-center">
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
