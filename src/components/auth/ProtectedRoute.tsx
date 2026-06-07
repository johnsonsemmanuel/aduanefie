import { Navigate, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { hasAccess, type OSModuleId } from '@/config/permissions'

const pathToModule: Record<string, OSModuleId> = {
  '/dashboard': 'dashboard',
  '/marketplace': 'trade-engine',
  '/trade-desk': 'trade-engine',
  '/market-intel': 'market-intel',
  '/business': 'business',
  '/procurement': 'procurement',
  '/logistics': 'logistics',
  '/finance': 'finance',
  '/exports': 'export',
  '/cooperative': 'cooperative',
  '/ai': 'ai',
  '/developer': 'developer',
  '/admin': 'admin',
  '/messages': 'messaging',
  '/calendar': 'calendar',
  '/profile': 'profile',
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    const currentPath = location.pathname + location.search
    const redirect = searchParams.get('redirect') || currentPath
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }

  const requiredModule = pathToModule[location.pathname]
  if (requiredModule && user && !hasAccess(user.role, requiredModule)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
