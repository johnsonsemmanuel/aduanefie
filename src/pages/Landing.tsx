import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Preloader } from '@/components/ui/Preloader'

export function Landing() {
  const [showPreloader, setShowPreloader] = useState(
    () => !sessionStorage.getItem('agrios_preloader_shown')
  )
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('agrios_preloader_shown', 'true')
    setShowPreloader(false)
  }

  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} words={['Welcome to AgriOS — Aduanefie Trade Engine']} holdDuration={2500} />
  }

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 200} 0 ${dimension.height} L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  return (
    <div className="min-h-dvh bg-black text-white flex flex-col relative overflow-hidden">
      {/* Animated curve background */}
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

      {/* Subtle agri illustration */}
      <div className="absolute inset-0 -z-20 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full max-w-4xl" fill="none">
          {/* Sun */}
          <circle cx="400" cy="100" r="60" stroke="white" strokeWidth="2" />
          <g stroke="white" strokeWidth="1.5">
            <line x1="400" y1="20" x2="400" y2="5" />
            <line x1="400" y1="180" x2="400" y2="195" />
            <line x1="320" y1="100" x2="305" y2="100" />
            <line x1="480" y1="100" x2="495" y2="100" />
            <line x1="343" y1="43" x2="333" y2="33" />
            <line x1="457" y1="157" x2="467" y2="167" />
            <line x1="457" y1="43" x2="467" y2="33" />
            <line x1="343" y1="157" x2="333" y2="167" />
          </g>
          {/* Crop rows */}
          {[120, 180, 240, 300, 360, 420, 480, 540].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="280" x2={x - 10} y2="380" stroke="white" strokeWidth="1.5" />
              <line x1={x} y1="280" x2={x + 10} y2="380" stroke="white" strokeWidth="1.5" />
              <ellipse cx={x} cy="270" rx="6" ry="10" stroke="white" strokeWidth="1" />
              <line x1={x - 10} y1="380" x2={x - 15} y2="400" stroke="white" strokeWidth="1" />
              <line x1={x + 10} y1="380" x2={x + 15} y2="400" stroke="white" strokeWidth="1" />
            </g>
          ))}
          {/* Ground line */}
          <line x1="50" y1="400" x2="750" y2="400" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
          {/* Distant hills */}
          <path d="M0 380 Q100 340 200 380 Q300 330 400 380 Q500 340 600 380 Q700 330 800 380" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Hero content */}
      <section className="flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 text-[10px] font-medium text-white/50 mb-6 backdrop-blur-[2px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Operating System for African Agriculture
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 text-balance">
            Welcome to <span className="text-white/90">AgriOS</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 font-medium mb-6">
            Aduanefie Trade Engine
          </p>
          <p className="text-sm sm:text-base text-white/40 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            A unified platform connecting farmers, buyers, suppliers, logistics providers, and financial institutions across Africa. Trade smarter with real-time market intelligence, digital trade finance, and end-to-end logistics.
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}
