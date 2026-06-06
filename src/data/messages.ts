import type { MessageThread, Message } from '@/types'

export const messageThreads: MessageThread[] = [
  {
    id: 'th1',
    subject: 'RE: Cocoa Beans Purchase Order #PO-2026-0042',
    participants: [
      { name: 'Ama Serwaa', role: 'buyer' },
      { name: 'Kwame Asante', role: 'farmer' },
    ],
    lastMessage: {
      id: 'm8',
      threadId: 'th1',
      sender: 'Ama Serwaa',
      senderRole: 'Buyer',
      content: 'Great, we can proceed with 50t at $2,850/t. Please send the revised delivery schedule.',
      timestamp: '2026-06-06T09:30:00Z',
    },
    unreadCount: 2,
    category: 'trade',
    relatedTo: { type: 'order', id: 'PO-2026-0042', label: 'Purchase Order #PO-2026-0042' },
  },
  {
    id: 'th2',
    subject: 'Delivery Terms — Tema Port consignment',
    participants: [
      { name: 'Yaw Mensah', role: 'logistics' },
      { name: 'Nana Osei', role: 'supplier' },
    ],
    lastMessage: {
      id: 'm6',
      threadId: 'th2',
      sender: 'Yaw Mensah',
      senderRole: 'Logistics Coordinator',
      content: 'The truck has been dispatched. ETA Tema Port is 14:00 on June 8. Tracking ID: TAF-2026-008.',
      timestamp: '2026-06-06T08:15:00Z',
    },
    unreadCount: 0,
    category: 'trade',
    relatedTo: { type: 'shipment', id: 'TAF-2026-008', label: 'Shipment #TAF-2026-008' },
  },
  {
    id: 'th3',
    subject: 'Cooperative Quarterly Meeting',
    participants: [
      { name: 'Esi Afriyie', role: 'cooperative' },
      { name: 'You', role: 'member' },
    ],
    lastMessage: {
      id: 'm4',
      threadId: 'th3',
      sender: 'Esi Afriyie',
      senderRole: 'Co-op Secretary',
      content: 'Reminder: Quarterly meeting this Friday at 10:00 AM. We will discuss the new collective purchasing initiative.',
      timestamp: '2026-06-05T16:00:00Z',
    },
    unreadCount: 1,
    category: 'cooperative',
  },
  {
    id: 'th4',
    subject: 'Support Request: API integration issue',
    participants: [
      { name: 'Support Team', role: 'support' },
      { name: 'You', role: 'developer' },
    ],
    lastMessage: {
      id: 'm10',
      threadId: 'th4',
      sender: 'Support Team',
      senderRole: 'Support',
      content: 'We have identified the issue — rate limiting was triggered. We have increased your tier limit. Please try again.',
      timestamp: '2026-06-05T14:20:00Z',
    },
    unreadCount: 0,
    category: 'support',
  },
  {
    id: 'th5',
    subject: 'Contract Renewal — Input Supply Agreement',
    participants: [
      { name: 'Grace Addo', role: 'supplier' },
      { name: 'You', role: 'buyer' },
    ],
    lastMessage: {
      id: 'm12',
      threadId: 'th5',
      sender: 'Grace Addo',
      senderRole: 'Supplier',
      content: 'We agree to the renewed terms. Please send the updated contract for e-signature.',
      timestamp: '2026-06-04T11:45:00Z',
    },
    unreadCount: 3,
    category: 'contract',
    relatedTo: { type: 'contract', id: 'CT-2026-001', label: 'Supply Agreement #CT-2026-001' },
  },
  {
    id: 'th6',
    subject: 'Maize Price Negotiation — 200t lot',
    participants: [
      { name: 'Kofi Mensah', role: 'trader' },
      { name: 'You', role: 'trader' },
    ],
    lastMessage: {
      id: 'm14',
      threadId: 'th6',
      sender: 'Kofi Mensah',
      senderRole: 'Trader',
      content: 'Market rate is $280/t today. I can do $275/t if you commit to 200t. Let me know.',
      timestamp: '2026-06-04T09:10:00Z',
    },
    unreadCount: 1,
    category: 'trade',
  },
  {
    id: 'th7',
    subject: 'Weather Advisory — Storm alert for Ashanti region',
    participants: [
      { name: 'System Alert', role: 'system' },
      { name: 'You', role: 'user' },
    ],
    lastMessage: {
      id: 'm16',
      threadId: 'th7',
      sender: 'System Alert',
      senderRole: 'System',
      content: 'Heavy storms forecasted for Ashanti region June 7-9. Secure stored produce and delay shipments.',
      timestamp: '2026-06-06T06:00:00Z',
    },
    unreadCount: 1,
    category: 'general',
  },
]

