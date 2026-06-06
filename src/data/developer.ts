import type { APIEndpoint, APIKey, DeveloperApp } from '@/types'

export const apiEndpoints: APIEndpoint[] = [
  { path: '/api/v1/commodities', method: 'GET', description: 'List all commodities with current prices', auth: true, rateLimit: '100/min' },
  { path: '/api/v1/commodities/:id', method: 'GET', description: 'Get commodity details and price history', auth: true, rateLimit: '100/min' },
  { path: '/api/v1/orders', method: 'GET', description: 'List user orders with filters', auth: true, rateLimit: '60/min' },
  { path: '/api/v1/orders', method: 'POST', description: 'Create a new trade order', auth: true, rateLimit: '30/min' },
  { path: '/api/v1/orders/:id', method: 'GET', description: 'Get order details', auth: true, rateLimit: '60/min' },
  { path: '/api/v1/market/prices', method: 'GET', description: 'Real-time market prices feed', auth: true, rateLimit: '200/min' },
  { path: '/api/v1/market/ticker', method: 'GET', description: 'Live market ticker stream (SSE)', auth: true, rateLimit: '1/conn' },
  { path: '/api/v1/wallet', method: 'GET', description: 'Get wallet balance and transactions', auth: true, rateLimit: '30/min' },
  { path: '/api/v1/wallet/transfer', method: 'POST', description: 'Initiate wallet transfer', auth: true, rateLimit: '10/min' },
  { path: '/api/v1/logistics/shipments', method: 'GET', description: 'List shipment tracking info', auth: true, rateLimit: '60/min' },
  { path: '/api/v1/webhooks', method: 'POST', description: 'Register a new webhook endpoint', auth: true, rateLimit: '5/min' },
  { path: '/api/v1/webhooks', method: 'GET', description: 'List registered webhooks', auth: true, rateLimit: '30/min' },
  { path: '/api/v1/health', method: 'GET', description: 'API health check', auth: false, rateLimit: 'unlimited' },
]

export const apiKeys: APIKey[] = [
  { id: 'ak1', name: 'Production - Trade Engine', key: 'ak_live_8f7a3b2c1d9e4f5a', permissions: ['read:commodities', 'write:orders', 'read:market'], created: '2026-01-15', lastUsed: '2026-06-06T10:30:00Z', status: 'active' },
  { id: 'ak2', name: 'Staging - Integration Tests', key: 'ak_test_3e6a1b8c2d7f9g0h', permissions: ['read:commodities', 'read:market', 'read:wallet'], created: '2026-03-01', lastUsed: '2026-06-05T15:00:00Z', status: 'active' },
  { id: 'ak3', name: 'Mobile App - Customer', key: 'ak_live_5h2j4k6l8m1n3p9', permissions: ['read:commodities', 'read:market', 'read:wallet', 'write:wallet'], created: '2026-04-10', lastUsed: '2026-06-06T09:45:00Z', status: 'active' },
  { id: 'ak4', name: 'Analytics Pipeline', key: 'ak_live_2r4t6y8u0i1o3p5', permissions: ['read:commodities', 'read:orders', 'read:market'], created: '2026-02-20', lastUsed: '2026-06-04T00:00:00Z', status: 'active' },
  { id: 'ak5', name: 'Old Production Key (Deprecated)', key: 'ak_live_9s7d5f3g1h2j4k6', permissions: ['read:commodities'], created: '2025-08-01', lastUsed: '2026-05-01T00:00:00Z', status: 'revoked' },
]

export const developerApps: DeveloperApp[] = [
  { id: 'app1', name: 'Trade Bot Pro', description: 'Automated commodity trading bot with custom strategy engine', apiKeys: 2, lastActive: '2026-06-06T10:00:00Z', status: 'active' },
  { id: 'app2', name: 'Farm Dashboard Mobile', description: 'React Native mobile app for farmers to track prices and orders', apiKeys: 1, lastActive: '2026-06-06T09:45:00Z', status: 'active' },
  { id: 'app3', name: 'AgriAnalytics Pipeline', description: 'Batch data processing pipeline for market analytics', apiKeys: 1, lastActive: '2026-06-04T00:00:00Z', status: 'active' },
  { id: 'app4', name: 'Legacy Integration Service', description: 'Deprecated integration service for backward compatibility', apiKeys: 1, lastActive: '2026-04-15T00:00:00Z', status: 'inactive' },
]
