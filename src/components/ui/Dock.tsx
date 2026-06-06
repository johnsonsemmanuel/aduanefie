import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface DockApp {
  id: string
  name: string
  icon: React.ReactNode
  to: string
}

interface DockProps {
  items: DockApp[]
  openApps?: string[]
  className?: string
}

export function Dock({ items, openApps = [], className = '' }: DockProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mouseX, setMouseX] = useState<number | null>(null)
  const [currentScales, setCurrentScales] = useState<number[]>(items.map(() => 1))
  const [currentPositions, setCurrentPositions] = useState<number[]>([])
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const animFrameRef = useRef<number | undefined>(undefined)
  const lastMouseTime = useRef<number>(0)

  const getConfig = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024
    const small = Math.min(w, typeof window !== 'undefined' ? window.innerHeight : 768)
    if (small < 480) return { size: 36, maxScale: 1.4, effectW: small * 0.4 }
    if (small < 768) return { size: 44, maxScale: 1.5, effectW: small * 0.35 }
    if (small < 1024) return { size: 48, maxScale: 1.6, effectW: small * 0.3 }
    return { size: 52, maxScale: 1.8, effectW: 280 }
  }, [])

  const [cfg, setCfg] = useState(getConfig)
  const { size: baseSize, maxScale, effectW } = cfg
  const spacing = Math.max(3, baseSize * 0.08)

  useEffect(() => {
    const onResize = () => setCfg(getConfig())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [getConfig])

  const calcTarget = useCallback((mx: number | null) => {
    if (mx === null) return items.map(() => 1)
    return items.map((_, i) => {
      const center = i * (baseSize + spacing) + baseSize / 2
      const minX = mx - effectW / 2
      const maxX = mx + effectW / 2
      if (center < minX || center > maxX) return 1
      const theta = ((center - minX) / effectW) * 2 * Math.PI
      const st = (1 - Math.cos(Math.min(Math.max(theta, 0), 2 * Math.PI))) / 2
      return 1 + st * (maxScale - 1)
    })
  }, [items, baseSize, spacing, effectW, maxScale])

  const calcPos = useCallback((scales: number[]) => {
    let x = 0
    return scales.map(s => {
      const w = baseSize * s
      const cx = x + w / 2
      x += w + spacing
      return cx
    })
  }, [baseSize, spacing])

  useEffect(() => {
    const s = items.map(() => 1)
    setCurrentScales(s)
    setCurrentPositions(calcPos(s))
  }, [items, calcPos])

  const animate = useCallback(() => {
    const target = calcTarget(mouseX)
    const targetPos = calcPos(target)
    const lerp = mouseX !== null ? 0.2 : 0.12

    setCurrentScales(prev => prev.map((c, i) => c + (target[i] - c) * lerp))

    const needScale = currentScales.some((c, i) => Math.abs(c - target[i]) > 0.002)
    const needPos = currentPositions.some((p, i) => Math.abs(p - targetPos[i]) > 0.1)

    if (needScale || needPos || mouseX !== null) {
      animFrameRef.current = requestAnimationFrame(animate)
    }
  }, [mouseX, calcTarget, calcPos, currentScales, currentPositions])

  useEffect(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    animFrameRef.current = requestAnimationFrame(animate)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [animate])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now()
    if (now - lastMouseTime.current < 16) return
    lastMouseTime.current = now
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect()
      setMouseX(e.clientX - rect.left - Math.max(6, baseSize * 0.1))
    }
  }, [baseSize])

  const padding = Math.max(6, baseSize * 0.1)
  const contentW = currentPositions.length > 0
    ? Math.max(...currentPositions.map((p, i) => p + (baseSize * currentScales[i]) / 2))
    : items.length * (baseSize + spacing) - spacing

  return (
    <div
      ref={dockRef}
      className={cn('dock-container', className)}
      style={{
        width: contentW + padding * 2,
        background: 'rgba(28, 28, 30, 0.82)',
        borderRadius: Math.max(10, baseSize * 0.35),
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: `
          0 ${Math.max(3, baseSize * 0.08)}px ${Math.max(12, baseSize * 0.3)}px rgba(0,0,0,0.5),
          0 ${Math.max(2, baseSize * 0.04)}px ${Math.max(6, baseSize * 0.15)}px rgba(0,0,0,0.3),
          inset 0 1px 0 rgba(255,255,255,0.12),
          inset 0 -1px 0 rgba(0,0,0,0.2)
        `,
        padding,
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouseX(null)}
    >
      <div style={{ height: baseSize, width: '100%', position: 'relative' }}>
        {items.map((app, i) => {
          const scale = currentScales[i]
          const pos = currentPositions[i] || 0
          const sz = baseSize * scale
          const isActive = location.pathname === app.to || location.pathname.startsWith(app.to + '/')

          return (
            <div
              key={app.id}
              ref={(el) => { iconRefs.current[i] = el }}
              className="absolute cursor-pointer flex flex-col items-center justify-end"
              title={app.name}
              onClick={() => navigate(app.to)}
              style={{
                left: pos - sz / 2,
                bottom: 0,
                width: sz,
                height: sz,
                transformOrigin: 'bottom center',
                zIndex: Math.round(scale * 10),
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl transition-colors"
                style={{
                  width: sz,
                  height: sz,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseSize * 0.04) : 1}px ${scale > 1.2 ? Math.max(3, baseSize * 0.08) : 1}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`,
                }}
              >
                {React.cloneElement(app.icon as React.ReactElement, {
                  className: 'text-white',
                  size: Math.max(14, sz * 0.5),
                })}
              </div>

              {openApps.includes(app.id) && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: Math.max(-2, -baseSize * 0.04),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: Math.max(3, baseSize * 0.05),
                    height: Math.max(3, baseSize * 0.05),
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
