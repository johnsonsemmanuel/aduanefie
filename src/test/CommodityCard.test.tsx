import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CommodityCard } from '@/components/trade/CommodityCard'
import type { Commodity } from '@/types'

const mock: Commodity = {
  id: '1',
  name: 'Premium Cocoa Beans',
  category: 'Cocoa',
  origin: 'Ashanti Region',
  grade: 'Premium',
  price: 12.50,
  unit: 'kg',
  priceChange: 0.30,
  priceChangePercent: 2.46,
  volume: 15000,
  stock: 50000,
}

describe('CommodityCard', () => {
  it('renders commodity name and price', () => {
    render(<CommodityCard commodity={mock} />)
    expect(screen.getByText('Premium Cocoa Beans')).toBeInTheDocument()
    expect(screen.getByText('$12.5')).toBeInTheDocument()
  })

  it('renders origin and grade', () => {
    render(<CommodityCard commodity={mock} />)
    expect(screen.getByText('Ashanti Region')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('renders stock and volume', () => {
    render(<CommodityCard commodity={mock} />)
    expect(screen.getByText('50,000 kg')).toBeInTheDocument()
    expect(screen.getByText('15,000 kg')).toBeInTheDocument()
  })

  it('renders compact variant without stock/volume', () => {
    render(<CommodityCard commodity={mock} compact />)
    expect(screen.getByText('Premium Cocoa Beans')).toBeInTheDocument()
    expect(screen.queryByText('50,000 kg')).not.toBeInTheDocument()
  })
})
