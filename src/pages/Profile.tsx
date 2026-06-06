import { Button } from '@/components/ui/Button'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { Star, ShieldCheck, MapPin, Package, TrendingUp, Truck, LogOut, Settings as SettingsIcon, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { PageShell, type PageTab } from '@/components/layout/PageShell'
import { Pill } from '@/components/ui/Pill'
import { Input, Select } from '@/components/ui/Input'
import { currentUser } from '@/data/mock'

const stats = [
  { label: 'Total Trades', value: '47', icon: TrendingUp, color: 'text-success' },
  { label: 'Active Listings', value: '6', icon: Package, color: 'text-commodity-inputs' },
  { label: 'Logistics Used', value: '23', icon: Truck, color: 'text-warning' },
  { label: 'Rating', value: '4.8', icon: Star, color: 'text-warning' },
]

export function Profile() {
  const loading = useSimulatedLoading(500)
  if (loading) return <div className="p-4"><PageSkeleton type="form" /></div>
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = user?.name || currentUser.name
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs: PageTab[] = [{ id: 'profile', icon: User, label: 'Profile' }]

  return (
    <PageShell tabs={tabs} activeTab="profile" onTabChange={() => {}}>
      <div className="space-y-4">
      <GlassCard>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-bold text-text-primary truncate">{displayName}</h2>
              {currentUser.verified && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {currentUser.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" /> {currentUser.rating}
              </span>
              <Pill variant="success">Verified Trader</Pill>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
                <SettingsIcon className="w-3 h-3" /> Settings
              </Button>
              <Button variant="danger" size="sm" onClick={handleLogout}>
                <LogOut className="w-3 h-3" /> Sign Out
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              Member since January 2023 · Farmer and agricultural commodity trader specializing in cocoa and shea butter.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            Edit Profile
          </Button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stats.map((stat) => (
          <GlassCard key={stat.label} padding="sm">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color.replace('text', 'bg')}/10`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] text-text-secondary">{stat.label}</p>
                <p className="text-sm font-bold">{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Personal Information</GlassCardTitle>
          </GlassCardHeader>
          <div className="space-y-3">
            <Input label="Full Name" defaultValue={currentUser.name} />
            <Input label="Email" defaultValue="emmanuel.johnson@aduanefie.com" />
            <Input label="Phone" defaultValue="+233 50 123 4567" />
            <Select
              label="Account Type"
              value={currentUser.type}
              options={[
                { value: 'farmer', label: 'Farmer' }, { value: 'aggregator', label: 'Aggregator' },
                { value: 'processor', label: 'Processor' }, { value: 'exporter', label: 'Exporter' },
                { value: 'buyer', label: 'Buyer' }, { value: 'supplier', label: 'Supplier' },
              ]}
            />
            <Button variant="primary" size="sm" fullWidth>
              Save Changes
            </Button>
          </div>
        </GlassCard>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Commodities</GlassCardTitle>
            <Button variant="secondary" size="sm">Manage</Button>
          </GlassCardHeader>
          <div className="space-y-2">
            {['Premium Cocoa Beans', 'Shea Butter (Unrefined)', 'Cashew Nuts'].map((c) => (
              <div key={c} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-surface-hover">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">{c}</span>
                </div>
                <Pill variant="premium">Premium</Pill>
              </div>
            ))}
            <Button variant="secondary" size="sm" fullWidth>
              + Add Commodity
            </Button>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Verification & Certifications</GlassCardTitle>
        </GlassCardHeader>
        <div className="flex flex-wrap gap-2">
          {['Fair Trade Certified', 'Organic Producer', 'GLOBALG.A.P.', 'ISO 22000', 'Rainforest Alliance'].map((cert) => (
            <Pill key={cert} variant="success">{cert}</Pill>
          ))}
        </div>
      </GlassCard>
      </div>
    </PageShell>
  )
}