export const threadMessages: Record<string, Message[]> = {
  th1: [
    {
      id: 'm1', threadId: 'th1', sender: 'Kwame Asante', senderRole: 'Farmer',
      content: 'I have 50t of premium cocoa beans available. Grade A, fermented, sun-dried. Moisture content: 7.2%.',
      timestamp: '2026-06-05T14:00:00Z',
    },
    {
      id: 'm2', threadId: 'th1', sender: 'Ama Serwaa', senderRole: 'Buyer',
      content: 'Interested. What is your best price per tonne delivered to Tema Port?',
      timestamp: '2026-06-05T14:30:00Z',
    },
    {
      id: 'm3', threadId: 'th1', sender: 'Kwame Asante', senderRole: 'Farmer',
      content: '$2,900/t including delivery. I can do $2,850/t if you take the full 50t.',
      timestamp: '2026-06-05T15:00:00Z',
    },
    {
      id: 'm7', threadId: 'th1', sender: 'Kwame Asante', senderRole: 'Farmer',
      content: 'I can also provide quality certificates from Cocobod. Let me know if you need them.',
      timestamp: '2026-06-06T08:45:00Z',
    },
    {
      id: 'm8', threadId: 'th1', sender: 'Ama Serwaa', senderRole: 'Buyer',
      content: 'Great, we can proceed with 50t at $2,850/t. Please send the revised delivery schedule.',
      timestamp: '2026-06-06T09:30:00Z',
    },
  ],
  th2: [
    {
      id: 'm5', threadId: 'th2', sender: 'Nana Osei', senderRole: 'Supplier',
      content: 'Our consignment of 20t cashew nuts is ready for pickup from Kumasi warehouse.',
      timestamp: '2026-06-05T10:00:00Z',
    },
    {
      id: 'm6', threadId: 'th2', sender: 'Yaw Mensah', senderRole: 'Logistics Coordinator',
      content: 'The truck has been dispatched. ETA Tema Port is 14:00 on June 8. Tracking ID: TAF-2026-008.',
      timestamp: '2026-06-06T08:15:00Z',
    },
  ],
  th3: [
    {
      id: 'm4', threadId: 'th3', sender: 'Esi Afriyie', senderRole: 'Co-op Secretary',
      content: 'Reminder: Quarterly meeting this Friday at 10:00 AM. We will discuss the new collective purchasing initiative.',
      timestamp: '2026-06-05T16:00:00Z',
    },
  ],
  th4: [
    {
      id: 'm9', threadId: 'th4', sender: 'You', senderRole: 'Developer',
      content: 'Getting 429 errors on the /v2/trades endpoint. Our API key is ak_aduanefie_dev_003.',
      timestamp: '2026-06-05T12:00:00Z',
    },
    {
      id: 'm10', threadId: 'th4', sender: 'Support Team', senderRole: 'Support',
      content: 'We have identified the issue — rate limiting was triggered. We have increased your tier limit. Please try again.',
      timestamp: '2026-06-05T14:20:00Z',
    },
  ],
  th5: [
    {
      id: 'm11', threadId: 'th5', sender: 'You', senderRole: 'Buyer',
      content: 'The current input supply agreement expires next month. I have drafted renewal terms with a 5% volume discount.',
      timestamp: '2026-06-04T10:00:00Z',
    },
    {
      id: 'm12', threadId: 'th5', sender: 'Grace Addo', senderRole: 'Supplier',
      content: 'We agree to the renewed terms. Please send the updated contract for e-signature.',
      timestamp: '2026-06-04T11:45:00Z',
    },
  ],
  th6: [
    {
      id: 'm13', threadId: 'th6', sender: 'You', senderRole: 'Trader',
      content: 'Looking for 200t of maize for delivery to Kumasi. What is your best offer?',
      timestamp: '2026-06-04T08:00:00Z',
    },
    {
      id: 'm14', threadId: 'th6', sender: 'Kofi Mensah', senderRole: 'Trader',
      content: 'Market rate is $280/t today. I can do $275/t if you commit to 200t. Let me know.',
      timestamp: '2026-06-04T09:10:00Z',
    },
  ],
  th7: [
    {
      id: 'm15', threadId: 'th7', sender: 'System Alert', senderRole: 'System',
      content: 'Weather monitoring systems have detected a developing storm front approaching the Ashanti region.',
      timestamp: '2026-06-06T05:30:00Z',
    },
    {
      id: 'm16', threadId: 'th7', sender: 'System Alert', senderRole: 'System',
      content: 'Heavy storms forecasted for Ashanti region June 7-9. Secure stored produce and delay shipments.',
      timestamp: '2026-06-06T06:00:00Z',
    },
  ],
}
