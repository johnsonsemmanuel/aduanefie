import { Star, ShieldCheck, MapPin, Award, Package, TrendingUp, Truck } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Chip, GradeChip } from '@/components/ui/Chip'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { currentUser } from '@/data/mock'

const stats = [
  { label: 'Total Trades', value: '47', icon: TrendingUp, color: 'text-success' },
  { label: 'Active Listings', value: '6', icon: Package, color: 'text-commodity-inputs' },
  { label: 'Logistics Used', value: '23', icon: Truck, color: 'text-warning' },
  { label: 'Rating', value: '4.8', icon: Star, color: 'text-warning' },
]

export function Profile() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-bold text-text-primary truncate">{currentUser.name}</h2>
              {currentUser.verified && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                {currentUser.rating}
              </span>
              <Chip variant="success" size="sm">Verified Trader</Chip>
            </div>
            <p className="text-xs text-text-secondary">
              Member since January 2023 · Farmer and agricultural commodity trader specializing in cocoa and shea butter.
            </p>
          </div>
          <Button size="sm" variant="secondary">Edit Profile</Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stats.map((stat) => (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color.replace('text', 'bg')}/10`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">{stat.label}</p>
                <p className="text-sm font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Input label="Full Name" defaultValue={currentUser.name} />
            <Input label="Email" defaultValue="emmanuel.johnson@aduanefie.com" />
            <Input label="Phone" defaultValue="+233 50 123 4567" />
            <Select
              label="Account Type"
              value={currentUser.type}
              options={[
                { value: 'farmer', label: 'Farmer' },
                { value: 'aggregator', label: 'Aggregator' },
                { value: 'processor', label: 'Processor' },
                { value: 'exporter', label: 'Exporter' },
                { value: 'buyer', label: 'Buyer' },
                { value: 'supplier', label: 'Supplier' },
              ]}
            />
            <Button fullWidth>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commodities</CardTitle>
            <Button variant="ghost" size="sm">Manage</Button>
          </CardHeader>
          <div className="space-y-2">
            {['Premium Cocoa Beans', 'Shea Butter (Unrefined)', 'Cashew Nuts'].map((c) => (
              <div key={c} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-surface-hover">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">{c}</span>
                </div>
                <GradeChip grade="Premium" />
              </div>
            ))}
            <Button size="sm" fullWidth variant="secondary" className="mt-2">
              + Add Commodity
            </Button>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification & Certifications</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {['Fair Trade Certified', 'Organic Producer', 'GLOBALG.A.P.', 'ISO 22000', 'Rainforest Alliance'].map((cert) => (
            <Chip key={cert} variant="success" icon={<Award className="w-3 h-3" />}>
              {cert}
            </Chip>
          ))}
        </div>
      </Card>
    </div>
  )
}
