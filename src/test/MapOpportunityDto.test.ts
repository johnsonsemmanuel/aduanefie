import { describe, it, expect } from 'vitest'
import type { OpportunityDto } from '@/lib/api'
import type { TradeOpportunity, Trader } from '@/types'

function mapOpportunityDto(dto: OpportunityDto): TradeOpportunity {
  return {
    id: dto.id,
    type: dto.type,
    commodity: {
      id: dto.commodity.id,
      name: dto.commodity.name,
      category: dto.commodity.category,
      unit: dto.commodity.unit,
      price: Number(dto.commodity.price ?? 0),
      priceChange: Number(dto.commodity.priceChange ?? 0),
      priceChangePercent: Number(dto.commodity.priceChangePercent ?? 0),
      volume: dto.commodity.volume ?? 0,
      stock: dto.commodity.stock ?? 0,
      origin: dto.commodity.origin ?? '',
      grade: (dto.commodity.grade ?? 'Standard') as TradeOpportunity['quality'],
      image: dto.commodity.image ?? undefined,
    },
    quantity: Number(dto.quantity),
    unit: dto.unit,
    price: Number(dto.price),
    totalValue: Number(dto.totalValue),
    location: dto.location,
    deliveryDate: dto.deliveryDate ?? '',
    status: dto.status as TradeOpportunity['status'],
    createdAt: dto.createdAt,
    trader: {
      id: dto.user.id,
      name: dto.user.name,
      avatar: dto.user.avatar,
      location: dto.user.location ?? '',
      rating: dto.user.rating ?? 0,
      verified: dto.user.verified ?? false,
      type: (dto.user.type ?? 'farmer') as Trader['type'],
    },
    quality: (dto.quality ?? 'Standard') as TradeOpportunity['quality'],
    description: dto.description ?? '',
  }
}

describe('mapOpportunityDto', () => {
  const mockDto: OpportunityDto = {
    id: '123',
    type: 'sell',
    quantity: '500',
    unit: 'kg',
    price: '12.50',
    totalValue: '6250',
    location: 'Kumasi',
    deliveryDate: '2026-07-01',
    status: 'open',
    quality: 'Premium',
    description: 'High quality beans',
    createdAt: '2026-06-01T00:00:00Z',
    userId: 'u1',
    commodityId: 'c1',
    user: { id: 'u1', name: 'Kofi Farmer' },
    commodity: {
      id: 'c1',
      name: 'Cocoa Beans',
      category: 'Cocoa',
      unit: 'kg',
      price: '12.50',
      priceChange: '0.30',
      priceChangePercent: '2.46',
      volume: 15000,
      stock: 50000,
      origin: 'Ashanti',
      grade: 'Premium',
      image: null,
    },
  }

  it('maps type, quantity, price correctly', () => {
    const result = mapOpportunityDto(mockDto)
    expect(result.type).toBe('sell')
    expect(result.quantity).toBe(500)
    expect(result.price).toBe(12.50)
    expect(result.totalValue).toBe(6250)
  })

  it('builds nested commodity object', () => {
    const result = mapOpportunityDto(mockDto)
    expect(result.commodity.name).toBe('Cocoa Beans')
    expect(result.commodity.price).toBe(12.50)
    expect(result.commodity.priceChangePercent).toBe(2.46)
    expect(result.commodity.stock).toBe(50000)
    expect(result.commodity.origin).toBe('Ashanti')
  })

  it('builds nested trader object', () => {
    const result = mapOpportunityDto(mockDto)
    expect(result.trader.name).toBe('Kofi Farmer')
    expect(result.trader.id).toBe('u1')
  })

  it('handles missing optional fields', () => {
    const minimal: OpportunityDto = {
      id: '2',
      type: 'buy',
      quantity: '10',
      unit: 'ton',
      price: '100',
      totalValue: '1000',
      location: 'Accra',
      status: 'open',
      createdAt: '2026-06-01T00:00:00Z',
      userId: 'u2',
      commodityId: 'c2',
      user: { id: 'u2', name: 'Ama Buyer' },
      commodity: { id: 'c2', name: 'Maize', category: 'Grains', unit: 'ton' },
    }
    const result = mapOpportunityDto(minimal)
    expect(result.commodity.price).toBe(0)
    expect(result.commodity.origin).toBe('')
    expect(result.commodity.grade).toBe('Standard')
    expect(result.trader.type).toBe('farmer')
    expect(result.description).toBe('')
    expect(result.deliveryDate).toBe('')
  })
})
