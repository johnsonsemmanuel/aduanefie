import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [searchParams] = useSearchParams()

  if (!isAuthenticated) {
    const currentPath = window.location.pathname
    const redirect = searchParams.get('redirect') || currentPath
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />
  }

  return <>{children}</>
}
