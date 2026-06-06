import type { AppUserRole } from '@/types'

export type OSModuleId = 'dashboard' | 'trade-engine' | 'market-intel' | 'business' | 'procurement' | 'logistics' | 'finance' | 'export' | 'cooperative' | 'ai' | 'developer' | 'admin' | 'profile'

const roleAccess: Record<AppUserRole, OSModuleId[]> = {
  admin: ['dashboard', 'trade-engine', 'market-intel', 'business', 'procurement', 'logistics', 'finance', 'export', 'cooperative', 'ai', 'developer', 'admin', 'profile'],
  supervisor: ['dashboard', 'trade-engine', 'market-intel', 'business', 'procurement', 'logistics', 'finance', 'export', 'cooperative', 'ai', 'developer', 'admin', 'profile'],
  trader: ['dashboard', 'trade-engine', 'market-intel', 'finance', 'logistics', 'profile'],
  farmer: ['dashboard', 'trade-engine', 'market-intel', 'cooperative', 'finance', 'ai', 'profile'],
  buyer: ['dashboard', 'trade-engine', 'procurement', 'logistics', 'finance', 'market-intel', 'profile'],
  supplier: ['dashboard', 'procurement', 'business', 'finance', 'profile'],
  logistics: ['dashboard', 'logistics', 'trade-engine', 'business', 'profile'],
  viewer: ['dashboard', 'market-intel', 'profile'],
}

export function getAllowedModules(role: AppUserRole): Set<OSModuleId> {
  return new Set(roleAccess[role] || roleAccess.viewer)
}

export function hasAccess(role: AppUserRole, moduleId: OSModuleId): boolean {
  return getAllowedModules(role).has(moduleId)
}
