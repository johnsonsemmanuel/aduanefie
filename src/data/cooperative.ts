import type { Cooperative, CooperativeMember } from '@/types'

export const cooperatives: Cooperative[] = [
  { id: 'coop1', name: 'Boateng Farmers Cooperative', location: 'Ashanti Region, Ghana', memberCount: 124, totalProduce: 850, commodities: ['Cocoa', 'Maize', 'Cassava'], foundedDate: '2018-04-15', status: 'active' },
  { id: 'coop2', name: 'Volta Green Growers', location: 'Volta Region, Ghana', memberCount: 87, totalProduce: 420, commodities: ['Palm Oil', 'Cassava', 'Vegetables'], foundedDate: '2019-08-01', status: 'active' },
  { id: 'coop3', name: 'Northern United Farmers', location: 'Northern Region, Ghana', memberCount: 203, totalProduce: 1200, commodities: ['Maize', 'Soya', 'Rice', 'Shea'], foundedDate: '2016-01-20', status: 'active' },
  { id: 'coop4', name: 'Central Region Organic Co-op', location: 'Central Region, Ghana', memberCount: 56, totalProduce: 280, commodities: ['Pineapple', 'Coconut', 'Citrus'], foundedDate: '2020-06-10', status: 'active' },
  { id: 'coop5', name: 'Eastern Highlands Cooperative', location: 'Eastern Region, Ghana', memberCount: 92, totalProduce: 510, commodities: ['Coffee', 'Cocoa', 'Plantain'], foundedDate: '2017-11-05', status: 'inactive' },
]

export const cooperativeMembers: CooperativeMember[] = [
  { id: 'm1', name: 'Kofi Boateng', role: 'chairman', joinedDate: '2018-04-15', contribution: 15000, produceVolume: 45 },
  { id: 'm2', name: 'Akua Mensah', role: 'secretary', joinedDate: '2018-04-15', contribution: 8000, produceVolume: 28 },
  { id: 'm3', name: 'Yaw Asare', role: 'treasurer', joinedDate: '2018-06-01', contribution: 10000, produceVolume: 35 },
  { id: 'm4', name: 'Esi Owusu', role: 'member', joinedDate: '2019-01-15', contribution: 3000, produceVolume: 18 },
  { id: 'm5', name: 'Kwame Nyarko', role: 'member', joinedDate: '2019-03-20', contribution: 2500, produceVolume: 15 },
  { id: 'm6', name: 'Adwoa Sarpong', role: 'member', joinedDate: '2020-07-01', contribution: 4000, produceVolume: 22 },
  { id: 'm7', name: 'Nana Akuffo', role: 'member', joinedDate: '2021-02-10', contribution: 1500, produceVolume: 10 },
  { id: 'm8', name: 'Mawuli Dogbe', role: 'member', joinedDate: '2021-09-05', contribution: 2000, produceVolume: 12 },
]
