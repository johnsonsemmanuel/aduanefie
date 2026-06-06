import type { Vendor, RFQ, PurchaseOrder, Contract } from '@/types'

export const vendors: Vendor[] = [
  { id: 'v1', name: 'AgriSupply Ghana Ltd', contactPerson: 'John Anane', email: 'john@agrisupplygh.com', phone: '+233 50 111 2233', category: 'Inputs', rating: 4.5, totalOrders: 28, status: 'active', location: 'Accra, Ghana', joinedDate: '2024-03-15', commodities: ['Fertilizer', 'Seeds', 'Pesticides'] },
  { id: 'v2', name: 'FreshPro Logistics', contactPerson: 'Martha Ofori', email: 'martha@freshprolog.com', phone: '+233 54 222 3344', category: 'Logistics', rating: 4.2, totalOrders: 15, status: 'active', location: 'Kumasi, Ghana', joinedDate: '2024-06-01', commodities: ['Transport', 'Cold Storage'] },
  { id: 'v3', name: 'FarmEquip Solutions', contactPerson: 'Kwasi Boadi', email: 'kwasi@farmeduips.com', phone: '+233 20 333 4455', category: 'Equipment', rating: 3.8, totalOrders: 9, status: 'active', location: 'Takoradi, Ghana', joinedDate: '2024-08-20', commodities: ['Tractors', 'Irrigation', 'Harvesters'] },
  { id: 'v4', name: 'GreenTech Agro Ltd', contactPerson: 'Adwoa Sarpong', email: 'adwoa@greentechagro.com', phone: '+233 55 444 5566', category: 'Services', rating: 4.7, totalOrders: 6, status: 'pending', location: 'Accra, Ghana', joinedDate: '2026-01-10', commodities: ['Farm Advisory', 'Soil Testing'] },
  { id: 'v5', name: 'Packaging Pro West Africa', contactPerson: 'Nana Akwasi', email: 'nana@packagingprowa.com', phone: '+233 24 555 6677', category: 'Packaging', rating: 4.0, totalOrders: 12, status: 'active', location: 'Tema, Ghana', joinedDate: '2024-05-01', commodities: ['Bags', 'Crates', 'Labels'] },
  { id: 'v6', name: 'Quality Chemicals Ltd', contactPerson: 'Esi Abena', email: 'esi@qualitychemltd.com', phone: '+233 50 666 7788', category: 'Inputs', rating: 3.5, totalOrders: 4, status: 'inactive', location: 'Kumasi, Ghana', joinedDate: '2024-10-15', commodities: ['Herbicides', 'Fungicides'] },
]

export const rfqs: RFQ[] = [
  { id: 'r1', title: 'Fertilizer Supply - Q3 2026', description: '200 tonnes of NPK 15-15-15 for maize farmers in Ashanti Region', status: 'open', issueDate: '2026-06-01', closeDate: '2026-06-30', responses: 4, budget: 85000, category: 'Inputs' },
  { id: 'r2', title: 'Cold Storage Rental - Tema Port', description: '500 pallet spaces for cocoa bean storage, 3-month contract', status: 'open', issueDate: '2026-06-03', closeDate: '2026-07-15', responses: 2, budget: 45000, category: 'Logistics' },
  { id: 'r3', title: 'Tractor Lease (x3) - Harvest Season', description: 'Three tractors with operators for October-December harvest', status: 'under_review', issueDate: '2026-05-15', closeDate: '2026-06-10', responses: 3, budget: 72000, category: 'Equipment' },
  { id: 'r4', title: 'Custom Packaging for Export', description: '10,000 export-grade cocoa bags with branding', status: 'draft', issueDate: '2026-06-05', closeDate: '2026-07-01', responses: 0, budget: 12000, category: 'Packaging' },
  { id: 'r5', title: 'Soil Testing Services - 500 Farms', description: 'Comprehensive soil analysis for 500 smallholder farms across 4 regions', status: 'awarded', issueDate: '2026-04-01', closeDate: '2026-05-01', responses: 2, budget: 25000, category: 'Services' },
]

export const purchaseOrders: PurchaseOrder[] = [
  { id: 'po1', poNumber: 'PO-2026-001', vendor: 'AgriSupply Ghana Ltd', commodity: 'NPK 15-15-15 Fertilizer', quantity: 80, unit: 'tonnes', total: 34000, status: 'confirmed', orderDate: '2026-05-20', deliveryDate: '2026-06-15' },
  { id: 'po2', poNumber: 'PO-2026-002', vendor: 'Packaging Pro West Africa', commodity: 'Export Cocoa Bags (60kg)', quantity: 5000, unit: 'bags', total: 8500, status: 'delivered', orderDate: '2026-05-10', deliveryDate: '2026-05-28' },
  { id: 'po3', poNumber: 'PO-2026-003', vendor: 'FreshPro Logistics', commodity: 'Cold Storage - Cocoa Beans', quantity: 1, unit: 'contract', total: 12000, status: 'in_transit', orderDate: '2026-06-01', deliveryDate: '2026-06-10' },
  { id: 'po4', poNumber: 'PO-2026-004', vendor: 'FarmEquip Solutions', commodity: 'Tractor Lease - Harvest', quantity: 3, unit: 'units', total: 24000, status: 'draft', orderDate: '2026-06-05', deliveryDate: '2026-09-01' },
  { id: 'po5', poNumber: 'PO-2026-005', vendor: 'AgriSupply Ghana Ltd', commodity: 'Maize Seeds (Hybrid)', quantity: 500, unit: 'kg', total: 4500, status: 'sent', orderDate: '2026-06-02', deliveryDate: '2026-06-18' },
]

export const contracts: Contract[] = [
  { id: 'c1', title: 'Annual Fertilizer Supply Agreement', vendor: 'AgriSupply Ghana Ltd', value: 340000, startDate: '2026-01-01', endDate: '2026-12-31', status: 'active' },
  { id: 'c2', title: 'Packaging & Labeling Contract', vendor: 'Packaging Pro West Africa', value: 85000, startDate: '2026-03-01', endDate: '2026-08-31', status: 'active' },
  { id: 'c3', title: 'Cold Storage Facility Rental', vendor: 'FreshPro Logistics', value: 48000, startDate: '2025-09-01', endDate: '2026-08-31', status: 'active' },
  { id: 'c4', title: 'Equipment Maintenance Contract', vendor: 'FarmEquip Solutions', value: 24000, startDate: '2025-06-01', endDate: '2026-05-31', status: 'completed' },
]
