import type { PriceHistory } from '@/types'

interface PriceChartProps {
  data: PriceHistory[]
  width?: number
  height?: number
  color?: string
  showAxis?: boolean
}

export function PriceChart({ data, width = 400, height = 160, color = '#2E7D32', showAxis = true }: PriceChartProps) {
  if (data.length < 2) return null

  const prices = data.map(d => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const padding = { top: 8, bottom: showAxis ? 20 : 8, left: showAxis ? 36 : 4, right: 4 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW
    const y = padding.top + chartH - ((d.price - min) / range) * chartH
    return `${x},${y}`
  })

  const areaPoints = [`${padding.left},${padding.top + chartH}`, ...points, `${padding.left + chartW},${padding.top + chartH}`]

  const yLabels = [min, min + range / 2, max].map(v => Math.round(v))

  const isUp = data[data.length - 1].price >= data[0].price

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" preserveAspectRatio="xMidYMid meet">
      {showAxis && yLabels.map((v, i) => (
        <text key={i} x={padding.left - 4} y={padding.top + (i / (yLabels.length - 1)) * chartH + 3} textAnchor="end" className="fill-text-secondary" fontSize="9" fontFamily="monospace">
          ${v.toLocaleString()}
        </text>
      ))}
      {showAxis && (
        <>
          {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => (
            <text key={i} x={padding.left + (i / (Math.ceil(data.length / 5))) * (data.length > 5 ? chartW / 4 : chartW)} y={height - 2} textAnchor="middle" className="fill-text-secondary" fontSize="8" fontFamily="monospace">
              {d.date.slice(5)}
            </text>
          ))}
        </>
      )}
      <defs>
        <linearGradient id={`grad-${isUp ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={`M${areaPoints.join(' L')} Z`} fill={`url(#grad-${isUp ? 'up' : 'down'})`} />
      <path d={`M${points.join(' L')}`} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="3" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

export function MiniChart({ data, width = 80, height = 32, color }: { data: PriceHistory[]; width?: number; height?: number; color?: string }) {
  if (data.length < 2) return null

  const prices = data.map(d => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const isUp = data[data.length - 1].price >= data[0].price
  const c = color || (isUp ? '#2E7D32' : '#D32F2F')

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((d.price - min) / range) * (height - 4) - 2
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={`M${points.join(' L')}`} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
