import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Command } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  if (isAuthenticated) {
    const redirect = searchParams.get('redirect') || '/dashboard'
    return <Navigate to={redirect} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Enter your email address'); return }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const user = login(email.trim())
    setIsLoading(false)
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard'
      navigate(redirect, { replace: true })
    } else {
      setError('No account found with this email. Try one of the demo accounts below.')
    }
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      {/* Simple header */}
      <div className="border-b border-border">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Command className="w-4 h-4 text-cream" />
          </div>
          <span className="text-sm font-bold text-text-primary">AgriOS</span>
          <span className="text-[10px] text-text-secondary font-medium uppercase tracking-wider ml-0.5">Aduanefie</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-lg font-bold text-text-primary mb-1">Welcome back</h1>
            <p className="text-xs text-text-secondary">Sign in to AgriOS to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-medium text-text-secondary uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="you@example.com"
                autoFocus
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:border-primary transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-danger/10 border border-danger/20 px-3.5 py-2.5 text-xs text-danger">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider text-center mb-3">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { email: 'emmanuel@aduanefie.com', label: 'Admin' },
                { email: 'kwame@asantefarms.com', label: 'Farmer' },
                { email: 'ama@serwaaagro.com', label: 'Buyer' },
                { email: 'yaw@mensahlogistics.com', label: 'Logistics' },
                { email: 'nana@oseicommodities.com', label: 'Supplier' },
                { email: 'esi@afriyieexports.com', label: 'Viewer' },
              ].map((d) => (
                <button
                  key={d.email}
                  onClick={() => { setEmail(d.email); setError('') }}
                  className={`text-left px-2.5 py-1.5 rounded-md border text-[10px] transition-colors ${
                    email === d.email
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-border bg-surface text-text-secondary hover:bg-surface-hover hover:border-border'
                  }`}
                >
                  <span className="font-mono block truncate">{d.email}</span>
                  <span className="font-medium">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-[10px] text-text-secondary hover:text-text-primary transition-colors">
              &larr; Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


