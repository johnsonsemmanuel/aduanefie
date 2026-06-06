import type { Notification } from '@/types'

export const notifications: Notification[] = [
  {
    id: 'n1', type: 'trade', title: 'New Trade Opportunity',
    message: 'A new buyer is looking for 50t of premium cocoa beans at $2,900/t in Tema.',
    timestamp: '2026-06-06T10:32:00Z', read: false, actionable: true, actionLabel: 'View Opportunity', actionPath: '/trade-desk', relatedId: 'OPP-2026-012',
  },
  {
    id: 'n2', type: 'payment', title: 'Payment Received',
    message: '$145,000 payment confirmed for Purchase Order #PO-2026-0042 from Serwaa Agro.',
    timestamp: '2026-06-06T10:15:00Z', read: false, actionable: true, actionLabel: 'View Receipt', actionPath: '/finance',
  },
  {
    id: 'n3', type: 'logistics', title: 'Shipment Dispatched',
    message: 'Truck TAF-2026-008 carrying 20t cashew nuts has been dispatched to Tema Port.',
    timestamp: '2026-06-06T09:45:00Z', read: false, actionable: true, actionLabel: 'Track Shipment', actionPath: '/logistics',
  },
  {
    id: 'n4', type: 'system', title: 'System Maintenance',
    message: 'Scheduled maintenance tomorrow 02:00-04:00 UTC. The platform may be briefly unavailable.',
    timestamp: '2026-06-06T09:00:00Z', read: false,
  },
  {
    id: 'n5', type: 'market', title: 'Price Alert: Maize',
    message: 'Maize prices dropped 5.1% to $280/t. Consider buying opportunity.',
    timestamp: '2026-06-06T08:30:00Z', read: true, actionable: true, actionLabel: 'View Market Intel', actionPath: '/market-intel',
  },
  {
    id: 'n6', type: 'trade', title: 'Buyer Request Responses',
    message: 'Buyer request #BR-004 received 3 new supplier responses. Review and shortlist.',
    timestamp: '2026-06-06T08:00:00Z', read: true, actionable: true, actionLabel: 'Review Responses', actionPath: '/trade-desk',
  },
  {
    id: 'n7', type: 'approval', title: 'Contract Approval Needed',
    message: 'Supply agreement CT-2026-001 renewal is pending your signature.',
    timestamp: '2026-06-06T07:30:00Z', read: false, actionable: true, actionLabel: 'Review Contract', actionPath: '/procurement',
  },
  {
    id: 'n8', type: 'market', title: 'Weather Advisory',
    message: 'Heavy rainfall expected in Ashanti region. Take precautions for stored produce.',
    timestamp: '2026-06-06T06:00:00Z', read: false, actionLabel: 'View Intel', actionPath: '/market-intel',
  },
  {
    id: 'n9', type: 'social', title: 'New Co-op Member Request',
    message: 'Joseph Asare has requested to join Kumasi Farmers Cooperative.',
    timestamp: '2026-06-05T16:20:00Z', read: true, actionable: true, actionLabel: 'Review', actionPath: '/cooperative',
  },
  {
    id: 'n10', type: 'system', title: 'API Key Rotation Reminder',
    message: 'Your API key ak_aduanefie_dev_003 expires in 7 days. Rotate before June 13.',
    timestamp: '2026-06-05T14:00:00Z', read: true, actionable: true, actionLabel: 'Manage Keys', actionPath: '/developer',
  },
  {
    id: 'n11', type: 'trade', title: 'Trade Completed',
    message: 'Order ORD-2026-001 — 50t Soya Beans — has been marked as delivered and completed.',
    timestamp: '2026-06-05T12:00:00Z', read: true,
  },
  {
    id: 'n12', type: 'logistics', title: 'Warehouse Capacity Warning',
    message: 'Kumasi Central Warehouse (W-001) is at 85% capacity. Consider redistributing inventory.',
    timestamp: '2026-06-05T10:30:00Z', read: true, actionLabel: 'View Warehouse', actionPath: '/logistics',
  },
]
