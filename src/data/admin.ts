import type { AdminUser, SystemSetting } from '@/types'

export const adminUsers: AdminUser[] = [
  { id: 'u1', name: 'Emmanuel Johnson', email: 'emmanuel@aduanefie.com', role: 'admin', status: 'active', lastActive: '2026-06-06T10:30:00Z', modules: ['trade-engine', 'market-intel', 'finance', 'business', 'logistics', 'exports', 'procurement', 'cooperative', 'developer', 'admin'] },
  { id: 'u2', name: 'Kwame Asante', email: 'kwame@asantefarms.com', role: 'trader', status: 'active', lastActive: '2026-06-06T09:15:00Z', modules: ['trade-engine', 'market-intel', 'logistics'] },
  { id: 'u3', name: 'Ama Serwaa', email: 'ama@serwaaagro.com', role: 'trader', status: 'active', lastActive: '2026-06-05T16:00:00Z', modules: ['trade-engine', 'market-intel', 'exports'] },
  { id: 'u4', name: 'Yaw Mensah', email: 'yaw@mensahlogistics.com', role: 'supervisor', status: 'active', lastActive: '2026-06-06T08:45:00Z', modules: ['logistics', 'trade-engine'] },
  { id: 'u5', name: 'Esi Afriyie', email: 'esi@afriyieexports.com', role: 'trader', status: 'active', lastActive: '2026-06-05T14:30:00Z', modules: ['exports', 'trade-engine', 'market-intel'] },
  { id: 'u6', name: 'Nana Osei', email: 'nana@oseicommodities.com', role: 'viewer', status: 'active', lastActive: '2026-06-04T11:00:00Z', modules: ['market-intel'] },
  { id: 'u7', name: 'Kofi Boateng', email: 'kofi@boatengcoop.com', role: 'trader', status: 'suspended', lastActive: '2026-05-28T10:00:00Z', modules: ['trade-engine', 'cooperative'] },
  { id: 'u8', name: 'Grace Asare', email: 'grace@aduanefie.com', role: 'supervisor', status: 'pending', lastActive: '2026-06-01T00:00:00Z', modules: ['finance', 'business'] },
]

export const systemSettings: SystemSetting[] = [
  { id: 's1', key: 'platform.name', value: 'Aduanefie AgriOS', category: 'general', description: 'Platform display name' },
  { id: 's2', key: 'platform.timezone', value: 'Africa/Accra (UTC+0)', category: 'general', description: 'Default system timezone' },
  { id: 's3', key: 'trading.min_order_value', value: '$500', category: 'trading', description: 'Minimum order value' },
  { id: 's4', key: 'trading.max_order_quantity', value: '500 tonnes', category: 'trading', description: 'Maximum order quantity per transaction' },
  { id: 's5', key: 'trading.default_currency', value: 'USD', category: 'trading', description: 'Default trading currency' },
  { id: 's6', key: 'security.session_timeout', value: '30 minutes', category: 'security', description: 'User session timeout duration' },
  { id: 's7', key: 'security.mfa_enabled', value: 'True', category: 'security', description: 'Multi-factor authentication for admin users' },
  { id: 's8', key: 'security.max_login_attempts', value: '5', category: 'security', description: 'Maximum failed login attempts before lockout' },
  { id: 's9', key: 'notifications.email_enabled', value: 'True', category: 'notifications', description: 'Enable email notifications' },
  { id: 's10', key: 'notifications.sms_enabled', value: 'False', category: 'notifications', description: 'Enable SMS notifications' },
  { id: 's11', key: 'notifications.trade_alerts', value: 'Instant', category: 'notifications', description: 'Trade alert delivery speed' },
  { id: 's12', key: 'integrations.webhook_retry', value: '3 attempts', category: 'integrations', description: 'Webhook delivery retry count' },
  { id: 's13', key: 'integrations.api_rate_limit', value: '200 req/min', category: 'integrations', description: 'Default API rate limit per key' },
]
