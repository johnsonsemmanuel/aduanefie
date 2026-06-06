import { useState } from 'react'
import {
  User, Shield, Bell, Palette, Smartphone, Save,
} from 'lucide-react'
import { GlassCard, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard'
import { useToast } from '@/context/ToastContext'
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading'
import { PageSkeleton } from '@/components/ui/PageSkeleton'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { PageShell, type PageTab } from '@/components/layout/PageShell'

const tabs: PageTab[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'preferences', label: 'Preferences', icon: Palette },
]

function InputRow({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <label className="text-xs text-text-secondary font-medium min-w-[120px]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 max-w-sm px-3 py-1.5 rounded-full border border-border bg-bg text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-neutral-500"
      />
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <p className="text-sm text-text-primary">{label}</p>
        {description && <p className="text-[11px] text-text-secondary">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

export function Settings() {
  const { addToast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const loading = useSimulatedLoading(400)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState('john.son@aduanefie.com')
  const [phone, setPhone] = useState('+233 50 123 4567')
  const [location, setLocation] = useState('Accra, Ghana')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('30')

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [tradeAlerts, setTradeAlerts] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const [theme, setTheme] = useState('dark')
  const [currency, setCurrency] = useState('USD')
  const [weightUnit, setWeightUnit] = useState('tonne')

  if (loading) return <div className="p-4"><PageSkeleton type="form" /></div>

  const handleSave = (section: string) => {
    addToast(`${section} settings saved successfully`, 'success')
  }

  return (
    <PageShell tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-4 min-w-0">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Settings</h1>
            <p className="text-xs text-text-secondary">Manage your account, security, and preferences</p>
          </div>

      {/* Account */}
      {activeTab === 'account' && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Personal Information</GlassCardTitle>
          </GlassCardHeader>
          <div className="divide-y divide-border">
            <InputRow label="Full Name" value={name} onChange={setName} />
            <InputRow label="Email" value={email} onChange={setEmail} type="email" />
            <InputRow label="Phone" value={phone} onChange={setPhone} />
            <InputRow label="Location" value={location} onChange={setLocation} />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => handleSave('Account')} variant="primary" size="sm">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Password</GlassCardTitle>
            </GlassCardHeader>
            <div className="space-y-3">
              <InputRow label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="Enter current password" />
              <InputRow label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="Enter new password" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleSave('Password')} variant="primary" size="sm">
                <Save className="w-3.5 h-3.5" /> Update Password
              </Button>
            </div>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Two-Factor Authentication</GlassCardTitle>
            </GlassCardHeader>
            <ToggleRow
              label="Enable 2FA"
              description="Add an extra layer of security to your account"
              checked={twoFactor}
              onChange={setTwoFactor}
            />
            <div className="mt-2 flex justify-end">
              <Button onClick={() => handleSave('Security')} variant="primary" size="sm">
                <Save className="w-3.5 h-3.5" /> Save
              </Button>
            </div>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Session</GlassCardTitle>
            </GlassCardHeader>
            <div className="divide-y divide-border">
              <InputRow label="Session Timeout" value={sessionTimeout} onChange={setSessionTimeout} placeholder="Minutes" />
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-text-secondary">
              <Smartphone className="w-3.5 h-3.5" />
              Active sessions: 2 · Last login: 2 hours ago
            </div>
          </GlassCard>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Notification Preferences</GlassCardTitle>
          </GlassCardHeader>
          <SectionDivider title="Channels" />
          <ToggleRow label="Email Notifications" description="Receive updates via email" checked={emailNotifs} onChange={setEmailNotifs} />
          <ToggleRow label="Push Notifications" description="Receive push notifications in browser" checked={pushNotifs} onChange={setPushNotifs} />
          <SectionDivider title="Alerts" />
          <ToggleRow label="Trade Alerts" description="Order updates, trade confirmations, negotiations" checked={tradeAlerts} onChange={setTradeAlerts} />
          <ToggleRow label="Price Alerts" description="Price movements, target prices, market changes" checked={priceAlerts} onChange={setPriceAlerts} />
          <ToggleRow label="Marketing & Updates" description="Product updates, tips, promotions" checked={marketingEmails} onChange={setMarketingEmails} />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => handleSave('Notification')} variant="primary" size="sm">
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Preferences */}
      {activeTab === 'preferences' && (
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Application Preferences</GlassCardTitle>
          </GlassCardHeader>
          <SectionDivider title="Display" />
          <div className="flex items-center justify-between gap-4 py-2.5">
            <label className="text-xs text-text-secondary font-medium min-w-[120px]">Theme</label>
            <div className="flex gap-1">
              {['dark', 'light', 'system'].map(t => (
                <Button
                  key={t}
                  onClick={() => setTheme(t)}
                  variant={theme === t ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
          <SectionDivider title="Regional" />
          <div className="flex items-center justify-between gap-4 py-2.5">
            <label className="text-xs text-text-secondary font-medium min-w-[120px]">Currency</label>
            <div className="flex gap-1">
              {['USD', 'EUR', 'GHS', 'NGN', 'KES'].map(c => (
                <Button
                  key={c}
                  onClick={() => setCurrency(c)}
                  variant={currency === c ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <label className="text-xs text-text-secondary font-medium min-w-[120px]">Weight Unit</label>
            <div className="flex gap-1">
              {['tonne', 'kg', 'lb'].map(u => (
                <Button
                  key={u}
                  onClick={() => setWeightUnit(u)}
                  variant={weightUnit === u ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => handleSave('Preferences')} variant="primary" size="sm">
              <Save className="w-3.5 h-3.5" /> Save Preferences
            </Button>
          </div>
        </GlassCard>
      )}
    </div>
    </PageShell>
  )
}
