import type { AppUserRole } from '@/types'

export type OSModuleId = 'dashboard' | 'trade-engine' | 'market-intel' | 'business' | 'procurement' | 'logistics' | 'finance' | 'export' | 'cooperative' | 'ai' | 'developer' | 'admin' | 'profile' | 'messaging' | 'calendar'

const roleAccess: Record<AppUserRole, OSModuleId[]> = {
  admin: ['dashboard', 'trade-engine', 'market-intel', 'business', 'procurement', 'logistics', 'finance', 'export', 'cooperative', 'ai', 'developer', 'admin', 'profile', 'messaging', 'calendar'],
  supervisor: ['dashboard', 'trade-engine', 'market-intel', 'business', 'procurement', 'logistics', 'finance', 'export', 'cooperative', 'ai', 'developer', 'admin', 'profile', 'messaging', 'calendar'],
  trader: ['dashboard', 'trade-engine', 'market-intel', 'finance', 'logistics', 'profile', 'messaging'],
  farmer: ['dashboard', 'trade-engine', 'market-intel', 'cooperative', 'finance', 'ai', 'profile', 'messaging', 'calendar'],
  buyer: ['dashboard', 'trade-engine', 'procurement', 'logistics', 'finance', 'market-intel', 'profile', 'messaging', 'calendar'],
  supplier: ['dashboard', 'procurement', 'business', 'finance', 'profile', 'messaging', 'calendar'],
  logistics: ['dashboard', 'logistics', 'trade-engine', 'business', 'profile', 'messaging', 'calendar'],
  viewer: ['dashboard', 'market-intel', 'profile'],
}

export function getAllowedModules(role: AppUserRole): Set<OSModuleId> {
  return new Set(roleAccess[role] || roleAccess.viewer)
}

export function hasAccess(role: AppUserRole, moduleId: OSModuleId): boolean {
  return getAllowedModules(role).has(moduleId)
}
