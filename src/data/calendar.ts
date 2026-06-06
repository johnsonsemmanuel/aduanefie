import type { AgCalendarEvent } from '@/types'

export const calendarEvents: AgCalendarEvent[] = [
  {
    id: 'ce1', title: 'Maize Planting Window Opens', description: 'Optimal planting period for maize in the southern regions. Expected rainfall supports early germination.',
    date: '2026-03-15', endDate: '2026-04-30', category: 'planting', commodity: 'Maize', region: 'Southern', allDay: true,
  },
  {
    id: 'ce2', title: 'Cocoa Main Crop Harvest', description: 'Main cocoa harvest season begins. Peak pod ripening expected mid-October.',
    date: '2026-09-01', endDate: '2026-12-15', category: 'harvest', commodity: 'Cocoa', region: 'Western', allDay: true,
  },
  {
    id: 'ce3', title: 'Soya Bean Planting', description: 'Optimal soya bean planting window. Requires well-drained soil and moderate rainfall.',
    date: '2026-05-01', endDate: '2026-06-15', category: 'planting', commodity: 'Soya Beans', region: 'Northern', allDay: true,
  },
  {
    id: 'ce4', title: 'Coffee Harvest Season', description: 'Arabica coffee cherry harvesting period. Selective picking of ripe cherries.',
    date: '2026-10-01', endDate: '2026-12-31', category: 'harvest', commodity: 'Coffee', region: 'Eastern', allDay: true,
  },
  {
    id: 'ce5', title: 'Scheduled Delivery: Cocoa to Tema', description: 'Delivery of 50t premium cocoa beans to Tema Port for export.',
    date: '2026-06-15', category: 'delivery', commodity: 'Cocoa', region: 'Tema',
  },
  {
    id: 'ce6', title: 'Equipment Maintenance Day', description: 'Scheduled maintenance for storage silos and drying equipment at Kumasi facility.',
    date: '2026-06-20', category: 'maintenance', region: 'Kumasi', allDay: true,
  },
  {
    id: 'ce7', title: 'Co-op Monthly Meeting', description: 'Monthly cooperative meeting to discuss collective purchasing, shared resources, and market updates.',
    date: '2026-06-12', category: 'meeting', region: 'All Regions',
  },
  {
    id: 'ce8', title: 'Input Supply Delivery', description: 'Fertilizers and pesticides delivery to member farmers ahead of planting season.',
    date: '2026-06-18', endDate: '2026-06-25', category: 'delivery', commodity: 'Inputs', region: 'Ashanti',
  },
  {
    id: 'ce9', title: 'Farmers Market Day', description: 'Weekly open-air market for direct farm-to-consumer sales at the Agora center.',
    date: '2026-06-13', category: 'market', region: 'Accra',
  },
  {
    id: 'ce10', title: 'Forecast: Heavy Rains Ashanti', description: 'Meteorological service forecasts heavy rainfall in Ashanti region. Prepare drainage.',
    date: '2026-06-08', category: 'weather', region: 'Ashanti',
  },
  {
    id: 'ce11', title: 'Cashew Nut Harvest', description: 'Cashew harvesting period begins. Mature nuts collected from orchard floors.',
    date: '2026-02-01', endDate: '2026-04-30', category: 'harvest', commodity: 'Cashew Nuts', region: 'Coastal', allDay: true,
  },
  {
    id: 'ce12', title: 'Palm Oil Processing Season', description: 'Peak palm fruit harvesting and processing period for crude palm oil production.',
    date: '2026-01-15', endDate: '2026-04-30', category: 'harvest', commodity: 'Palm Oil', region: 'Western', allDay: true,
  },
  {
    id: 'ce13', title: 'Cassava Planting', description: 'Optimal cassava planting period. Drought-resistant varieties recommended for northern zones.',
    date: '2026-04-01', endDate: '2026-06-30', category: 'planting', commodity: 'Cassava', region: 'Northern', allDay: true,
  },
  {
    id: 'ce14', title: 'Quality Inspection Visit', description: 'Commodity quality inspection by Ghana Standards Authority at warehouse.',
    date: '2026-06-22', category: 'maintenance', region: 'Kumasi',
  },
  {
    id: 'ce15', title: 'Trade Expo — Accra', description: 'Annual agricultural trade expo featuring exporters, buyers, and service providers.',
    date: '2026-07-10', endDate: '2026-07-12', category: 'market', region: 'Accra', allDay: true,
  },
  {
    id: 'ce16', title: 'Contract Signing: Input Supply', description: 'Signing of Q3 input supply contract with certified suppliers.',
    date: '2026-06-28', category: 'meeting', region: 'Accra',
  },
]
